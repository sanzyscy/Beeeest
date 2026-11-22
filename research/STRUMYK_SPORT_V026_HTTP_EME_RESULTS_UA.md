# STRUMYK SPORTS — реальна Lampa Uncensored v0.26, перевірка HTTP / EME (22.11.2026)

## Результат із пристрою користувача
Користувач виконав `v0.26.0-drm-capability-test` **в Android Lampa Uncensored** й надіслав скріншот.

Значення з екрану:
- Платформа (Lampa): **Android**
- Протокол фактичної сторінки `location.protocol`: **`http:`**
- `window.isSecureContext`: **false**
- UA: **Android WebView Chromium-family**
- `navigator.requestMediaKeySystemAccess`: **undefined**
- `window.MediaKeys`: **undefined**
- `window.MediaKeySession`: **undefined**
- `window.dashjs`: **object**
- `window.shaka?.Player`: **false**
- `Lampa.Player.play`: **function**
- `Lampa.PlayerVideo.url`: **function**
- `Lampa.AndroidJS`: **object**
- ClearKey EME test: **«API відсутній у WebView або недоступний в цьому контексті»** — метод не було можливо викликати.

## Точний висновок
1. На цій конкретній HTTP-сторінці браузерне **EME недоступне**. Це очікувано: метод `requestMediaKeySystemAccess` є `[SecureContext]` у специфікації W3C. HTTPS-iframe всередині HTTP-батька теж не стає захищеним контекстом. Посилання: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts та https://developer.mozilla.org/en-US/docs/Web/API/Navigator/requestMediaKeySystemAccess.
2. Присутність `dashjs` не розв'язує проблему відсутнього EME/DRM. Публічний код Lampa `src/interaction/player/video/dash.js` використовує `dashjs.MediaPlayer().create()` і `initialize(videoEl, src, true)` без явної DRM-конфігурації; конкретний runtime форка може мати власні зміни.
3. **Не слід робити висновок, що сам Android не підтримує DRM**: той самий смартфон через HTTPS Chrome відтворював MPEG-DASH/Shaka із `video.mediaKeys` і `readyState=4`.
4. **Не доведено, що конкретна DRM-система ClearKey**; текст `clearkey` у сайті є, але `getDrmInfo()` не доступний. Не підміняти цей факт твердженням про доведені ліцензійні механізми.
5. На `bylampa/lampa` у `plugins/modification.js` присутній `Lampa.Storage.set('protocol','http')`; це значення впливає на налаштування мережевих запитів, але **не тотожне** зміні `location.protocol` уже завантаженої сторінки. На скріншоті `location.protocol=http:` перевірено окремо.

## Наступна перевірка
- Спробувати відкрити **`https://bylampa.online/` у Chrome** окремо від наявної Android-програми, за потреби встановивши в цій web-версії лише тестовий `v0.26`. Переконатися, що URL не перенаправляється на HTTP.
- Повторити `DASH / DRM діагностика`: `Протокол сторінки=https:`, `Secure Context=true`, після цього перевірити доступність `requestMediaKeySystemAccess` та ClearKey. Це тест можливостей, **не** відтворення захищеного контенту.
- HTTPS може блокувати старі HTTP-ресурси як mixed content; тестувати на окремій вебсесії, не змінювати продакшн-настроювання основної Lampa без копії.
- Якщо ClearKey EME у HTTPS-контексті доступний, наступне завдання — перевірити, чи підтримує Lampa передачу **дозволеної** DRM-конфігурації для відповідного контенту. Не добувати / не вшивати ключі, ліцензійні адреси, токени чи PSSH.
- Якщо у HTTPS WebView EME недоступний, причиною може бути сама оболонка чи CDM. У цьому випадку внутрішній JS-DRM-плеєр не працюватиме лише від зміни заголовків; потрібен підтримуваний DRM-клієнт з правом доступу.

## Межі змін
Робочі v0.14 / v0.19 та дослідницькі v0.21–v0.26 не змінено; нову «робочу версію відео» не випущено. Потрібен фактичний тест на пристрої.
