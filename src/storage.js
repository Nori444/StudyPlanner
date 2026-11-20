/* Storage Adapter: єдина точка доступу до localStorage (ADR-002). */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SP = Object.assign(root.SP || {}, api);
})(typeof self !== "undefined" ? self : globalThis, function () {
  /* Правила предметної області беремо з Task Service (одне джерело правди, DEF-05).
   * У браузері tasks.js має бути підключений раніше за storage.js. */
  const T = typeof module === "object" && module.exports ? require("./tasks.js") : globalThis.SP;
  const KEY = "studyplanner.tasks.v1";

  const BACKUP_KEY = KEY + ".backup";

  function isValidTask(t) {
    return !!t && typeof t === "object" &&
      typeof t.id === "string" && typeof t.title === "string" &&
      typeof t.done === "boolean" &&
      (t.subject === undefined || typeof t.subject === "string") &&
      (t.due === undefined || typeof t.due === "string") &&
      T.validateTitle(t.title).ok &&                      // 1–100 видимих символів
      T.validateSubject(t.subject).ok &&                  // до 60 символів
      (t.due === undefined || t.due === "" || T.isValidISODate(t.due));
  }

  function hasDuplicateIds(tasks) {
    return new Set(tasks.map((t) => t.id)).size !== tasks.length;
  }

  function createStorage(store) {
    function load() {
      if (!store) return { tasks: [], error: "unavailable" };
      let raw;
      try {
        raw = store.getItem(KEY);
      } catch (e) {
        return { tasks: [], error: "unavailable" };
      }
      if (raw === null) return { tasks: [], error: null };
      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        return corrupted(raw);
      }
      if (!Array.isArray(data) || !data.every(isValidTask) || hasDuplicateIds(data)) return corrupted(raw);
      return { tasks: data, error: null };
    }
    function corrupted(raw) {
      try { store.setItem(BACKUP_KEY, raw); } catch (e) { /* копія необов'язкова */ }
      return { tasks: [], error: "corrupted" };
    }
    function save(tasks) {
      if (!store) return { ok: false, error: "write_failed" };
      try {
        store.setItem(KEY, JSON.stringify(tasks));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: "write_failed" };
      }
    }
    return { load, save };
  }

  return { createStorage, isValidTask, STORAGE_KEY: KEY, BACKUP_KEY };
});
