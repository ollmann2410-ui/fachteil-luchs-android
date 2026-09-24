(function(){
  'use strict';
  if(window.__FachteilLuchsAnalysisV121)return;
  window.__FachteilLuchsAnalysisV121=true;

  function byId(id){return document.getElementById(id);}
  function closestPanel(node){
    while(node&&node!==document.body){
      if(node.classList&&node.classList.contains('analysisPanel'))return node;
      node=node.parentElement;
    }
    return null;
  }

  function compactAnalysis(){
    var root=byId('learningAnalysisV12');
    var statsHome=byId('statsHome');
    var statsSection=byId('stats');
    if(!root||!statsHome||!statsSection)return false;

    if(!byId('analysis-v122-styles')){
      var style=document.createElement('style');
      style.id='analysis-v122-styles';
      style.textContent=`
        /* V1.2.2 – klare Teilnehmeransicht */
        #statsHome{padding:14px 15px;margin-bottom:10px}
        #statsHome .statsHomeHead{align-items:flex-start;margin:0}
        #statsHome .sectionTitle{font-size:21px;line-height:1.1}
        #statsHome .statsHomeText{font-size:11px;line-height:1.42;margin-top:5px;max-width:62ch}
        #statsHome .badge{display:none!important}
        #statsHome .statsGrid,
        #statsHome .statsProgressMeta,
        #statsHome .statsProgress,
        #statsHome .statsWeakLine{display:none!important}

        .analysisQuickV122{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:11px}
        .analysisQuickV122Item{min-width:0;padding:9px 10px;border:1px solid var(--line);border-radius:13px;background:var(--soft)}
        .analysisQuickV122Item strong{display:block;font-size:15px;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .analysisQuickV122Item span{display:block;margin-top:3px;font-size:9px;color:var(--muted);font-weight:800;line-height:1.2}

        .analysisV12{gap:10px;margin-top:10px}
        .analysisPanel{padding:14px}
        .analysisPanelHead{margin-bottom:9px;gap:8px}
        .analysisPanelTitle{font-size:18px}
        .analysisPanelText{font-size:10px;line-height:1.42}
        .analysisChip{display:none!important}

        #learningAnalysisV12>.analysisPanel:first-child{margin:0}
        #learningAnalysisV12>.analysisPanel:first-child .analysisSummaryGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
        #learningAnalysisV12>.analysisPanel:first-child .analysisMetric:nth-child(3),
        #learningAnalysisV12>.analysisPanel:first-child .analysisMetric:nth-child(4){display:none!important}
        #learningAnalysisV12>.analysisPanel:first-child .analysisMetric{padding:11px 12px;border-radius:14px}
        #learningAnalysisV12>.analysisPanel:first-child .analysisMetricLabel{font-size:10px}
        #learningAnalysisV12>.analysisPanel:first-child .analysisMetricValue{font-size:22px;margin-top:3px}
        #learningAnalysisV12>.analysisPanel:first-child .analysisMetricSub{font-size:9px;line-height:1.35;margin-top:4px}
        #learningAnalysisV12>.analysisPanel:first-child .analysisMaturity{padding:8px 10px;margin-top:8px;border-radius:12px;display:flex;align-items:center;gap:7px}
        #learningAnalysisV12>.analysisPanel:first-child .analysisMaturity strong{font-size:10px;white-space:nowrap}
        #learningAnalysisV12>.analysisPanel:first-child .analysisMaturity span{font-size:9px;line-height:1.3}

        .analysisDetailsV122{border:1px solid var(--line);border-radius:16px;background:var(--card);overflow:hidden;box-shadow:var(--shadow);margin:0}
        .analysisDetailsV122>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px 14px;cursor:pointer;font-size:13px;font-weight:950;user-select:none}
        .analysisDetailsV122>summary::-webkit-details-marker{display:none}
        .analysisDetailsV122>summary::after{content:'▾';font-size:14px;color:var(--muted);transition:transform .18s ease}
        .analysisDetailsV122[open]>summary::after{transform:rotate(180deg)}
        .analysisDetailsV122[open]>summary{border-bottom:1px solid var(--line)}
        .analysisDetailsV122Inner{display:grid;gap:8px;padding:8px}
        .analysisDetailsV122Inner>.analysisPanel,
        .analysisDetailsV122Inner>.backupPanel{margin:0;box-shadow:none;padding:12px;border-radius:14px}
        .analysisDetailsV122Inner .analysisPanelTitle{font-size:15px}
        .analysisDetailsV122Inner .analysisPanelText{font-size:9px}
        .analysisDetailsV122Inner .analysisAreaGrid{grid-template-columns:1fr;gap:7px}
        .analysisDetailsV122Inner .analysisAreaCard{padding:10px;border-radius:12px}
        .analysisDetailsV122Inner .analysisAreaName{font-size:12px;line-height:1.25;overflow-wrap:anywhere}
        .analysisDetailsV122Inner .analysisAreaScore{font-size:16px}
        .analysisDetailsV122Inner .analysisAreaMeta{font-size:9px;margin-top:3px}
        .analysisDetailsV122Inner .analysisBar{height:6px;margin-top:7px}
        .analysisDetailsV122Inner .analysisBarLabel{font-size:8px;margin-top:3px}
        .analysisDetailsV122Inner .analysisTopicList{gap:6px}
        .analysisDetailsV122Inner .analysisTopic{padding:8px 9px;border-radius:11px}
        .analysisDetailsV122Inner .analysisTopicName{font-size:10px;overflow-wrap:anywhere}
        .analysisDetailsV122Inner .analysisTopicScore{font-size:13px}
        .analysisDetailsV122Inner .analysisTopicMeta{font-size:8px;margin-top:2px}
        .analysisDetailsV122Inner .analysisSource{padding:8px 9px;border-radius:11px}
        .analysisDetailsV122Inner .analysisSourceName{font-size:10px}
        .analysisDetailsV122Inner .analysisSourceMeta{font-size:8px}
        .analysisDetailsV122Inner .analysisSourceScore{font-size:13px}
        .analysisDetailsV122Inner .analysisNotice{font-size:9px;line-height:1.4;padding:8px 9px;margin-top:7px}
        .analysisDetailsV122Inner .backupTitle{font-size:15px}
        .analysisDetailsV122Inner .backupText{font-size:9px;line-height:1.4}
        .analysisDetailsV122Inner .backupMeta{display:none!important}

        .analysisCurriculumHiddenV122{display:none!important}

        @media(max-width:460px){
          #statsHome{padding:12px}
          #statsHome .sectionTitle{font-size:19px}
          .analysisQuickV122{gap:6px}
          .analysisQuickV122Item{padding:8px}
          .analysisQuickV122Item strong{font-size:14px}
          .analysisQuickV122Item span{font-size:8px}
          .analysisPanel{padding:12px}
          .analysisPanelTitle{font-size:16px}
          #learningAnalysisV12>.analysisPanel:first-child .analysisMetric{padding:10px}
          #learningAnalysisV12>.analysisPanel:first-child .analysisMetricValue{font-size:20px}
          #learningAnalysisV12>.analysisPanel:first-child .analysisMaturity{align-items:flex-start;flex-direction:column;gap:3px}
          .analysisDetailsV122>summary{padding:12px;font-size:12px}
        }
        @media(max-width:350px){
          .analysisQuickV122{grid-template-columns:1fr}
          #learningAnalysisV12>.analysisPanel:first-child .analysisSummaryGrid{grid-template-columns:1fr}
        }
      `;
      document.head.appendChild(style);
    }

    var title=statsHome.querySelector('.sectionTitle');
    if(title)title.textContent='Lernanalyse & Statistik';
    var intro=statsHome.querySelector('.statsHomeText');
    if(intro)intro.textContent='Dein aktueller Lernstand – kompakt und ohne unnötige Detailansichten.';
    var launcherTitle=document.querySelector('.statsLauncherTitle');
    if(launcherTitle)launcherTitle.textContent='Lernanalyse & Statistik';
    var launcherText=document.querySelector('.statsLauncherText');
    if(launcherText)launcherText.textContent='Lernstand, Abdeckung und weitere Details auf Wunsch.';

    var quick=byId('analysisQuickV122');
    if(!quick){
      quick=document.createElement('div');
      quick.id='analysisQuickV122';
      quick.className='analysisQuickV122';
      quick.innerHTML='<div class="analysisQuickV122Item"><strong id="v122Learned">0 / 520</strong><span>bearbeitet</span></div><div class="analysisQuickV122Item"><strong id="v122Errors">0</strong><span>Fehlerpool</span></div><div class="analysisQuickV122Item"><strong id="v122Quiz">0</strong><span>Quiz absolviert</span></div>';
      statsHome.appendChild(quick);
    }

    var overview=closestPanel(byId('a12OverallScore'));
    var areas=closestPanel(byId('a12AreaGrid'));
    var curriculum=closestPanel(byId('a12CurriculumGrid'));
    var weak=closestPanel(byId('a12WeakTopics'));
    var strong=closestPanel(byId('a12StrongTopics'));
    var sources=closestPanel(byId('a12Sources'));
    var backup=statsSection.querySelector('.backupPanel');

    if(curriculum){
      curriculum.classList.add('analysisCurriculumHiddenV122');
      curriculum.setAttribute('aria-hidden','true');
    }

    if(overview){
      var overviewTitle=overview.querySelector('.analysisPanelTitle');
      var overviewText=overview.querySelector('.analysisPanelText');
      if(overviewTitle)overviewTitle.textContent='Lernstand im Überblick';
      if(overviewText)overviewText.textContent='Bewertungsquote und Abdeckung zeigen dir auf einen Blick, wie sicher und wie breit du bereits gelernt hast.';
      if(overview!==root.firstElementChild)root.insertBefore(overview,root.firstElementChild);
    }

    var details=byId('analysisDetailsV122');
    if(!details){
      details=document.createElement('details');
      details.id='analysisDetailsV122';
      details.className='analysisDetailsV122';
      details.innerHTML='<summary>Weitere Details</summary><div class="analysisDetailsV122Inner"></div>';
    }
    var inner=details.querySelector('.analysisDetailsV122Inner');

    var split=weak&&weak.parentElement&&weak.parentElement.classList.contains('analysisSplit')?weak.parentElement:null;
    var splitStrong=strong&&strong.parentElement&&strong.parentElement.classList.contains('analysisSplit')?strong.parentElement:null;

    [areas,weak,strong,sources,backup].forEach(function(panel){
      if(panel&&panel.parentNode!==inner)inner.appendChild(panel);
    });

    if(split&&split.children.length===0&&split.parentNode)split.parentNode.removeChild(split);
    if(splitStrong&&splitStrong!==split&&splitStrong.children.length===0&&splitStrong.parentNode)splitStrong.parentNode.removeChild(splitStrong);

    if(overview){
      if(details.parentNode!==root)root.insertBefore(details,overview.nextSibling);
      else if(details.previousElementSibling!==overview)root.insertBefore(details,overview.nextSibling);
    }else if(details.parentNode!==root){
      root.insertBefore(details,root.firstChild);
    }

    function syncQuick(){
      var learned=byId('statsLearned');
      var total=byId('statsTotal');
      var errors=byId('statsErrors');
      var quizText=byId('statsQuizCount');
      var learnedTarget=byId('v122Learned');
      var errorsTarget=byId('v122Errors');
      var quizTarget=byId('v122Quiz');
      if(learnedTarget)learnedTarget.textContent=(learned?learned.textContent:'0')+' / '+(total?total.textContent:'520');
      if(errorsTarget)errorsTarget.textContent=errors?errors.textContent:'0';
      if(quizTarget){
        var raw=quizText?String(quizText.textContent||'0'):'0';
        var match=raw.match(/\d+/);
        quizTarget.textContent=match?match[0]:'0';
      }
    }
    syncQuick();

    if(!window.__FachteilLuchsAnalysisV122Wrapped&&typeof updateHomeStats==='function'){
      window.__FachteilLuchsAnalysisV122Wrapped=true;
      var previousUpdateHomeStats=updateHomeStats;
      updateHomeStats=function(){
        previousUpdateHomeStats();
        syncQuick();
      };
    }

    return true;
  }

  if(!compactAnalysis()){
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      if(compactAnalysis()||tries>50)clearInterval(timer);
    },50);
  }
})();
