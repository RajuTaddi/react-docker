# FROM node:13.12.0-alpine as build
# WORKDIR /app
# COPY ./build .

FROM nginx:stable-alpine
COPY ./build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]