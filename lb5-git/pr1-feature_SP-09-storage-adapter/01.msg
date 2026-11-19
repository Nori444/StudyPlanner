refactor(storage): винести доступ до localStorage у Storage Adapter (T1)

Усі читання й запис проходять через createStorage(); помилки localStorage
перехоплюються try/catch. Refs SP-09.
