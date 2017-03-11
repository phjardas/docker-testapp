FROM mhart/alpine-node:7
RUN apk add --no-cache curl

ENV PORT 3000
EXPOSE $PORT

HEALTHCHECK --interval=5s --timeout=5s \
	CMD curl -fsS http://localhost:${PORT}/ || exit 1

RUN mkdir -p /opt/bd4t
WORKDIR /opt/bd4t
COPY package.json .
RUN npm install --production

COPY server.js .
CMD ["node", "server.js"]

ARG APP_VERSION=unspecified
RUN echo "$APP_VERSION" > version.txt
