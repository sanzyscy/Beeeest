# STRUMYK SPORTS v0.26 — перевірка DRM у Lampa Uncensored

## Мета
Перевірити **можливості фактичної оболонки**, в якій користувач запускає Lampa Uncensored. Це не плагін для обходу DRM і не готовий відеоплеєр.

## Чому
У спортивному звіті v0.24 матч Vancouver Canucks — Minnesota Wild грав на `https://strumyk.ca/e/vip/UK/premiersports1.php`, через Shaka Player 4.15.5, DASH `cenc.mpd` і MP4-фрагменти з Akamai (HTTP 200). Звіт v0.25 підтвердив `video.mediaKeys != null` (EME), але **точну систему DRM `getDrmInfo()` не визначено**, тому ClearKey лише дуже ймовірний.

У публічному вихідному коді `yumata/lampa-source/src/interaction/player/video/dash.js` (перевірено 22.11.2026) стандартний DASH-модуль просто робить `dashjs.MediaPlayer().create()`, далі `initialize(videoEl, src, true)`. Прямого `setProtectionData()` або ліцензійної конфігурації немає. **Це не доводить відсутність підтримки всіх DRM-сценаріїв**: деякі MPD можуть сигналізувати ліцензійний endpoint та працювати без додаткової конфігурації, згідно з документацією dash.js. Форк Lampa Uncensored також може мати власні зміни.

У репо `bylampa/lampa`, `plugins/modification.js`, є `Lampa.Storage.set('protocol','http')`. Це лише конфігураційне значення — фактичний протокол і secure-context перевіряємо у виконуваній Lampa.

## Тестова версія
`https://cdn.jsdelivr.net/gh/sanzyscy/Beeeest@4f0ccfcd887fd204c8991909659708968dd1845c/test/strumyk_plugin_v026_drm_capability_test.js`

База — v0.23: не змінені автономний спорт-каталог, TV EPG 56, пошук v0.21, діагностика WEB-джерел. Жодного Bridge. Всі раніше опубліковані версії залишено без змін.

## Як користуватися
1. Вимкнути попередній STRUMYK, повністю перезапустити Lampa, встановити тільки v0.26.
2. Відкрити **STRUMYK → ⚙ Налаштування → DASH / DRM діагностика**.
3. Зробити скріншот інформації про `Протокол`, `Secure Context`, `requestMediaKeySystemAccess`, `dashjs`, `Lampa.Player.play`.
4. Натиснути **«🔎 Перевірити ClearKey EME»**, отримати **SUPPORTED / NOT SUPPORTED / BLOCKED / TIMEOUT**. Запит лише до системного API можливостей `requestMediaKeySystemAccess('org.w3.clearkey', ...)`, без створення MediaKeys, DRM-сесій, ліцензій чи відеозапитів. Тестові конфігурації AVC/AAC стандартні; помилка означає лише недоступність *цих* конфігурацій.
5. Надіслати один скріншот результату.

## Як тлумачити
- `Secure Context=false` та EME API відсутній: **браузерне DRM-відтворення з цього середовища може бути недоступним**, навіть коли Chrome на HTTPS відтворює.
- `EME=SUPPORTED`: WebView підтримує тестовий ClearKey, але **це не означає**, що `Lampa.Player.play({url: '.mpd'})` правильно передає DRM/ліцензію конкретного потоку.
- `dashjs=object`: бібліотека є, але з цього самого по собі не випливає, що її екземпляр підключений до потрібного DRM.
- Для **Android Media3/ExoPlayer** ClearKey CENC DASH підтримується на відповідних версіях Android, але тільки за наявності належної DRM-конфігурації та дозволеного доступу до контенту.
- **VLC/MX**: жодної підтримки саме цього захищеного MPD ще не підтверджено. Простого `User-Agent`/`Referer` недостатньо.

## Важлива безпека
Ніяких ключів, PSSH, KID, license URL, cookies, токенів, підписів чи DRM-сесій. Не зберігати їх у публічному GitHub. Тест нічого не відтворює — це саме перевірка функцій оболонки.

## Перевірки перед публікацією
- JS синтаксис: PASS.
- Ядро парсера доступне як у v0.23, версія `0.26.0-drm-capability-test`: PASS.
- Формування read-only звіту для mock HTTP та HTTPS контекстів: PASS.
- Реальний `requestMediaKeySystemAccess` у Lampa Uncensored на телефоні: **ще НЕ перевірено**.

## Офіційні документи
- [Android Media3 ExoPlayer DRM](https://developer.android.com/media/media3/exoplayer/drm)
- [dash.js DRM](https://dashif.org/dash.js/pages/usage/drm.html)
- [Shaka DRM Configuration](https://shaka-project.github.io/shaka-player-release/docs/api/tutorial-drm-config.html)
