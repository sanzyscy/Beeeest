/* STRUMYK SPORTS v0.24: metadata-only trace for a currently playing event.
   Read-only. Does not fetch media, bypass access control or export URLs with
   query values, cookies, tokens or manifests. Runs inside strumyk.ca Chrome. */
(function(){
'use strict';
if(!/^strumyk\.(ca|cv)$/i.test(location.hostname)){
 alert('STRUMYK SPORT TRACE: відкрий матч на strumyk.ca у Chrome.');return;
}
if(window.__strumykSportTrace024){alert('SPORT TRACE v0.24 уже активний');return;}
window.__strumykSportTrace024=true;
var started=Date.now(),samples=[],seenResources={},errors=[],pathCap=110;
function safeUri(raw){
 try{
  if(!raw)return null;
  var u=new URL(raw,location.href);
  var path=u.pathname.replace(/[a-zA-Z0-9_-]{35,}/g,'[opaque]');
  if(path.length>pathCap)path=path.slice(0,pathCap)+'…';
  return {host:u.hostname,path:path,queryNames:Array.from(u.searchParams.keys()).slice(0,16),
   queryPresent:!!u.search,scheme:u.protocol.replace(':',''),fragmentPresent:!!u.hash};
 }catch(e){return {invalid:true};}
}
function kind(url){
 return /\.m3u8(?:[?#]|$)/i.test(url)?'HLS':
  /\.mpd(?:[?#]|$)/i.test(url)?'DASH':
  /\.(?:mp4|webm)(?:[?#]|$)/i.test(url)?'VIDEO':
  /\/api\//i.test(url)?'API':
  /\.(?:ts|m4s|aac|m4a|png)(?:[?#]|$)/i.test(url)?'SEGMENT_CANDIDATE':
  /(?:player|embed|play\.php|\.php)/i.test(url)?'PLAYER_PAGE':'other';
}
function frameInfo(frame,level){
 if(!frame)return null;
 var src=frame.getAttribute('src')||'';
 var info={level:level,url:safeUri(src),hasSrc:!!src,referrerPolicy:frame.referrerPolicy||null,
            sandbox:frame.getAttribute('sandbox')||null,sameOrigin:false,video:[],resources:[],children:[]};
 try{
  var w=frame.contentWindow,d=frame.contentDocument;
  if(!w||!d){info.error='CROSS_ORIGIN_OR_NOT_LOADED';return info;}
  info.sameOrigin=true;
  info.loadedPage=safeUri(d.location.href);
  Array.prototype.slice.call(d.querySelectorAll('video'),0,4).forEach(function(v){
   var src0=v.currentSrc||v.getAttribute('src')||'';
   info.video.push({srcScheme:/^blob:/.test(src0)?'blob:':/^https?:/.test(src0)?'http(s)':
     src0?'other':'none',readyState:v.readyState,paused:v.paused,width:v.videoWidth,height:v.videoHeight});
  });
  Array.prototype.slice.call(w.performance.getEntriesByType('resource')||[],0,700).forEach(function(e){
   if(!e||!e.name)return;
   var cat=kind(e.name),entryKey=String(e.name);
   if(cat==='other'||seenResources[entryKey])return;
   seenResources[entryKey]=true;
   if(info.resources.length<65)info.resources.push({type:cat,url:safeUri(e.name),
          initiator:e.initiatorType||null,httpStatus:Number(e.responseStatus)||null});
  });
  if(level<2)Array.prototype.slice.call(d.querySelectorAll('iframe'),0,3).forEach(function(sub){
   info.children.push(frameInfo(sub,level+1));
  });
 }catch(e){info.error='CROSS_ORIGIN_OR_SECURITY_RESTRICTION';}
 return info;
}
function capture(){
 var f=document.querySelector('#player iframe'),btn=document.querySelector('#sources .src-btn.is-active, #sources .src-btn.active');
 var activeSrc=btn&&(btn.getAttribute('data-src')||'')||'',frameSrc=f&&(f.getAttribute('src')||'')||'';
 var sample={atMs:Date.now()-started,selectedLabel:btn?String(btn.textContent||'').trim().slice(0,65):null,
   selectedSource:safeUri(activeSrc),frameSource:safeUri(frameSrc),
   selectedUrlMatchesIframe:!!activeSrc&&!!frameSrc&&new URL(activeSrc,location.href).href===new URL(frameSrc,location.href).href,
   frame:frameInfo(f,0)};
 samples.push(sample);
}
function download(){
 delete window.__strumykSportTrace024;
 var report={version:'0.24.0',capturedUtc:new Date().toISOString(),
  pageHost:location.hostname,eventTitle:String((document.querySelector('#watchTitle')||{}).textContent||document.title||'').trim().slice(0,130),
  eventIdLength:(location.hash||'').length,
  note:'Read-only browser resource metadata. Paths may be partial; query VALUES, cookies, tokens and stream bodies are excluded. CROSS_ORIGIN means browser security prevents introspection.',
  durationMs:Date.now()-started,samples:samples,errors:errors};
 var json=JSON.stringify(report,null,2),name='STRUMYK_SPORT_PLAYER_V024_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
 var u=URL.createObjectURL(new Blob([json],{type:'application/json;charset=utf-8'})),a=document.createElement('a');
 a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(function(){URL.revokeObjectURL(u)},30000);
 var x=samples[samples.length-1],f=x&&x.frame;
 alert('STRUMYK SPORT v0.24: звіт '+name+'\nДжерело = iframe: '+(x?String(x.selectedUrlMatchesIframe):'?')+
 '\nSame-origin iframe: '+(f?String(f.sameOrigin):'немає')+
 '\nМережевих типів у iframe: '+(f&&f.resources?f.resources.length:0));
}
try{capture();}catch(e){errors.push('initial capture failed');}
setTimeout(function(){try{capture();}catch(e){errors.push('second capture failed');}download();},4500);
}());