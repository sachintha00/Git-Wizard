FROM node:20.11.0-alpine3.19

WORKDIR /usr/src/app

COPY ../package*.json ./

RUN npm install

COPY . .

CMD npm version $RELEASE_VERSION -m "Bump version to %s" && \
    echo "//registry.npmjs.org/:_authToken=${NPMJS_AUTHENTICATION_KEY}" > ~/.npmrc && \
    npm publish --access publish
