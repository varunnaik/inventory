FROM node:10.17.0-slim

COPY . /app
WORKDIR /app

RUN npm install && \
    npm run build

CMD bash -lc "node ./build/src/index.js"