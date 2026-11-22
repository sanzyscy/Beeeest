/* STRUMYK TV inner-frame inspector v0.16.0
 * Read-only browser diagnostic, start before channel click on /telewizja/.
 * No network requests, telemetry, cookies, localStorage, auth, headers or response bodies.
 * Scrubs URL query VALUES, fragments, and long path segments.
 */
(function(){
'use strict';
if(!/^(strumyk\.ca|strumyk\.cv)$/i.test(location.hostname)||!/^\/telewizja\/?$/.test(location.pathname)){alert('Відкрий Strumyk → Телебачення');return;}
if(window.__stTvInner016){alert('TV v0.16 уже запущена. Збережи звіт кнопкою внизу.');return;}
var started=Date.now(),resources=[],states=[],clicks=[],known=Object.create(null),max=350,closed=false,panel,tick,ttl;
function t(){return Date.now()-started;}
function short(x,n){return String(x==null?'':x).replace(/[\x00-\x1f]/g,' ').trim().slice(0,n||100);}
function safe(u){
 if(!u)return null;
 try{
  var x=new URL(String(u),location.href);
  if(/^(blob:|data:|about:)$/.test(x.protocol))return {scheme:x.protocol};
  if(!/^https?:$/.test(x.protocol))return {scheme:short(x.protocol,15)};
  var p=x.pathname.split('/').map(function(z){var e=(z.match(/\.[a-z0-9]{2,6}$/i)||[])[0]||'',base=z.slice(0,z.length-e.length);return base.length>24||/[a-f0-9]{18,}/i.test(base)?'[opaque]'+e:z;}).join('/');
  return {host:short(x.hostname,90),path:short(p,200),queryNames:Array.from(new Set(Array.from(x.searchParams.keys()))).slice(0,12),hasFragment:!!x.hash};
 }catch(e){return {invalid:true};}
}
function hint(url){
 var s=String(url||'').split('?')[0].toLowerCase();
 if(/\.m3u8(?:$|\/)/.test(s))return 'HLS';
 if(/\.mpd(?:$|\/)/.test(s))return 'DASH';
 if(/\.(?:m4s|ts|aac|mp4|cmfv)(?:$|\/)/.test(s))return 'segment';
 if(/\.js(?:$|\/)/.test(s))return 'script';
 if(/\/api\//.test(s))return 'api';
 return 'other';
}
function perf(w,where){
 var entries=[];try{entries=w.performance.getEntriesByType('resource');}catch(e){}
 entries.forEach(function(e){
  if(resources.length>=max)return;
  var id=where+'|'+e.name+'|'+e.startTime;
  if(known[id])return;known[id]=1;
  var r={seenMs:t(),scope:where,request:safe(e.name),kind:hint(e.name),initiator:short(e.initiatorType,25),duration:Math.round(e.duration||0)};
  try{r.startedUtc=new Date(w.performance.timeOrigin+e.startTime).toISOString();}catch(ignore){}
  if(e.responseStatus)r.status=e.responseStatus;
  resources.push(r);
 });
}
function video(n){
 var r={tag:n.tagName.toLowerCase(),src:safe(n.currentSrc||n.getAttribute('src')||'')};
 if(r.tag==='video'){r.readyState=n.readyState;r.networkState=n.networkState;r.paused=n.paused;r.size=[n.videoWidth,n.videoHeight];}
 return r;
}
function scripts(d){
 var x=Array.prototype.slice.call(d.scripts||[],0,35),names=['hls.js','hlsjs','MediaSource','SourceBuffer','dashjs','shaka','mpegts','flvjs','videojs','jwplayer','fetch(','XMLHttpRequest','WebSocket'];
 var found={},external=[];names.forEach(function(n){found[n]=false;});
 x.forEach(function(s){if(s.src)external.push(safe(s.src));var str=s.src||(s.textContent||'');names.forEach(function(n){if(str.indexOf(n)>=0)found[n]=true;});});
 return {count:x.length,assets:external.slice(0,18),indicators:found};
}
function frame(node,depth,scope){
 if(!node)return null;
 var r={src:safe(node.getAttribute('src')),srcdoc:node.hasAttribute('srcdoc'),srcdocBytes:(node.getAttribute('srcdoc')||'').length};
 if(depth>2)return r;
 try{
  var d=node.contentDocument,w=node.contentWindow;
  if(!d||!w){r.sameOrigin=false;return r;}
  r.sameOrigin=true;r.documentUrl=safe(d.URL);r.title=short(d.title,100);
  r.media=Array.prototype.slice.call(d.querySelectorAll('video,source'),0,12).map(video);
  r.scripts=scripts(d);perf(w,scope);
  if(depth<2)r.frames=Array.prototype.slice.call(d.querySelectorAll('iframe'),0,6).map(function(n,i){return frame(n,depth+1,scope+'/'+i);});
 }catch(e){r.sameOrigin=false;r.error=short(e.name,30);}
 return r;
}
function channel(){
 var id=location.hash.slice(1);try{id=decodeURIComponent(id);}catch(e){}
 if(!/^[a-z0-9_-]{1,80}$/i.test(id))id='';
 var c=(Array.isArray(window.CHANNELS)?window.CHANNELS:[]).find(function(v){return v&&v.id===id;});
 return {id:id,name:short(c&&c.name,80),category:short(c&&c.cat,35)};
}
function snap(reason){
 if(closed)return;
 perf(window,'page');
 var data={ms:t(),reason:reason,channel:channel(),title:short(document.title,90),cineFrame:frame(document.getElementById('cineFrame'),0,'cineFrame')};
 var last=states.length?states[states.length-1]:null;
 if(last&&JSON.stringify([last.channel,last.cineFrame])===JSON.stringify([data.channel,data.cineFrame]))return;
 if(states.length<65)states.push(data);
}
function clicked(e){
 if(panel&&panel.contains(e.target))return;
 var n=e.target&&e.target.closest&&e.target.closest('[data-ch],[data-channel],[data-id],.epg-ch,button,a');
 if(n&&clicks.length<16)clicks.push({ms:t(),tag:n.tagName.toLowerCase(),cls:short(n.className,65),channelId:short(n.getAttribute('data-ch')||n.getAttribute('data-channel')||n.getAttribute('data-id'),70)});
 setTimeout(function(){snap('click');},500);
}
document.addEventListener('click',clicked,true);
function finish(save){
 if(closed)return;snap('finish');closed=true;clearInterval(tick);clearTimeout(ttl);document.removeEventListener('click',clicked,true);
 if(panel)panel.remove();delete window.__stTvInner016;
 if(!save)return;
 var report={version:'0.16.0',capturedUtc:new Date().toISOString(),durationMs:t(),channel:channel(),clicks:clicks,states:states,resources:resources,
  privacy:'Network URL query values and long path segments redacted. Inspect before sharing.'};
 var blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=u;a.download='STRUMYK_TV_INNER_V016_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
 document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},30000);
 alert('STRUMYK TV v0.16: '+resources.length+' ресурсів, '+states.length+' станів. Переглянь JSON перед надсиланням.');
}
panel=document.createElement('div');
panel.style.cssText='position:fixed!important;right:6px!important;bottom:65px!important;z-index:2147483647!important;display:flex!important;gap:5px!important;background:#10283b!important;padding:6px!important;border-radius:11px!important;border:1px solid #83cfea!important;';
function button(label,fn){var b=document.createElement('button');b.textContent=label;b.type='button';b.style.cssText='background:#edfaff!important;color:#142b39!important;border:0!important;border-radius:7px!important;padding:9px!important;font:13px Arial,sans-serif!important;';b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();fn();});return b;}
panel.appendChild(button('📄 Зберегти TV-звіт',function(){finish(true);}));
panel.appendChild(button('✕',function(){finish(false);}));
document.documentElement.appendChild(panel);
window.__stTvInner016={save:function(){finish(true);},cancel:function(){finish(false);}};
snap('initial');tick=setInterval(function(){snap('poll');},400);ttl=setTimeout(function(){finish(true);},95000);
alert('TV v0.16: тепер вибери ОДИН канал, дочекайся відео та натисни «Зберегти TV-звіт».');
}());