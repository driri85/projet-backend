FROM node:24-alpine

ENV HOME=/home/app

WORKDIR $HOME

COPY app-annonces/package*.json ./

RUN npm install -g nodemon && \
    npm install

EXPOSE 3000