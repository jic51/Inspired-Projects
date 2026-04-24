# Letrix Backend

## Deploy en Railway (recomendado)

1. Crear proyecto en Railway
2. Add Postgres plugin
3. Variables de entorno (copiar de .env.example)
4. `railway up`

## Endpoints Principales

- POST `/api/auth/register` → Crear cuenta
- POST `/api/auth/login` → Login, retorna JWT
- GET  `/api/auth/me` → Perfil (requiere JWT)
- POST `/api/game/sync` → Sincronizar progreso
- POST `/api/game/score` → Enviar score
- GET  `/api/game/daily` → Seed del día (sin auth)
- POST `/api/game/consume-life` → Gastar vida
- GET  `/api/leaderboard/blitz` → Top global
- POST `/api/shop/create-checkout` → Stripe
- POST `/api/shop/webhook` → Stripe webhook