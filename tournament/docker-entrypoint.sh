#!/bin/bash
set -eux

npm run build 
npm run prisma:generate
npm run prisma:push

exec npm start
