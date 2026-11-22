# STRUMYK SPORTS v0.27 — HTTPS + мережеві запити

**Дата:** 22.11.2026. **Статус:** окрема діагностична збірка, не виправлення відео.

## Результати реальних тестів користувача

**Android Lampa Uncensored** (встановлена програма):
- `location.protocol=http:`, `isSecureContext=false`;
- `requestMediaKeySystemAccess`, `MediaKeys`, `MediaKeySession`: недоступні;
- `dashjs`: присутній; каталог раніше повертав 189 спортивних подій та 56-канальну EPG (v0.19).

**HTTPS Lampa у Chrome** (`https://bylampa.online/`):
- `location.protocol=https:`, `isSecureContext=true`;
- EME API доступний; тест `org.w3.clearkey` для AVC/AAC: **SUPPORTED**;
- `AndroidJS=undefined`, `dashjs=object`;
- спортивний каталог у v0.26 показав **0 подій**.

Це означає, що в Chrome є базова підтримка ClearKey, **але не доводить**, що WEB-Lampa у Chrome вміє отримувати дані Strumyk або передавати належну DRM-конфігурацію у Lampa Player.

## Чому каталог може бути порожнім

Станом на v0.26 запити каталогу реалізовані через `new Lampa.Reguest().native(url, ...)`, із User-Agent/Referer у заголовках нативного клієнта. У звичайному браузері цей транспорт може бути недоступним або працювати інакше, ніж в Android-оболонці.

Також `https://bylampa.online` та `https://strumyk.ca` — різні origin. Доступ до JSON у браузерному `fetch` визначає **CORS**, незалежно від бажаного `User-Agent`; без відповідного `Access-Control-Allow-Origin` на сервері Strumyk JavaScript не може прочитати відповідь.

**Поки немає логів, не називати CORS єдиною доведеною причиною нульового каталогу.**

## Встановлення

`https://cdn.jsdelivr.net/gh/sanzyscy/Beeeest@397a24d87421cef9ef8507ec4b8d0fe8020314ca/test/strumyk_plugin_v027_network_drm_diag_test.js`

Встановлювати лише одну версію STRUMYK. Робочі файли v0.14/v0.19 та тестові v0.21–v0.26 НЕ змінені.

## Тест на HTTPS
1. Відкрити **https://bylampa.online/** в Chrome та замінити **лише** версію плагіна на v0.27.
2. **STRUMYK → ⚙ Налаштування → DASH / DRM діагностика**.
3. Натиснути **«🌐 Перевірити Strumyk API (CORS / native)»**.
4. Після завершення виводяться тільки підсумкові статуси:
   - `Chrome fetch: HTTP 200 JSON ARRAY N records` — браузер отримав і прочитав публічний `/api/O.php`;
   - `Chrome fetch: ERROR TypeError` — можлива CORS-блокада **або** помилка мережі. Із самого JS тип причини не довести;
   - `Lampa native: JSON ARRAY N records` — транспорт Lampa може отримати дані у цьому середовищі;
   - `Lampa native: ERROR ...` або `TIMEOUT` — транспорт не отримав придатну відповідь;
   - `HTTP 403` — серверна відмова; інша причина, ніж CORS.
5. Передати **один скріншот** після тесту. JSON/паролі/токени не потрібні.

Порівнюються тільки 2 read-only запити до `https://strumyk.ca/api/O.php`, час очікування кожного обмежений **7 с**. Немає проксі, стороннього сервісу, копіювання заголовків авторизації, зчитування cookie чи DRM-ключів.

## Технічні висновки для архітектури
- Вебсторінка на HTTPS може мати EME, але для автономного спортивного каталогу потрібен дозволений браузерний доступ до API або інший дозволений транспорт.
- Android APK має нативний HTTP-клієнт, але його поточна HTML-сторінка зафіксована на HTTP і без EME. Перехід лише на HTTPS URL сайту в плагіні **не змінює origin батьківської сторінки**.
- Якщо сервер не дозволяє CORS, один JS на `bylampa.online` не може безпосередньо отримати JSON із `strumyk.ca` через `fetch`; `mode:'no-cors'` дає лише opaque-відповідь, не каталог.
- Підтримка ClearKey не означає наявності DRM-ключів або ліцензії на конкретний контент. `cenc.mpd` з попереднього звіту — інша технічна задача.
- **Не заявляти про працездатність VLC/MX та внутрішнього DRM-плеєра до фактичних тестів відтворення з належним доступом.**

## Джерела
- MDN CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
- MDN Secure Context: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts
- MDN Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
