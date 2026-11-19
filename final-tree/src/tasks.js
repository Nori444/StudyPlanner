/* Task Service: правила предметної області (без DOM і без localStorage). */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SP = Object.assign(root.SP || {}, api);
})(typeof self !== "undefined" ? self : globalThis, function () {
  const TITLE_MAX = 100;
  const SUBJECT_MAX = 60;

  /** Назва: після trim() від 1 до 100 символів. */
  function validateTitle(raw) {
    const value = String(raw == null ? "" : raw).trim();
    if (value.length === 0) return { ok: false, error: "Введіть назву завдання." };
    if (value.length > TITLE_MAX) {
      return { ok: false, error: "Назва має містити від 1 до " + TITLE_MAX + " символів (зараз " + value.length + ")." };
    }
    return { ok: true, value };
  }

  /** Предмет необов'язковий: до 60 символів після trim(). */
  function validateSubject(raw) {
    const value = String(raw == null ? "" : raw).trim();
    if (value.length > SUBJECT_MAX) {
      return { ok: false, error: "Назва предмета має містити не більше " + SUBJECT_MAX + " символів." };
    }
    return { ok: true, value };
  }

  /** Створює завдання або повертає помилки валідації. */
  function createTask(input, makeId) {
    const title = validateTitle(input.title);
    const subject = validateSubject(input.subject);
    if (!title.ok || !subject.ok) {
      return { ok: false, errors: { title: title.ok ? null : title.error, subject: subject.ok ? null : subject.error } };
    }
    return {
      ok: true,
      task: { id: makeId(), title: title.value, subject: subject.value, due: isValidISODate(input.due) ? input.due : "", done: false },
    };
  }

  /** Календарно коректна дата РРРР-ММ-ДД (2026-13-45 і 2026-02-30 — ні). */
  function isValidISODate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return false;
    const y = +m[1], mo = +m[2], d = +m[3];
    const dt = new Date(Date.UTC(y, mo - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
  }

  /** "2026-11-18" → "18.11.2026" без Date у локальній зоні, щоб часовий пояс не зсував день. */
  function formatDate(iso) {
    return isValidISODate(iso) ? iso.slice(8, 10) + "." + iso.slice(5, 7) + "." + iso.slice(0, 4) : "";
  }

  /** Сьогоднішня локальна дата у форматі РРРР-ММ-ДД. */
  function todayISO(now) {
    const d = now || new Date();
    const p = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  /** Прострочено: є дедлайн, він раніше за сьогодні, завдання не виконано.
   *  Дати порівнюються як рядки РРРР-ММ-ДД, тому часовий пояс не впливає. */
  function isOverdue(task, today) {
    return !task.done && isValidISODate(task.due) && task.due < (today || todayISO());
  }

  return { validateTitle, validateSubject, createTask, formatDate, isValidISODate, todayISO, isOverdue, TITLE_MAX, SUBJECT_MAX };
});
