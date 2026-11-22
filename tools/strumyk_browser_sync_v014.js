/* STRUMYK 0.14 DOM-assisted sync. Runs on strumyk.ca or strumyk.cv only.
 * Uses site's own public API config; does not read cookies or storage.
 * Sends browser-returned event arrays to 127.0.0.1:8754, or downloads JSON
 * locally if Android Chrome blocks the loopback request.
 */
(function () {
  'use strict';
  if (!/^(strumyk\.ca|strumyk\.cv)$/i.test(location.hostname)) {
    alert('STRUMYK: відкрий https://strumyk.ca/'); return;
  }
  var keys = ['L','M','J','X','O'];
  var site = location.origin;
  var configs = [];
  if (window.SK && window.SK.api) configs.push(window.SK.api);
  if (window.SK_SCHED && window.SK_SCHED.api) configs.push(window.SK_SCHED.api);
  function apiUrl(k) {
    for (var i=0;i<configs.length;i++) {
      var raw=configs[i][k]; if(!raw || typeof raw!=='string')continue;
      try {
        var u=new URL(raw, site+'/');
        if(u.origin === site && u.pathname === '/api/'+k+'.php')return u.href;
      }catch(e){}
    }
    return '';
  }
  var api = {};
  keys.forEach(function(k){api[k]=apiUrl(k);});

  function domEvents(){
    var list=document.querySelector('#schedList');if(!list)return [];
    var rows=[],seen=Object.create(null),date=new Date();
    function norm(t,n){return String(t==null?'':t).replace(/\s+/g,' ').trim().slice(0,n||240);}
    function day(label){
      var d=new Date(),s=norm(label,130).toLowerCase();
      if(/(?:jutro|завтра|tomorrow)/.test(s))d.setDate(d.getDate()+1);
      else if(/(?:pojutrze|післязавтра)/.test(s))d.setDate(d.getDate()+2);
      else if(/(?:wczoraj|вчора|yesterday)/.test(s))d.setDate(d.getDate()-1);
      var m=s.match(/(\d{1,2})\s+([a-ząćęłńóśźż]+)(?:\s+(\d{4}))?/i);
      if(m){var names={stycznia:0,lutego:1,marca:2,kwietnia:3,maja:4,czerwca:5,lipca:6,sierpnia:7,wrzesnia:8,pazdziernika:9,listopada:10,grudnia:11};
        var month=m[2].normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        if(Object.prototype.hasOwnProperty.call(names,month))d=new Date(Number(m[3])||d.getFullYear(),names[month],Number(m[1]));
      }return d;
    }
    function category(text){
      var map={'⚽':'pilkanozna','🏆':'pilkanozna','🥊':'boks','🥋':'mma','🏒':'hokej','🏀':'koszykowka','🏐':'siatkowka','🎾':'tenis','🏈':'futbolamerykanski','🏁':'motorsport','🏎':'formula1','🏍':'motogp','🎯':'dart','⛳':'golf','🤾':'pilkareczna'};
      var out='';Object.keys(map).some(function(k){if(text.indexOf(k)>=0){out=map[k];return true;}return false;});return out;
    }
    Array.prototype.forEach.call(list.children||[],function(el){
      var cn=' '+String(el.className||'')+' ';
      if(cn.indexOf(' sched-group ')>=0){date=day(el.textContent||'');return;}
      if(cn.indexOf(' sched-item ')<0)return;
      var id=norm(el.getAttribute('data-id'),80),titleEl=el.querySelector('.m');
      var title=norm(titleEl?titleEl.textContent:el.getAttribute('title'),250);
      if(!/^[A-Za-z0-9_-]{2,80}$/.test(id)||!title||seen[id])return;seen[id]=true;
      var tm=el.querySelector('.t'),time=norm(tm?tm.textContent:''),markEl=el.querySelector('.em');
      var live=!!(tm&&((' '+String(tm.className||'')+' ').indexOf(' live ')>=0||/^live$/i.test(time)));
      var row={id:id,title:title,category:category(norm(markEl?markEl.textContent:'')),live:live,
               status:live?'live':'upcoming',timeLabel:time,pageUrl:site+'/#'+encodeURIComponent(id)};
      var t=/^(\d{1,2}):(\d{2})$/.exec(time);
      if(t&&!live)row.startTime=Math.floor(new Date(date.getFullYear(),date.getMonth(),date.getDate(),Number(t[1]),Number(t[2])).getTime()/1000);
      rows.push(row);
    });
    // For the currently selected event, preserve all public source buttons/quality variants.
    try{
      var active=decodeURIComponent(location.hash.slice(1)),e=rows.filter(function(x){return x.id===active;})[0];
      if(e){var groups=[];Array.prototype.forEach.call(document.querySelectorAll('#sources .lang-group'),function(g){
        var label=g.querySelector('.lang-label'),lang=norm(label?label.getAttribute('title')||label.textContent:'',100),items=[];
        Array.prototype.forEach.call(g.querySelectorAll('.src-btn[data-src]'),function(btn){
          var url=btn.getAttribute('data-src');if(!url)return;
          try{var u=new URL(url,site);if(!/^https?:$/.test(u.protocol)||u.username||u.password)return;
            items.push({label:norm(btn.textContent,35),embed:u.href});}catch(ignore){}
        });if(items.length)groups.push({language:lang,embeds:items});
      });if(groups.length)e._embeds=groups;}
    }catch(ignore){}
    return rows;
  }
  function get(k){
    if(!api[k])return Promise.resolve({data:[],state:{status:'no-config'}});
    return fetch(api[k],{credentials:'same-origin',cache:'default',headers:{Accept:'application/json'}})
      .then(function(r){return r.text().then(function(body){
        var state={status:r.status,bytes:body.length,contentType:String(r.headers.get('content-type')||'').slice(0,70)};
        if(!r.ok)return {data:[],state:Object.assign(state,{error:'HTTP '+r.status})};
        if(body.length>3000000)return {data:[],state:Object.assign(state,{error:'too-large'})};
        try{var d=JSON.parse(body);if(!Array.isArray(d)){
          state.error='not-array';state.rootKeys=d&&typeof d==='object'?Object.keys(d).slice(0,12):[];
          return {data:[],state:state};
        }state.count=d.length;return {data:d,state:state};}
        catch(e){state.error='not-json';return {data:[],state:state};}
      });})
      .catch(function(e){return {data:[],state:{status:'network-error',error:String(e&&e.message||e).slice(0,100)}};});
  }
  Promise.all(keys.map(get)).then(function(items){
    var output={format:'strumyk-browser-sync-v1',site:site,capturedAtMs:Date.now(),sources:{},apiStates:{},version:'0.14.0'};
    var states={};keys.forEach(function(k,i){output.sources[k]=items[i].data;states[k]=items[i].state;});
    output.sources.D=domEvents();output.apiStates=states;output.apiStates.D={status:'DOM',count:output.sources.D.length};
    var unique={},total=0;['J','O','M','X','L','D'].forEach(function(k){output.sources[k].forEach(function(e){if(e&&e.id&&!unique[e.id]){unique[e.id]=1;total++;}});});
    if(total===0){alert('STRUMYK: жодної події не отримано. Перевір сайт у браузері. '+JSON.stringify(states));return;}
    var message='STRUMYK: '+total+' подій (L/M/J/X/O '+keys.concat('D').map(function(k){return output.sources[k].length;}).join('/')+'). ';
    var txt=JSON.stringify(output);
    function download(){
      var blob=new Blob([txt],{type:'application/json;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=u;a.download='STRUMYK_SYNC_V014_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
      document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},30000);
      alert(message+'Збережено в Download. Локальний Termux-сервіс підхопить файл автоматично.');
    }
    var controller=typeof AbortController==='function'?new AbortController():null;
    var timer=setTimeout(function(){if(controller)controller.abort();},3500);
    fetch('http://127.0.0.1:8754/ingest',{method:'POST',mode:'cors',credentials:'omit',
      headers:{'Content-Type':'application/json'},body:txt,signal:controller?controller.signal:undefined})
      .then(function(r){if(!r.ok)throw Error('HTTP '+r.status);return r.json();})
      .then(function(r){if(!r.ok || !r.counts || r.counts.D!==output.sources.D.length)throw Error('BRIDGE_V014_REQUIRED');clearTimeout(timer);alert(message+'Прийнято в Termux Bridge v0.14.');})
      .catch(function(){clearTimeout(timer);download();});
  }).catch(function(e){alert('STRUMYK sync: '+String(e&&e.message||e));});
}());