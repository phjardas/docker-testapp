FROM mhart/alpine-node:7

ENV PORT 3000

RUN mkdir -p /opt/bd4t
WORKDIR /opt/bd4t
COPY package.json .
RUN npm install --production

COPY server.js .

EXPOSE $PORT
CMD ["node", "server.js"]
