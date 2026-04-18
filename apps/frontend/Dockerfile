# Môi trường Development
FROM node:20-alpine AS development
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .


# Môi trường Production
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
WORKDIR /app/apps/frontend
RUN yarn build

# Môi trường Production (Chạy Web Server Nginx)
FROM nginx:stable-alpine AS production
COPY --from=build-stage /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]