from flask import Blueprint, jsonify, request, send_from_directory
from models import db, User, Score, Purchase
from sqlalchemy import func, and_
from datetime import datetime, timedelta, date
import os

admin_bp = Blueprint('admin', __name__, static_folder='../admin_static')

# Protección simple: API Key en header
ADMIN_API_KEY = os.environ.get('ADMIN_API_KEY', 'letrix-dev-admin-2024')

def check_admin_auth():
    key = request.headers.get('X-Admin-Key', '')
    if key != ADMIN_API_KEY:
        return False
    return True

@admin_bp.before_request
def require_admin():
    if request.endpoint == 'admin.serve_admin':
        return None  # La página HTML se sirve sin auth (el JS enviará el header)
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

# ==================== ENDPOINTS JSON ====================

@admin_bp.route('/api/dashboard', methods=['GET'])
def dashboard():
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=7)
    
    # Totales
    total_users = User.query.count()
    total_migrated = User.query.filter(User.completed_levels != None).count()
    
    # Activos
    dau = User.query.filter(User.last_login >= today_start).count()
    wau = User.query.filter(User.last_login >= week_start).count()
    
    # Gemas en circulación
    gems_total = db.session.query(func.sum(User.gems)).scalar() or 0
    gems_avg = db.session.query(func.avg(User.gems)).scalar() or 0
    
    # Retención básica (usuarios que jugaron hoy y también ayer)
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    today_str = date.today().isoformat()
    
    retained = db.session.query(User).filter(
        User.streak_count >= 2,
        User.streak_last_played == date.today()
    ).count()
    
    retention_rate = round((retained / max(dau, 1)) * 100, 1)
    
    # Monetización
    purchases_total = Purchase.query.filter(Purchase.status == 'completed', Purchase.amount_paid > 0).count()
    revenue_total = db.session.query(func.sum(Purchase.amount_paid)).filter(
        Purchase.status == 'completed'
    ).scalar() or 0
    revenue_usd = round(revenue_total / 100, 2)
    
    # Conversion rate
    paying_users = db.session.query(Purchase.user_id).distinct().count()
    conversion_rate = round((paying_users / max(total_users, 1)) * 100, 2)
    
    # Niveles completados hoy
    levels_today = Score.query.filter(
        Score.mode == 'campaign',
        func.date(Score.created_at) == date.today()
    ).count()
    
    return jsonify({
        "totals": {
            "users": total_users,
            "migrated": total_migrated,
            "dau": dau,
            "wau": wau,
            "retention_rate": retention_rate
        },
        "economy": {
            "gems_total": int(gems_total),
            "gems_avg": round(float(gems_avg), 1),
            "purchases_count": purchases_total,
            "revenue_usd": revenue_usd,
            "paying_users": paying_users,
            "conversion_rate": conversion_rate
        },
        "activity": {
            "levels_completed_today": levels_today,
            "avg_best_blitz": round(float(db.session.query(func.avg(User.best_blitz_score)).scalar() or 0), 0)
        }
    }), 200

@admin_bp.route('/api/users', methods=['GET'])
def list_users():
    page = max(1, int(request.args.get('page', 1)))
    per_page = min(100, int(request.args.get('per_page', 50)))
    search = request.args.get('search', '').strip()
    
    query = User.query.order_by(User.created_at.desc())
    if search:
        query = query.filter(
            db.or_(
                User.email.ilike(f'%{search}%'),
                User.display_name.ilike(f'%{search}%')
            )
        )
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    users = [{
        "id": u.id,
        "email": u.email,
        "name": u.display_name,
        "country": u.country,
        "gems": u.gems,
        "lives": u.lives,
        "levels": len(u.completed_levels or []),
        "streak": u.streak_count,
        "blitz_best": u.best_blitz_score,
        "is_pro": u.is_pro,
        "created": u.created_at.isoformat() if u.created_at else None,
        "last_login": u.last_login.isoformat() if u.last_login else None
    } for u in pagination.items]
    
    return jsonify({
        "users": users,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page
    }), 200

@admin_bp.route('/api/users/<int:user_id>', methods=['GET'])
def get_user_detail(user_id):
    user = User.query.get_or_404(user_id)
    scores = Score.query.filter_by(user_id=user_id).order_by(Score.created_at.desc()).limit(20).all()
    purchases = Purchase.query.filter_by(user_id=user_id).order_by(Purchase.created_at.desc()).all()
    
    return jsonify({
        "user": user.to_dict(),
        "recent_scores": [s.to_dict() for s in scores],
        "purchases": [{
            "id": p.id,
            "item": p.item_type,
            "amount": p.amount_paid,
            "status": p.status,
            "date": p.created_at.isoformat()
        } for p in purchases]
    }), 200

