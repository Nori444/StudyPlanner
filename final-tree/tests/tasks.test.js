const test = require("node:test");
const assert = require("node:assert/strict");
const { validateTitle, validateSubject, createTask } = require("../src/tasks.js");

test("TC-11: назва з пробілів відхиляється", () => {
  const r = validateTitle("     ");
  assert.equal(r.ok, false);
  assert.match(r.error, /Введіть назву/);
});

test("TC-02: порожня назва відхиляється", () => {
  assert.equal(validateTitle("").ok, false);
  assert.equal(validateTitle(undefined).ok, false);
});

test("TC-11: 101 символ відхиляється, 100 — приймається", () => {
  const bad = validateTitle("а".repeat(101));
  assert.equal(bad.ok, false);
  assert.match(bad.error, /від 1 до 100/);
  assert.equal(validateTitle("а".repeat(100)).ok, true);
});

test("довжина рахується після trim()", () => {
  const r = validateTitle("  " + "б".repeat(100) + "  ");
  assert.equal(r.ok, true);
  assert.equal(r.value.length, 100);
});

test("предмет: до 60 символів", () => {
  assert.equal(validateSubject("х".repeat(60)).ok, true);
  assert.equal(validateSubject("х".repeat(61)).ok, false);
});

test("createTask: коректні дані → завдання з обрізаними пробілами", () => {
  const r = createTask({ title: "  Лаба 5 ", subject: " ПП ", due: "2026-11-30" }, () => "id-1");
  assert.deepEqual(r, { ok: true, task: { id: "id-1", title: "Лаба 5", subject: "ПП", due: "2026-11-30", done: false } });
});

test("createTask: помилки повертаються по полях", () => {
  const r = createTask({ title: "", subject: "х".repeat(61), due: "" }, () => "id");
  assert.equal(r.ok, false);
  assert.ok(r.errors.title && r.errors.subject);
});

const { formatDate } = require("../src/tasks.js");
test("TC-10: дата відображається як дд.мм.рррр", () => {
  assert.equal(formatDate("2026-11-18"), "18.11.2026");
  assert.equal(formatDate("2026-01-05"), "05.01.2026");
});
test("formatDate: порожнє або некоректне значення → порожній рядок", () => {
  assert.equal(formatDate(""), "");
  assert.equal(formatDate(undefined), "");
  assert.equal(formatDate("18.11.2026"), "");
});

const { isOverdue, todayISO } = require("../src/tasks.js");
test("TC-10: учорашній дедлайн → прострочено", () => {
  assert.equal(isOverdue({ due: "2026-11-18", done: false }, "2026-11-19"), true);
});
test("сьогоднішній і майбутній дедлайн не прострочені", () => {
  assert.equal(isOverdue({ due: "2026-11-19", done: false }, "2026-11-19"), false);
  assert.equal(isOverdue({ due: "2026-11-20", done: false }, "2026-11-19"), false);
});
test("виконане завдання або без дедлайну не прострочене", () => {
  assert.equal(isOverdue({ due: "2026-11-18", done: true }, "2026-11-19"), false);
  assert.equal(isOverdue({ due: "", done: false }, "2026-11-19"), false);
});
test("todayISO повертає локальну дату РРРР-ММ-ДД", () => {
  assert.equal(todayISO(new Date(2026, 10, 9, 23, 59)), "2026-11-09");
});

const { isValidISODate } = require("../src/tasks.js");
test("isValidISODate: некоректні календарні дати відхиляються", () => {
  assert.equal(isValidISODate("2026-11-18"), true);
  assert.equal(isValidISODate("2028-02-29"), true);
  assert.equal(isValidISODate("2026-02-30"), false);
  assert.equal(isValidISODate("2026-13-45"), false);
});
test("formatDate і isOverdue ігнорують некоректну дату", () => {
  assert.equal(formatDate("2026-13-45"), "");
  assert.equal(isOverdue({ due: "2026-13-45", done: false }, "2026-11-19"), false);
});
test("createTask: некоректний дедлайн не зберігається", () => {
  assert.equal(createTask({ title: "А", due: "2026-13-45" }, () => "i").task.due, "");
});
