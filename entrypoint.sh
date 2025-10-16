#!/usr/bin/env bash
set -euo pipefail

_term() {
  echo "Caught SIGTERM, stopping..."
  kill -TERM "${OLLAMA_PID:-0}" 2>/dev/null || true
  kill -TERM "${API_PID:-0}"    2>/dev/null || true
  kill -TERM "${CADDY_PID:-0}"  2>/dev/null || true
}
trap _term SIGTERM

echo "Starting Ollama..."
/usr/local/bin/ollama serve &
OLLAMA_PID=$!

echo "Starting Node API on :${API_PORT}..."
export PORT="${API_PORT}"
export OLLAMA_HOST="${OLLAMA_HOST}"
cd /app/llm_backend
node server.js &
API_PID=$!

echo "Starting Caddy on :${PORT}..."
caddy run --config /etc/caddy/Caddyfile &
CADDY_PID=$!

wait -n $OLLAMA_PID $API_PID $CADDY_PID
exit $?