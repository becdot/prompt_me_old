FROM node:8
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install --quiet

EXPOSE 3000
CMD ["npm", "start"]
