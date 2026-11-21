/* STRUMYK EPG compact tuple inspector v0.9.0
 * One same-origin public /api/epg.php GET; exports bounded, redacted samples.
 * No cookies, localStorage, session access or third-party uploads.
 */
(function () {
 'use strict';
 if (!/^(strumyk\.ca|strumyk\.cv)$/i.test(location.hostname) ||
     !/^\/telewizja\/?$/i.test(location.pathname)) {
   alert('STRUMYK EPG v0.9: відкрий strumyk.ca/telewizja/');return;
 }
 var start=Date.now(), ac=typeof AbortController==='function'?new AbortController():null;
 var timer=setTimeout(function(){if(ac)ac.abort();},15000);
 var allowed=['tvp1','tvp2','tvn','tvpsport','polsat-sport-premium2','eleven4','canal-now','tvp3'];
 function str(v,n) {return String(v===null||v===undefined?'':v).replace(/[\x00-\x1f]/g,' ').trim().slice(0,n||160);}
 function clean(v) {
   if (v===null || typeof v==='boolean')return v;
   if (typeof v==='number')return Number.isFinite(v)?v:null;
   if (typeof v==='string') {
     if (/^https?:\/\//i.test(v)) {try {var u=new URL(v);return u.origin+u.pathname.replace(/\/[A-Za-z0-9_-]{45,}/g,'/[opaque]')+(u.search?'?[redacted]':'');}catch(e){return '[URL]';}}
     return str(v,180);
   }
   return Array.isArray(v)?v.slice(0,6).map(clean):'[object-not-exported]';
 }
 function smallRoot(x) {
   var r={};['ok','date','today','from','to','now','pending'].forEach(function(k){
     var v=x[k];r[k]=(typeof v==='string'||typeof v==='number'||typeof v==='boolean')?clean(v):null;
   });return r;
 }
 function shape(arr) {return Array.isArray(arr)?arr.map(function(v){return v===null?'null':Array.isArray(v)?'array':typeof v;}):[];}
 function pickedIndices(length, extended) {
   if(!length)return [];
   var indexes=extended?[0,1,2,Math.floor(length/2),Math.max(0,length-2),length-1]:[0,1,Math.floor(length/2),length-1];
   return indexes.filter(function(i,pos){return indexes.indexOf(i)===pos && i>=0 && i<length;});
 }
 function channelSample(ch,extended){
   var items=Array.isArray(ch.it)?ch.it:[];
   return {id:str(ch.id,100),e:clean(ch.e),fb:clean(ch.fb),itemsCount:items.length,
     firstItemShape:items.length?shape(items[0]):[],
     examples:pickedIndices(items.length,extended).map(function(i){
       var item=items[i];return {index:i,types:shape(item),tuple:Array.isArray(item)?item.slice(0,6).map(clean):clean(item)};
     })};
 }
 function build(data,http,mime,bytes,error){
   var cs=Array.isArray(data&&data.ch)?data.ch:[];
   var result={version:'0.9.0',capturedUtc:new Date().toISOString(),page:location.origin+location.pathname,
     endpoint:'/api/epg.php',http:http,contentType:mime,bodyBytes:bytes,elapsedMs:Date.now()-start,
     root:data?smallRoot(data):null,channelCount:cs.length,error:error||null,
     channels:[],tupleLengthCounts:{},tupleTypePatterns:{},channelIdsMatched:0};
   var known={};(Array.isArray(window.CHANNELS)?window.CHANNELS:[]).forEach(function(c){if(c&&c.id)known[c.id]=true;});
   cs.forEach(function(c){
     if(c&&known[c.id])result.channelIdsMatched++;
     var items=Array.isArray(c&&c.it)?c.it:[];
     items.slice(0,8).forEach(function(it){
       if(!Array.isArray(it))return;
       var k=String(it.length),pat=shape(it).join(',');
       result.tupleLengthCounts[k]=(result.tupleLengthCounts[k]||0)+1;
       result.tupleTypePatterns[pat]=(result.tupleTypePatterns[pat]||0)+1;
     });
   });
   var chosen=[];
   cs.forEach(function(c){if(c&&allowed.indexOf(c.id)>=0)chosen.push(c);});
   cs.forEach(function(c){if(c&&chosen.indexOf(c)<0&&chosen.length<10)chosen.push(c);});
   result.channels=chosen.slice(0,10).map(function(c,i){return channelSample(c,i<2);});
   return result;
 }
 function download(report) {
   var data=JSON.stringify(report,null,2),blob=new Blob([data],{type:'application/json;charset=utf-8'});
   var url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download='STRUMYK_EPG_TUPLES_V09_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
   document.body.appendChild(a);a.click();a.remove();
   setTimeout(function(){URL.revokeObjectURL(url);},30000);
   alert('STRUMYK EPG v0.9: каналів '+report.channelCount+', прикладів '+report.channels.reduce(function(n,c){return n+c.examples.length;},0)+'. Збережено локально.');
 }
 fetch('/api/epg.php',{method:'GET',credentials:'omit',cache:'no-store',mode:'same-origin',redirect:'error',
   headers:{Accept:'application/json'},signal:ac?ac.signal:undefined})
   .then(function(r){return r.text().then(function(t){
      if(t.length>2000000)throw new Error('EPG larger than 2MB');
      if(!r.ok)return build(null,r.status,r.headers.get('content-type')||'',t.length,'HTTP '+r.status);
      try {return build(JSON.parse(t),r.status,r.headers.get('content-type')||'',t.length,null);}
      catch(e){return build(null,r.status,r.headers.get('content-type')||'',t.length,'JSON: '+str(e.message,130));}
   });})
   .catch(function(e){return build(null,0,'',0,str(e&&e.message||e,130));})
   .then(function(r){clearTimeout(timer);download(r);});
}());