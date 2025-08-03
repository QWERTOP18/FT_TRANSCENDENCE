#!/bin/sh
set -e

# SSL証明書の自動生成
generate_ssl_certificate() {
    if [ ! -f /etc/nginx/ssl/certificate.pem ] || [ ! -f /etc/nginx/ssl/private-key.pem ]; then
        echo "Generating SSL certificate..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/nginx/ssl/private-key.pem \
            -out /etc/nginx/ssl/certificate.pem \
            -subj "/C=JP/ST=Tokyo/L=Tokyo/O=FT_TRANSCENDENCE/OU=Development/CN=localhost"
        chmod 600 /etc/nginx/ssl/private-key.pem
        chmod 644 /etc/nginx/ssl/certificate.pem
        echo "SSL certificate generated successfully"
    else
        echo "SSL certificate already exists"
    fi
}

# nginx設定のテスト
test_nginx_config() {
    echo "Testing nginx configuration..."
    nginx -t
    if [ $? -eq 0 ]; then
        echo "Nginx configuration is valid"
    else
        echo "Nginx configuration is invalid"
        exit 1
    fi
}

# メイン処理
main() {
    echo "Starting nginx setup..."
    
    # SSL証明書の生成
    generate_ssl_certificate
    
    # nginx設定のテスト
    test_nginx_config
    
    echo "Starting nginx..."
    exec nginx -g "daemon off;"
}

# スクリプト実行
main "$@" 
