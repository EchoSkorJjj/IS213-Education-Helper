# FROM node:slim
# RUN apt update && apt install curl -y

# ENV NODE_ENV=development

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 50051

# CMD [ "npm", "run", "start" ]

FROM node:20.11.1-alpine3.19 AS build
WORKDIR /app
COPY package*.json ./
# --only allows the following: null, prod, and production
RUN npm ci
COPY . .
RUN npm run build
COPY protos ./dist/protos
COPY src/cert ./dist/src/cert

FROM node:20.11.1-alpine3.19
ENV NODE_ENV production
WORKDIR /app
COPY .env .env
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["node", "./dist/src/index.js"]

# FROM node:20.11.1-alpine3.19 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build
# COPY protos ./dist/protos

# FROM node:20.11.1-alpine3.19
# ENV NODE_ENV development
# WORKDIR /app
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/node_modules ./node_modules
# CMD ["node", "./dist/src/index.js"]