FROM node:slim
RUN apt update && apt install curl -y

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 50051

CMD [ "npm", "run", "start" ]