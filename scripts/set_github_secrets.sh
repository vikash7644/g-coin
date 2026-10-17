#!/usr/bin/env bash
set -euo pipefail

# set_github_secrets.sh
# Requires GitHub CLI (gh) authenticated. Usage:
# export VERCEL_TOKEN=... VERCEL_PROJECT_ID=... VERCEL_ORG_ID=...
# ./scripts/set_github_secrets.sh

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required. Install from https://cli.github.com/"
  exit 1
fi

: "${VERCEL_TOKEN:?Please export VERCEL_TOKEN}"
: "${VERCEL_PROJECT_ID:?Please export VERCEL_PROJECT_ID}"
: "${VERCEL_ORG_ID:?Please export VERCEL_ORG_ID}"

REPO_GITHUB="${GITHUB_REPOSITORY:-vikash7644/g-coin}"

echo "Setting secrets on $REPO_GITHUB"

gh secret set VERCEL_TOKEN -R "$REPO_GITHUB" --body "$VERCEL_TOKEN"
gh secret set VERCEL_PROJECT_ID -R "$REPO_GITHUB" --body "$VERCEL_PROJECT_ID"
gh secret set VERCEL_ORG_ID -R "$REPO_GITHUB" --body "$VERCEL_ORG_ID"

echo "Secrets set. Remember to add DATABASE_URL, AUTH_SECRET and other production secrets in GitHub or Vercel."
