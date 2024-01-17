FROM node:20.11.0-alpine3.19

WORKDIR /usr/src/app

COPY ../package*.json ./

RUN npm install

COPY . .

# Bump version and publish
CMD npm version patch -m "Bump version to %s" && \
    echo "//registry.npmjs.org/:_authToken=${NPMJS_AUTHENTICATION_KEY}" > ~/.npmrc && \
    npm publish --access publish
