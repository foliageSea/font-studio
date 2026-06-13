#!/bin/bash
set -e

PACKAGE_FILE="package.json"

if [ ! -f "$PACKAGE_FILE" ]; then
  echo "Error: $PACKAGE_FILE not found"
  exit 1
fi

CURRENT_VERSION=$(grep -o '"version": "[^"]*"' "$PACKAGE_FILE" | head -1 | cut -d'"' -f4)

if [ -z "$CURRENT_VERSION" ]; then
  echo "Error: Could not read current version from $PACKAGE_FILE"
  exit 1
fi

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

BUMP=$1

case "$BUMP" in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
  *.*.*)
    MAJOR=$(echo "$BUMP" | cut -d'.' -f1)
    MINOR=$(echo "$BUMP" | cut -d'.' -f2)
    PATCH=$(echo "$BUMP" | cut -d'.' -f3)
    ;;
  *)
    echo "Usage: bash scripts/version.sh <major|minor|patch|x.y.z>"
    exit 1
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

echo "Version: $CURRENT_VERSION -> $NEW_VERSION"

sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" "$PACKAGE_FILE"

git add "$PACKAGE_FILE"
git commit -m "chore: release v$NEW_VERSION"
git tag "v$NEW_VERSION"

echo "Pushing to remote..."
git push origin HEAD
git push origin "v$NEW_VERSION"

echo "Done! v$NEW_VERSION released."
