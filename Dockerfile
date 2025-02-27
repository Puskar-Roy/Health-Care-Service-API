FROM node:18-alpine


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install 

COPY . .


RUN npm install -g ts-node


EXPOSE 3000


CMD ["npm", "start"]

