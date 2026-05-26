# 📦 Guía de Migración — Un Repo por Proyecto

## ¿Por qué hay un problema ahora?

GitHub Pages solo permite **1 sitio web por repositorio** con **1 dominio personalizado**.

Cuando se configuró `cristinaveraabogada.com` en el repo `Inspired-Projects`, ese dominio "capturó" todas las URLs de GitHub Pages del repo:

- `jic51.github.io/Inspired-Projects/DentAcceptMVP/` → redirige a `cristinaveraabogada.com/DentAcceptMVP/` (no existe)
- `jic51.github.io/Inspired-Projects/ELDERS_QUORUM/` → redirige a `cristinaveraabogada.com/ELDERS_QUORUM/` (no existe)

**Solución**: Cada proyecto en su propio repositorio.

---

## Paso 1: Crear los repos en GitHub.com

Ve a **https://github.com/new** y crea estos 7 repositorios (uno por uno):

| Nombre del repo | Descripción |
|-----------------|-------------|
| `cristina-vera-abogada` | Sitio web de Cristina Vera Abogada |
| `dentaccept-mvp` | DentAccept - App dental |
| `elders-quorum` | Sitio Quórum de Élderes |
| `drawing-app` | App de dibujo con IA |
| `wordfinder` | Juego de palabras LexiSpin |
| `jose-castro-dev` | Portfolio José Castro |
| `guess-the-number` | Juego adivina el número |

**Configuración para cada uno:**
- ✅ Public (público)
- ❌ NO marques "Add a README file" (déjalo vacío)
- ❌ NO agregues .gitignore ni licencia

---

## Paso 2: Ejecutar el script de migración

Abre tu terminal, ve a la carpeta del monorepo y ejecuta:

```bash
cd ~/ruta/a/Inspired-Projects   # cambia por tu ruta real
bash migrate-to-separate-repos.sh
```

El script:
- ✅ Copia los archivos de cada proyecto
- ✅ Crea `index.html` si no existe (apuntando al archivo principal)
- ✅ Agrega el workflow de GitHub Actions para deploy automático
- ✅ Hace push a cada repo
- ✅ Mantiene el CNAME de cristinaveraabogada.com

---

## Paso 3: Activar GitHub Pages en cada repo

Para cada repo en GitHub.com:

1. Entra al repo → **Settings** → **Pages**
2. En "Source" selecciona **"GitHub Actions"**
3. El sitio se desplegará automáticamente en ~2 minutos

---

## Paso 4: Desconectar el repo antiguo de GitHub Pages

En el repo **`Inspired-Projects`** (el monorepo):

1. Ve a **Settings** → **Pages**
2. En "Custom domain" borra `cristinaveraabogada.com`
3. Guarda los cambios

Esto asegura que el dominio solo apunte al nuevo repo.

---

## URLs resultantes

| Proyecto | URL |
|----------|-----|
| Cristina Vera | `cristinaveraabogada.com` ✨ |
| DentAccept | `jic51.github.io/dentaccept-mvp` |
| Elders Quorum | `jic51.github.io/elders-quorum` |
| Drawing App | `jic51.github.io/drawing-app` |
| Wordfinder | `jic51.github.io/wordfinder` |
| José Castro | `jic51.github.io/jose-castro-dev` |
| Guess the Number | `jic51.github.io/guess-the-number` |

> 💡 Cuando tengas un dominio propio para algún proyecto, solo agrega el archivo CNAME al repo correspondiente y configura el DNS.

---

## ¿Qué pasa con el monorepo `Inspired-Projects`?

Se queda tal como está — sigue siendo tu "archivo central" de código. Solo se desconecta de GitHub Pages. Puedes seguir trabajando en él normalmente.
