#!/usr/bin/env bash
# Upload the migrated product images from .tmp/migration/images/ to the
# scentance-images R2 bucket. Run once R2 is enabled on the account.
#
# Usage: scripts/upload-images.sh
set -euo pipefail

cd "$(dirname "$0")/.."

BUCKET="scentance-images"
SRC=".tmp/migration/images"

if [[ ! -d "$SRC" ]]; then
  echo "missing $SRC; re-fetch the images first" >&2
  exit 1
fi

uploaded=0
while IFS= read -r file; do
  key="${file#"$SRC"/}"
  case "$key" in
    *.jpg|*.jpeg|*.JPG|*.JPEG) mime="image/jpeg" ;;
    *.png|*.PNG)               mime="image/png" ;;
    *.webp|*.WEBP)             mime="image/webp" ;;
    *.avif|*.AVIF)             mime="image/avif" ;;
    *.gif|*.GIF)               mime="image/gif" ;;
    *)                         mime="application/octet-stream" ;;
  esac

  echo "→ $BUCKET/$key ($mime)"
  npx wrangler r2 object put "$BUCKET/$key" --file="$file" --content-type="$mime"
  uploaded=$((uploaded + 1))
done < <(find "$SRC" -type f | sort)

echo "uploaded $uploaded objects to $BUCKET"
