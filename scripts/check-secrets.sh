#!/usr/bin/env bash
# Базова перевірка секретів (ЛБ6, крок 7). Запуск з кореня репозиторію: bash scripts/check-secrets.sh
# Перевіряє: (1) файли .env у Git, (2) типові шаблони секретів у відстежуваних файлах і в усій історії.
# Код завершення 1, якщо щось знайдено. Це не повний аудит, а перевірка очевидних помилок.
set -uo pipefail
PATTERN='(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{30,}|xox[baprs]-[0-9A-Za-z-]{10,}|sk-[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(password|passwd|secret|api[_-]?key|token)[[:space:]]*[:=][[:space:]]*["'"'"'][^"'"'"' ]{6,})'
EXCLUDE=(':!package-lock.json' ':!*.png' ':!*.docx' ':!*.pptx' ':!scripts/check-secrets.sh')
fail=0
echo "1) Відстежувані файли .env:"
if git ls-files | grep -E '(^|/)\.env($|\.)' | grep -v '\.env\.example$'; then fail=1; else echo "   немає"; fi
echo "2) Шаблони секретів у відстежуваних файлах:"
if git grep -nIE "$PATTERN" -- . "${EXCLUDE[@]}"; then fail=1; else echo "   не знайдено"; fi
echo "3) Шаблони секретів в історії Git (усі гілки):"
if git log --all -p --no-color -- . "${EXCLUDE[@]}" | grep -nE "^\+.*($PATTERN)"; then fail=1; else echo "   не знайдено"; fi
echo "4) Файли .env в історії Git:"
if git log --all --name-only --format= | grep -E '(^|/)\.env($|\.)' | grep -v '\.env\.example$' | sort -u | grep .; then fail=1; else echo "   немає"; fi
[ "$fail" -eq 0 ] && echo "РЕЗУЛЬТАТ: секретів не виявлено" || echo "РЕЗУЛЬТАТ: знайдено підозрілі збіги — перевірте й відкличте секрети"
exit "$fail"
