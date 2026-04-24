from flask import Blueprint, request, jsonify
from models import db, User, Purchase
from flask_jwt_extended import jwt_required, get_jwt_identity
import stripe

shop_bp = Blueprint('shop', __name__)

GEM_PACKAGES = {
    'gems_100': {'gems': 100, 'price_cents': 99},
    'gems_550': {'gems': 550, 'price_cents': 499},
    'gems_1200': {'gems': 1200, 'price_cents': 999},
    'pro_monthly': {'gems': 0, 'price_cents': 499, 'pro': True}
}

@shop_bp.route('/products', methods=['GET'])
def products():
    return jsonify({
        "products": [
            {"id": k, "name": k.replace('_', ' ').title(), **v}
            for k, v in GEM_PACKAGES.items()
        ]
    }), 200

@shop_bp.route('/create-checkout', methods=['POST'])
@jwt_required()
def create_checkout():
    """Crea sesión de Stripe Checkout (web). En app nativa se usa RevenueCat."""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    product_id = data.get('product_id')
    
    if product_id not in GEM_PACKAGES:
        return jsonify({"error": "Invalid product"}), 400
    
    product = GEM_PACKAGES[product_id]
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': product_id.replace('_', ' ').title()},
                    'unit_amount': product['price_cents'],
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='https://letrix.app/shop?success=1',
            cancel_url='https://letrix.app/shop?cancel=1',
            metadata={'user_id': user_id, 'product_id': product_id}
        )
        return jsonify({"checkout_url": session.url, "session_id": session.id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@shop_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, request.environ.get('STRIPE_WEBHOOK_SECRET', '')
        )
    except ValueError:
        return jsonify({"error": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError:
        return jsonify({"error": "Invalid signature"}), 400
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = int(session['metadata']['user_id'])
        product_id = session['metadata']['product_id']
        
        user = User.query.get(user_id)
        if user and product_id in GEM_PACKAGES:
            product = GEM_PACKAGES[product_id]
            
            # Idempotencia
            existing = Purchase.query.filter_by(stripe_payment_id=session['payment_intent']).first()
            if not existing:
                user.gems += product.get('gems', 0)
                if product.get('pro'):
                    from datetime import datetime, timedelta
                    user.is_pro = True
                    user.pro_expires_at = datetime.utcnow() + timedelta(days=30)
                
                purchase = Purchase(
                    user_id=user_id,
                    stripe_payment_id=session['payment_intent'],
                    item_type=product_id,
                    amount_paid=product['price_cents'],
                    status='completed'
                )
                db.session.add(purchase)
                db.session.commit()
    
    return jsonify({"status": "success"}), 200

@shop_bp.route('/gem-reward', methods=['POST'])
@jwt_required()
def gem_reward():
    """
    Endpoint para recompensar gemas por ver anuncios (Rewarded Ads).
    Validado server-side contra fraud.
    """
    user_id = int(get_jwt_identity())
    data = request.get_json()
    reason = data.get('reason', 'ad')
    
    # Anti-fraud: limitar recompensas por día
    from datetime import datetime, timedelta
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    count_today = Purchase.query.filter(
        Purchase.user_id == user_id,
        Purchase.item_type.like('ad_reward_%'),
        Purchase.created_at >= today_start
    ).count()
    
    if count_today >= 20:  # Max 20 ads/day
        return jsonify({"error": "Daily ad limit reached"}), 429
    
    user = User.query.get_or_404(user_id)
    REWARD = 5 if reason == 'share' else 1  # 1 vida = equivalencia en gemas
    
    if reason == 'share':
        user.gems += 5
    else:
        # Ad reward logic (en app nativa esto se verifica con AdMob/Unity)
        user.gems += 10
    
    # Log como purchase dummy para trackear
    purchase = Purchase(
        user_id=user_id,
        item_type=f"ad_reward_{reason}",
        amount_paid=0,
        status='completed'
    )
    db.session.add(purchase)
    db.session.commit()
    
    return jsonify({"gems": user.gems, "reason": reason}), 200