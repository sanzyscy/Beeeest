/* STRUMYK v0.5 public app-code capture.
   Reads only two public first-party JS assets. No cookies, storage, auth, DOM text,
   stream query values or remote upload. Output is a LOCAL JSON download. */
(function () {
  'use strict';
  if (location.hostname !== 'strumyk.ca') { alert('STRUMYK: відкрий strumyk.ca'); return; }
  var names=['/js/strumyk-app.js','/js/strumyk-schedule.js'];
  var report={version:'0.5.0',date:new Date().toISOString(),site:location.origin,
    currentPagePath:location.pathname,queryParameterNames:Array.from(new URLSearchParams(location.search).keys()),
    files:[]};
  function grab(path){
    return fetch(path,{method:'GET',credentials:'omit',cache:'no-store',redirect:'error'})
      .then(function(r){
        var record={path:path,http:r.status,contentType:r.headers.get('content-type')||''};
        if(!r.ok){record.error='HTTP '+r.status;return record;}
        if(!/javascript|text\/plain/.test(record.contentType)){record.error='unexpected MIME';return record;}
        return r.text().then(function(src){
          record.bytes=src.length;
          if(src.length>160000){record.error='too large';return record;}
          record.source=src;
          return record;
        });
      }).catch(function(e){return {path:path,error:String(e&&e.message||e)};});
  }
  Promise.all(names.map(grab)).then(function(files){
    report.files=files;
    var blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json;charset=utf-8'});
    var url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url;a.download='STRUMYK_PUBLIC_JS_V05_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},30000);
    alert('STRUMYK JS: '+files.filter(function(x){return !!x.source;}).length+' / 2 файли. Перевір JSON перед надсиланням.');
  }).catch(function(e){alert('STRUMYK JS: '+String(e&&e.message||e));});
}());