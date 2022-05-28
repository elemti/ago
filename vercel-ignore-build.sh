#!/bin/bash

# https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel

headTag=$(git describe --exact-match HEAD)

echo "Commit hash: $(git rev-parse HEAD)"

if npx semver "$headTag"; then
  # Proceed with the build
  echo "Tag: $headTag"
  echo "✅ - Build can proceed"
  exit 1

else
  # Don't build
  echo "Latest commit is not tagged with a valid semver"
  echo "🛑 - Build cancelled"
  exit 0
fi
