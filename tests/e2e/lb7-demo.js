/* ЛБ7: сценарій демонстрації 5–7 хв, виконаний автоматично (резерв: серія скриншотів).
 * Запуск:  npm i --no-save playwright && node tests/e2e/lb7-demo.js [каталог-скриншотів]
 * Кроки відповідають docs/lb7/03-demo-script.md (D1…D9). Код завершення 1, якщо крок не пройшов. */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(process.env.SP_ROOT || path.join(__dirname, "../.."));
const PAGE = "file://" + path.join(ROOT, "src/index.html");
const OUT = process.argv[2] || path.join(ROOT, "docs/lb7/evidence/demo");
const KEY = "studyplanner.tasks.v1";
fs.mkdirSync(OUT, { recursive: true });

const iso = (offset) => { const d = new Date(); d.setDate(d.getDate() + offset); const q = (n) => String(n).padStart(2, "0"); return d.getFullYear() + "-" + q(d.getMonth() + 1) + "-" + q(d.getDate()); };
const add = async (p, t, s, d) => { await p.fill("#title", t); await p.fill("#subject", s || ""); await p.fill("#due", d || ""); await p.click("button[type=submit]"); };
const settle = (p) => p.waitForTimeout(200);
let failed = 0;
const check = (id, name, ok, extra) => { if (!ok) failed++; console.log((ok ? "PASS " : "FAIL ") + id + " " + name + (extra ? " — " + extra : "")); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  const shot = (n) => p.screenshot({ path: path.join(OUT, n + ".png") });

  // D1. Стартовий стан: чистий профіль, порожній список (NFR-03: без сервера, file://)
  await p.goto(PAGE);
  await p.evaluate(() => localStorage.clear()); await p.reload();
  check("D1", "порожній стан, сторінка відкрита з file://", await p.locator("#empty").isVisible() && (await p.locator(".task").count()) === 0);
  await shot("D1_start_empty");

  // D2. Правило валідації: порожня назва (SP-11)
  await p.click("button[type=submit]");
  const e1 = await p.locator("#title-error").innerText();
  check("D2", "порожня назва → повідомлення, завдання не додано", e1.includes("Введіть назву") && (await p.locator(".task").count()) === 0, e1);
  await shot("D2_validation_empty");

  // D3. Основний сценарій: додати два завдання (SP-04, SP-10)
  await add(p, "Лабораторна робота №7", "Проєктний практикум", iso(3));
  await add(p, "Реферат з дискретної математики", "Дискретна математика", iso(-1));
  check("D3", "два завдання у списку; лічильник «2 завдання»", (await p.locator(".task").count()) === 2 && (await p.locator("#counter").innerText()).startsWith("2 завдання"), await p.locator("#counter").innerText());
  const overdue = await p.locator(".badge-overdue").count();
  check("D3b", "учорашній дедлайн має позначку «Прострочено»", overdue === 1);
  await shot("D3_two_tasks_overdue");

  // D4. Позначити виконаним (SP-05)
  await p.locator(".task", { hasText: "Реферат" }).locator("input[type=checkbox]").check();
  await settle(p);
  check("D4", "завдання виконане: стиль done, «Прострочено» зникає", (await p.locator(".task.done").count()) === 1 && (await p.locator(".badge-overdue").count()) === 0, await p.locator("#counter").innerText());
  await shot("D4_marked_done");

  // D5. Збереження після перезавантаження (NFR-02)
  await p.reload();
  check("D5", "після F5 завдання й стани збережені", (await p.locator(".task").count()) === 2 && (await p.locator(".task.done").count()) === 1);
  await shot("D5_after_reload");

  // D6. Видалення з підтвердженням: Скасувати → Видалити (SP-08)
  await p.locator(".task").first().locator(".delete").click();
  await settle(p); await shot("D6_delete_dialog");
  await p.locator("#confirm-dialog button[value=cancel]").click(); await settle(p);
  const afterCancel = await p.locator(".task").count();
  await p.locator(".task").first().locator(".delete").click(); await settle(p);
  await p.locator("#confirm-dialog button[value=confirm]").click(); await settle(p);
  check("D6", "«Скасувати» лишає запис, «Видалити» прибирає", afterCancel === 2 && (await p.locator(".task").count()) === 1);
  await shot("D6b_after_delete");

  // D7. Важлива помилка: пошкоджене сховище (SP-09, TC-08)
  await p.evaluate((k) => localStorage.setItem(k, "{не json"), KEY);
  await p.reload();
  const banner = await p.locator("#banner").innerText();
  const backup = await p.evaluate((k) => localStorage.getItem(k + ".backup"), KEY);
  check("D7", "пошкоджені дані → порожній список, банер, копія в backup; застосунок працює", (await p.locator("#banner").isVisible()) && backup === "{не json" && (await p.locator(".task").count()) === 0, banner);
  await shot("D7_corrupted_banner");
  await add(p, "Застосунок працює далі", "", "");
  check("D7b", "після помилки можна додати нове завдання", (await p.locator(".task").count()) === 1);

  check("D8", "у консолі немає помилок", errors.length === 0, errors.join(" | "));
  await browser.close();
  console.log("\nПідсумок: " + (failed === 0 ? "усі кроки демо пройдено" : failed + " крок(ів) не пройдено"));
  process.exit(failed ? 1 : 0);
})();
