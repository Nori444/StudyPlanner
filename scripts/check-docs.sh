#!/usr/bin/env bash
# Перевірка документації (ЛБ7, урок 4): плейсхолдери й зламані відносні посилання у .md.
# Запуск з кореня репозиторію: bash scripts/check-docs.sh   (код завершення 1, якщо щось знайдено)
set -uo pipefail
fail=0
echo "1) Плейсхолдери ([ЗАПОВНИТИ], [ТЕКСТ], [ДОДАТИ…]) у документах:"
if git grep -nIE '\[(ЗАПОВНИТИ|ТЕКСТ|ДОДАТИ)[^]]*\]' -- '*.md' ':!docs/defect-log.md' ':!docs/lb7/*' ':!docs/test-report.md'; then fail=1; else echo "   не знайдено"; fi
echo "2) Відносні посилання у .md, що ведуть у нікуди:"
python3 - <<'PY' || fail=1
import os, re, subprocess, sys
files = subprocess.run(["git", "ls-files", "*.md"], capture_output=True, text=True).stdout.split()
bad = []
for f in files:
    base = os.path.dirname(f)
    for m in re.finditer(r'\]\(([^)#\s]+)(?:#[^)]*)?\)', open(f, encoding="utf-8").read()):
        u = m.group(1)
        if re.match(r'^[a-z]+:', u): continue
        if not os.path.exists(os.path.normpath(os.path.join(base, u))): bad.append(f + " → " + u)
print("\n".join("   " + b for b in bad) if bad else "   не знайдено")
sys.exit(1 if bad else 0)
PY
[ "$fail" -eq 0 ] && echo "РЕЗУЛЬТАТ: документація узгоджена" || echo "РЕЗУЛЬТАТ: є зауваження — виправте до подання"
exit "$fail"
