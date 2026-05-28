# Scenix — 3D Interactive Video Platform

## Qué hace esta app
Los creadores suben videos. La IA detecta las escenas distintas del video y convierte cada una en una escena 3D navegable. Los visitantes pueden **caminar libremente** dentro de cada escena (primera persona, WASD) y los objetos tienen hotspots de compra que se activan por proximidad.

## Stack
- Next.js 15 (App Router) + TypeScript + Tailwind
- React Three Fiber + Drei (visor 3D)
- Supabase (PostgreSQL + Auth)
- Cloudflare R2 (storage de videos y escenas 3D)
- World Labs API (imagen → escena 3D)
- Google Gemini 2.0 Flash (segmentación de escenas + detección de objetos)

## Rama de trabajo
**SIEMPRE trabaja directamente en `main`.**

## Comandos
- `npm run dev` — servidor local en localhost:3000
- `npm run build` — build de producción
- `npm run lint` — linting

## Archivos críticos
- `app/api/segment/route.ts` — Gemini detecta escenas del video
- `app/api/generate-scene/route.ts` — World Labs genera la escena 3D
- `components/SceneViewer.tsx` — visor 3D con movimiento libre + límites
- `components/Hotspot.tsx` — hotspot que se activa por proximidad
- `lib/worldlabs.ts` — cliente World Labs API
- `lib/supabase.ts` — cliente Supabase

## Reglas de UI
- Home: solo barra de búsqueda centrada + video de fondo demostrativo (auto-play, muted)
- Video player: full-screen, botones 2D overlay, panel comentarios semi-transparente derecha
- Visor 3D: PointerLock + WASD para caminar, límite de radio (muro invisible en bordes)
- Hotspots: se activan al entrar en radio de 1.5m del objeto (proximidad, no click)
- Mobile: NO implementar en MVP — solo desktop

## Schema DB (Supabase)
Ver `/supabase/schema.sql`
