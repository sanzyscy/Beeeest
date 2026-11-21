/* STRUMYK for Lampa — research build 0.10.0
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
    var VERSION = '0.10.0-research';
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
    function eventUrl(raw, host, id) { var v=safeUrl(raw,host||DEFAULT_HOST); if(v && /^(?:strumyk\.)/.test(hostOf(v))) return v; var token=clean(id); if (/^[a-z0-9_-]{4,80}$/i.test(token)) return (host||DEFAULT_HOST)+'#'+token; return host||DEFAULT_HOST; }
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
    function normalizeEvent(raw, base) {
        if(!raw || typeof raw!=='object'||Array.isArray(raw))return null;
        var home=first(raw,['homeTeam','home_team','team1','home','competitor1','participant1']);
        var away=first(raw,['awayTeam','away_team','team2','away','competitor2','participant2']);
        var name=strumykTitle(raw.title) || first(raw,['name','match','eventName','event_name','eventTitle','event_title','description']) || (home && away ? home+' — '+away : '');
        if(!name || name.length>250)return null;
        var id=first(raw,['hash','eventId','event_id','matchId','match_id','slug','id','uid']);
        var page=first(raw,['pageUrl','page_url','eventUrl','event_url','href','permalink']);
        if(!id && page.indexOf('#')>=0) id=page.split('#').pop();
        var sport=first(raw,['sport','sportName','sport_name','discipline','category','sportTitle']);
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
        ['J','O','M','X','L'].forEach(function(source){
            var entries=Array.isArray(bundle[source])?bundle[source]:[];
            entries.forEach(function(raw){
                if(!raw || typeof raw!=='object'||Array.isArray(raw))return;
                var id=str(raw.id); if(!id || seen[id])return;
                var ev=normalizeEvent(raw,base||DEFAULT_HOST);if(!ev)return;
                seen[id]=true;
                ev.apiSource=source;ev.popular=!!popular[id];
                if(!ev.home && raw.title && typeof raw.title==='object'){
                    var title=raw.title.pl || raw.title.en || {};
                    ev.home=str(title.home);ev.away=str(title.away);
                }
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
        function notify(s){if(L.Noty&&L.Noty.show)L.Noty.show(s);}
        function menuSelect(title,items,callback){L.Select.show({title:title,nomark:true,items:items.map(function(v){return {title:v.title,subtitle:v.subtitle||'',id:v.id,selected:!!v.selected};}),onSelect:callback,onBack:function(){if(L.Controller)L.Controller.toggle('content');}});}
        function request(url) {
            return new Promise(function(ok,no){
                var timeout=setTimeout(function(){no(new Error('TIMEOUT'));},22000),done=false,n=new L.Reguest();
                function finish(error,value){if(done)return;done=true;clearTimeout(timeout);if(error)no(error);else ok(value);}
                try{n.timeout(20000);n.native(url,function(body){try {var result=body;if(typeof body==='string'&&body.charAt(0)==='{'){try{var outer=JSON.parse(body);if(outer&&typeof outer.body==='string')result=outer.body;}catch(ignore){}}finish(null,String(result));}catch(e){finish(e);}},function(e){finish(new Error('NETWORK '+JSON.stringify(e||'')));},null,{dataType:'text',returnHeaders:true,timeout:20000});}
                catch(e){finish(e);}
            });
        }
        function openBrowser(url){var u=safeUrl(url,domain());if(!u)return notify(tr('unverified'));try{if(env.AndroidJS&&typeof env.AndroidJS.openBrowser==='function')env.AndroidJS.openBrowser(u);else env.open(u,'_blank','noopener');}catch(e){notify(tr('httpError'));}}
        function openStream(src,evt,mode){
            if(src.type==='web'||src.type==='embed'){if(!src.url)return notify(tr('unverified'));openBrowser(src.url);return;}
            if(src.type==='acestream'){if(env.AndroidJS&&env.AndroidJS.openBrowser)env.AndroidJS.openBrowser(src.url);else notify(tr('unverified'));return;}
            if(src.type==='youtube'){openBrowser(src.url);return;}
            try {if(L.Player.callback)L.Player.callback(function(){if(currentScreen)currentScreen.start();});if(L.Player.playlist)L.Player.playlist([]);L.Player.runas(mode);try{L.Player.play({url:src.url,title:evt.title,tv:true,headers:src.headers||{},launch_player:mode,hls_type:src.type==='hls'?'hlsjs':undefined});}finally{L.Player.runas('');}}
            catch(e){notify(tr('httpError')+': '+e.message);}
        }
        var currentScreen=null;
        function Screen() {
            var self=this,active=false,working=false,seq=0,route='schedule',all=[],selected=null,failMessage='',currentHtml='',detailSources=[],sourceFilter={language:'all',type:'all'},search='',filter={sport:'all',league:'all',date:'all',status:'all'},tvCategory='all',tvSearch='',tvEpgStatus='idle',tvEpgError='',tvEpg=[],tvEpgRequest=0,tvEpgFetched=0,tvClockServer=null,tvClockLocal=null,tvTimer=null,tvChannels=normalizeTvChannels(TV_CATALOG_SNAPSHOT),root=$('<div class="str-screen">'),head=$('<div class="str-head">'),nav=$('<div class="str-nav">'),area=$('<div class="str-area">'),foot=$('<div class="str-foot">');
            root.append(head,nav,area,foot);
            function focus(preferred){if(!active)return;L.Controller.collectionSet(root);var n=preferred?root.find('.selector:visible[data-str-key="'+preferred+'"]'): $();if(!n.length)n=root.find('.selector:visible').first();L.Controller.collectionFocus(n.length?n:false,root);}
            function paintHeader(){head.empty().append(text('div','str-brand','⚡ STRUMYK').append(text('span','str-brand-tag',' SPORTS')),
                $('<div class="str-head-actions">').append(btn('↻',function(){if(route==='tv')loadTvEpg(true);else load();},'refresh','str-icon'),btn('⚙',settings,'settings','str-icon')));
                nav.empty();[['schedule','schedule'],['live','live'],['favorites','fav'],['tv','tv']].forEach(function(x){nav.append(btn(x[1]==='tv'?ttv('tv'):tr(x[1]),function(){route=x[0];selected=null;draw();if(route==='tv'){if(tvEpgStatus==='idle')loadTvEpg(false);}else if(!all.length&&!working&&!failMessage)load();},'nav-'+x[0],route===x[0]?'str-current':''));});
            }
            function focusController(){L.Controller.add('content',{toggle:function(){focus();},left:function(){if(typeof Navigator!=='undefined'&&Navigator.canmove('left'))Navigator.move('left');else L.Controller.toggle('menu');},right:function(){if(typeof Navigator!=='undefined'&&Navigator.canmove('right'))Navigator.move('right');},up:function(){if(typeof Navigator!=='undefined'&&Navigator.canmove('up'))Navigator.move('up');},down:function(){if(typeof Navigator!=='undefined'&&Navigator.canmove('down'))Navigator.move('down');},back:back});L.Controller.toggle('content');}
            function back(){if(selected){selected=null;draw();return;}if(L.Activity.backward)L.Activity.backward();}
            function settings(){menuSelect(tr('settings'),[
                {id:'lang',title:tr('language'),subtitle:lang().toUpperCase()}, {id:'player',title:tr('player'),subtitle:tr(get('player','ask')==='android'?'external':get('player','ask'))},
                {id:'host',title:tr('siteHost'),subtitle:domain()}, {id:'manual',title:tr('manual')},{id:'about',title:tr('about'),subtitle:'STRUMYK '+VERSION}
            ],function(v){
                if(v.id==='lang')menuSelect(tr('language'),[{id:'uk',title:'Українська'},{id:'pl',title:'Polski'},{id:'ru',title:'Русский'}],function(c){set('lang',c.id);draw();});
                if(v.id==='player')menuSelect(tr('player'),[{id:'inner',title:tr('inner')},{id:'android',title:tr('external')},{id:'ask',title:tr('ask')}],function(c){set('player',c.id);draw();});
                if(v.id==='host')L.Input.edit({title:tr('changeHost'),value:domain(),free:true,nosave:true},function(raw){var h=normalizeHost(raw);if(!h){notify(tr('unverified'));return;}set('host',h);tvEpgStatus='idle';tvEpg=[];tvEpgFetched=0;if(route==='tv')loadTvEpg(true);else load();});
                if(v.id==='manual')L.Input.edit({title:tr('manual'),value:'',free:true,nosave:true},function(raw){try{var data=JSON.parse(String(raw));var apiPayload=data&&typeof data==='object'&&['L','J','X','M','O'].some(function(k){return Array.isArray(data[k]);});var events=apiPayload?parseStrumykApiBundle(data,domain()):extractEvents(data,domain());if(!events.length)throw Error('empty');all=events;failMessage='';selected=null;draw();}catch(e){notify(tr('invalidJson'));}});
                if(v.id==='about'){L.Modal.open({title:'STRUMYK '+VERSION,size:'medium',html:text('div','str-modal',tr('probe')+' · '+domain()),onBack:function(){L.Modal.close();focusController();}});}
            });}
            function favorites(){var rows=get('favorites',[]);return Array.isArray(rows)?rows:[];}
            function isFav(id){return favorites().some(function(x){return x.id===id;});}
            function toggleFav(e){var f=favorites().filter(function(x){return x.id!==e.id;});if(!isFav(e.id))f.unshift({id:e.id,title:e.title,url:e.url,sport:e.sport,league:e.league,start:e.start,timeLabel:e.timeLabel,live:false,finished:false,sources:[]});set('favorites',f);draw();}
            function timeText(e){if(e.start){try{return new Date(e.start).toLocaleString(lang()==='pl'?'pl-PL':lang()==='ru'?'ru-RU':'uk-UA',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});}catch(ignore){}}return e.timeLabel||tr('unknown');}
            function listTools(){var toolbar=$('<div class="str-toolbar">');toolbar.append(btn('☷ '+tr('filters'),filterMenu,'filters'),btn('⌕ '+tr('search'),function(){L.Input.edit({title:tr('search'),value:search,free:true,nosave:true},function(value){search=clean(value);draw();});},'search'));
                if(filter.sport!=='all'||filter.league!=='all'||filter.date!=='all'||filter.status!=='all'||search)toolbar.append(btn('× '+tr('filterReset'),function(){filter={sport:'all',league:'all',date:'all',status:'all'};search='';draw();},'clear'));
                area.append(toolbar);
            }
            function filterMenu(){menuSelect(tr('filters'),[{id:'sport',title:tr('sports'),subtitle:filter.sport==='all'?tr('all'):filter.sport},{id:'league',title:tr('leagues'),subtitle:filter.league==='all'?tr('all'):filter.league},{id:'date',title:tr('dates'),subtitle:tr(filter.date)},{id:'status',title:tr('status'),subtitle:tr(filter.status)}],function(c){var entries=[];if(c.id==='sport'||c.id==='league'){entries=unique(all.map(function(e){return e[c.id];}).filter(Boolean)).sort();}else if(c.id==='date')entries=['today','tomorrow','yesterday'];else entries=['live','upcoming','finished'];menuSelect(tr(c.id==='sport'?'sports':c.id==='league'?'leagues':c.id==='date'?'dates':'status'),[{id:'all',title:tr('all')}].concat(entries.map(function(x){return {id:x,title:tr(x)};})),function(opt){filter[c.id]=opt.id;draw();});});}
            function eventCards(rows){var grid=$('<div class="str-grid">');rows.slice(0,250).forEach(function(e){var card=$('<article class="str-card">'),meta=text('div','str-card-meta',(e.live?'● LIVE  ·  ':e.finished?tr('finished')+' · ':'')+[e.sport,e.league].filter(Boolean).join(' / ')),name=btn(e.title,function(){selected=e;detailSources=e.sources||[];sourceFilter={language:'all',type:'all'};draw();},'event-'+e.id,'str-match'),bottom=text('div','str-card-time','◷ '+timeText(e));card.append(meta,name,bottom);if(e.score)card.append(text('div','str-score',e.score));grid.append(card);});area.append(grid);}
            function chooseSource(src){var mode=get('player','ask');if(src.type==='web'||src.type==='embed'||src.type==='youtube'||src.type==='acestream'){openStream(src,selected,'android');return;}if(mode==='ask')menuSelect(tr('player'),[{id:'inner',title:tr('inner')},{id:'android',title:tr('external')}],function(p){openStream(src,selected,p.id);});else openStream(src,selected,mode);}
            function detail(){var e=selected;area.empty();area.append(text('h1','str-title',e.title),text('div','str-subtitle',[e.sport,e.league,timeText(e)].filter(Boolean).join(' · ')));
                var actions=$('<div class="str-toolbar">').append(btn('‹ '+tr('back'),back,'back'),btn((isFav(e.id)?'★ ':'☆ ')+tr(isFav(e.id)?'unfavorite':'favorites'),function(){toggleFav(e);},'fav'));
                actions.append(btn('↗ '+tr('openSite'),function(){openBrowser(e.url);},'site'));area.append(actions);
                var available=e.sources||[],list=available.filter(function(s){return (sourceFilter.language==='all'||s.language===sourceFilter.language)&&(sourceFilter.type==='all'||s.type===sourceFilter.type);});
                area.append(text('h2','str-section',tr('sources')+' · '+list.length+' / '+available.length));
                if(available.length){var tools=$('<div class="str-toolbar">');tools.append(btn(tr('sourceLanguage')+' · '+(sourceFilter.language==='all'?tr('all'):sourceFilter.language),function(){var choices=[{id:'all',title:tr('all')}].concat(unique(available.map(function(v){return v.language;}).filter(Boolean)).map(function(v){return {id:v,title:v};}));menuSelect(tr('sourceLanguage'),choices,function(v){sourceFilter.language=v.id;draw();});},'source-language'));
                    tools.append(btn(tr('sourceType')+' · '+(sourceFilter.type==='all'?tr('typeAll'):sourceFilter.type.toUpperCase()),function(){var choices=[{id:'all',title:tr('typeAll')}].concat(unique(available.map(function(v){return v.type;})).map(function(v){return {id:v,title:v.toUpperCase()};}));menuSelect(tr('sourceType'),choices,function(v){sourceFilter.type=v.id;draw();});},'source-type'));area.append(tools);}
                if(!list.length){area.append(text('div','str-empty',available.length?tr('noEvents'):tr('noSources')));return;}
                var grouped={hls:[],dash:[],file:[],youtube:[],acestream:[],embed:[],web:[]};list.forEach(function(s){(grouped[s.type]||grouped.web).push(s);});
                Object.keys(grouped).forEach(function(key){if(!grouped[key].length)return;area.append(text('h3','str-group-label',key.toUpperCase()+' · '+grouped[key].length));grouped[key].forEach(function(src,i){var label=(src.type==='embed'?'↗ ':'▶ ')+src.name,sub=[src.language,src.quality,src.type==='embed'?'WEB IFRAME (не пряме відео)':src.type.toUpperCase()].filter(Boolean).join(' · '),card=$('<div class="str-stream-row">');card.append(btn(label, function(){chooseSource(src);},'source-'+key+'-'+i,'str-stream-btn'),text('small','str-source-info',sub));area.append(card);});});
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
                bar.append(btn('⌕ '+ttv('tvSearch'),function(){L.Input.edit({title:ttv('tvSearch'),value:tvSearch,free:true,nosave:true},function(v){tvSearch=clean(v);draw();});},'tv-search'));
                bar.append(btn('↻ '+ttv('tvRefresh'),function(){loadTvEpg(true);},'tv-epg-refresh'));
                area.append(bar);
                area.append(text('div','str-tv-note',ttv('tvNotice')));
                if(tvEpgStatus==='loading')area.append(text('div','str-tv-status',ttv('tvLoad')));
                if(tvEpgStatus==='error')area.append(text('div','str-tv-status',ttv('tvError')+': '+tvEpgError));
                var grid=$('<div class="str-grid str-tv-grid">');
                rows.forEach(function(ch){
                    var card=$('<article class="str-card str-tv-card">');
                    card.append(text('div','str-card-meta',ttv(ch.category)));
                    card.append(text('div','str-tv-channel-name','📺 '+ch.name));
                    card.append(epgBlock(ch));
                    var toolbar=$('<div class="str-tv-actions">');
                    toolbar.append(btn('↗ '+(ch.url?ttv('tvOpen'):ttv('tvPage')),function(){openBrowser(ch.url || (domain()+'telewizja/'));},'channel-'+ch.id,'str-tv-open'));
                    toolbar.append(btn((tvIsFavorite(ch.id)?'★':'☆'),function(){toggleTvFavorite(ch.id);},'tv-fav-'+ch.id,'str-tv-fav'));
                    card.append(toolbar);
                    if(ch.url)card.append(text('small','str-tv-embed-note',ttv('tvWebOnly')));
                    grid.append(card);
                });
                area.append(grid);
            }
            function refreshTvVisuals(){
                if(!active||route!=='tv')return;
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
                if(active&&route==='tv')draw();
                request(domain()+'api/epg.php').then(function(body){
                    if(token!==tvEpgRequest)return;
                    var parsed=JSON.parse(String(body));
                    if(parsed.ok!==1 || !Array.isArray(parsed.ch))throw Error('Unexpected EPG format');
                    tvEpg=parseTvEpg(parsed,tvChannels);
                    tvEpgStatus='ok';tvEpgFetched=Date.now();
                    tvClockServer=Number.isFinite(parsed.now)?parsed.now*1000:null;tvClockLocal=Date.now();
                    if(active&&route==='tv')draw();
                }).catch(function(err){if(token!==tvEpgRequest)return;
                    tvEpgStatus='error';tvEpgError=clean(err&&err.message||err).slice(0,150);
                    if(active&&route==='tv')draw();
                });
            }
            function draw(){if(!active)return;paintHeader();if(selected){detail();foot.text('STRUMYK · '+VERSION);focus('back');return;}area.empty();if(route==='tv'){tvCards();foot.text(domain()+' · '+VERSION);focus('tv-category');return;}listTools();var rows=route==='favorites'?favorites().map(function(f){return all.find(function(e){return e.id===f.id;})||f;}):all;rows=filterEvents(rows,{onlyLive:route==='live',search:search,sport:filter.sport,league:filter.league,date:filter.date,status:filter.status});area.append(text('div','str-section',tr(route==='favorites'?'fav':route==='live'?'live':'schedule')+' · '+rows.length));if(rows.length)eventCards(rows);else {
                    area.append(text('div','str-empty',failMessage||tr('noEvents')));
                    if(failMessage){area.append(text('p','str-note',tr('probe')));area.append(btn(tr('diagnostics'),diagnostics,'diagnostics'));area.append(btn(tr('reload'),load,'retry'));}
                }foot.text(domain()+' · '+VERSION);focus();}
            function diagnostics(){var summary=['STRUMYK '+VERSION,'URL: '+domain(),'Events: '+all.length,'Error: '+failMessage,'HTML chars: '+currentHtml.length,'Site key: hash router (#id) — observed publicly, API not verified'].join('\n');L.Modal.open({title:tr('diagnostics'),size:'medium',html:text('div','str-modal',summary).css('white-space','pre-wrap'),onBack:function(){L.Modal.close();focusController();}});}
            function load(){var token=++seq;working=true;failMessage='';selected=null;area.empty().append(text('div','str-empty',tr('refresh')+'…'));request(domain()).then(function(html){if(!active||token!==seq)return;working=false;currentHtml=html;var report=parseHtml(html,domain());all=report.events;if(report.gate)failMessage=tr('gate')+' (HTTP body '+html.length+' bytes)';else if(!all.length)failMessage=tr('unavailable')+' (HTML '+html.length+' / JSON scripts '+report.scripts+')';draw();}).catch(function(error){if(!active||token!==seq)return;working=false;failMessage=tr('httpError')+': '+error.message;draw();});}
            this.create=function(parent){if(parent&&parent.css)parent.css({height:'100%',minHeight:0});return root;};this.render=function(){return root;};
            this.start=function(){active=true;currentScreen=this;env.document.body.classList.add('strumyk-active');focusController();if(tvTimer===null)tvTimer=env.setInterval(refreshTvVisuals,30000);if(route==='tv'){draw();if(tvEpgStatus==='idle')loadTvEpg(false);}else if(!all.length&&!working&&!failMessage)load();else draw();};
            this.stop=function(){active=false;seq++;tvEpgRequest++;if(tvEpgStatus==='loading')tvEpgStatus='idle';if(tvTimer!==null){env.clearInterval(tvTimer);tvTimer=null;}env.document.body.classList.remove('strumyk-active');};this.pause=this.stop;
            this.destroy=function(){self.stop();root.remove();if(currentScreen===this)currentScreen=null;};
        }
        function open(){L.Activity.push({url:'',title:'STRUMYK',component:'strumyk_sports',page:1});}
        function ensureMenu(){if(env.document.querySelector('.strumyk-menu'))return;var target=$('.menu .menu__list').first();if(!target.length)return;var item=$('<li class="menu__item selector strumyk-menu"><div class="menu__ico">⚡</div><div class="menu__text">STRUMYK SPORTS</div></li>');item.on('hover:enter.str click.str',open);target.append(item);}
        function addCss(){if(env.document.getElementById('strumyk-style'))return;$('<style id="strumyk-style">').text(
            '.strumyk-active .head{display:none}.strumyk-active .content{top:0!important}.str-screen{--str-text:#f6f8ff;--str-muted:#aebbd0;min-height:100%;height:100%;display:flex;flex-direction:column;color:var(--str-text);background:radial-gradient(ellipse at 85% -5%,#174366 0,transparent 40%),linear-gradient(145deg,#081526,#102239 62%,#0a1727);overflow:hidden;font-size:1.12em}.str-head{padding:1.3em 2em .8em;display:flex;align-items:center;justify-content:space-between;gap:1em}.str-brand{font-weight:900;font-size:1.5em;letter-spacing:.045em;color:#7dd3fc}.str-brand-tag{font-size:.47em;letter-spacing:.3em;color:#d5e7fa;margin-left:.35em}.str-head-actions{display:flex;gap:.5em}.str-nav{padding:0 2em .8em;display:flex;gap:.5em;border-bottom:1px solid #ffffff20;overflow-x:auto}.str-btn{color:inherit;background:#1a344c;border:1px solid #7296b13d;border-radius:.75em;padding:.65em 1em;font:inherit;cursor:pointer;text-align:left}.str-btn.focus,.str-btn:focus,.str-btn:hover{background:#2b6287!important;box-shadow:0 0 0 .16em #67cdfa77;outline:none}.str-current{background:#255b84;color:#d4f5ff}.str-icon{font-size:1.3em;min-width:2.6em;text-align:center}.str-area{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:1.25em 2em 3em}.str-toolbar{display:flex;flex-wrap:wrap;gap:.65em;margin:.5em 0 1.2em}.str-section{font-weight:800;font-size:1.24em;margin:1.25em 0 .75em}.str-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(19em,100%),1fr));gap:1em}.str-card{padding:1.1em;border-radius:1em;background:linear-gradient(150deg,#203c58ee,#12283ddc);border:1px solid #6b9ac249;min-width:0;box-shadow:0 10px 25px #00000030}.str-card-meta{color:#9edcff;font-size:.76em;min-height:1.4em;margin-bottom:.7em;overflow-wrap:anywhere}.str-match{display:block;width:100%;font-weight:750;font-size:1.08em;padding:.3em 0;margin:.25em 0;background:transparent;border:0;line-height:1.45}.str-card-time,.str-subtitle,.str-source-info{color:var(--str-muted);font-size:.83em}.str-score{font-size:1.3em;font-weight:800;margin-top:.5em}.str-title{font-size:1.7em;margin:.2em 0 .5em;overflow-wrap:anywhere}.str-stream-row{display:flex;flex-direction:column;gap:.4em;background:#17324a;border:1px solid #496e873f;border-radius:.8em;padding:.7em;margin:.5em 0}.str-stream-btn{background:#225476}.str-group-label{font-size:.95em;letter-spacing:.1em;color:#8cdbff}.str-empty{border:1px dashed #6284a366;border-radius:1em;padding:1.2em;color:#e2ecf4;margin:1em 0}.str-note{color:#a3b9cc}.str-foot{flex:none;border-top:1px solid #ffffff18;color:#8fabbc;font-size:.7em;padding:.5em 2.8em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.str-modal{font-size:1.1em;line-height:1.55;padding:1em}.strumyk-menu .menu__ico{font-size:1.1em;color:#7dd3fc}.str-tv-epg{font-size:.8em;margin:.65em 0 .15em;line-height:1.4;min-height:2em}.str-tv-now{color:#ecf7ff;font-weight:650;overflow-wrap:anywhere}.str-tv-next,.str-tv-range,.str-tv-embed-note{color:#a2bfd0;font-size:.85em;line-height:1.4;overflow-wrap:anywhere}.str-tv-range{margin-top:.4em}.str-tv-next{margin-top:.45em}.str-tv-track{margin:.4em 0;height:.35em;background:#4d6575;border-radius:1em;overflow:hidden}.str-tv-fill{height:100%;background:linear-gradient(90deg,#1db9e5,#78d7ff);border-radius:1em;transition:width .3s ease}.str-tv-note{font-size:.76em;color:#afcedd;margin:.3em 0 1em}.str-tv-status{font-size:.75em;color:#caeaf6;margin:.4em 0}.str-tv-channel-name{font-size:1.12em;font-weight:800;margin:.4em 0 .7em;overflow-wrap:anywhere}.str-tv-actions{display:flex;align-items:center;gap:.5em;margin-top:1.1em}.str-tv-open{font-size:.72em;flex:1}.str-tv-fav{font-size:1.1em;min-width:2.7em;text-align:center} @media(max-width:650px){.str-screen{font-size:1em}.str-head,.str-nav{padding-left:1em;padding-right:1em}.str-area{padding:1em}.str-grid{grid-template-columns:1fr 1fr;gap:.55em}.str-card{padding:.8em}.str-brand{font-size:1.3em}.str-btn{padding:.65em .7em}.str-card-meta{font-size:.7em}.str-match{font-size:1em}}@media(max-width:440px){.str-grid{grid-template-columns:1fr}}'
        ).appendTo('head');}
        function init(){addCss();L.Component.add('strumyk_sports',Screen);ensureMenu();if(env.MutationObserver){var obs=new env.MutationObserver(function(){if(!env.document.querySelector('.strumyk-menu'))ensureMenu();});obs.observe(env.document.documentElement,{childList:true,subtree:true});}else env.setInterval(ensureMenu,2500);}
        env.StrumykPlugin={version:VERSION,open:open};
        if(env.appready)init();else if(L.Listener&&L.Listener.follow)L.Listener.follow('app',function(e){if(e.type==='ready')init();});
    }
    return {normalizeTvChannels:normalizeTvChannels,parseTvEpg:parseTvEpg,tvNowNext:tvNowNext,tvCatalogSnapshot:TV_CATALOG_SNAPSHOT,tvLabel:tvLabel,parseStrumykApiBundle:parseStrumykApiBundle,actualEmbeds:actualEmbeds,version:VERSION,defaultHost:DEFAULT_HOST,translations:LABELS,t:t,kind:kind,safeUrl:safeUrl,normalizeHost:normalizeHost,normalizeEvent:normalizeEvent,extractEvents:extractEvents,extractSources:extractSources,detectGate:detectGate,parseHtml:parseHtml,readScheduleDocument:readScheduleDocument,readStrumykSourcesDocument:readStrumykSourcesDocument,readStrumykSourcesCapture:readStrumykSourcesCapture,isRedactedLink:isRedactedLink,filterEvents:filterEvents,install:install};
}));