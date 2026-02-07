#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:${PORT:-3000}}"

curl -fsS "${BASE_URL}/health"
echo
