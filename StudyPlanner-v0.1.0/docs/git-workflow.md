# Git-процес і code review

## Гілки й commits
- `main` завжди запускається; змін напряму в `main` немає.
- Гілка від актуальної `main`: `feature/SP-09-storage-adapter`, `fix/review-followups`, `docs/SP-14-run-instructions`.
- Commit — одна логічна зміна. Формат: `тип(область): що змінено (T-номер)`; типи: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.
- Перед commit: `git status`, `git diff --staged`; у зміні немає секретів, локальних налаштувань і зайвих файлів.

```bash
git switch main && git pull --rebase origin main
git switch -c feature/SP-11-title-validation
git add src tests && git commit -m "feat(validation): правило назви 1–100 символів (T10)"
git push -u origin feature/SP-11-title-validation
```

## Pull request
Шаблон `.github/pull_request_template.md`: задача, що змінено, як перевірити, доказ, ризики. Один PR — одна backlog-позиція. Приклад послідовності: SP-09 → SP-11 → SP-08 → SP-10 → виправлення за review → документація.

## Code review: критерії
1. Зміна відповідає issue та критеріям приймання (TC-xx).
2. Граничні випадки й помилки оброблено; правило перевіряється не лише у формі.
3. Безпека: дані виводяться через `textContent`, секретів немає.
4. Читабельність, назви, відсутність дублювання.
5. Тести перевіряють заявлене; `npm test` проходить.
6. Документація (README, test-cases) відповідає зміні.

Зауваження: спостереження — наслідок — пропозиція; позначки **блокує**, **рекомендація**, **запитання**. Автор відповідає на кожне зауваження (виправляє, уточнює або аргументовано пояснює).

## Злиття
`git fetch origin && git rebase origin/main` у власній гілці, за потреби `git push --force-with-lease` (лише власна гілка); спільну `main` не переписуємо. Після злиття — smoke test за `docs/smoke-test.md`.

## Секрети
У репозиторії немає паролів і токенів; локальні файли в `.gitignore`. Якщо секрет потрапив у Git, його відкликають або замінюють; очищення історії — лише за погодженою процедурою.
