#!/bin/bash
# =============================================================================
# SCRIPT DE MIGRACIÓN — Inspired-Projects → Repos Separados
# =============================================================================
# Ejecuta esto desde la raíz del monorepo:
#   cd ~/ruta/a/Inspired-Projects
#   bash migrate-to-separate-repos.sh
#
# ANTES DE EJECUTAR: crea los repos vacíos en GitHub.com (ver instrucciones
# en MIGRACION-INSTRUCCIONES.md)
# =============================================================================

set -e  # Detener si hay algún error

GITHUB_USER="jic51"
MONOREPO_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMP_BASE="/tmp/migrate-repos"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Migración de Proyectos a GitHub     ${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Limpiar directorio temporal
rm -rf "$TEMP_BASE"
mkdir -p "$TEMP_BASE"

# =============================================================================
# Función principal para migrar un proyecto
# =============================================================================
migrate_project() {
    local SRC_DIR="$1"       # Carpeta origen en el monorepo
    local REPO_NAME="$2"     # Nombre del nuevo repo en GitHub
    local MAIN_FILE="$3"     # Archivo principal (se copia como index.html si no hay uno)
    local CNAME="$4"         # Dominio personalizado (dejar vacío si no tiene)
    local DESCRIPTION="$5"   # Descripción del proyecto

    echo -e "${YELLOW}📦 Migrando: $DESCRIPTION${NC}"
    echo "   Origen: $SRC_DIR"
    echo "   Repo:   https://github.com/$GITHUB_USER/$REPO_NAME"

    # Verificar que el directorio origen existe
    if [ ! -d "$MONOREPO_DIR/$SRC_DIR" ]; then
        echo -e "${RED}   ⚠️  Directorio no encontrado: $SRC_DIR — saltando...${NC}"
        return
    fi

    local DEST="$TEMP_BASE/$REPO_NAME"
    mkdir -p "$DEST"

    # Copiar todos los archivos del proyecto
    cp -r "$MONOREPO_DIR/$SRC_DIR/." "$DEST/"

    # Si se especifica un archivo principal y no hay index.html, crear uno
    if [ -n "$MAIN_FILE" ] && [ ! -f "$DEST/index.html" ]; then
        if [ -f "$DEST/$MAIN_FILE" ]; then
            cp "$DEST/$MAIN_FILE" "$DEST/index.html"
            echo "   ✓ Creado index.html desde $MAIN_FILE"
        fi
    fi

    # Si INDEX.HTML existe en mayúsculas pero no index.html, renombrar
    if [ -f "$DEST/INDEX.HTML" ] && [ ! -f "$DEST/index.html" ]; then
        cp "$DEST/INDEX.HTML" "$DEST/index.html"
        echo "   ✓ Renombrado INDEX.HTML → index.html"
    fi

    # Crear workflow de GitHub Pages
    mkdir -p "$DEST/.github/workflows"
    cat > "$DEST/.github/workflows/deploy.yml" << 'WORKFLOW_EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
WORKFLOW_EOF

    # Si tiene dominio personalizado, crear/actualizar CNAME
    if [ -n "$CNAME" ]; then
        echo "$CNAME" > "$DEST/CNAME"
        echo "   ✓ CNAME configurado: $CNAME"
    fi

    # Eliminar archivos que no deberían estar en el repo
    rm -f "$DEST/.DS_Store"
    find "$DEST" -name ".DS_Store" -delete 2>/dev/null || true

    # Inicializar git y hacer push
    cd "$DEST"
    git init
    git config user.email "joseisrael5101@gmail.com"
    git config user.name "jic51"
    git add -A
    git commit -m "Initial commit: migrated from Inspired-Projects monorepo"
    git branch -M main
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

    echo "   → Subiendo a GitHub..."
    if git push -u origin main 2>&1; then
        echo -e "${GREEN}   ✅ ¡Listo! https://github.com/$GITHUB_USER/$REPO_NAME${NC}"
    else
        echo -e "${RED}   ❌ Error al hacer push. ¿Creaste el repo vacío en GitHub?${NC}"
        echo "      Verifica: https://github.com/$GITHUB_USER/$REPO_NAME"
    fi

    cd "$MONOREPO_DIR"
    echo ""
}

# =============================================================================
# MIGRAR CADA PROYECTO
# =============================================================================

migrate_project \
    "Personal-site-project" \
    "cristina-vera-abogada" \
    "" \
    "cristinaveraabogada.com" \
    "Cristina Vera Abogada"

migrate_project \
    "DentAcceptMVP" \
    "dentaccept-mvp" \
    "" \
    "" \
    "DentAccept MVP"

migrate_project \
    "ELDERS_QUORUM" \
    "elders-quorum" \
    "INDEX.HTML" \
    "" \
    "Elders Quorum"

migrate_project \
    "Drawing_app_Gemini" \
    "drawing-app" \
    "sketchsend_definitivov9.html" \
    "" \
    "Drawing App (Gemini + Claude)"

migrate_project \
    "Wordfinder" \
    "wordfinder" \
    "lexispin3.html" \
    "" \
    "Wordfinder / LexiSpin"

migrate_project \
    "JOSECASTROWebDeveloper" \
    "jose-castro-dev" \
    "jose-castro-portfolio.html" \
    "" \
    "José Castro — Portfolio"

migrate_project \
    "Guess the number - Game" \
    "guess-the-number" \
    "game.html" \
    "" \
    "Guess the Number Game"

# =============================================================================
# RESUMEN FINAL
# =============================================================================
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  ✅ Migración completada             ${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""
echo "Próximos pasos para cada repo en GitHub.com:"
echo ""
echo "1. Ve a Settings → Pages de cada repo"
echo "2. En 'Source', selecciona 'GitHub Actions'"
echo "3. El workflow desplegará el sitio automáticamente"
echo ""
echo "URLs de GitHub Pages (disponibles ~2 min después):"
echo "  🌐 cristinaveraabogada.com     (cristina-vera-abogada)"
echo "  🌐 jic51.github.io/dentaccept-mvp"
echo "  🌐 jic51.github.io/elders-quorum"
echo "  🌐 jic51.github.io/drawing-app"
echo "  🌐 jic51.github.io/wordfinder"
echo "  🌐 jic51.github.io/jose-castro-dev"
echo "  🌐 jic51.github.io/guess-the-number"
echo ""
echo -e "${YELLOW}⚠️  Recuerda: también desconectar el repo Inspired-Projects${NC}"
echo "   de GitHub Pages para que cristinaveraabogada.com funcione"
echo "   solo desde el nuevo repo."
echo ""

# Limpiar temporales
rm -rf "$TEMP_BASE"
echo "🧹 Archivos temporales limpiados."
