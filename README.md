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
