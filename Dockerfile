# Môi trường Development
FROM node:20-alpine AS development
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
CMD ["yarn", "dev"]

# Môi trường Production
FROM node:20-alpine AS production
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY . .
EXPOSE 3031
CMD ["yarn", "pro"]