/* STRUMYK v0.4 browser source inspector — no cookies/localStorage/tokens. */
(function () {
  'use strict';
  if (location.hostname !== 'strumyk.ca') { alert('Відкрий strumyk.ca у браузері.'); return; }
  var MAX_NODES = 900;
  function compact(s,n) {return String(s==null?'':s).replace(/\s+/g,' ').trim().slice(0,n||400);}
  function urlSafe(s) {
    try {
      var u=new URL(s,location.href);
      if(!/^https?:$/.test(u.protocol))return '[other scheme]';
      var path=u.pathname.split('/').map(function (a) {return a.length>50?'[long-segment]':a;}).join('/');
      return u.origin+path+(u.search?'?[query-redacted]':'')+(u.hash?'#[hash-redacted]':'');
    }catch(e){return '[invalid-url]';}
  }
  function safeAttr(name,value) {
    name=name.toLowerCase();
    if(/(?:token|nonce|secret|password|passphrase|session|signature|authorization|api.key)/.test(name))return '[hidden]';
    if(/^(?:href|src|data-src|data-url|data-embed|data-stream|data-link|data-player|data-iframe|data-hls)$/.test(name))return urlSafe(value);
    if(/^on[a-z]+$/.test(name))return '[event-handler-omitted]';
    return compact(value,170);
  }
  function attrList(node) {
    var out={}; Array.prototype.forEach.call(node.attributes||[],function(a){
      if(/^(id|class|title|type|lang|role|aria-[a-z-]+|data-[a-z0-9_-]+|href|src|datetime|value)$/i.test(a.name)){
        if(a.name==='value')return;
        out[a.name]=safeAttr(a.name,a.value);
      }
    });return out;
  }
  function tree(node,budget){
    if(!node||budget.n++>=MAX_NODES)return null;
    if(node.nodeType===3){var raw=compact(node.nodeValue,250);return raw?{text:raw}:null;}
    if(node.nodeType!==1)return null;
    var tag=node.tagName.toLowerCase();
    if(/^(script|style|form|input|textarea|select|noscript)$/.test(tag))return null;
    var result={tag:tag};var attr=attrList(node);if(Object.keys(attr).length)result.attrs=attr;
    if(tag==='iframe'){result.note='frame body not accessed';return result;}
    var children=[];Array.prototype.forEach.call(node.childNodes||[],function(child){if(children.length>=80)return;var a=tree(child,budget);if(a)children.push(a);});
    if(children.length)result.children=children;
    return result;
  }
  function summarizeNodes(selector,limit){
    return Array.prototype.slice.call(document.querySelectorAll(selector),0,limit).map(function(n){return {tag:n.tagName.toLowerCase(),attrs:attrList(n),text:compact(n.innerText||n.textContent,300)};});
  }
  function scriptAnalysis(path) {
    return fetch(path,{method:'GET',credentials:'omit',cache:'no-store',redirect:'error'}).then(function(r){
      var info={path:path,status:r.status,type:r.headers.get('content-type')||''};
      if(!r.ok||!/(javascript|text\/plain)/i.test(info.type))return info;
      return r.text().then(function(t){
        info.length=t.length;
        if(t.length>800000){info.error='too large';return info;}
        var re=/(?:\/api\/|api\/)[A-Za-z0-9_-]+\.php/g,m,map={};
        while((m=re.exec(t))!==null){map[m[0]]=(map[m[0]]||0)+1;}
        info.apiPaths=map;
        info.apiContexts=Object.keys(map).slice(0,16).map(function(k){
          var ix=t.indexOf(k),raw=t.slice(Math.max(0,ix-140),Math.min(t.length,ix+k.length+180));
          return {path:k,context:compact(raw.replace(/['"]https?:\/\/[^'"\s]+/g,'"[URL]"').replace(/[a-f0-9]{32,}/gi,'[HEX]'),330)};
        });
        info.mentions={fetch:(t.match(/\bfetch\s*\(/g)||[]).length,xhr:(t.match(/XMLHttpRequest/g)||[]).length,websocket:(t.match(/WebSocket/g)||[]).length};
        return info;
      });
    }).catch(function(e){return {path:path,error:String(e&&e.message||e)};});
  }
  function capture() {
    var src=document.querySelector('#sources');
    var candidates=src?summarizeNodes('#sources button,#sources a,#sources [data-id],#sources [data-src],#sources [data-embed],#sources [data-url],#sources [role="button"]',300):[];
    var nodes=src?tree(src,{n:0}):null;
    var report={
      version:'0.4.0',timestamp:new Date().toISOString(),page:urlSafe(location.href),
      pageTitle:document.title,pageLang:document.documentElement.lang||'',
      sourceBoxFound:!!src,sourceBoxText:src?compact(src.innerText||src.textContent,25000):'',
      sourceBoxTree:nodes,sourceControls:candidates,
      activeStates:summarizeNodes('#sources .active,#sources .selected,#sources [aria-pressed="true"],#sources [aria-selected="true"]',50),
      frameHosts:summarizeNodes('#player iframe,#playerWrap iframe,video,source',50),
      detailMeta:summarizeNodes('h1,h2,.event-title,.match-title,.watch-title,.event-meta,.watch-meta',35),
      scheduleSummary:{events:document.querySelectorAll('#schedList .sched-item').length,live:document.querySelectorAll('#schedList .sched-item .t.live').length},
      jsFiles:[]
    };
    return Promise.all(['/js/strumyk-app.js','/js/strumyk-schedule.js'].map(scriptAnalysis)).then(function(results){report.jsFiles=results;return report;});
  }
  function download(obj) {
    var blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json;charset=utf-8'}),blobUrl=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=blobUrl;a.download='STRUMYK_SOURCE_V04_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
    document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(blobUrl);},30000);
    alert('STRUMYK: джерела '+(obj.sourceBoxFound?'знайдені':'не знайдені')+'; збережено JSON. Переглянь його перед надсиланням.');
  }
  capture().then(download).catch(function(e){alert('STRUMYK V04: '+String(e&&e.message||e));});
}());