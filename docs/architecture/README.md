# Архітектурні артефакти (лабораторна робота 3)

- `diagrams/` — `.dot` (Graphviz: контекст, компоненти, deployment, ER), `05_sequence.puml` (PlantUML) та PNG.
  Рендер: `dot -Tpng -Gdpi=170 01_context.dot -o 01_context.png`. PNG sequence-діаграми створено скриптом `05_sequence_render.py` за тим самим сценарієм, що й `.puml`.
- `prototype/` — `screens.html` (7 екранів), PNG екранів, `gen_screens.py` (генератор).
- `adr/` — ADR-001 (стек), ADR-002 (зберігання й обмін даними).
