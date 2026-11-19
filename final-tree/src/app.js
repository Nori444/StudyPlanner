const form = document.querySelector("#task-form");
const list = document.querySelector("#task-list");
const empty = document.querySelector("#empty");
const counter = document.querySelector("#counter");
const banner = document.querySelector("#banner");
function getStore(){ try { return window.localStorage; } catch (e) { return null; } }
const storage = SP.createStorage(getStore());
const loaded = storage.load();
let tasks = loaded.tasks;

/* Message Center: банер з повідомленням і (за потреби) кнопкою повтору */
function showBanner(message, retry){
  banner.textContent = "";
  const text = document.createElement("span"); text.textContent = message;
  banner.append(text);
  if(retry){
    const btn = document.createElement("button");
    btn.type = "button"; btn.textContent = "Спробувати ще раз";
    btn.addEventListener("click", retry);
    banner.append(btn);
  }
  banner.hidden = false;
}
function hideBanner(){ banner.hidden = true; banner.textContent = ""; }

/* Зберігає новий стан; список змінюється лише після успішного запису */
function commit(next){
  const result = storage.save(next);
  if(result.ok){ tasks = next; hideBanner(); render(); return true; }
  showBanner("Не вдалося зберегти зміни в браузері. Список не змінено.", () => commit(next));
  return false;
}

if(loaded.error === "corrupted") showBanner("Збережені дані пошкоджені, тому список порожній. Копію збережено в браузері.");
if(loaded.error === "unavailable") showBanner("Сховище браузера недоступне, тому додавати й змінювати завдання зараз не можна. Перевірте налаштування приватності браузера.");
function render(){
  list.innerHTML = "";
  empty.hidden = tasks.length > 0;
  const done = tasks.filter(t => t.done).length;
  counter.textContent = `${tasks.length} завдань • виконано ${done}`;
  const today = SP.todayISO();
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task${task.done ? " done" : ""}`;
    const check = document.createElement("input");
    check.type = "checkbox"; check.checked = task.done;
    check.setAttribute("aria-label","Позначити виконаним: " + task.title);
    check.addEventListener("change", () => {
      if(!commit(tasks.map(t => t.id === task.id ? { ...t, done: check.checked } : t))) check.checked = task.done;
    });
    const info = document.createElement("div"); info.className = "info";
    const title = document.createElement("strong"); title.textContent = task.title;
    const meta = document.createElement("div"); meta.className = "meta";
    meta.textContent = [task.subject || "Без предмета", task.due ? `Дедлайн: ${SP.formatDate(task.due) || task.due}` : "Без дедлайну"].join(" • ");
    if(SP.isOverdue(task, today)){
      const badge = document.createElement("span"); badge.className = "badge-overdue"; badge.textContent = "Прострочено";
      meta.append(" • ", badge);
    }
    info.append(title,meta);
    const del = document.createElement("button"); del.className = "delete"; del.textContent = "Видалити";
    del.setAttribute("aria-label", "Видалити завдання: " + task.title);
    del.addEventListener("click", () => askDelete(task, del));
    li.append(check,info,del); list.append(li);
  });
}
/* Підтвердження видалення (модальний діалог: Esc і фокус забезпечує <dialog>) */
const dialog = document.querySelector("#confirm-dialog");
const dialogText = document.querySelector("#confirm-text");
let deleteTarget = null, deleteOpener = null;

function askDelete(task, opener){
  deleteTarget = task; deleteOpener = opener;
  dialogText.textContent = "Видалити завдання «" + task.title + "»? Цю дію не можна скасувати.";
  dialog.showModal();
}
dialog.addEventListener("close", () => {
  if(dialog.returnValue === "confirm" && deleteTarget){
    const id = deleteTarget.id;
    const index = tasks.findIndex(t => t.id === id);
    if(commit(tasks.filter(t => t.id !== id))){
      /* фокус не губимо: наступний елемент списку, інакше поле назви */
      const buttons = list.querySelectorAll(".delete");
      (buttons[Math.min(index, buttons.length - 1)] || titleInput).focus();
    } else if(deleteOpener && deleteOpener.isConnected){
      deleteOpener.focus();
    }
  } else if(deleteOpener && deleteOpener.isConnected){
    deleteOpener.focus();
  }
  deleteTarget = null; deleteOpener = null; dialog.returnValue = "";
});

const titleInput = document.querySelector("#title");
const titleError = document.querySelector("#title-error");
const subjectInput = document.querySelector("#subject");
const subjectError = document.querySelector("#subject-error");

function setFieldError(input, el, message){
  el.textContent = message || "";
  el.hidden = !message;
  if(message) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
}
function makeId(){ return crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2, 8); }

form.addEventListener("submit", e => {
  e.preventDefault();
  const result = SP.createTask({ title: titleInput.value, subject: subjectInput.value, due: document.querySelector("#due").value }, makeId);
  setFieldError(titleInput, titleError, result.ok ? "" : result.errors.title);
  setFieldError(subjectInput, subjectError, result.ok ? "" : result.errors.subject);
  if(!result.ok){ (result.errors.title ? titleInput : subjectInput).focus(); return; }
  if(commit([result.task, ...tasks])) form.reset();
});
titleInput.addEventListener("input", () => setFieldError(titleInput, titleError, ""));
subjectInput.addEventListener("input", () => setFieldError(subjectInput, subjectError, ""));
render();
