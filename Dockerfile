FROM node:lts

WORKDIR /app

COPY package.json /app

RUN yarn

COPY . /app

RUN yarn build

CMD node .output/server/index.mjs