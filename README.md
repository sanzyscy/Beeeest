# STRUMYK SPORTS × Lampa

Дослідницький проєкт для LampaS та Lampa Uncensored, основна адреса: https://strumyk.ca/.

## Стан — v0.6 research (22.11.2026)

Опрацьовано сім знімків публічних JS (чотири з головного спортивного розділу, три з `/telewizja/`). Усі містили ті самі два файли: `/js/strumyk-app.js` та `/js/strumyk-schedule.js`, тому ТВ-каталог з них **не отримано**.

**Спортивна схема підтверджена кодом сайту:** `window.SK.api.L/J/X/M/O`; паралельне отримання JSON-масивів; дедуплікація за `id` з пріоритетом J→O→M→X→L; `J` — популярні. Подія має `title.pl.home/away`, `startTime`, `category`, `tournament`, `_embeds`; embed-масиви розподіляються за `language` і містять `label`, `embed`.

У локальному прототипі v0.6 реалізовано чистий API-парсер `parseStrumykApiBundle` із підтвердженою схемою, правильне розділення веб-iframe і прямих медіапотоків, тести JSON + збережених DOM-знімків. **Живі API-виклики, запуск Lampa, VLC/MX та ТВ-каталог не перевірені.** Плагін ще НЕ публікується як реліз.

### Телеекрани

Код сайту `/js/strumyk-schedule.js` автономно працює на TV сторінці через `window.SK_SCHED`, але це стосується спортивного розкладу й не доводить джерело ТВ-каналів.

**Наступний крок:** запустити з `/telewizja/` нашу [цільову TV-діагностику v0.6](tools/strumyk_tv_capture_v06.js), спершу на каталозі, потім з відкритим каналом. Експортує лише локальний JSON з очищеними URL, DOM-метаданими, скриптами й назвами API-параметрів.

### Інструменти

- [tools/strumyk_browser_capture_v031.js](tools/strumyk_browser_capture_v031.js)
- [tools/strumyk_capture_sources_v04.js](tools/strumyk_capture_sources_v04.js)
- [tools/strumyk_public_js_capture_v05.js](tools/strumyk_public_js_capture_v05.js)
- [tools/strumyk_tv_capture_v06.js](tools/strumyk_tv_capture_v06.js)

LiveTV — окремий проєкт і не змінюється. Не публікувати знімки з приватними токенами в публічному GitHub.

## TV-дослідження v0.7 (22.11.2026)

Шість браузерних знімків `/telewizja/` підтвердили: **56 каналів**; фільтри `podstawowe=11`, `sport=28`, `news=3`, `film=8`, `rozrywka=6`. На сторінці є `window.CHANNELS` (масив об'єктів) та виклик `/api/epg.php`. Відкриті сторінки Polsat Sport Premium 2, Eleven Sports 4 та Polsat Sport Extra 3, але прямі відеопотоки ще не доведені.

Від власника є вимога **не витрачати релізний час на повну семиденну EPG-сітку**. Для TV варто зробити пошук, категорії, обране, доступні джерела; за потреби пізніше — компактний «Зараз / Далі» з прогресом.

Нова [безпечна TV-діагностика v0.7](tools/strumyk_tv_channels_v07.js) вивантажує об'єкти `window.CHANNELS` у локальний JSON з маскуванням query/секретоподібних полів. Попередні v0.6-знімки цього не робили.

Дзеркала зі скріншота `rentry.co/strumyk`: `strumyk.ca`, `strumyk.cv`. Наявність у переліку **не гарантує доступність** — попередня TLS-перевірка `.cv` була невдалою.

JS-плагін v0.6 все ще є дослідницьким прототипом, live інтеграцію в Lampa не підтверджено.
