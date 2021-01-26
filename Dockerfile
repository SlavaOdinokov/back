FROM node:14

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait

RUN chmod +x /wait && npm install --global nodemon

WORKDIR /usr/src/back

COPY package.json /usr/src/back

RUN npm install

ENV PORT=3001
ENV HOST=localhost
ENV MONGO_PORT=27017
ENV MONGO_HOST=mongodb
ENV DB_NAME=mevn

EXPOSE 3001

CMD /wait && npm run dev --watch /usr/src/back
