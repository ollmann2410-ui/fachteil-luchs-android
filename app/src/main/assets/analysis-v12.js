(function(){
  'use strict';
  if(window.__FachteilLuchsAnalysisV12)return;
  window.__FachteilLuchsAnalysisV12=true;

  const el=id=>document.getElementById(id);
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const pct=v=>v===null||v===undefined||Number.isNaN(Number(v))?'–':`${Math.round(Number(v))}%`;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

  if(typeof AREAS==='undefined'||typeof ALL_CARDS==='undefined'||typeof aggregateAnalysis!=='function'||!el('stats'))return;

  const style=document.createElement('style');
  style.id='analysis-v12-styles';
  style.textContent=`
    .analysisV12{display:grid;gap:16px;margin-top:16px}
    .analysisPanel{padding:18px}
    .analysisPanelHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
    .analysisPanelTitle{font-size:18px;font-weight:950;letter-spacing:-.02em}
    .analysisPanelText{font-size:12px;line-height:1.5;color:var(--muted);margin-top:4px;max-width:78ch}
    .analysisSummaryGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
    .analysisMetric{padding:14px;border:1px solid var(--line);border-radius:17px;background:rgba(127,127,127,.035);min-width:0}
    .analysisMetricLabel{font-size:11px;color:var(--muted);font-weight:850}
    .analysisMetricValue{font-size:24px;font-weight:950;letter-spacing:-.03em;margin-top:5px;line-height:1.15}
    .analysisMetricSub{font-size:11px;color:var(--muted);line-height:1.4;margin-top:5px}
    .analysisMaturity{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px;padding:12px 13px;border:1px solid var(--line);border-radius:15px;background:var(--soft)}
    .analysisMaturity strong{font-size:13px}.analysisMaturity span{font-size:11px;color:var(--muted);line-height:1.45}
    .analysisAreaGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
    .analysisAreaCard{padding:14px;border:1px solid var(--line);border-radius:17px;background:rgba(127,127,127,.035)}
    .analysisAreaTop{display:flex;align-items:center;justify-content:space-between;gap:10px}
    .analysisAreaName{font-size:15px;font-weight:950}.analysisAreaScore{font-size:21px;font-weight:950}
    .analysisAreaMeta{font-size:11px;color:var(--muted);margin-top:5px;line-height:1.4}
    .analysisBar{height:8px;border-radius:999px;overflow:hidden;background:var(--soft);border:1px solid var(--line);margin-top:10px;position:relative}
    .analysisBar>span{display:block;height:100%;background:linear-gradient(90deg,var(--primary),var(--primary2));width:0;transition:width .25s ease}
    .analysisBar.coverage>span{opacity:.72}
    .analysisBarLabel{display:flex;justify-content:space-between;gap:8px;font-size:10px;color:var(--muted);font-weight:800;margin-top:5px}
    .analysisCurriculumGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .analysisCurriculumCard{padding:14px;border:1px solid var(--line);border-radius:16px;background:rgba(127,127,127,.035)}
    .analysisCurriculumCard strong{display:block;font-size:22px;margin-top:4px}.analysisCurriculumCard span{font-size:11px;color:var(--muted)}
    .analysisSplit{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .analysisTopicList{display:grid;gap:8px}
    .analysisTopic{padding:11px 12px;border:1px solid var(--line);border-radius:14px;background:rgba(127,127,127,.035)}
    .analysisTopicTop{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
    .analysisTopicName{font-size:12px;font-weight:900;line-height:1.35}.analysisTopicScore{font-size:15px;font-weight:950;white-space:nowrap}
    .analysisTopicMeta{font-size:10px;color:var(--muted);margin-top:4px;line-height:1.4}
    .analysisEmpty{padding:18px 10px;text-align:center;color:var(--muted);font-size:12px;line-height:1.5}
    .analysisSourceList{display:grid;gap:8px}
    .analysisSource{display:grid;grid-template-columns:minmax(130px,1fr) auto;gap:10px;align-items:center;padding:10px 12px;border:1px solid var(--line);border-radius:14px;background:rgba(127,127,127,.035)}
    .analysisSourceName{font-size:12px;font-weight:900}.analysisSourceMeta{font-size:10px;color:var(--muted);margin-top:3px}.analysisSourceScore{font-size:15px;font-weight:950}
    .analysisNotice{font-size:11px;line-height:1.5;color:var(--muted);padding:12px 13px;border-left:3px solid var(--primary);background:var(--soft);border-radius:0 12px 12px 0;margin-top:12px}
    .analysisChip{display:inline-flex;align-items:center;padding:5px 8px;border:1px solid var(--line);border-radius:999px;background:var(--soft);font-size:10px;font-weight:900}
    @media(max-width:720px){.analysisSummaryGrid{grid-template-columns:1fr 1fr}.analysisAreaGrid{grid-template-columns:1fr}.analysisCurriculumGrid{grid-template-columns:1fr 1fr 1fr}.analysisSplit{grid-template-columns:1fr}.analysisPanel{padding:15px}}
    @media(max-width:460px){.analysisSummaryGrid{grid-template-columns:1fr 1fr}.analysisMetricValue{font-size:21px}.analysisCurriculumGrid{grid-template-columns:1fr}.analysisPanelHead{flex-direction:column}.analysisSource{grid-template-columns:1fr auto}}
  `;
  document.head.appendChild(style);

  const statsHome=el('statsHome');
  const statsSection=el('stats');
  const backup=statsSection?statsSection.querySelector('.backupPanel'):null;
  if(!statsHome||!backup)return;

  const sectionTitle=statsHome.querySelector('.sectionTitle');
  if(sectionTitle)sectionTitle.textContent='Lernanalyse & Statistik';
  const sectionText=statsHome.querySelector('.statsHomeText');
  if(sectionText)sectionText.textContent='Dein Lernstand wird nach Bereichen und Unterthemen ausgewertet. Trefferquote und Abdeckung werden bewusst getrennt betrachtet.';
  const launcherTitle=document.querySelector('.statsLauncherTitle');
  if(launcherTitle)launcherTitle.textContent='Lernanalyse & Statistik';
  const launcherText=document.querySelector('.statsLauncherText');
  if(launcherText)launcherText.textContent='Leistung, Abdeckung, Handlungsfelder, Unterthemen und Datenreife auf einen Blick.';

  const root=document.createElement('div');
  root.id='learningAnalysisV12';
  root.className='analysisV12';
  root.innerHTML=`
    <div class="card analysisPanel">
      <div class="analysisPanelHead">
        <div><div class="analysisPanelTitle">Lernstand im Überblick</div><div class="analysisPanelText">Die Bewertungsquote zeigt, wie sicher deine bereits bearbeiteten Karten sitzen. Die Abdeckung zeigt, wie breit du schon durch den gesamten Kartenbestand gegangen bist.</div></div>
        <div class="analysisChip">Analyse V1.2</div>
      </div>
      <div class="analysisSummaryGrid">
        <div class="analysisMetric"><div class="analysisMetricLabel">Bewertungsquote</div><div class="analysisMetricValue" id="a12OverallScore">–</div><div class="analysisMetricSub" id="a12OverallScoreSub">Noch keine Bewertungen</div></div>
        <div class="analysisMetric"><div class="analysisMetricLabel">Abdeckung</div><div class="analysisMetricValue" id="a12Coverage">0%</div><div class="analysisMetricSub" id="a12CoverageSub">0 von 520 Karten</div></div>
        <div class="analysisMetric"><div class="analysisMetricLabel">Datenreife</div><div class="analysisMetricValue" id="a12Maturity">Anlauf</div><div class="analysisMetricSub" id="a12MaturitySub">Analyse baut sich auf</div></div>
        <div class="analysisMetric"><div class="analysisMetricLabel">Bewertungen gesamt</div><div class="analysisMetricValue" id="a12Assessments">0</div><div class="analysisMetricSub" id="a12Views">0 Karten angesehen</div></div>
      </div>
      <div class="analysisMaturity"><strong id="a12MaturityLabel">Noch wenig Daten</strong><span id="a12MaturityText">Mit jeder bearbeiteten Karte wird die Analyse verlässlicher.</span></div>
    </div>

    <div class="card analysisPanel">
      <div class="analysisPanelHead"><div><div class="analysisPanelTitle">Bereiche in der App</div><div class="analysisPanelText">HF 1, HF 2, HF 3 und Aufmaß getrennt. Die Prozentzahl bewertet nur bereits beantwortete Karten; die Abdeckung steht separat darunter.</div></div></div>
      <div class="analysisAreaGrid" id="a12AreaGrid"></div>
    </div>

    <div class="card analysisPanel">
      <div class="analysisPanelHead"><div><div class="analysisPanelTitle">Rahmenlehrplan-Sicht</div><div class="analysisPanelText">Fachliche Zuordnung nach Handlungsfeldern. Aufmaß bleibt in der App ein eigener Lernbereich, wird hier aber curricular HF 2 zugerechnet.</div></div></div>
      <div class="analysisCurriculumGrid" id="a12CurriculumGrid"></div>
    </div>

    <div class="analysisSplit">
      <div class="card analysisPanel">
        <div class="analysisPanelHead"><div><div class="analysisPanelTitle">Schwächste Unterthemen</div><div class="analysisPanelText">Unterthemen mit der niedrigsten bisherigen Bewertungsquote. Sehr kleine Datenmengen werden kenntlich gemacht.</div></div></div>
        <div class="analysisTopicList" id="a12WeakTopics"></div>
      </div>
      <div class="card analysisPanel">
        <div class="analysisPanelHead"><div><div class="analysisPanelTitle">Stärkste Unterthemen</div><div class="analysisPanelText">Bereiche, in denen deine bisherigen Bewertungen am sichersten ausfallen.</div></div></div>
        <div class="analysisTopicList" id="a12StrongTopics"></div>
      </div>
    </div>

    <div class="card analysisPanel">
      <div class="analysisPanelHead"><div><div class="analysisPanelTitle">Woher kommen deine Lerndaten?</div><div class="analysisPanelText">Freies Lernen, Fehlerpool, Quiz und Zufallskarten werden getrennt erfasst. So bleibt später nachvollziehbar, wie sich dein Lernstand zusammensetzt.</div></div></div>
      <div class="analysisSourceList" id="a12Sources"></div>
      <div class="analysisNotice">Diese Ansicht ist bewusst noch keine Prüfungsreife-Prognose. Eine solche Aussage bauen wir erst auf, wenn genug unterschiedliche Karten und Handlungsfelder abgedeckt sind.</div>
    </div>`;
  backup.parentNode.insertBefore(root,backup);

  function assessmentTotals(){
    let assessments=0,views=0;
    const cards=analysisState&&analysisState.cards?analysisState.cards:{};
    Object.values(cards).forEach(e=>{assessments+=Number(e&&e.assessmentCount)||0;views+=Number(e&&e.viewCount)||0;});
    return {assessments,views};
  }

  function topicStats(){
    const groups=new Map();
    ALL_CARDS.forEach(c=>{
      const area=c.curriculumArea||c._area||'hf1';
      const sub=c.subtopic||c.category||'Sonstiges';
      const key=`${area}|${sub}`;
      if(!groups.has(key))groups.set(key,{area,subtopic:sub,cards:[]});
      groups.get(key).cards.push(c);
    });
    return [...groups.values()].map(g=>Object.assign(g,aggregateAnalysis(g.cards))).filter(g=>g.assessed>0);
  }

  function sourceStats(){
    const sums={};
    const cards=analysisState&&analysisState.cards?analysisState.cards:{};
    Object.values(cards).forEach(e=>{
      const sc=e&&e.sourceCounts&&typeof e.sourceCounts==='object'?e.sourceCounts:{};
      Object.entries(sc).forEach(([source,b])=>{
        if(!sums[source])sums[source]={assessments:0,views:0,known:0,unsure:0,wrong:0,scoreSum:0};
        const s=sums[source];
        ['assessments','views','known','unsure','wrong','scoreSum'].forEach(k=>s[k]+=Number(b&&b[k])||0);
      });
    });
    return sums;
  }

  function sourceLabel(s){
    const map={lernen:'Freies Lernen',fehlerpool:'Fehlerpool',quiz:'Quiz', 'quiz-offen':'Quiz · offen','quiz-nachlernen':'Quiz-Nachlernen',zufall:'20 Karten zufällig',migration:'Übernommener Lernstand',import:'Import'};
    return map[s]||String(s).replace(/[-_]/g,' ');
  }

  function maturityCopy(m){
    if(m.level==='Belastbar')return ['Belastbare Datengrundlage','Viele unterschiedliche Karten und alle vier App-Bereiche sind ausreichend abgedeckt.'];
    if(m.level==='Aussagekräftig')return ['Aussagekräftige Analyse','Die Tendenzen sind bereits brauchbar, aber einzelne Bereiche können noch dünn belegt sein.'];
    if(m.level==='Aufbau')return ['Analyse im Aufbau','Erste Muster werden sichtbar. Für stabile Aussagen fehlen noch mehr unterschiedliche Karten.'];
    return ['Noch wenig Daten','Mit jeder bearbeiteten Karte wird die Analyse verlässlicher.'];
  }

  function renderAreaCard(key,a,s){
    const score=s.value===null?'–':pct(s.value);
    const scoreWidth=s.value===null?0:clamp(s.value,0,100);
    return `<div class="analysisAreaCard">
      <div class="analysisAreaTop"><div class="analysisAreaName">${esc(a.short)} · ${esc(a.title)}</div><div class="analysisAreaScore">${score}</div></div>
      <div class="analysisAreaMeta">${s.assessed} von ${s.total} Karten bewertet</div>
      <div class="analysisBar"><span style="width:${scoreWidth}%"></span></div>
      <div class="analysisBarLabel"><span>Bewertungsquote</span><span>${score}</span></div>
      <div class="analysisBar coverage"><span style="width:${clamp(s.coverage,0,100)}%"></span></div>
      <div class="analysisBarLabel"><span>Abdeckung</span><span>${pct(s.coverage)}</span></div>
    </div>`;
  }

  function renderTopicRow(t){
    const area=String(t.area||'').toUpperCase();
    const tiny=t.assessed<3?' · noch wenig Daten':'';
    return `<div class="analysisTopic"><div class="analysisTopicTop"><div class="analysisTopicName">${esc(t.subtopic)}</div><div class="analysisTopicScore">${pct(t.value)}</div></div><div class="analysisTopicMeta">${esc(area)} · ${t.assessed}/${t.total} Karten bewertet · ${pct(t.coverage)} Abdeckung${tiny}</div></div>`;
  }

  function renderLearningAnalysisV12(){
    try{
      if(typeof initializeAnalysisState==='function')initializeAnalysisState();
      const overall=aggregateAnalysis(ALL_CARDS),maturity=analysisDataMaturity(),totals=assessmentTotals();
      el('a12OverallScore').textContent=pct(overall.value);
      el('a12OverallScoreSub').textContent=overall.assessed?`${overall.assessed} unterschiedliche Karten bewertet`:'Noch keine Bewertungen';
      el('a12Coverage').textContent=pct(overall.coverage);
      el('a12CoverageSub').textContent=`${overall.assessed} von ${overall.total} Karten`;
      el('a12Maturity').textContent=maturity.level==='Anlaufmodus'?'Anlauf':maturity.level;
      el('a12MaturitySub').textContent=`${maturity.activeAreas}/4 App-Bereiche aktiv`;
      el('a12Assessments').textContent=String(totals.assessments);
      el('a12Views').textContent=`${totals.views} Antworten angesehen`;
      const mc=maturityCopy(maturity);el('a12MaturityLabel').textContent=mc[0];el('a12MaturityText').textContent=mc[1];

      const areaStats=analysisLibraryStats();
      el('a12AreaGrid').innerHTML=Object.entries(AREAS).map(([k,a])=>renderAreaCard(k,a,areaStats[k])).join('');

      const curr=analysisCurriculumStats();
      el('a12CurriculumGrid').innerHTML=['hf1','hf2','hf3'].map(k=>{
        const s=curr[k],label=k.toUpperCase();
        return `<div class="analysisCurriculumCard"><span>${label}</span><strong>${pct(s.value)}</strong><span>${s.assessed}/${s.total} Karten · ${pct(s.coverage)} Abdeckung</span></div>`;
      }).join('');

      const topics=topicStats();
      const sufficientlyMeasured=topics.filter(t=>t.assessed>=2);
      const rankBase=sufficientlyMeasured.length>=3?sufficientlyMeasured:topics;
      const weak=[...rankBase].sort((a,b)=>(a.value==null?101:a.value)-(b.value==null?101:b.value)||b.assessed-a.assessed).slice(0,5);
      const strong=[...rankBase].sort((a,b)=>(b.value==null?-1:b.value)-(a.value==null?-1:a.value)||b.assessed-a.assessed).slice(0,5);
      el('a12WeakTopics').innerHTML=weak.length?weak.map(renderTopicRow).join(''):'<div class="analysisEmpty">Noch nicht genug Unterthemen bewertet. Nach einigen Lernkarten erscheinen hier automatisch deine schwächsten Themen.</div>';
      el('a12StrongTopics').innerHTML=strong.length?strong.map(renderTopicRow).join(''):'<div class="analysisEmpty">Noch nicht genug Unterthemen bewertet. Deine Stärken werden hier sichtbar, sobald mehr Lerndaten vorliegen.</div>';

      const sources=sourceStats();
      const rows=Object.entries(sources).filter(([,s])=>s.assessments>0||s.views>0).sort((a,b)=>b[1].assessments-a[1].assessments);
      el('a12Sources').innerHTML=rows.length?rows.map(([name,s])=>{
        const score=s.assessments?Math.round(s.scoreSum/s.assessments*100):null;
        return `<div class="analysisSource"><div><div class="analysisSourceName">${esc(sourceLabel(name))}</div><div class="analysisSourceMeta">${s.assessments} Bewertungen · ${s.views} Ansichten</div></div><div class="analysisSourceScore">${pct(score)}</div></div>`;
      }).join(''):'<div class="analysisEmpty">Noch keine Lerndaten vorhanden.</div>';
    }catch(err){
      console.error('Fachteil-Luchs Analyse V1.2:',err);
    }
  }

  window.renderLearningAnalysisV12=renderLearningAnalysisV12;
  if(typeof updateHomeStats==='function'){
    const baseUpdateHomeStats=updateHomeStats;
    updateHomeStats=function(){baseUpdateHomeStats();renderLearningAnalysisV12();};
  }
  renderLearningAnalysisV12();
})();
