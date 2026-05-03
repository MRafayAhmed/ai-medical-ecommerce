# Stage 1: Build dependencies
FROM php:8.2-alpine AS builder

# Install system dependencies for composer
RUN apk add --no-cache git unzip

# Copy composer from the official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader

# Stage 2: Runtime
FROM dunglas/frankenphp:1.1-php8.2-alpine

# Install PHP extensions
RUN install-php-extensions \
    pdo_mysql \
    gd \
    intl \
    zip \
    opcache

WORKDIR /app

# Copy from builder
COPY --from=builder /app/vendor /app/vendor

# Copy application files
COPY . .

# Exclude frontend folder if it exists in root (handled by .dockerignore, but just in case)
# Ensure storage and bootstrap/cache are writable
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && chown -R www-data:www-data storage bootstrap/cache

# Configure FrankenPHP (Disabled worker mode for compatibility)
# ENV FRANKENPHP_CONFIG="worker ./public/index.php"

# Use production php.ini
RUN cp $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini

EXPOSE 80
EXPOSE 443
