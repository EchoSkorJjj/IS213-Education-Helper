# Use an official Node.js runtime as a parent image
FROM node:slim

# Set the working directory in the container to /app
WORKDIR /app

# Copying all the files in our project
COPY . .

# Installing dependencies
# RUN apt update && apt install curl -y
# RUN npm install

# Starting our application
CMD [ "npm", "run", "dev" ]