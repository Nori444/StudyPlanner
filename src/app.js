const form = document.querySelector("#task-form");
const list = document.querySelector("#task-list");
const empty = document.querySelector("#empty");
const counter = document.querySelector("#counter");
const KEY = "studyplanner.tasks.v1";
let tasks = JSON.parse(localStorage.getItem(KEY) || "[]");

function save(){ localStorage.setItem(KEY, JSON.stringify(tasks)); render(); }
function render(){
  list.innerHTML = "";
  empty.hidden = tasks.length > 0;
  const done = tasks.filter(t => t.done).length;
  counter.textContent = `${tasks.length} завдань • виконано ${done}`;
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task${task.done ? " done" : ""}`;
    const check = document.createElement("input");
    check.type = "checkbox"; check.checked = task.done;
    check.setAttribute("aria-label","Позначити виконаним");
    check.addEventListener("change", () => { task.done = check.checked; save(); });
    const info = document.createElement("div"); info.className = "info";
    const title = document.createElement("strong"); title.textContent = task.title;
    const meta = document.createElement("div"); meta.className = "meta";
    meta.textContent = [task.subject || "Без предмета", task.due ? `Дедлайн: ${task.due}` : "Без дедлайну"].join(" • ");
    info.append(title,meta);
    const del = document.createElement("button"); del.className = "delete"; del.textContent = "Видалити";
    del.addEventListener("click", () => { tasks = tasks.filter(t => t.id !== task.id); save(); });
    li.append(check,info,del); list.append(li);
  });
}
form.addEventListener("submit", e => {
  e.preventDefault();
  const title = document.querySelector("#title").value.trim();
  if(!title) return;
  tasks.unshift({
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    title,
    subject: document.querySelector("#subject").value.trim(),
    due: document.querySelector("#due").value,
    done:false
  });
  form.reset(); save();
});
render();
