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
COPY packages/api/package.json ./packages/api/
COPY packages/database/package.json ./packages/database/

# Install all dependencies using pnpm with the global lock file
RUN pnpm install --frozen-lockfile

# Copy source files
COPY packages/api ./packages/api
COPY packages/database ./packages/database

# Build the application
WORKDIR /app/packages/api
RUN pnpm run build

# Prune development dependencies
RUN pnpm prune --prod

# Stage 3: Runner
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 hono

# Copy built files and production dependencies
COPY --from=builder /app/packages/api/dist /app/dist
COPY --from=builder /app/packages/api/node_modules /app/node_modules
COPY --from=builder /app/packages/database /app/packages/database


USER hono
EXPOSE 3000

# Command to run the application
CMD ["node", "/app/dist/index.cjs"]