@admin_bp.route('/api/users/<int:user_id>/adjust', methods=['POST'])
def adjust_user(user_id):
    """Endpoint de soporte: ajustar gemas o vidas de un usuario."""
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'gems' in data:
        user.gems = max(0, int(data['gems']))
    if 'lives' in data:
        user.lives = max(0, min(5, int(data['lives'])))
    if 'is_pro' in data:
        user.is_pro = bool(data['is_pro'])
    if 'ban' in data:
        # Soft delete / ban simple
        user.gems = 0
        user.is_pro = False
    
    db.session.commit()
    return jsonify({"status": "updated", "user": user.to_dict()}), 200

@admin_bp.route('/api/leaderboard/audit', methods=['GET'])
def audit_leaderboard():
    """Detecta scores sospechosos (cheat detection básico)."""
    # Scores Blitz imposiblemente altos para poco tiempo
    suspicious = Score.query.filter(
        Score.mode == 'blitz',
        Score.score > 50000,
        Score.time_seconds < 60
    ).order_by(Score.score.desc()).limit(50).all()
    
    return jsonify({
        "suspicious_count": len(suspicious),
        "flagged": [s.to_dict() for s in suspicious]
    }), 200

@admin_bp.route('/api/daily/override', methods=['POST'])
def override_daily():
    """Permite cambiar las palabras del Daily Challenge (para emergencias)."""
    data = request.get_json()
    words = data.get('words', [])
    if not words or len(words) > 10:
        return jsonify({"error": "Provide 1-10 words"}), 400
    
    # Guardar en tabla de configuración o Redis (simplificado aquí con un archivo/env)
    # En producción usar Redis o tabla Settings
    import json
    with open('/tmp/letrix_daily_override.json', 'w') as f:
        json.dump({
            "words": words,
            "set_by": "admin",
            "timestamp": datetime.utcnow().isoformat()
        }, f)
    
    return jsonify({"status": "daily_override_set", "words": words}), 200

# ==================== SERVIR EL HTML DEL PANEL ====================

