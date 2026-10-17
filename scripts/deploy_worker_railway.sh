#!/usr/bin/env bash
set -euo pipefail

# deploy_worker_railway.sh
# Triggers a Railway deploy webhook. Set RAILWAY_DEPLOY_HOOK_URL as env var (stored in GitHub Secrets).
: "${RAILWAY_DEPLOY_HOOK_URL:?Need RAILWAY_DEPLOY_HOOK_URL}"

echo "Triggering Railway deploy..."
curl -sS -X POST "$RAILWAY_DEPLOY_HOOK_URL"

echo "Railway deploy triggered."
