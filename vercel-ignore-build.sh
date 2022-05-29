#!/bin/bash

# https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel

commitHash=$(git rev-parse HEAD)
echo "Commit hash: $commitHash"

# headTag=$(git describe --exact-match $commitHash)
# [[ -n $headTag ]] && echo "Tag: $headTag"

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_GIT_COMMIT_SHA: $VERCEL_GIT_COMMIT_SHA"
echo "VERCEL_GIT_COMMIT_MESSAGE: $VERCEL_GIT_COMMIT_MESSAGE"
echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_ENV" != "production" ]]; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1
fi

if npx semver "$VERCEL_GIT_COMMIT_MESSAGE"; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1
else
  # Don't build
  echo "Latest commit message is not valid semver"
  echo "🛑 - Build cancelled"
  exit 0
fi
