/* STRUMYK TV activation trace v0.15.0
 * One on-device, bounded diagnostic. Start BEFORE clicking a TV channel.
 * Captures request METHOD/STATUS/REDACTED route, DOM iframe changes, selected channel metadata.
 * Does not read/store cookies, tokens, request/response bodies, localStorage or headers.
 * Exports JSON locally. No telemetry upload or extra network requests.
 */
(function () {
  'use strict';
  if (!/^(strumyk\.ca|strumyk\.cv)$/i.test(location.hostname) || !/^\/telewizja\/?$/i.test(location.pathname)) {
    alert('STRUMYK: відкрий /telewizja/ і запусти діагностику ПЕРЕД вибором каналу.'); return;
  }
  if (window.__strumykTvTrace015) {
    alert('STRUMYK: запис уже працює. Використай кнопку «Зберегти TV-звіт».'); return;
  }
  var started=Date.now(), perfStart=performance.now(), maxRecords=240;
  var records=[], states=[], clicks=[];
  var originalFetch=window.fetch, oldOpen=XMLHttpRequest.prototype.open, oldSend=XMLHttpRequest.prototype.send;
  var interval=null, timeout=null, observer=null, closed=false, panel=null;
  function elapsed(){return Date.now()-started;}
  function short(s,n){return String(s==null?'':s).replace(/[\u0000-\u001f]/g,' ').trim().slice(0,n||100);}
  function locationInfo(raw) {
    try {
      var u=new URL(String(raw),location.href);
      if(!/^https?:$/.test(u.protocol))return {scheme:u.protocol};
      var p=u.pathname.split('/').map(function(k){
        if(k.length>28||/[a-f0-9]{24,}/i.test(k)||/^[A-Za-z0-9_-]{18,}$/.test(k))
          return '[opaque'+((k.match(/\.[a-z0-9]{2,5}$/i)||[])[0]||'')+']';
        return k;
      }).join('/');
      return {origin:u.origin,path:short(p,250),queryKeys:Array.from(u.searchParams.keys()).slice(0,14),hasHash:!!u.hash};
    }catch(e){return {unparsed:true};}
  }
  function add(type,value){
    if(closed||records.length>=maxRecords)return;
    records.push({ms:elapsed(),type:type,value:value});
  }
  function activeId(){
    var h=location.hash.slice(1);
    if(!h)return '';
    try{h=decodeURIComponent(h);}catch(ignore){}
    return /^[a-z0-9_-]{1,80}$/i.test(h)?h:'[hash-redacted]';
  }
  function frameInfo(root) {
    var out=[];
    Array.prototype.slice.call(root.querySelectorAll('iframe,video,source'),0,24).forEach(function(n){
      var item={tag:n.tagName.toLowerCase(),id:short(n.id,60),cls:short(n.className,80),
        src:n.currentSrc||n.getAttribute('src')?locationInfo(n.currentSrc||n.getAttribute('src')):null};
      if(n.tagName.toLowerCase()==='video')item.readyState=n.readyState;
      if(n.tagName.toLowerCase()==='iframe'){
        try{var d=n.contentDocument;if(d&&d.location&&d.location.origin===location.origin){
          item.sameOriginChild=true;
          item.childMedia=Array.prototype.slice.call(d.querySelectorAll('video,source,iframe'),0,8)
           .map(function(m){return {tag:m.tagName.toLowerCase(),src:locationInfo(m.currentSrc||m.getAttribute('src')||'')};});
        }}catch(ignore){item.sameOriginChild=false;}
      }
      out.push(item);
    });return out;
  }
  function channelState(){
    var list=Array.isArray(window.CHANNELS)?window.CHANNELS:[];
    var id=activeId(),ch=list.find(function(c){return c&&c.id===id;});
    return {total:list.length,nonemptyUrls:list.filter(function(c){return !!(c&&c.url);}).length,
      selectedId:id,selectedName:ch?short(ch.name,90):'',
      selectedChannel:ch?{id:short(ch.id,70),category:short(ch.cat,50),url:ch.url?locationInfo(ch.url):null}:null};
  }
  function snapshot(reason) {
    if(closed)return;
    var state={ms:elapsed(),reason:reason,channel:channelState(),
      pageTitle:short(document.title,120),frames:frameInfo(document)};
    var signature=JSON.stringify([state.channel,state.frames,state.pageTitle]);
    if(!states.length||states[states.length-1]._signature!==signature){
      state._signature=signature;states.push(state);
      if(states.length>40)states.shift();
    }
  }
  function recordFetch(input,init) {
    var raw=typeof input==='string'?input:(input&&input.url)||'';
    var method=(init&&init.method)||(input&&input.method)||'GET';
    var r={method:short(method,12),request:locationInfo(raw)};
    add('fetch-start',r);
    try{
      return originalFetch.apply(this,arguments).then(function(res){
        add('fetch-end',{request:r.request,status:res.status});return res;
      },function(err){add('fetch-error',{request:r.request,errorName:short(err&&err.name,50)});throw err;});
    }catch(err){add('fetch-error',{request:r.request,errorName:short(err&&err.name,50)});throw err;}
  }
  try{
    window.fetch=recordFetch;
    XMLHttpRequest.prototype.open=function(method,url){
      try{
        var req={method:short(method,12),request:locationInfo(url)};
        this.__stTrace015=req;
        this.addEventListener('loadend',function(){
          add('xhr-end',{method:req.method,request:req.request,status:this.status});
        },{once:true});
      }catch(ignore){}
      return oldOpen.apply(this,arguments);
    };
    XMLHttpRequest.prototype.send=function(){
      if(this.__stTrace015)add('xhr-start',this.__stTrace015);
      return oldSend.apply(this,arguments);
    };
  }catch(ignore){}
  function observeResources(entries){
    entries.forEach(function(e){
      if(e.startTime+1<perfStart)return;
      add('resource',{source:short(e.initiatorType,40),request:locationInfo(e.name),
        durationMs:Math.round(e.duration),status:e.responseStatus||null});
    });
  }
  try{observer=new PerformanceObserver(function(list){observeResources(list.getEntries());});
      observer.observe({type:'resource',buffered:true});}catch(ignore){}
  function onClick(e){
    if(panel&&(panel===e.target||panel.contains(e.target)))return;
    var n=e.target&&e.target.closest&&e.target.closest('a,button,[data-channel],[data-id],[data-ch],.epg-row');
    if(!n)return;
    if(clicks.length>=24)return;
    var txt=n.matches('input,textarea,select')?'':short(n.textContent,90);
    clicks.push({ms:elapsed(),tag:n.tagName.toLowerCase(),id:short(n.id,60),
      cls:short(n.className,90),channel:n.getAttribute('data-channel')||n.getAttribute('data-ch')||n.getAttribute('data-id')||'',
      text:txt});
    setTimeout(function(){snapshot('after-click');},500);
  }
  document.addEventListener('click',onClick,true);
  function cleanStates(){return states.map(function(s){var c=Object.assign({},s);delete c._signature;return c;});}
  function teardown(){
    if(closed)return;closed=true;
    clearInterval(interval);clearTimeout(timeout);
    if(observer)observer.disconnect();
    document.removeEventListener('click',onClick,true);
    if(window.fetch===recordFetch)window.fetch=originalFetch;
    if(XMLHttpRequest.prototype.open!==oldOpen)XMLHttpRequest.prototype.open=oldOpen;
    if(XMLHttpRequest.prototype.send!==oldSend)XMLHttpRequest.prototype.send=oldSend;
    if(panel)panel.remove();
    delete window.__strumykTvTrace015;
  }
  function finish(save){
    if(closed)return;
    snapshot('final');
    var result={version:'0.15.0',capturedUtc:new Date().toISOString(),site:location.origin,
      durationMs:elapsed(),notice:'URLs contain no query VALUES and long path segments are masked; review before sharing',
      clicks:clicks,states:cleanStates(),requests:records,requestLimit:maxRecords};
    teardown();
    if(!save)return;
    var blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json;charset=utf-8'});
    var u=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=u;a.download='STRUMYK_TV_ACTIVATION_V015_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(u);},30000);
    alert('STRUMYK: діагностику збережено. Перевір JSON перед надсиланням.');
  }
  panel=document.createElement('div');
  panel.style.cssText='position:fixed!important;right:8px!important;bottom:65px!important;z-index:2147483647!important;display:flex!important;gap:5px!important;background:#132a39!important;border:1px solid #70c8e9!important;padding:7px!important;border-radius:12px!important;font:13px Arial,sans-serif!important;';
  function button(label,action){
    var b=document.createElement('button');b.type='button';b.textContent=label;
    b.style.cssText='background:#e4f6fd!important;color:#092332!important;border:0!important;padding:9px 11px!important;border-radius:8px!important;cursor:pointer!important;font:13px Arial,sans-serif!important;';
    b.addEventListener('click',function(e){e.stopPropagation();e.preventDefault();action();});return b;
  }
  panel.appendChild(button('📋 Зберегти TV-звіт',function(){finish(true);}));
  panel.appendChild(button('✕',function(){finish(false);}));
  document.documentElement.appendChild(panel);
  window.__strumykTvTrace015={save:function(){finish(true);},cancel:function(){finish(false);}};
  snapshot('before-click');
  interval=setInterval(function(){snapshot('poll');},1300);
  timeout=setTimeout(function(){finish(true);},90000);
  alert('STRUMYK TV: запис почався. Тепер відкрий ОДИН телеканал на сайті, увімкни відео, потім натисни «Зберегти TV-звіт» унизу.');
}());