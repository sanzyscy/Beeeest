/* STRUMYK SPORTS v0.25 — read-only DRM/capability diagnostic.
 * Run only on an already opened event in the user's own strumyk.ca browser.
 * No license requests, no manifest downloads, no keys, no URL values, no tokens.
 */
(function(){
 'use strict';
 if(!/^strumyk\.(ca|cv)$/i.test(location.hostname)){
   alert('STRUMYK: відкрий матч на strumyk.ca у Chrome'); return;
 }
 if(window.__STRUMYK_DRM_025){alert('STRUMYK DRM v0.25 уже запущено');return;}
 window.__STRUMYK_DRM_025=true;
 function safe(fn,fallback){try{return fn();}catch(e){return fallback;}}
 function clean(v,max){return String(v==null?'':v).replace(/[\x00-\x1f]/g,' ').slice(0,max||90);}
 function urlInfo(value){
    return safe(function(){
      var u=new URL(value,location.href);
      var p=u.pathname.replace(/[a-zA-Z0-9_-]{16,}/g,'[opaque]');
      return {host:u.hostname,path:p.slice(0,120),queryNames:Array.from(u.searchParams.keys()).slice(0,12)};
    },null);
 }
 var r={version:'0.25.0',capturedUtc:new Date().toISOString(),eventTitle:clean((document.querySelector('#watchTitle')||{}).textContent||'',120),
  source:null,frame:{},video:[],shaka:{},drm:{},resourceSummary:{},warnings:[],privacy:'No URL query values, auth headers, licenses, key IDs, DRM initData, cookies or manifest bodies exported.'};
 var frame=document.querySelector('#player iframe');
 r.source=frame?urlInfo(frame.getAttribute('src')||''):null;
 if(!frame){
    r.warnings.push('PLAYER_IFRAME_MISSING');
 }else{
    var w=safe(function(){return frame.contentWindow;},null);
    var doc=safe(function(){return frame.contentDocument;},null);
    r.frame.sameOrigin=!!doc;
    r.frame.sandbox=frame.hasAttribute('sandbox')?clean(frame.getAttribute('sandbox'),80):null;
    r.frame.referrerPolicy=clean(frame.referrerPolicy,50);
    if(!doc||!w){
       r.warnings.push('IFRAME_CROSS_ORIGIN');
    }else{
       r.frame.loaded=urlInfo(safe(function(){return doc.location.href;},''));
       r.shaka.libraryPresent=!!safe(function(){return w.shaka&&w.shaka.Player;},false);
       r.shaka.scripts=Array.prototype.slice.call(doc.querySelectorAll('script[src]'),0,40).map(function(s){return urlInfo(s.src);}).filter(Boolean)
         .filter(function(x){return /shaka|dash|hls|drm|player/i.test(x.path)}).slice(0,10);
       var videos=Array.prototype.slice.call(doc.querySelectorAll('video'),0,4);
       videos.forEach(function(v){
         var mediaKeys=safe(function(){return v.mediaKeys;},null);
         r.video.push({readyState:v.readyState,paused:v.paused,width:v.videoWidth,height:v.videoHeight,
           hasEMEMediaKeys:!!mediaKeys,hasWebkitKeys:!!safe(function(){return v.webkitKeys;},false),
           mediaErrorCode:safe(function(){return v.error&&v.error.code;},null)});
       });
       // Inspect only application-exposed public Shaka Player instances.
       // Do not inspect getConfiguration(), drm keys, or license URLs.
       var candidates=[],keyNames=safe(function(){return Object.keys(w);},[]);
       keyNames.slice(0,1200).forEach(function(name){
         var val=safe(function(){return w[name];},null);
         if(val && typeof val==='object' &&
            typeof val.getDrmInfo==='function' &&
            typeof val.getVariantTracks==='function' &&
            candidates.length<6){
            candidates.push({symbol:clean(name,45),value:val});
         }
       });
       r.shaka.globalPlayerCandidates=candidates.length;
       r.shaka.candidateNames=candidates.map(function(x){return x.symbol;});
       r.shaka.players=candidates.map(function(pair){
          var info=safe(function(){return pair.value.getDrmInfo();},null);
          var isLive=safe(function(){return pair.value.isLive();},null);
          var tracks=safe(function(){return pair.value.getVariantTracks();},[]);
          return {symbol:pair.symbol,drmInfoPresent:!!info,
            drmKeySystem:info?clean(info.keySystem||'',70):null,
            encryptionScheme:info?clean(info.encryptionScheme||'',35):null,
            isLive:isLive,
            trackCount:Array.isArray(tracks)?tracks.length:null,
            activeVideoSize:(function(){
              var t=Array.isArray(tracks)?tracks.filter(function(x){return x&&x.active;})[0]:null;
              return t&&Number.isFinite(t.width)&&Number.isFinite(t.height)?[t.width,t.height]:null;
            }())};
       });
       r.drm.hasMediaKeys=r.video.some(function(x){return x.hasEMEMediaKeys||x.hasWebkitKeys;});
       r.drm.shakaDrmInfoPresent=r.shaka.players.some(function(x){return x.drmInfoPresent;});
       // Script text only boolean hints; never report scripts or content values.
       var scriptText=Array.prototype.slice.call(doc.querySelectorAll('script:not([src])'),0,30)
        .map(function(e){return String(e.textContent||'').slice(0,300000);}).join('\n');
       r.drm.scriptHints={
         widevine:/com\.widevine\.alpha|widevine/i.test(scriptText),
         playready:/com\.microsoft\.playready|playready/i.test(scriptText),
         clearkey:/org\.w3\.clearkey|clearkey/i.test(scriptText),
         licenseWord:/\blicen[cs]e\b/i.test(scriptText),
         drmWord:/\bdrm\b/i.test(scriptText),
         cencWord:/\bcenc\b/i.test(scriptText)
       };
       var counters={},hosts={};
       var entries=safe(function(){return w.performance.getEntriesByType('resource')||[];},[]);
       entries.slice(0,1500).forEach(function(e){
          var u=urlInfo(e.name);if(!u)return;
          var ext=/\.mpd$/i.test(u.path)?'DASH_MPD':
             /\.m3u8$/i.test(u.path)?'HLS':
             /\.(?:mp4|m4s)$/i.test(u.path)?'MEDIA_FRAGMENT':
             /licen[cs]e|widevine|playready|drm/i.test(u.path)?'LICENSE_ENDPOINT_POSSIBLE':
             null;
          if(!ext)return;
          counters[ext]=(counters[ext]||0)+1;
          hosts[u.host]=(hosts[u.host]||0)+1;
       });
       r.resourceSummary={types:counters,hosts:hosts};
       if(!r.drm.hasMediaKeys && !r.drm.shakaDrmInfoPresent && !r.shaka.globalPlayerCandidates)
          r.warnings.push('DRM_UNKNOWN: no accessible player instance or EME signal; not proof of clear stream');
    }
 }
 var json=JSON.stringify(r,null,2),blob=new Blob([json],{type:'application/json;charset=utf-8'});
 var u=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=u;a.download='STRUMYK_SPORT_DRM_V025_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(function(){URL.revokeObjectURL(u);},30000);
 delete window.__STRUMYK_DRM_025;
 alert('SPORT DRM v0.25: звіт збережено.\nShaka Player: '+!!r.shaka.libraryPresent+
 '\nEME MediaKeys: '+!!r.drm.hasMediaKeys+
 '\nShaka DRM Info: '+!!r.drm.shakaDrmInfoPresent+
 '\nВажливо: відсутність ознак не доводить, що потік незашифрований.');
}());