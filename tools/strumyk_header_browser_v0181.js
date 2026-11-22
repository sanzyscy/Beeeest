/* STRUMYK browser header probe v0.18.1; one-shot, no token export, no telemetry.
   Shows status immediately. Compares same-origin fetch with default/no-referrer policies.
   Caveat: repeat requests can be affected by one-time API signatures; differences do not prove referrer enforcement.
*/
(function(){
'use strict';
var VERSION='0.18.1',id='strumyk-header-probe-v0181',root=null,closed=false,ctl=[],started=Date.now();
function say(s){
  if(!root)return;
  var el=root.querySelector('[data-state]');if(el)el.textContent=s;
}
function close(){closed=true;ctl.forEach(function(c){try{c.abort()}catch(e){}});if(root)root.remove();delete window.__STRUMYK_HEADER_0181;}
if(window.__STRUMYK_HEADER_0181){alert('STRUMYK HEADER: перевірка вже активна.');return;}
window.__STRUMYK_HEADER_0181=true;
root=document.createElement('div');root.id=id;
root.style.cssText='position:fixed!important;right:10px!important;bottom:75px!important;z-index:2147483647!important;max-width:90vw!important;background:#10283b!important;color:#fff!important;padding:12px!important;border:1px solid #7fdfff!important;border-radius:10px!important;box-shadow:0 4px 20px #0008!important;font:14px Arial,sans-serif!important;';
var line=document.createElement('div');line.textContent='STRUMYK HEADER v0.18.1';line.style.cssText='font-weight:700!important;margin-bottom:5px!important;';
var state=document.createElement('div');state.setAttribute('data-state','');state.textContent='Запущено. Перевіряю конфігурацію...';
var btn=document.createElement('button');btn.textContent='✕ Скасувати';btn.style.cssText='margin-top:8px!important;padding:6px!important;color:#10283b!important;background:#fff!important;border:0!important;border-radius:6px!important;';
btn.addEventListener('click',close);root.appendChild(line);root.appendChild(state);root.appendChild(btn);(document.body||document.documentElement).appendChild(root);
function clean(v,n){return String(v==null?'':v).replace(/[\u0000-\u001f]/g,' ').slice(0,n||160);}
function locationSafe(x){try{var u=new URL(x,location.href);return u.origin+u.pathname+(u.search?'?[redacted]':'');}catch(e){return '[invalid]';}}
var rep={version:VERSION,timestamp:new Date().toISOString(),page:location.origin+location.pathname,
userAgent:clean(navigator.userAgent,350),pageReferrer:locationSafe(document.referrer||location.href),
notice:'No URL query values, cookies, tokens, or bodies exported. Default and no-referrer requests may differ due to token lifetime or server rate limits.',
config:{},results:[],error:null};
function download(){
 if(closed)return;
 rep.elapsedMs=Date.now()-started;
 var blob=new Blob([JSON.stringify(rep,null,2)],{type:'application/json;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=u;a.download='STRUMYK_HEADER_BROWSER_V0181_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
 document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},30000);
 say('Готово: '+rep.results.length+' перевірок. JSON збережено.');
 btn.textContent='✕ Закрити';
 setTimeout(function(){if(!closed)close();},18000);
}
if(!/^(strumyk\.ca|strumyk\.cv)$/i.test(location.hostname)){
 rep.error='OPEN_STRUMYK_IN_CHROME';say('Відкрий сайт strumyk.ca, потім закладку.');download();return;
}
var configurations=[];
if(window.SK&&window.SK.api)configurations.push({name:'SK',obj:window.SK.api});
if(window.SK_SCHED&&window.SK_SCHED.api)configurations.push({name:'SK_SCHED',obj:window.SK_SCHED.api});
var endpoints={};
['L','M'].forEach(function(k){
  for(var i=0;i<configurations.length;i++){
    var raw=configurations[i].obj[k];
    try{if(typeof raw!=='string')continue;var u=new URL(raw,location.origin+'/');
      if(u.origin===location.origin&&u.pathname==='/api/'+k+'.php'){
        endpoints[k]=u.href;rep.config[k]={source:configurations[i].name,queryKeys:Array.from(u.searchParams.keys()),available:true};break;
      }
    }catch(e){}
  }
  if(!endpoints[k])rep.config[k]={available:false};
});
if(!endpoints.L&&!endpoints.M){
 rep.error='NO_L_M_CONFIG';say('L/M не знайдено в поточній сторінці. Звіт збережу.');download();return;
}
function once(k,policy){
 var ac=typeof AbortController==='function'?new AbortController():null,tm;
 if(ac)ctl.push(ac);
 var params={method:'GET',credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}};
 if(ac){params.signal=ac.signal;tm=setTimeout(function(){ac.abort();},6000);}
 if(policy==='no-referrer')params.referrerPolicy='no-referrer';
 var begin=Date.now();
 return fetch(endpoints[k],params).then(function(r){
  var result={api:k,policy:policy,status:r.status,mime:clean(r.headers.get('content-type'),60)};
  return r.text().then(function(s){
   result.bodySize=s.length;
   if(s.length<1500000){try{var x=JSON.parse(s);result.json=true;result.count=Array.isArray(x)?x.length:null;result.kind=Array.isArray(x)?'array':typeof x;}catch(e){result.json=false;}}
   return result;
  });
 }).catch(function(e){return {api:k,policy:policy,error:clean(e&&e.name||e,60)};}).then(function(x){if(tm)clearTimeout(tm);x.elapsedMs=Date.now()-begin;rep.results.push(x);return x;});
}
var jobs=Object.keys(endpoints).map(function(k){
 return once(k,'default').then(function(){if(closed)return null;say('Перевіряю '+k+' без Referer...');return once(k,'no-referrer');});
});
say('Джерела: '+Object.keys(endpoints).join(', ')+'. Виконую перевірку...');
Promise.all(jobs).then(function(){if(!closed)download();}).catch(function(e){rep.error=clean(e&&e.message||e,150);download();});
}());