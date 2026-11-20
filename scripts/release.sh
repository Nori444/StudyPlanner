#!/usr/bin/env bash
# Створює тег v0.1.0 на перевіреному commit і GitHub Release. Запуск із кореня клону після злиття ВСІХ PR ЛБ6:
#   bash scripts/release.sh
set -euo pipefail
TAG=v0.1.0
git switch main && git pull --rebase origin main
[ -z "$(git status --porcelain)" ] || { echo "Робоче дерево не чисте"; exit 1; }
npm test
bash scripts/check-secrets.sh
git tag -a "$TAG" -m "StudyPlanner $TAG — перший навчальний реліз"
git push origin "$TAG"
gh release create "$TAG" --title "StudyPlanner $TAG" --notes-file docs/release-notes-v0.1.0.md
echo "Реліз $TAG опубліковано."
