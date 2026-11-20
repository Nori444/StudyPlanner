#!/usr/bin/env bash
# Відтворює commits одного PR у вашому клоні від ВАШОГО імені (git config user.name/email).
# Використання (з кореня клону StudyPlanner): bash lb6-git/apply.sh 1   # потім 2, 3, ... після злиття попереднього PR
set -euo pipefail
N="${1:?Вкажіть номер PR від 1 до 8}"
DIR="$(cd "$(dirname "$0")" && pwd)"
PR="$(ls -d "$DIR"/pr"$N"-* | head -n1)"
BRANCH="$(cat "$PR/BRANCH")"
git switch main
git pull --rebase origin main
git switch -c "$BRANCH"
for p in "$PR"/*.patch; do
  git apply --index "$p"
  git commit -q -F "${p%.patch}.msg"
  echo "commit: $(git log -1 --format=%s)"
done
git push -u origin "$BRANCH"
echo "Гілку $BRANCH опубліковано. Відкрийте pull request на GitHub (текст — у lb6-git/PR-descriptions.md)."
