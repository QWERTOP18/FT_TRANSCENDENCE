#!/bin/bash
set -eux

npx prisma generate
npm run build 
npm run prisma:generate
npm run prisma:push

exec npm start
