(function(){
  'use strict';
  if(window.__FachteilLuchsHomeV17)return;
  window.__FachteilLuchsHomeV17=true;

  var home=null,dashboard=null;
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
      addSetupLabel(search,'Wissensdatenbank','Alle 520 Karten');
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

    var overview=document.createElement('div');overview.className='card v17Overview';overview.innerHTML='<div class="v17OverviewTop"><div><div class="v17Eyebrow">Dein Lernstand</div><div class="v17OverviewTitle" id="v17ProgressTitle">0 von 520 Karten bearbeitet</div><div class="v17OverviewMeta">Was möchtest du jetzt machen?</div></div><div class="v17OverviewBadges"><span class="badge" id="v17ErrorBadge">Fehlerpool 0</span><span class="badge" id="v17QuizBadge">Quiz –</span></div></div><div class="v17Progress"><span id="v17ProgressBar"></span></div>';
    dashboard.appendChild(overview);

    var areas=document.createElement('section');areas.className='v17Group';areas.innerHTML='<div class="v17GroupHead"><div class="v17GroupTitle">Lernbereiche</div><div class="v17GroupHint">Direkt lernen</div></div>';
    var areaGrid=document.createElement('div');areaGrid.className='v17AreaGrid';
    [
      ['hf1','HF 1','264 Karten','Technik & Gestaltung'],['hf2','HF 2','96 Karten','Auftragsabwicklung'],['hf3','HF 3','64 Karten','Betriebsführung'],['aufmass','Aufmaß','96 Karten','Aufmaß & Abrechnung']
    ].forEach(function(x){var b=document.createElement('button');b.type='button';b.className='v17Area';b.innerHTML='<span class="v17AreaCode">'+(x[0]==='aufmass'?'AM':x[1].replace(' ',''))+'</span><strong>'+x[1]+'</strong><span>'+x[2]+' · '+x[3]+'</span>';b.onclick=function(){if(typeof openArea==='function')openArea(x[0]);};areaGrid.appendChild(b);});
    areas.appendChild(areaGrid);dashboard.appendChild(areas);

    var train=document.createElement('section');train.className='v17Group';train.innerHTML='<div class="v17GroupHead"><div class="v17GroupTitle">Trainieren</div><div class="v17GroupHint">Modus wählen</div></div>';
    var tg=document.createElement('div');tg.className='v17ActionGrid';
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
    wg.appendChild(makeButton('v17Action','🔎','Wissensdatenbank','Alle 520 Karten nach Begriffen und Themen durchsuchen.',function(){showSetup('knowledge');}));
    wg.appendChild(makeButton('v17Action','📊','Statistik','Lernstand, Prüfungsreife und Prüfungsanalyse ansehen.',function(){if(typeof openStats==='function')openStats();}));
    wa.appendChild(wg);dashboard.appendChild(wa);

    var util=document.createElement('div');util.className='v17Utility';util.innerHTML='<button type="button" class="btn" id="v17DataBtn">⚙ Daten & Lernstand verwalten</button>';dashboard.appendChild(util);
    q('#v17DataBtn',util).onclick=function(){if(typeof openStats==='function')openStats();setTimeout(function(){var d=byId('analysisDetailsV122');if(d)d.open=true;var b=q('.backupPanel');if(b)b.scrollIntoView({behavior:'smooth',block:'start'});},100);};

    home.insertBefore(dashboard,home.firstChild);
  }

  function syncProgress(){
    if(!dashboard)return;
    var learned=parseInt((byId('statsLearned')&&byId('statsLearned').textContent)||'0',10)||0;
    var total=parseInt((byId('statsTotal')&&byId('statsTotal').textContent)||'520',10)||520;
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
