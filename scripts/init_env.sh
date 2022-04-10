#!/bin/sh

set -e

cat <<EOT > /usr/share/nginx/html/config.js
window.__config = {
    baseUrl: '$APP_BASEURL'
}
EOT
