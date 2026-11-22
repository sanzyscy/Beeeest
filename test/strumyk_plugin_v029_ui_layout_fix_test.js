/* STRUMYK for Lampa — DRM capability diagnostic test build 0.26.0
 * Site: https://strumyk.ca/  |  No background proxy, no DRM bypass.
 * One-file installation. This build intentionally reports unknown site API instead of inventing streams.
 */
(function (global, factory) {
    'use strict';
    var api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (global) {
        global.StrumykCore = api;
        if (global.Lampa && global.document && global.jQuery) api.install(global);
    }
}(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null), function () {
    'use strict';
    var VERSION='0.29.0-viewport-layout-fix-test';
    var DEFAULT_HOST = 'https://strumyk.ca/';
    var MAX_SCAN = 4000;
    var LABELS = {
        uk: {gate:'Замість розкладу сайт повернув проміжний екран «Перевіряємо з’єднання». Потрібна діагностика з браузера.',schedule:'Розклад', live:'Наживо', fav:'Обране', settings:'Налаштування', refresh:'Оновити', filters:'Фільтри', search:'Пошук команд і ліг', sports:'Вид спорту', leagues:'Ліга', dates:'Дата', all:'Усі', today:'Сьогодні', tomorrow:'Завтра', yesterday:'Вчора', status:'Статус', upcoming:'Незабаром', finished:'Завершено', sources:'Джерела трансляції', language:'Мова інтерфейсу', sourceLanguage:'Мова трансляції', player:'Плеєр', inner:'Програмний', external:'Зовнішній (Android: VLC / MX Player)', ask:'Запитувати', openSite:'Відкрити на сайті', noSources:'Наразі немає підтверджених джерел для цієї події', unavailable:'Не вдалося отримати структуру подій з сайту', diagnostics:'Діагностика', probe:'Потрібен зразок відповіді сайту / API для прив’язки парсера', reload:'Спробувати ще', missing:'Дані для розкладу не знайдено', back:'Назад', favorites:'Додати до обраного', unfavorite:'Прибрати з обраного', noEvents:'За поточними фільтрами подій немає', quality:'Якість', unknown:'Не вказано', website:'Сайт', selected:'Обрано', sport:'Спорт', filterReset:'Очистити фільтри', time:'Час', siteTime:'Як на сайті', localTime:'Місцевий', mode:'Режим', siteHost:'Домен сайту', changeHost:'Змінити домен', about:'Про проєкт', browser:'Браузер', noData:'Не завантажено жодної події', sourceType:'Тип джерела', typeAll:'Усі джерела', name:'Назва', httpError:'Помилка мережі', confirm:'OK', manual:'Вставити тестовий JSON', invalidJson:'Некоректний JSON або в ньому немає подій', help:'Інструкція', match:'Подія', count:'Подій', group:'Категорія', full:'Повний список', unverified:'Джерело не перевірено', play:'Відтворити', cancelled:'Скасовано', updated:'Оновлено'},
        ru: {gate:'Вместо расписания сайт вернул промежуточный экран «Проверяем соединение». Нужна диагностика из браузера.',schedule:'Расписание', live:'В эфире', fav:'Избранное', settings:'Настройки', refresh:'Обновить', filters:'Фильтры', search:'Поиск команд и лиг', sports:'Вид спорта', leagues:'Лига', dates:'Дата', all:'Все', today:'Сегодня', tomorrow:'Завтра', yesterday:'Вчера', status:'Статус', upcoming:'Скоро', finished:'Завершено', sources:'Источники трансляции', language:'Язык интерфейса', sourceLanguage:'Язык трансляции', player:'Плеер', inner:'Встроенный', external:'Внешний (Android: VLC / MX Player)', ask:'Спрашивать', openSite:'Открыть на сайте', noSources:'Подтвержденных источников для этого события пока нет', unavailable:'Не удалось получить структуру событий с сайта', diagnostics:'Диагностика', probe:'Нужен образец ответа сайта / API для подключения парсера', reload:'Попробовать снова', missing:'Данные расписания не найдены', back:'Назад', favorites:'В избранное', unfavorite:'Убрать из избранного', noEvents:'По выбранным фильтрам событий нет', quality:'Качество', unknown:'Не указано', website:'Сайт', selected:'Выбрано', sport:'Спорт', filterReset:'Сбросить фильтры', time:'Время', siteTime:'Как на сайте', localTime:'Местное', mode:'Режим', siteHost:'Домен сайта', changeHost:'Изменить домен', about:'О проекте', browser:'Браузер', noData:'Нет загруженных событий', sourceType:'Тип источника', typeAll:'Все источники', name:'Название', httpError:'Ошибка сети', confirm:'OK', manual:'Вставить тестовый JSON', invalidJson:'Некорректный JSON или нет событий', help:'Инструкция', match:'Событие', count:'Событий', group:'Категория', full:'Полный список', unverified:'Источник не проверен', play:'Воспроизвести', cancelled:'Отменено', updated:'Обновлено'},
        pl: {gate:'Zamiast terminarza witryna zwróciła ekran „Sprawdzamy połączenie”. Potrzebna diagnostyka z przeglądarki.',schedule:'Terminarz', live:'Na żywo', fav:'Ulubione', settings:'Ustawienia', refresh:'Odśwież', filters:'Filtry', search:'Szukaj drużyn i lig', sports:'Dyscyplina', leagues:'Liga', dates:'Data', all:'Wszystkie', today:'Dzisiaj', tomorrow:'Jutro', yesterday:'Wczoraj', status:'Status', upcoming:'Nadchodzące', finished:'Zakończone', sources:'Źródła transmisji', language:'Język interfejsu', sourceLanguage:'Język transmisji', player:'Odtwarzacz', inner:'Wbudowany', external:'Zewnętrzny (Android: VLC / MX Player)', ask:'Pytaj', openSite:'Otwórz na stronie', noSources:'Brak potwierdzonych źródeł transmisji', unavailable:'Nie udało się pobrać danych wydarzeń', diagnostics:'Diagnostyka', probe:'Potrzebna próbka odpowiedzi strony / API do połączenia parsera', reload:'Spróbuj ponownie', missing:'Nie znaleziono harmonogramu', back:'Wróć', favorites:'Dodaj do ulubionych', unfavorite:'Usuń z ulubionych', noEvents:'Brak wydarzeń dla wybranych filtrów', quality:'Jakość', unknown:'Nie podano', website:'Strona', selected:'Wybrano', sport:'Sport', filterReset:'Wyczyść filtry', time:'Czas', siteTime:'Czas strony', localTime:'Lokalny', mode:'Tryb', siteHost:'Domena', changeHost:'Zmień domenę', about:'O projekcie', browser:'Przeglądarka', noData:'Brak wczytanych wydarzeń', sourceType:'Typ źródła', typeAll:'Wszystkie źródła', name:'Nazwa', httpError:'Błąd sieci', confirm:'OK', manual:'Wklej próbny JSON', invalidJson:'Niepoprawny JSON lub brak wydarzeń', help:'Instrukcja', match:'Wydarzenie', count:'Wydarzeń', group:'Kategoria', full:'Pełna lista', unverified:'Źródło niezweryfikowane', play:'Odtwórz', cancelled:'Anulowano', updated:'Odświeżono'}
    };
    function t(lang, key) { return (LABELS[lang] || LABELS.uk)[key] || LABELS.uk[key] || key; }
    function clean(s) { return String(s === undefined || s === null ? '' : s).replace(/\s+/g, ' ').trim(); }
    function str(v) { return typeof v === 'string' || typeof v === 'number' ? clean(v) : ''; }
    function first(o, keys) { if (!o || typeof o !== 'object') return ''; for (var i=0;i<keys.length;i++) { var value=o[keys[i]]; if (value !== undefined && value !== null && value !== '') { var s=str(value); if(s) return s; if(value && typeof value === 'object') { s=str(value.name || value.title || value.label); if(s) return s; } } } return ''; }
    function unique(a) { var seen={}; return a.filter(function (v) { var k=String(v); if(seen[k]) return false; seen[k]=true; return true; }); }
    function safeUrl(raw, base) {
        var v=clean(raw); if(!v) return '';
        if (/^acestream:\/\/(?:[a-f0-9]{40})$/i.test(v)) return v;
        try { var u = new URL(v,base||DEFAULT_HOST); if (!/^https?:$/.test(u.protocol) || u.username || u.password || /^(localhost|127\.|10\.|192\.168\.|169\.254\.)/i.test(u.hostname)) return ''; return u.href; } catch(e) { return ''; }
    }
    function hostOf(url) { try { return new URL(url).hostname; } catch(e) { return ''; } }
    function normalizeHost(value) { var url=safeUrl(value); if(!url) return ''; var u=new URL(url); if(u.protocol!=='https:' || u.username || u.password || u.port || u.pathname!=='/' || u.search || u.hash || !/^(?:strumyk\.(?:ca|cv|st|cc|vip|help|icu|cfd))$/i.test(u.hostname)) return ''; return u.origin+'/'; }
    function eventUrl(raw, host, id) { /* Always prefer the official event SPA route, never an embedded /e/vip/ link. */ var base=normalizeHost(host)||DEFAULT_HOST,token=clean(id);if(/^[A-Za-z0-9_-]{4,80}$/.test(token))return base+'#'+encodeURIComponent(token);return base; }
    function stamp(raw) { if(typeof raw==='number' && Number.isFinite(raw)) return raw > 1e12 ? raw : raw > 1e9 ? raw*1000 : null; if(typeof raw!=='string')return null; var v=raw.trim(); if(/^\d{13}$/.test(v))return Number(v);if(/^\d{10}$/.test(v))return Number(v)*1000; var d=Date.parse(v); return Number.isFinite(d) && /\d{4}[-/]/.test(v)?d:null; }
    function kind(url) { var u=clean(url).toLowerCase(); if(/^acestream:/.test(u))return 'acestream'; if(/(?:youtube\.com\/watch|youtu\.be\/|youtube\.com\/embed\/)/.test(u))return 'youtube'; if(/\.m3u8(?:[?#]|$)/.test(u))return 'hls'; if(/\.mpd(?:[?#]|$)/.test(u))return 'dash'; if(/\.(?:mp4|mkv|webm)(?:[?#]|$)/.test(u))return 'file'; return 'web'; }
    function mediaSource(value, base, inherited) {
        var raw=typeof value==='string'?{url:value}:value;
        if(!raw || typeof raw!=='object' || Array.isArray(raw))return null;
        var link=first(raw,['url','src','stream','link','hls','file','playlist','embed','playerUrl','player_url','watchUrl','watch_url','iframe']);
        if(!link && raw.type === 'youtube') {var id=first(raw,['videoId','video_id','id']); if(/^[a-zA-Z0-9_-]{11}$/.test(id))link='https://www.youtube.com/watch?v='+id;}
        link=safeUrl(link,base); if(!link)return null;
        var label=first(raw,['provider','name','title','label','server','channel','source']) || (inherited || hostOf(link) || 'stream');
        var lang=first(raw,['language','lang','audioLanguage','audio_language']);
        var quality=first(raw,['quality','resolution','height','labelQuality']);
        var headers={}; if(raw.headers && typeof raw.headers==='object' && !Array.isArray(raw.headers)) Object.keys(raw.headers).forEach(function(key) { if(/^(referer|origin|user-agent)$/i.test(key)&&typeof raw.headers[key]==='string')headers[key]=raw.headers[key]; });
        return {url:link,name:label,language:lang,quality:quality,type:kind(link),headers:headers};
    }
    /* Actual Strumyk API shape from /js/strumyk-app.js captured 2026-11-21:
       e._embeds = [{language:"Polski | CANAL+ Sport", embeds:[{label:"FHD",embed:"https://..."}]}].
       These are mostly embedded WEB pages, not direct streams. */
    function actualEmbeds(raw, base) {
        if (!raw || !Array.isArray(raw._embeds)) return [];
        var result=[],seen=Object.create(null);
        raw._embeds.forEach(function(group) {
            if (!group || typeof group!=='object') return;
            var title=str(group.language) || 'Inne', parts=title.split('|');
            var lang=clean(parts[0]) || 'Inne', channel=clean(parts.slice(1).join('|')) || '';
            var entries=group.embeds || [];
            if (!Array.isArray(entries)) entries=typeof entries==='object'?Object.keys(entries).map(function(k){return entries[k];}):[];
            entries.forEach(function(entry) {
                if (!entry || typeof entry!=='object') return;
                var link=safeUrl(str(entry.embed),base);
                if (!link) return;
                var quality=str(entry.label) || 'unknown';
                var key=[link,lang,channel,quality].join('|');
                if (seen[key])return;seen[key]=true;
                result.push({url:link,name:channel||hostOf(link),language:lang,quality:quality,
                    type:kind(link),headers:{},sourceLanguageRaw:title});
            });
        });
        return result;
    }
    function strumykTitle(t) {
        if (typeof t==='string')return clean(t);
        if(!t || typeof t!=='object')return '';
        var v=t.pl || t.en || {};
        var a=clean(v.home),b=clean(v.away);
        return a && b ? a+' – '+b : a || b || '';
    }
    var SOURCE_KEYS=['streams','sources','links','broadcasts','players','channels','mirrors','watch','streamLinks','stream_links','streaming','videoSources','video_sources'];
    function extractSources(obj, base) {
        var result=[], seen={}, total=0;
        function add(raw, label) { var s=mediaSource(raw,base,label);if(!s)return;var key=s.url+'|'+s.language+'|'+s.quality; if(!seen[key]){seen[key]=true;result.push(s);} }
        function walk(node,depth,label) {
            if(++total>MAX_SCAN || depth>5 || !node)return;
            if(typeof node==='string') {add(node,label);return;}
            if(Array.isArray(node)) {node.forEach(function(n){walk(n,depth+1,label);});return;}
            if(typeof node!=='object')return;
            var single=mediaSource(node,base,label);if(single)add(node,label);
            SOURCE_KEYS.forEach(function(k){ if(node[k])walk(node[k],depth+1,k); });
        }
        SOURCE_KEYS.forEach(function(k){if(obj && obj[k])walk(obj[k],0,k);});
        return result;
    }
    var SPORTS_V012 = [
      ['Футбол',/^(?:pilkanozna|football|soccer|футбол)$/i],
      ['Хокей',/^(?:hokej|hockey|хокей)$/i],
      ['Баскетбол',/^(?:koszykowka|basketball|баскетбол)$/i],
      ['Теніс',/^(?:tenis|tennis|теніс)$/i],
      ['Волейбол',/^(?:siatkowka|volleyball|волейбол)$/i],
      ['Бокс',/^(?:boks|boxing|box|бокс)$/i],
      ['MMA',/^(?:mma|ufc|mixedmartialarts)$/i],
      ['Формула 1',/^(?:formula1|f1|formula 1)$/i],
      ['Автоспорт',/^(?:motorsport|motorsports|автоспорт)$/i],
      ['Мотоспорт',/^(?:motogp|motorcycle|мотоспорт)$/i],
      ['Дартс',/^(?:dart|darts|дартс)$/i],
      ['Снукер',/^(?:snooker|снукер)$/i],
      ['Гандбол',/^(?:pilkareczna|handball|гандбол)$/i],
      ['Американський футбол',/^(?:futbolamerykanski|americanfootball|nfl)$/i],
      ['Футзал',/^(?:futsal|футзал)$/i],
      ['Зимові види спорту',/^(?:skokinarciarskie|narciarstwo|biathlon|lyzwiarstwofigurowe|shorttrack)$/i],
      ['Гольф',/^(?:golf|гольф)$/i],
      ['Бадмінтон',/^(?:badminton|бадмінтон)$/i],
      ['Кіберспорт',/^(?:esport|esports|e-sport)$/i]
    ];
    function canonicalSport(s) {var v=clean(s);for(var i=0;i<SPORTS_V012.length;i++){if(SPORTS_V012[i][1].test(v))return SPORTS_V012[i][0];}return v;}
    function sportOptions(list) {
      var used=Object.create(null),extras=[];
      (list||[]).forEach(function(e){var c=canonicalSport(e&&e.sport);if(c&&!used[c]){used[c]=1;extras.push(c);}});
      var presets=SPORTS_V012.map(function(x){return x[0];}).filter(function(x){return !!used[x];});
      extras.forEach(function(x){if(presets.indexOf(x)<0)presets.push(x);});
      return presets;
    }
    function normalizeEvent(raw, base) {
        if(!raw || typeof raw!=='object'||Array.isArray(raw))return null;
        var home=first(raw,['homeTeam','home_team','team1','home','competitor1','participant1']);
        var away=first(raw,['awayTeam','away_team','team2','away','competitor2','participant2']);
        var name=strumykTitle(raw.title) || first(raw,['name','match','eventName','event_name','eventTitle','event_title','description']) || (home && away ? home+' — '+away : '');
        if(!name || name.length>250)return null;
        var id=first(raw,['hash','eventId','event_id','matchId','match_id','slug','id','uid']);
        var page=first(raw,['pageUrl','page_url','eventUrl','event_url','href','permalink']);
        if(!id && page.indexOf('#')>=0) id=page.split('#').pop();
        var sport=canonicalSport(first(raw,['sport','sportName','sport_name','discipline','category','sportTitle']));
        var league=first(raw,['league','leagueName','league_name','competition','tournament','tournamentName']);
        var time=null;['startTime','start_time','startDate','start_date','start','timestamp','date','time','kickoff','scheduledAt','scheduled_at','startsAt'].some(function(k){if(raw[k]!==undefined){time=stamp(raw[k]);return time!==null;}return false;});
        var timeLabel=first(raw,['timeLabel','time_label','displayTime','display_time','date','time','kickoff']);
        var status=first(raw,['status','state','matchStatus','match_status']).toLowerCase();
        var live=raw.isLive===true || raw.live===true || /^(live|in_progress|ongoing|playing|trwa|na żywo|na zywo)$/.test(status);
        var finished=raw.finished===true || /^(finished|ended|completed|ft|koniec|zakończony)$/.test(status);
        var sources=extractSources(raw,base).concat(actualEmbeds(raw,base));
        // Reject accidental navigation labels and unrelated nested objects.
        if(!id && !page && !home && !away && !time && !sources.length)return null;
        var identity=id || page || [name,sport,league,timeLabel].join('|');
        return {id:String(identity),title:name,home:home,away:away,sport:sport,league:league,start:time,timeLabel:timeLabel,live:live,finished:finished,status:status,sources:sources,url:eventUrl(page,base,id),score:first(raw,['score','result'])};
    }
    var EVENT_KEYS=['events','matches','fixtures','games','schedule','data','items','results','list','today','tomorrow','live','upcoming','categories','sports','leagues'];
    function extractEvents(data, base) {
        var out=[], map={}, traversed=0, visited=[];
        function walk(v,depth) {
            if(!v || typeof v!=='object' || depth>9 || ++traversed>MAX_SCAN)return;
            if(visited.indexOf(v)!==-1)return; visited.push(v);
            if(Array.isArray(v)){v.forEach(function(c){walk(c,depth+1);});return;}
            var e=normalizeEvent(v,base);
            if(e){ if(!map[e.id]){map[e.id]=e;out.push(e);}else {
                var old=map[e.id]; if(e.sources.length){var prev=old.sources;old.sources=prev.concat(e.sources).filter(function(src,index,arr){return arr.findIndex(function(x){return x.url===src.url && x.language===src.language && x.quality===src.quality;})===index;});}
                if(!old.start && e.start)old.start=e.start;
            }}
            EVENT_KEYS.forEach(function(k){if(v[k] && typeof v[k]==='object')walk(v[k],depth+1);});
        }
        walk(data,0);
        return out.sort(function(a,b){if(a.live!==b.live)return a.live?-1:1;return (a.start||Number.MAX_SAFE_INTEGER)-(b.start||Number.MAX_SAFE_INTEGER);});
    }
    /* Mirrors the actual /js/strumyk-app.js bundle order J, O, M, X, L.
       Distinct records with the same ID take the first record, as on the site. */
    function parseStrumykApiBundle(bundle, base, atMs, liveWindowMin) {
        if(!bundle || typeof bundle!=='object')return [];
        var when=Number.isFinite(atMs)?atMs:Date.now();
        var windowMs=(Number.isFinite(liveWindowMin) && liveWindowMin>0?liveWindowMin:150)*60000;
        var seen=Object.create(null),out=[];
        var popular=Object.create(null);
        (Array.isArray(bundle.J)?bundle.J:[]).forEach(function(e){if(e && e.id) popular[String(e.id)]=true;});
        ['J','O','M','X','L','D'].forEach(function(source){
            var entries=Array.isArray(bundle[source])?bundle[source]:[];
            entries.forEach(function(raw){
                if(!raw || typeof raw!=='object'||Array.isArray(raw))return;
                var id=str(raw.id);if(!id)return;
                var ev=normalizeEvent(raw,base||DEFAULT_HOST);
                if(seen[id]){
                    // Additional APIs can return only id + _embeds (no title).
                    // Accept source-only variants for known events without adding fake events.
                    var prev=seen[id],keys=Object.create(null);
                    var incoming=ev?ev.sources:extractSources(raw,base||DEFAULT_HOST).concat(actualEmbeds(raw,base||DEFAULT_HOST));
                    (prev.sources||[]).forEach(function(x){keys[[x.url,x.language,x.quality,x.name].join('|')]=true;});
                    (incoming||[]).forEach(function(x){
                        var key=[x.url,x.language,x.quality,x.name].join('|');
                        if(!keys[key]&&prev.sources.length<60){keys[key]=true;prev.sources.push(x);}
                    });
                    if(ev&&!prev.league&&ev.league)prev.league=ev.league;
                    return;
                }
                if(!ev)return;
                seen[id]=ev;
                ev.apiSource=source;ev.popular=!!popular[id];
                if(!ev.home && raw.title && typeof raw.title==='object'){
                    var title=raw.title.pl || raw.title.en || {};
                    ev.home=str(title.home);ev.away=str(title.away);
                }
                ev.sport=canonicalSport(ev.sport);
                if(!ev.league && raw.tournament && typeof raw.tournament==='object')ev.league=str(raw.tournament.name);
                var end=stamp(raw.endTime);
                if(ev.start){
                    if(when<ev.start){ev.live=false;ev.finished=false;ev.status='upcoming';}
                    else if(end){ev.live=when<end;ev.finished=when>=end;ev.status=ev.live?'live':'ended';}
                    else if(source==='L'||source==='M'){
                        ev.live=(when-ev.start)<windowMs;ev.finished=!ev.live;ev.status=ev.live?'live':'ended';
                    }else{ev.live=true;ev.finished=false;ev.status='live';}
                }
                out.push(ev);
            });
        });
        return out.sort(function(a,b){
            if(a.live!==b.live)return a.live?-1:1;
            return (a.start||Number.MAX_SAFE_INTEGER)-(b.start||Number.MAX_SAFE_INTEGER);
        });
    }
    function detectGate(html) {
        if (typeof html !== 'string') return false;
        return /Sprawdzamy\s+połączenie/i.test(html) &&
            /class\s*=\s*[\"'][^\"']*\bgate\b/i.test(html) &&
            /location\.reload\s*\(/i.test(html);
    }
    /* Verified against user capture, 2026-11-21: #schedList > .sched-group/.sched-item.
       Preserve case-sensitive data-id and the site-provided team names. */
    function readScheduleDocument(doc, base, capturedAt) {
        var schedule=doc.querySelector('#schedList');
        if(!schedule)return [];
        var now=new Date(Number.isFinite(capturedAt)?capturedAt:Date.now());
        var months={stycznia:0,lutego:1,marca:2,kwietnia:3,maja:4,czerwca:5,lipca:6,sierpnia:7,wrzesnia:8,pazdziernika:9,listopada:10,grudnia:11};
        var date=new Date(now.getFullYear(),now.getMonth(),now.getDate());
        var group='';
        var out=[],seen=Object.create(null),children=schedule.children||[];
        for(var i=0;i<children.length;i++) {
            var node=children[i],cn=' '+(typeof node.className==='string'?node.className:'')+' ';
            if(cn.indexOf(' sched-group ')>=0) {
                group=clean(node.textContent||'');
                var key=group.toLocaleLowerCase();
                date=new Date(now.getFullYear(),now.getMonth(),now.getDate());
                if(/\b(jutro|завтра|tomorrow)\b/i.test(key))date.setDate(date.getDate()+1);
                else if(/\b(pojutrze|післязавтра|послезавтра)\b/i.test(key))date.setDate(date.getDate()+2);
                else if(/\b(wczoraj|вчора|вчера|yesterday)\b/i.test(key))date.setDate(date.getDate()-1);
                else {
                    var match=key.match(/\b(\d{1,2})\s+([a-ząćęłńóśźż]+)(?:\s+(\d{4}))?/i);
                    if(match){var monthToken=match[2].normalize?match[2].normalize('NFD').replace(/[\u0300-\u036f]/g,''):match[2];
                        if(Object.prototype.hasOwnProperty.call(months,monthToken))date=new Date(match[3]?Number(match[3]):now.getFullYear(),months[monthToken],Number(match[1]));}
                }
                continue;
            }
            if(cn.indexOf(' sched-item ')<0)continue;
            var id=clean(node.getAttribute('data-id')||''),nameNode=node.querySelector('.m'),name=clean(nameNode?nameNode.textContent:node.getAttribute('title')||'');
            if(!/^[A-Za-z0-9_-]{2,80}$/.test(id)||!name||seen[id])continue;
            seen[id]=true;
            var span=node.querySelector('.t'),timeRaw=clean(span?span.textContent:''),isLive=!!(span && ((' '+span.className+' ').indexOf(' live ')>=0||/^live$/i.test(timeRaw)));
            var em=node.querySelector('.em'),sportMark=clean(em?em.textContent:''),sports={'⚽':'Футбол','🏒':'Хокей','🏀':'Баскетбол','🏐':'Волейбол','🎾':'Теніс','🥊':'Бокс','🥋':'MMA','🏎':'Автоспорт','🏁':'Автоспорт','🏍':'Мотоспорт','⛷':'Зимові види спорту','🤾':'Гандбол','🎯':'Дартс','🏈':'Американський футбол','⛳':'Гольф','🏇':'Кінний спорт','📺':'Телепрограма','🥅':'Футзал','🏆':'Футбол'};
            var sport='';Object.keys(sports).some(function(k){if(sportMark.indexOf(k)>=0){sport=sports[k];return true;}return false;});
            var start=null;
            if(!isLive&&/^\d{1,2}:\d{2}$/.test(timeRaw)) {
                var h=Number(timeRaw.slice(0,timeRaw.indexOf(':'))),m=Number(timeRaw.slice(timeRaw.indexOf(':')+1));
                if(h<24&&m<60){var test=new Date(date.getFullYear(),date.getMonth(),date.getDate(),h,m);if(test.getFullYear()===date.getFullYear()&&test.getMonth()===date.getMonth()&&test.getDate()===date.getDate())start=test.getTime();}
            }
            var page=eventUrl(node.getAttribute('href')||'',base,id);
            out.push({id:id,title:name,home:'',away:'',sport:sport,league:'',start:start,
                timeLabel:isLive?'LIVE':(group?group+' · ':'')+timeRaw,live:isLive,finished:false,status:isLive?'live':'upcoming',
                sources:[],url:page,score:'',groupLabel:group});
        }
        // Enrich without overwriting site schedule names: tile metadata reveals league.
        var tiles=doc.querySelectorAll('a.tile[data-id]');
        var byId=Object.create(null);out.forEach(function(e){byId[e.id]=e;});
        Array.prototype.forEach.call(tiles,function(tile){var id=clean(tile.getAttribute('data-id')||''),e=byId[id];if(!e)return;
            var meta=tile.querySelector('.tile-meta');if(meta)e.league=clean(meta.textContent||'').slice(0,100);
            if(!e.sport&&/^(?:Ла Ліга|La Liga|Вища ліга|Ekstraklasa|Прем'єр-ліга|Premier League|Bundesliga|Бундесліга|Ліга 1|Ligue 1|Серія А|Serie A)$/i.test(e.league))e.sport='Футбол';
        });
        return out;
    }
    function parseHtml(html, base, docParser) {
        var result={events:[],sources:[],scripts:0,parser:'html',evidence:[],gate:detectGate(html)};
        if(typeof html!=='string')return result;
        var parse=docParser || (typeof DOMParser!=='undefined'?function(s){return new DOMParser().parseFromString(s,'text/html');}:null);
        if(!parse)return result;
        var doc=parse(html);
        if(!doc || !doc.querySelectorAll)return result;
        result.events=readScheduleDocument(doc,base);
        result.evidence.push('sched-item:'+result.events.length);
        var scripts=doc.querySelectorAll('script[type="application/json"],script[type="application/ld+json"],script#__NEXT_DATA__');
        Array.prototype.forEach.call(scripts,function(node){var content=node.textContent||'';if(content.length>2000000)return;try{var data=JSON.parse(content),ev=extractEvents(data,base);result.events=result.events.concat(ev);result.scripts++;}catch(e) {}});
        var cards=doc.querySelectorAll('[data-event-id],[data-match-id],[data-event], [data-hash]');
        Array.prototype.forEach.call(cards,function(node){var id=node.getAttribute('data-event-id')||node.getAttribute('data-match-id')||node.getAttribute('data-hash')||node.getAttribute('data-event');var child=node.querySelector('h2,h3,.team,.match-title');var title=node.getAttribute('data-title')||(child?child.textContent:'')||node.textContent||'';var raw={id:id,title:clean(title).slice(0,250),sport:node.getAttribute('data-sport')||'',league:node.getAttribute('data-league')||'',start:node.getAttribute('data-start')||'',pageUrl:node.getAttribute('href')||''};var event=normalizeEvent(raw,base);if(event)result.events.push(event);});
        // Verified source selector: each option is an iframe embed unless a direct media extension is proved.
        result.sources=readStrumykSourcesDocument(doc,base);
        result.evidence.push('strumyk-source-buttons:'+result.sources.length);
        // Generic media URLs on a detail page. Do not treat all links as playable media.
        var links=doc.querySelectorAll('video[src],source[src],a[href]');
        Array.prototype.forEach.call(links,function(node){var link=node.getAttribute('src')||node.getAttribute('href')||'';var type=kind(link);if(type==='web')return;var s=mediaSource({url:link,name:clean(node.getAttribute('title')||node.textContent||'')||''},base);if(s)result.sources.push(s);});
        var eventMap=Object.create(null);result.events=result.events.filter(function(e){if(eventMap[e.id]){var old=eventMap[e.id],seen={};old.sources.concat(e.sources).forEach(function(v){seen[v.url+'|'+v.language+'|'+v.quality]=v;});old.sources=Object.keys(seen).map(function(k){return seen[k];});if(!old.league)old.league=e.league;if(!old.sport)old.sport=e.sport;return false;}eventMap[e.id]=e;return true;});
        result.sources=result.sources.filter(function(s,index,all){return all.findIndex(function(x){return x.url===s.url;})===index;});
        result.evidence.push('script-json:'+result.scripts,'data-event:'+cards.length,'media:'+result.sources.length);
        return result;
    }
    /* v0.5: REAL STRUMYK SOURCE BUTTONS, verified from nine Android DOM captures.
       #sources > .lang-group > .lang-label + .quality-pills > button.src-btn[data-src].
       data-src is an EMBED PAGE address in all 12 observed options, NOT a proven media URL.
       Never pass redacted placeholder URLs to a player. */
    function isRedactedLink(url) {
        return /\[(?:query-redacted|hash-redacted|redacted|long-segment|hidden|invalid-url)\]/i.test(String(url||''));
    }
    function sourceFromButton(url,base,channel,language,quality) {
        var raw=clean(url);if(!raw)return null;
        var href=isRedactedLink(raw)?'':safeUrl(raw,base);
        if(!href && !isRedactedLink(raw))return null;
        var direct=href && kind(href)!=='web' && kind(href)!=='youtube';
        return {url:href,name:clean(channel)||hostOf(href)||'Джерело',language:clean(language),quality:clean(quality),
            type:direct?kind(href):'embed',container:direct?'media':'iframe',directMedia:!!direct,
            redacted:!href,verifiedQuality:false,headers:{}};
    }
    function readStrumykSourcesDocument(doc,base) {
        if(!doc || !doc.querySelector)return [];
        var root=doc.querySelector('#sources');if(!root)return [];
        var result=[],seen=Object.create(null);
        Array.prototype.forEach.call(root.querySelectorAll('.lang-group'),function(group){
            var label=group.querySelector('.lang-label');if(!label)return;
            var langNode=label.querySelector('span:not(.fl)'),channelNode=label.querySelector('small');
            var language=clean(langNode?langNode.textContent:''),channel=clean(channelNode?channelNode.textContent:'');
            Array.prototype.forEach.call(group.querySelectorAll('.quality-pills .src-btn[data-src]'),function(btn){
                var src=sourceFromButton(btn.getAttribute('data-src'),base,channel,language,btn.textContent);
                if(!src)return;var key=[src.url||btn.getAttribute('data-src'),src.name,src.language,src.quality].join('|');
                if(!seen[key]){seen[key]=1;result.push(src);}
            });
        });return result;
    }
    function readStrumykSourcesCapture(capture,base) {
        /* Read sanitized STRUMYK_SOURCE_V04 JSON, no browser DOM dependency. */
        var root=capture && capture.sourceBoxTree;if(!root)return [];
        function cls(n){return (n&&n.attrs&&n.attrs['class'])||'';}
        function kids(n){return n&&Array.isArray(n.children)?n.children:[];}
        function deepText(n){if(!n)return '';if(n.text)return n.text;return kids(n).map(deepText).join(' ');}
        var result=[],seen=Object.create(null);
        kids(root).filter(function(n){return /(?:^|\s)lang-group(?:\s|$)/.test(cls(n));}).forEach(function(group){
            var lab=kids(group).filter(function(n){return /(?:^|\s)lang-label(?:\s|$)/.test(cls(n));})[0];
            var pills=kids(group).filter(function(n){return /(?:^|\s)quality-pills(?:\s|$)/.test(cls(n));})[0];
            if(!lab||!pills)return;
            var lang='',channel='';kids(lab).forEach(function(n){if(n.tag==='small')channel=clean(deepText(n));else if(n.tag==='span'&&!/(?:^|\s)fl(?:\s|$)/.test(cls(n)))lang=clean(deepText(n));});
            kids(pills).forEach(function(btn){if(btn.tag!=='button'||!/(?:^|\s)src-btn(?:\s|$)/.test(cls(btn)))return;
                var raw=btn.attrs&&btn.attrs['data-src'];
                var src=sourceFromButton(raw,base||DEFAULT_HOST,channel,lang,deepText(btn));if(!src)return;
                var key=[src.url||raw,src.name,src.language,src.quality].join('|');
                if(!seen[key]){seen[key]=1;result.push(src);}
            });
        });return result;
    }
    function dayOf(ms) { var d=new Date(ms);return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }
    function filterEvents(list,opts) {
        opts=opts||{};var search=clean(opts.search).toLocaleLowerCase(), today=dayOf(Date.now()),tomorrow=dayOf(Date.now()+86400000),yesterday=dayOf(Date.now()-86400000);
        return (list||[]).filter(function(e){
            if(opts.onlyLive && !e.live)return false;
            if(opts.sport && opts.sport!=='all' && e.sport!==opts.sport)return false;
            if(opts.league && opts.league!=='all' && e.league!==opts.league)return false;
            if(opts.date && opts.date!=='all'){
                if(!e.start){
                    // A LIVE item has no reliable kick-off time, but belongs to the current day's LIVE group.
                    if(!(e.live && opts.date==='today' && /(?:Teraz na żywo|На.?живо|прямой эфир)/i.test(e.groupLabel||'')))return false;
                }else{var date=dayOf(e.start);if(date!==(opts.date==='today'?today:opts.date==='tomorrow'?tomorrow:opts.date==='yesterday'?yesterday:opts.date))return false;}
            }
            if(opts.status==='live' && !e.live)return false;
            if(opts.status==='upcoming' && (e.live||e.finished))return false;
            if(opts.status==='finished' && !e.finished)return false;
            if(search && (e.title+' '+e.home+' '+e.away+' '+e.league+' '+e.sport).toLocaleLowerCase().indexOf(search)<0)return false;
            return true;
        });
    }
    /* TV: static metadata from real 56-channel Android capture 2026-11-21.
     * This is a catalog fallback only. Do NOT present blank URL fields as playable streams.
     * The site may change channels between releases. Live EPG is fetched separately. */
    var TV_CATALOG_SNAPSHOT = [{"id":"tvp1","name":"TVP 1","cat":"podstawowe"},{"id":"tvp2","name":"TVP 2","cat":"podstawowe"},{"id":"polsat","name":"Polsat","cat":"podstawowe"},{"id":"tvn","name":"TVN","cat":"podstawowe","url":"https://strumyk.ca/e/vip/PL/tvn.php"},{"id":"ttv","name":"TTV","cat":"podstawowe","url":"https://strumyk.ca/e/vip/PL/ttv.php"},{"id":"tvppolonia","name":"TVP Polonia","cat":"podstawowe","url":"https://strumyk.ca/e/vip/PL/tvppolonia.php"},{"id":"ch_6ad1b06c5187f","name":"TV4","cat":"podstawowe"},{"id":"tvn7","name":"TVN 7","cat":"podstawowe"},{"id":"ch_6ad1b419c9b56","name":"Metro","cat":"podstawowe"},{"id":"polsat2","name":"Polsat 2","cat":"podstawowe"},{"id":"tvnturbo","name":"TVN Turbo","cat":"podstawowe"},{"id":"tvn24","name":"TVN 24","cat":"news"},{"id":"kanalzero","name":"Kanał Zero","cat":"news"},{"id":"polsatnews","name":"Polsat News","cat":"news"},{"id":"tvpsport","name":"TVP Sport","cat":"sport"},{"id":"polsat-sport1","name":"Polsat Sport 1","cat":"sport"},{"id":"polsat-sport2","name":"Polsat Sport 2","cat":"sport"},{"id":"polsat-sport3","name":"Polsat Sport 3","cat":"sport"},{"id":"polsat-sport-premium1","name":"Polsat Sport Premium 1","cat":"sport"},{"id":"polsat-sport-premium2","name":"Polsat Sport Premium 2","cat":"sport"},{"id":"ch_6acb187eecc9d","name":"Sky Sports F1 (UK)","cat":"sport"},{"id":"eleven1","name":"Eleven Sports 1","cat":"sport"},{"id":"eleven2","name":"Eleven Sports 2","cat":"sport"},{"id":"eleven3","name":"Eleven Sports 3","cat":"sport"},{"id":"eleven4","name":"Eleven Sports 4","cat":"sport"},{"id":"canal-sport1","name":"Canal+ Sport","cat":"sport"},{"id":"canal-sport2","name":"Canal+ Sport 2","cat":"sport"},{"id":"canal-sport3","name":"Canal+ Sport 3","cat":"sport"},{"id":"canal-sport4","name":"Canal+ Sport 4","cat":"sport"},{"id":"canal-sport5","name":"Canal+ Sport 5","cat":"sport"},{"id":"canal-sport6","name":"Canal+ Sport 6","cat":"sport"},{"id":"ch_6ad1af3472c58","name":"Canal+ Extra 1","cat":"sport"},{"id":"ch_6ad1af6140f9c","name":"Canal+ Extra 2","cat":"sport"},{"id":"ch_6ad1afe70cafb","name":"Polsat Sport Extra 1","cat":"sport"},{"id":"ch_6ad1b00f2a3ef","name":"Polsat Sport Extra 2","cat":"sport"},{"id":"ch_6ad1b01edf3a1","name":"Polsat Sport Extra 3","cat":"sport"},{"id":"ch_6ad1b02c2f35d","name":"Polsat Sport Extra 4","cat":"sport"},{"id":"eurosport1","name":"Eurosport 1","cat":"sport"},{"id":"eurosport2","name":"Eurosport 2","cat":"sport"},{"id":"eurosport3","name":"Eurosport 3","cat":"sport"},{"id":"eurosport4","name":"Eurosport 4","cat":"sport"},{"id":"ch_6ad358e8235f9","name":"Motowizja","cat":"sport"},{"id":"canal-now","name":"Canal+ Now","cat":"film"},{"id":"canal-film","name":"Canal+ Film","cat":"film"},{"id":"canal-premium","name":"Canal+ Premium","cat":"film"},{"id":"canal-4k","name":"Canal+ 4K Ultra","cat":"film"},{"id":"polsat-film","name":"Polsat Film","cat":"film"},{"id":"polsat-film2","name":"Polsat Film 2","cat":"film"},{"id":"ch_6af98fa367b34","name":"AXN","cat":"film"},{"id":"ch_6af9900a9874c","name":"AXN Black","cat":"film"},{"id":"canal-seriale","name":"Canal+ Seriale","cat":"rozrywka"},{"id":"canal-360","name":"Canal+ 360","cat":"rozrywka"},{"id":"tvpseriale","name":"TVP Seriale","cat":"rozrywka"},{"id":"polsat-rodzina","name":"Polsat Rodzina","cat":"rozrywka"},{"id":"tvp3","name":"TVP 3","cat":"rozrywka","url":"https://strumyk.ca/e/vip/PL/tvp3.php"},{"id":"ch_6af8f2d592acd","name":"Eroxxx (18+)","cat":"rozrywka"}];
    var TV_LABELS = {
        uk: {tv:'Телебачення',allTv:'Усі канали',tvSearch:'Пошук телеканалу',tvFilter:'Категорія',tvFav:'Обране',tvRefresh:'Оновити EPG',tvNow:'Зараз',tvNext:'Далі',tvNoGuide:'Немає даних EPG',tvLoad:'Завантаження телепрограми…',tvError:'EPG недоступна',tvOpen:'Відкрити на сайті',tvPage:'Сторінка телеканалів',tvWebOnly:'Вебджерело (не прямий потік)',tvNotice:'Відтворення каналів у Lampa ще не підтверджене',podstawowe:'Основні',sport:'Спортивні',news:'Новини',film:'Фільми',rozrywka:'Розваги'},
        pl: {tv:'Telewizja',allTv:'Wszystkie kanały',tvSearch:'Szukaj kanału',tvFilter:'Kategoria',tvFav:'Ulubione',tvRefresh:'Odśwież EPG',tvNow:'Teraz',tvNext:'Dalej',tvNoGuide:'Brak programu',tvLoad:'Ładowanie EPG…',tvError:'EPG niedostępne',tvOpen:'Otwórz na stronie',tvPage:'Strona kanałów',tvWebOnly:'Osadzona strona (nie strumień)',tvNotice:'Odtwarzanie kanałów w Lampa nie zostało potwierdzone',podstawowe:'Podstawowe',sport:'Sportowe',news:'Informacyjne',film:'Filmowe',rozrywka:'Rozrywkowe'},
        ru: {tv:'Телевидение',allTv:'Все каналы',tvSearch:'Поиск канала',tvFilter:'Категория',tvFav:'Избранное',tvRefresh:'Обновить EPG',tvNow:'Сейчас',tvNext:'Далее',tvNoGuide:'Нет телепрограммы',tvLoad:'Загрузка телепрограммы…',tvError:'EPG недоступно',tvOpen:'Открыть на сайте',tvPage:'Страница каналов',tvWebOnly:'Веб-страница (не прямой поток)',tvNotice:'Воспроизведение каналов в Lampa пока не проверено',podstawowe:'Основные',sport:'Спортивные',news:'Новости',film:'Фильмы',rozrywka:'Развлечения'}
    };
    function tvLabel(lang,key){return ((TV_LABELS[lang]||TV_LABELS.uk)[key]||TV_LABELS.uk[key]||key);}
    function normalizeTvChannels(raw){
        if(!Array.isArray(raw))return [];
        var out=[],seen=Object.create(null);
        raw.slice(0,300).forEach(function(ch){
            if(!ch||typeof ch!=='object'||Array.isArray(ch))return;
            var id=clean(ch.id),name=clean(ch.name),category=clean(ch.cat);
            if(!/^[A-Za-z0-9_-]{1,100}$/.test(id)||!name||name.length>160||seen[id])return;
            seen[id]=1;var link=safeUrl(ch.url);
            out.push({id:id,name:name,category:category,url:link&&kind(link)==='web'?link:''});
        });return out;
    }
    /* Strumyk /api/epg.php: {ok:1,now,from,to,ch:[{id,e,fb,it:[[startSec,endSec,title,genre],...]}]}.
     * Confirmed by user's actual EPG JSON, Nov 21, 2026; ch.id is the catalog ID. */
    function parseTvEpg(payload,knownChannels){
        if(!payload||payload.ok!==1||!Array.isArray(payload.ch))return [];
        var allowed=Object.create(null),limited=Array.isArray(knownChannels),dedup=Object.create(null),result=[];
        (knownChannels||[]).forEach(function(ch){if(ch&&ch.id)allowed[ch.id]=1;});
        payload.ch.slice(0,300).forEach(function(ch){
            if(!ch||typeof ch!=='object'||!Array.isArray(ch.it))return;
            var id=clean(ch.id);if(!id||id.length>100||(limited&&!allowed[id]))return;
            ch.it.slice(0,400).forEach(function(it){
                if(!Array.isArray(it)||it.length!==4||typeof it[0]!=='number'||typeof it[1]!=='number'||typeof it[2]!=='string'||typeof it[3]!=='string')return;
                var start=it[0]*1000,end=it[1]*1000,title=clean(it[2]);
                if(!Number.isFinite(start)||!Number.isFinite(end)||!title||title.length>750||end<=start||end-start>172800000)return;
                var k=id+'|'+start+'|'+end+'|'+title;if(dedup[k])return;dedup[k]=1;
                result.push({channelId:id,title:title,genre:clean(it[3]).slice(0,160),startMs:start,endMs:end,fallback:ch.fb===1});
            });
        });result.sort(function(a,b){return a.startMs-b.startMs;});return result;
    }
    function tvNowNext(list,id,atMs){
        var now=Number.isFinite(atMs)?atMs:Date.now(),current=null,next=null;
        (list||[]).forEach(function(p){if(!p||p.channelId!==id)return;
            if(p.startMs<=now&&now<p.endMs&&(!current||current.startMs<p.startMs))current=p;
            if(p.startMs>now&&(!next||next.startMs>p.startMs))next=p;
        });
        if(current){next=null;(list||[]).forEach(function(p){if(p&&p.channelId===id&&p.startMs>=current.endMs&&(!next||next.startMs>p.startMs))next=p;});}
        var progress=current?Math.max(0,Math.min(100,Math.round((now-current.startMs)*100/(current.endMs-current.startMs)))):null;
        return {current:current,next:next,progressPercent:progress};
    }
    /* Public sports JSON from first-party Strumyk APIs. J/X/O do not have
     * URL parameters in the verified 2026-11-21 boot config. L/M require
     * site-provided t/s/ip parameters; never guess or forge them. */
    function parseSportApiArray(body) {
        var data=body;
        if(typeof data==='string'){
            try{data=JSON.parse(data.replace(/^\uFEFF/,''));}catch(e){return null;}
        }
        return Array.isArray(data)?data:null;
    }
    function sportApiUrlsFromHtml(html,host) {
        var output={},base=normalizeHost(host)||DEFAULT_HOST;
        if(typeof html!=='string'||detectGate(html))return output;
        var match=html.match(/(?:[\"']?api[\"']?)\s*:\s*\{([\s\S]{0,15000}?)\}/i);
        if(!match)return output;
        var body=match[1],rx=/["']?([LJXMO])["']?\s*:\s*(["'])([^"']{1,1400})\2/g,item;
        while((item=rx.exec(body))!==null){
            var key=item[1],raw=item[3].replace(/&amp;/g,'&').replace(/\\u0026/gi,'&').replace(/\\\//g,'/');
            var link=safeUrl(raw,base);
            try{var parsed=new URL(link),origin=new URL(base);
                if(parsed.origin===origin.origin && parsed.pathname==='/api/'+key+'.php' &&
                   (key==='J'||key==='X'||key==='O'||parsed.searchParams.has('t'))){output[key]=parsed.href;}
            }catch(ignore){}
        }
        return output;
    }
    /* Direct media resolution from openly available, non-DRM HTML player pages.
     * Never use a WEB iframe URL as a media URL. No deobfuscation/eval of site JS.
     * Extraction is only an attempt; providers may require browser cookies, referer,
     * signed manifests or DRM unavailable through this interface. */
    function unescapeMediaText(value) {
        return String(value||'').replace(/\\\//g,'/').replace(/\\u0026/gi,'&').replace(/&amp;/gi,'&').replace(/&#38;/gi,'&')
             .replace(/%2f/gi,'/').replace(/%3a/gi,':').replace(/%3f/gi,'?').replace(/%26/gi,'&');
    }
    function findDirectMedia(html,base) {
        if(typeof html!=='string'||html.length>3000000)return [];
        var text=unescapeMediaText(html),found=[],seen=Object.create(null);
        function add(raw){var url=safeUrl(raw,base),type=kind(url);if(!url||!['hls','dash','file'].includes(type)||seen[url])return;seen[url]=1;found.push({url:url,type:type});}
        // Textual URLs within JS player configuration, HTML source tags, or manifests.
        var re=/https?:\/\/[^\s"'<>\\`]{4,1200}?\.(?:m3u8|mpd|mp4|webm)(?:\?[^\s"'<>\\`]*)?/gi,m;
        while((m=re.exec(text))!==null && found.length<35){add(m[0].replace(/[),;]+$/,''));}
        var tag=/<(?:video|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi;
        while((m=tag.exec(text))!==null&&found.length<35)add(m[1]);
        // Quoted relative media URLs in structured player config.
        var rel=/(?:file|src|hls|url|stream|playlist)\s*[:=]\s*["'](\/[^"'<> ]+\.(?:m3u8|mpd|mp4)(?:\?[^"']*)?)["']/gi;
        while((m=rel.exec(text))!==null&&found.length<35)add(m[1]);
        return found;
    }
    function findNestedIframes(html,base) {
        if(typeof html!=='string'||html.length>3000000)return [];
        var seen=Object.create(null),out=[],re=/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi,m;
        while((m=re.exec(html))!==null && out.length<8){
            var u=safeUrl(m[1].replace(/&amp;/gi,'&'),base);
            if(u && kind(u)==='web'&&!seen[u]&&!/\/(?:chat|ads?)\b/i.test(u)){seen[u]=1;out.push(u);}
        }
        return out;
    }
    function resolveOpenMedia(url,fetchText,maxDepth) {
        var start=safeUrl(url);if(!start)return Promise.reject(new Error('INVALID_URL'));
        if(kind(start)!=='web')return Promise.resolve({url:start,type:kind(start),headers:{}});
        var seen=Object.create(null),max=Math.min(2,Math.max(0,Number(maxDepth)||1)),requests=0;
        function visit(page,level,referer) {
            if(seen[page]||requests>=4)return Promise.resolve(null);
            seen[page]=1;requests++;
            return Promise.resolve().then(function(){return fetchText(page,referer);}).then(function(html){
                var found=findDirectMedia(html,page);
                if(found.length){var f=found[0];return {url:f.url,type:f.type,headers:{Referer:page,Origin:new URL(page).origin},alternates:found};}
                if(level>=max)return null;
                var frames=findNestedIframes(html,page);
                var index=0;
                function next(){if(index>=frames.length)return Promise.resolve(null);
                    return visit(frames[index++],level+1,page).then(function(result){return result||next();});}
                return next();
            });
        }
        return visit(start,0,'https://strumyk.ca/').then(function(result){if(!result)throw new Error('DIRECT_MEDIA_NOT_FOUND');return result;});
    }
    function install(env) {
        var L=env.Lampa,$=env.jQuery,KEY='strumyk_',alive=true;
        if(env.strumyk_plugin_ready)return;env.strumyk_plugin_ready=true;
        function get(k,d){try{return L.Storage.get(KEY+k,d);}catch(e){return d;}}
        function set(k,v){try{L.Storage.set(KEY+k,v);}catch(e){}}
        function lang(){var v=get('lang','uk');return LABELS[v]?v:'uk';}
        function tr(k){return t(lang(),k);}
        function ttv(k){return tvLabel(lang(),k);}
        function domain(){return normalizeHost(get('host',DEFAULT_HOST))||DEFAULT_HOST;}
        function text(tag,cls,s){return $('<'+tag+'>').addClass(cls||'').text(s===undefined?'':s);}
        function btn(label,fn,key,cls){return text('button','selector str-btn '+(cls||''),label).attr({type:'button','data-str-key':key||label,tabindex:0}).on('hover:enter.str click.str',function(e){e.preventDefault();e.stopPropagation();fn();});}
        function notify(s){if(currentScreen&&typeof currentScreen.showNotice==='function'&&currentScreen.showNotice(s))return;if(L.Noty&&L.Noty.show)L.Noty.show(s);}
        function sourceErrorText(err){
            var msg=clean(err&&err.message||err);
            if(/(?:status\W*404|HTTP\s*404)/i.test(msg))return 'HTTP 404: WEB-джерело не відповідає на прямий запит';
            if(/(?:status\W*403|HTTP\s*403)/i.test(msg))return 'HTTP 403: прямий доступ обмежений';
            if(/TIMEOUT|AbortError|PROBE_TIMEOUT/i.test(msg))return 'Час очікування вичерпано (8 с)';
            return msg.replace(/https?:\/\/[^\s"']+/g,'[URL]').replace(/[?&](?:token|sig|signature|key|auth)=[^\s&]+/gi,'[hidden]').slice(0,85);
        }
        function menuSelect(title,items,callback){L.Select.show({title:title,nomark:true,items:items.map(function(v){return {title:v.title,subtitle:v.subtitle||'',id:v.id,selected:!!v.selected};}),onSelect:callback,onBack:function(){if(L.Controller)L.Controller.toggle('content');}});}
        /* Native HTTP headers only for selected Strumyk origin.
           Default browser-grade UA matched public API availability in Termux v0.18.
           This does NOT replace server-provided L/M params or authorization. */
        function siteRequestHeaders(url, extra) {
            var result={},target;
            try{target=new URL(url,domain());if(target.origin!==new URL(domain()).origin)return extra||{};}
            catch(ignore){return extra||{};}
            var profile=get('http_profile','chrome');
            var ua='Mozilla/5.0 (Linux; Android 15; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';
            if(profile==='webview') {
                var actual=clean(env.navigator&&env.navigator.userAgent||'');
                if(actual && actual.length<350 && !/[\r\n]/.test(actual))ua=actual;
            }
            if(profile!=='basic') {
                result['User-Agent']=ua;
                if(profile!=='chrome_ua')result['Referer']=domain();
            }
            result['Accept']=/\/api\/[^/]+\.php$/.test(target.pathname)?'application/json':'text/html,application/json;q=0.9,*/*;q=0.8';
            result['Accept-Language']='uk-UA,uk;q=0.9,pl;q=0.8,en;q=0.7';
            if(extra&&typeof extra==='object')Object.keys(extra).forEach(function(key){result[key]=extra[key];});
            return result;
        }
        function request(url,headers) {
            return new Promise(function(ok,no){
                var timeout=setTimeout(function(){no(new Error('TIMEOUT'));},22000),done=false,n=new L.Reguest();
                function finish(error,value){if(done)return;done=true;clearTimeout(timeout);if(error)no(error);else ok(value);}
                try{n.timeout(20000);n.native(url,function(body){try {var result=body;if(typeof body==='string'&&body.charAt(0)==='{'){try{var outer=JSON.parse(body);if(outer&&typeof outer.body==='string')result=outer.body;}catch(ignore){}}finish(null,String(result));}catch(e){finish(e);}},function(e){finish(new Error('NETWORK '+JSON.stringify(e||'')));},null,{dataType:'text',returnHeaders:true,timeout:20000,headers:siteRequestHeaders(url,headers)});}
                catch(e){finish(e);}
            });
        }
        function openBrowser(url){var u=safeUrl(url,domain());if(!u)return notify(tr('unverified'));try{if(env.AndroidJS&&typeof env.AndroidJS.openBrowser==='function')env.AndroidJS.openBrowser(u);else env.open(u,'_blank','noopener');}catch(e){notify(tr('httpError'));}}
        function openStream(src,evt,mode){
            if(src.type==='web'||src.type==='embed'){if(!src.url)return notify(tr('unverified'));if(currentScreen&&currentScreen.showEmbedded){currentScreen.showEmbedded(src.url,evt&&evt.title||src.name);return;}openBrowser(src.url);return;}
            if(src.type==='acestream'){if(env.AndroidJS&&env.AndroidJS.openBrowser)env.AndroidJS.openBrowser(src.url);else notify(tr('unverified'));return;}
            if(src.type==='youtube'){openBrowser(src.url);return;}
            try {if(L.Player.callback)L.Player.callback(function(){if(currentScreen)currentScreen.start();});if(L.Player.playlist)L.Player.playlist([]);L.Player.runas(mode);try{L.Player.play({url:src.url,title:evt.title,tv:true,headers:src.headers||{},launch_player:mode,hls_type:src.type==='hls'?'hlsjs':undefined});}finally{L.Player.runas('');}}
            catch(e){notify(tr('httpError')+': '+e.message);}
        }
        var currentScreen=null;
        function Screen() {
            var self=this,active=false,working=false,seq=0,route='schedule',all=[],selected=null,failMessage='',currentHtml='',apiChecks=[],sportNote='',diagnosticsOpen=false,drmViewOpen=false,drmProbeStatus='не запускали',drmProbeBusy=false,drmProbeSeq=0,networkProbeSeq=0,networkProbeBusy=false,networkProbeStatus='не запускали',drmDemoOpen=false,drmDemoPlayer=null,drmDemoVideo=null,drmDemoSeq=0,layoutLastView='',layoutListenerActive=false,toastSerial=0,configEditing='',configDraft='',webView=null,detailSources=[],sourceFilter={language:'all',type:'all'},search='',searchEditing='',searchDraft='',filter={sport:'all',league:'all',date:'all',status:'all'},tvCategory='all',tvSearch='',tvEpgStatus='idle',tvEpgError='',tvEpg=[],tvEpgRequest=0,tvEpgFetched=0,tvClockServer=null,tvClockLocal=null,tvTimer=null,videoBusy=false,videoStatus='',tvChannels=normalizeTvChannels(TV_CATALOG_SNAPSHOT),root=$('<div class="str-screen">'),head=$('<div class="str-head">'),nav=$('<div class="str-nav">'),area=$('<div class="str-area">'),foot=$('<div class="str-foot">');
            root.append(head,nav,area,foot);
            /* Shared viewport/layout controller for every STRUMYK screen.
               Lampa mobile bars can overlay the Activity content. We reserve
               their footprint INSIDE the plugin; we never hide host controls. */
            function syncUiInsets(){
                if(!root||!root[0])return;
                var d=env.document,w=env.innerWidth||d.documentElement.clientWidth||0,
                    h=env.innerHeight||d.documentElement.clientHeight||0,reserved=0;
                if(!w||!h)return;
                var selectors='.mobile-bottom-nav,.bottom-nav,.bottom-bar,.bottom-menu,.mobile-nav,.mobile-navigation,.mobile-menu,.navigation-bar,.navigation__bottom,.navigation--bottom,.navigation--mobile,.nav-bottom,.footer-menu,.footer__nav,[role="navigation"]';
                try{
                    Array.prototype.forEach.call(d.querySelectorAll(selectors),function(el){
                        if(!el||root[0].contains(el)||el===root[0])return;
                        var rect=el.getBoundingClientRect(),style=env.getComputedStyle?env.getComputedStyle(el):null;
                        if(!style||style.display==='none'||style.visibility==='hidden')return;
                        if(!/^(fixed|sticky|absolute)$/.test(style.position))return;
                        if(rect.width<w*.52||rect.height<42||rect.height>220)return;
                        if(rect.top<h*.55||rect.bottom<h-145||rect.top>h-25)return;
                        reserved=Math.max(reserved,Math.ceil(h-rect.top+8));
                    });
                }catch(ignore){}
                // On narrow portrait touch layouts Lampa often draws a native
                // bottom command bar outside our activity, without a stable selector.
                // Conservative fallback keeps the last button reachable.
                var touch=false;
                try{touch=!!(env.matchMedia&&env.matchMedia('(pointer: coarse)').matches);}catch(ignore){}
                if(!reserved&&touch&&h>w&&w<=900)reserved=84;
                reserved=Math.max(0,Math.min(reserved,Math.round(h*.29)));
                root[0].style.setProperty('--str-bottom-safe',reserved+'px');
            }
            function layoutViewKey(){
                if(configEditing)return 'config:'+configEditing;
                if(drmDemoOpen)return 'drm-demo';
                if(drmViewOpen)return 'drm-tools';
                if(diagnosticsOpen)return 'diagnostics';
                if(webView)return 'web:'+String(webView.url||'').slice(0,180);
                if(selected)return 'event:'+String(selected.id);
                return 'route:'+route;
            }
            function onLayoutResize(){if(active)syncUiInsets();}
            function focus(preferred){if(!active)return;L.Controller.collectionSet(root);var n=preferred?root.find('.selector:visible[data-str-key="'+preferred+'"]'): $();if(!n.length)n=root.find('.selector:visible').first();L.Controller.collectionFocus(n.length?n:false,root);}
            function paintHeader(){head.empty().append(text('div','str-brand','⚡ STRUMYK').append(text('span','str-brand-tag',' SPORTS')),
                $('<div class="str-head-actions">').append(btn('‹',back,'head-back','str-icon'),btn('↻',function(){if(route==='tv')loadTvEpg(true);else load();},'refresh','str-icon'),btn('⚙',settings,'settings','str-icon')));
                nav.empty();[['schedule','schedule'],['live','live'],['favorites','fav'],['tv','tv']].forEach(function(x){nav.append(btn(x[1]==='tv'?ttv('tv'):tr(x[1]),function(){if(drmDemoOpen)stopDrmDemo();drmDemoOpen=false;drmViewOpen=false;route=x[0];selected=null;searchEditing='';configEditing='';diagnosticsOpen=false;webView=null;draw();if(route==='tv'){if(tvEpgStatus==='idle')loadTvEpg(false);}else if(!all.length&&!working&&!failMessage)load();},'nav-'+x[0],route===x[0]?'str-current':''));});
            }
            function focusController(){L.Controller.add('content',{toggle:function(){focus();},left:function(){if(typeof Navigator!=='undefined'&&Navigator.canmove('left'))Navigator.move('left');else L.Controller.toggle('menu');},right:function(){if(typeof Navigator!=='undefined'&&Navigator.canmove('right'))Navigator.move('right');},up:function(){if(typeof Navigator!=='undefined'&&Navigator.canmove('up'))Navigator.move('up');},down:function(){if(typeof Navigator!=='undefined'&&Navigator.canmove('down'))Navigator.move('down');},back:back});L.Controller.toggle('content');}
            function back(){
                if(configEditing){configEditing='';configDraft='';draw();return;}
                if(searchEditing){searchEditing='';searchDraft='';draw();return;}
                if(drmDemoOpen){closeDrmDemo();return;}
                if(drmViewOpen){drmViewOpen=false;drmProbeSeq++;networkProbeSeq++;drmProbeBusy=false;networkProbeBusy=false;draw();return;}
                if(diagnosticsOpen){diagnosticsOpen=false;draw();return;}
                if(webView){webView=null;draw();return;}
                if(selected){selected=null;videoStatus='';videoBusy=false;draw();return;}
                if(route!=='schedule'){route='schedule';draw();return;}
                /* Lampa on Android may have only the plugin activity; backward() then prompts to exit app.
                   Follow the established working LiveTV fallback to the native main activity. */
                var count=0;
                try {count=L.Activity.all&&typeof L.Activity.all==='function'?L.Activity.all().length:0;}catch(ignore){}
                if(count<=1 && L.Activity.push){
                    var source='';try{source=L.Storage.field('source')||'';}catch(ignore){}
                    L.Activity.push({url:'',title:'Lampa',component:'main',source:source});return;
                }
                if(L.Activity.backward)L.Activity.backward();
            }
            function settings(){if(drmDemoOpen){stopDrmDemo();drmDemoOpen=false;drmViewOpen=false;draw();}menuSelect(tr('settings'),[
                {id:'lang',title:tr('language'),subtitle:lang().toUpperCase()}, {id:'player',title:tr('player'),subtitle:tr(get('player','ask')==='android'?'external':get('player','ask'))},
                {id:'host',title:tr('siteHost'),subtitle:domain()}, {id:'drm_check',title:'DASH / DRM діагностика',subtitle:'Read-only ClearKey/EME тест'}, {id:'http_profile',title:'HTTP-заголовки для Strumyk',subtitle:get('http_profile','chrome')}, {id:'about',title:tr('about'),subtitle:'STRUMYK '+VERSION}
            ],function(v){
                if(v.id==='lang')menuSelect(tr('language'),[{id:'uk',title:'Українська'},{id:'pl',title:'Polski'},{id:'ru',title:'Русский'}],function(c){set('lang',c.id);draw();});
                if(v.id==='player')menuSelect(tr('player'),[{id:'inner',title:tr('inner')},{id:'android',title:tr('external')},{id:'ask',title:tr('ask')}],function(c){set('player',c.id);draw();});
                if(v.id==='host'){configEditing='host';configDraft=domain();draw();}
                if(v.id==='drm_check'){drmViewOpen=true;drmProbeStatus='не запускали';drmProbeBusy=false;networkProbeStatus='не запускали';networkProbeBusy=false;draw();}
                if(v.id==='http_profile')menuSelect('HTTP-профіль Strumyk',[
                    {id:'chrome',title:'Android Chrome-подібний (рекомендовано)',subtitle:'UA Chrome 126 + Referer'},
                    {id:'chrome_ua',title:'Chrome UA БЕЗ Referer',subtitle:'Тест впливу Referer'},
                    {id:'webview',title:'UA цієї Lampa/WebView',subtitle:'UA пристрою + Referer'},
                    {id:'basic',title:'Без явного UA / Referer',subtitle:'Базова перевірка'}
                ],function(c){set('http_profile',c.id);if(route==='tv')loadTvEpg(true);else load();});
                if(v.id==='about'){L.Modal.open({title:'STRUMYK '+VERSION,size:'medium',html:text('div','str-modal',tr('probe')+' · '+domain()),onBack:function(){L.Modal.close();focusController();}});}
            });}
            function favorites(){var rows=get('favorites',[]);return Array.isArray(rows)?rows:[];}
            function isFav(id){return favorites().some(function(x){return x.id===id;});}
            function toggleFav(e){var f=favorites().filter(function(x){return x.id!==e.id;});if(!isFav(e.id))f.unshift({id:e.id,title:e.title,url:e.url,sport:e.sport,league:e.league,start:e.start,timeLabel:e.timeLabel,live:false,finished:false,sources:[]});set('favorites',f);draw();}
            function timeText(e){if(e.start){try{return new Date(e.start).toLocaleString(lang()==='pl'?'pl-PL':lang()==='ru'?'ru-RU':'uk-UA',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});}catch(ignore){}}return e.timeLabel||tr('unknown');}
            /* Inline search replaces L.Input.edit, which may trap Android keyboard
               overlays and duplicate its confirmation controls. Always cancellable. */
            function openInlineSearch(mode){
                if(mode!=='sport'&&mode!=='tv')return;
                searchEditing=mode;searchDraft=mode==='tv'?tvSearch:search;draw();
            }
            function renderInlineSearch(mode){
                var isTv=mode==='tv',wrap=$('<div class="str-inline-search">');
                wrap.append(text('div','str-source-info','Введи запит і натисни «Знайти». «Скасувати» закриває поле без змін.'));
                var field=$('<input type="search" class="selector str-search-field">').attr({
                    placeholder:isTv?ttv('tvSearch'):tr('search'),
                    tabindex:0,'data-str-key':'inline-search-field',autocomplete:'off',
                    autocorrect:'off',autocapitalize:'off',spellcheck:'false'
                }).val(searchDraft);
                function done(){
                    var value=clean(field.val()).slice(0,120);
                    if(isTv)tvSearch=value;else search=value;
                    searchEditing='';searchDraft='';draw();
                }
                function cancel(){searchEditing='';searchDraft='';draw();}
                field.on('click focus',function(e){e.stopPropagation();});
                field.on('input',function(){searchDraft=String(field.val()||'').slice(0,120);});
                field.on('keydown',function(e){
                    if(e.key==='Enter'){e.preventDefault();e.stopPropagation();done();}
                    else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();cancel();}
                    else e.stopPropagation();
                });
                wrap.append(field,btn('🔎 Знайти',done,'inline-search-submit'),btn('✕ Скасувати',cancel,'inline-search-cancel'));
                area.append(wrap);
            }
            function listTools(){var toolbar=$('<div class="str-toolbar">');toolbar.append(btn('☷ '+tr('filters'),filterMenu,'filters'),btn('⌕ '+tr('search'),function(){openInlineSearch('sport');},'search'));
                if(filter.sport!=='all'||filter.league!=='all'||filter.date!=='all'||filter.status!=='all'||search)toolbar.append(btn('× '+tr('filterReset'),function(){filter={sport:'all',league:'all',date:'all',status:'all'};search='';draw();},'clear'));
                area.append(toolbar);if(searchEditing==='sport')renderInlineSearch('sport');quickSportFilters();
            }
            function quickSportFilters(){
                var bar=$('<div class="str-quick-sports">'),frequent=['Футбол','Хокей','Баскетбол','Теніс','MMA','Бокс','Формула 1','Автоспорт','Волейбол'],available=sportOptions(all),choices=['all'].concat(frequent.filter(function(k){return available.indexOf(k)>=0;})).concat(available.filter(function(k){return frequent.indexOf(k)<0;}));
                choices.forEach(function(k){var cnt=k==='all'?all.length:all.filter(function(e){return e.sport===k;}).length;
                    var label=(k==='all'?tr('all'):k)+' · '+cnt;
                    var b=btn(label,function(){filter.sport=k;filter.league='all';draw();},'chip-'+k,'str-sport-chip');
                    if(filter.sport===k)b.addClass('str-current');bar.append(b);
                });area.append(bar);
            }
            function filterMenu(){menuSelect(tr('filters'),[{id:'sport',title:tr('sports'),subtitle:filter.sport==='all'?tr('all'):filter.sport},{id:'league',title:tr('leagues'),subtitle:filter.league==='all'?tr('all'):filter.league},{id:'date',title:tr('dates'),subtitle:tr(filter.date)},{id:'status',title:tr('status'),subtitle:tr(filter.status)}],function(c){var entries=[];if(c.id==='sport'||c.id==='league'){entries=c.id==='sport'?sportOptions(all):unique(all.map(function(e){return e[c.id];}).filter(Boolean)).sort();}else if(c.id==='date')entries=['today','tomorrow','yesterday'];else entries=['live','upcoming','finished'];menuSelect(tr(c.id==='sport'?'sports':c.id==='league'?'leagues':c.id==='date'?'dates':'status'),[{id:'all',title:tr('all')}].concat(entries.map(function(x){return {id:x,title:tr(x)+(c.id==='sport'?' · '+all.filter(function(e){return e.sport===x;}).length:'' )};})),function(opt){filter[c.id]=opt.id;draw();});});}
            function eventCards(rows){var grid=$('<div class="str-grid">');rows.slice(0,250).forEach(function(e){var card=$('<article class="str-card">'),meta=text('div','str-card-meta',(e.live?'● LIVE  ·  ':e.finished?tr('finished')+' · ':'')+[e.sport,e.league].filter(Boolean).join(' / ')),name=btn(e.title,function(){selected=e;detailSources=e.sources||[];sourceFilter={language:'all',type:'all'};videoStatus='';videoBusy=false;draw();},'event-'+e.id,'str-match'),bottom=text('div','str-card-time','◷ '+timeText(e));card.append(meta,name,bottom);
                if(e.sources&&e.sources.length)card.append(text('div','str-source-info','🎬 Джерела: '+e.sources.length+' · відкрий подію для перевірки HLS'));
                if(e.score)card.append(text('div','str-score',e.score));grid.append(card);});area.append(grid);}
            function playResolvedMedia(media,evt,mode){
                var direct={url:media.url,name:evt&&evt.title||'STRUMYK',type:media.type,headers:media.headers||{}};
                if(mode==='android'||mode==='inner')openStream(direct,evt,mode);
            }
            /* Return at most 8 sec of waiting for a public HTML/HLS probe.
               Underlying native HTTP may finish later; its result is ignored. */
            function quickVideoRequest(url,headers){
                return new Promise(function(resolve,reject){
                    var finished=false;
                    var timer=setTimeout(function(){
                        if(finished)return;finished=true;reject(Error('PROBE_TIMEOUT'));
                    },8000);
                    request(url,headers).then(function(body){
                        if(finished)return;finished=true;clearTimeout(timer);resolve(body);
                    },function(err){
                        if(finished)return;finished=true;clearTimeout(timer);reject(err);
                    });
                });
            }
            function chooseWebPlayback(url,evt,kindOfSource){
                var title=(evt&&evt.title)||'STRUMYK';
                var actions=[{id:'inner',title:'▶ Програмний плеєр (пошук HLS)'},{id:'android',title:'▶ Зовнішній VLC / MX Player (пошук HLS)'},
                    {id:'web',title:'WEB-плеєр (iframe)'},{id:'browser',title:'Відкрити у браузері'}];
                menuSelect('Як відкрити: '+title,actions,function(choice){
                    if(choice.id==='browser'){openBrowser(kindOfSource==='sport'&&evt&&evt.id?eventUrl('',domain(),evt.id):url);return;}
                    if(choice.id==='web'){
                        function showFrame(){
                            if(!active)return;
                            webView={url:url,title:title,isTv:kindOfSource==='tv',hasEmbed:true,
                                     siteEventId:kindOfSource==='sport'&&evt?evt.id:null};
                            draw();
                        }
                        // User observed that old same-origin /e/vip/... source URLs
                        // return 404 directly, even in Chrome. Check before embedding.
                        if(!/^https:\/\/strumyk\.(?:ca|cv)\/e\/vip\//i.test(url)){
                            showFrame();return;
                        }
                        notify('Перевіряю WEB-джерело перед відкриттям…');
                        quickVideoRequest(url,{Referer:domain()}).then(function(raw){
                            var html=String(raw||'').slice(0,10000);
                            if(/(?:<title>\s*404|>\s*404\s*<|Not Found[\s\S]{0,200}LiteSpeed)/i.test(html))
                                throw Error('HTTP 404');
                            showFrame();
                        }).catch(function(err){
                            notify('WEB-плеєр недоступний: '+sourceErrorText(err)+'. Спробуй «Відкрити на сайті».');
                        });
                        return;
                    }
                    area.prepend(text('div','str-tv-status','Шукаємо прямий відеопотік…'));
                    resolveOpenMedia(url,function(page,ref){return request(page,{Referer:ref||domain()});},1).then(function(media){
                        if(!active)return;playResolvedMedia(media,evt,choice.id);
                    }).catch(function(err){
                        notify('Прямий потік недоступний: '+sourceErrorText(err));
                        if(active)draw();
                    });
                });
            }
            function chooseSource(src){var mode=get('player','ask');if(src.type==='web'||src.type==='embed'){chooseWebPlayback(src.url,selected,'sport');return;}if(src.type==='youtube'||src.type==='acestream'){openStream(src,selected,'android');return;}if(mode==='ask')menuSelect(tr('player'),[{id:'inner',title:tr('inner')},{id:'android',title:tr('external')}],function(p){openStream(src,selected,p.id);});else openStream(src,selected,mode);}
            /* Read-only on-demand source resolver. Does not impersonate an
               authenticated session, modify signatures, or proxy media.
               It only validates HLS/DASH manifests already discoverable
               from public stream URLs associated with the event. */
            function autoDiscoverEventMedia(evt){
                if(videoBusy)return;
                var list=(evt&&evt.sources||[]).filter(function(x){
                    return x&&x.url&&['hls','dash','web','embed'].indexOf(x.type)>=0;
                });
                var seen=Object.create(null);
                list=list.filter(function(x){if(seen[x.url])return false;seen[x.url]=true;return true;}).sort(function(a,b){
                    var rank=function(s){return s.type==='hls'?0:s.type==='dash'?1:2;};
                    return rank(a)-rank(b);
                }).slice(0,4);
                if(!list.length){videoStatus='У цієї події сервер не надав придатних адрес для перевірки. Плеєр не запускаємо навмання.';draw();return;}
                videoBusy=true;videoStatus='Перевіряю '+list.length+' джерел: до 8 с на кожен HTTP-запит…';draw();
                var notes=[],requestUA=siteRequestHeaders(domain()+'api/J.php')['User-Agent']||'';
                function tryOne(i){
                    if(!active||selected!==evt)return Promise.reject(Error('CANCELLED'));
                    if(i>=list.length)return Promise.reject(Error('NO_VERIFIED_MANIFEST'));
                    var item=list[i];
                    videoStatus='Перевірка '+(i+1)+'/'+list.length+': '+(item.name||item.type).slice(0,70);draw();
                    var p=['hls','dash'].indexOf(item.type)>=0?
                       Promise.resolve({url:item.url,type:item.type,headers:item.headers||{}}):
                       resolveOpenMedia(item.url,function(page,ref){var h={};if(ref)h.Referer=ref;if(requestUA)h['User-Agent']=requestUA;return quickVideoRequest(page,h);},1);
                    return p.then(function(media){
                        if(!media||['hls','dash'].indexOf(media.type)<0)throw Error('NOT_HLS_DASH');
                        var h={},ref=media.headers&&media.headers.Referer;
                        if(ref&&/^https?:\/\//i.test(ref))h.Referer=ref;
                        if(requestUA)h['User-Agent']=requestUA;
                        return quickVideoRequest(media.url,h).then(function(raw){
                            var txt=String(raw||'').replace(/^\uFEFF/,'').replace(/^\s+/,'');
                            var valid=(media.type==='hls'?/^#EXTM3U\b/.test(txt):/<MPD[\s>]/i.test(txt.slice(0,1500)));
                            if(!valid)throw Error('NOT_MEDIA_MANIFEST');
                            return {url:media.url,type:media.type,headers:h,name:item.name||evt.title};
                        });
                    }).catch(function(e){
                        if(e&&e.message==='CANCELLED')throw e;
                        var errorCode=sourceErrorText(e);
                        notes.push((item.name||item.type).slice(0,45)+': '+errorCode.slice(0,55));
                        return tryOne(i+1);
                    });
                }
                tryOne(0).then(function(media){
                    if(!active||selected!==evt)return;
                    videoBusy=false;
                    videoStatus='Маніфест '+media.type.toUpperCase()+' відповів коректно. Сегменти й фактичне відтворення ще потрібно перевірити у плеєрі.';
                    draw();
                    menuSelect('Знайдено відеоджерело · '+evt.title,[
                        {id:'inner',title:'▶ Lampa Player',subtitle:'Перевірити реальне відтворення'},
                        {id:'android',title:'▶ VLC / MX Player',subtitle:'Потрібна підтримка HTTP-заголовків'}
                    ],function(x){openStream(media,evt,x.id);});
                }).catch(function(err){
                    if(!active||selected!==evt)return;
                    videoBusy=false;
                    videoStatus=err&&err.message==='CANCELLED'?'Скасовано':'HLS/DASH не підтверджено у '+list.length+' джерелах. '+notes.slice(0,3).join(' | ')+'. Якщо відео працює на самому Strumyk, сайт може використовувати інший вбудований плеєр.';
                    draw();
                });
            }
            /* Refresh selected event by requesting current public API data.
               No background service, no manual URL, no shared token storage.
               Keep historic sources if the current API returns zero providers. */
            function refreshSelectedSources(evt){
                if(videoBusy||!evt)return;
                videoBusy=true;
                videoStatus='Оновлюю дані джерел з J/O/M/X/L…';
                draw();
                var host=domain(),events=['J','X','O','M','L'];
                function fetchArray(key,url){
                    if(!url)return Promise.resolve({key:key,events:[],note:'URL_NOT_AVAILABLE'});
                    return request(url).then(function(body){
                        var data=parseSportApiArray(body);
                        return {key:key,events:data||[],note:data?'OK':'BAD_JSON'};
                    }).catch(function(e){
                        return {key:key,events:[],note:'UNAVAILABLE'};
                    });
                }
                Promise.all([
                    request(host).catch(function(){return '';}),
                    request(host+'telewizja/').catch(function(){return '';})
                ]).then(function(pages){
                    var discovered={},bundle={J:[],O:[],M:[],X:[],L:[]};
                    pages.forEach(function(html){
                        var items=sportApiUrlsFromHtml(String(html),host);
                        ['L','M'].forEach(function(k){if(!discovered[k]&&items[k])discovered[k]=items[k];});
                    });
                    return Promise.all(events.map(function(k){
                        var link=k==='L'||k==='M'?discovered[k]:host+'api/'+k+'.php';
                        return fetchArray(k,link);
                    })).then(function(results){
                        results.forEach(function(r){bundle[r.key]=r.events;});
                        return {bundle:bundle,states:results.map(function(r){return r.key+':'+r.note+'('+r.events.length+')';})};
                    });
                }).then(function(data){
                    if(!active||selected!==evt)return;
                    var updated=parseStrumykApiBundle(data.bundle,host,Date.now());
                    var found=updated.filter(function(v){return String(v.id)===String(evt.id);})[0];
                    var old=(evt.sources||[]).slice(),fresh=found&&found.sources||[];
                    if(!found){
                        videoStatus='Подію не знайдено у поточних JSON API. Попередні джерела збережено як неперевірені. '+data.states.join(' · ');
                    }else if(!fresh.length){
                        videoStatus='API знайшло матч, але не повернуло джерел. Попередні '+old.length+' залишені як неперевірені. '+data.states.join(' · ');
                    }else{
                        var before=Object.create(null),after=Object.create(null);
                        old.forEach(function(x){before[[x.url,x.language,x.quality,x.name].join('|')]=true;});
                        fresh.forEach(function(x){after[[x.url,x.language,x.quality,x.name].join('|')]=true;});
                        var added=Object.keys(after).filter(function(k){return !before[k];}).length;
                        var removed=Object.keys(before).filter(function(k){return !after[k];}).length;
                        evt.sources=fresh;
                        videoStatus='Оновлено з API: '+old.length+' → '+fresh.length+' джерел (нових '+added+', зниклих '+removed+'). '+data.states.join(' · ');
                    }
                    videoBusy=false;draw();
                }).catch(function(err){
                    if(!active||selected!==evt)return;
                    videoBusy=false;
                    videoStatus='Не вдалося оновити джерела: '+sourceErrorText(err);
                    draw();
                });
            }
            function detail(){var e=selected;area.empty();area.append(text('h1','str-title',e.title),text('div','str-subtitle',[e.sport,e.league,timeText(e)].filter(Boolean).join(' · ')));
                var actions=$('<div class="str-toolbar">').append(btn('‹ '+tr('back'),back,'back'),btn((isFav(e.id)?'★ ':'☆ ')+tr(isFav(e.id)?'unfavorite':'favorites'),function(){toggleFav(e);},'fav'));
                actions.append(btn('↗ '+tr('openSite'),function(){openBrowser(eventUrl('',domain(),e.id));},'site'));area.append(actions);
                var sourceCount=(e.sources||[]).length;
                area.append(btn(videoBusy?'◌ Виконується перевірка…':'↻ Оновити джерела цього матчу',function(){refreshSelectedSources(e);},'sources-refresh','str-stream-btn'));
                if(sourceCount)area.append(btn(videoBusy?'◌ Виконується перевірка…':'▶ Перевірити прямий HLS/DASH',function(){autoDiscoverEventMedia(e);},'video-autofind','str-stream-btn'));
                if(videoStatus)area.append(text('div','str-tv-status',videoStatus));
                if(!sourceCount)area.append(text('div','str-tv-note','API не надав джерел для цієї події. Відео не запускаємо без підтвердженого медіапотоку.'));
                var available=e.sources||[],list=available.filter(function(s){return (sourceFilter.language==='all'||s.language===sourceFilter.language)&&(sourceFilter.type==='all'||s.type===sourceFilter.type);});
                area.append(text('h2','str-section',tr('sources')+' · '+list.length+' / '+available.length));
                if(available.length){var tools=$('<div class="str-toolbar">');tools.append(btn(tr('sourceLanguage')+' · '+(sourceFilter.language==='all'?tr('all'):sourceFilter.language),function(){var choices=[{id:'all',title:tr('all')}].concat(unique(available.map(function(v){return v.language;}).filter(Boolean)).map(function(v){return {id:v,title:v};}));menuSelect(tr('sourceLanguage'),choices,function(v){sourceFilter.language=v.id;draw();});},'source-language'));
                    tools.append(btn(tr('sourceType')+' · '+(sourceFilter.type==='all'?tr('typeAll'):sourceFilter.type.toUpperCase()),function(){var choices=[{id:'all',title:tr('typeAll')}].concat(unique(available.map(function(v){return v.type;})).map(function(v){return {id:v,title:v.toUpperCase()};}));menuSelect(tr('sourceType'),choices,function(v){sourceFilter.type=v.id;draw();});},'source-type'));area.append(tools);}
                if(!list.length){area.append(text('div','str-empty',available.length?tr('noEvents'):tr('noSources')));return;}
                var grouped={hls:[],dash:[],file:[],youtube:[],acestream:[],embed:[],web:[]};list.forEach(function(s){(grouped[s.type]||grouped.web).push(s);});
                Object.keys(grouped).forEach(function(key){if(!grouped[key].length)return;area.append(text('h3','str-group-label',key.toUpperCase()+' · '+grouped[key].length));grouped[key].forEach(function(src,i){var label=((src.type==='embed'||src.type==='web')?'🌐 ':'▶ ')+src.name,sub=[src.language,src.quality,(src.type==='embed'||src.type==='web')?'WEB → пошук HLS/DASH':src.type.toUpperCase()].filter(Boolean).join(' · '),card=$('<div class="str-stream-row">');card.append(btn(label, function(){chooseSource(src);},'source-'+key+'-'+i,'str-stream-btn'),text('small','str-source-info',sub));area.append(card);});});
            }
            function tvAtMs(){
                if(Number.isFinite(tvClockServer)&&Number.isFinite(tvClockLocal))return tvClockServer+Math.max(0,Date.now()-tvClockLocal);
                return Date.now();
            }
            function tvTime(ms){
                if(!Number.isFinite(ms))return '';
                try{return new Date(ms).toLocaleTimeString(lang()==='pl'?'pl-PL':lang()==='ru'?'ru-RU':'uk-UA',{hour:'2-digit',minute:'2-digit'});}catch(ignore){return '';}
            }
            function epgBlock(ch){
                var data=tvNowNext(tvEpg,ch.id,tvAtMs());
                var wrap=$('<div class="str-tv-epg">').attr('data-tv-id',ch.id);
                var nowText= data.current?ttv('tvNow')+': '+data.current.title:ttv('tvNoGuide');
                wrap.append(text('div','str-tv-now',nowText));
                if(data.current){
                    wrap.append(text('div','str-tv-range',tvTime(data.current.startMs)+' – '+tvTime(data.current.endMs)));
                    var track=$('<div class="str-tv-track">').attr({role:'progressbar','aria-valuemin':'0','aria-valuemax':'100','aria-valuenow':data.progressPercent});
                    track.append($('<div class="str-tv-fill">').css('width',data.progressPercent+'%'));wrap.append(track);
                }
                if(data.next)wrap.append(text('div','str-tv-next',ttv('tvNext')+': '+data.next.title));
                return wrap;
            }
            function tvFavorites(){var ids=get('tvFavorites',[]);return Array.isArray(ids)?ids.filter(function(v){return typeof v==='string';}):[];}
            function tvIsFavorite(id){return tvFavorites().indexOf(id)!==-1;}
            function toggleTvFavorite(id){var ids=tvFavorites().filter(function(x){return x!==id;});if(!tvIsFavorite(id))ids.unshift(id);set('tvFavorites',ids);draw();}
            function tvDirectOverrides(){
                var saved=get('tvDirectMedia',{});
                return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{};
            }
            function directUrlForChannel(ch){
                var v=tvDirectOverrides()[ch.id],url=safeUrl(v),ty=kind(url);
                return ['hls','dash','file'].indexOf(ty)>=0?url:'';
            }
            function channelPage(ch){return domain()+'telewizja/#'+encodeURIComponent(ch.id);}
            function showTvChannel(ch){
                // The catalog lists 51 channels with empty ch.url: the hash-router is
                // only a site-page fallback, not a verified direct media stream.
                var direct=directUrlForChannel(ch);
                if(direct){var src={url:direct,type:kind(direct),headers:{},name:ch.name};
                    menuSelect('Плеєр · '+ch.name,[{id:'inner',title:'Програмний Lampa'},{id:'android',title:'Зовнішній VLC / MX Player'}],function(opt){openStream(src,{title:ch.name},opt.id);});return;}
                if(!ch.url){notify('Сайт дозволяє перегляд лише у власному браузері; відкриваємо сторінку каналу.');openBrowser(channelPage(ch));return;}
                chooseWebPlayback(ch.url,{title:ch.name},'tv');
            }
            function webPlayer(){
                area.empty();
                var v=webView;
                area.append(text('h2','str-section','▶ '+v.title));
                var toolbar=$('<div class="str-toolbar">');
                toolbar.append(btn('‹ '+tr('back'),function(){webView=null;draw();},'web-back'));
                toolbar.append(btn('↗ '+tr('browser'),function(){openBrowser(v.siteEventId?eventUrl('',domain(),v.siteEventId):v.url);},'web-browser'));
                toolbar.append(btn('↻ '+tr('refresh'),function(){draw();},'web-reload'));
                area.append(toolbar);
                area.append(text('div','str-tv-note',v.hasEmbed?'WEB iframe — перевірка в Lampa, це не прямий HLS-потік.':'Сайт не надав прямої адреси каналу. Пробуємо його сторінку; якщо iframe заблоковано — відкрий у браузері.'));
                var box=$('<div class="str-video-shell">');
                var frame=$('<iframe class="str-video-frame" title="Strumyk WEB video">')
                    .attr({src:v.url,allow:'autoplay; encrypted-media; fullscreen; picture-in-picture',allowfullscreen:'',
                           sandbox:'allow-forms allow-scripts allow-same-origin allow-presentation',referrerpolicy:'strict-origin-when-cross-origin'});
                box.append(frame);area.append(box);
                area.append(btn('✕ '+tr('back'),function(){webView=null;draw();},'web-close-bottom'));
            }
            /* Tests capabilities exposed in the running WebView only.
               No media URLs, no EME sessions, no key material, no license
               requests. This is NOT an attempt to decrypt Strumyk. */
            /* URL editor integrated in STRUMYK, not Lampa.Input.edit dialog.
               Keeps Apply/Cancel reachable above the host's bottom navigation. */
            function configView(){
                area.empty();
                area.append(text('h2','str-section','Адреса сайту Strumyk'));
                area.append(text('div','str-tv-note','Підтримуються лише перевірені домени Strumyk через HTTPS. Дані старого сервера не видаляються.'));
                var field=$('<input type="url" class="selector str-search-field str-config-input">')
                    .attr({placeholder:'https://strumyk.ca/',tabindex:0,
                           autocomplete:'off',autocorrect:'off',spellcheck:'false'})
                    .val(configDraft||domain());
                var message=text('div','str-tv-status','');
                var controls=$('<div class="str-demo-controls">');
                function cancel(){configEditing='';configDraft='';draw();}
                function apply(){
                    var h=normalizeHost(String(field.val()||'').trim());
                    if(!h){message.text('Некоректний URL. Використай https://strumyk.ca/ або інший підтверджений домен Strumyk.');return;}
                    set('host',h);configEditing='';configDraft='';
                    all=[];failMessage='';working=false;tvEpgStatus='idle';tvEpg=[];tvEpgFetched=0;
                    if(route==='tv'){draw();loadTvEpg(true);}else load();
                }
                field.on('input',function(){configDraft=String(field.val()||'').slice(0,600);});
                field.on('click focus',function(e){e.stopPropagation();});
                field.on('keydown',function(e){
                    if(e.key==='Enter'){e.preventDefault();e.stopPropagation();apply();}
                    else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();cancel();}
                    else e.stopPropagation();
                });
                area.append(field,message);
                controls.append(btn('✓ Зберегти адресу',apply,'config-save'),
                                btn('✕ Скасувати',cancel,'config-cancel'));
                area.append(controls);
            }
            function drmEnvironment(){
                var nav=env.navigator||{};
                var l=env.location||{};
                var ua=String(nav.userAgent||'');
                var out=[];
                var platform='невідомо';
                try{if(L.Platform&&typeof L.Platform.is==='function'){
                    if(L.Platform.is('android'))platform='Android';
                    else if(L.Platform.is('tizen'))platform='Tizen';
                    else if(L.Platform.is('webos'))platform='WebOS';
                }}catch(ignore){}
                out.push('STRUMYK '+VERSION);
                out.push('Платформа (Lampa): '+platform);
                out.push('Протокол сторінки: '+(l.protocol||'?'));
                out.push('Сторінка у Secure Context: '+String(!!env.isSecureContext));
                out.push('UA: '+(ua.indexOf('Android')!==-1?'Android ':'')+
                  (ua.indexOf('wv')!==-1?'WebView ':'')+
                  (ua.indexOf('Chrome')!==-1?'Chromium-family':'other'));
                out.push('navigator.requestMediaKeySystemAccess: '+(typeof nav.requestMediaKeySystemAccess));
                out.push('window.MediaKeys: '+(typeof env.MediaKeys));
                out.push('window.MediaKeySession: '+(typeof env.MediaKeySession));
                out.push('dashjs (глобальний): '+(typeof env.dashjs));
                out.push('Shaka (глобальний): '+!!(env.shaka&&env.shaka.Player));
                out.push('Lampa.Player.play: '+typeof (L.Player&&L.Player.play));
                out.push('Lampa.PlayerVideo.url: '+typeof (L.PlayerVideo&&L.PlayerVideo.url));
                out.push('Lampa.AndroidJS: '+typeof env.AndroidJS);
                out.push('');
                out.push('ClearKey / EME capability test: '+drmProbeStatus);
                out.push('');
                out.push('Мережа Strumyk /api/O.php: '+networkProbeStatus);
                out.push('');
                out.push('ВАЖЛИВО: EME в WebView не означає, що Lampa.Player.play передає DRM-конфігурацію.');
                out.push('Навіть підтримка ClearKey не дає жодних прав або ключів для конкретного потоку.');
                return out.join('\n');
            }
            function drmView(){
                area.empty();
                area.append(text('h2','str-section','DASH / DRM • діагностика Lampa'));
                area.append(btn('‹ Назад',function(){drmViewOpen=false;drmProbeSeq++;networkProbeSeq++;drmProbeBusy=false;networkProbeBusy=false;draw();},'drm-back'));
                area.append(text('div','str-tv-note','Перевірка можливостей цього WebView: без ключів або ліцензій спортивного провайдера.'));
                var drmControls=$('<div class="str-drm-controls">');
                drmControls.append(btn(drmProbeBusy?'◌ Перевіряємо ClearKey…':'🔎 Перевірити ClearKey EME',function(){probeClearkey();},'drm-run'));
                drmControls.append(btn(networkProbeBusy?'◌ Перевірка мережі…':'🌐 Перевірити Strumyk API (CORS / native)',function(){probeNetwork();},'network-run'));
                drmControls.append(btn('▶ Демовідео ClearKey DASH',function(){drmDemoOpen=true;drmDemoSeq++;draw();},'demo-open'));
                drmControls.append(btn('✕ Закрити',function(){drmViewOpen=false;drmProbeSeq++;networkProbeSeq++;drmProbeBusy=false;networkProbeBusy=false;draw();},'drm-close'));
                area.append(drmControls);
                area.append(text('pre','str-diag-text str-drm-report',drmEnvironment()));
            }
            /* Request transport comparison. NO credentials, manual UA, Referrer, key,
               token, signed URL, or proxy. Only endpoint /api/O.php metadata.
               Since browser JS cannot distinguish a CORS rejection from other
               network errors, label failures as CORS/NETWORK rather than CORS proven. */

            /* Public DASH-IF example only: published demo content and published test
               ClearKey data. Not a Strumyk license, KID or provider stream.
               Does not read keys, cookies, sessions or secrets from any site. */
            function drmDemoStatus(label){
                var el=area.find('[data-str-demo-status]');
                if(el&&el.length){el.text(label);el.toggleClass('str-demo-failed',/\b(?:ERROR|TIMEOUT|BLOCKED|DEMO ERROR)\b|Помилка|недоступн/i.test(String(label)));el.toggleClass('str-demo-ok',/^PLAYBACK_OK/.test(String(label)));}
            }
            function stopDrmDemo(){
                drmDemoSeq++;
                var p=drmDemoPlayer;drmDemoPlayer=null;
                var v=drmDemoVideo;drmDemoVideo=null;
                if(p){try{p.reset();}catch(ignore){try{p.destroy();}catch(ignore2){}}}
                if(v){try{v.pause();v.removeAttribute('src');v.load();}catch(ignore){}}
            }
            function closeDrmDemo(){stopDrmDemo();drmDemoOpen=false;draw();}
            function drmDemoView(){
                area.empty();
                area.append(text('h2','str-section','DRM DASH • офіційне тестове відео'));
                area.append(btn('‹ Назад',closeDrmDemo,'demo-back'));
                area.append(text('div','str-tv-note',
                    'Демонстраційний DASH-IF ClearKey. Не використовує потоки, ліцензії або ключі Strumyk. Відео спочатку без звуку.'));
                area.append(text('div','str-demo-status','Статус і код помилки з’являться ТУТ, над відео. Натисни «Запустити тест».')
                    .attr({ 'data-str-demo-status':'',role:'status','aria-live':'polite' }));
                var commands=$('<div class="str-demo-controls">');
                commands.append(btn('▶ Запустити тест',startDrmDemo,'demo-run'),
                    btn('■ Стоп',function(){stopDrmDemo();drmDemoStatus('Зупинено вручну');},'demo-stop'),
                    btn('✕ Закрити',closeDrmDemo,'demo-close'));
                area.append(commands);
                var box=$('<div class="str-video-shell str-demo-shell">');
                var video=$('<video playsinline controls muted preload="none">')
                    .css({width:'100%',height:'100%',background:'#000'})
                    .attr({playsinline:'',muted:'',controls:''});
                box.append(video);area.append(box);
                drmDemoVideo=video[0];
                area.append(text('div','str-tv-note','Якщо відео не запустилось, код помилки — над плеєром. Кнопка «Назад» доступна зверху.'));
            }
            function startDrmDemo(){
                if(!drmDemoOpen)return;
                var v=drmDemoVideo;
                stopDrmDemo();
                drmDemoVideo=v;
                var serial=drmDemoSeq;
                var D=env.dashjs;
                if(!v){drmDemoStatus('Помилка: немає відеоелемента');return;}
                if(!env.isSecureContext){drmDemoStatus('Потрібний HTTPS Secure Context');return;}
                if(!D||!D.MediaPlayer){drmDemoStatus('dash.js недоступний у цій оболонці');return;}
                if(typeof (env.navigator||{}).requestMediaKeySystemAccess!=='function'){
                    drmDemoStatus('EME API відсутній у цьому WebView');return;
                }
                drmDemoStatus('Створюю dash.js та перевіряю відтворення відкритого DRM-демо…');
                var player=null;
                try{
                    player=D.MediaPlayer().create();
                    if(!player||typeof player.setProtectionData!=='function')throw Error('setProtectionData unavailable');
                    drmDemoPlayer=player;
                    // ClearKey vectors published by the DASH-IF project in
                    // dash.js/samples/drm/clearkey.html (public test content).

                    var events=D.MediaPlayer.events||{};
                    if(typeof player.on==='function'&&events.ERROR)player.on(events.ERROR,function(ev){
                        if(serial!==drmDemoSeq||!drmDemoOpen)return;
                        var rawCode=ev&&ev.error&&ev.error.code||ev&&ev.event&&ev.event.id||'unknown';
                        drmDemoStatus('DASH ERROR: '+String(rawCode).slice(0,55)+'. Може бути CDN, CORS, кодек або DRM.');
                    });
                    v.muted=true;v.autoplay=true;
                    v.addEventListener('error',function(){
                        if(serial!==drmDemoSeq||!drmDemoOpen)return;
                        drmDemoStatus('VIDEO ERROR: '+String(v.error&&v.error.code||'unknown'));
                    });
                    var last=0,frames=0,readyNotified=false;
                    v.addEventListener('timeupdate',function(){
                        if(serial!==drmDemoSeq||!drmDemoOpen)return;
                        if(v.currentTime>last+0.3){last=v.currentTime;frames++;}
                        if(!readyNotified&&frames>=2&&v.videoWidth>0&&v.readyState>=2){
                            readyNotified=true;
                            drmDemoStatus('PLAYBACK_OK: DASH/ClearKey працює. '+v.videoWidth+'×'+v.videoHeight+
                              ', час '+Math.round(v.currentTime)+' с. Це лише тестовий відкритий потік.');
                        }
                    });
                    player.initialize(v,
                        'https://media.axprod.net/TestVectors/v7-MultiDRM-SingleKey/Manifest_1080p_ClearKey.mpd',
                        true);
                    // dash.js public sample configures demo ClearKey after initialize().
                    player.setProtectionData({'org.w3.clearkey':{
                        clearkeys:{'nrQFDeRLSAKTLifXUIPiZg':'FmY0xnWCPCNaSpRG-tUuTQ'}
                    }});
                    try{
                        var attempt=v.play();
                        if(attempt&&typeof attempt.catch==='function')attempt.catch(function(e){
                            if(serial!==drmDemoSeq||!drmDemoOpen)return;
                            drmDemoStatus('Автозапуск заблоковано ('+String(e.name||'Error')+'). Натисни Play на відео.');
                        });
                    }catch(ignore){}
                    setTimeout(function(){
                        if(serial!==drmDemoSeq||!drmDemoOpen||readyNotified)return;
                        drmDemoStatus('Через 18 с PLAYBACK_OK не підтверджено. Перевір статус CDN/DRM, чи є рух у відео, або натисни Play.');
                    },18000);
                }catch(err){
                    drmDemoStatus('DEMO ERROR: '+String(err&&err.message||err).slice(0,130));
                    stopDrmDemo();
                }
            }
            function probeNetwork(){
                if(networkProbeBusy||!drmViewOpen)return;
                networkProbeBusy=true;
                networkProbeStatus='перевіряємо браузерний fetch і Lampa.Reguest.native…';
                var seqNow=++networkProbeSeq;
                var endpoint=domain()+'api/O.php';
                draw();
                function race(job,ms){
                    return new Promise(function(resolve){
                        var done=false,t=setTimeout(function(){if(done)return;done=true;resolve('TIMEOUT '+ms+'ms');},ms);
                        Promise.resolve().then(job).then(function(x){
                            if(done)return;done=true;clearTimeout(t);resolve(x);
                        }).catch(function(e){
                            if(done)return;done=true;clearTimeout(t);
                            resolve('ERROR '+String(e&&e.name||'Error').slice(0,30));
                        });
                    });
                }
                function parseResult(body){
                    var str=typeof body==='string'?body:body===undefined?'':JSON.stringify(body);
                    if(str.length>1000000)return 'RESPONSE_TOO_LARGE';
                    try{
                        var data=JSON.parse(str);
                        if(data&&typeof data.body==='string')data=JSON.parse(data.body);
                        if(Array.isArray(data))return 'JSON ARRAY '+data.length+' records';
                        return 'JSON '+(data&&typeof data==='object'?'OBJECT':'scalar');
                    }catch(e){return 'NON_JSON '+str.length+' chars';}
                }
                function browser(){
                    if(typeof env.fetch!=='function')return Promise.resolve('FETCH_UNAVAILABLE');
                    return env.fetch(endpoint,{
                        method:'GET',mode:'cors',credentials:'omit',
                        cache:'no-store',headers:{Accept:'application/json'}
                    }).then(function(resp){
                        if(!resp.ok)return 'HTTP '+resp.status;
                        return resp.text().then(function(body){return 'HTTP '+resp.status+' '+parseResult(body);});
                    });
                }
                function native(){
                    if(!L.Reguest||typeof L.Reguest!=='function')return Promise.resolve('Lampa.Reguest_UNAVAILABLE');
                    return new Promise(function(resolve,reject){
                        var n;
                        try{
                            n=new L.Reguest();
                            if(n.timeout)n.timeout(6500);
                            n.native(endpoint,function(body){resolve(parseResult(body));},
                               function(err){
                                 var code=err&&typeof err==='object'&&err.status?String(err.status):'';
                                 reject(Error('native '+(code||'error')));
                               },null,{
                                 dataType:'text',returnHeaders:true,timeout:6500,
                                 headers:{Accept:'application/json'}
                               });
                        }catch(e){reject(e);}
                    });
                }
                Promise.all([race(browser,7000),race(native,7000)]).then(function(values){
                    if(seqNow!==networkProbeSeq||!drmViewOpen||!active)return;
                    networkProbeBusy=false;
                    networkProbeStatus='Chrome fetch: '+values[0]+'\nLampa native: '+values[1]+'\n' +
                        'ERROR TypeError під час fetch може означати CORS або мережу — потрібне підтвердження.';
                    draw();
                });
            }
            function probeClearkey(){
                if(drmProbeBusy||!drmViewOpen)return;
                var nav=env.navigator||{};
                if(typeof nav.requestMediaKeySystemAccess!=='function'){
                    drmProbeStatus='API відсутній у WebView або недоступний в цьому контексті';
                    draw();return;
                }
                var settings=[{
                    initDataTypes:['cenc'],
                    distinctiveIdentifier:'not-allowed',
                    persistentState:'not-allowed',
                    sessionTypes:['temporary'],
                    audioCapabilities:[{contentType:'audio/mp4; codecs="mp4a.40.2"'}],
                    videoCapabilities:[{contentType:'video/mp4; codecs="avc1.42E01E"'}]
                },{
                    initDataTypes:['cenc'],
                    distinctiveIdentifier:'not-allowed',
                    persistentState:'not-allowed',
                    sessionTypes:['temporary'],
                    videoCapabilities:[{contentType:'video/mp4; codecs="avc1.640028"'}]
                }];
                var token=++drmProbeSeq,done=false;
                drmProbeBusy=true;drmProbeStatus='триває перевірка доступності (без відкриття сесії)';
                draw();
                var pending;
                try{pending=nav.requestMediaKeySystemAccess('org.w3.clearkey',settings);}
                catch(e){drmProbeBusy=false;drmProbeStatus='JS помилка: '+String(e&&e.name||'Error').slice(0,45);draw();return;}
                var timer=setTimeout(function(){
                    if(done||token!==drmProbeSeq)return;
                    done=true;drmProbeBusy=false;drmProbeStatus='TIMEOUT: WebView не відповів за 7 с';if(active&&drmViewOpen)draw();
                },7000);
                Promise.resolve(pending).then(function(access){
                    if(done||token!==drmProbeSeq)return;done=true;clearTimeout(timer);
                    drmProbeBusy=false;
                    drmProbeStatus=access&&access.keySystem==='org.w3.clearkey'
                       ?'SUPPORTED для тестових AVC/AAC конфігурацій (без ключів)'
                       :'UNKNOWN: відповідь без підтвердження keySystem';
                    if(active&&drmViewOpen)draw();
                }).catch(function(err){
                    if(done||token!==drmProbeSeq)return;done=true;clearTimeout(timer);
                    drmProbeBusy=false;
                    drmProbeStatus='NOT SUPPORTED / BLOCKED: '+String(err&&err.name||'Error').slice(0,45)+
                        ' (для цих тестових конфігурацій)';
                    if(active&&drmViewOpen)draw();
                });
            }
            function diagnosticsView(){
                area.empty();
                area.append(text('h2','str-section',tr('diagnostics')));
                area.append(btn('✕ '+tr('back'),function(){diagnosticsOpen=false;draw();},'diag-close'));
                var withSources=all.filter(function(x){return x.sources&&x.sources.length>0;}).length;
                var directSources=all.reduce(function(n,x){return n+(x.sources||[]).filter(function(v){return ['hls','dash','file'].indexOf(v.type)>=0;}).length;},0);
                var summary=['STRUMYK '+VERSION,'URL: '+domain(),'Events: '+all.length,'Event source aggregation: J/O/M/X/L (dedup + union)',
                    'Events with sources: '+withSources+' / '+all.length,'Direct media refs: '+directSources,
                    'Error: '+(failMessage||'—'),'HTML chars: '+currentHtml.length,
                    'HTTP-профіль: '+get('http_profile','chrome'),'SPORT API:'].concat(apiChecks.length?apiChecks:['не перевірялися']).join('\n');
                area.append(text('pre','str-diag-text',summary));
                area.append(btn('✕ '+tr('back'),function(){diagnosticsOpen=false;draw();},'diag-close-bottom'));
            }
            function tvCards(){
                var rows=tvChannels.filter(function(ch){
                    return (tvCategory==='all'||(tvCategory==='favorites'?tvIsFavorite(ch.id):ch.category===tvCategory))&&(!tvSearch||ch.name.toLocaleLowerCase().indexOf(tvSearch.toLocaleLowerCase())!==-1);
                });
                area.append(text('h2','str-section',ttv('tv')+' · '+rows.length+'/'+tvChannels.length));
                var bar=$('<div class="str-toolbar">');
                bar.append(btn(ttv('tvFilter')+': '+(tvCategory==='all'?ttv('allTv'):tvCategory==='favorites'?ttv('tvFav'):ttv(tvCategory)),function(){
                    var cats=['all','favorites','podstawowe','sport','news','film','rozrywka'];
                    menuSelect(ttv('tvFilter'),cats.map(function(c){return {id:c,title:c==='all'?ttv('allTv'):c==='favorites'?ttv('tvFav'):ttv(c),subtitle:String(c==='all'?tvChannels.length:c==='favorites'?tvFavorites().length:tvChannels.filter(function(x){return x.category===c;}).length)};}),function(v){tvCategory=v.id;draw();});
                },'tv-category'));
                bar.append(btn('⌕ '+ttv('tvSearch'),function(){openInlineSearch('tv');},'tv-search'));
                bar.append(btn('↻ '+ttv('tvRefresh'),function(){loadTvEpg(true);},'tv-epg-refresh'));
                area.append(bar);if(searchEditing==='tv')renderInlineSearch('tv');
                area.append(text('div','str-tv-note','TV EPG працює автономно. Для 51 каналу немає підтвердженого потоку; сайт обмежує прямий запуск. Автопошук HLS/DASH доступний у картках спортивних подій, а для TV із WEB-джерелом — після натискання картки.'));
                if(tvEpgStatus==='loading')area.append(text('div','str-tv-status',ttv('tvLoad')));
                if(tvEpgStatus==='error')area.append(text('div','str-tv-status',ttv('tvError')+': '+tvEpgError));
                var grid=$('<div class="str-grid str-tv-grid">');
                rows.forEach(function(ch){
                    var card=$('<article class="str-card str-tv-card">');
                    card.append(text('div','str-card-meta',ttv(ch.category)));
                    card.append(text('div','str-tv-channel-name','📺 '+ch.name));
                    card.append(epgBlock(ch));
                    var toolbar=$('<div class="str-tv-actions">');
                    toolbar.append(btn(directUrlForChannel(ch)?'▶ Плеєр':ch.url?'◈ WEB-джерело':'↗ На сайті',function(){showTvChannel(ch);},'channel-'+ch.id,'str-tv-open'));
                    /* Manual stream entry removed: source resolution belongs to the plugin, not the user. */
                    toolbar.append(btn('↗ Браузер',function(){openBrowser(ch.url || channelPage(ch));},'channel-external-'+ch.id,'str-tv-external'));
                    toolbar.append(btn((tvIsFavorite(ch.id)?'★':'☆'),function(){toggleTvFavorite(ch.id);},'tv-fav-'+ch.id,'str-tv-fav'));
                    card.append(toolbar);
                    if(ch.url)card.append(text('small','str-tv-embed-note',ttv('tvWebOnly')));
                    grid.append(card);
                });
                area.append(grid);
            }
            function refreshTvVisuals(){
                if(!active||route!=='tv'||webView||diagnosticsOpen)return;
                area.find('.str-tv-epg[data-tv-id]').each(function(){
                    var el=$(this),id=el.attr('data-tv-id'),ch=tvChannels.filter(function(c){return c.id===id;})[0];
                    if(!ch)return;el.replaceWith(epgBlock(ch));
                });
                // Refresh the guide in the background after 10 minutes, only while TV tab is active.
                if(tvEpgStatus==='ok'&&Date.now()-tvEpgFetched>600000)loadTvEpg(false);
            }
            function loadTvEpg(force){
                if(tvEpgStatus==='loading')return;
                if(!force&&tvEpgStatus==='ok'&&Date.now()-tvEpgFetched<600000)return;
                var token=++tvEpgRequest;tvEpgStatus='loading';tvEpgError='';
                if(active&&route==='tv'&&!webView&&!diagnosticsOpen)draw();
                request(domain()+'api/epg.php').then(function(body){
                    if(token!==tvEpgRequest)return;
                    var parsed=JSON.parse(String(body));
                    if(parsed.ok!==1 || !Array.isArray(parsed.ch))throw Error('Unexpected EPG format');
                    tvEpg=parseTvEpg(parsed,tvChannels);
                    tvEpgStatus='ok';tvEpgFetched=Date.now();
                    tvClockServer=Number.isFinite(parsed.now)?parsed.now*1000:null;tvClockLocal=Date.now();
                    if(active&&route==='tv'&&!webView&&!diagnosticsOpen)draw();
                }).catch(function(err){if(token!==tvEpgRequest)return;
                    tvEpgStatus='error';tvEpgError=clean(err&&err.message||err).slice(0,150);
                    if(active&&route==='tv'&&!webView&&!diagnosticsOpen)draw();
                });
            }
            function draw(){if(!active)return;syncUiInsets();var viewKey=layoutViewKey();if(layoutLastView!==viewKey){layoutLastView=viewKey;area.scrollTop(0);}paintHeader();if(configEditing){configView();foot.text('STRUMYK · '+VERSION);focus('config-cancel');return;}if(drmDemoOpen){if(area.find('.str-demo-shell').length){foot.text('STRUMYK · '+VERSION);return;}drmDemoView();foot.text('STRUMYK · '+VERSION);focus('demo-back');return;}if(drmViewOpen){drmView();foot.text('STRUMYK · '+VERSION);focus('drm-back');return;}if(diagnosticsOpen){diagnosticsView();foot.text('STRUMYK · '+VERSION);focus('diag-close');return;}if(webView){webPlayer();foot.text('STRUMYK · '+VERSION);focus('web-back');return;}if(selected){detail();foot.text('STRUMYK · '+VERSION);focus('back');return;}area.empty();if(route==='tv'){tvCards();foot.text(domain()+' · '+VERSION);focus('tv-category');return;}listTools();var rows=route==='favorites'?favorites().map(function(f){return all.find(function(e){return e.id===f.id;})||f;}):all;rows=filterEvents(rows,{onlyLive:route==='live',search:search,sport:filter.sport,league:filter.league,date:filter.date,status:filter.status});area.append(text('div','str-section',tr(route==='favorites'?'fav':route==='live'?'live':'schedule')+' · '+rows.length));if(sportNote && route!=='favorites')area.append(text('div','str-tv-note',sportNote));if(rows.length)eventCards(rows);else {
                    area.append(text('div','str-empty',failMessage||tr('noEvents')));
                    if(failMessage){area.append(text('p','str-note',tr('probe')));area.append(btn(tr('diagnostics'),diagnostics,'diagnostics'));area.append(btn(tr('reload'),load,'retry'));}
                }foot.text(domain()+' · '+VERSION);focus();}
            function diagnostics(){diagnosticsOpen=true;draw();}
            function load(){loadNetwork();}
            function loadNetwork(){
                var token=++seq,host=domain();working=true;failMessage='';sportNote='';
                selected=null;diagnosticsOpen=false;webView=null;apiChecks=[];
                area.empty().append(text('div','str-empty','Автономне завантаження Strumyk: J / X / O + HTML + конфігурація L / M…'));
                function fetchArray(key,url){
                    return request(url).then(function(body){
                        var data=parseSportApiArray(body);
                        if(!data){apiChecks.push(key+': не JSON-масив');return [];} 
                        apiChecks.push(key+': '+data.length+' подій');return data;
                    }).catch(function(e){apiChecks.push(key+': '+clean(e&&e.message||e).slice(0,75));return [];});
                }
                function fetchPage(path){return request(host+path).then(function(html){return String(html);}).catch(function(e){
                    apiChecks.push('HTML '+path+': '+clean(e&&e.message||e).slice(0,75));return '';
                });}
                // The home page often returns an interstitial. TV is a distinct public
                // page with a real sports schedule + SK_SCHED.api initialization.
                var results=[fetchPage(''),fetchPage('telewizja/')];
                ['J','X','O'].forEach(function(k){results.push(fetchArray(k,host+'api/'+k+'.php'));});
                Promise.all(results).then(function(values){
                    if(!active||token!==seq)return;
                    var htmlHome=values[0],htmlTv=values[1],urls={},bundle={J:values[2],X:values[3],O:values[4],L:[],M:[]};
                    currentHtml=htmlHome||htmlTv;
                    [htmlHome,htmlTv].forEach(function(html,i){
                        var boot=sportApiUrlsFromHtml(html,host);
                        ['L','M'].forEach(function(k){if(!urls[k]&&boot[k])urls[k]=boot[k];});
                        apiChecks.push('HTML '+(i===0?'/':'/telewizja/')+': '+html.length+' chars'+(detectGate(html)?' [gate]':''));
                    });
                    var discovered=['L','M'].filter(function(k){return !!urls[k];});
                    return Promise.all(discovered.map(function(k){return fetchArray(k,urls[k]);})).then(function(arrays){
                        if(!active||token!==seq)return;
                        discovered.forEach(function(k,i){bundle[k]=arrays[i];});
                        var apiEvents=parseStrumykApiBundle(bundle,host),merged=Object.create(null),out=[];
                        var htmlEvents=[];
                        [htmlHome,htmlTv].forEach(function(html){if(html&&!detectGate(html)){
                            var p=parseHtml(html,host);htmlEvents=htmlEvents.concat(p.events||[]);
                        }});
                        apiEvents.concat(htmlEvents).forEach(function(ev){
                            if(!ev||!ev.id)return;
                            if(!merged[ev.id]){merged[ev.id]=ev;out.push(ev);}
                            else{var prev=merged[ev.id];if(ev.sources&&ev.sources.length){
                                var set=Object.create(null),arr=[];prev.sources.concat(ev.sources).forEach(function(v){
                                    var key=v.url+'|'+v.language+'|'+v.quality;if(!set[key]){set[key]=1;arr.push(v);}
                                });prev.sources=arr;}
                                if(!prev.sport&&ev.sport)prev.sport=canonicalSport(ev.sport);
                                if(!prev.league&&ev.league)prev.league=ev.league;
                                if(!prev.live&&ev.live){prev.live=true;prev.finished=false;}
                            }
                        });
                        all=out;working=false;
                        if(!discovered.length)apiChecks.push('L/M: сайт не віддав параметри в HTML');
                        apiChecks.push('events: JXO='+apiEvents.length+', HTML='+htmlEvents.length+', final='+all.length);
                        if(all.length){
                            sportNote=all.length+' подій, автономно. '+(discovered.length?'Параметризовані L/M доступні: '+discovered.join(', ')+'. ':'L/M не знайдено у HTML. ')+'DOM статичної сторінки: '+htmlEvents.length+'. '+(all.length<100?'Можливо неповний каталог.':'');
                            failMessage='';
                        }else{
                            failMessage='Джерела каталогу не повернули подій. Перевір звіт у Діагностиці.';
                        }
                        draw();
                    });
                }).catch(function(e){if(!active||token!==seq)return;working=false;
                    failMessage='Помилка каталогу: '+clean(e&&e.message||e).slice(0,180);draw();});
            }
            /* In-plugin notices appear above the content, never behind
               the host application's fixed bottom mobile navbar. */
            this.showNotice=function(message){
                if(!active)return false;
                var serial=++toastSerial;
                root.find('.str-notice').remove();
                var box=$('<div class="str-notice">').attr({role:'status','aria-live':'polite'});
                var cleanText=String(message==null?'':message).replace(/https?:\/\/[^\s"']+/g,'[URL]').slice(0,250);
                box.append(text('span','str-notice-message',cleanText));
                var close=$('<button type="button" class="str-notice-close">✕</button>');
                close.on('click',function(){box.remove();});
                box.append(close);
                root.append(box);
                setTimeout(function(){if(serial===toastSerial)box.remove();},7000);
                return true;
            };
            this.showEmbedded=function(url,title){webView={url:url,title:title||'WEB Player',isTv:false,hasEmbed:true};draw();};
            this.create=function(parent){if(parent&&parent.css)parent.css({height:'100%',minHeight:0});return root;};this.render=function(){return root;};
            this.start=function(){active=true;currentScreen=this;env.document.body.classList.add('strumyk-active');if(!layoutListenerActive&&env.addEventListener){env.addEventListener('resize',onLayoutResize);layoutListenerActive=true;}syncUiInsets();focusController();if(tvTimer===null)tvTimer=env.setInterval(refreshTvVisuals,30000);if(route==='tv'){draw();if(tvEpgStatus==='idle')loadTvEpg(false);}else if(!all.length&&!working&&!failMessage)load();else draw();};
            this.stop=function(){toastSerial++;root.find('.str-notice').remove();if(layoutListenerActive&&env.removeEventListener){env.removeEventListener('resize',onLayoutResize);layoutListenerActive=false;}layoutLastView='';stopDrmDemo();drmDemoOpen=false;root.find('.str-video-frame').attr('src','about:blank').remove();active=false;searchEditing='';searchDraft='';configEditing='';configDraft='';drmProbeSeq++;drmProbeBusy=false;networkProbeSeq++;networkProbeBusy=false;drmViewOpen=false;videoBusy=false;videoStatus='';seq++;tvEpgRequest++;if(tvEpgStatus==='loading')tvEpgStatus='idle';if(tvTimer!==null){env.clearInterval(tvTimer);tvTimer=null;}env.document.body.classList.remove('strumyk-active');};this.pause=this.stop;
            this.destroy=function(){self.stop();root.remove();if(currentScreen===this)currentScreen=null;};
        }
        function open(){L.Activity.push({url:'',title:'STRUMYK',component:'strumyk_sports',page:1});}
        function ensureMenu(){if(env.document.querySelector('.strumyk-menu'))return;var target=$('.menu .menu__list').first();if(!target.length)return;var item=$('<li class="menu__item selector strumyk-menu"><div class="menu__ico">⚡</div><div class="menu__text">STRUMYK SPORTS</div></li>');item.on('hover:enter.str click.str',open);target.append(item);}
        function addCss(){if(env.document.getElementById('strumyk-style'))return;$('<style id="strumyk-style">').text(
            '.strumyk-active .head{display:none}.strumyk-active .content{top:0!important}.str-screen{--str-text:#f6f8ff;--str-muted:#aebbd0;min-height:100%;height:100%;display:flex;flex-direction:column;color:var(--str-text);background:radial-gradient(ellipse at 85% -5%,#174366 0,transparent 40%),linear-gradient(145deg,#081526,#102239 62%,#0a1727);overflow:hidden;font-size:1.12em}.str-head{padding:1.3em 2em .8em;display:flex;align-items:center;justify-content:space-between;gap:1em}.str-brand{font-weight:900;font-size:1.5em;letter-spacing:.045em;color:#7dd3fc}.str-brand-tag{font-size:.47em;letter-spacing:.3em;color:#d5e7fa;margin-left:.35em}.str-head-actions{display:flex;gap:.5em}.str-nav{padding:0 2em .8em;display:flex;gap:.5em;border-bottom:1px solid #ffffff20;overflow-x:auto}.str-btn{color:inherit;background:#1a344c;border:1px solid #7296b13d;border-radius:.75em;padding:.65em 1em;font:inherit;cursor:pointer;text-align:left}.str-btn.focus,.str-btn:focus,.str-btn:hover{background:#2b6287!important;box-shadow:0 0 0 .16em #67cdfa77;outline:none}.str-current{background:#255b84;color:#d4f5ff}.str-icon{font-size:1.3em;min-width:2.6em;text-align:center}.str-area{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:1.25em 2em 3em}.str-toolbar{display:flex;flex-wrap:wrap;gap:.65em;margin:.5em 0 1.2em}.str-section{font-weight:800;font-size:1.24em;margin:1.25em 0 .75em}.str-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(19em,100%),1fr));gap:1em}.str-card{padding:1.1em;border-radius:1em;background:linear-gradient(150deg,#203c58ee,#12283ddc);border:1px solid #6b9ac249;min-width:0;box-shadow:0 10px 25px #00000030}.str-card-meta{color:#9edcff;font-size:.76em;min-height:1.4em;margin-bottom:.7em;overflow-wrap:anywhere}.str-match{display:block;width:100%;font-weight:750;font-size:1.08em;padding:.3em 0;margin:.25em 0;background:transparent;border:0;line-height:1.45}.str-card-time,.str-subtitle,.str-source-info{color:var(--str-muted);font-size:.83em}.str-score{font-size:1.3em;font-weight:800;margin-top:.5em}.str-title{font-size:1.7em;margin:.2em 0 .5em;overflow-wrap:anywhere}.str-stream-row{display:flex;flex-direction:column;gap:.4em;background:#17324a;border:1px solid #496e873f;border-radius:.8em;padding:.7em;margin:.5em 0}.str-stream-btn{background:#225476}.str-group-label{font-size:.95em;letter-spacing:.1em;color:#8cdbff}.str-empty{border:1px dashed #6284a366;border-radius:1em;padding:1.2em;color:#e2ecf4;margin:1em 0}.str-note{color:#a3b9cc}.str-foot{flex:none;border-top:1px solid #ffffff18;color:#8fabbc;font-size:.7em;padding:.5em 2.8em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.str-modal{font-size:1.1em;line-height:1.55;padding:1em}.strumyk-menu .menu__ico{font-size:1.1em;color:#7dd3fc}.str-tv-epg{font-size:.8em;margin:.65em 0 .15em;line-height:1.4;min-height:2em}.str-tv-now{color:#ecf7ff;font-weight:650;overflow-wrap:anywhere}.str-tv-next,.str-tv-range,.str-tv-embed-note{color:#a2bfd0;font-size:.85em;line-height:1.4;overflow-wrap:anywhere}.str-tv-range{margin-top:.4em}.str-tv-next{margin-top:.45em}.str-tv-track{margin:.4em 0;height:.35em;background:#4d6575;border-radius:1em;overflow:hidden}.str-tv-fill{height:100%;background:linear-gradient(90deg,#1db9e5,#78d7ff);border-radius:1em;transition:width .3s ease}.str-tv-note{font-size:.76em;color:#afcedd;margin:.3em 0 1em}.str-tv-status{font-size:.75em;color:#caeaf6;margin:.4em 0}.str-tv-channel-name{font-size:1.12em;font-weight:800;margin:.4em 0 .7em;overflow-wrap:anywhere}.str-tv-actions{display:flex;align-items:center;gap:.5em;margin-top:1.1em}.str-tv-open{font-size:.72em;flex:1}.str-tv-fav{font-size:1.1em;min-width:2.7em;text-align:center}.str-tv-actions{flex-wrap:wrap}.str-tv-external{font-size:.72em}.str-diag-text{white-space:pre-wrap;overflow-wrap:anywhere;background:#11253b;border:1px solid #8aa8bc45;padding:1em;border-radius:.8em;font-size:.85em;max-height:55vh;overflow-y:auto}.str-video-shell{width:100%;height:56vh;max-height:80vh;min-height:180px;background:#000;border-radius:.8em;overflow:hidden;margin:.7em 0 1.5em}.str-video-frame{width:100%;height:100%;border:0;display:block} .str-inline-search{display:flex;align-items:center;flex-wrap:wrap;gap:.65em;background:#102e46;border:1px solid #80bad35c;padding:.8em;border-radius:.75em;margin:.65em 0}.str-inline-search .str-source-info{flex-basis:100%;margin:0}.str-search-field{flex:1;min-width:10em;max-width:100%;border:2px solid #6fc7e6;border-radius:.65em;background:#071e30;color:#fff;padding:.65em;font-size:1em}.str-search-field:focus{outline:2px solid #77e5ff}.str-quick-sports{display:flex;flex-wrap:wrap;gap:.55em;margin:.6em 0 1em}.str-sport-chip{font-size:.86em;padding:.65em 1em}.str-tv-status{font-weight:650}.str-tv-open{min-width:9em}  @media(max-width:650px){.str-screen{font-size:1em}.str-head,.str-nav{padding-left:1em;padding-right:1em}.str-area{padding:1em}.str-grid{grid-template-columns:1fr 1fr;gap:.55em}.str-card{padding:.8em}.str-brand{font-size:1.3em}.str-btn{padding:.65em .7em}.str-card-meta{font-size:.7em}.str-match{font-size:1em}}@media(max-width:440px){.str-grid{grid-template-columns:1fr}}'
        ).appendTo('head');}
        function addLayoutCss(){
            var id='strumyk-layout-v029';
            if(env.document.getElementById(id))return;
            $('<style>').attr('id',id).text(
              '.str-screen{height:100%!important;max-height:100%!important;min-height:0!important;box-sizing:border-box!important;padding-bottom:var(--str-bottom-safe,0px)!important;overflow:hidden!important}' +
              '.str-head,.str-nav,.str-foot{flex-shrink:0!important;min-width:0}' +
              '.str-area{flex:1 1 0!important;min-height:0!important;min-width:0!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain;padding-bottom:calc(2.5rem + env(safe-area-inset-bottom,0px))!important;scroll-padding-top:1rem;scroll-padding-bottom:2rem;-webkit-overflow-scrolling:touch}' +
              '.str-area>*{max-width:100%;box-sizing:border-box}' +
              '.str-head,.str-toolbar,.str-demo-controls,.str-drm-controls,.str-tv-actions{flex-wrap:wrap!important}' +
              '.str-head-actions{flex-shrink:0}.str-drm-controls,.str-demo-controls{display:flex;flex-wrap:wrap;gap:.45em;margin:.55em 0 .8em;align-items:stretch}' +
              '.str-drm-controls .str-btn,.str-demo-controls .str-btn{flex:1 1 auto;min-width:0;max-width:100%;font-size:.84em;line-height:1.3;overflow-wrap:anywhere}' +
              '.str-demo-controls .str-btn:first-child{flex-grow:2;background:#23597a}' +
              '.str-demo-status{position:sticky;top:0;z-index:4;white-space:pre-wrap;overflow-wrap:anywhere;padding:.7em .85em;margin:.5em 0;border:1px solid #7db0cd77;border-radius:.55em;background:#12334b;color:#f3faff;font-size:.9em;font-weight:650;line-height:1.45;max-height:28vh;overflow-y:auto}' +
              '.str-demo-failed{border-color:#e9ad5f;color:#ffe6ba;background:#51351f}.str-demo-ok{border-color:#67d8a8;color:#dcffec;background:#134b3b}' +
              '.str-video-shell{height:auto!important;max-height:min(55vh,520px)!important;min-height:0!important;aspect-ratio:16/9!important;position:relative}' +
              '.str-demo-shell{height:auto!important;max-height:min(48vh,420px)!important;min-height:0!important;aspect-ratio:16/9!important;margin:.65em 0 1em}' +
              '.str-demo-shell>video{display:block;width:100%!important;height:100%!important;object-fit:contain;background:#000}' +
              '.str-video-frame{width:100%!important;height:100%!important}' +
              '.str-drm-report{max-height:36vh!important;overflow-y:auto!important;overflow-wrap:anywhere;white-space:pre-wrap;box-sizing:border-box}' +
              '.str-diag-text{max-width:100%;overflow-wrap:anywhere;white-space:pre-wrap;font-size:.8em;line-height:1.4;box-sizing:border-box}' +
              '.str-btn{white-space:normal!important;overflow-wrap:anywhere;line-height:1.35;min-height:2.5em}' +
              '.str-foot{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
              '.str-screen{position:relative!important}.str-notice{position:absolute;top:clamp(4rem,12vh,7rem);left:1rem;right:1rem;z-index:40;display:flex;align-items:flex-start;gap:.6em;justify-content:space-between;padding:.7em 1em;border:1px solid #7dc7e9;border-radius:.75em;background:#173951;color:#fff;box-shadow:0 10px 34px #0009;overflow-wrap:anywhere;font-size:.9em;line-height:1.4}.str-notice-message{flex:1;min-width:0}.str-notice-close{flex:none;border:0;background:#2a607c;color:#fff;border-radius:.5em;padding:.3em .55em;font-size:1.2em}' +
              '.str-config-input{display:block;width:100%;margin:.7em 0;box-sizing:border-box}' +
              '.str-tv-grid,.str-grid{min-width:0}.str-card,.str-stream-row{overflow-wrap:anywhere}' +
              '@media(max-width:700px){.str-head{gap:.45em;padding-top:.75em!important}.str-brand{font-size:1.13em!important}.str-head-actions{gap:.35em}.str-head-actions .str-btn{min-width:2.2em;padding:.43em .55em}.str-nav{gap:.3em;padding-bottom:.55em!important}.str-area{padding:1em!important;padding-bottom:calc(2rem + env(safe-area-inset-bottom,0px))!important}.str-section{font-size:1.12em;margin:.65em 0}.str-drm-controls,.str-demo-controls{gap:.4em}.str-drm-controls .str-btn,.str-demo-controls .str-btn{font-size:.86em;padding:.57em .65em}.str-demo-status{font-size:.88em}.str-video-shell{max-height:43vh!important}}' +
              '@media(max-height:570px){.str-video-shell{max-height:38vh!important}.str-demo-shell{max-height:35vh!important}.str-head{padding-top:.5em!important;padding-bottom:.3em!important}}'
            ).appendTo('head');
        }
        function init(){addCss();addLayoutCss();L.Component.add('strumyk_sports',Screen);ensureMenu();if(env.MutationObserver){var obs=new env.MutationObserver(function(){if(!env.document.querySelector('.strumyk-menu'))ensureMenu();});obs.observe(env.document.documentElement,{childList:true,subtree:true});}else env.setInterval(ensureMenu,2500);}
        env.StrumykPlugin={version:VERSION,open:open};
        if(env.appready)init();else if(L.Listener&&L.Listener.follow)L.Listener.follow('app',function(e){if(e.type==='ready')init();});
    }
    return {canonicalSport:canonicalSport,sportOptions:sportOptions,findDirectMedia:findDirectMedia,findNestedIframes:findNestedIframes,resolveOpenMedia:resolveOpenMedia,parseSportApiArray:parseSportApiArray,sportApiUrlsFromHtml:sportApiUrlsFromHtml,normalizeTvChannels:normalizeTvChannels,parseTvEpg:parseTvEpg,tvNowNext:tvNowNext,tvCatalogSnapshot:TV_CATALOG_SNAPSHOT,tvLabel:tvLabel,parseStrumykApiBundle:parseStrumykApiBundle,actualEmbeds:actualEmbeds,version:VERSION,defaultHost:DEFAULT_HOST,translations:LABELS,t:t,kind:kind,safeUrl:safeUrl,normalizeHost:normalizeHost,normalizeEvent:normalizeEvent,extractEvents:extractEvents,extractSources:extractSources,detectGate:detectGate,parseHtml:parseHtml,readScheduleDocument:readScheduleDocument,readStrumykSourcesDocument:readStrumykSourcesDocument,readStrumykSourcesCapture:readStrumykSourcesCapture,isRedactedLink:isRedactedLink,filterEvents:filterEvents,install:install};
}));