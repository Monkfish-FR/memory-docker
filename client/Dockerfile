FROM node:16.13.1-alpine
RUN mkdir -p /memory-app/client
WORKDIR /memory-app/client

COPY package.json yarn.lock ./
RUN yarn install
COPY . .

EXPOSE 3000

CMD ["yarn", "start"]