ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine

RUN mkdir -p /usr/app
COPY . /usr/app/
WORKDIR /usr/app
RUN npm config set registry https://registry.npmjs.org/
RUN npm ci --verbose
RUN npm run build

ENV NODE_ENV="production"

RUN npm ci --omit=dev --verbose
RUN chown -R node:node /usr/app
USER node

CMD npm start
