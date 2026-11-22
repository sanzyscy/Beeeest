/* STRUMYK 0.13 browser-assisted sync. Runs on strumyk.ca or strumyk.cv only.
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
  if(!api.L && !api.M){alert('STRUMYK: у цій вкладці немає конфігурації L/M. Відкрий головну сторінку, дочекайся розкладу й запусти ще раз.');return;}
  function get(k) {
    if(!api[k])return Promise.resolve({data:[],state:'no-config'});
    return fetch(api[k],{credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}})
      .then(function(r){if(!r.ok)throw Error('HTTP '+r.status);return r.json();})
      .then(function(d){if(!Array.isArray(d))throw Error('NOT_AN_ARRAY');return {data:d,state:'ok'};})
      .catch(function(e){return {data:[],state:String(e&&e.message||e).slice(0,90)};});
  }
  Promise.all(keys.map(get)).then(function(items){
    var output={format:'strumyk-browser-sync-v1',site:site,capturedAtMs:Date.now(),sources:{}};
    var states={};keys.forEach(function(k,i){output.sources[k]=items[i].data;states[k]=items[i].state;});
    var unique={},total=0;['J','O','M','X','L'].forEach(function(k){output.sources[k].forEach(function(e){if(e&&e.id&&!unique[e.id]){unique[e.id]=1;total++;}});});
    if(total===0){alert('STRUMYK: жодної події не отримано. Перевір сайт у браузері. '+JSON.stringify(states));return;}
    var message='STRUMYK: '+total+' подій (L/M/J/X/O '+keys.map(function(k){return output.sources[k].length;}).join('/')+'). ';
    var txt=JSON.stringify(output);
    function download(){
      var blob=new Blob([txt],{type:'application/json;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=u;a.download='STRUMYK_SYNC_V013_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
      document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},30000);
      alert(message+'Збережено в Download. Локальний Termux-сервіс підхопить файл автоматично.');
    }
    var controller=typeof AbortController==='function'?new AbortController():null;
    var timer=setTimeout(function(){if(controller)controller.abort();},3500);
    fetch('http://127.0.0.1:8754/ingest',{method:'POST',mode:'cors',credentials:'omit',
      headers:{'Content-Type':'application/json'},body:txt,signal:controller?controller.signal:undefined})
      .then(function(r){if(!r.ok)throw Error('HTTP '+r.status);return r.json();})
      .then(function(r){if(!r.ok)throw Error('Bridge rejected');clearTimeout(timer);alert(message+'Передано в Termux Bridge. Відкривай Lampa.');})
      .catch(function(){clearTimeout(timer);download();});
  }).catch(function(e){alert('STRUMYK sync: '+String(e&&e.message||e));});
}());