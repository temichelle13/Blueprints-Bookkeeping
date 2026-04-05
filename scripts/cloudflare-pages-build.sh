#!/usr/bin/env bash
set -euo pipefail

corepack enable
corepack prepare pnpm@10.13.1 --activate

pnpm --version
node --version

pnpm install --frozen-lockfile
pnpm --filter @workspace/website run build
