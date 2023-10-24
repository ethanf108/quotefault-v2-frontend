FROM node:alpine as build
WORKDIR /app
COPY . .
ENV npm_config_cache /app/.npm
RUN npm ci --silent
RUN npm run build

FROM nginxinc/nginx-unprivileged as serve
WORKDIR /app
COPY --from=build /app/dist /app/
COPY nginx.conf /etc/nginx
EXPOSE 8080