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
test("DEF-02: createTask відхиляє некоректний дедлайн з повідомленням, а не мовчки його відкидає", () => {
  for (const bad of ["2026-13-45", "2026-02-30", "12345-01-01", "26-1-1", "не дата"]) {
    const r = createTask({ title: "А", due: bad }, () => "i");
    assert.equal(r.ok, false, bad);
    assert.match(r.errors.due, /Дата некоректна/);
    assert.equal(r.errors.title, null);
  }
});
const { validateDue } = require("../src/tasks.js");
test("validateDue: порожній дедлайн дозволений, коректна дата приймається", () => {
  assert.deepEqual(validateDue(""), { ok: true, value: "" });
  assert.deepEqual(validateDue(undefined), { ok: true, value: "" });
  assert.deepEqual(validateDue("2028-02-29"), { ok: true, value: "2028-02-29" });
  assert.equal(validateDue("2027-02-29").ok, false);
});

const { charLength } = require("../src/tasks.js");
test("DEF-03: charLength рахує видимі символи, а не UTF-16 одиниці", () => {
  assert.equal(charLength("абв"), 3);
  assert.equal(charLength("😀"), 1);
  assert.equal(charLength("😀".repeat(60)), 60);
  assert.equal(charLength("👨‍👩‍👧"), 1); // складена емодзі (ZWJ) — один символ
  assert.equal(charLength(undefined), 0);
});
test("DEF-03: 100 емодзі приймається, 101 — ні; у повідомленні справжня довжина", () => {
  assert.equal(validateTitle("😀".repeat(100)).ok, true);
  const bad = validateTitle("😀".repeat(101));
  assert.equal(bad.ok, false);
  assert.match(bad.error, /зараз 101/);
  assert.equal(validateSubject("🎓".repeat(60)).ok, true);
  assert.equal(validateSubject("🎓".repeat(61)).ok, false);
});

const { taskCountLabel } = require("../src/tasks.js");
test("DEF-04: форма слова «завдання» за числом (SP-12)", () => {
  const expected = { 0: "0 завдань", 1: "1 завдання", 2: "2 завдання", 4: "4 завдання", 5: "5 завдань", 11: "11 завдань", 12: "12 завдань", 14: "14 завдань",
    20: "20 завдань", 21: "21 завдання", 22: "22 завдання", 25: "25 завдань", 101: "101 завдання", 111: "111 завдань" };
  for (const [n, text] of Object.entries(expected)) assert.equal(taskCountLabel(+n), text, String(n));
});
