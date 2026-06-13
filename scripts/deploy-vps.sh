#!/usr/bin/env bash
# Build sur ta machine, envoie dist/ sur le VPS, redémarre PM2.
# Usage : npm run deploy:vps
#         VPS=ubuntu@TON_IP npm run deploy:vps

set -euo pipefail

VPS="${VPS:-ubuntu@37.59.107.194}"
REMOTE_DIR="${REMOTE_DIR:-~/suivi_objectifs}"

echo "→ Build local…"
npm run build

echo "→ Envoi dist/ vers ${VPS}:${REMOTE_DIR}/dist/"
rsync -avz --delete dist/ "${VPS}:${REMOTE_DIR}/dist/"

echo "→ Mise à jour code + PM2 sur le VPS…"
ssh "${VPS}" "cd ${REMOTE_DIR} && git pull && npm install && npm run pm2:reload && pm2 save"

echo "→ OK — http://37.59.107.194:3001 (ou ton IP)"
