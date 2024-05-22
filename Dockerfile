# base
FROM node:22.2.0 AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# build stage

FROM base as builder

WORKDIR /usr/src/app

RUN npm run build


# production stage

FROM node:22.2.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

# COPY --from=builder /usr/src/app/swagger.yaml ./
COPY --from=builder /usr/src/app/dist ./

EXPOSE 8080

ENTRYPOINT ["node","./app.js"]