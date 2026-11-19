feat(storage): перевірка схеми JSON і резервна копія пошкоджених даних (T2)

Некоректний JSON або невалідні завдання → порожній список і error=corrupted;
сирий рядок зберігається в studyplanner.tasks.v1.backup. Refs SP-09, TC-08.
