#!/usr/bin/env sh
set -e

npm run prisma:migrate:deploy
exec npm run start
