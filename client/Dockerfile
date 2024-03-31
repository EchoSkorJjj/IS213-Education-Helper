# # Use an official Node.js runtime as a parent image
# FROM node:slim

# # Set the working directory in the container to /app
# WORKDIR /app

# # Copying all the files in our project
# COPY . .

# # Installing dependencies
# # RUN apt update && apt install curl -y
# # RUN npm install

# # Starting our application
# CMD [ "npm", "run", "dev" ]

FROM node:latest as builder
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY certs/frontend.crt /etc/nginx/ssl/frontend.crt
COPY certs/frontend.key /etc/nginx/ssl/frontend.key

CMD ["nginx", "-g", "daemon off;"]