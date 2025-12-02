# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.18.0
FROM node:${NODE_VERSION}-alpine

# WORKDIR /app
# updated workdir
WORKDIR /usr/src/app

# COPY ./package.json ./
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# CMD ["npm", "run", "start"]
CMD ["npm", "start"]