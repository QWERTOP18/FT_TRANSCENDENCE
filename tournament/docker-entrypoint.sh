#!/bin/bash
set -eux

npm run prisma:generate
npm run build 
npm run prisma:push

exec npm start
