# Builds the stdio directory stub in glama-mcp/ for directories that introspect
# servers (Glama). The real server is remote: https://makemancer.com/api/mcp
FROM node:22-slim
WORKDIR /app/glama-mcp
COPY glama-mcp/package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY glama-mcp/server.mjs ./
CMD ["node", "server.mjs"]
