/* STRUMYK Browser Snapshot v0.3.1
 * Read-only DOM diagnostic. No requests, no cookies/localStorage,
 * no Authorization or form field collection. Exports a local JSON file.
 */
(function () {
  'use strict';
  if (location.hostname.toLowerCase() !== 'strumyk.ca') {
    alert('STRUMYK: відкрий https://strumyk.ca/');
    return;
  }
  function clip(s, n) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, n || 160); }
  function safeUrl(value) {
    try {
      var u = new URL(value, location.href);
      if (!/^https?:$/.test(u.protocol)) return '[non-http]';
      var pieces = u.pathname.split('/').map(function (p) {
        return p.length > 28 && /^[\w.%-]+$/.test(p) ? '[long-segment]' : p;
      });
      var hash = /^#(?:p[\w-]{3,30}|[\w-]{4,20})$/.test(u.hash) ? u.hash : (u.hash ? '#[redacted]' : '');
      return u.origin + pieces.join('/') + (u.search ? '?[redacted]' : '') + hash;
    } catch (e) { return '[invalid-url]'; }
  }
  function summarize(node) {
    var result = {tag: node.tagName.toLowerCase(), text: clip(node.innerText || node.textContent, 190)};
    if (node.className && typeof node.className === 'string') result.className = clip(node.className, 130);
    if (node.id) result.id = clip(node.id, 100);
    ['data-id', 'data-event-id', 'data-match-id', 'data-hash', 'data-sport', 'data-league', 'data-status', 'data-testid', 'aria-label'].forEach(function (name) {
      var value = node.getAttribute(name);
      if (value) result[name] = clip(value, 100);
    });
    var href = node.getAttribute('href') || node.getAttribute('src');
    if (href) result.url = safeUrl(href);
    return result;
  }
  var whitelist = {
    'id':1,'class':1,'title':1,'role':1,'aria-label':1,'aria-expanded':1,'data-id':1,
    'data-event-id':1,'data-match-id':1,'data-hash':1,'data-sport':1,'data-league':1,
    'data-status':1,'data-testid':1,'href':1,'src':1,'type':1,'datetime':1
  };
  function sanitizedDom() {
    var clone = document.body.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll('script,style,form,input,textarea,select,meta,noscript'), function (n) { n.remove(); });
    Array.prototype.forEach.call(clone.querySelectorAll('*'), function (n) {
      Array.prototype.slice.call(n.attributes).forEach(function (a) {
        if (!whitelist[a.name.toLowerCase()]) n.removeAttribute(a.name);
        else if (/^(?:href|src)$/i.test(a.name)) n.setAttribute(a.name, safeUrl(a.value));
        else n.setAttribute(a.name, clip(a.value, 150));
      });
      if (n.tagName.toLowerCase() === 'iframe') {
        var standin = document.createElement('div');
        standin.setAttribute('data-strumyk-iframe', n.getAttribute('src') || '[unknown]');
        n.parentNode.replaceChild(standin, n);
      }
    });
    return clone.innerHTML.slice(0, 180000);
  }
  function uniqueSummaries(selector, max) {
    var out = [], seen = Object.create(null);
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (node) {
      if (out.length >= max) return;
      var item = summarize(node), key = JSON.stringify(item);
      if (!seen[key]) { seen[key] = true; out.push(item); }
    });
    return out;
  }
  try {
    var textBody = clip(document.body ? document.body.innerText : '', 9000);
    var report = {
      version: '0.3.1', captured_utc: new Date().toISOString(),
      page: safeUrl(location.href), title: document.title, lang: document.documentElement.lang || '',
      stage: (document.querySelector('.gate') && /Sprawdzamy połączenie/i.test(textBody)) ? 'GATE' : 'PAGE',
      body_text: textBody,
      resource_urls: Array.prototype.slice.call(performance.getEntriesByType('resource') || [], 0, 350).map(function (e) { return safeUrl(e.name); }),
      scripts: Array.prototype.map.call(document.scripts, function (e) { return {src: e.src ? safeUrl(e.src) : '[inline]', type: e.type || ''}; }),
      event_candidates: uniqueSummaries('[data-event-id],[data-match-id],[data-hash],.match,.match-card,.event,.event-card,[class*="fixture"],[class*="match-"]', 220),
      media_candidates: uniqueSummaries('video,source,iframe,a[href*="m3u8"],a[href*="mpd"],a[href*="acestream"],a[href*="youtube"],[class*="source"],[class*="stream"],[class*="player"]', 180),
      anchors: uniqueSummaries('a[href]', 180),
      sanitized_body_html: sanitizedDom()
    };
    var blob = new Blob([JSON.stringify(report, null, 2)], {type: 'application/json;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'STRUMYK_BROWSER_' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
    alert('STRUMYK: JSON (' + report.stage + ', подій: ' + report.event_candidates.length + '). Переглянь файл перед надсиланням.');
  } catch (error) {
    alert('STRUMYK capture error: ' + String(error && error.message || error));
  }
}());
