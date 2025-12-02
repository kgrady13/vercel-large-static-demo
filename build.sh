#!/bin/bash
set -e

echo "📦 Extracting archive..."
tar -xzf docs.tar.gz 2>/dev/null || tar -xzf docs.tar.gz

echo "📁 Moving to public/"
mv docs public

echo "✅ Done! $(find public -type f | wc -l | tr -d ' ') files ready"
