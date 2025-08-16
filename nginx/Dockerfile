FROM nginx:alpine

# OpenSSLをインストール
RUN apk add --no-cache openssl

# SSLディレクトリを作成
RUN mkdir -p /etc/nginx/ssl

# デフォルトのnginx設定をコピー
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/
COPY test-config.sh /usr/local/bin/test-config.sh
RUN chmod +x /usr/local/bin/test-config.sh

# Docker entrypointスクリプトをコピー
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 4430

ENTRYPOINT ["/docker-entrypoint.sh"] 
