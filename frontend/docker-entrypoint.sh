#!/bin/sh
set -e

: "${PORT:=80}"
: "${BACKEND_URL:=http://backend:8080}"

export PORT BACKEND_URL

envsubst '${PORT} ${BACKEND_URL}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
