# Stage 1: Base image
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Stage 2: Builder
FROM base AS builder

WORKDIR /app

# Copy root configuration files including the global lock file
COPY pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy package.json files for all workspaces
COPY packages/web/package.json ./packages/web/
COPY packages/database/package.json ./packages/database/
COPY packages/api/package.json ./packages/api/

# Install all dependencies using pnpm with the global lock file
RUN pnpm install --frozen-lockfile

# Copy source files
COPY packages/web ./packages/web
COPY packages/database ./packages/database
COPY packages/api ./packages/api

# Build the Nuxt application
WORKDIR /app/packages/web
ARG NUXT_PUBLIC_API_HOST_URL
ENV NUXT_PUBLIC_API_HOST_URL=${NUXT_PUBLIC_API_HOST_URL}
RUN pnpm run build

# Stage 3: Runner
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nuxtjs

# Copy the entire app directory, including all workspaces and node_modules
COPY --from=builder /app /app

# Set the correct permissions
RUN chown -R nuxtjs:nodejs /app

USER nuxtjs
EXPOSE 3000

# Command to run the application
CMD ["node", "/app/packages/web/.output/server/index.mjs"]