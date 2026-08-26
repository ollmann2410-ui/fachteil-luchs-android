(function(){
  'use strict';
  if(window.__FachteilLuchsExamAnalysisV14)return;
  window.__FachteilLuchsExamAnalysisV14=true;

  var EXAM_KEY='fachteil_exam_state_v1';
  var box=null;
  var observer=null;
  var applying=false;

  function byId(id){return document.getElementById(id);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function mean(values){if(!values.length)return null;var s=0;for(var i=0;i<values.length;i++)s+=Number(values[i])||0;return s/values.length;}
  function roundPct(v){return v===null||v===undefined?'–':Math.round(Number(v)||0)+'%';}
  function modeLabel(k){return k==='all'?'Gesamt':k==='hf1'?'HF 1':k==='hf2'?'HF 2':k==='hf3'?'HF 3':String(k||'Prüfung');}
  function hfLabel(k){return k==='hf1'?'HF 1':k==='hf2'?'HF 2':k==='hf3'?'HF 3':String(k||'').toUpperCase();}
  function dateShort(ts){var d=new Date(Number(ts)||Date.now());return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getFullYear()).slice(-2);}

  function loadAttempts(){
    try{
      var raw=JSON.parse(localStorage.getItem(EXAM_KEY)||'null');
      var a=raw&&Array.isArray(raw.attempts)?raw.attempts:[];
      return a.filter(function(x){return x&&typeof x==='object'&&Number(x.total)>0;}).slice(0,50);
    }catch(e){return [];}
  }

  function valuesForMode(attempts,mode){
    return attempts.filter(function(a){return a.mode===mode;}).map(function(a){return clamp(Number(a.pct)||0,0,100);});
  }
  function hfValues(attempts,key){
    var out=[];
    attempts.forEach(function(a){var h=a&&a.hf&&a.hf[key];if(h&&Number(h.total)>0)out.push(clamp(Number(h.pct)||0,0,100));});
    return out;
  }
  function trend(values){
    if(values.length<4)return {ready:false,delta:null,label:'Im Aufbau',className:'neutral',detail:'Für eine Tendenz werden mindestens vier vergleichbare Ergebnisse benötigt.'};
    var n=values.length>=6?3:2;
    var recent=mean(values.slice(0,n));
    var before=mean(values.slice(n,n*2));
    var delta=Math.round((recent||0)-(before||0));
    var label=(delta>0?'↑ +':delta<0?'↓ ':'→ ')+delta+' P';
    return {ready:true,delta:delta,label:label,className:delta>=5?'up':delta<=-5?'down':'neutral',detail:'Vergleich der letzten '+n+' mit den vorherigen '+n+' Ergebnissen.'};
  }
  function modeSummary(attempts,mode){
    var vals=valuesForMode(attempts,mode);
    return {count:vals.length,avg:mean(vals),best:vals.length?Math.max.apply(null,vals):null,trend:trend(vals)};
  }
  function hfSummary(attempts,key){
    var vals=hfValues(attempts,key);
    return {count:vals.length,avg:mean(vals),best:vals.length?Math.max.apply(null,vals):null,trend:trend(vals)};
  }

  function strongestWeakest(hfs){
    var arr=[];
    ['hf1','hf2','hf3'].forEach(function(k){if(hfs[k].avg!==null)arr.push({key:k,avg:hfs[k].avg,count:hfs[k].count});});
    if(!arr.length)return {strong:null,weak:null};
    arr.sort(function(a,b){return b.avg-a.avg;});
    return {strong:arr[0],weak:arr[arr.length-1]};
  }

  function injectStyle(){
    if(byId('exam-analysis-v14-styles'))return;
    var style=document.createElement('style');
    style.id='exam-analysis-v14-styles';
    style.textContent=`
      .examAnalyticsV14{display:grid;gap:10px}
      .examA14Head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
      .examA14Title{font-size:16px;font-weight:950;letter-spacing:-.02em}
      .examA14Text{font-size:9px;color:var(--muted);line-height:1.4;margin-top:3px}
      .examA14Grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
      .examA14Metric{padding:10px 11px;border:1px solid var(--line);border-radius:13px;background:rgba(127,127,127,.035);min-width:0}
      .examA14Metric span{display:block;font-size:9px;color:var(--muted);font-weight:850}.examA14Metric strong{display:block;font-size:19px;margin-top:3px;line-height:1.1}
      .examA14Metric strong.up{color:#65d994}.examA14Metric strong.down{color:#ff8b84}
      .examA14HfLine{display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap;padding:8px 10px;border:1px solid var(--line);border-radius:12px;background:var(--soft);font-size:9px;line-height:1.4}
      .examA14HfLine strong{font-size:10px}.examA14Muted{color:var(--muted)}
      .examA14Actions{display:flex;gap:7px;flex-wrap:wrap}.examA14Actions .btn{min-height:38px;padding:8px 11px;font-size:10px;flex:1 1 140px}
      .examA14Details{border:1px solid var(--line);border-radius:13px;overflow:hidden;background:rgba(127,127,127,.025)}
      .examA14Details>summary{list-style:none;cursor:pointer;padding:10px 11px;font-size:10px;font-weight:900}.examA14Details>summary::-webkit-details-marker{display:none}
      .examA14DetailsBody{display:grid;gap:10px;padding:0 10px 10px}
      .examA14SectionTitle{font-size:10px;font-weight:950;margin-bottom:5px}
      .examA14ModeGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
      .examA14Mode{padding:8px 9px;border:1px solid var(--line);border-radius:11px;background:rgba(127,127,127,.025)}
      .examA14ModeTop{display:flex;justify-content:space-between;gap:6px;font-size:9px;font-weight:900}.examA14ModeMeta{font-size:8px;color:var(--muted);line-height:1.4;margin-top:3px}
      .examA14HfGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
      .examA14Hf{padding:8px;border:1px solid var(--line);border-radius:11px;background:rgba(127,127,127,.025)}
      .examA14Hf strong{display:block;font-size:16px}.examA14Hf span{display:block;font-size:8px;color:var(--muted);margin-top:2px}.examA14Trend{font-size:8px;font-weight:900;margin-top:4px}.examA14Trend.up{color:#65d994}.examA14Trend.down{color:#ff8b84}
      .examA14History{display:grid;gap:5px}.examA14HistoryItem{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:7px 8px;border:1px solid var(--line);border-radius:10px;background:rgba(127,127,127,.02)}
      .examA14HistoryItem span{font-size:8px;color:var(--muted)}.examA14HistoryItem strong{font-size:10px}.examA14Pass{font-size:7px;font-weight:900;margin-left:5px}
      .examA14Note{font-size:8px;line-height:1.45;color:var(--muted);padding:8px 9px;border-left:2px solid var(--primary);background:var(--soft);border-radius:0 9px 9px 0}
      @media(max-width:460px){.examA14Grid{grid-template-columns:repeat(3,minmax(0,1fr))}.examA14Metric{padding:9px 7px}.examA14Metric strong{font-size:17px}.examA14ModeGrid{grid-template-columns:1fr 1fr}.examA14HfGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    `;
    document.head.appendChild(style);
  }

  function render(){
    box=byId('examAnalysisV13');
    if(!box||applying)return;
    applying=true;
    injectStyle();
    var attempts=loadAttempts();
    if(!attempts.length){
      box.innerHTML='<div class="examAnalyticsV14"><div class="examA14Head"><div><div class="examA14Title">Prüfungsanalyse</div><div class="examA14Text">Noch keine Prüfung absolviert. Ergebnisse und Entwicklung erscheinen hier automatisch.</div></div><div class="badge">0 Prüfungen</div></div><div class="examA14Actions"><button class="btn primary" id="examA14Start">Prüfungsmodus starten</button></div></div>';
      var start0=byId('examA14Start');if(start0)start0.onclick=function(){if(window.FachteilExamV13&&typeof window.FachteilExamV13.open==='function')window.FachteilExamV13.open();};
      applying=false;return;
    }

    var latest=attempts[0];
    var overallValues=attempts.map(function(a){return clamp(Number(a.pct)||0,0,100);});
    var overallAvg=mean(overallValues);
    var overallTrend=trend(overallValues);
    var passCount=attempts.filter(function(a){return !!a.passed;}).length;
    var passRate=Math.round(passCount/attempts.length*100);
    var hfs={hf1:hfSummary(attempts,'hf1'),hf2:hfSummary(attempts,'hf2'),hf3:hfSummary(attempts,'hf3')};
    var sw=strongestWeakest(hfs);
    var modes={all:modeSummary(attempts,'all'),hf1:modeSummary(attempts,'hf1'),hf2:modeSummary(attempts,'hf2'),hf3:modeSummary(attempts,'hf3')};

    var hfLine='';
    if(sw.strong&&sw.weak){
      hfLine='<div class="examA14HfLine"><span><strong>Stärkstes:</strong> '+hfLabel(sw.strong.key)+' '+roundPct(sw.strong.avg)+'</span><span><strong>Schwächstes:</strong> '+hfLabel(sw.weak.key)+' '+roundPct(sw.weak.avg)+'</span></div>';
    }

    var modeHtml='';
    ['all','hf1','hf2','hf3'].forEach(function(k){var m=modes[k];modeHtml+='<div class="examA14Mode"><div class="examA14ModeTop"><span>'+modeLabel(k)+'</span><strong>'+roundPct(m.avg)+'</strong></div><div class="examA14ModeMeta">'+m.count+' '+(m.count===1?'Versuch':'Versuche')+(m.best!==null?' · Best '+roundPct(m.best):'')+'</div></div>';});

    var hfHtml='';
    ['hf1','hf2','hf3'].forEach(function(k){var h=hfs[k];var tc=h.trend.className;hfHtml+='<div class="examA14Hf"><span>'+hfLabel(k)+' · Ø</span><strong>'+roundPct(h.avg)+'</strong><div class="examA14Trend '+tc+'">'+esc(h.trend.label)+'</div><span>'+h.count+' Auswertungen</span></div>';});

    var historyHtml='';
    attempts.slice(0,10).forEach(function(a){historyHtml+='<div class="examA14HistoryItem"><span>'+dateShort(a.when)+' · '+modeLabel(a.mode)+'<span class="examA14Pass">'+(a.passed?'bestanden*':'nicht bestanden*')+'</span></span><strong>'+Math.round(Number(a.pct)||0)+'%</strong></div>';});

    box.innerHTML='<div class="examAnalyticsV14">'+
      '<div class="examA14Head"><div><div class="examA14Title">Prüfungsanalyse</div><div class="examA14Text">Kompakter Überblick über Ergebnisse und Entwicklung.</div></div><div class="badge">'+attempts.length+' '+(attempts.length===1?'Prüfung':'Prüfungen')+'</div></div>'+
      '<div class="examA14Grid">'+
        '<div class="examA14Metric"><span>Letzte Prüfung</span><strong>'+Math.round(Number(latest.pct)||0)+'%</strong></div>'+
        '<div class="examA14Metric"><span>Durchschnitt</span><strong>'+roundPct(overallAvg)+'</strong></div>'+
        '<div class="examA14Metric"><span>Tendenz</span><strong class="'+overallTrend.className+'">'+esc(overallTrend.label)+'</strong></div>'+
      '</div>'+hfLine+
      '<div class="examA14Actions"><button class="btn primary" id="examA14Start">Neue Prüfung</button></div>'+
      '<details class="examA14Details"><summary>Prüfungsdetails anzeigen</summary><div class="examA14DetailsBody">'+
        '<div><div class="examA14SectionTitle">Prüfungsarten</div><div class="examA14ModeGrid">'+modeHtml+'</div></div>'+
        '<div><div class="examA14SectionTitle">Handlungsfelder</div><div class="examA14HfGrid">'+hfHtml+'</div></div>'+
        '<div><div class="examA14SectionTitle">Letzte Ergebnisse</div><div class="examA14History">'+historyHtml+'</div></div>'+
        '<div class="examA14Note">Bestanden* ist weiterhin nur die interne Trainingswertung ab 50 %. Die Tendenz wird erst ab mindestens vier Ergebnissen berechnet. Gesamt- und Einzelprüfungen werden in der allgemeinen Durchschnittszahl gemeinsam betrachtet; die Detailwerte bleiben getrennt. Aktuelle Bestehensquote: '+passRate+' %.</div>'+
      '</div></details></div>';

    var start=byId('examA14Start');if(start)start.onclick=function(){if(window.FachteilExamV13&&typeof window.FachteilExamV13.open==='function')window.FachteilExamV13.open();};
    applying=false;
  }

  function watch(){
    box=byId('examAnalysisV13');
    if(!box)return;
    render();
    if(typeof MutationObserver==='function'){
      observer=new MutationObserver(function(){if(applying)return;if(!box.querySelector('.examAnalyticsV14'))render();});
      observer.observe(box,{childList:true,subtree:true});
    }else{
      window.setInterval(function(){if(box&&!box.querySelector('.examAnalyticsV14'))render();},1000);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();

  window.FachteilExamAnalysisV14={version:'1.4.0',render:render,getAttempts:loadAttempts};
})();
