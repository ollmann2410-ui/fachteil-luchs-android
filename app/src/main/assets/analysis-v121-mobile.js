(function(){
  'use strict';
  if(window.__FachteilLuchsAnalysisV121)return;
  window.__FachteilLuchsAnalysisV121=true;

  function applyV121(){
    const root=document.getElementById('learningAnalysisV12');
    const statsHome=document.getElementById('statsHome');
    if(!root||!statsHome)return false;

    if(!document.getElementById('analysis-v121-styles')){
      const style=document.createElement('style');
      style.id='analysis-v121-styles';
      style.textContent=`
        /* V1.2.1: kompakte Teilnehmeransicht */
        #statsHome .statsGrid,
        #statsHome .statsProgressMeta,
        #statsHome .statsProgress,
        #statsHome .statsWeakLine{display:none!important}
        #statsHome{padding:14px 15px;margin-bottom:12px}
        #statsHome .statsHomeHead{align-items:center;margin:0}
        #statsHome .statsHomeText{max-width:64ch}

        .analysisV12{gap:12px;margin-top:12px}
        .analysisPanel{padding:14px}
        .analysisPanelHead{margin-bottom:10px;gap:9px}
        .analysisPanelTitle{font-size:17px}
        .analysisPanelText{font-size:11px;line-height:1.42}

        .analysisSummaryGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
        .analysisSummaryGrid .analysisMetric:nth-child(3),
        .analysisSummaryGrid .analysisMetric:nth-child(4){display:none!important}
        .analysisMetric{padding:11px 12px;border-radius:14px}
        .analysisMetricLabel{font-size:10px}
        .analysisMetricValue{font-size:21px;margin-top:3px}
        .analysisMetricSub{font-size:10px;margin-top:4px}
        .analysisMaturity{margin-top:9px;padding:9px 10px;border-radius:12px;gap:6px}
        .analysisMaturity strong{font-size:11px}
        .analysisMaturity span{font-size:10px;line-height:1.35}

        .analysisAreaGrid{grid-template-columns:1fr;gap:8px}
        .analysisAreaCard{padding:11px 12px;border-radius:14px}
        .analysisAreaName{font-size:13px;line-height:1.25;overflow-wrap:anywhere}
        .analysisAreaScore{font-size:18px}
        .analysisAreaMeta{font-size:10px;margin-top:4px}
        .analysisBar{height:7px;margin-top:8px}
        .analysisBarLabel{font-size:9px;margin-top:4px}

        .analysisTopicList{gap:7px}
        .analysisTopic{padding:9px 10px;border-radius:12px}
        .analysisTopicName{font-size:11px;overflow-wrap:anywhere}
        .analysisTopicScore{font-size:14px}
        .analysisTopicMeta{font-size:9px;margin-top:3px}

        .analysisMore{border:1px solid var(--line);border-radius:16px;background:var(--card);overflow:hidden;box-shadow:var(--shadow)}
        .analysisMore>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 15px;cursor:pointer;font-size:14px;font-weight:950;user-select:none}
        .analysisMore>summary::-webkit-details-marker{display:none}
        .analysisMore>summary::after{content:'▾';font-size:15px;color:var(--muted);transition:transform .18s ease}
        .analysisMore[open]>summary::after{transform:rotate(180deg)}
        .analysisMore[open]>summary{border-bottom:1px solid var(--line)}
        .analysisMoreInner{display:grid;gap:10px;padding:10px}
        .analysisMoreInner>.analysisPanel{box-shadow:none;margin:0}
        .analysisMoreInner .analysisCurriculumGrid{grid-template-columns:1fr;gap:7px}
        .analysisMoreInner .analysisCurriculumCard{padding:10px 11px;border-radius:12px}
        .analysisMoreInner .analysisCurriculumCard strong{font-size:18px}
        .analysisMoreInner .analysisSource{grid-template-columns:minmax(0,1fr) auto;padding:9px 10px;border-radius:12px}
        .analysisMoreInner .analysisSourceName{font-size:11px;overflow-wrap:anywhere}
        .analysisMoreInner .analysisSourceMeta{font-size:9px}
        .analysisMoreInner .analysisSourceScore{font-size:14px}
        .analysisMoreInner .analysisNotice{font-size:10px;padding:9px 10px;margin-top:8px}

        @media(max-width:640px){
          #statsHome .statsHomeHead{flex-direction:row;align-items:flex-start}
          #statsHome .sectionTitle{font-size:20px}
          #statsHome .statsHomeText{font-size:11px;line-height:1.4}
          #statsHome .badge{font-size:10px;padding:6px 8px;white-space:nowrap}
          .analysisV12{gap:10px;margin-top:10px}
          .analysisPanel{padding:12px}
          .analysisPanelHead{margin-bottom:8px}
          .analysisPanelTitle{font-size:15px}
          .analysisPanelText{font-size:10px}
          .analysisChip{font-size:9px;padding:4px 7px}
          .analysisSummaryGrid{gap:7px}
          .analysisMetric{padding:10px}
          .analysisMetricValue{font-size:19px}
          .analysisAreaCard{padding:10px}
          .analysisAreaTop{align-items:flex-start}
          .analysisAreaName{font-size:12px;max-width:78%}
          .analysisAreaScore{font-size:17px}
          .analysisMore>summary{padding:12px 13px;font-size:13px}
          .analysisMoreInner{padding:8px;gap:8px}
        }
        @media(max-width:380px){
          .analysisSummaryGrid{grid-template-columns:1fr}
          #statsHome .statsHomeHead{flex-direction:column}
        }
      `;
      document.head.appendChild(style);
    }

    const panels=[...root.children];
    const overview=panels.find(p=>p.querySelector&&p.querySelector('#a12OverallScore'));
    const areas=panels.find(p=>p.querySelector&&p.querySelector('#a12AreaGrid'));
    const curriculum=panels.find(p=>p.querySelector&&p.querySelector('#a12CurriculumGrid'));
    const weak=document.getElementById('a12WeakTopics')?.closest('.analysisPanel');
    const strong=document.getElementById('a12StrongTopics')?.closest('.analysisPanel');
    const sources=document.getElementById('a12Sources')?.closest('.analysisPanel');
    const split=weak?.parentElement?.classList.contains('analysisSplit')?weak.parentElement:null;

    if(overview&&areas&&weak){
      if(overview!==root.children[0])root.insertBefore(overview,root.firstChild);
      root.insertBefore(areas,overview.nextSibling);
      root.insertBefore(weak,areas.nextSibling);
    }

    let more=document.getElementById('analysisMoreV121');
    if(!more){
      more=document.createElement('details');
      more.id='analysisMoreV121';
      more.className='analysisMore';
      more.innerHTML='<summary>Weitere Analysen anzeigen</summary><div class="analysisMoreInner"></div>';
      if(weak&&weak.parentNode===root)root.insertBefore(more,weak.nextSibling);
      else root.appendChild(more);
    }
    const inner=more.querySelector('.analysisMoreInner');
    [strong,curriculum,sources].forEach(panel=>{if(panel&&panel.parentNode!==inner)inner.appendChild(panel);});

    if(split&&split.children.length===0)split.remove();

    const maturityValue=document.getElementById('a12Maturity');
    const statusBadge=document.getElementById('statsStatusBadge');
    if(maturityValue&&statusBadge){
      const syncBadge=()=>{
        const value=(maturityValue.textContent||'Anlauf').trim();
        statusBadge.textContent=`Datenbasis: ${value}`;
      };
      syncBadge();
      new MutationObserver(syncBadge).observe(maturityValue,{childList:true,subtree:true,characterData:true});
    }

    const chip=root.querySelector('.analysisChip');
    if(chip)chip.textContent='Analyse V1.2.1';

    const title=document.querySelector('#statsHome .sectionTitle');
    if(title)title.textContent='Lernanalyse & Statistik';
    const text=document.querySelector('#statsHome .statsHomeText');
    if(text)text.textContent='Dein Lernstand kompakt: Gesamtstand, Bereiche und aktuelle Schwächen. Weitere Details sind aufklappbar.';

    return true;
  }

  if(!applyV121()){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(applyV121()||tries>40)clearInterval(timer);
    },50);
  }
})();
