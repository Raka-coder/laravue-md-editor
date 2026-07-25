# Stage 1: Build — PHP + Node for full asset pipeline
FROM php:8.5-cli-alpine AS build

WORKDIR /app

RUN set -eux \
    && apk add --no-cache \
        curl \
        unzip \
        git \
        nodejs \
        npm \
    && rm -rf /var/cache/apk/*

COPY --from=docker.io/composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-interaction --no-progress --optimize-autoloader

RUN php artisan wayfinder:generate --with-form || echo "Wayfinder gen done"

RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

RUN npm ci --no-audit --no-fund \
    && npm run build

# Stage 2: Runtime — PHP-FPM + Nginx
FROM php:8.5-fpm-alpine

RUN set -eux \
    && apk add --no-cache \
        nginx \
        supervisor \
        bash \
        curl \
    && rm -rf /var/cache/apk/*

COPY docker/php.ini /usr/local/etc/php/conf.d/app.ini
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf

COPY --from=build --chown=www-data:www-data /app /var/www/html

WORKDIR /var/www/html

RUN set -eux \
    && mkdir -p /var/www/html/storage/framework/cache/data \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/log/supervisor \
    && chown -R www-data:www-data /var/www/html/storage \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache \
    && rm -rf /var/www/html/node_modules \
    && rm -rf /var/www/html/.git \
    && rm -rf /var/www/html/tests

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
