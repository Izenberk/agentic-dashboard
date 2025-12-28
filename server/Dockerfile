# Stage 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy package files from root (for workspaces)
COPY package.json bun.lock* ./
COPY packages ./packages
COPY server/package.json ./server/

WORKDIR /app/server

# Install dependencies
RUN bun install

# Copy server source
COPY server/src ./src

# Stage 2: Production
FROM oven/bun:1-slim AS production
WORKDIR /app

# Copy from builder
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/src ./src
COPY --from=builder /app/server/package.json ./

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]