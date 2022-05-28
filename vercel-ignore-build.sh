#!/bin/bash

# https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel

git fetch --tags

commitHash=$(git rev-parse HEAD)
echo "Commit hash: $commitHash"

headTag=$(git describe --exact-match $commitHash)
[[ -n $headTag ]] && echo "Tag: $headTag"

if npx semver "$headTag"; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1

else
  # Don't build
  echo "Latest commit is not tagged with a valid semver"
  echo "🛑 - Build cancelled"
  exit 0
fi
