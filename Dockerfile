# syntax=docker/dockerfile:1
ARG NODE_VERSION
ARG SERVER_PORT

FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE ${SERVER_PORT}
CMD ["npm", "run", "prod"]