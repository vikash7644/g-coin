#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
# env_prod_template.sh
# Copy-paste these into your host or Vercel environment variables

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
AUTH_SECRET="REPLACE_WITH_STRONG_RANDOM_SECRET"
REDIS_URL="redis://:PASSWORD@redis-host:6379"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
S3_BUCKET="your-gcoin-bucket"
SMTP_URL="smtp://USER:PASSWORD@smtp.provider.com:587"
NODE_ENV=production
NEXT_PUBLIC_APP_URL="https://your-app-domain"

# Optional deploy hooks
# RAILWAY_DEPLOY_HOOK_URL="https://railway.app/deploy/...."
# RENDER_DEPLOY_HOOK_URL="https://api.render.com/deploy/...."
EOF
