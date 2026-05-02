# Stage 1: Base dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./
COPY apps/frontend/package.json apps/frontend/package.json
RUN yarn install --frozen-lockfile

# Stage 2: Development (hot reload)
FROM base AS development
WORKDIR /app/apps/frontend
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "5173"]

# Stage 3: Build
FROM base AS build
COPY . .
WORKDIR /app/apps/frontend
RUN yarn build

# Stage 4: Production — nginx serve static files
FROM nginx:stable-alpine AS production
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
