# ---- Backend deps (production) ----
FROM node:20-slim AS be
WORKDIR /app/llm_backend
COPY llm_backend/package*.json ./
RUN npm ci --omit=dev
COPY llm_backend ./

# ---- Final runtime ----
FROM node:20-slim

# Utilities + Caddy
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl ca-certificates dumb-init gnupg \
  && curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/gpg.key \
     | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] \
     https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main" \
     > /etc/apt/sources.list.d/caddy-stable.list \
  && apt-get update && apt-get install -y --no-install-recommends caddy \
  && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# App files
WORKDIR /app
COPY --from=be /app/llm_backend /app/llm_backend
COPY frontend /app/frontend

# Config & entry
COPY Caddyfile /etc/caddy/Caddyfile
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Runtime env (Caddy listens on 8080, Node on 3000)
ENV PORT=8080 \
    API_PORT=3000 \
    OLLAMA_HOST=http://127.0.0.1:11434

# Persist Ollama models
VOLUME ["/root/.ollama"]

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=5 \
  CMD curl -fsS http://127.0.0.1:8080/healthz || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/entrypoint.sh"]
