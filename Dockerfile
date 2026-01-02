ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine AS build
ENV NODE_ENV="development"

# Create app directory
RUN mkdir -p /usr/app
COPY --chown=node:node . /usr/app
RUN ls -la /usr/app
WORKDIR /usr/app

RUN npm config set registry https://registry.npmjs.org/

# Build the app
RUN npm ci --verbose
RUN npm ls
RUN npm run build

# Remove dev dependencies
ENV NODE_ENV="production"
RUN npm ci --verbose
RUN npm ls
RUN ls -la /usr/app


FROM node:${NODE_VERSION}-alpine AS prod
ENV NODE_ENV="production"

# Copy built assets from build stage
RUN mkdir -p /usr/app
RUN chown -R node:node /usr/app
COPY --chown=node:node --from=build /usr/app/dist /usr/app/dist
COPY --chown=node:node --from=build /usr/app/node_modules /usr/app/node_modules
USER node

WORKDIR /usr/app/dist
CMD ["node", "app.js"]
