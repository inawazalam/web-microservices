FROM node:12 as build
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . /usr/src/app
RUN npm run build

FROM nginx:1.18.0-alpine
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
