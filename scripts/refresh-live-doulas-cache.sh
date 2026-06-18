#!/bin/zsh

set -euo pipefail

ROOT_DIR="/Users/amorir/.openclaw/workspace-amorir/EOL-Planner"
LOG_DIR="/Users/amorir/.openclaw/workspace-amorir/logs"
ENV_FILE="${ROOT_DIR}/.env.cron"

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  source "${ENV_FILE}"
  set +a
fi

mkdir -p "${LOG_DIR}"

REFRESH_URL="${EOL_PLANNER_REFRESH_URL:-https://eol-planner.vercel.app/api/cron/refresh-doulas}"
AUTH_HEADER=()

if [[ -n "${CRON_SECRET:-}" ]]; then
  AUTH_HEADER=(-H "Authorization: Bearer ${CRON_SECRET}")
fi

TIMESTAMP="$(TZ=America/Puerto_Rico date '+%Y-%m-%d %H:%M:%S AST')"
RESPONSE="$(curl -fsS "${AUTH_HEADER[@]}" "${REFRESH_URL}")"

echo "[${TIMESTAMP}] ${RESPONSE}"
