(function(){
  'use strict';
  if(window.__FachteilLuchsExamV13)return;
  window.__FachteilLuchsExamV13=true;

  if(typeof AREAS==='undefined'||typeof ALL_CARDS==='undefined'||typeof quizOptions!=='function'||typeof cardKey!=='function')return;

  var EXAM_KEY='fachteil_exam_state_v1';
  var EXAM_SCHEMA=1;
  var POINTS_PER_QUESTION=5;
  var PASS_PERCENT=50;
  var examTimer=null;
  var reviewIndex=0;
  var currentAttempt=null;

  var MODES={
    all:{key:'all',label:'Gesamtprüfung',short:'Gesamt',plan:{hf1:16,hf2:12,aufmass:8,hf3:16},questions:52,maxPoints:260,minutes:120,description:'Alle Handlungsfelder · HF 2 enthält gezielt Aufmaß'},
    hf1:{key:'hf1',label:'HF 1 · Technik & Gestaltung',short:'HF 1',plan:{hf1:16},questions:16,maxPoints:80,minutes:45,description:'16 Fragen · 80 Punkte'},
    hf2:{key:'hf2',label:'HF 2 · Auftragsabwicklung',short:'HF 2',plan:{hf2:12,aufmass:8},questions:20,maxPoints:100,minutes:60,description:'20 Fragen · davon 8 Aufmaß · 100 Punkte'},
    hf3:{key:'hf3',label:'HF 3 · Betriebsführung',short:'HF 3',plan:{hf3:16},questions:16,maxPoints:80,minutes:45,description:'16 Fragen · 80 Punkte'}
  };

  function byId(id){return document.getElementById(id);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function pct(n){return Math.round(Number(n)||0)+'%';}
  function formatSeconds(total){
    total=Math.max(0,Math.floor(Number(total)||0));
    var h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;
    if(h>0)return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }
  function modeOf(key){return MODES[key]||MODES.all;}
  function cardById(id){
    for(var i=0;i<ALL_CARDS.length;i++)if(cardKey(ALL_CARDS[i])===id)return ALL_CARDS[i];
    return null;
  }
  function hfKey(card){return card&&card.curriculumArea?card.curriculumArea:(card&&card._area==='aufmass'?'hf2':card&&card._area)||'hf1';}
  function hfLabel(key){return key==='hf1'?'HF 1':key==='hf2'?'HF 2':key==='hf3'?'HF 3':String(key||'').toUpperCase();}

  function emptyState(){return {schemaVersion:EXAM_SCHEMA,attempts:[],active:null};}
  function sanitizeAttempt(a){
    if(!a||typeof a!=='object')return null;
    var mode=modeOf(a.mode).key;
    var hf={};
    ['hf1','hf2','hf3'].forEach(function(k){
      var x=a.hf&&a.hf[k];
      if(x&&Number(x.total)>0)hf[k]={correct:Math.max(0,Number(x.correct)||0),wrong:Math.max(0,Number(x.wrong)||0),open:Math.max(0,Number(x.open)||0),total:Math.max(0,Number(x.total)||0),points:Math.max(0,Number(x.points)||0),maxPoints:Math.max(0,Number(x.maxPoints)||0),pct:clamp(Number(x.pct)||0,0,100)};
    });
    return {
      id:String(a.id||('exam-'+Date.now())),mode:mode,when:Number(a.when)||Date.now(),startedAt:Number(a.startedAt)||Number(a.when)||Date.now(),finishedAt:Number(a.finishedAt)||Number(a.when)||Date.now(),
      correct:Math.max(0,Number(a.correct)||0),wrong:Math.max(0,Number(a.wrong)||0),open:Math.max(0,Number(a.open)||0),total:Math.max(0,Number(a.total)||0),
      points:Math.max(0,Number(a.points)||0),maxPoints:Math.max(0,Number(a.maxPoints)||0),pct:clamp(Number(a.pct)||0,0,100),timeLimitSeconds:Math.max(0,Number(a.timeLimitSeconds)||0),elapsedSeconds:Math.max(0,Number(a.elapsedSeconds)||0),
      passed:!!a.passed,hf:hf,review:Array.isArray(a.review)?a.review.slice(0,100).map(function(r){return {cardId:String(r&&r.cardId||''),chosenText:r&&r.chosenText!=null?String(r.chosenText):null,correctText:r&&r.correctText!=null?String(r.correctText):'',status:r&&r.status==='open'?'open':'wrong'};}).filter(function(r){return !!cardById(r.cardId);}):[]
    };
  }
  function sanitizeActive(a){
    if(!a||typeof a!=='object'||!MODES[a.mode]||!Array.isArray(a.items))return null;
    var items=a.items.map(function(it){
      if(!it||!cardById(String(it.cardId||''))||!Array.isArray(it.options)||it.options.length<2)return null;
      return {cardId:String(it.cardId),options:it.options.slice(0,6).map(function(o){return {text:String(o&&o.text||''),correct:!!(o&&o.correct)};}),chosenIndex:it.chosenIndex===null||it.chosenIndex===undefined?null:Math.max(0,Math.min(it.options.length-1,Number(it.chosenIndex)||0))};
    }).filter(Boolean);
    if(!items.length)return null;
    return {mode:a.mode,startedAt:Number(a.startedAt)||Date.now(),deadline:Number(a.deadline)||Date.now(),timeLimitSeconds:Math.max(60,Number(a.timeLimitSeconds)||modeOf(a.mode).minutes*60),index:clamp(Number(a.index)||0,0,items.length-1),items:items};
  }
  function loadState(){
    try{
      var raw=JSON.parse(localStorage.getItem(EXAM_KEY)||'null');
      if(!raw||typeof raw!=='object')return emptyState();
      var st=emptyState();
      st.attempts=Array.isArray(raw.attempts)?raw.attempts.map(sanitizeAttempt).filter(Boolean).slice(0,50):[];
      st.active=sanitizeActive(raw.active);
      return st;
    }catch(e){return emptyState();}
  }
  var examState=loadState();
  function saveState(){try{localStorage.setItem(EXAM_KEY,JSON.stringify(examState));}catch(e){} updateLauncher();renderExamAnalysis();}
  function publicState(){return {schemaVersion:EXAM_SCHEMA,attempts:examState.attempts.slice(0,50)};}
  function importState(raw){
    if(!raw||typeof raw!=='object')return false;
    examState.attempts=Array.isArray(raw.attempts)?raw.attempts.map(sanitizeAttempt).filter(Boolean).slice(0,50):[];
    examState.active=null;saveState();return true;
  }

  var style=document.createElement('style');
  style.id='exam-v13-styles';
  style.textContent=`
    .examHomeV13{padding:17px 18px;margin-bottom:16px;border-color:rgba(121,197,255,.34)}
    .examHomeTop{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
    .examHomeLeft{display:flex;align-items:center;gap:13px;min-width:0}
    .examHomeIcon{width:48px;height:48px;display:grid;place-items:center;border-radius:15px;background:var(--soft);border:1px solid var(--line);font-size:24px;flex:0 0 48px}
    .examHomeTitle{font-size:18px;font-weight:950}.examHomeText{font-size:12px;color:var(--muted);line-height:1.45;margin-top:3px}
    .examHomeActions{display:flex;gap:9px;flex-wrap:wrap;margin-top:13px}.examHomeActions .btn{flex:1 1 190px}
    .examResumeHint{font-size:11px;color:var(--muted);margin-top:9px;line-height:1.4}

    .examV13Wrap{display:grid;gap:14px}
    .examMenuHead,.examStage,.examResult,.examReview{padding:18px}
    .examModeHero{padding:18px;border:1px solid rgba(121,197,255,.38);border-radius:18px;background:var(--soft);margin-top:14px}
    .examModeHeroTop{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.examModeHero h3{margin:0;font-size:20px}.examModeHero p{margin:5px 0 0;color:var(--muted);font-size:12px;line-height:1.45}
    .examModeGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:11px}
    .examModeCard{padding:14px;border:1px solid var(--line);border-radius:16px;background:rgba(127,127,127,.035)}.examModeCard strong{display:block;font-size:15px}.examModeCard span{display:block;font-size:10px;color:var(--muted);line-height:1.4;margin:5px 0 10px}
    .examTimeRow{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:14px;padding-top:13px;border-top:1px solid var(--line)}
    .examSelect{min-height:42px;border:1px solid var(--line);border-radius:13px;background:var(--card);color:var(--text);padding:8px 11px;font-weight:800}
    .examInfoNote{font-size:10px;color:var(--muted);line-height:1.45;margin-top:11px}

    .examStageTop{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.examBadges{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.examTimerUrgent{border-color:rgba(255,107,99,.55)!important;color:#ff8b84!important}
    .examProgress{height:7px;border:1px solid var(--line);border-radius:999px;background:var(--soft);overflow:hidden;margin:13px 0}.examProgress>div{height:100%;background:linear-gradient(90deg,var(--primary),var(--primary2));width:0;transition:width .2s ease}
    .examMeta{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;color:var(--muted);font-size:11px;font-weight:850}
    .examQuestion{font-size:23px;line-height:1.4;font-weight:950;letter-spacing:-.02em;margin:20px 0 15px}
    .examAnswers{display:grid;gap:9px}.examAnswer{width:100%;display:grid;grid-template-columns:32px 1fr;gap:10px;align-items:center;text-align:left;border:1px solid var(--line);border-radius:15px;background:rgba(127,127,127,.035);padding:12px;cursor:pointer;color:var(--text)}.examAnswer.selected{border-color:rgba(121,197,255,.7);background:var(--soft)}
    .examLetter{width:29px;height:29px;border-radius:9px;display:grid;place-items:center;border:1px solid var(--line);font-weight:950}.examAnswerText{font-size:13px;line-height:1.42;font-weight:800}
    .examNavRow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;margin-top:15px}.examSubmit{border-color:rgba(121,197,255,.5)}
    .examOverview{margin-top:12px;border:1px solid var(--line);border-radius:15px;overflow:hidden}.examOverview>summary{list-style:none;padding:11px 12px;font-size:11px;font-weight:900;cursor:pointer}.examOverview>summary::-webkit-details-marker{display:none}.examNumberGrid{display:grid;grid-template-columns:repeat(10,1fr);gap:5px;padding:0 10px 10px}.examNum{min-width:0;height:31px;padding:0;border:1px solid var(--line);border-radius:8px;background:transparent;color:var(--muted);font-size:9px;font-weight:900}.examNum.answered{background:var(--soft);color:var(--text);border-color:rgba(121,197,255,.45)}.examNum.current{outline:2px solid var(--primary)}

    .examScoreHero{display:grid;grid-template-columns:1.2fr .8fr;gap:12px;margin-top:14px}.examScoreMain,.examStatusBox{padding:16px;border:1px solid var(--line);border-radius:17px;background:rgba(127,127,127,.035)}.examScoreMain strong{display:block;font-size:34px;line-height:1}.examScoreMain span,.examStatusBox span{display:block;color:var(--muted);font-size:10px;margin-top:6px}.examStatusBox strong{display:block;font-size:18px;line-height:1.2}
    .examResultGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:10px}.examResultMetric{padding:12px;border:1px solid var(--line);border-radius:14px;background:rgba(127,127,127,.035)}.examResultMetric span{display:block;font-size:10px;color:var(--muted)}.examResultMetric strong{display:block;font-size:19px;margin-top:4px}
    .examBreakTitle{font-size:13px;font-weight:950;margin:17px 0 8px}.examBreakGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.examBreak{padding:12px;border:1px solid var(--line);border-radius:14px;background:rgba(127,127,127,.035)}.examBreakTop{display:flex;justify-content:space-between;gap:8px;font-size:11px;font-weight:900}.examBreakPct{font-size:22px;font-weight:950;margin-top:5px}.examBreakMeta{font-size:9px;color:var(--muted);margin-top:4px;line-height:1.4}
    .examResultActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:15px}.examResultActions .btn{flex:1 1 150px}.examDisclaimer{font-size:9px;color:var(--muted);line-height:1.4;margin-top:10px}

    .examReviewMeta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:10px 0}.examReviewQuestion{font-size:19px;font-weight:950;line-height:1.4;margin:14px 0}.examCompare{display:grid;grid-template-columns:1fr 1fr;gap:10px}.examCompareBox{padding:13px;border:1px solid var(--line);border-radius:15px;background:rgba(127,127,127,.035)}.examCompareBox.wrong{border-color:rgba(255,107,99,.36)}.examCompareBox.correct{border-color:rgba(46,204,113,.34)}.examCompareLabel{font-size:9px;color:var(--muted);font-weight:900;margin-bottom:6px}.examCompareText{font-size:12px;line-height:1.45;font-weight:800}.examReviewNav{display:flex;gap:8px;margin-top:12px}.examReviewNav .btn{flex:1}

    .examAnalysisV13{padding:14px;margin:0}.examAnalysisHead{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.examAnalysisTitle{font-size:16px;font-weight:950}.examAnalysisText{font-size:9px;color:var(--muted);line-height:1.4;margin-top:3px}.examAnalysisGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:10px}.examAnalysisMetric{padding:9px 10px;border:1px solid var(--line);border-radius:13px;background:rgba(127,127,127,.035);min-width:0}.examAnalysisMetric span{display:block;font-size:8px;color:var(--muted);font-weight:850}.examAnalysisMetric strong{display:block;font-size:16px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.examAnalysisActions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.examAnalysisActions .btn{min-height:36px;padding:7px 10px;font-size:10px;box-shadow:none}.examHistoryDetails{margin-top:8px;border-top:1px solid var(--line);padding-top:7px}.examHistoryDetails>summary{cursor:pointer;font-size:9px;font-weight:900;color:var(--muted)}.examHistoryList{display:grid;gap:5px;margin-top:7px}.examHistoryItem{display:flex;justify-content:space-between;gap:8px;font-size:9px;padding:6px 7px;border:1px solid var(--line);border-radius:9px}

    @media(max-width:640px){
      .examMenuHead,.examStage,.examResult,.examReview{padding:14px}.examModeGrid{grid-template-columns:1fr}.examModeHero{padding:14px}.examStageTop{flex-direction:column}.examBadges{justify-content:flex-start}.examQuestion{font-size:20px}.examNavRow{grid-template-columns:1fr 1fr}.examNavRow .examSubmit{grid-column:1/-1}.examNumberGrid{grid-template-columns:repeat(8,1fr)}.examScoreHero{grid-template-columns:1fr}.examBreakGrid{grid-template-columns:1fr}.examCompare{grid-template-columns:1fr}.examAnalysisGrid{grid-template-columns:repeat(3,minmax(0,1fr))}
    }
    @media(max-width:390px){.examAnalysisGrid{grid-template-columns:1fr 1fr}.examAnalysisMetric:last-child{grid-column:1/-1}.examNumberGrid{grid-template-columns:repeat(6,1fr)}}
  `;
  document.head.appendChild(style);

  function injectHomeLauncher(){
    if(byId('examHomeV13'))return;
    var quizHome=document.querySelector('.quizHome');
    var home=byId('home');
    if(!home)return;
    var box=document.createElement('div');
    box.id='examHomeV13';box.className='card examHomeV13';
    box.innerHTML='<div class="examHomeTop"><div class="examHomeLeft"><div class="examHomeIcon">📝</div><div><div class="examHomeTitle">Prüfungsmodus</div><div class="examHomeText">Gesamtprüfung über HF 1, HF 2 und HF 3 – oder ein einzelnes Handlungsfeld gezielt prüfen.</div></div></div><div class="badge">V1.3</div></div><div class="examHomeActions"><button class="btn primary" id="examOpenMenu">Prüfungsmodus öffnen</button><button class="btn hidden" id="examResumeBtn">Prüfung fortsetzen</button></div><div class="examResumeHint hidden" id="examResumeHint"></div>';
    if(quizHome&&quizHome.parentNode)quizHome.parentNode.insertBefore(box,quizHome);else home.appendChild(box);
    byId('examOpenMenu').onclick=openExamMenu;
    byId('examResumeBtn').onclick=resumeExam;
  }

  function injectExamSection(){
    if(byId('examV13'))return;
    var quiz=byId('quiz');
    if(!quiz||!quiz.parentNode)return;
    var main=document.createElement('main');main.id='examV13';main.className='section hidden';
    main.innerHTML=`<div class="examV13Wrap">
      <div class="card examMenuHead" id="examMenuV13">
        <div class="sectionTitle">Prüfungsmodus</div>
        <div class="muted" style="font-size:12px;line-height:1.5;margin-top:4px">Die Gesamtprüfung deckt von Beginn an alle drei Handlungsfelder ab. Einzelne Handlungsfelder können zusätzlich separat geprüft werden.</div>
        <div class="examModeHero">
          <div class="examModeHeroTop"><div><h3>Gesamtprüfung</h3><p>52 Fragen · 260 Punkte · HF 1 = 80 · HF 2 = 100 · HF 3 = 80</p></div><div class="badge">16 · 20 · 16</div></div>
          <div style="margin-top:12px"><button class="btn primary" id="examStartAll">Gesamtprüfung starten</button></div>
        </div>
        <div class="examModeGrid">
          <div class="examModeCard"><strong>HF 1</strong><span>16 Fragen · 80 Punkte</span><button class="btn" data-exam-mode="hf1">HF 1 starten</button></div>
          <div class="examModeCard"><strong>HF 2</strong><span>20 Fragen · 12 Fachfragen + 8 Aufmaß · 100 Punkte</span><button class="btn" data-exam-mode="hf2">HF 2 starten</button></div>
          <div class="examModeCard"><strong>HF 3</strong><span>16 Fragen · 80 Punkte</span><button class="btn" data-exam-mode="hf3">HF 3 starten</button></div>
        </div>
        <div class="examTimeRow"><label for="examTimeOverride"><strong>Zeitlimit</strong></label><select class="examSelect" id="examTimeOverride"><option value="standard" selected>Standard je Modus</option><option value="30">30 Minuten</option><option value="45">45 Minuten</option><option value="60">60 Minuten</option><option value="90">90 Minuten</option><option value="120">120 Minuten</option><option value="180">180 Minuten</option></select><span class="mini" id="examTimeHint">Gesamt: 120 Min · HF 1/3: 45 Min · HF 2: 60 Min</span></div>
        <div class="examInfoNote">Keine Sofortkorrektur während der Prüfung. Antworten können geändert, Fragen übersprungen und später erneut aufgerufen werden. Die Auswertung erfolgt erst bei Abgabe oder Zeitablauf.</div>
      </div>

      <div class="card examStage hidden" id="examStageV13">
        <div class="examStageTop"><div><div class="sectionTitle" id="examStageTitle">Prüfung</div><div class="muted" id="examStageSub" style="font-size:11px;margin-top:3px"></div></div><div class="examBadges"><div class="badge" id="examProgressBadge">1 / 52</div><div class="badge" id="examAnsweredBadge">0 beantwortet</div><div class="badge" id="examTimerV13">120:00</div></div></div>
        <div class="examProgress"><div id="examProgressBarV13"></div></div>
        <div class="examMeta"><span id="examAreaTag"></span><span id="examPointsTag"></span></div>
        <div class="examQuestion" id="examQuestionV13"></div>
        <div class="examAnswers" id="examAnswersV13"></div>
        <div class="examNavRow"><button class="btn" id="examPrevV13">← Zurück</button><button class="btn" id="examNextV13">Weiter →</button><button class="btn examSubmit" id="examSubmitV13">Prüfung abgeben</button></div>
        <details class="examOverview" id="examOverviewV13"><summary id="examOverviewSummary">Fragenübersicht</summary><div class="examNumberGrid" id="examNumberGridV13"></div></details>
      </div>

      <div class="card examResult hidden" id="examResultV13">
        <div class="sectionTitle" id="examResultTitleV13">Prüfung beendet</div>
        <div class="examScoreHero"><div class="examScoreMain"><strong id="examResultPoints">0 / 260</strong><span id="examResultPercent">0%</span></div><div class="examStatusBox"><strong id="examResultStatus">–</strong><span>Interne Trainingswertung</span></div></div>
        <div class="examResultGrid"><div class="examResultMetric"><span>Richtig</span><strong id="examResultCorrect">0</strong></div><div class="examResultMetric"><span>Falsch</span><strong id="examResultWrong">0</strong></div><div class="examResultMetric"><span>Offen</span><strong id="examResultOpen">0</strong></div></div>
        <div class="examBreakTitle">Auswertung nach Handlungsfeld</div><div class="examBreakGrid" id="examBreakGridV13"></div>
        <div class="examResultActions"><button class="btn primary" id="examReviewErrorsV13">Fehler ansehen</button><button class="btn" id="examToErrorPoolV13">Fehlerpool öffnen</button><button class="btn" id="examNewV13">Neue Prüfung</button><button class="btn" id="examHomeV13Btn">Startseite</button></div>
        <div class="examDisclaimer">„Bestanden“ bedeutet hier ausschließlich interne Trainingswertung ab 50 %. Die App ersetzt keine amtliche Prüfungsbewertung.</div>
      </div>

      <div class="card examReview hidden" id="examReviewV13">
        <div class="sectionTitle">Prüfungsfehler ansehen</div><div class="examReviewMeta"><span class="badge" id="examReviewProgress">1 / 1</span><span class="badge" id="examReviewStatus">Falsch</span></div>
        <div class="examMeta"><span id="examReviewArea"></span><span id="examReviewCard"></span></div><div class="examReviewQuestion" id="examReviewQuestion"></div>
        <div class="examCompare"><div class="examCompareBox wrong"><div class="examCompareLabel">Deine Antwort</div><div class="examCompareText" id="examReviewChosen"></div></div><div class="examCompareBox correct"><div class="examCompareLabel">Richtige Antwort</div><div class="examCompareText" id="examReviewCorrect"></div></div></div>
        <div class="examReviewNav"><button class="btn" id="examReviewPrev">← Vorheriger</button><button class="btn" id="examReviewNext">Nächster →</button></div>
        <div class="examResultActions"><button class="btn primary" id="examReviewToErrors">Fehlerpool öffnen</button><button class="btn" id="examReviewBack">Zur Auswertung</button></div>
      </div>
    </div>`;
    quiz.parentNode.insertBefore(main,quiz);

    byId('examStartAll').onclick=function(){startExam('all');};
    Array.prototype.forEach.call(main.querySelectorAll('[data-exam-mode]'),function(b){b.onclick=function(){startExam(b.getAttribute('data-exam-mode'));};});
    byId('examPrevV13').onclick=function(){moveExam(-1);};byId('examNextV13').onclick=function(){moveExam(1);};byId('examSubmitV13').onclick=function(){submitExam(false);};
    byId('examReviewErrorsV13').onclick=openExamReview;byId('examToErrorPoolV13').onclick=function(){hideExam();openErrorPool();};byId('examNewV13').onclick=openExamMenu;byId('examHomeV13Btn').onclick=goExamHome;
    byId('examReviewPrev').onclick=function(){moveReview(-1);};byId('examReviewNext').onclick=function(){moveReview(1);};byId('examReviewToErrors').onclick=function(){hideExam();openErrorPool();};byId('examReviewBack').onclick=showExamResult;
  }

  function injectExamAnalysis(){
    if(byId('examAnalysisV13'))return;
    var root=byId('learningAnalysisV12');
    if(!root)return;
    var panel=document.createElement('div');panel.id='examAnalysisV13';panel.className='card examAnalysisV13';
    var details=byId('analysisDetailsV122');
    if(details&&details.parentNode===root)root.insertBefore(panel,details);else root.appendChild(panel);
  }

  function updateLauncher(){
    var btn=byId('examResumeBtn'),hint=byId('examResumeHint');
    if(!btn||!hint)return;
    if(examState.active){
      var m=modeOf(examState.active.mode),left=Math.max(0,Math.ceil((examState.active.deadline-Date.now())/1000));
      btn.classList.remove('hidden');btn.textContent=left>0?'Prüfung fortsetzen':'Zeit abgelaufen · auswerten';hint.classList.remove('hidden');hint.textContent=m.label+' · '+answeredCount(examState.active)+' von '+examState.active.items.length+' beantwortet · '+(left>0?formatSeconds(left)+' Restzeit':'Zeitlimit erreicht');
    }else{btn.classList.add('hidden');hint.classList.add('hidden');hint.textContent='';}
  }

  function renderExamAnalysis(){
    injectExamAnalysis();var box=byId('examAnalysisV13');if(!box)return;
    var attempts=examState.attempts||[];
    if(!attempts.length){
      box.innerHTML='<div class="examAnalysisHead"><div><div class="examAnalysisTitle">Prüfungsanalyse</div><div class="examAnalysisText">Noch keine Prüfung absolviert. Gesamtprüfung oder einzelne Handlungsfelder können direkt gestartet werden.</div></div></div><div class="examAnalysisActions"><button class="btn primary" id="examAnalysisStart">Prüfungsmodus starten</button></div>';
      byId('examAnalysisStart').onclick=openExamMenu;return;
    }
    var latest=attempts[0],avg=Math.round(attempts.reduce(function(s,a){return s+(Number(a.pct)||0);},0)/attempts.length),best=Math.max.apply(null,attempts.map(function(a){return Number(a.pct)||0;}));
    var hist=attempts.slice(0,6).map(function(a){var d=new Date(a.when);return '<div class="examHistoryItem"><span>'+esc(modeOf(a.mode).short)+' · '+String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.</span><strong>'+Math.round(a.pct)+'%</strong></div>';}).join('');
    box.innerHTML='<div class="examAnalysisHead"><div><div class="examAnalysisTitle">Prüfungsanalyse</div><div class="examAnalysisText">Kompakter Überblick über deine gespeicherten Prüfungsversuche.</div></div><div class="badge">'+attempts.length+' '+(attempts.length===1?'Prüfung':'Prüfungen')+'</div></div><div class="examAnalysisGrid"><div class="examAnalysisMetric"><span>Letzte Prüfung</span><strong>'+Math.round(latest.pct)+'%</strong></div><div class="examAnalysisMetric"><span>Durchschnitt</span><strong>'+avg+'%</strong></div><div class="examAnalysisMetric"><span>Bestwert</span><strong>'+best+'%</strong></div></div><div class="examAnalysisActions"><button class="btn primary" id="examAnalysisStart">Neue Prüfung</button></div><details class="examHistoryDetails"><summary>Prüfungsverlauf anzeigen</summary><div class="examHistoryList">'+hist+'</div></details>';
    byId('examAnalysisStart').onclick=openExamMenu;
  }

  function hideBase(){['home','stats','library','quiz','review'].forEach(function(id){var e=byId(id);if(e)e.classList.add('hidden');});}
  function hideExam(){var e=byId('examV13');if(e)e.classList.add('hidden');stopTimer();}
  function showExam(){hideBase();var e=byId('examV13');if(e)e.classList.remove('hidden');var hb=byId('homeBtn');if(hb)hb.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
  function showOnly(id){['examMenuV13','examStageV13','examResultV13','examReviewV13'].forEach(function(x){var e=byId(x);if(e)e.classList.toggle('hidden',x!==id);});}
  function openExamMenu(){showExam();showOnly('examMenuV13');updateLauncher();}
  function goExamHome(){hideExam();if(typeof goHome==='function')goHome();}

  function balancedPick(cards,count){
    var groups={};cards.forEach(function(c){var k=String(c.subtopic||c.category||'Sonstiges');if(!groups[k])groups[k]=[];groups[k].push(c);});
    var keys=shuffle(Object.keys(groups));keys.forEach(function(k){groups[k]=shuffle(groups[k]);});
    var out=[],used={};
    while(out.length<count){
      var progress=false;
      for(var i=0;i<keys.length&&out.length<count;i++){
        var arr=groups[keys[i]];
        while(arr.length){var c=arr.shift(),id=cardKey(c);if(!used[id]){used[id]=true;out.push(c);progress=true;break;}}
      }
      if(!progress)break;
      keys=shuffle(keys);
    }
    if(out.length<count){shuffle(cards).forEach(function(c){var id=cardKey(c);if(out.length<count&&!used[id]){used[id]=true;out.push(c);}});}
    return out.slice(0,count);
  }
  function buildCardsForMode(modeKey){
    var mode=modeOf(modeKey),out=[];
    Object.keys(mode.plan).forEach(function(area){var count=mode.plan[area];var source=AREAS[area]&&AREAS[area].cards?AREAS[area].cards:[];out=out.concat(balancedPick(source,count));});
    return shuffle(out);
  }
  function selectedMinutes(mode){var sel=byId('examTimeOverride'),raw=sel?sel.value:'standard';var n=Number(raw);return raw==='standard'||!n?mode.minutes:n;}
  function activeFromCards(modeKey,cards,minutes){
    var now=Date.now();return {mode:modeKey,startedAt:now,deadline:now+minutes*60*1000,timeLimitSeconds:minutes*60,index:0,items:cards.map(function(c){return {cardId:cardKey(c),options:quizOptions(c),chosenIndex:null};})};
  }
  function startExam(modeKey){
    var mode=modeOf(modeKey);
    if(examState.active){var discard=window.confirm('Es gibt bereits eine laufende Prüfung.\n\nDiese verwerfen und eine neue Prüfung starten?');if(!discard)return;examState.active=null;}
    var cards=buildCardsForMode(modeKey);if(cards.length!==mode.questions){window.alert('Die Prüfung konnte nicht vollständig zusammengestellt werden.');return;}
    examState.active=activeFromCards(modeKey,cards,selectedMinutes(mode));saveState();resumeExam();
  }
  function resumeExam(){
    var a=examState.active;if(!a)return openExamMenu();currentAttempt=a;showExam();showOnly('examStageV13');renderExam();startTimer();
  }
  function answeredCount(a){return a&&a.items?a.items.filter(function(x){return x.chosenIndex!==null&&x.chosenIndex!==undefined;}).length:0;}
  function renderExam(){
    var a=examState.active;if(!a)return;currentAttempt=a;var mode=modeOf(a.mode),item=a.items[a.index],card=cardById(item.cardId);if(!card)return;
    byId('examStageTitle').textContent=mode.label;byId('examStageSub').textContent=mode.description;byId('examProgressBadge').textContent=(a.index+1)+' / '+a.items.length;var answered=answeredCount(a);byId('examAnsweredBadge').textContent=answered+' beantwortet';byId('examProgressBarV13').style.width=(a.items.length?Math.round(answered/a.items.length*100):0)+'%';
    byId('examAreaTag').textContent=hfLabel(hfKey(card))+(card._area==='aufmass'?' · Aufmaß':'');byId('examPointsTag').textContent=POINTS_PER_QUESTION+' Punkte';byId('examQuestionV13').textContent=card.q;
    var root=byId('examAnswersV13');root.innerHTML='';item.options.forEach(function(o,i){var b=document.createElement('button');b.className='examAnswer'+(item.chosenIndex===i?' selected':'');b.innerHTML='<span class="examLetter">'+String.fromCharCode(65+i)+'</span><span class="examAnswerText"></span>';b.querySelector('.examAnswerText').textContent=o.text;b.onclick=function(){chooseAnswer(i);};root.appendChild(b);});
    byId('examPrevV13').disabled=a.index<=0;byId('examNextV13').disabled=a.index>=a.items.length-1;renderNumberGrid();saveState();
  }
  function chooseAnswer(i){var a=examState.active;if(!a)return;a.items[a.index].chosenIndex=i;saveState();renderExam();}
  function moveExam(delta){var a=examState.active;if(!a)return;a.index=clamp(a.index+delta,0,a.items.length-1);saveState();renderExam();window.scrollTo({top:0,behavior:'smooth'});}
  function jumpExam(i){var a=examState.active;if(!a)return;a.index=clamp(i,0,a.items.length-1);saveState();renderExam();var d=byId('examOverviewV13');if(d)d.open=false;window.scrollTo({top:0,behavior:'smooth'});}
  function renderNumberGrid(){
    var a=examState.active,root=byId('examNumberGridV13');if(!a||!root)return;root.innerHTML='';a.items.forEach(function(it,i){var b=document.createElement('button');b.className='examNum'+(it.chosenIndex!==null?' answered':'')+(i===a.index?' current':'');b.textContent=i+1;b.onclick=function(){jumpExam(i);};root.appendChild(b);});
    var open=a.items.length-answeredCount(a);byId('examOverviewSummary').textContent='Fragenübersicht · '+open+' offen';
  }
  function stopTimer(){if(examTimer){clearInterval(examTimer);examTimer=null;}}
  function startTimer(){stopTimer();updateTimer();examTimer=setInterval(updateTimer,500);}
  function updateTimer(){
    var a=examState.active;if(!a){stopTimer();return;}var left=Math.max(0,Math.ceil((a.deadline-Date.now())/1000)),el=byId('examTimerV13');if(el){el.textContent=formatSeconds(left);el.classList.toggle('examTimerUrgent',left<=300);}if(left<=0){stopTimer();finishExam(true);}
  }
  function submitExam(){
    var a=examState.active;if(!a)return;var open=a.items.length-answeredCount(a);var msg='Prüfung jetzt abgeben?';if(open)msg+='\n\n'+open+' Frage'+(open===1?' ist':'n sind')+' noch offen.';if(!window.confirm(msg))return;finishExam(false);
  }
  function buildResult(a,timeout){
    var mode=modeOf(a.mode),correct=0,wrong=0,open=0,hf={hf1:{correct:0,wrong:0,open:0,total:0},hf2:{correct:0,wrong:0,open:0,total:0},hf3:{correct:0,wrong:0,open:0,total:0}},review=[];
    a.items.forEach(function(it){var card=cardById(it.cardId);if(!card)return;var h=hfKey(card),bucket=hf[h],chosen=it.chosenIndex,correctOpt=null;for(var j=0;j<it.options.length;j++)if(it.options[j].correct){correctOpt=it.options[j];break;}bucket.total++;
      if(chosen===null||chosen===undefined){open++;bucket.open++;review.push({cardId:it.cardId,chosenText:null,correctText:correctOpt?correctOpt.text:card.a,status:'open'});}
      else if(it.options[chosen]&&it.options[chosen].correct){correct++;bucket.correct++;}
      else{wrong++;bucket.wrong++;review.push({cardId:it.cardId,chosenText:it.options[chosen]?it.options[chosen].text:null,correctText:correctOpt?correctOpt.text:card.a,status:'wrong'});}
    });
    Object.keys(hf).forEach(function(k){var b=hf[k];b.points=b.correct*POINTS_PER_QUESTION;b.maxPoints=b.total*POINTS_PER_QUESTION;b.pct=b.total?Math.round(b.correct/b.total*100):0;});
    var points=correct*POINTS_PER_QUESTION,maxPoints=mode.maxPoints,p=Math.round(points/maxPoints*100),finished=Date.now();
    return {id:'exam-'+finished+'-'+Math.floor(Math.random()*100000),mode:a.mode,when:finished,startedAt:a.startedAt,finishedAt:finished,correct:correct,wrong:wrong,open:open,total:a.items.length,points:points,maxPoints:maxPoints,pct:p,timeLimitSeconds:a.timeLimitSeconds,elapsedSeconds:Math.max(0,Math.round((finished-a.startedAt)/1000)),passed:p>=PASS_PERCENT,hf:hf,review:review,timeout:!!timeout};
  }
  function finishExam(timeout){
    var a=examState.active;if(!a)return;stopTimer();var result=buildResult(a,timeout);
    examState.active=null;examState.attempts.unshift(result);examState.attempts=examState.attempts.slice(0,50);saveState();
    a.items.forEach(function(it){var card=cardById(it.cardId);if(!card)return;if(it.chosenIndex===null||it.chosenIndex===undefined){recordLearningState(card,'unsure','Prüfung offen');}else if(it.options[it.chosenIndex]&&it.options[it.chosenIndex].correct){recordKnown(card,'Prüfung');}else{recordLearningState(card,'wrong','Prüfung');}});
    if(typeof updateErrorCount==='function')updateErrorCount();if(typeof updateHomeStats==='function')updateHomeStats();showExamResult(result,timeout);
  }
  function showExamResult(result,timeout){
    var r=result||examState.attempts[0];if(!r)return openExamMenu();currentAttempt=r;showExam();showOnly('examResultV13');var mode=modeOf(r.mode);
    byId('examResultTitleV13').textContent=(timeout?'Zeit abgelaufen · ':'')+mode.label+' beendet';byId('examResultPoints').textContent=Math.round(r.points)+' / '+Math.round(r.maxPoints)+' Punkte';byId('examResultPercent').textContent=Math.round(r.pct)+'%';byId('examResultStatus').textContent=r.passed?'Bestanden*':'Nicht bestanden*';byId('examResultCorrect').textContent=r.correct;byId('examResultWrong').textContent=r.wrong;byId('examResultOpen').textContent=r.open;
    var grid=byId('examBreakGridV13');grid.innerHTML='';['hf1','hf2','hf3'].forEach(function(k){var b=r.hf&&r.hf[k];if(!b||!b.total)return;var div=document.createElement('div');div.className='examBreak';div.innerHTML='<div class="examBreakTop"><span>'+hfLabel(k)+'</span><span>'+Math.round(b.points)+' / '+Math.round(b.maxPoints)+' P</span></div><div class="examBreakPct">'+Math.round(b.pct)+'%</div><div class="examBreakMeta">'+b.correct+' richtig · '+b.wrong+' falsch · '+b.open+' offen'+(k==='hf2'?' · inkl. Aufmaß':'')+'</div>';grid.appendChild(div);});
    byId('examReviewErrorsV13').classList.toggle('hidden',!r.review||!r.review.length);window.scrollTo({top:0,behavior:'smooth'});renderExamAnalysis();
  }
  function openExamReview(){var r=currentAttempt||examState.attempts[0];if(!r||!r.review||!r.review.length)return;currentAttempt=r;reviewIndex=0;showExam();showOnly('examReviewV13');renderReview();}
  function renderReview(){
    var r=currentAttempt,item=r&&r.review&&r.review[reviewIndex];if(!item)return;var card=cardById(item.cardId);if(!card)return;byId('examReviewProgress').textContent=(reviewIndex+1)+' / '+r.review.length;byId('examReviewStatus').textContent=item.status==='open'?'Offen':'Falsch';byId('examReviewArea').textContent=hfLabel(hfKey(card))+(card._area==='aufmass'?' · Aufmaß':'');byId('examReviewCard').textContent='Karte '+card.n;byId('examReviewQuestion').textContent=card.q;byId('examReviewChosen').textContent=item.status==='open'?'Keine Antwort abgegeben.':(item.chosenText||'Keine Antwort gespeichert.');byId('examReviewCorrect').textContent=item.correctText||card.a;byId('examReviewPrev').disabled=reviewIndex<=0;byId('examReviewNext').disabled=reviewIndex>=r.review.length-1;
  }
  function moveReview(delta){var r=currentAttempt;if(!r||!r.review)return;reviewIndex=clamp(reviewIndex+delta,0,r.review.length-1);renderReview();window.scrollTo({top:0,behavior:'smooth'});}

  function patchHomeButton(){
    var hb=byId('homeBtn');if(!hb)return;var old=hb.onclick;hb.onclick=function(){var exam=byId('examV13'),stage=byId('examStageV13');if(exam&&!exam.classList.contains('hidden')&&stage&&!stage.classList.contains('hidden')&&examState.active){if(!window.confirm('Prüfung verlassen?\n\nDein Stand wird gespeichert. Die Prüfungszeit läuft weiter und du kannst später fortsetzen.'))return;stopTimer();hideExam();if(typeof old==='function')old.call(hb);else if(typeof goHome==='function')goHome();return;}hideExam();if(typeof old==='function')old.call(hb);else if(typeof goHome==='function')goHome();};
  }

  injectHomeLauncher();injectExamSection();injectExamAnalysis();patchHomeButton();updateLauncher();renderExamAnalysis();

  window.FachteilExamV13={
    version:'1.3.0',
    exportState:publicState,
    importState:importState,
    open:openExamMenu,
    resume:resumeExam,
    getState:function(){return publicState();}
  };
})();
