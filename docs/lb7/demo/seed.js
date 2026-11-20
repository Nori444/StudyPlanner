/* Демонстраційні дані StudyPlanner v0.1.0. Лише вигадані записи, жодних персональних даних.
 * Використання: відкрити src/index.html → DevTools (F12) → Console → вставити файл → Enter → F5.
 * Дати рахуються від сьогодні, тому «Прострочено» завжди відтворюється.
 * Відновлення початкового стану: localStorage.clear(); location.reload();  */
(function () {
  const KEY = "studyplanner.tasks.v1";
  const iso = (offset) => {
    const d = new Date(); d.setDate(d.getDate() + offset);
    const q = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + q(d.getMonth() + 1) + "-" + q(d.getDate());
  };
  const sets = {
    /* Успіх: основний сценарій */
    success: [
      { id: "demo-1", title: "Лабораторна робота №7", subject: "Проєктний практикум", due: iso(3), done: false },
      { id: "demo-2", title: "Реферат з дискретної математики", subject: "Дискретна математика", due: iso(-1), done: false }
    ],
    /* Конфлікт: контрольована помилка (TC-08) — сховище пошкоджене */
    conflict: "{не json",
    /* Межа: назва рівно 100 символів (TC-14) */
    boundary: [
      { id: "demo-3", title: "А".repeat(100), subject: "", due: "", done: false }
    ]
  };
  const name = (window.SEED || "success");
  const value = sets[name];
  localStorage.setItem(KEY, typeof value === "string" ? value : JSON.stringify(value));
  console.log("Seed «" + name + "» записано. Оновіть сторінку (F5).");
})();
/* Інший набір: window.SEED = "conflict"; потім вставити файл ще раз. */
