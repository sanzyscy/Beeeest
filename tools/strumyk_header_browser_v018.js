/* STRUMYK request-context diagnostic v0.18.0
 * Compares normal vs no-referrer same-origin requests for L/M only.
 * No auth or cookie reads, no raw API URLs, no token values, no remote telemetry.
 * Saves a local report. Note: this cannot read raw HTTP UA/Referer request headers.
 */
(function(){
'use strict';
if(!/^(strumyk\.ca|strumyk\.cv)$/i.test(location.hostname)){
 alert('STRUMYK: відкрий strumyk.ca у Chrome'); return;
}
if(window.__strumykHeaderProbe018){alert('STRUMYK: перевірка вже виконується');return;}
window.__strumykHeaderProbe018=true;
var confs=[];
if(window.SK&&window.SK.api)confs.push({source:'SK',api:window.SK.api});
if(window.SK_SCHED&&window.SK_SCHED.api)confs.push({source:'SK_SCHED',api:window.SK_SCHED.api});
function api(k){
 for(var i=0;i<confs.length;i++){
  try{var raw=confs[i].api[k],u=new URL(raw,location.origin+'/');
   if(u.origin===location.origin && u.pathname==='/api/'+k+'.php')
    return {url:u.href,source:confs[i].source,queryNames:Array.from(u.searchParams.keys())};
  }catch(e){}
 }return null;
}
function redact(u){
 if(!u)return null;
 try{var x=new URL(u,location.href);return x.origin+x.pathname+(x.search?'?[redacted]':'');}catch(e){return '[invalid]';}
}
var rep={version:'0.18.0',capturedUtc:new Date().toISOString(),page:location.origin+location.pathname,
 browser:{userAgent:String(navigator.userAgent||'').slice(0,350),navigatorReferrer:redact(document.referrer),
  metaReferrer:(document.querySelector('meta[name=referrer]')||{}).content||null,
  platform:String(navigator.platform||'').slice(0,60)},
 apiConfig:{},results:[],caution:'Browser UA is fixed across both tests. Headers cannot be directly read by JS. Referrer tests may also be affected by time-limited signatures or rate limits.'};
var keys=['L','M'];keys.forEach(function(k){var o=api(k);rep.apiConfig[k]=o?{found:true,source:o.source,queryNames:o.queryNames}:{found:false};});
var tasks=[],flipped=(Math.random()<0.5);
keys.forEach(function(k){
 var q=api(k);if(!q)return;
 var order=flipped?['no-referrer','default']:['default','no-referrer'];
 order.forEach(function(which){tasks.push({key:k,which:which,url:q.url});});
});
if(!tasks.length){delete window.__strumykHeaderProbe018;alert('Немає L/M у цій сторінці. Відкрий розклад на Strumyk і повтори.');return;}
function run(t){
 var started=Date.now(),ctrl=new AbortController(),timer=setTimeout(function(){ctrl.abort();},10000);
 var opts={method:'GET',credentials:'same-origin',cache:'no-store',redirect:'follow',headers:{Accept:'application/json'},signal:ctrl.signal};
 if(t.which==='no-referrer')opts.referrerPolicy='no-referrer';
 return fetch(t.url,opts).then(function(r){
  var obj={source:t.key,referrerPolicy:t.which,http:r.status,mime:(r.headers.get('content-type')||'').slice(0,60),redirected:r.redirected};
  return r.text().then(function(body){
   obj.bodyLength=body.length;
   if(body.length<2500000){
    try{var parsed=JSON.parse(body);obj.json=true;obj.jsonType=Array.isArray(parsed)?'array':typeof parsed;obj.count=Array.isArray(parsed)?parsed.length:null;obj.topKeys=parsed&&!Array.isArray(parsed)&&typeof parsed==='object'?Object.keys(parsed).slice(0,12):undefined;}
    catch(e){obj.json=false;}
   } else obj.tooLarge=true;
   obj.elapsedMs=Date.now()-started;return obj;
  });
 }).catch(function(e){return {source:t.key,referrerPolicy:t.which,error:String(e&&e.name||e).slice(0,70),elapsedMs:Date.now()-started};})
 .then(function(out){clearTimeout(timer);return out;});
}
var chain=Promise.resolve();
tasks.forEach(function(t){chain=chain.then(function(){return run(t);}).then(function(o){rep.results.push(o);});});
chain.then(function(){
 delete window.__strumykHeaderProbe018;
 var blob=new Blob([JSON.stringify(rep,null,2)],{type:'application/json;charset=utf-8'});
 var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;
 a.download='STRUMYK_HEADER_BROWSER_V018_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(function(){URL.revokeObjectURL(u);},30000);
 alert('STRUMYK HEADER v0.18: результати L/M збережено. Перевір файл перед надсиланням.');
}).catch(function(err){delete window.__strumykHeaderProbe018;alert('HEADER v0.18 error: '+String(err));});
}());