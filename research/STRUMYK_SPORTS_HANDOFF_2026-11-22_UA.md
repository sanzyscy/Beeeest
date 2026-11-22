# STRUMYK SPORTS — передача проєкту до нового чату
**Дата стану:** 22.11.2026 · **Мова роботи:** українська · **Репозиторій:** https://github.com/sanzyscy/Beeeest

## 1. Головне рішення користувача
**АКТУАЛЬНЕ РІШЕННЯ КОРИСТУВАЧА (22.11.2026): основний режим Lampa — HTTP.** Попереднє рішення залишатися виключно на HTTPS **скасовано**. Історичні успішні тести HTTPS/EME залишаються достовірними для HTTPS, але у перевіреному HTTP WebView браузерний EME недоступний. **Сам сайт Strumyk, його API та допустимі адреси доменів залишаються HTTPS.** Не плутати протокол оболонки Lampa з протоколом `https://strumyk.ca/`.

Мета проєкту: один автономний JavaScript-плагін STRUMYK SPORTS для Lampa / Lampa Uncensored — смартфони та Android TV, без постійного Chrome bookmarklet, Termux/Python Bridge або власного сервера; максимально повні спортивні події з джерелами, UA (основна), PL/RU, фільтри, EPG 56 TV, внутрішній і за можливості зовнішні плеєри. Ніколи не змінювати інший **LiveTV** плагін.

## 2. Робоча поточна версія і посилання
**v0.30 BACK CONTROLLER FIX — перевірена користувачем на смартфоні («Все чітко»).** Результат Back та публічного DRM-демо стосується випробуваного середовища; код збережений недоторканим.

**v0.31 HTTP MANIFEST GUARD — створена 22.11.2026; синтаксис та 9 тестів маніфестів PASS, на реальній Lampa ще НЕ перевірена.** Додана перевірка HLS/DASH, розділення IPTV M3U / HLS, HLS AES-128 / HLS master / захищених DASH і HLS; захищені джерела не автозапускаються через HTTP. Плеєри, каталог та EPG потребують регресійного тесту.

- Код v0.31: `test/strumyk_plugin_v031_http_manifest_guard_test.js`
- Pinned URL v0.31: https://cdn.jsdelivr.net/gh/sanzyscy/Beeeest@a7358fc6a539f6be12f9ddd80d8cba668f0a7bcd/test/strumyk_plugin_v031_http_manifest_guard_test.js
- Інструкція: `test/README_V031_HTTP_MANIFEST_GUARD_UA.md`

- Код: `test/strumyk_plugin_v030_back_controller_fix_test.js`
- Незмінний pinned URL для встановлення:
  https://cdn.jsdelivr.net/gh/sanzyscy/Beeeest@530d0360638175c314f7835f3d9a39a5a8453607/test/strumyk_plugin_v030_back_controller_fix_test.js
- Документація: `test/README_V030_BACK_CONTROLLER_FIX_UA.md`
- Відкот/еталон v0.29: `test/strumyk_plugin_v029_ui_layout_fix_test.js` pinned commit `cd7e97d4e85d28f9d18c13c81eb21c23e111a7ca`
- Автономний фундамент: `test/strumyk_plugin_v019_standalone_http_test.js`; старий спортивний каталог із Bridge v0.14: `test/strumyk_plugin_v014_dom_test.js`. **Нічого з цих еталонних файлів не переписувати.** Для наступного експерименту створювати новий окремий `test/strumyk_plugin_v031_...js`.

## 3. Доведено реальними тестами (не плутати з припущеннями)

**Каталог, смартфон, v0.19 без Bridge:**
- 189 спортивних подій, параметризовані J/O/M/X/L (L/M доступні), HTML DOM static = 0.
- 56/56 телеканалів і EPG `Зараз / Далі`.
- Кількість 189 проти старих 196 не є доказом втрати 7 матчів без одночасного знімка каталогу.

