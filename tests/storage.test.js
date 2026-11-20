const test = require("node:test");
const assert = require("node:assert/strict");
const { createStorage, STORAGE_KEY, BACKUP_KEY } = require("../src/storage.js");

function fakeStore(initial = {}, opts = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => { if (opts.failRead) throw new Error("read"); return k in data ? data[k] : null; },
    setItem: (k, v) => { if (opts.failWrite) throw new Error("quota"); data[k] = String(v); },
  };
}
const task = (over = {}) => ({ id: "1", title: "Лаба", subject: "ПП", due: "2026-11-30", done: false, ...over });

test("порожнє сховище → порожній список без помилки", () => {
  assert.deepEqual(createStorage(fakeStore()).load(), { tasks: [], error: null });
});

test("save і load повертають ті самі завдання", () => {
  const s = createStorage(fakeStore());
  assert.equal(s.save([task()]).ok, true);
  assert.deepEqual(s.load().tasks, [task()]);
});

test("TC-07: збій запису → ok=false, без винятку", () => {
  const s = createStorage(fakeStore({}, { failWrite: true }));
  assert.deepEqual(s.save([task()]), { ok: false, error: "write_failed" });
});

test("TC-08: некоректний JSON → порожній список, error=corrupted, копія збережена", () => {
  const store = fakeStore({ [STORAGE_KEY]: "{не json" });
  const r = createStorage(store).load();
  assert.deepEqual(r, { tasks: [], error: "corrupted" });
  assert.equal(store.data[BACKUP_KEY], "{не json");
});

test("TC-08: валідний JSON, але не масив завдань → corrupted", () => {
  const store = fakeStore({ [STORAGE_KEY]: JSON.stringify({ a: 1 }) });
  assert.equal(createStorage(store).load().error, "corrupted");
});

test("завдання з хибними типами полів → corrupted", () => {
  const store = fakeStore({ [STORAGE_KEY]: JSON.stringify([task({ done: "yes" })]) });
  assert.equal(createStorage(store).load().error, "corrupted");
});

test("збій читання або відсутнє сховище → unavailable", () => {
  assert.equal(createStorage(fakeStore({}, { failRead: true })).load().error, "unavailable");
  assert.equal(createStorage(null).load().error, "unavailable");
  assert.equal(createStorage(null).save([]).ok, false);
});

test("дублікати id → corrupted (інакше видалення одного прибере обидва)", () => {
  const store = fakeStore({ [STORAGE_KEY]: JSON.stringify([task({ id: "a" }), task({ id: "a", title: "Інше" })]) });
  assert.equal(createStorage(store).load().error, "corrupted");
});

test("DEF-05: записи, що порушують правила предметної області, → corrupted", () => {
  const bad = {
    "назва 101 символ": task({ title: "а".repeat(101) }),
    "порожня назва": task({ title: "   " }),
    "предмет 61 символ": task({ subject: "п".repeat(61) }),
    "дедлайн не дата": task({ due: "не дата" }),
    "дедлайн 2026-02-30": task({ due: "2026-02-30" }),
    "дедлайн із пробілами": task({ due: " 2026-11-30 " }),
  };
  for (const [name, t] of Object.entries(bad)) {
    const store = fakeStore({ [STORAGE_KEY]: JSON.stringify([t]) });
    const r = createStorage(store).load();
    assert.equal(r.error, "corrupted", name);
    assert.equal(store.data[BACKUP_KEY], JSON.stringify([t]), name + ": копія збережена");
  }
});
test("DEF-05: коректні межі приймаються (100 символів назви, 60 предмета, порожні предмет і дедлайн)", () => {
  const list = [task({ id: "a", title: "а".repeat(100), subject: "п".repeat(60) }), task({ id: "b", subject: "", due: "" }), { id: "c", title: "Без полів", done: true }];
  const r = createStorage(fakeStore({ [STORAGE_KEY]: JSON.stringify(list) })).load();
  assert.equal(r.error, null);
  assert.equal(r.tasks.length, 3);
});
