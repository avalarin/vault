FROM node:16 AS builder
WORKDIR /app

COPY package.json .
RUN npm install

COPY public ./public
COPY src ./src
COPY tsconfig.json .
RUN ls -l

RUN npm run build

FROM nginx:1.21.6
WORKDIR /usr/share/nginx/html

ENV APP_BASEURL='http://localhost'

COPY --from=builder /app/build .
COPY nginx/init_env.sh /docker-entrypoint.d/
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

RUN chmod +x /docker-entrypoint.d/init_env.sh
