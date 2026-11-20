#!/usr/bin/env bash
# Створює issues для дефектів ЛБ6 (потрібен gh і вхід: gh auth login). Запуск із кореня: bash scripts/create-defect-issues.sh
set -e
gh label create bug --color d73a4a 2>/dev/null || true
for s in critical major minor trivial; do gh label create "severity:$s" 2>/dev/null || true; done
mk(){ gh issue create --title "$1" --label "bug,severity:$2" --body "$3"; }
mk "DEF-01: Завдання зникають при роботі у двох вкладках" critical "Severity: Critical, Priority: High. TC-16. Деталі: docs/defect-log.md#def-01"
mk "DEF-02: Дата з 5-значним роком мовчки відкидається" major "Severity: Major, Priority: High. TC-15. docs/defect-log.md"
mk "DEF-03: Емодзі рахуються подвійно в обмеженні довжини назви" minor "Severity: Minor, Priority: Medium. TC-14. docs/defect-log.md"
mk "DEF-04: Лічильник «1 завдань»" minor "Severity: Minor, Priority: Medium. TC-18 (SP-12). docs/defect-log.md"
mk "DEF-05: Storage Adapter приймає записи, що порушують правила" minor "Severity: Minor, Priority: Low. TC-17. docs/defect-log.md"
mk "DEF-06: Плейсхолдери в README та рефлексії" trivial "Severity: Trivial, Priority: High (до подання). Додати посилання на GitHub Project і текст рефлексії."
