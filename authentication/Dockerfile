# Fetching the minified node image on apline linux
FROM node:slim
RUN apt update && apt install curl -y

# Declaring env
ENV NODE_ENV development
# Setting up the work directory
WORKDIR /app

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install


# Starting our application
CMD [ "npm", "run", "start" ]

EXPOSE 80