FROM node:alpine as build
WORKDIR /app
COPY . .
ENV npm_config_cache /app/.npm
RUN npm ci --silent
RUN npm run build

# Needed for OKD reasons
RUN chown -R node:root /app
RUN chmod -R 775 /app
USER node

EXPOSE 8080
CMD npm run dev
