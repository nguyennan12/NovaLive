# Stage 1: Base — all deps + build tools for native modules (bcrypt, etc.)
FROM node:20-alpine AS base
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json yarn.lock ./
COPY apps/backend/package.json apps/backend/package.json
RUN yarn install --frozen-lockfile

# Stage 2: Production deps — prod-only, vẫn cần build tools để compile native modules
FROM node:20-alpine AS production-deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json yarn.lock ./
COPY apps/backend/package.json apps/backend/package.json
RUN yarn install --frozen-lockfile --production

# Stage 3: Development (hot reload)
FROM base AS development
WORKDIR /app/apps/backend
CMD ["yarn", "dev"]

# Stage 4: Production — copy compiled node_modules, không cần build tools runtime
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=production-deps /app/node_modules ./node_modules
COPY apps/backend ./apps/backend
RUN chown -R node:node /app
WORKDIR /app/apps/backend
ENV NODE_ENV=pro
EXPOSE 3031
USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3031/ || exit 1
CMD ["node", "server.js"]
