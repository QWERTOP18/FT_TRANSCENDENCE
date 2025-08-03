FROM nginx:alpine

# OpenSSLをインストール
RUN apk add --no-cache openssl

# SSLディレクトリを作成
RUN mkdir -p /etc/nginx/ssl

# SSL証明書を自動生成するスクリプトを作成
RUN cat > /docker-entrypoint.d/10-generate-ssl.sh << 'EOF'
#!/bin/sh
if [ ! -f /etc/nginx/ssl/certificate.pem ] || [ ! -f /etc/nginx/ssl/private-key.pem ]; then
  echo "Generating SSL certificate..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/private-key.pem \
    -out /etc/nginx/ssl/certificate.pem \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=FT_TRANSCENDENCE/OU=Development/CN=localhost"
  chmod 600 /etc/nginx/ssl/private-key.pem
  chmod 644 /etc/nginx/ssl/certificate.pem
  echo "SSL certificate generated successfully"
fi
EOF
RUN chmod +x /docker-entrypoint.d/10-generate-ssl.sh

# デフォルトのnginx設定をコピー
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/
COPY test-config.sh /usr/local/bin/test-config.sh
RUN chmod +x /usr/local/bin/test-config.sh

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"] 
