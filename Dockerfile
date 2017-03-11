FROM mhart/alpine-node:7

ENV PORT 3000
EXPOSE $PORT

RUN mkdir -p /opt/bd4t
WORKDIR /opt/bd4t
COPY package.json .
RUN npm install --production

COPY server.js .
CMD ["node", "server.js"]

ARG APP_VERSION=unspecified
RUN echo "$APP_VERSION" > version.txt