@admin_bp.route('/', methods=['GET'])
def serve_admin():
    return '''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Letrix Admin Panel</title>
    <style>
        :root {
            --bg: #0f172a;
            --surface: #1e1b4b;
            --surface-light: #312e81;
            --text: #f8fafc;
            --text-muted: #94a3b8;
            --primary: #6366f1;
            --accent: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --gold: #fbbf24;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
        }
        .admin-container { max-width: 1400px; margin: 0 auto; padding: 24px; }
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--surface-light);
        }
        .admin-title { font-size: 28px; font-weight: 900; }
        .admin-badge { background: var(--danger); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
        }
        .metric-card {
            background: var(--surface);
            border-radius: 16px;
            padding: 20px;
            border: 1px solid var(--surface-light);
        }
        .metric-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .metric-value { font-size: 32px; font-weight: 800; }
        .metric-change { font-size: 13px; color: var(--accent); margin-top: 4px; }
        .metric-change.negative { color: var(--danger); }
        
        .section { background: var(--surface); border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid var(--surface-light); }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .section-title { font-size: 18px; font-weight: 700; }
        
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th { text-align: left; padding: 12px; color: var(--text-muted); font-weight: 600; border-bottom: 1px solid var(--surface-light); }
        td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .badge-pro { background: linear-gradient(135deg, var(--gold), #f59e0b); color: #000; }
        .badge-normal { background: var(--surface-light); color: var(--text); }
        
        .search-bar {
            width: 100%;
            max-width: 400px;
            padding: 10px 16px;
            border-radius: 10px;
            border: 1px solid var(--surface-light);
            background: var(--bg);
            color: var(--text);
            font-size: 14px;
            outline: none;
        }
        .search-bar:focus { border-color: var(--primary); }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
        }
        .btn-primary { background: var(--primary); color: white; }
        .btn-danger { background: var(--danger); color: white; }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        
        .pagination { display: flex; gap: 8px; justify-content: center; margin-top: 20px; }
        .page-btn {
            padding: 8px 14px;
            background: var(--surface-light);
            border: none;
            color: var(--text);
            border-radius: 8px;
            cursor: pointer;
        }
        .page-btn.active { background: var(--primary); }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .chart-container { height: 200px; margin: 20px 0; position: relative; }
        .login-screen {
            position: fixed; inset: 0; background: var(--bg);
            display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .login-box { background: var(--surface); padding: 40px; border-radius: 16px; width: 100%; max-width: 400px; }
        .login-box h2 { margin-bottom: 20px; }
        .login-box input {
            width: 100%; padding: 12px; margin-bottom: 12px;
            border-radius: 10px; border: 1px solid var(--surface-light);
            background: var(--bg); color: var(--text); font-size: 15px;
        }
        .hidden { display: none !important; }
        
        .user-detail-modal {
            position: fixed; inset: 0; background: rgba(0,0,0,0.8);
            display: none; align-items: center; justify-content: center;
            z-index: 2000; padding: 20px;
        }
        .user-detail-modal.active { display: flex; }
        .user-detail-content {
            background: var(--surface); border-radius: 16px;
            padding: 24px; max-width: 600px; width: 100%;
            max-height: 90vh; overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="login-screen" id="login-screen">
        <div class="login-box">
            <h2>🔐 Letrix Admin</h2>
            <input type="password" id="admin-key" placeholder="Admin API Key">
            <button class="btn btn-primary" style="width:100%; padding:12px;" onclick="doLogin()">Acceder</button>
            <p style="color:var(--text-muted); font-size:12px; margin-top:12px;">La clave está en la variable ADMIN_API_KEY del servidor.</p>
        </div>
    </div>

    <div class="admin-container hidden" id="app">
        <div class="admin-header">
            <div>
                <div class="admin-title">Letrix Admin</div>
                <div style="color:var(--text-muted); font-size:13px; margin-top:4px;">Panel de control en tiempo real</div>
            </div>
            <div class="admin-badge">LIVE</div>
        </div>

        <div class="metrics-grid" id="metrics">
            <div class="metric-card">
                <div class="metric-label">Total Usuarios</div>
                <div class="metric-value" id="m-total-users">-</div>
                <div class="metric-change" id="m-dau">DAU: -</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Retención Día 2+</div>
                <div class="metric-value" id="m-retention">-%</div>
                <div class="metric-change">Streak activos</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Ingresos Totales</div>
                <div class="metric-value" id="m-revenue">$0</div>
                <div class="metric-change" id="m-conversion">Conv: -%</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Gemas en Circulación</div>
                <div class="metric-value" id="m-gems">0</div>
                <div class="metric-change" id="m-gems-avg">Avg: 0</div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <div class="section-title">👥 Usuarios</div>
                <input type="text" class="search-bar" placeholder="Buscar por email o nombre..." onkeyup="searchUsers(this.value)">
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>País</th>
                        <th>Niveles</th>
                        <th>Gemas</th>
                        <th>Streak</th>
                        <th>Blitz</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="users-table"></tbody>
            </table>
            <div class="pagination" id="pagination"></div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <div class="section-title">🚨 Cheat Detection</div>
                <button class="btn btn-primary btn-sm" onclick="loadAudit()">Recargar</button>
            </div>
            <div id="audit-content" style="color:var(--text-muted); font-size:14px;">Clic en Recargar para ver scores sospechosos.</div>
        </div>
    </div>

    <div class="user-detail-modal" id="user-modal">
        <div class="user-detail-content">
            <div class="section-header">
                <div class="section-title" id="ud-title">Detalle de Usuario</div>
                <button class="btn btn-danger btn-sm" onclick="closeUserDetail()">✕</button>
            </div>
            <div id="user-detail-body"></div>
        </div>
    </div>

    <script>
        const API_BASE = window.location.origin; // Se sirve desde el mismo dominio
        let currentPage = 1;
        let adminKey = localStorage.getItem('letrix_admin_key') || '';

        function doLogin() {
            adminKey = document.getElementById('admin-key').value.trim();
            if (!adminKey) return;
            
            // Test auth con un fetch simple
            fetch(`${API_BASE}/api/admin/api/dashboard`, {
                headers: { 'X-Admin-Key': adminKey }
            })
            .then(r => {
                if (r.ok) {
                    localStorage.setItem('letrix_admin_key', adminKey);
                    document.getElementById('login-screen').classList.add('hidden');
                    document.getElementById('app').classList.remove('hidden');
                    loadDashboard();
                    loadUsers();
                } else {
                    alert('Clave incorrecta');
                }
            });
        }

        async function api(endpoint) {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                headers: { 'X-Admin-Key': adminKey }
            });
            if (res.status === 401) {
                localStorage.removeItem('letrix_admin_key');
                location.reload();
            }
            return res.json();
        }

        async function loadDashboard() {
            const data = await api('/api/admin/api/dashboard');
            document.getElementById('m-total-users').textContent = data.totals.users.toLocaleString();
            document.getElementById('m-dau').textContent = `DAU: ${data.totals.dau} | WAU: ${data.totals.wau}`;
            document.getElementById('m-retention').textContent = data.totals.retention_rate + '%';
            document.getElementById('m-revenue').textContent = '$' + data.economy.revenue_usd;
            document.getElementById('m-conversion').textContent = `Conv: ${data.economy.conversion_rate}% | ${data.economy.paying_users} pagadores`;
            document.getElementById('m-gems').textContent = data.economy.gems_total.toLocaleString();
            document.getElementById('m-gems-avg').textContent = `Promedio: ${data.economy.gems_avg}`;
        }

        async function loadUsers(page = 1, search = '') {
            currentPage = page;
            const url = `/api/admin/api/users?page=${page}&per_page=20&search=${encodeURIComponent(search)}`;
            const data = await api(url);
            
            const tbody = document.getElementById('users-table');
            tbody.innerHTML = data.users.map(u => `
                <tr>
                    <td>#${u.id}</td>
                    <td>
                        <div style="font-weight:700">${u.name}</div>
                        <div style="font-size:12px;color:var(--text-muted)">${u.email}</div>
                    </td>
                    <td>${u.country}</td>
                    <td>${u.levels}/20</td>
                    <td>${u.gems.toLocaleString()}</td>
                    <td>${u.streak}🔥</td>
                    <td>${u.blitz_best.toLocaleString()}</td>
                    <td><span class="badge ${u.is_pro ? 'badge-pro' : 'badge-normal'}">${u.is_pro ? 'PRO' : 'Free'}</span></td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="viewUser(${u.id})">Ver</button>
                    </td>
                </tr>
            `).join('');
            
            renderPagination(data.total, data.pages, page);
        }

        function renderPagination(total, pages, current) {
            let html = '';
            for (let i = 1; i <= pages; i++) {
                if (i === 1 || i === pages || (i >= current - 1 && i <= current + 1)) {
                    html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="loadUsers(${i})">${i}</button>`;
                } else if (i === current - 2 || i === current + 2) {
                    html += `<span style="color:var(--text-muted)">...</span>`;
                }
            }
            document.getElementById('pagination').innerHTML = html;
        }

        function searchUsers(q) {
            loadUsers(1, q);
        }

        async function viewUser(id) {
            const data = await api(`/api/admin/api/users/${id}`);
            const u = data.user;
            
            document.getElementById('ud-title').textContent = `#${u.id} ${u.display_name}`;
            document.getElementById('user-detail-body').innerHTML = `
                <div style="display:grid; gap:12px; margin-bottom:20px;">
                    <div style="display:flex; justify-content:space-between; padding:10px; background:var(--bg); border-radius:8px;">
                        <span>Email</span>
                        <span style="font-weight:700">${u.email}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; padding:10px; background:var(--bg); border-radius:8px;">
                        <span>Gemas</span>
                        <span style="font-weight:700; color:var(--gold)">${u.gems}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; padding:10px; background:var(--bg); border-radius:8px;">
                        <span>Vidas</span>
                        <span style="font-weight:700">${u.lives}/5</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; padding:10px; background:var(--bg); border-radius:8px;">
                        <span>Niveles completados</span>
                        <span style="font-weight:700">${u.completed_levels?.length || 0}/20</span>
                    </div>
                </div>
                <h4 style="margin-bottom:10px;">Compras</h4>
                ${data.purchases.length ? data.purchases.map(p => `
                    <div style="font-size:13px; padding:8px; background:var(--bg); border-radius:6px; margin-bottom:6px;">
                        ${p.item} - $${(p.amount/100).toFixed(2)} - ${p.status}
                    </div>
                `).join('') : '<p style="color:var(--text-muted); font-size:13px;">Sin compras</p>'}
            `;
            
            document.getElementById('user-modal').classList.add('active');
        }

        function closeUserDetail() {
            document.getElementById('user-modal').classList.remove('active');
        }

        async function loadAudit() {
            const data = await api('/api/admin/api/leaderboard/audit');
            const div = document.getElementById('audit-content');
            if (!data.flagged.length) {
                div.innerHTML = '<span style="color:var(--accent)">✅ No se detectaron scores anómalos</span>';
                return;
            }
            div.innerHTML = `
                <p style="margin-bottom:10px;">${data.suspicious_count} scores marcados:</p>
                ${data.flagged.map(f => `
                    <div style="padding:8px; background:var(--bg); border-radius:6px; margin-bottom:6px; font-size:13px;">
                        User #${f.user_id} | ${f.score} pts en ${f.time_seconds}s | ${f.mode}
                    </div>
                `).join('')}
            `;
        }

        // Auto-login si hay key guardada
        if (adminKey) {
            doLogin();
        }
    </script>
</body>
</html>'''