**HTTP-заголовки:** Termux v0.18: стандартний urllib → HTTP 403 для J/X/O/EPG, Chrome-подібний UA → HTTP 200; додавання Referer не збільшило кількість подій у цьому тесті. UA/Referer — не заміна токенів, DRM або CORS.

**DRM-діагностика реального спортивного джерела (файли з попереднього чату):**
- Матч Vancouver Canucks — Minnesota Wild, обрана Ultra HD, EMBED у Chrome `https://strumyk.ca/e/vip/UK/premiersports1.php`, same-origin iframe без sandbox, реферер policy `no-referrer-when-downgrade`.
- Shaka Player 4.15.5, DASH `.../cenc.mpd` (HTTP 200), CDN `a122aivottlinear-a.akamaihd.net`, MP4-фрагменти 200, відео 1920×1080.
- `video.mediaKeys` присутній, `ClearKey` і `cenc` текстово присутні у скриптах. **Точна DRM-система спортивного потоку не доведена**, Shaka `getDrmInfo()` недоступний у попередній діагностиці. Не заявляти, що він точно ClearKey.
- Неробоче пряме `/e/vip/...` із 404 у Lampa не дорівнює доказу відсутності відео на сайті; EMBED має контекст першостороннього сайту.
- `blob:` — не URL потоку для VLC/MX. Тестові DASH-IF ClearKey ключі **ніколи не застосовувати до спортивних потоків**.

**HTTPS Android Lampa (вирішальний прогрес):**
- Стара Android Lampa на HTTP: `isSecureContext=false`, EME API `undefined`, хоча AndroidJS і native запити працюють.
- HTTPS-версія Lampa в окремому Chrome: `isSecureContext=true`, ClearKey EME `SUPPORTED`, але каталог порожній; `fetch` TypeError, `Lampa.Reguest.native` fallback AJAX.
- **ВСТАНОВЛЕНА Android Lampa після зміни її стартової URL на `https://bylampa.online/`:** `isSecureContext=true`, `navigator.requestMediaKeySystemAccess=function`, `ClearKey EME SUPPORTED`, `AndroidJS=object`, `Lampa.Reguest().native('/api/O.php')` отримав **JSON ARRAY 2 records**. Однак повний каталог на цій HTTPS-адресі треба ще підтвердити окремо.
- **Публічний ClearKey DASH-IF деморолик реально програвався** у власному `dashjs.MediaPlayer().create()` із `setProtectionData` через HTTPS Android Lampa: у v0.29 `PLAYBACK_OK`, кадри демонстраційного ролика до **01:36**, плеєр повідомляв `videoWidth 640×360` (текст усередині ролика мав 1920×1080, це інші вимірювання). Тобто кодова можливість DRM-демо доведена.
- **UI v0.29** на цьому екрані виправив перекриття нижньою панеллю Lampa; статус/кнопки Start/Stop/Close над компактним плеєром. Інші екрани не треба називати повністю перевіреними без тестів.
- **Помилка «Cannot read properties of null (reading 'destroy')», `extensions.onBack` ядра Lampa** виникала при Back з демоплеєра. v0.30 перемикає `Controller.toggle('content', true)`, відновлює stale-контролер; **користувач підтвердив, що виправлення працює («Все чітко»).**

## 4. Що НЕ вирішено
1. **Реальні спортивні потоки Strumyk не грають автономно у Lampa Player/VLC/MX** лише через наявність EMBED. Для захищеного DASH потрібен DRM-сумісний плеєр і дозволена конфігурація доступу. Ніяких обхідних схем DRM, вилучення ключів, підробки ліцензій/сесій.
2. **Телеканали:** EPG 56/56, але прямий відеопотік більшості каналів не доступний із каталогу; попередні спроби напряму відкрити `player.php?c=ID` показували `Dostęp zabroniony`. Для Eleven TV у браузері бачили HLS; це не гарантує зовнішнє відтворення.
3. **Повний спорткаталог і EPG на поточній HTTPS Android Lampa v0.30 потрібно реальним тестом підтвердити.**
4. Підтримку зовнішніх VLC/MX для конкретних медіаджерел треба перевіряти окремо, не вважати MPD/HTML достатнім.
5. Залишається потреба в ґрунтовних регресійних UI-тестах смартфон/ATV, уникаючи дубльованих системних `L.Input.edit` і закриття контролерів.

