(function(){
  'use strict';
  if(window.__FachteilBinderStage3HotfixV202)return;
  window.__FachteilBinderStage3HotfixV202=true;

  var STAGE_ID=3;
  var NEXT_STAGE=4;

  function api(){return window.FachteilBinderTrainerV20||null;}

  function cloneState(){
    var a=api();
    if(!a||typeof a.exportState!=='function')return null;
    try{return a.exportState();}catch(e){return null;}
  }

  function profileIds(){
    var a=api();
    if(!a||!Array.isArray(a.profiles))return [];
    return a.profiles.map(function(p){return p&&p.id;}).filter(Boolean);
  }

  function allProfilesSeen(state){
    var ids=profileIds();
    if(!ids.length||!state)return false;
    var seen=state.profilesSeen||{};
    return ids.every(function(id){return !!seen[id];});
  }

  function writeCompletedState(state){
    var a=api();
    if(!a||typeof a.importState!=='function'||!state)return false;
    state.completed=state.completed||{};
    state.best=state.best||{};
    state.completed[STAGE_ID]=true;
    state.best[STAGE_ID]=Math.max(Number(state.best[STAGE_ID])||0,100);
    state.unlocked=Math.max(Number(state.unlocked)||1,NEXT_STAGE);
    try{return a.importState(state)!==false;}catch(e){return false;}
  }

  function repairExisting(){
    var state=cloneState();
    if(!state)return false;

    if(state.completed&&state.completed[STAGE_ID]){
      if((Number(state.unlocked)||1)<NEXT_STAGE)return writeCompletedState(state);
      return false;
    }

    if((Number(state.unlocked)||1)!==STAGE_ID)return false;
    if(Number(state.lastStage)!==STAGE_ID)return false;
    if(!allProfilesSeen(state))return false;

    return writeCompletedState(state);
  }

  function forceComplete(){
    var state=cloneState();
    if(!state)return false;
    return writeCompletedState(state);
  }

  function isLastProfileScreen(){
    var root=document.getElementById('binderTrainer');
    if(!root)return false;
    var next=document.getElementById('btNextProfile');
    var badge=root.querySelector('.btProfileTop .badge');
    if(!next||!badge)return false;
    var m=String(badge.textContent||'').match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
    return !!(m&&Number(m[1])===Number(m[2])&&Number(m[2])>0);
  }

  function hookFinalButton(){
    var btn=document.getElementById('btNextProfile');
    if(!btn||btn.dataset.stage3Hotfix==='1'||!isLastProfileScreen())return;

    btn.dataset.stage3Hotfix='1';
    btn.addEventListener('click',function(){
      setTimeout(function(){
        forceComplete();

        var continueBtn=document.getElementById('btContinueDuel');
        if(!continueBtn){
          var a=api();
          if(a&&typeof a.open==='function')a.open();
        }
      },0);
    });
  }

  function apply(){
    repairExisting();
    hookFinalButton();
  }

  window.FachteilBinderStage3HotfixV202={
    repair:repairExisting,
    forceComplete:forceComplete,
    allProfilesSeen:allProfilesSeen
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',apply);
  }else{
    setTimeout(apply,0);
  }

  var tries=0;
  var timer=setInterval(function(){
    tries++;
    apply();
    if(tries>80)clearInterval(timer);
  },125);

  if(typeof MutationObserver!=='undefined'){
    new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
  }
})();
