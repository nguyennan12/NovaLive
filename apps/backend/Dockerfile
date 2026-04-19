FROM node:20-alpine AS base
RUN apk add --no-cache python3 make g++
WORKDIR /app

# Install dependencies in a cache-friendly layer.
COPY package.json yarn.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN yarn install --frozen-lockfile

FROM base AS development
ENV NODE_ENV=development
WORKDIR /app/apps/backend
EXPOSE 3031
CMD ["yarn", "dev"]

FROM base AS production
ENV NODE_ENV=production
COPY . .
WORKDIR /app/apps/backend
EXPOSE 3031
CMD ["yarn", "pro"]