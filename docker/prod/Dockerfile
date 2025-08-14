FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . . 

RUN npm run build


FROM node:18-alpine as production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps --ignore-scripts

COPY --from=builder /app/dist ./

EXPOSE 7777

CMD [ "node", "src/server.js" ]
