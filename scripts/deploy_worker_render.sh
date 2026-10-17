#!/usr/bin/env bash
set -euo pipefail

# deploy_worker_render.sh
# Triggers a Render deploy webhook. Set RENDER_DEPLOY_HOOK_URL as env var (stored in GitHub Secrets).
: "${RENDER_DEPLOY_HOOK_URL:?Need RENDER_DEPLOY_HOOK_URL}"

echo "Triggering Render deploy..."
curl -sS -X POST "$RENDER_DEPLOY_HOOK_URL"

echo "Render deploy triggered."
