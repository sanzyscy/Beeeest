/* STRUMYK TV capture v0.6 — local JSON export, no account/cookie/storage access. */
(function () {
  'use strict';
  if (location.hostname !== 'strumyk.ca') { alert('Відкрий strumyk.ca/telewizja/'); return; }
  function short(s,n) {return String(s==null?'':s).replace(/\s+/g,' ').trim().slice(0,n||250);}
  function safeUrl(s) {
    try {var u=new URL(s,location.href);if(!/^https?:$/.test(u.protocol))return '[other]';
      return u.origin+u.pathname+(u.search?'?[redacted]':'')+(u.hash?'#[redacted]':'');}
    catch(e){return '[invalid]';}
  }
  var ALLOWED=/^(?:id|class|title|role|aria-[a-z-]+|data-[a-z0-9_-]+|href|src|datetime)$/i;
  function attributes(n){var a={};Array.prototype.forEach.call(n.attributes||[],function(x){
    if(!ALLOWED.test(x.name))return;
    if(/(?:secret|session|token|auth|password|nonce|key)/i.test(x.name))return;
    a[x.name]=/^(?:href|src|data-src|data-url|data-link|data-embed|data-stream)$/i.test(x.name)?safeUrl(x.value):short(x.value,150);
  });return a;}
  function info(n) {return {tag:n.tagName.toLowerCase(),attrs:attributes(n),text:short(n.innerText||n.textContent,350)};}
  function all(selector,limit) {return Array.prototype.slice.call(document.querySelectorAll(selector),0,limit).map(info);}
  function namesOnly(src) {var o={};if(!src||typeof src!=='object')return o;Object.keys(src).slice(0,40).forEach(function(k){
    var x=src[k];o[k]={type:Array.isArray(x)?'array':typeof x};if(Array.isArray(x))o[k].length=x.length;
    if(typeof x==='string' && /^https?:\/\//.test(x))o[k].url=safeUrl(x);
  });return o;}
  function apiOnly(config) {var r={};if(!config||typeof config!=='object')return r;
    Object.keys(config).slice(0,30).forEach(function(k){var v=config[k];
      if(typeof v!=='string')return;try{var u=new URL(v,location.href);r[k]={url:safeUrl(v),params:Array.from(u.searchParams.keys())};}catch(e){}
    });return r;}
  var selectors='[class*="tv-"],[class*="tv_"],[class*="channel"],[class*="station"],[class*="program"],[class*="quality"],[class*="category"],[class*="player"],[data-channel],[data-stream],[data-src],video,source,iframe';
  var counts={};Array.prototype.forEach.call(document.querySelectorAll('[class]'),function(n){
    String(n.className||'').split(/\s+/).forEach(function(c){if(/tv|channel|station|program|quality|category|player|group/i.test(c))counts[c]=(counts[c]||0)+1;});
  });
  var main=document.querySelector('main')||document.querySelector('.tv-main')||document.querySelector('#tvContent');
  var js=Array.prototype.map.call(document.scripts,function(s){return s.src?safeUrl(s.src):'[inline]';});
  var firstParty=js.filter(function(s){return s.indexOf(location.origin+'/')===0;});
  var apiSeen=Array.prototype.slice.call(performance.getEntriesByType('resource')||[]).map(function(x){return safeUrl(x.name);}).filter(function(u){return u.indexOf(location.origin+'/api/')===0;});
  var snapshot={version:'0.6.0',captured_utc:new Date().toISOString(),page:safeUrl(location.href),title:document.title,
    pageLang:document.documentElement.lang||'',pageText:short(main?main.innerText:document.body.innerText,13000),
    categoryClassCounts:Object.keys(counts).sort(function(a,b){return counts[b]-counts[a];}).slice(0,90).map(function(k){return {name:k,count:counts[k]};}),
    headings:all('h1,h2,h3,h4',65),tvControls:all(selectors,240),
    clickable:all('main a,main button,[class*="tv"] a,[class*="tv"] button,[class*="channel"] a,[class*="channel"] button',180),
    frames:all('video,source,iframe',35),firstPartyScripts:firstParty,allScriptCount:js.length,
    observedApiPaths:Array.from(new Set(apiSeen)).slice(0,50),
    configuration:{SK:typeof window.SK==='object'?{keys:Object.keys(window.SK).slice(0,35),api:apiOnly(window.SK.api)}:null,
      SK_SCHED:typeof window.SK_SCHED==='object'?{keys:Object.keys(window.SK_SCHED).slice(0,35),api:apiOnly(window.SK_SCHED.api)}:null},
    potentialGlobalKeys:['TV','tv','TV_APP','TV_CONFIG','CHANNELS','channels','SK_TV'].filter(function(k){return k in window;}).map(function(k){return {key:k,meta:namesOnly(window[k])};})};
  var blob=new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json;charset=utf-8'});
  var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;
  a.download='STRUMYK_TV_V06_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(u);},30000);
  alert('STRUMYK TV: збережено '+snapshot.tvControls.length+' кандидатів + '+firstParty.length+' скриптів. Перевір JSON перед надсиланням.');
}());