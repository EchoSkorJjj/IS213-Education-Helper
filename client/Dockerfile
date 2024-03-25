# Use an official Node.js runtime as a parent image
FROM node:latest

# RUN apt update && apt install curl -y
# Set the working directory in the container to /app
WORKDIR /app

ENV NODE_ENV=development

# Copying package.json and package-lock.json first for better cache utilization
COPY package*.json ./

# Installing dependencies
# RUN npm install

# Copying the rest of the files in our project
COPY . .

# Starting our application
CMD [ "npm", "run", "dev" ]