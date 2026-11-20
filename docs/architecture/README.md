# Архітектурні артефакти (лабораторна робота 3)

- `diagrams/` — `.dot` (Graphviz: контекст, компоненти, deployment, ER), `05_sequence.puml` (PlantUML) та PNG.
  Рендер: `dot -Tpng -Gdpi=170 01_context.dot -o 01_context.png`. PNG sequence-діаграми створено скриптом `05_sequence_render.py` за тим самим сценарієм, що й `.puml`.
- `prototype/` — `screens.html` (7 екранів), PNG екранів, `gen_screens.py` (генератор).
- `adr/` — ADR-001 (стек), ADR-002 (зберігання й обмін даними).

## Відповідність діаграм реалізації v0.1.0 (аудит ЛБ7, AUD-06)
Діаграми ЛБ3 описують **цільову** архітектуру. У релізі v0.1.0 реалізовано таке:

| Діаграма | У діаграмі (ЛБ3) | Реалізовано в v0.1.0 |
|---|---|---|
| Компоненти | C1 UI, C2 Task Service, C3 Storage Adapter, C4 Message Center | UI і Message Center разом у `src/app.js` (банер `showBanner`, `<dialog>` підтвердження); Task Service — `src/tasks.js`; Storage Adapter — `src/storage.js` |
| Компоненти | Команди add / toggle / delete проходять через Task Service | Додавання й валідація — через `SP.createTask`; зміна статусу й видалення виконуються в `commit()` у `app.js`; перед записом `commit()` читає свіжий стан зі сховища (DEF-01) |
| ER | Таблиці Subject і Task, типи БД (UUID, TIMESTAMP, status todo/done) | Плоский JSON: `{id, title, subject, due, done}` у ключі `studyplanner.tasks.v1`; сутності Subject немає; ER — модель для можливої v2 (ADR-002) |
| Послідовність | Помилка `VALIDATION_TITLE`, текст «Вкажіть назву», повідомлення про успіх | Помилки повертаються по полях (`errors.title/subject/due`), текст «Введіть назву завдання.»; повідомлення про успіх немає — список просто оновлюється |
| Розгортання | Статичний хостинг GitHub Pages | Публікацію не виконано; застосунок запускається локально з `src/index.html` |
