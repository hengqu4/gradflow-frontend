FROM node:18
RUN mkdir -p /usr/src
COPY . /usr/src
WORKDIR /usr/src
RUN npm i
EXPOSE 4000
CMD ["node","app.js"]