## 5. Важливі файли досліджень у GitHub
- `research/STRUMYK_APP_PLAYER_20261122_UA.md` — сайт бере `event._embeds`, сортує за мовою/якістю, створює `iframe.src = embed`; автоматичного виправлення 404 немає.
- `research/STRUMYK_SPORT_V024_DASH_SHaka_UA.md` — медіа-знімок DASH/Shaka.
- `research/STRUMYK_SPORT_V025_DRM_RESULTS_UA.md` — EME MediaKeys; DRM-система ще не доведена.
- `research/STRUMYK_SPORT_V026_HTTP_EME_RESULTS_UA.md` — HTTP без EME.
- `research/STRUMYK_V027_HTTPS_ANDROID_NATIVE_PLAN_UA.md` — шлях до HTTPS AndroidJS + EME.
- `research/STRUMYK_V029_HTTPS_CLEARKEY_REAL_PLAYBACK_UA.md` — дійсно запущене публічне ClearKey DASH відео.
- `test/README_V029_UI_LAYOUT_AUDIT_UA.md`, `test/README_V030_BACK_CONTROLLER_FIX_UA.md`.

## 6. Наступні завдання (новий чат)
1. Перш за все користувач перевіряє **v0.31 у встановленій HTTP Android Lampa**: спортивний каталог, 56-канальний TV/EPG, Back, нову перевірку маніфестів та результат у реальному плеєрі. Не стверджувати, що v0.31 працює на пристрої до тесту.
2. Продовжити один автономний JS для підтримуваного медіа: класифікація `clear HLS`, `HLS AES-128`, `HLS master/unknown`, `clear DASH`, `WEB embed`, `protected DASH/HLS`; не видавати WEB за прямий потік.
3. Для DRM — лише законний, підтримуваний провайдером механізм отримання ліцензій/ключів, без вилучення секретів та обходу захисту. При відсутності такого механізму явно зазначити технічне обмеження та залишити штатний сайт як запасний шлях.
4. Перед новою версією порівняти актуальні приватно надані діагностичні файли з джерелом, розглядати обмеження UA, Referer, CORS, Origin як окремі механізми.
5. Створювати нові тестові файли у `test/`, перевіряти JS-синтаксис, важливі парсери/навігацію, прив'язувати URL до конкретного commit SHA, **не перезаписувати** підтверджені віхи. Докладні українські інструкції без ПК.

## 7. Готовий запит для нового чату

> Продовжуємо проєкт STRUMYK SPORTS у репозиторії `sanzyscy/Beeeest`. Прочитай актуалізований `research/STRUMYK_SPORTS_HANDOFF_2026-11-22_UA.md`, README v0.31 і новий JS `test/strumyk_plugin_v031_http_manifest_guard_test.js`. **Остаточне рішення користувача: Lampa працює на HTTP; Strumyk.ca залишається HTTPS.** v0.30 — перевірений еталон, v0.31 — ще НЕ протестована користувачем і має guard для медіаманіфестів. Не пропонуй повертати Lampa на HTTPS без запиту. Не змінюй інший LiveTV та попередні еталони. Перше завдання — протестувати v0.31 на HTTP: каталог, TV/EPG, Back і конкретне дозволене HLS/DASH-відтворення. Успіх маніфесту не дорівнює успіху відео, DRM через HTTP EME недоступний у перевіреному WebView. Нові експерименти — лише новими файлами, без фантазій про DRM.
