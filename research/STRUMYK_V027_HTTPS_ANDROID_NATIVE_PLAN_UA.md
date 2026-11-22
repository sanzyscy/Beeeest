# STRUMYK — шлях до HTTPS + нативних API в ОДНІЙ Android Lampa

**22.11.2026.** Після реального тесту користувача на HTTPS Chrome (`STRUMYK 0.27`) зафіксовано:
- `https:`, `isSecureContext=true`, `ClearKey EME: SUPPORTED`.
- `Chrome fetch: ERROR TypeError`, `Lampa native: ERROR Error`, каталог порожній.
- Ці помилки **не доводять дві різні причини**.

## Факти з вихідного коду Lampa

`androschuk/lampa-source/src/utils/reguest.js`:
```js
function native(params){
    if(Platform.is('android')) android_go(params)
    else go(params)
}
```
`go(params)` використовує `$.ajax(data)`, тобто браузерний XHR. `android_go(params)` передає роботу в `Android.httpReq()`, який в Android-оболонці викликає `AndroidJS.httpReq()`.

`androschuk/lampa-source/src/core/platform.js` встановлює Android-платформу, коли UA містить `lampa_client`.

`lampa-app/LAMPA/app/src/main/java/top/rootu/lampa/MainActivity.kt`:
- На запуску реєструє `addJavascriptInterface(AndroidJS(...), "AndroidJS")` та додає `lampa_client` до User-Agent, **до** `browser?.loadUrl(LAMPA_URL)`.
- Меню `showMenuDialog()` доступне через довге натискання Back або кнопку Menu; містить `showUrlInputDialog`.
- `handleSaveButtonClick` приймає валідний URL і передає його у `browser?.loadUrl(LAMPA_URL)`; у дослідженому коді немає вимоги примусового HTTP у цьому місці.
- Фактична версія встановленого APK користувача та його налаштування можуть відрізнятися.

Отже, **реальний кандидат на поєднання можливостей** — змінити стартовий URL у ВСТАНОВЛЕНІЙ Android Lampa з HTTP на `https://bylampa.online/`. Тоді потенційно: `AndroidJS` → доступний нативний HTTP-клієнт (каталог); HTTPS → Secure Context і, якщо Android System WebView має EME, DRM-можливості.

Це **гіпотеза, яку потрібно перевірити на самому APK**, а не підтверджений факт роботи EME чи відео.

## Безпечна перевірка (без змін плагіна або нового сервера)

1. Записати чинний стартовий URL Lampa, зробити резервну копію налаштувань (якщо доступно) та не очищати дані застосунку.
2. У встановленій Android Lampa: меню оболонки (на телефоні часто плаваюча кнопка Lampa знизу ліворуч; на ATV довге Back / Menu) → **«Змінити адресу Lampa»**.
3. Увести **`https://bylampa.online/`** (повний URL), застосувати. Не плутати з `Lampa.Storage.set('protocol','http')`: воно не змінює `window.location.protocol` поточної сторінки.
4. Через інший origin (`http` → `https`) старі плагіни та налаштування localStorage можуть не відобразитися. Це не означає, що дані стерто. Встановити один тестовий `STRUMYK v0.27` за pinned URL:
   `https://cdn.jsdelivr.net/gh/sanzyscy/Beeeest@397a24d87421cef9ef8507ec4b8d0fe8020314ca/test/strumyk_plugin_v027_network_drm_diag_test.js`
5. У плагіні: ⚙ → DASH/DRM → натиснути тест ClearKey і тест мережі. Очікувані ознаки: `location.protocol=https:`, `isSecureContext=true`, `Lampa.AndroidJS=object`; далі перевірити `ClearKey SUPPORTED` і `Lampa native: JSON ARRAY`, а також відображення розкладу/EPG.
6. Якщо `EME` не підтримується навіть у HTTPS Android WebView, **HTTPS сам по собі не виправить DRM**. Можлива потреба у DRM-сумісній нативній Media3/ExoPlayer інтеграції з ліцензійним доступом.
7. Якщо HTTPS-сайт не відкрився або виникли проблеми, повернути попередній стартовий URL у тому самому меню. Сховища `http` і `https` можуть бути різними; відсутність плагінів у новому origin не є видаленням старих.

## Критичні межі
- Браузер Chrome із HTTPS **не має** `AndroidJS`, тому `Lampa.Reguest.native()` в стандартному Lampa fallback переходить на `$.ajax`, підкорений CORS. **В обох повідомлень ERROR у Chrome не було двох незалежних транспортів.**
- `fetch` у HTTPS Chrome може отримати `TypeError` із CORS або іншої мережевої причини, тому сам скріншот не доводить, що на стороні Strumyk точно немає `Access-Control-Allow-Origin`.
- Базова підтримка ClearKey EME ≠ придатність потоків Shaka у Lampa, відсутній підтверджений доступ до DRM-ліцензії для стороннього плеєра. VLC/MX плеєри не підтверджені.
- Не публікувати ключі, токени, підписані URL, не підробляти контекст Strumyk; реалізувати лише підтримувані способи доступу.

## Вихідний код
- https://github.com/androschuk/lampa-source/blob/main/src/utils/reguest.js
- https://github.com/androschuk/lampa-source/blob/main/src/core/platform.js
- https://github.com/lampa-app/LAMPA/blob/main/app/src/main/java/top/rootu/lampa/MainActivity.kt
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
