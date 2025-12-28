# Stage 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy package files from root (for workspaces)
COPY package.json bun.lock* ./
COPY packages ./packages
COPY server/src ./server/src
COPY server/package.json ./server/
COPY client/package.json ./client/

WORKDIR /app/client

# Install dependencies
RUN bun install

# Copy client source
COPY client/src ./src
COPY client/index.html ./
COPY client/vite.config.ts ./
COPY client/tsconfig*.json ./
COPY client/tailwind.config.js ./
COPY client/postcss.config.js ./

# Build the app
RUN bun run build

# Stage 2: Production (Nginx)
FROM nginx:alpine AS production

# Copy built files to Nginx
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Nginx runs automatically
CMD ["nginx", "-g", "daemon off;"]