/* STRUMYK EPG Probe 0.8: single public same-origin GET; local JSON summary.
 * Does NOT read cookies, browser storage, authorization, chat or form fields.
 * Downloads no full raw EPG and never uploads collected data to third parties.
 */
(function () {
 'use strict';
 if (!/^(strumyk\.ca|strumyk\.cv)$/i.test(location.hostname) || !/^\/telewizja\//.test(location.pathname)) {
   alert('STRUMYK EPG: відкрий https://strumyk.ca/telewizja/');return;
 }
 var t0=Date.now();
 var chans=Array.isArray(window.CHANNELS)?window.CHANNELS:[];
 var ids=Object.create(null), groups=Object.create(null);
 chans.forEach(function(c){if(c&&typeof c.id==='string'){ids[c.id]={name:String(c.name||'').slice(0,80),cat:String(c.cat||'').slice(0,30)};groups[c.cat]=(groups[c.cat]||0)+1;}});
 function short(s,n){return String(s===undefined||s===null?'':s).replace(/[\x00-\x1f]/g,' ').trim().slice(0,n||200);}
 function outShape(x,depth){
   if(x===null)return {type:'null'};
   if(Array.isArray(x))return {type:'array',length:x.length,first:depth<4&&x.length?outShape(x[0],depth+1):undefined};
   if(typeof x==='object'){
     var ks=Object.keys(x),shape={type:'object',keyCount:ks.length,keys:ks.slice(0,65)};
     if(depth<4){shape.children={};ks.slice(0,8).forEach(function(k){if(x[k]!==null&&typeof x[k]==='object')shape.children[k]=outShape(x[k],depth+1);else shape.children[k]={type:typeof x[k]};});}
     return shape;
   }
   return {type:typeof x};
 }
 function sampleEntry(node,path){
   var record={path:path.slice(-220),fields:Object.keys(node).slice(0,35)};
   ['title','name','programme','program','program_title','programme_title','start','startTime','start_time','start_timestamp','begin','from','end','endTime','end_time','stop','stop_timestamp','to','channel','channel_id','channelId','station','id'].forEach(function(k){
     var v=node[k];if(typeof v==='string'||typeof v==='number'){record[k]=/^(?:https?:|\/\/)/.test(String(v))?'[URL hidden]':short(v,160);}
   });
   return record;
 }
 function samples(doc){
   var rows=[],seen=0;
   function walk(x,path,depth){
     if(!x||typeof x!=='object'||depth>6||rows.length>=70||++seen>8000)return;
     if(Array.isArray(x)){x.slice(0,80).forEach(function(n,i){walk(n,path+'['+i+']',depth+1);});return;}
     var keys=Object.keys(x),kset=keys.join('|');
     if(/(?:^|\|)(?:title|name|programme|program)(?:\||$)/.test(kset)&&/(?:start|begin|from)/i.test(kset)&&/(?:end|stop|finish|to)/i.test(kset)){
       rows.push(sampleEntry(x,path));return;
     }
     keys.slice(0,150).forEach(function(k){if(x[k]!==null&&typeof x[k]==='object')walk(x[k],path+'.'+k,depth+1);});
   }
   walk(doc,'root',0);return rows;
 }
 function channelLookup(doc){
   var found=[];
   var selected=['tvp1','tvp2','tvn','tvpsport','polsat-sport-premium2','eleven4','canal-sport1','eurosport1','canal-now','tvp3'];
   function walk(x,path,depth){
     if(!x||typeof x!=='object'||depth>4||found.length>=50)return;
     if(Array.isArray(x)){if(depth<2)x.slice(0,12).forEach(function(y,i){walk(y,path+'['+i+']',depth+1);});return;}
     Object.keys(x).slice(0,160).forEach(function(k){
       if(selected.indexOf(k)>=0){var value=x[k];found.push({id:k,name:ids[k]?ids[k].name:'',path:path+'.'+k,type:Array.isArray(value)?'array':typeof value,length:Array.isArray(value)?value.length:null});}
       if(depth<4&&x[k]&&typeof x[k]==='object')walk(x[k],path+'.'+k,depth+1);
     });
   }
   walk(doc,'root',0);return found;
 }
 function save(report){
   var blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=u;a.download='STRUMYK_EPG_V08_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';document.body.appendChild(a);a.click();a.remove();
   setTimeout(function(){URL.revokeObjectURL(u);},30000);
   alert('STRUMYK EPG: HTTP '+(report.http||'?')+', записів для аналізу '+(report.programmeSamples||[]).length+'. JSON збережено локально.');
 }
 var report={version:'0.8.0',capturedUtc:new Date().toISOString(),page:location.origin+location.pathname,
   channelCount:chans.length,channelCategoryCounts:groups,endpoint:'/api/epg.php',
   http:null,contentType:'',bodyBytes:null,elapsedMs:null,rootShape:null,programmeSamples:[],matchedChannelIds:[],error:null};
 var controller=typeof AbortController==='function'?new AbortController():null;
 var ttl=setTimeout(function(){if(controller)controller.abort();},15000);
 fetch('/api/epg.php',{method:'GET',credentials:'omit',mode:'same-origin',cache:'no-store',redirect:'error',headers:{'Accept':'application/json'},signal:controller?controller.signal:undefined})
   .then(function(res){report.http=res.status;report.contentType=res.headers.get('content-type')||'';return res.text().then(function(text){
     report.bodyBytes=text.length;if(!res.ok){report.error='HTTP '+res.status;return;}
     if(text.length>5000000){report.error='response larger than 5MB';return;}
     try{var data=JSON.parse(text);report.rootShape=outShape(data,0);report.programmeSamples=samples(data);report.matchedChannelIds=channelLookup(data);}
     catch(e){report.error='not valid JSON: '+String(e&&e.message||e).slice(0,160);}
   });})
   .catch(function(e){report.error=short(e&&e.message||e,160);})
   .then(function(){clearTimeout(ttl);report.elapsedMs=Date.now()-t0;save(report);});
}());