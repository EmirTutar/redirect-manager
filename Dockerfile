
FROM node:alpine


WORKDIR /usr/src/app
COPY . .

RUN npm install express

ENV PORT=3000

CMD [ "node", "index.js" ]
