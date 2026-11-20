import re
css = open('/home/claude/StudyPlanner-main/src/style.css', encoding='utf-8').read()
extra = """
body{background:#f4f6fb}
.screen{width:640px;padding:28px 24px;background:#f4f6fb;position:relative;margin:0}
.screen .container{margin:0 auto;padding:0}
.tag{position:absolute;top:8px;right:14px;font-size:11px;color:#6b7390;font-weight:700;letter-spacing:1px}
.task.overdue .meta{color:#b3261e;font-weight:700}
.badge{display:inline-block;font-size:11px;font-weight:800;padding:2px 8px;border-radius:999px;background:#fde7e5;color:#b3261e;margin-left:6px}
.err{color:#b3261e;font-size:12px;font-weight:700;margin-top:6px}
input.bad{border-color:#b3261e;outline:2px solid #f5b5b0}
.banner{border:1px solid #f0b4af;background:#fdeceb;color:#8a1c14;border-radius:12px;padding:14px 16px;margin-bottom:18px;font-size:14px}
.banner b{display:block;margin-bottom:4px}
.banner button{margin-top:10px;background:#8a1c14}
.toast{border:1px solid #b6e2c3;background:#eaf8ef;color:#17623a;border-radius:12px;padding:12px 16px;margin-bottom:18px;font-size:14px;font-weight:600}
.task.new{background:#f3f5ff;border-radius:10px;padding-left:10px;padding-right:10px}
.overlay{position:absolute;inset:0;background:#1d233a99;display:flex;align-items:center;justify-content:center}
.modal{background:#fff;border-radius:16px;padding:24px;width:420px;box-shadow:0 20px 60px #0004}
.modal h3{margin:0 0 10px;font-size:18px}.modal p{margin:0 0 18px;color:#535c73;font-size:14px}
.modal .row{display:flex;gap:10px;justify-content:flex-end}
.modal .danger{background:#b3261e}.modal .ghost{background:#eceef6;color:#3b4259}
.empty{padding:26px 0}.empty b{display:block;color:#3b4259;margin-bottom:6px;font-size:15px}
"""
def head(tag, n):
    return f'<div class="screen" id="s{n}"><div class="tag">{tag}</div><main class="container"><header><p class="eyebrow">STUDYPLANNER</p><h1>Мої навчальні завдання</h1><p class="subtitle">Усі дедлайни в одному місці — крок за кроком.</p></header>'
def form(title='', subject='', due='', bad=False, err=''):
    t = f'<input id="title" class="{"bad" if bad else ""}" value="{title}" placeholder="Наприклад, лабораторна робота №2">' 
    e = f'<div class="err">⚠ {err}</div>' if err else ''
    return f'''<section class="panel"><h2>Додати завдання</h2><form onsubmit="return false"><label>Назва завдання{t}{e}</label>
<div class="fields"><label>Предмет<input value="{subject}" placeholder="Проєктний практикум"></label><label>Дедлайн<input value="{due}" placeholder="дд.мм.рррр"></label></div>
<button>Додати завдання</button></form></section>'''
def task(title, subj, due, done=False, over=False, new=False):
    cls = 'task' + (' done' if done else '') + (' overdue' if over else '') + (' new' if new else '')
    badge = '<span class="badge">⏰ Прострочено</span>' if over else ''
    chk = 'checked' if done else ''
    return f'<li class="{cls}"><input type="checkbox" {chk} aria-label="Позначити виконаним"><div class="info"><strong>{title}</strong><div class="meta">{subj} • Дедлайн: {due}{badge}</div></div><button class="delete">Видалити</button></li>'
def listbox(items, counter):
    return f'<section class="tasks"><div class="list-heading"><h2>Список завдань</h2><span id="counter">{counter}</span></div><ul>{"".join(items)}</ul></section>'
foot = '</main></div>'
S = []
base_tasks = [task('Лабораторна робота №3','Проєктний практикум','20.11.2026'),
              task('Реферат з філософії','Філософія','25.11.2026'),
              task('Лабораторна робота №2','Проєктний практикум','18.11.2026', done=True)]
# 1 main
S.append(head('ЕКРАН 1 • ОСНОВНИЙ СТАН',1)+form()+listbox(base_tasks,'3 завдання • виконано 1')+foot)
# 2 empty
S.append(head('ЕКРАН 2 • ПОРОЖНІЙ СТАН',2)+form()+'<section class="tasks"><div class="list-heading"><h2>Список завдань</h2><span id="counter">0 завдань</span></div><ul></ul><div class="empty" style="text-align:center"><b>Поки що завдань немає</b>Заповніть форму вище й натисніть «Додати завдання».</div></section>'+foot)
# 3 form filled
S.append(head('ЕКРАН 3 • ФОРМА НОВОГО ЗАВДАННЯ',3)+form('Підготувати демонстрацію MVP','Проєктний практикум','25.11.2026')+listbox(base_tasks[:2],'2 завдання • виконано 0')+foot)
# 4 validation error
S.append(head('ЕКРАН 4 • ПОМИЛКА ВАЛІДАЦІЇ',4)+form('','Проєктний практикум','25.11.2026',bad=True,err='Вкажіть назву завдання (до 100 символів). Без назви завдання не буде додано.')+listbox(base_tasks,'3 завдання • виконано 1')+foot)
# 5 storage error
S.append(head('ЕКРАН 5 • ПОМИЛКА ЗБЕРЕЖЕННЯ',5)+'<div class="banner"><b>⚠ Не вдалося зберегти дані в браузері</b>Сховище браузера недоступне або заповнене (можливо, увімкнено приватний режим). Завдання лишиться на сторінці лише до її оновлення. Звільніть місце / вийдіть із приватного режиму та повторіть спробу.<br><button>Спробувати ще раз</button></div>'+form()+listbox(base_tasks,'3 завдання • виконано 1')+foot)
# 6 delete confirm
s6 = head('ЕКРАН 6 • ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ',6)+form()+listbox(base_tasks,'3 завдання • виконано 1')+foot
s6 = s6[:-6] + '<div class="overlay"><div class="modal"><h3>Видалити завдання?</h3><p>«Реферат з філософії» буде видалено без можливості відновлення.</p><div class="row"><button class="ghost">Скасувати</button><button class="danger">Видалити</button></div></div></div></div>'
S.append(s6)
# 7 success
S.append(head('ЕКРАН 7 • УСПІШНИЙ РЕЗУЛЬТАТ',7)+'<div class="toast">✔ Завдання «Підготувати демонстрацію MVP» додано. Дедлайн: 25.11.2026.</div>'+form()+listbox([task('Підготувати демонстрацію MVP','Проєктний практикум','25.11.2026',new=True)]+base_tasks,'4 завдання • виконано 1')+foot)
html = '<!doctype html><html lang="uk"><meta charset="utf-8"><style>'+css+extra+'</style><body>'+''.join(S)+'</body></html>'
open('screens.html','w',encoding='utf-8').write(html)
