#!/bin/bash

echo "Testing nginx configuration..."
docker run --rm -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro -v $(pwd)/nginx/conf.d:/etc/nginx/conf.d:ro nginx:alpine nginx -t

if [ $? -eq 0 ]; then
    echo "✅ nginx configuration is valid"
else
    echo "❌ nginx configuration has errors"
    exit 1
fi 
