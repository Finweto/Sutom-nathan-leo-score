FROM node:12.14.0 as base

WORKDIR /src
COPY package*.json /
EXPOSE 3000

RUN npm install
COPY . .
CMD ["node", "indexSutom.js"]