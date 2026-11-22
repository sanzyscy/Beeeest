/* STRUMYK TV API shape 0.17 — same-origin, shape only, no secrets/raw URLs/upload */
(function(){
'use strict';
if(!/^(strumyk\.ca|strumyk\.cv)$/i.test(location.hostname)||!/^\/telewizja\/?$/.test(location.pathname)){alert('Відкрий Strumyk /telewizja/');return;}
var f=document.getElementById('cineFrame'),d,w;
try{d=f.contentDocument;w=f.contentWindow;if(!d||!w||new URL(d.URL).pathname!='/telewizja/player.php')throw Error('not-open');}
catch(e){alert('Спочатку відкрий канал у Strumyk і дочекайся появи відео');return;}
var all=Array.isArray(window.CHANNELS)?window.CHANNELS:[],id='',ref=new URL(d.URL),cp=ref.searchParams.get('c')||'';
try{id=decodeURIComponent(location.hash.slice(1));}catch(e){}
var ch=all.find(function(x){return x&&x.id===id;})||null,known=all.map(function(x){return x&&x.id;});
var rep={version:'0.17.0',capturedUtc:new Date().toISOString(),channel:{id:ch?ch.id:id,name:ch?ch.name:null},
 player:{path:ref.pathname,parameterNames:Array.from(ref.searchParams.keys()),cIsChannelId:!!ch&&cp===ch.id,
 cIsKnownId:known.indexOf(cp)>=0,cPublicId:known.indexOf(cp)>=0?cp:null,cLength:cp.length,
 video:null,firstPartyScripts:[],hasHlsJs:!!w.Hls,codeFlags:{}},
 api:{path:'/api/tv.php',status:null,mime:'',bodyChars:0,isJson:false,shape:null,error:null}};
var vid=d.querySelector('video');if(vid)rep.player.video={blob:/^blob:/.test(vid.currentSrc||''),ready:vid.readyState,paused:vid.paused,size:[vid.videoWidth,vid.videoHeight]};
var scripts=Array.prototype.slice.call(d.scripts||[],0,35),inline='';
scripts.forEach(function(s){if(s.src){try{var u=new URL(s.src,d.URL);if(u.origin===location.origin)rep.player.firstPartyScripts.push(u.pathname);}catch(e){}}else inline+=(s.textContent||'').slice(0,100000);});
['api/tv.php','fetch(','XMLHttpRequest','new Hls','loadSource(','attachMedia(','method:'].forEach(function(k){rep.player.codeFlags[k]=inline.indexOf(k)>=0;});
function type(v){return v===null?'null':Array.isArray(v)?'array':typeof v;}
function desc(v){
 var z={type:type(v)};
 if(typeof v==='string'){
  if(/^https?:\/\//i.test(v)){try{var u=new URL(v);z.kind='url';z.host=u.hostname;z.extension=(u.pathname.match(/\.(m3u8|mpd|mp4|php|js|ts|m4s|png)$/i)||[])[1]||null;z.queryNames=Array.from(u.searchParams.keys()).slice(0,15);}catch(e){z.kind='url-invalid';}}
  else {z.kind='text';z.length=v.length;if(known.indexOf(v)>=0)z.publicChannelId=v;}
 }
 return z;
}
function shape(v,depth){
 var k=type(v),a=desc(v);
 if(depth>=5)return a;
 if(k==='array'){a.length=v.length;a.first=v.length?shape(v[0],depth+1):null;return a;}
 if(k==='object'){var names=Object.keys(v);a.keyCount=names.length;a.fields={};
  names.slice(0,45).forEach(function(n){
    var key=/^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(n)?n:'[opaque-key]';
    a.fields[key]=/token|secret|password|auth|signature|session|cookie|credential|nonce|private|csrf/i.test(n)?{type:'hidden'}:shape(v[n],depth+1);
  });
 }
 return a;
}
function save(){
 var b=new Blob([JSON.stringify(rep,null,2)],{type:'application/json;charset=utf-8'}),u=URL.createObjectURL(b),a=document.createElement('a');
 a.href=u;a.download='STRUMYK_TV_API_V017_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';document.body.appendChild(a);a.click();a.remove();
 setTimeout(function(){URL.revokeObjectURL(u);},30000);
 alert('TV API v0.17: '+rep.api.status+'; '+(rep.api.isJson?'JSON структуру отримано':'JSON не розпізнано')+'. Переглянь JSON перед надсиланням.');
}
var ac=typeof AbortController==='function'?new AbortController():null,timeout=setTimeout(function(){if(ac)ac.abort();},13000);
w.fetch('/api/tv.php',{method:'GET',credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'},signal:ac?ac.signal:undefined})
.then(function(r){rep.api.status=r.status;rep.api.mime=r.headers.get('content-type')||'';return r.text().then(function(t){
 rep.api.bodyChars=t.length;if(t.length>3000000){rep.api.error='TOO_LARGE';return;}
 try{rep.api.shape=shape(JSON.parse(t),0);rep.api.isJson=true;}catch(e){rep.api.error='NOT_JSON';}
});}).catch(function(e){rep.api.error=String(e&&e.name||e).slice(0,70);}).then(function(){clearTimeout(timeout);save();});
}());