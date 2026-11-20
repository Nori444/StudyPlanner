# Пакет подання ЛБ7

| Елемент пакета | Де лежить | Стан |
|---|---|---|
| Презентація захисту (10 слайдів) і PDF-копія | `docs/lb7/StudyPlanner_LB7_defense.pptx`, `StudyPlanner_LB7_defense.pdf` | ✅ |
| Працездатний реліз | `src/index.html` (v0.1.0); тег і GitHub Release — `bash scripts/release.sh` | ⚠️ тег не створено (AUD-01) |
| Фінальний звіт | `StudyPlanner_LB7_report.docx` (надсилається окремим файлом; копію покласти в `docs/`) | ✅ |
| Посилання: репозиторій, backlog, документація, діаграми, прототип, тести | README, розділ «Документація» | ⚠️ GitHub Project — AUD-03 |
| Результати ретроспективи і п’ять уроків | `docs/lb7/05-retrospective.md` | ✅ |
| Опис особистого внеску | `docs/contributions/nika-semenovykh.md` | ✅ (рефлексія ЛБ4 — власними словами) |
| Резервні скриншоти демонстрації | `docs/lb7/evidence/demo/D1…D7`, `docs/lb6/evidence/` | ✅ |
| Резервне відео | записати за `03-demo-script.md` | ❌ AUD-10 |
| Аудит, матриця простежуваності, сценарій демо, ролі й відповіді | `docs/lb7/01…04` | ✅ |

## Як опублікувати у GitHub (https://github.com/Nori444/StudyPlanner)
На 20.11.2026 у корені `main` лежать старий стартовий `src/` і вкладені копії `StudyPlanner-v0.1.0/`, `final-tree/`, `lb5-git/`, `lb6-git/`, `shots5/`. Актуальний проєкт — цей архів (v0.1.0 + матеріали ЛБ7).

```bash
git clone https://github.com/Nori444/StudyPlanner.git && cd StudyPlanner
git switch -c docs/lb7-defense-package
git rm -r -q .                                   # прибрати старі копії з дерева
cp -a /шлях/до/розпакованого/StudyPlanner/. .    # скопіювати актуальний проєкт (без .git)
git add -A && git status                         # перевірити зміни
git commit -m "docs(lb7): пакет захисту, демо-сценарій, ретроспектива"
git push -u origin docs/lb7-defense-package      # відкрити pull request за шаблоном
```
Після злиття:
```bash
git switch main && git pull
npm test && bash scripts/check-secrets.sh
bash scripts/release.sh                          # тег v0.1.0 + GitHub Release (потрібен gh auth login)
bash scripts/check-docs.sh                       # має завершитися без зауважень після закриття AUD-03/04
```

## Перед поданням (дії власниці)
1. Створити GitHub Project, вставити посилання в README (розділ «Документація») і `docs/planning-protocol.md`; заповнити решту полів `[ЗАПОВНИТИ]`.
2. Написати рефлексію ЛБ4 власними словами в `docs/contributions/nika-semenovykh.md`.
3. Записати резервне відео; виміряти час основного сценарію (NFR-01) і внести в `03-demo-script.md`.
4. Відкрити всі посилання в режимі інкогніто.
