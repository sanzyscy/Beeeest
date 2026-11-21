/* STRUMYK TV CH->JSON v0.7 — read-only browser bookmarklet helper.
 * Browser-only introspection of the PUBLIC channel table already in RAM.
 * No cookies, localStorage, auth, fetch, iframes, DOM code execution, or external upload.
 * Sensitive-looking keys and URL queries/fragments are removed from export.
 */
(function () {
  'use strict';
  if (!/^(strumyk\.ca|strumyk\.cv)$/i.test(location.hostname) || !/^\/telewizja\//i.test(location.pathname)) {
    alert('STRUMYK TV: відкрий strumyk.ca/telewizja/'); return;
  }
  var channels = window.CHANNELS;
  if (!Array.isArray(channels)) {
    alert('STRUMYK TV: window.CHANNELS не знайдено. Спершу відкрий список телеканалів.'); return;
  }
  function safeString(value, len) {
    return String(value === null || value === undefined ? '' : value).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, len || 180);
  }
  function stripUrl(raw) {
    try {
      var u = new URL(raw, location.href);
      if (!/^https?:$/.test(u.protocol)) return '[non-http-url]';
      var parts = u.pathname.split('/').map(function (piece) {
        return piece.length > 42 || /[a-f0-9]{28,}/i.test(piece) ? '[opaque-segment]' : piece;
      });
      return u.origin + parts.join('/') + (u.search ? '?[query-redacted]' : '') + (u.hash ? '#[fragment-redacted]' : '');
    } catch (e) { return '[invalid-url]'; }
  }
  function scrub(value, depth, seen) {
    if (depth > 5) return '[depth-limit]';
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') {
      if (/^(?:https?:\/\/|\/\/|\/)/i.test(value)) return stripUrl(value);
      return safeString(value, 240);
    }
    if (typeof value === 'number' || typeof value === 'boolean') return value;
    if (typeof value !== 'object') return '[unsupported-type]';
    if (seen.indexOf(value) !== -1) return '[circular]';
    seen.push(value);
    if (Array.isArray(value)) {
      var a = value.slice(0, 50).map(function (x) { return scrub(x, depth + 1, seen); });
      seen.pop(); return a;
    }
    var out = {};
    Object.keys(value).slice(0, 65).forEach(function (key) {
      if (/token|secret|password|auth|session|cookie|nonce|signature|api[_-]?key|access[_-]?key|csrf|private/i.test(key)) {
        out[key] = '[hidden-field]'; return;
      }
      out[safeString(key, 60)] = scrub(value[key], depth + 1, seen);
    });
    seen.pop();return out;
  }
  var all = channels.slice(0, 200).map(function (ch) { return scrub(ch, 0, []); });
  var fields = {}, groups = {};
  channels.forEach(function (ch) {
    if (!ch || typeof ch !== 'object') return;
    Object.keys(ch).forEach(function (key) {
      var value = ch[key]; var type = Array.isArray(value) ? 'array' : (value === null ? 'null' : typeof value);
      var v = fields[key] || (fields[key] = {});v[type] = (v[type] || 0) + 1;
    });
    var group = String(ch.category || ch.group || ch.type || '[unknown]');groups[group]=(groups[group]||0)+1;
  });
  var active = document.querySelector('[data-cat].sel');
  var report = {
    version: '0.7.0',
    captured_utc: new Date().toISOString(),
    page: location.origin + location.pathname,
    channelCount: channels.length,
    categoryCountsFromData: groups,
    fieldTypes: fields,
    selectedFilter: active ? active.getAttribute('data-cat') : null,
    visibleFilters: Array.prototype.slice.call(document.querySelectorAll('[data-cat]'), 0, 15).map(function (n) {
      return {key:n.getAttribute('data-cat'),text:safeString(n.textContent,80)};
    }),
    channels: all,
    epgRequestObserved: (performance.getEntriesByType('resource') || []).some(function (r) {
      try { return new URL(r.name).pathname === '/api/epg.php'; } catch (e) { return false; }
    })
  };
  var blob = new Blob([JSON.stringify(report, null, 2)], {type: 'application/json;charset=utf-8'});
  var url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url;
  a.download = 'STRUMYK_TV_CHANNELS_V07_' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
  alert('STRUMYK TV: записів ' + report.channelCount + '. JSON збережено локально. Переглянь перед надсиланням.');
}());