FROM node:16.13.1-alpine
RUN mkdir -p /memory-app/server
WORKDIR /memory-app/server

COPY package.json yarn.lock ./
RUN yarn install
COPY . .

EXPOSE 8080

CMD ["yarn", "server"]