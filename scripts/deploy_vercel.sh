#!/usr/bin/env bash
set -euo pipefail

# deploy_vercel.sh
# Usage: export VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID then run ./scripts/deploy_vercel.sh

: "${VERCEL_TOKEN:?Need VERCEL_TOKEN}"
: "${VERCEL_PROJECT_ID:?Need VERCEL_PROJECT_ID}"
: "${VERCEL_ORG_ID:?Need VERCEL_ORG_ID}"

echo "Installing dependencies..."
npm ci

echo "Generating Prisma client..."
npx prisma generate

echo "Running migrations (ensure DATABASE_URL is set)..."
npx prisma migrate deploy

echo "Building Next.js app..."
npm run build

echo "Deploying to Vercel (prebuilt)..."
# Uses vercel CLI to deploy prebuilt output
npx vercel --token "$VERCEL_TOKEN" --confirm --prod

echo "Vercel deploy finished."
