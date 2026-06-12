FROM node:26-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node","app.js"]