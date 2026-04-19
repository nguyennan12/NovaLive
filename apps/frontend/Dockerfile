FROM node:20-alpine AS base
WORKDIR /app

# Install workspace dependencies once for all stages.
COPY package.json yarn.lock ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/backend/package.json apps/backend/package.json
RUN yarn install --frozen-lockfile

FROM base AS development
COPY . .
WORKDIR /app/apps/frontend
EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "5173"]

FROM base AS build-stage
COPY . .
WORKDIR /app/apps/frontend
RUN yarn build

FROM nginx:stable-alpine AS production
COPY --from=build-stage /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]