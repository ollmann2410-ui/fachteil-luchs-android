(function(){
  'use strict';
  if(window.__FachteilLuchsReadinessV15)return;
  window.__FachteilLuchsReadinessV15=true;

  var EXAM_KEY='fachteil_exam_state_v1';
  var panel=null;
  var observerExam=null;
  var observerLearn=null;
  var rendering=false;

  function byId(id){return document.getElementById(id);}
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function mean(a){if(!a||!a.length)return null;var s=0;for(var i=0;i<a.length;i++)s+=Number(a[i])||0;return s/a.length;}
  function stddev(a){if(!a||a.length<2)return 0;var m=mean(a),s=0;for(var i=0;i<a.length;i++){var d=(Number(a[i])||0)-m;s+=d*d;}return Math.sqrt(s/a.length);}
  function pct(v){return v===null||v===undefined||isNaN(Number(v))?'–':Math.round(Number(v))+'%';}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
  function hfLabel(k){return k==='hf1'?'HF 1':k==='hf2'?'HF 2':k==='hf3'?'HF 3':String(k||'').toUpperCase();}

  function attempts(){
    try{
      if(window.FachteilExamAnalysisV14&&typeof window.FachteilExamAnalysisV14.getAttempts==='function')return window.FachteilExamAnalysisV14.getAttempts();
      var raw=JSON.parse(localStorage.getItem(EXAM_KEY)||'null');
      return raw&&Array.isArray(raw.attempts)?raw.attempts.filter(function(a){return a&&Number(a.total)>0;}).slice(0,50):[];
    }catch(e){return [];}
  }

  function hfExamValues(list,k){
    var out=[];
    list.forEach(function(a){var h=a&&a.hf&&a.hf[k];if(h&&Number(h.total)>0)out.push(clamp(Number(h.pct)||0,0,100));});
    return out;
  }

  function readinessLabel(score){
    if(score<55)return 'Noch nicht stabil';
    if(score<65)return 'Grundlage vorhanden';
    if(score<75)return 'Auf gutem Weg';
    if(score<85)return 'Prüfungsnah';
    return 'Sehr stabil';
  }

  function maturityReady(level){return level==='Aussagekräftig'||level==='Belastbar';}

  function compute(){
    if(typeof aggregateAnalysis!=='function'||typeof analysisCurriculumStats!=='function'||typeof analysisDataMaturity!=='function'||typeof ALL_CARDS==='undefined')return null;
    var overall=aggregateAnalysis(ALL_CARDS),curr=analysisCurriculumStats(),mat=analysisDataMaturity(),list=attempts();
    var full=list.filter(function(a){return a.mode==='all';});
    var hfv={hf1:hfExamValues(list,'hf1'),hf2:hfExamValues(list,'hf2'),hf3:hfExamValues(list,'hf3')};
    var examHf={hf1:mean(hfv.hf1),hf2:mean(hfv.hf2),hf3:mean(hfv.hf3)};

    var criteria={
      learning:maturityReady(mat.level),
      breadth:!!(curr.hf1&&curr.hf2&&curr.hf3&&curr.hf1.assessed>=20&&curr.hf2.assessed>=15&&curr.hf3.assessed>=10),
      exams:list.length>=4,
      full:full.length>=1
    };
    var met=Object.keys(criteria).filter(function(k){return criteria[k];}).length;
    var assessable=met===4;
    var robust=assessable&&mat.level==='Belastbar'&&list.length>=8&&full.length>=2&&hfv.hf1.length>=3&&hfv.hf2.length>=3&&hfv.hf3.length>=3;

    var result={overall:overall,curr:curr,mat:mat,list:list,fullCount:full.length,hfv:hfv,examHf:examHf,criteria:criteria,met:met,assessable:assessable,robust:robust,score:null,label:'Im Aufbau',quality:robust?'Belastbar':assessable?'Aussagekräftig':'Im Aufbau',components:null,weakHf:null};

    var hfCombined={},weak=null;
    ['hf1','hf2','hf3'].forEach(function(k){
      var l=curr[k]&&curr[k].value!==null?Number(curr[k].value):null,e=examHf[k];
      var v=e!==null&&e!==undefined&&l!==null?e*0.6+l*0.4:(e!==null&&e!==undefined?e:l);
      hfCombined[k]=v;
      if(v!==null&&(weak===null||v<weak.value))weak={key:k,value:v};
    });
    result.weakHf=weak;

    if(assessable){
      var recent=list.slice(0,5).map(function(a){return clamp(Number(a.pct)||0,0,100);});
      var fullRecent=full.slice(0,3).map(function(a){return clamp(Number(a.pct)||0,0,100);});
      var recentAvg=mean(recent)||0,fullAvg=mean(fullRecent);
      var examScore=fullAvg===null?recentAvg:(fullAvg*0.65+recentAvg*0.35);
      var learningScore=overall.value===null?0:clamp(Number(overall.value)||0,0,100);
      var breadthScore=clamp(((Number(overall.coverage)||0)-10)/50*100,0,100);
      var balanceVals=['hf1','hf2','hf3'].map(function(k){return hfCombined[k];}).filter(function(v){return v!==null;});
      var balanceScore=balanceVals.length?Math.min.apply(null,balanceVals):0;
      var stabilityScore=clamp(100-stddev(recent)*3,0,100);
      var score=Math.round(examScore*0.40+learningScore*0.25+breadthScore*0.15+balanceScore*0.15+stabilityScore*0.05);
      result.score=clamp(score,0,100);result.label=readinessLabel(result.score);
      result.components={exam:examScore,learning:learningScore,breadth:breadthScore,balance:balanceScore,stability:stabilityScore};
    }
    return result;
  }

  function nextStep(r){
    if(!r.criteria.learning)return 'Mehr unterschiedliche Lernkarten bearbeiten, bis die Lernanalyse aussagekräftig wird.';
    if(!r.criteria.breadth){
      var arr=['hf1','hf2','hf3'].map(function(k){return {k:k,n:r.curr[k]?r.curr[k].assessed:0};}).sort(function(a,b){return a.n-b.n;});
      return 'Lernbreite erhöhen – zuerst '+hfLabel(arr[0].k)+' weiter abdecken.';
    }
    if(!r.criteria.full)return 'Als Nächstes eine Gesamtprüfung absolvieren.';
    if(!r.criteria.exams)return 'Noch '+(4-r.list.length)+' '+((4-r.list.length)===1?'Prüfung':'Prüfungen')+' für eine erste belastbare Tendenz absolvieren.';
    if(r.weakHf)return 'Nächster Fokus: '+hfLabel(r.weakHf.key)+' gezielt trainieren.';
    return 'Lernstand halten und regelmäßig Gesamtprüfungen wiederholen.';
  }

  function checkRow(ok,title,text){return '<div class="readyV15Check '+(ok?'ok':'open')+'"><span class="readyV15CheckIcon">'+(ok?'✓':'○')+'</span><div><strong>'+esc(title)+'</strong><span>'+esc(text)+'</span></div></div>';}

  function injectStyle(){
    if(byId('readiness-v15-styles'))return;
    var s=document.createElement('style');s.id='readiness-v15-styles';s.textContent=`
      .readyV15{padding:14px;margin:0;display:grid;gap:10px;border-color:rgba(121,197,255,.30)}
      .readyV15Head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.readyV15Title{font-size:16px;font-weight:950;letter-spacing:-.02em}.readyV15Text{font-size:9px;color:var(--muted);line-height:1.4;margin-top:3px}
      .readyV15Badge{display:inline-flex;align-items:center;padding:5px 8px;border:1px solid var(--line);border-radius:999px;background:var(--soft);font-size:9px;font-weight:900;white-space:nowrap}
      .readyV15Grid{display:grid;grid-template-columns:1.2fr .9fr .9fr;gap:7px}.readyV15Metric{padding:10px 11px;border:1px solid var(--line);border-radius:13px;background:rgba(127,127,127,.035);min-width:0}.readyV15Metric span{display:block;font-size:8px;color:var(--muted);font-weight:850}.readyV15Metric strong{display:block;font-size:18px;line-height:1.12;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.readyV15Metric.main strong{font-size:19px}
      .readyV15Bar{height:7px;border:1px solid var(--line);border-radius:999px;background:var(--soft);overflow:hidden}.readyV15Bar>span{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--primary),var(--primary2));transition:width .25s ease}
      .readyV15Next{padding:8px 10px;border:1px solid var(--line);border-radius:12px;background:var(--soft);font-size:9px;line-height:1.4}.readyV15Next strong{font-size:9px}
      .readyV15Details{border:1px solid var(--line);border-radius:13px;overflow:hidden;background:rgba(127,127,127,.02)}.readyV15Details>summary{list-style:none;cursor:pointer;padding:10px 11px;font-size:10px;font-weight:900}.readyV15Details>summary::-webkit-details-marker{display:none}.readyV15Body{display:grid;gap:10px;padding:0 10px 10px}
      .readyV15Checks{display:grid;gap:6px}.readyV15Check{display:grid;grid-template-columns:20px 1fr;gap:7px;align-items:start;padding:7px 8px;border:1px solid var(--line);border-radius:10px;background:rgba(127,127,127,.02)}.readyV15CheckIcon{width:19px;height:19px;display:grid;place-items:center;border-radius:6px;border:1px solid var(--line);font-size:9px;font-weight:950}.readyV15Check.ok .readyV15CheckIcon{background:rgba(46,204,113,.11)}.readyV15Check strong{display:block;font-size:9px}.readyV15Check span:not(.readyV15CheckIcon){display:block;font-size:8px;color:var(--muted);line-height:1.35;margin-top:2px}
      .readyV15Parts{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}.readyV15Part{padding:7px 5px;border:1px solid var(--line);border-radius:9px;text-align:center;background:rgba(127,127,127,.02)}.readyV15Part span{display:block;font-size:7px;color:var(--muted)}.readyV15Part strong{display:block;font-size:12px;margin-top:2px}
      .readyV15Note{font-size:8px;line-height:1.45;color:var(--muted);padding:8px 9px;border-left:2px solid var(--primary);background:var(--soft);border-radius:0 9px 9px 0}
      @media(max-width:460px){.readyV15Grid{grid-template-columns:1.15fr .85fr .85fr}.readyV15Metric{padding:9px 7px}.readyV15Metric strong{font-size:16px}.readyV15Metric.main strong{font-size:17px}.readyV15Parts{grid-template-columns:repeat(5,minmax(0,1fr));gap:4px}.readyV15Part strong{font-size:11px}}
    `;document.head.appendChild(s);
  }

  function render(){
    if(rendering)return;var r=compute();if(!r)return;mount();if(!panel)return;rendering=true;injectStyle();
    var scoreText=r.assessable?pct(r.score):'–';
    var bar=r.assessable?r.score:Math.round(r.met/4*100);
    var criteriaHtml='';
    criteriaHtml+=checkRow(r.criteria.learning,'Lerndaten','Mindestens aussagekräftige Lernanalyse. Aktuell: '+r.mat.level+'.');
    criteriaHtml+=checkRow(r.criteria.breadth,'Alle Handlungsfelder','Mindestens 20 Karten in HF 1, 15 in HF 2 und 10 in HF 3 bewertet.');
    criteriaHtml+=checkRow(r.criteria.exams,'Prüfungserfahrung','Mindestens vier abgeschlossene Prüfungen. Aktuell: '+r.list.length+'.');
    criteriaHtml+=checkRow(r.criteria.full,'Gesamtprüfung','Mindestens eine Gesamtprüfung. Aktuell: '+r.fullCount+'.');
    var parts='';if(r.components){
      [['Prüfung',r.components.exam],['Lernen',r.components.learning],['Breite',r.components.breadth],['HF-Balance',r.components.balance],['Stabilität',r.components.stability]].forEach(function(x){parts+='<div class="readyV15Part"><span>'+x[0]+'</span><strong>'+pct(x[1])+'</strong></div>';});
    }
    panel.innerHTML='<div class="readyV15Head"><div><div class="readyV15Title">Prüfungsreife</div><div class="readyV15Text">Vorsichtiger Trainingsindikator aus Lernstand, Abdeckung und Prüfungsverlauf.</div></div><div class="readyV15Badge">Datenbasis · '+esc(r.quality)+'</div></div>'+ 
      '<div class="readyV15Grid"><div class="readyV15Metric main"><span>Status</span><strong>'+esc(r.assessable?r.label:'Im Aufbau')+'</strong></div><div class="readyV15Metric"><span>Reifeindikator</span><strong>'+scoreText+'</strong></div><div class="readyV15Metric"><span>Abdeckung</span><strong>'+pct(r.overall.coverage)+'</strong></div></div>'+ 
      '<div class="readyV15Bar"><span style="width:'+clamp(bar,0,100)+'%"></span></div>'+ 
      '<div class="readyV15Next"><strong>Nächster sinnvoller Schritt:</strong> '+esc(nextStep(r))+'</div>'+ 
      '<details class="readyV15Details"><summary>Prüfungsreife erklären</summary><div class="readyV15Body"><div class="readyV15Checks">'+criteriaHtml+'</div>'+(r.components?'<div><div class="readyV15Text" style="margin-bottom:6px">Zusammensetzung des Reifeindikators</div><div class="readyV15Parts">'+parts+'</div></div>':'')+'<div class="readyV15Note">Der Reifeindikator ist eine interne Lernhilfe und keine offizielle Bestehensprognose. Vor ausreichender Datenbasis wird bewusst kein Prozentwert ausgegeben. Sobald die Mindestbasis erreicht ist, fließen Prüfungsergebnisse (40 %), Lernleistung (25 %), Lernbreite (15 %), HF-Balance (15 %) und Ergebnisstabilität (5 %) ein.</div></div></details>';
    rendering=false;
  }

  function mount(){
    if(panel&&document.body.contains(panel))return true;
    var root=byId('learningAnalysisV12');if(!root)return false;
    panel=byId('readinessV15');if(panel)return true;
    panel=document.createElement('div');panel.id='readinessV15';panel.className='card readyV15';
    var exam=byId('examAnalysisV13'),details=byId('analysisDetailsV122');
    if(exam&&exam.parentNode===root)root.insertBefore(panel,exam);else if(details&&details.parentNode===root)root.insertBefore(panel,details);else root.appendChild(panel);
    return true;
  }

  function watch(){
    if(!mount())return false;render();
    var ex=byId('examAnalysisV13');if(ex&&typeof MutationObserver==='function'&&!observerExam){observerExam=new MutationObserver(function(){window.setTimeout(render,0);});observerExam.observe(ex,{childList:true,subtree:true});}
    var learn=byId('a12OverallScore');if(learn&&typeof MutationObserver==='function'&&!observerLearn){observerLearn=new MutationObserver(function(){window.setTimeout(render,0);});observerLearn.observe(learn,{childList:true,characterData:true,subtree:true});}
    if(!window.__FachteilLuchsReadinessV15Wrapped&&typeof updateHomeStats==='function'){
      window.__FachteilLuchsReadinessV15Wrapped=true;var previousUpdateHomeStats=updateHomeStats;
      updateHomeStats=function(){var out=previousUpdateHomeStats.apply(this,arguments);window.setTimeout(render,0);return out;};
    }
    return true;
  }

  if(!watch()){
    var tries=0,t=window.setInterval(function(){tries++;if(watch()||tries>60)window.clearInterval(t);},50);
  }
  window.addEventListener('storage',function(e){if(e&&e.key&&(e.key===EXAM_KEY||e.key==='fachteil_cards_analysis_v2'))render();});
  window.FachteilReadinessV15={version:'1.5.0',render:render,compute:compute};
})();
