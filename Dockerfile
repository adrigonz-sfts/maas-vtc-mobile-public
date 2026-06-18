FROM nginx:1.29-alpine3.23 AS runtime
RUN apk upgrade --no-cache
COPY dist /usr/share/nginx/html
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY scripts/render-runtime-config.sh /docker-entrypoint.d/40-render-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-render-runtime-config.sh
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
