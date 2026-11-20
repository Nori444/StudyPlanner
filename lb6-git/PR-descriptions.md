# Тексти pull request (ЛБ6)

Порядок: `bash lb6-git/apply.sh N` → pull request на GitHub → злиття → `git switch main && git pull` → наступний N. Номери issues дефектів створює `scripts/create-defect-issues.sh` (DEF-01…06); вкажіть реальні номери в «Closes #».

## PR 1: тести ЛБ6 — `test/lb6-e2e-scenarios`
**Що змінено:** e2e-сценарії TC-14–TC-20, TC-25, TC-26 (`tests/e2e/lb6.js`). На v0.2.0 TC-14–18 дають Fail (дефекти DEF-01…05). **Перевірка:** `npm i --no-save playwright && node tests/e2e/lb6.js`. **Ризики:** e2e не входить у CI.

## PR 2: DEF-01 — `fix/DEF-01-two-tabs-data-loss`
**Closes:** DEF-01 · TC-16 · SP-13, R8. **Причина:** запис застарілої копії списку. **Зміна:** читання свіжого стану перед записом; подія `storage`. **Перевірка:** дві вкладки, TC-16; `npm test`, smoke. **Ризик регресії:** TC-07, 09, 26.

## PR 3: DEF-02 — `fix/DEF-02-invalid-date-silently-dropped`
**Closes:** DEF-02 · TC-15. **Причина:** некоректна дата мовчки замінялась порожньою. **Зміна:** `validateDue()`, поле `#due-error`, тести. **Перевірка:** рік із 5 цифр → повідомлення.

## PR 4: DEF-03 — `fix/DEF-03-title-length-graphemes`
**Closes:** DEF-03 · TC-14. **Причина:** `String.length` у UTF-16. **Зміна:** `charLength()` (графеми). **Перевірка:** 60 емодзі приймається, 101 — ні.

## PR 5: DEF-04 — `fix/DEF-04-counter-plural`
**Closes:** DEF-04 · TC-18 · SP-12. **Зміна:** `taskCountLabel()`. **Перевірка:** 1 / 2 / 5 / 11 / 21 / 22.

## PR 6: DEF-05 — `fix/DEF-05-storage-schema-rules`
**Closes:** DEF-05 · TC-17. **Зміна:** адаптер перевіряє правила Task Service; `tasks.js` підключено перед `storage.js`. **Перевірка:** підроблені дані в localStorage → банер.

## PR 7: перевірка секретів — `chore/lb6-security-check`
**Зміна:** `scripts/check-secrets.sh`, знімок екрана при першій помилці в e2e. **Перевірка:** `bash scripts/check-secrets.sh` → «секретів не виявлено».

## PR 8: документи й реліз — `docs/lb6-test-docs-and-release`
**Зміна:** тест-план, результати TC-01…26, журнал дефектів, звіт, release notes v0.1.0, докази, версія 0.1.0, `release.sh`, CI-перевірка секретів. **Після злиття:** `bash scripts/release.sh` (тег `v0.1.0` + GitHub Release).
