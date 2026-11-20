fix(storage): перевіряти правила предметної області під час читання сховища (DEF-05)

Причина: isValidTask() перевіряв лише типи полів, тому запис із назвою на
5000 символів, порожньою назвою або дедлайном «не дата» (ручне редагування
localStorage) вважався коректним; сире значення виводилося в «Дедлайн: …».

Storage Adapter використовує validateTitle/validateSubject/isValidISODate
із Task Service; порушення → corrupted + копія в …v1.backup.
У index.html tasks.js підключено раніше за storage.js.
