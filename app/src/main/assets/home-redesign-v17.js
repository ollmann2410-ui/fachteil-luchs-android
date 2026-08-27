(function(){
  'use strict';
  if(window.__FachteilLuchsHomeV17)return;
  window.__FachteilLuchsHomeV17=true;

  var home=null,dashboard=null;
  function totalCards(){return (typeof ALL_CARDS!=='undefined'&&ALL_CARDS&&ALL_CARDS.length)?ALL_CARDS.length:520;}
  function areaCardCount(key){try{return (typeof AREAS!=='undefined'&&AREAS[key]&&AREAS[key].cards)?AREAS[key].cards.length:0;}catch(e){return 0;}}
  function byId(id){return document.getElementById(id);}
  function q(sel,root){return (root||document).querySelector(sel);}
  function safe(fn){try{return fn();}catch(e){return null;}}

  function injectStyle(){
    if(byId('home-v17-styles'))return;
    var s=document.createElement('style');
    s.id='home-v17-styles';
    s.textContent=`
      /* --- V1.7: ruhige Startseite + separate Einstellungsansichten --- */
      .v17Dashboard{display:grid;gap:15px}
      .v17Overview{padding:14px 15px;display:grid;gap:9px}
      .v17OverviewTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      .v17Eyebrow{font-size:9px;letter-spacing:.08em;text-transform:uppercase;font-weight:950;color:var(--muted)}
      .v17OverviewTitle{font-size:17px;font-weight:950;letter-spacing:-.02em;margin-top:2px}
      .v17OverviewMeta{font-size:10px;line-height:1.4;color:var(--muted);margin-top:3px}
      .v17OverviewBadges{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end;max-width:190px}
      .v17OverviewBadges .badge{font-size:8px;padding:5px 7px}
      .v17Progress{height:6px;border-radius:999px;overflow:hidden;border:1px solid var(--line);background:var(--soft)}
      .v17Progress>span{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--primary),var(--primary2));transition:width .2s ease}

      .v17Group{display:grid;gap:8px}
      .v17GroupHead{display:flex;align-items:end;justify-content:space-between;gap:10px;padding:0 2px}
      .v17GroupTitle{font-size:12px;font-weight:950;letter-spacing:.01em}
      .v17GroupHint{font-size:8px;color:var(--muted);text-align:right}

      .v17AreaGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
      .v17Area{appearance:none;text-align:left;color:var(--text);padding:12px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01)),var(--card);box-shadow:0 7px 18px rgba(0,0,0,.08);cursor:pointer;min-width:0}
      .v17Area:hover{border-color:rgba(121,197,255,.52);transform:translateY(-1px)}
      .v17AreaCode{width:35px;height:35px;display:grid;place-items:center;border-radius:11px;background:var(--soft);border:1px solid rgba(121,197,255,.28);font-size:10px;font-weight:950;color:var(--primary)}
      .v17AreaCode svg{width:22px;height:22px;stroke-width:1.9}
      .v17Area strong{display:block;font-size:13px;margin-top:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .v17Area span{display:block;font-size:8px;color:var(--muted);margin-top:2px;line-height:1.3}

      .v17ActionGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
      .v17ActionGrid.two{grid-template-columns:repeat(2,minmax(0,1fr))}
      .v17Action{appearance:none;width:100%;color:var(--text);text-align:left;display:grid;grid-template-columns:40px 1fr auto;gap:9px;align-items:center;padding:11px 12px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01)),var(--card);box-shadow:0 7px 18px rgba(0,0,0,.08);cursor:pointer;min-width:0}
      .v17Action:hover{border-color:rgba(121,197,255,.52);transform:translateY(-1px)}
      .v17ActionIcon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;border:1px solid rgba(121,197,255,.25);background:var(--soft);font-size:18px}
      .v17ActionTitle{display:block;font-size:12px;font-weight:950;line-height:1.2}
      .v17ActionText{display:block;font-size:8.5px;line-height:1.35;color:var(--muted);margin-top:3px}
      .v17ActionArrow{font-size:17px;color:var(--muted);font-weight:900}
      .v17Action.exam{border-color:rgba(121,197,255,.30);background:linear-gradient(135deg,rgba(50,158,255,.11),rgba(121,197,255,.035)),var(--card)}
      .v18SmartAction{border-color:rgba(121,197,255,.34);background:linear-gradient(135deg,rgba(50,158,255,.14),rgba(121,197,255,.035)),var(--card)}
      .v18SmartAction .v17ActionIcon{box-shadow:0 0 0 1px rgba(121,197,255,.08),0 8px 20px rgba(50,158,255,.10)}
      .v17ExamCard{padding:0;overflow:hidden}
      .v17ExamCard .v17Action{border:0;border-radius:0;box-shadow:none}
      .v17ResumeRow{display:flex;padding:0 11px 10px}
      .v17ResumeRow .btn{min-height:31px;padding:5px 8px;font-size:8.5px;box-shadow:none}
      .v17ResumeRow.hidden{display:none!important}

      .v17Utility{display:flex;justify-content:center;padding-top:0}
      .v17Utility .btn{min-height:34px;padding:6px 10px;font-size:9px;background:transparent;box-shadow:none;color:var(--muted)}

      #home.v17Home>.homeSearchCard,#home.v17Home>.quizHome,#home.v17Home>.randomLearnHome,#home.v17Home>.errorPoolHome,#home.v17Home>#tiles,#home.v17Home>#openStats,#home.v17Home>#examHomeV13{display:none!important}
      #home.v17Home.v17Setup>.v17Dashboard{display:none!important}
      #home.v17Home.v17Setup[data-v17-setup="knowledge"]>.homeSearchCard,
      #home.v17Home.v17Setup[data-v17-setup="quiz"]>.quizHome,
      #home.v17Home.v17Setup[data-v17-setup="random"]>.randomLearnHome{display:block!important;margin-bottom:0;animation:fade .18s ease}

      #home.v17Home.v17Setup>.homeSearchCard,#home.v17Home.v17Setup>.quizHome,#home.v17Home.v17Setup>.randomLearnHome{padding:17px}
      #home.v17Home.v17Setup .homeSearchTitle,#home.v17Home.v17Setup .quizHomeTitle,#home.v17Home.v17Setup .randomLearnTitle{font-size:20px}
      #home.v17Home.v17Setup .homeSearchText,#home.v17Home.v17Setup .quizHomeText,#home.v17Home.v17Setup .randomLearnText{font-size:11px}
      .v17SetupLabel{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:0 0 12px;padding-bottom:10px;border-bottom:1px solid var(--line)}
      .v17SetupLabel strong{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
      .v17SetupLabel span{font-size:8px;color:var(--muted)}
      .v17QuickTags{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}
      .v17QuickTag{border:1px solid var(--line);background:var(--soft);color:var(--text);padding:6px 8px;border-radius:999px;cursor:pointer;font-size:8.5px;font-weight:850}
      .v17QuickTag:hover{border-color:rgba(121,197,255,.55)}

      @media(max-width:700px){
        .v17AreaGrid{grid-template-columns:repeat(2,minmax(0,1fr))}
        .v17ActionGrid,.v17ActionGrid.two{grid-template-columns:1fr}
        .v17OverviewBadges{max-width:120px}
      }
      @media(max-width:390px){
        .v17Overview{padding:12px}.v17Area{padding:10px}.v17Action{padding:10px 11px}.v17ActionText{font-size:8px}
      }
    `;
    document.head.appendChild(s);
  }

  function makeButton(cls,icon,title,text,fn,label){
    var b=document.createElement('button');b.type='button';b.className=cls;b.setAttribute('aria-label',label||title);
    b.innerHTML='<span class="v17ActionIcon" aria-hidden="true">'+icon+'</span><span><span class="v17ActionTitle">'+title+'</span><span class="v17ActionText">'+text+'</span></span><span class="v17ActionArrow">›</span>';
    b.onclick=fn;return b;
  }

  function showSetup(kind){
    if(!home)return;
    home.classList.add('v17Setup');home.setAttribute('data-v17-setup',kind);
    var hb=byId('homeBtn');if(hb)hb.classList.remove('hidden');
    if(kind==='knowledge')setTimeout(function(){var i=byId('globalSearch');if(i)i.focus();},60);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function showDashboard(){
    if(!home)return;
    home.classList.remove('v17Setup');home.removeAttribute('data-v17-setup');
    var input=byId('globalSearch');if(input&&input.value){input.value='';if(typeof renderGlobalSearch==='function')renderGlobalSearch();}
    var hb=byId('homeBtn');if(hb&&!home.classList.contains('hidden'))hb.classList.add('hidden');
    syncProgress();syncExam();window.scrollTo({top:0,behavior:'smooth'});
  }

  function addSetupLabel(panel,title,text){
    if(!panel||q('.v17SetupLabel',panel))return;
    var d=document.createElement('div');d.className='v17SetupLabel';d.innerHTML='<strong>'+title+'</strong><span>'+text+'</span>';panel.insertBefore(d,panel.firstChild);
  }

  function setupExistingPanels(){
    var search=q('.homeSearchCard',home),quiz=q('.quizHome',home),random=q('.randomLearnHome',home);
    if(search){
      addSetupLabel(search,'Wissensdatenbank','Alle '+totalCards()+' Karten');
      var title=q('.homeSearchTitle',search),txt=q('.homeSearchText',search),input=byId('globalSearch');
      if(title)title.textContent='Wissen gezielt nachschlagen';
      if(txt)txt.textContent='Durchsuche HF 1, HF 2, HF 3 und Aufmaß gleichzeitig. Frage und Antwort werden vollständig berücksichtigt.';
      if(input)input.placeholder='Begriff, Thema oder Schlagwort suchen …';
      var badge=byId('globalSearchBadge');if(badge)badge.textContent='Alle Bereiche';
      if(!q('.v17QuickTags',search)){
        var tags=document.createElement('div');tags.className='v17QuickTags';
        ['Untergrund','Metall','Korrosion','Beschichtung','Bindemittel','Aufmaß'].forEach(function(term){var b=document.createElement('button');b.type='button';b.className='v17QuickTag';b.textContent=term;b.onclick=function(){if(!input)return;input.value=term;if(typeof renderGlobalSearch==='function')renderGlobalSearch();input.focus();};tags.appendChild(b);});
        var wrap=q('.searchWrap',search);if(wrap&&wrap.parentNode)wrap.parentNode.insertBefore(tags,wrap.nextSibling);
      }
    }
    if(quiz)addSetupLabel(quiz,'Quiz-Einstellungen','30 Karten');
    if(random)addSetupLabel(random,'Zufallslernen-Einstellungen','20 Karten');
  }

  function createDashboard(){
    if(byId('v17Dashboard')){dashboard=byId('v17Dashboard');return;}
    dashboard=document.createElement('div');dashboard.id='v17Dashboard';dashboard.className='v17Dashboard';

    var overview=document.createElement('div');overview.className='card v17Overview';overview.innerHTML='<div class="v17OverviewTop"><div><div class="v17Eyebrow">Dein Lernstand</div><div class="v17OverviewTitle" id="v17ProgressTitle">0 von '+totalCards()+' Karten bearbeitet</div><div class="v17OverviewMeta">Was möchtest du jetzt machen?</div></div><div class="v17OverviewBadges"><span class="badge" id="v17ErrorBadge">Fehlerpool 0</span><span class="badge" id="v17QuizBadge">Quiz –</span></div></div><div class="v17Progress"><span id="v17ProgressBar"></span></div>';
    dashboard.appendChild(overview);

    var areas=document.createElement('section');areas.className='v17Group';areas.innerHTML='<div class="v17GroupHead"><div class="v17GroupTitle">Lernbereiche</div><div class="v17GroupHint">Direkt lernen</div></div>';
    var areaGrid=document.createElement('div');areaGrid.className='v17AreaGrid';
    [
      ['hf1','HF 1',areaCardCount('hf1')+' Karten','Technik & Gestaltung'],['hf2','HF 2',areaCardCount('hf2')+' Karten','Auftragsabwicklung'],['hf3','HF 3',areaCardCount('hf3')+' Karten','Betriebsführung'],['aufmass','Aufmaß',areaCardCount('aufmass')+' Karten','Aufmaß & Abrechnung']
    ].forEach(function(x){var b=document.createElement('button');b.type='button';b.className='v17Area';var fallback=(x[0]==='aufmass'?'AM':x[1].replace(' ',''));var areaIcon=(typeof iconSvg==='function'?iconSvg(x[0]):fallback);b.innerHTML='<span class="v17AreaCode" aria-hidden="true">'+areaIcon+'</span><strong>'+x[1]+'</strong><span>'+x[2]+' · '+x[3]+'</span>';b.onclick=function(){if(typeof openArea==='function')openArea(x[0]);};areaGrid.appendChild(b);});
    areas.appendChild(areaGrid);dashboard.appendChild(areas);

    var train=document.createElement('section');train.className='v17Group';train.innerHTML='<div class="v17GroupHead"><div class="v17GroupTitle">Trainieren</div><div class="v17GroupHint">Modus wählen</div></div>';
    var tg=document.createElement('div');tg.className='v17ActionGrid two';
    var smartBtn=makeButton('v17Action v18SmartAction','⚡','Intelligentes Lernen','20 Karten automatisch passend zu deinem Lernstand.',function(){if(window.FachteilSmartV18&&typeof window.FachteilSmartV18.start==='function')window.FachteilSmartV18.start();});smartBtn.id='v18SmartStart';tg.appendChild(smartBtn);
    tg.appendChild(makeButton('v17Action','🎲','20 Karten zufällig','Bereiche auswählen und frei lernen.',function(){showSetup('random');}));
    tg.appendChild(makeButton('v17Action','🧠','30-Karten-Quiz','Zeitlimit und Quiz-Art auswählen.',function(){showSetup('quiz');}));
    tg.appendChild(makeButton('v17Action','⚠️','Fehlerpool','Unsichere und falsche Karten wiederholen.',function(){if(typeof openErrorPool==='function')openErrorPool();}));
    train.appendChild(tg);dashboard.appendChild(train);

    var exam=document.createElement('section');exam.className='v17Group';exam.innerHTML='<div class="v17GroupHead"><div class="v17GroupTitle">Prüfung</div><div class="v17GroupHint">Gesamt oder einzelnes HF</div></div>';
    var examCard=document.createElement('div');examCard.className='card v17ExamCard';
    examCard.appendChild(makeButton('v17Action exam','📝','Prüfungsmodus','Prüfungsart und Zeitlimit auf der nächsten Seite festlegen.',function(){if(window.FachteilExamV13&&typeof window.FachteilExamV13.open==='function')window.FachteilExamV13.open();}));
    var rr=document.createElement('div');rr.id='v17ResumeRow';rr.className='v17ResumeRow hidden';rr.innerHTML='<button type="button" class="btn" id="v17ExamResume">Laufende Prüfung fortsetzen</button>';examCard.appendChild(rr);exam.appendChild(examCard);dashboard.appendChild(exam);
    q('#v17ExamResume',examCard).onclick=function(){if(window.FachteilExamV13&&typeof window.FachteilExamV13.resume==='function')window.FachteilExamV13.resume();};

    var wa=document.createElement('section');wa.className='v17Group';wa.innerHTML='<div class="v17GroupHead"><div class="v17GroupTitle">Wissen & Auswertung</div><div class="v17GroupHint">Nachschlagen & analysieren</div></div>';
    var wg=document.createElement('div');wg.className='v17ActionGrid two';
    wg.appendChild(makeButton('v17Action','🔎','Wissensdatenbank','Alle '+totalCards()+' Karten nach Begriffen und Themen durchsuchen.',function(){showSetup('knowledge');}));
    wg.appendChild(makeButton('v17Action','📊','Statistik','Lernstand, Prüfungsreife und Prüfungsanalyse ansehen.',function(){if(typeof openStats==='function')openStats();}));
    wa.appendChild(wg);dashboard.appendChild(wa);

    var util=document.createElement('div');util.className='v17Utility';util.innerHTML='<button type="button" class="btn" id="v17DataBtn">⚙ Daten & Lernstand verwalten</button>';dashboard.appendChild(util);
    q('#v17DataBtn',util).onclick=function(){if(typeof openStats==='function')openStats();setTimeout(function(){var d=byId('analysisDetailsV122');if(d)d.open=true;var b=q('.backupPanel');if(b)b.scrollIntoView({behavior:'smooth',block:'start'});},100);};

    home.insertBefore(dashboard,home.firstChild);
  }

  function syncProgress(){
    if(!dashboard)return;
    var learned=parseInt((byId('statsLearned')&&byId('statsLearned').textContent)||'0',10)||0;
    var total=totalCards();
    var errors=parseInt((byId('statsErrors')&&byId('statsErrors').textContent)||'0',10)||0;
    var last=(byId('statsLastQuiz')&&byId('statsLastQuiz').textContent)||'–';
    if(byId('v17ProgressTitle'))byId('v17ProgressTitle').textContent=learned+' von '+total+' Karten bearbeitet';
    if(byId('v17ProgressBar'))byId('v17ProgressBar').style.width=(total?Math.round(learned/total*100):0)+'%';
    if(byId('v17ErrorBadge'))byId('v17ErrorBadge').textContent='Fehlerpool '+errors;
    if(byId('v17QuizBadge'))byId('v17QuizBadge').textContent='Quiz '+last;
  }

  function syncExam(){
    var row=byId('v17ResumeRow'),btn=byId('v17ExamResume');if(!row||!btn)return;
    var state=safe(function(){return window.FachteilExamV13&&typeof window.FachteilExamV13.getState==='function'?window.FachteilExamV13.getState():null;});
    var active=state&&state.active;row.classList.toggle('hidden',!active);
    if(active){var items=Array.isArray(active.items)?active.items:[],answered=items.filter(function(x){return x&&x.chosenIndex!==null&&x.chosenIndex!==undefined;}).length;btn.textContent='Laufende Prüfung fortsetzen'+(items.length?' · '+answered+'/'+items.length:'');}
  }

  function observeData(){
    ['statsLearned','statsTotal','statsErrors','statsLastQuiz'].forEach(function(id){var el=byId(id);if(el)new MutationObserver(syncProgress).observe(el,{childList:true,characterData:true,subtree:true});});
    var nativeResume=byId('examResumeBtn');if(nativeResume)new MutationObserver(syncExam).observe(nativeResume,{attributes:true,childList:true,characterData:true,subtree:true});
  }

  function patchNavigation(){
    var hb=byId('homeBtn');if(hb){
      var previous=hb.onclick;
      hb.onclick=function(ev){
        if(home&&!home.classList.contains('hidden')&&home.classList.contains('v17Setup')){showDashboard();return;}
        var out=typeof previous==='function'?previous.call(this,ev):null;
        setTimeout(function(){if(home&&!home.classList.contains('hidden'))showDashboard();},0);return out;
      };
    }
    if(home){
      new MutationObserver(function(mutations){
        var becameVisible=mutations.some(function(m){return m.attributeName==='class'&&String(m.oldValue||'').split(/\s+/).indexOf('hidden')>=0&&!home.classList.contains('hidden');});
        if(becameVisible)showDashboard();
      }).observe(home,{attributes:true,attributeFilter:['class'],attributeOldValue:true});
    }
  }

  function init(){
    home=byId('home');if(!home)return;
    injectStyle();home.classList.add('v17Home');setupExistingPanels();createDashboard();observeData();patchNavigation();syncProgress();syncExam();showDashboard();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


/* --- V1.8: Intelligentes Lernen --- */
(function(){
  'use strict';
  if(window.FachteilSmartV18)return;

  var SMART_KEY='fachteil_smart_v18_session';
  var SMART_VERSION=1;
  var SESSION_SIZE=20;
  var smartCards=[];
  var session=null;
  var baseSourceCards=sourceCards;
  var baseCurrentLearningSource=currentLearningSource;
  var baseRenderCard=renderCard;
  var baseRenderEmptyCard=renderEmptyCard;
  var baseRenderResults=renderResults;
  var baseMarkKnown=markKnown;
  var baseMarkUnsure=markUnsure;
  var baseMarkUnknown=markUnknown;

  function now(){return Date.now();}
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function safeNumber(n,fallback){n=Number(n);return Number.isFinite(n)?n:(fallback||0);}
  function allCards(){return Array.isArray(ALL_CARDS)?ALL_CARDS:Object.values(AREAS).flatMap(function(a){return a.cards||[];});}
  function keyOf(c){return cardKey(c);}
  function analysisOf(c){var k=keyOf(c);return analysisState&&analysisState.cards&&analysisState.cards[k]?analysisState.cards[k]:null;}
  function studyOf(c){var k=keyOf(c);return studyState&&studyState.cards&&studyState.cards[k]?studyState.cards[k]:null;}
  function errorOf(c){return errorInfo(c);}

  function areaStats(){
    var out={};
    Object.keys(AREAS).forEach(function(k){out[k]={assessed:0,score:0,weakness:.5};});
    allCards().forEach(function(c){
      var e=analysisOf(c);if(!e||!e.assessmentCount)return;
      var a=out[c._area]||out.hf1, n=safeNumber(e.assessmentCount);
      a.assessed+=n;a.score+=safeNumber(e.knownCount)+.5*safeNumber(e.unsureCount);
    });
    Object.keys(out).forEach(function(k){
      var a=out[k];
      // Kleine Datenmengen werden bewusst Richtung 50 % geglättet.
      var blended=(a.score+2.5)/(a.assessed+5);
      a.weakness=clamp(1-blended,0,1);
    });
    return out;
  }

  function categoryOf(c){
    var er=errorOf(c),an=analysisOf(c);
    if(er&&er.level==='wrong')return 'urgent';
    if(er&&er.level==='unsure')return 'weak';
    if(!an||safeNumber(an.assessmentCount)===0)return 'new';
    var n=Math.max(1,safeNumber(an.assessmentCount));
    var trouble=(safeNumber(an.wrongCount)+.5*safeNumber(an.unsureCount))/n;
    if(an.lastOutcome==='wrong'||an.lastOutcome==='open'||an.lastOutcome==='unsure'||trouble>=.35)return 'weak';
    return 'due';
  }

  function priorityOf(c,stats){
    var an=analysisOf(c),st=studyOf(c),er=errorOf(c),score=18;
    var area=(stats&&stats[c._area])||{weakness:.5};
    score+=area.weakness*22;

    if(er){
      if(er.level==='wrong')score+=82+Math.min(5,safeNumber(er.wrong))*8;
      else score+=52+Math.min(4,safeNumber(er.unsure))*5;
      score-=Math.min(2,safeNumber(er.knownStreak))*8;
    }

    if(!an||safeNumber(an.assessmentCount)===0){
      score+=48;
      if(!an||!an.lastSeenAt)score+=8;
    }else{
      var n=Math.max(1,safeNumber(an.assessmentCount));
      var trouble=(safeNumber(an.wrongCount)+.5*safeNumber(an.unsureCount))/n;
      score+=trouble*48;
      score-=Math.min(2,safeNumber(an.knownStreak))*12;
      if(an.lastOutcome==='wrong'||an.lastOutcome==='open')score+=24;
      else if(an.lastOutcome==='unsure')score+=14;
      else if(an.lastOutcome==='known'||an.lastOutcome==='correct')score-=7;

      var last=safeNumber(an.lastAssessedAt)||safeNumber(an.lastSeenAt)||0;
      if(last){
        var ageDays=Math.max(0,(now()-last)/86400000);
        score+=Math.min(30,ageDays*2.4);
        if(ageDays<.25&&(an.lastOutcome==='known'||an.lastOutcome==='correct'))score-=26;
      }
      var hist=Array.isArray(an.recentHistory)?an.recentHistory:[];
      if(hist.length>=2){
        var h=hist.slice(-2);
        if(h.every(function(x){return x&&safeNumber(x.score)>=.99;}))score-=10;
      }
    }

    if(st){
      var sn=Math.max(1,safeNumber(st.known)+safeNumber(st.unsure)+safeNumber(st.wrong));
      var studyTrouble=(safeNumber(st.wrong)+.5*safeNumber(st.unsure))/sn;
      score+=studyTrouble*12;
    }
    return Math.round(score*10)/10;
  }

  function rankedBuckets(){
    var stats=areaStats(),b={urgent:[],weak:[],new:[],due:[]};
    allCards().forEach(function(c){
      b[categoryOf(c)].push({card:c,score:priorityOf(c,stats)});
    });
    Object.keys(b).forEach(function(k){b[k].sort(function(a,z){return z.score-a.score;});});
    return {stats:stats,buckets:b};
  }

  function chooseDiverse(items,count,selectedKeys,areaCounts){
    var out=[],available=items.slice();
    while(out.length<count&&available.length){
      var bestIndex=0,best=-Infinity;
      available.forEach(function(it,i){
        if(selectedKeys.has(keyOf(it.card)))return;
        var diversity=(areaCounts[it.card._area]||0)*5.5;
        var jitter=Math.random()*4;
        var adjusted=it.score-diversity+jitter;
        if(adjusted>best){best=adjusted;bestIndex=i;}
      });
      var item=available.splice(bestIndex,1)[0],k=keyOf(item.card);
      if(selectedKeys.has(k))continue;
      selectedKeys.add(k);areaCounts[item.card._area]=(areaCounts[item.card._area]||0)+1;out.push(item);
    }
    return out;
  }

  function buildPlan(){
    var data=rankedBuckets(),b=data.buckets,selected=new Set(),areas={},picked={urgent:[],weak:[],new:[],due:[]};
    var quotas={urgent:7,weak:5,new:5,due:3};
    ['urgent','weak','new','due'].forEach(function(cat){picked[cat]=chooseDiverse(b[cat],quotas[cat],selected,areas);});
    var total=Object.keys(AREAS).length?Math.min(SESSION_SIZE,allCards().length):0;
    if(selected.size<total){
      // Fehlende Kategorien werden zuerst sinnvoll ersetzt. Dadurch besteht eine Runde
      // nicht fast nur aus Fehlerkarten, wenn z. B. noch keine fälligen Wiederholungen existieren.
      var caps={urgent:10,weak:8,new:10,due:8},fallbackOrder=['new','weak','due','urgent'],progress=true;
      while(selected.size<total&&progress){
        progress=false;
        fallbackOrder.forEach(function(cat){
          if(selected.size>=total||picked[cat].length>=caps[cat])return;
          var one=chooseDiverse(b[cat],1,selected,areas);
          if(one.length){picked[cat].push(one[0]);progress=true;}
        });
      }
      // Nur wenn es wirklich keine Alternative gibt, darf eine Kategorie ihre Kappe überschreiten.
      if(selected.size<total){
        var rest=[];Object.keys(b).forEach(function(cat){b[cat].forEach(function(x){if(!selected.has(keyOf(x.card)))rest.push(x);});});
        rest.sort(function(a,z){return z.score-a.score;});
        var fill=chooseDiverse(rest,total-selected.size,selected,areas);
        fill.forEach(function(x){picked[categoryOf(x.card)].push(x);});
      }
    }

    // Kategorien mischen: schwere Karten, neue Karten und Wiederholungen wechseln sich ab.
    var queues={urgent:picked.urgent.slice(),new:picked.new.slice(),weak:picked.weak.slice(),due:picked.due.slice()};
    var order=['urgent','new','weak','due','urgent','weak','new','due'];
    var final=[];
    while(final.length<total){
      var added=false;
      order.forEach(function(cat){if(final.length<total&&queues[cat].length){final.push(queues[cat].shift());added=true;}});
      if(!added)break;
    }
    return final.map(function(x){return {key:keyOf(x.card),category:categoryOf(x.card),score:x.score,area:x.card._area};});
  }

  function snapshotCard(c){
    var an=analysisOf(c),er=errorOf(c);
    return {category:categoryOf(c),hadError:!!er,assessmentCount:an?safeNumber(an.assessmentCount):0,lastOutcome:an&&an.lastOutcome?String(an.lastOutcome):null};
  }

  function validSession(s){
    if(!s||s.version!==SMART_VERSION||!Array.isArray(s.cards)||!s.cards.length||!s.assessed||typeof s.assessed!=='object')return false;
    return s.cards.every(function(k){return CARD_BY_KEY.has(k);});
  }
  function loadSession(){
    try{
      var s=JSON.parse(localStorage.getItem(SMART_KEY)||'null');if(!validSession(s))return null;
      // Ein vollständiger Lernstand-Reset soll keine alte intelligente Runde wiederbeleben.
      var rated=Object.keys(s.assessed||{}).length,studyCards=studyState&&studyState.cards?Object.keys(studyState.cards).length:0,analysisCards=analysisState&&analysisState.cards?Object.keys(analysisState.cards).length:0;
      if(rated&&studyCards===0&&analysisCards===0){localStorage.removeItem(SMART_KEY);return null;}
      return s;
    }catch(e){return null;}
  }
  function saveSession(){try{if(session)localStorage.setItem(SMART_KEY,JSON.stringify(session));}catch(e){}updateStartButton();}
  function assessedCount(){return session?Object.keys(session.assessed||{}).length:0;}
  function completed(){return !!(session&&session.completedAt);}

  function createSession(){
    var plan=buildPlan(),cards=plan.map(function(x){return x.key;}),pre={};
    cards.forEach(function(k){var c=CARD_BY_KEY.get(k);pre[k]=snapshotCard(c);});
    session={version:SMART_VERSION,startedAt:now(),completedAt:null,cards:cards,plan:plan,pre:pre,assessed:{}};
    saveSession();return session;
  }

  function getSessionCards(){
    if(!session)return [];
    return session.cards.map(function(k){return CARD_BY_KEY.get(k);}).filter(Boolean);
  }

  function smartIcon(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-8 12h6l-1 8 9-13h-6V2Z"/></svg>';
  }

  function priorityLabel(c){
    if(!session)return 'Intelligente Auswahl';
    var k=keyOf(c),p=(session.plan||[]).find(function(x){return x.key===k;});
    if(!p)return 'Intelligente Auswahl';
    if(p.category==='urgent')return 'Hohe Priorität';
    if(p.category==='weak')return 'Schwachstelle';
    if(p.category==='new')return 'Neue Karte';
    return 'Wiederholung';
  }

  function start(forceNew){
    closeSummary();
    session=loadSession();
    if(forceNew||!session||completed()||assessedCount()>=session.cards.length)session=createSession();
    smartCards=getSessionCards();
    if(!smartCards.length){session=createSession();smartCards=getSessionCards();}
    currentMode='smart';pool=smartCards.slice();revealed=false;chipsVisible=false;
    var first=0;
    for(var i=0;i<pool.length;i++){if(!session.assessed[keyOf(pool[i])]){first=i;break;}}
    pos=first;
    showLibrary();
    if($('areaIcon'))$('areaIcon').innerHTML=smartIcon();
    if($('areaTitle'))$('areaTitle').textContent='Intelligentes Lernen';
    if($('areaSub'))$('areaSub').textContent=pool.length+' Karten · automatisch aus Fehlern, Schwachstellen, neuen Karten und fälligen Wiederholungen';
    if($('search')){$('search').placeholder='In dieser intelligenten Runde suchen …';$('search').value='';}
    if($('chipToggleBtn')&&$('chipToggleBtn').parentElement)$('chipToggleBtn').parentElement.classList.add('hidden');
    if($('chips'))$('chips').classList.add('hidden');
    applySearch(false);
    updateStartButton();
  }

  function updateStartButton(){
    var b=document.getElementById('v18SmartStart');if(!b)return;
    var text=b.querySelector('.v17ActionText'),s=loadSession();
    if(!text)return;
    if(s&&!s.completedAt&&Object.keys(s.assessed||{}).length<s.cards.length){
      text.textContent='Laufende Runde fortsetzen · '+Object.keys(s.assessed||{}).length+'/'+s.cards.length+' bewertet.';
    }else text.textContent='20 Karten automatisch passend zu deinem Lernstand.';
  }

  function afterAssessment(c,outcome){
    if(currentMode!=='smart'||!session||!c)return;
    var k=keyOf(c),wasNew=!session.assessed[k];
    session.assessed[k]={outcome:outcome,at:now()};
    if(wasNew)saveSession();else saveSession();
    if(assessedCount()>=session.cards.length){
      session.completedAt=now();saveSession();setTimeout(showSummary,180);return;
    }
    // Nach der Bewertung automatisch zur nächsten noch offenen Karte springen.
    if(wasNew){
      setTimeout(function(){
        if(currentMode!=='smart'||!session)return;
        var next=-1;
        for(var off=1;off<=pool.length;off++){
          var idx=(pos+off)%pool.length,cand=pool[idx];
          if(cand&&!session.assessed[keyOf(cand)]){next=idx;break;}
        }
        if(next>=0){pos=next;revealed=false;if($('knowledgeHint'))$('knowledgeHint').textContent='';renderCard();renderResults(normalize($('search').value.trim()));}
      },240);
    }
  }

  function summaryData(){
    var d={known:0,unsure:0,wrong:0,newCards:0,errorCards:0,improved:0};
    if(!session)return d;
    Object.keys(session.assessed||{}).forEach(function(k){
      var o=session.assessed[k].outcome;if(o==='known')d.known++;else if(o==='unsure')d.unsure++;else d.wrong++;
      var pre=session.pre&&session.pre[k];if(pre){if(pre.assessmentCount===0)d.newCards++;if(pre.hadError)d.errorCards++;if(pre.hadError&&o==='known')d.improved++;}
    });
    return d;
  }

  function injectSummaryStyle(){
    if(document.getElementById('v18-smart-style'))return;
    var st=document.createElement('style');st.id='v18-smart-style';st.textContent='\n#v18SmartSummary{position:fixed;inset:0;z-index:9999;background:rgba(0,5,15,.72);backdrop-filter:blur(6px);display:grid;place-items:center;padding:18px}.v18SummaryCard{width:min(520px,100%);padding:20px;border:1px solid var(--line);border-radius:22px;background:var(--card);box-shadow:var(--shadow)}.v18SummaryTitle{font-size:22px;font-weight:950;letter-spacing:-.02em}.v18SummaryText{font-size:11px;color:var(--muted);line-height:1.5;margin-top:5px}.v18SummaryGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:15px}.v18SummaryBox{padding:11px;border:1px solid var(--line);border-radius:14px;background:var(--soft);text-align:center}.v18SummaryBox strong{display:block;font-size:20px}.v18SummaryBox span{font-size:9px;color:var(--muted);font-weight:800}.v18SummaryMeta{margin-top:12px;padding:10px 12px;border:1px solid var(--line);border-radius:14px;color:var(--muted);font-size:10px;line-height:1.5}.v18SummaryActions{display:flex;gap:8px;margin-top:15px}.v18SummaryActions .btn{flex:1}@media(max-width:420px){.v18SummaryGrid{grid-template-columns:1fr 1fr}.v18SummaryActions{flex-direction:column}}';document.head.appendChild(st);
  }

  function closeSummary(){var old=document.getElementById('v18SmartSummary');if(old)old.remove();}
  function showSummary(){
    closeSummary();injectSummaryStyle();var d=summaryData(),wrap=document.createElement('div');wrap.id='v18SmartSummary';
    wrap.innerHTML='<div class="v18SummaryCard"><div class="v18SummaryTitle">Runde abgeschlossen ⚡</div><div class="v18SummaryText">Deine intelligente 20-Karten-Runde ist ausgewertet.</div><div class="v18SummaryGrid"><div class="v18SummaryBox"><strong>'+d.known+'</strong><span>GEWUSST</span></div><div class="v18SummaryBox"><strong>'+d.unsure+'</strong><span>UNSICHER</span></div><div class="v18SummaryBox"><strong>'+d.wrong+'</strong><span>NICHT GEWUSST</span></div></div><div class="v18SummaryMeta">'+d.improved+' Fehlerkarten verbessert · '+d.newCards+' neue Karten bearbeitet · '+d.errorCards+' Karten aus deinem Fehlerpool trainiert.</div><div class="v18SummaryActions"><button class="btn" id="v18SmartHome">Zur Startseite</button><button class="btn primary" id="v18SmartAgain">Neue intelligente Runde</button></div></div>';
    document.body.appendChild(wrap);
    document.getElementById('v18SmartHome').onclick=function(){closeSummary();goHome();updateStartButton();};
    document.getElementById('v18SmartAgain').onclick=function(){start(true);};
  }

  // Die Kernfunktionen bleiben für alle bestehenden Modi unverändert; nur smart wird ergänzt.
  sourceCards=function(){if(currentMode==='smart')return smartCards;return baseSourceCards();};
  currentLearningSource=function(){if(currentMode==='smart')return 'intelligent';return baseCurrentLearningSource();};


  renderEmptyCard=function(){
    baseRenderEmptyCard();
    if(currentMode!=='smart')return;
    if($('cardMeta'))$('cardMeta').textContent='Intelligentes Lernen';
    if($('tapHint'))$('tapHint').textContent='Kein Treffer in dieser 20-Karten-Runde. Suche löschen oder einen anderen Begriff versuchen.';
  };

  renderCard=function(){
    baseRenderCard();
    if(currentMode!=='smart'||!pool[pos]||!session)return;
    var c=pool[pos],done=assessedCount(),rated=session.assessed[keyOf(c)];
    if($('matchBadge'))$('matchBadge').textContent=done+' / '+session.cards.length+' bewertet';
    if($('cardMeta'))$('cardMeta').textContent=areaForCard(c).short+' · Karte '+c.n+' · '+priorityLabel(c);
    if($('knowledgeHint')&&rated)$('knowledgeHint').textContent='In dieser Runde bewertet: '+(rated.outcome==='known'?'Gewusst':rated.outcome==='unsure'?'Unsicher':'Nicht gewusst')+'.';
  };

  renderResults=function(query){
    if(currentMode!=='smart')return baseRenderResults(query);
    var list=$('resultList');if(!list)return;list.innerHTML='';var typed=!!query;
    if($('resultHint'))$('resultHint').textContent=typed?pool.length+' Treffer':assessedCount()+' von '+session.cards.length+' bewertet';
    if(!pool.length){list.innerHTML='<div class="empty">Keine Karte dieser intelligenten Runde enthält dieses Schlagwort.</div>';return;}
    pool.forEach(function(c,i){
      var a=areaForCard(c),k=keyOf(c),rated=session.assessed[k],b=document.createElement('button');b.className='result';b.dataset.key=k;
      b.innerHTML='<div class="resultNum">'+a.short.toUpperCase()+' · KARTE '+c.n+' · '+priorityLabel(c).toUpperCase()+'</div><div class="resultQ"></div><div class="resultState"></div>';
      b.querySelector('.resultQ').textContent=c.q;b.querySelector('.resultState').textContent=rated?(rated.outcome==='known'?'✓ Gewusst':rated.outcome==='unsure'?'? Unsicher':'✕ Nicht gewusst'):'Noch offen';
      b.onclick=function(){pos=i;revealed=false;renderCard();$('flashcard').scrollIntoView({behavior:'smooth',block:'center'});};list.appendChild(b);
    });
    renderCard();
  };

  markUnsure=function(){
    if(currentMode!=='smart')return baseMarkUnsure();
    var c=pool[pos];if(!c)return;recordLearningState(c,'unsure','intelligent');$('knowledgeHint').textContent='Als „Unsicher“ gespeichert.';updateKnowledgeButtons(c);afterAssessment(c,'unsure');
  };
  markUnknown=function(){
    if(currentMode!=='smart')return baseMarkUnknown();
    var c=pool[pos];if(!c)return;recordLearningState(c,'wrong','intelligent');$('knowledgeHint').textContent='Als „Nicht gewusst“ gespeichert. Die Karte wird künftig höher priorisiert.';updateKnowledgeButtons(c);afterAssessment(c,'wrong');
  };
  markKnown=function(){
    if(currentMode!=='smart')return baseMarkKnown();
    var c=pool[pos];if(!c)return;var e=errorInfo(c),result=recordKnown(c,'intelligent');
    if(e&&result&&result.removed)$('knowledgeHint').textContent='3× hintereinander gewusst – aus dem Fehlerpool entfernt.';
    else if(e&&result)$('knowledgeHint').textContent='Sicherer Treffer '+result.streak+'/3.';
    else $('knowledgeHint').textContent='Als gewusst markiert.';
    updateKnowledgeButtons(c);updateHomeStats();afterAssessment(c,'known');
  };

  function bindAssessmentButtons(){
    if($('knownBtn'))$('knownBtn').onclick=markKnown;
    if($('unsureBtn'))$('unsureBtn').onclick=markUnsure;
    if($('unknownBtn'))$('unknownBtn').onclick=markUnknown;
  }

  function init(){
    injectSummaryStyle();session=loadSession();updateStartButton();bindAssessmentButtons();
  }

  window.FachteilSmartV18={
    start:start,
    getState:function(){return loadSession();},
    debug:{categoryOf:categoryOf,priorityOf:function(c){return priorityOf(c,areaStats());},buildPlan:buildPlan,areaStats:areaStats}
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
