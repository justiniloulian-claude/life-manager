'use strict';

// ============================================================
// COLOR OPTIONS
// ============================================================
const COLORS = [
  { name: 'Default',  value: '',        cls: 'cd-default', chipCls: '' },
  { name: 'Yellow',   value: '#fef9c3', cls: '', chipCls: 'cc-yellow',  taskCls: 'tc-yellow',  noteCls: 'nc-yellow'  },
  { name: 'Peach',    value: '#fde68a', cls: '', chipCls: 'cc-peach',   taskCls: 'tc-peach',   noteCls: 'nc-peach'   },
  { name: 'Orange',   value: '#fed7aa', cls: '', chipCls: 'cc-orange',  taskCls: 'tc-orange',  noteCls: 'nc-orange'  },
  { name: 'Coral',    value: '#fecaca', cls: '', chipCls: 'cc-coral',   taskCls: 'tc-coral',   noteCls: 'nc-coral'   },
  { name: 'Pink',     value: '#fce7f3', cls: '', chipCls: 'cc-pink',    taskCls: 'tc-pink',    noteCls: 'nc-pink'    },
  { name: 'Lavender', value: '#ede9fe', cls: '', chipCls: 'cc-lavender',taskCls: 'tc-lavender',noteCls: 'nc-lavender'},
  { name: 'Blue',     value: '#dbeafe', cls: '', chipCls: 'cc-blue',    taskCls: 'tc-blue',    noteCls: 'nc-blue'    },
  { name: 'Sky',      value: '#e0f2fe', cls: '', chipCls: 'cc-sky',     taskCls: 'tc-sky',     noteCls: 'nc-sky'     },
  { name: 'Teal',     value: '#ccfbf1', cls: '', chipCls: 'cc-teal',    taskCls: 'tc-teal',    noteCls: 'nc-teal'    },
  { name: 'Green',    value: '#d1fae5', cls: '', chipCls: 'cc-green',   taskCls: 'tc-green',   noteCls: 'nc-green'   },
  { name: 'Stone',    value: '#f3f4f6', cls: '', chipCls: 'cc-stone',   taskCls: 'tc-stone',   noteCls: 'nc-stone'   },
  { name: 'Sage',    value: '#d4e6d4', cls: '', chipCls: 'cc-sage',    taskCls: 'tc-sage',    noteCls: 'nc-sage'    },
  { name: 'Mint',    value: '#c8f5e0', cls: '', chipCls: 'cc-mint',    taskCls: 'tc-mint',    noteCls: 'nc-mint'    },
  { name: 'Mauve',   value: '#e8d5e8', cls: '', chipCls: 'cc-mauve',   taskCls: 'tc-mauve',   noteCls: 'nc-mauve'   },
  { name: 'Rose',    value: '#ffd6dd', cls: '', chipCls: 'cc-rose',    taskCls: 'tc-rose',    noteCls: 'nc-rose'    },
  { name: 'Cream',   value: '#fef6e4', cls: '', chipCls: 'cc-cream',   taskCls: 'tc-cream',   noteCls: 'nc-cream'   },
  { name: 'Indigo',  value: '#dce3f8', cls: '', chipCls: 'cc-indigo',  taskCls: 'tc-indigo',  noteCls: 'nc-indigo'  },
];
function colorByValue(val) { return COLORS.find(function(c){ return c.value===val; }) || COLORS[0]; }

// ============================================================
// STATE
// ============================================================
const state = {
  dashView: 'seven',
  dayOffset: 0,
  weekStart: 0,
  dashDayModalDs: null,
  editTaskId: null,
  editTaskDate: null,
  editRoutineId: null,
  routineOverrideDs: null,
  routineOverrideId: null,
  selectedTaskColor: '',
  selectedTaskPriority: 'standard',
  simpleItemContext: null,
  editSimpleItemId: null,
  movingItemId: null,
  movingItemList: null,
  movingFromFutureId: null,
  movingFromFutureList: null,
  editReminderId: null,
  editCheshbonItemId: null,
  healthDate: toDateStr(new Date()),
  editHealthFoodId: null,
  plannerWeekOffset: 0,
  editActivityPlanDay: null,
  editActivityPlanId: null,
  selectedPlanActivityType: '',
  learningDay: null,
  editLearningItemId: null,
  selectedLearningSeder: '',
  dragLearn: null,
  learningCopyItem: null,
  moveTaskDs: null, moveTaskId: null, moveTaskIsR: false,
  linkNotesTaskDs: null, linkNotesTaskId: null,
  activeCheshTab: 'daily',
  editWeeklyItemId: null,
  activeFinTab: 'monthly',
  finBonHistoryVisible: false,
  editFinExpId: null,
  editFinIncId: null,
  editFinBonId: null,
  editFinWishId: null,
  editMoneyIdeaId: null,
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  calView: 'month',
  editCalEventId: null,
  selectedCalEventColor: '',
  pendingCalDate: null,
  pendingEditCalData: null,
  pendingEditCalDs: null,
  activeFolderId: 'all',
  expandedFolders: {},
  unlockedFolders: {},
  pendingFolderId: null,
  viewingNoteId: null,
  viewNoteCheckItems: [],
  editNoteId: null,
  editFolderId: null,
  selectedNoteColor: '',
  selectedFolderColor: '',
  noteType: 'text',
  noteCheckItems: [],
  notesSearchQuery: '',
  taskModalLinkedNotes: [],
  zmanimCache: {},
  hebrewCache: {},
  location: null,
  currentPage: 'dashboard',
};

// ============================================================
// DATA
// ============================================================
function getData() {
  return {
    tasks:       JSON.parse(localStorage.getItem('dm_tasks')       || '{}'),
    routine:     JSON.parse(localStorage.getItem('dm_routine')     || '[]'),
    calEvents:   JSON.parse(localStorage.getItem('dm_calEvents')   || '[]'),
    notes:       JSON.parse(localStorage.getItem('dm_notes')       || '[]'),
    folders:     JSON.parse(localStorage.getItem('dm_folders')     || '[]'),
    shortterm:   JSON.parse(localStorage.getItem('dm_shortterm')   || '[]'),
    longterm:    JSON.parse(localStorage.getItem('dm_longterm')    || '[]'),
    reminders:   JSON.parse(localStorage.getItem('dm_reminders')   || '[]'),
    learning:    JSON.parse(localStorage.getItem('dm_learning')    || '{}'),
    finIncome:   JSON.parse(localStorage.getItem('dm_fin_income')   || '[]'),
    finExpenses: JSON.parse(localStorage.getItem('dm_fin_expenses') || '[]'),
    finBonuses:  JSON.parse(localStorage.getItem('dm_fin_bonuses')  || '[]'),
    finWishlist: JSON.parse(localStorage.getItem('dm_fin_wishlist') || '[]'),
    finPoints:   0,
    finBank:     JSON.parse(localStorage.getItem('dm_fin_bank')     || '0'),
    moneymaking:      JSON.parse(localStorage.getItem('dm_moneymaking')       || '[]'),
    routineOverrides:      JSON.parse(localStorage.getItem('dm_routine_overrides'))          || {},
    gratitude:             JSON.parse(localStorage.getItem('dm_gratitude'))                  || Array(10).fill(''),
    ayinTov:               JSON.parse(localStorage.getItem('dm_ayin_tov'))                   || Array(5).fill(''),
    learned:               localStorage.getItem('dm_learned')                                || '',
    feeling:               localStorage.getItem('dm_feeling')                                || '',
    reflHistory:           JSON.parse(localStorage.getItem('dm_refl_history'))               || [],
    cheshbonItems:         JSON.parse(localStorage.getItem('dm_cheshbon_items'))             || [],
    cheshbonChecks:        JSON.parse(localStorage.getItem('dm_cheshbon_checks'))            || {},
    cheshbonWeekHistory:   JSON.parse(localStorage.getItem('dm_cheshbon_week_history'))      || [],
    dietPlan:              JSON.parse(localStorage.getItem('dm_diet_plan'))                  || {},
    healthWater:           JSON.parse(localStorage.getItem('dm_health_water'))               || {},
    activityPlan:          JSON.parse(localStorage.getItem('dm_activity_plan'))              || {},
    activityDone:          JSON.parse(localStorage.getItem('dm_activity_done'))              || {},
    weeklyItems:           JSON.parse(localStorage.getItem('dm_weekly_items'))               || [],
    weeklyScores:          JSON.parse(localStorage.getItem('dm_weekly_scores'))              || {},
    weeklyHistory:         JSON.parse(localStorage.getItem('dm_weekly_history'))             || [],
    weeklyLastSunday:      localStorage.getItem('dm_weekly_last_sunday')                     || '',
    freeReflHistory:       JSON.parse(localStorage.getItem('dm_free_refl_history'))          || [],
    monthlyJewishHistory:  JSON.parse(localStorage.getItem('dm_monthly_jewish_history'))     || [],
    monthlySecularHistory: JSON.parse(localStorage.getItem('dm_monthly_secular_history'))    || [],
    monthlyJewishDraft:    JSON.parse(localStorage.getItem('dm_monthly_jewish_draft'))       || {month:''},
    monthlySecularDraft:   JSON.parse(localStorage.getItem('dm_monthly_secular_draft'))      || {month:'',text:''},
    weightEntries:    JSON.parse(localStorage.getItem('dm_weight_entries')      || '{}'),
    weightGoal:       JSON.parse(localStorage.getItem('dm_weight_goal')         || 'null'),
    weightHistory:    JSON.parse(localStorage.getItem('dm_weight_history')      || '[]'),
    weightLastSunday: localStorage.getItem('dm_weight_last_sunday')             || '',
  };
}
function saveT(v)   { localStorage.setItem('dm_tasks',       JSON.stringify(v)); }
function saveR(v)   { localStorage.setItem('dm_routine',     JSON.stringify(v)); }
function saveCE(v)  { localStorage.setItem('dm_calEvents',   JSON.stringify(v)); }
function saveN(v)   { localStorage.setItem('dm_notes',       JSON.stringify(v)); }
function saveF(v)   { localStorage.setItem('dm_folders',     JSON.stringify(v)); }
function saveST(v)  { localStorage.setItem('dm_shortterm',   JSON.stringify(v)); }
function saveLT(v)  { localStorage.setItem('dm_longterm',    JSON.stringify(v)); }
function saveRem(v) { localStorage.setItem('dm_reminders',   JSON.stringify(v)); }
function saveLrn(v) { localStorage.setItem('dm_learning',    JSON.stringify(v)); }
function saveFinInc(v)  { localStorage.setItem('dm_fin_income',   JSON.stringify(v)); }
function saveFinExp(v)  { localStorage.setItem('dm_fin_expenses', JSON.stringify(v)); }
function saveFinBon(v)  { localStorage.setItem('dm_fin_bonuses',  JSON.stringify(v)); }
function saveFinWish(v) { localStorage.setItem('dm_fin_wishlist', JSON.stringify(v)); }
function saveFinPts(v)  { localStorage.setItem('dm_fin_points',   JSON.stringify(v)); }
function saveFinBank(v) { localStorage.setItem('dm_fin_bank',     JSON.stringify(v)); }
function saveMM(v)  { localStorage.setItem('dm_moneymaking',       JSON.stringify(v)); }
function saveRO(v)   { localStorage.setItem('dm_routine_overrides',      JSON.stringify(v)); }
function saveGrat(v) { localStorage.setItem('dm_gratitude',              JSON.stringify(v)); }
function saveAyin(v) { localStorage.setItem('dm_ayin_tov',               JSON.stringify(v)); }
function saveLrnd(v) { localStorage.setItem('dm_learned',                v); }
function saveFeel(v) { localStorage.setItem('dm_feeling',                v); }
function saveRHist(v){ localStorage.setItem('dm_refl_history',           JSON.stringify(v)); }
function saveChi(v)  { localStorage.setItem('dm_cheshbon_items',         JSON.stringify(v)); }
function saveChk(v)  { localStorage.setItem('dm_cheshbon_checks',        JSON.stringify(v)); }
function saveChWH(v) { localStorage.setItem('dm_cheshbon_week_history',  JSON.stringify(v)); }
function saveDietPlan(v) { localStorage.setItem('dm_diet_plan', JSON.stringify(v)); }
function saveHW(v)   { localStorage.setItem('dm_health_water',    JSON.stringify(v)); }
function saveAP(v)   { localStorage.setItem('dm_activity_plan',   JSON.stringify(v)); }
function saveAD(v)   { localStorage.setItem('dm_activity_done',   JSON.stringify(v)); }
function saveWI(v)   { localStorage.setItem('dm_weekly_items',              JSON.stringify(v)); }
function saveWS(v)   { localStorage.setItem('dm_weekly_scores',             JSON.stringify(v)); }
function saveWH(v)   { localStorage.setItem('dm_weekly_history',            JSON.stringify(v)); }
function saveWLS(v)  { localStorage.setItem('dm_weekly_last_sunday',        v); }
function saveFRH(v)  { localStorage.setItem('dm_free_refl_history',         JSON.stringify(v)); }
function saveMJH(v)  { localStorage.setItem('dm_monthly_jewish_history',    JSON.stringify(v)); }
function saveMSH(v)  { localStorage.setItem('dm_monthly_secular_history',   JSON.stringify(v)); }
function saveMJD(v)  { localStorage.setItem('dm_monthly_jewish_draft',      JSON.stringify(v)); }
function saveMSD(v)  { localStorage.setItem('dm_monthly_secular_draft',     JSON.stringify(v)); }
function uid()      { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// Module-level media recorder state
var _mediaRecorder=null, _audioChunks=[], _recordTimerInt=null, _recordSecs=0, _currentAudioBlob=null;

// Note editor undo/redo (contenteditable — use browser execCommand)
var _noteUndoTimer=null;
window.noteUndo=function(){
  var el=document.getElementById('noteViewContent'); if(!el)return;
  el.focus(); document.execCommand('undo',false,null);
};
window.noteRedo=function(){
  var el=document.getElementById('noteViewContent'); if(!el)return;
  el.focus(); document.execCommand('redo',false,null);
};
window.execFmt=function(cmd){
  var el=document.getElementById('noteViewContent'); if(!el)return;
  el.focus(); document.execCommand(cmd,false,null);
};
// Note drag state
var _draggingNoteId=null;

// ============================================================
// INDEXEDDB FOR AUDIO
// ============================================================
function openAudioDB() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open('dm_audio_db', 1);
    req.onupgradeneeded = function(e) { e.target.result.createObjectStore('recordings'); };
    req.onsuccess = function(e) { resolve(e.target.result); };
    req.onerror   = function(e) { reject(e); };
  });
}
function saveAudioBlob(key, blob) {
  return openAudioDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction('recordings', 'readwrite');
      tx.objectStore('recordings').put(blob, key);
      tx.oncomplete = resolve; tx.onerror = reject;
    });
  });
}
function loadAudioBlob(key) {
  return openAudioDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction('recordings', 'readonly');
      var req = tx.objectStore('recordings').get(key);
      req.onsuccess = function(e) { resolve(e.target.result || null); };
      req.onerror   = reject;
    });
  });
}

// ============================================================
// DATE HELPERS
// ============================================================
function fmtNoteDate(iso) {
  if (!iso) return '';
  var d=new Date(iso);
  var mon=d.toLocaleDateString('en-US',{month:'short'});
  var day=d.getDate();
  var h=d.getHours(), m=d.getMinutes();
  return 'Edited '+mon+' '+day+' at '+(h%12||12)+':'+String(m).padStart(2,'0')+' '+(h>=12?'PM':'AM');
}
function dateFromOffset(n) { var d=new Date(); d.setDate(d.getDate()+n); return d; }
function toDateStr(date) {
  return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
}
function fromDateStr(s) { var p=s.split('-').map(Number); return new Date(p[0],p[1]-1,p[2]); }
function isToday(date)  { return date.toDateString()===new Date().toDateString(); }
function fmt12(t) {
  if (!t) return '';
  var p=t.split(':').map(Number), h=p[0], m=p[1];
  return (h%12||12)+':'+String(m).padStart(2,'0')+' '+(h>=12?'PM':'AM');
}
function fmtISO(iso) {
  if (!iso) return '—';
  var d=new Date(iso), h=d.getHours(), m=d.getMinutes();
  return (h%12||12)+':'+String(m).padStart(2,'0')+' '+(h>=12?'PM':'AM');
}
function fmtDateDisplay(ds) {
  if (!ds) return '';
  return fromDateStr(ds).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}
function dayName(d)       { return d.toLocaleDateString('en-US',{weekday:'long'}); }
function shortDay(d)      { return d.toLocaleDateString('en-US',{weekday:'short'}); }
function monthDay(d)      { return d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}); }
function shortMonthDay(d) { return d.toLocaleDateString('en-US',{month:'short',day:'numeric'}); }
function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
// ZMANIM  (field names confirmed from Hebcal API response)
// sofZmanShma   = Sof Zman Shema GRA (the later / more lenient time)
// sofZmanShmaMGA = Sof Zman Shema MGA (the earlier / stricter time)
// ============================================================
async function getUserLoc() {
  if (state.location) return state.location;
  var fallback = { lat:40.7128, lng:-74.0060, tz:'America/New_York' };
  return new Promise(function(resolve){
    if (!navigator.geolocation) { state.location=fallback; resolve(fallback); return; }
    navigator.geolocation.getCurrentPosition(
      function(p){ state.location={lat:p.coords.latitude,lng:p.coords.longitude,tz:Intl.DateTimeFormat().resolvedOptions().timeZone}; resolve(state.location); },
      function(){ state.location=fallback; resolve(fallback); },
      {timeout:7000}
    );
  });
}
async function fetchZmanim(ds) {
  if (state.zmanimCache[ds]) return state.zmanimCache[ds];
  var loc = await getUserLoc();
  try {
    var url='https://www.hebcal.com/zmanim?cfg=json&latitude='+loc.lat+'&longitude='+loc.lng+'&tzid='+encodeURIComponent(loc.tz)+'&date='+ds;
    var res=await fetch(url); var json=await res.json();
    state.zmanimCache[ds]=json.times||null;
    return state.zmanimCache[ds];
  } catch(e){ return null; }
}

// For the today-view strip: show GRA Shema (later/lenient time) + Sunset only
async function loadZstrip(ds) {
  var times = await fetchZmanim(ds);
  var el = document.getElementById('zs-'+ds);
  if (!el) return;
  if (!times) { el.innerHTML='<span class="z-loading">Times unavailable</span><span class="z-expand">Tap ›</span>'; return; }
  var shema = fmtISO(times.sofZmanShma); // GRA — the later (more lenient) Shema deadline
  el.innerHTML =
    '<span class="z-label">Shema (GRA):</span><span class="z-time">'+shema+'</span>'+
    '<span class="z-label">Sunset:</span><span class="z-time">'+fmtISO(times.sunset)+'</span>'+
    '<span class="z-expand">Tap for all times ›</span>';
}

function zmanimFullHTML(times) {
  if (!times) return '<p style="color:#aaa;text-align:center;padding:12px 0">Times unavailable.</p>';
  var rows = [
    ['Sof Zman Shema (GRA)',  times.sofZmanShma],
    ['Sof Zman Shema (MGA)',  times.sofZmanShmaMGA],
    ['Sof Zman Tefillah',     times.sofZmanTfilla],
    ['Mincha Gedolah',        times.minchaGedola],
    ['Plag HaMincha',         times.plagHaMincha],
    ['Sunset',                times.sunset],
    ['Tzait Hakochavim',      times.tzeit7083deg||times.tzeit],
  ];
  return rows.map(function(r){
    return '<div class="zmanim-row"><span class="zmanim-row-name">'+r[0]+'</span><span class="zmanim-row-time">'+fmtISO(r[1])+'</span></div>';
  }).join('');
}

// ============================================================
// HEBREW DATE
// ============================================================
async function fetchHebrewDate(ds) {
  if (state.hebrewCache[ds]) return state.hebrewCache[ds];
  var p=ds.split('-');
  try {
    var url='https://www.hebcal.com/converter?cfg=json&gy='+p[0]+'&gm='+p[1]+'&gd='+p[2]+'&g2h=1';
    var res=await fetch(url); var json=await res.json();
    var result=json.hd+' '+json.hm+' '+json.hy;
    state.hebrewCache[ds]=result; return result;
  } catch(e){ return null; }
}
async function loadHebrewDate(ds) {
  var hdate=await fetchHebrewDate(ds);
  var el=document.getElementById('hdate-'+ds);
  if (el&&hdate) el.textContent=hdate;
}
async function loadCalHdate(ds) {
  var hdate=await fetchHebrewDate(ds);
  var el=document.getElementById('chd-'+ds);
  if (el&&hdate){ var hp=hdate.split(' '); el.textContent=hp[0]+' '+(hp[1]||''); }
}

// ============================================================
// TASKS
// ============================================================
function getTasksForDate(ds) {
  var data=getData();
  var dow=fromDateStr(ds).getDay();
  var completions=(data.tasks[ds]||[]).filter(function(t){return t._rc;});
  var routineTasks=data.routine.filter(function(r){return r.days.includes(dow);}).map(function(r){
    var c=completions.find(function(c){return c._rc===r.id;});
    var ov=data.routineOverrides[ds+'_'+r.id]||{};
    if(ov.skipped) return null;
    return {
      id:       r.id,
      title:    ov.title    !== undefined ? ov.title    : r.title,
      time:     ov.time     !== undefined ? ov.time     : r.time,
      location: ov.location !== undefined ? ov.location : r.location,
      color:'', type:'routine', done: c ? c.done : false
    };
  }).filter(Boolean);
  var oneTasks=(data.tasks[ds]||[]).filter(function(t){return !t._rc;});
  var all=routineTasks.concat(oneTasks);
  // Apply stored drag order if available (covers routine + one-time tasks)
  var orderData=JSON.parse(localStorage.getItem('dm_task_order')||'{}');
  var order=orderData[ds];
  if(order&&order.length){
    var map={}; all.forEach(function(t){map[t.id]=t;});
    var ordered=[];
    order.forEach(function(id){if(map[id])ordered.push(map[id]);});
    all.forEach(function(t){if(!ordered.find(function(o){return o.id===t.id;}))ordered.push(t);});
    all=ordered;
  }
  var inc=all.filter(function(t){return !t.done;});
  var don=all.filter(function(t){return t.done;});
  // Partial sort: timed tasks enforce time order among themselves;
  // untimed tasks stay exactly where drag placed them.
  var timedIdxs=[],timedItems=[];
  inc.forEach(function(t,i){if(t.time){timedIdxs.push(i);timedItems.push(t);}});
  timedItems.sort(function(a,b){return a.time.localeCompare(b.time);});
  timedIdxs.forEach(function(pos,i){inc[pos]=timedItems[i];});
  return inc.concat(don);
}
function toggleDone(ds,id,isRoutine) {
  var data=getData();
  if (!data.tasks[ds]) data.tasks[ds]=[];
  if (isRoutine) {
    var ex=data.tasks[ds].find(function(t){return t._rc===id;});
    if (ex){ex.done=!ex.done;ex.doneAt=ex.done?new Date().toISOString():null;}
    else data.tasks[ds].push({id:uid(),_rc:id,done:true,doneAt:new Date().toISOString()});
  } else {
    var t=data.tasks[ds].find(function(t){return t.id===id;});
    if (t){t.done=!t.done;t.doneAt=t.done?new Date().toISOString():null;}
  }
  saveT(data.tasks);
}
function addTask(ds,d) {
  var data=getData();
  if (!data.tasks[ds]) data.tasks[ds]=[];
  data.tasks[ds].push({id:uid(),type:'once',title:d.title,time:d.time||'',location:d.location||'',notes:d.notes||'',reminder:d.reminder||'',color:d.color||'',priority:d.priority||'standard',linkedNoteIds:d.linkedNoteIds||[],done:false,createdAt:new Date().toISOString()});
  saveT(data.tasks);
}
function updateTask(ds,id,d) {
  var data=getData();
  var t=(data.tasks[ds]||[]).find(function(t){return t.id===id;});
  if (t){t.title=d.title;t.time=d.time||'';t.location=d.location||'';t.notes=d.notes||'';t.reminder=d.reminder||'';t.color=d.color||'';t.priority=d.priority||'standard';if(d.linkedNoteIds!==undefined)t.linkedNoteIds=d.linkedNoteIds;}
  saveT(data.tasks);
}
function deleteTask(ds,id) {
  var data=getData();
  if (data.tasks[ds]) data.tasks[ds]=data.tasks[ds].filter(function(t){return t.id!==id;});
  saveT(data.tasks);
}

// ============================================================
// ROUTINE
// ============================================================
function addRoutineItem(d)    { var data=getData(); data.routine.push({id:uid(),title:d.title,time:d.time||'',location:d.location||'',days:d.days}); saveR(data.routine); }
function updateRoutineItem(id,d){ var data=getData(); var r=data.routine.find(function(r){return r.id===id;}); if(r){r.title=d.title;r.time=d.time||'';r.location=d.location||'';r.days=d.days;} saveR(data.routine); }
function deleteRoutineItem(id){ var data=getData(); saveR(data.routine.filter(function(r){return r.id!==id;})); }

// ============================================================
// CALENDAR EVENTS
// ============================================================
function isRecurringOccurrence(ev, ds) {
  var start=fromDateStr(ev.date), check=fromDateStr(ds);
  if(check<start)return false;
  if(ev.recurringUntil&&check>fromDateStr(ev.recurringUntil))return false;
  if((ev.exceptions||[]).indexOf(ds)!==-1)return false;
  var diffDays=Math.round((check-start)/(1000*60*60*24));
  if(ev.recurring==='custom'&&ev.recurringN&&ev.recurringUnit){
    var n=parseInt(ev.recurringN,10);
    var unit=ev.recurringUnit;
    if(unit==='days')  return diffDays%n===0;
    if(unit==='weeks') return diffDays%(n*7)===0;
    if(unit==='months'){
      var sy=start.getFullYear(),sm=start.getMonth(),sd=start.getDate();
      var cy=check.getFullYear(),cm=check.getMonth();
      var totalMonths=(cy-sy)*12+(cm-sm);
      if(totalMonths<0||totalMonths%n!==0)return false;
      var daysInCM=new Date(cy,cm+1,0).getDate();
      return check.getDate()===Math.min(sd,daysInCM);
    }
    if(unit==='years'){
      var diffYears=check.getFullYear()-start.getFullYear();
      if(diffYears<0||diffYears%n!==0)return false;
      return check.getMonth()===start.getMonth()&&check.getDate()===start.getDate();
    }
    return false;
  }
  if(ev.recurring==='weekly')   return diffDays%7===0;
  if(ev.recurring==='biweekly') return diffDays%14===0;
  if(ev.recurring==='monthly'){
    var dIM=new Date(check.getFullYear(),check.getMonth()+1,0).getDate();
    return check.getDate()===Math.min(start.getDate(),dIM);
  }
  return false;
}
function getEventsForDate(ds){
  var data=getData(); var result=[];
  data.calEvents.forEach(function(ev){
    if(ev._overrideFor){ if(ev._overrideDate===ds)result.push(ev); return; }
    var rec=ev.recurring||'none';
    if(rec==='none'){ if(ev.date===ds)result.push(ev); }
    else {
      if(isRecurringOccurrence(ev,ds)){
        var ov=data.calEvents.find(function(o){return o._overrideFor===ev.id&&o._overrideDate===ds;});
        if(!ov)result.push(Object.assign({},ev,{_occurrenceDate:ds}));
      }
    }
  });
  return result;
}
function addCalEvent(d){
  var data=getData();
  data.calEvents.push({id:uid(),title:d.title,date:d.date,time:d.time||'',location:d.location||'',notes:d.notes||'',color:d.color||'',recurring:d.recurring||'none',recurringN:d.recurringN||null,recurringUnit:d.recurringUnit||null,recurringUntil:d.recurringUntil||null,exceptions:[],reminders:d.reminders||[],fromTask:false});
  saveCE(data.calEvents);
}
function updateCalEvent(id,d){
  var data=getData(); var e=data.calEvents.find(function(e){return e.id===id;});
  if(e){e.title=d.title;if(d.date)e.date=d.date;e.time=d.time||'';e.location=d.location||'';e.notes=d.notes||'';e.color=d.color||'';e.recurring=d.recurring||'none';e.recurringN=d.recurringN||null;e.recurringUnit=d.recurringUnit||null;e.recurringUntil=d.recurringUntil||null;e.reminders=d.reminders||[];}
  saveCE(data.calEvents);
}
function deleteCalEvent(id){ var data=getData(); saveCE(data.calEvents.filter(function(e){return e.id!==id;})); }

// ============================================================
// CALENDAR UI HELPERS
// ============================================================
function getRecurFromUI(){
  var doRecur=document.getElementById('calEventDoRecur').checked;
  if(!doRecur)return{recurring:'none',recurringN:null,recurringUnit:null,recurringUntil:null};
  var n=parseInt(document.getElementById('calEventRecurN').value,10)||1;
  var unit=document.getElementById('calEventRecurUnit').value||'weeks';
  var until=document.getElementById('calEventUntil').value||null;
  return{recurring:'custom',recurringN:n,recurringUnit:unit,recurringUntil:until};
}
// Draft reminder list while modal is open
var _calReminderDraft=[];
function renderCalReminderList(){
  var el=document.getElementById('calReminderList'); if(!el)return;
  if(!_calReminderDraft.length){el.innerHTML='<div class="cal-rem-empty">No reminders — click + Add to set one</div>';return;}
  el.innerHTML=_calReminderDraft.map(function(r,i){
    var isAtEvent=r.unit==='event';
    return'<div class="cal-reminder-row">'+
      (!isAtEvent?'<input type="number" class="field cal-rem-n" value="'+r.n+'" min="1" max="9999" onchange="updateCalReminder('+i+',\'n\',this.value)">':'<span class="cal-rem-spacer"></span>')+
      '<select class="field cal-rem-unit" onchange="updateCalReminder('+i+',\'unit\',this.value)">'+
        '<option value="hours"'+(r.unit==='hours'?' selected':'')+'>hours</option>'+
        '<option value="days"'+(r.unit==='days'?' selected':'')+'>days</option>'+
        '<option value="weeks"'+(r.unit==='weeks'?' selected':'')+'>weeks</option>'+
        '<option value="months"'+(r.unit==='months'?' selected':'')+'>months</option>'+
        '<option value="event"'+(isAtEvent?' selected':'')+'>at time of event</option>'+
      '</select>'+
      (!isAtEvent?'<span class="cal-rem-before">before</span>':'')+
      '<button class="cal-rem-del-btn" onclick="removeCalReminder('+i+')" title="Delete reminder">🗑 Delete</button>'+
    '</div>';
  }).join('');
}
window.addCalReminder=function(){_calReminderDraft.push({n:1,unit:'days'});renderCalReminderList();};
window.removeCalReminder=function(i){_calReminderDraft.splice(i,1);renderCalReminderList();};
window.updateCalReminder=function(i,field,val){
  if(!_calReminderDraft[i])return;
  if(field==='n')_calReminderDraft[i].n=parseInt(val)||1;
  else _calReminderDraft[i].unit=val;
};
function getRemindersFromUI(){return _calReminderDraft.map(function(r){return{n:parseInt(r.n)||1,unit:r.unit||'days'};});}
function normalizeReminder(r){
  // Backward compat: convert old string codes to object format
  if(typeof r==='string'){var m={'1d':{n:1,unit:'days'},'2d':{n:2,unit:'days'},'1w':{n:1,unit:'weeks'},'2w':{n:2,unit:'weeks'},'1m':{n:1,unit:'months'}};return m[r]||{n:1,unit:'days'};}
  return r;
}
function getReminderOffsetDays(r, eventTime){
  var obj=normalizeReminder(r); var n=parseInt(obj.n)||1;
  if(obj.unit==='event') return 0;
  if(obj.unit==='hours'){
    // Use event time or default to 9:00am
    var t=(eventTime||'09:00').split(':');
    var evMins=(parseInt(t[0])||9)*60+(parseInt(t[1])||0);
    var remMins=evMins-n*60;
    if(remMins>=0) return 0; // fires same day
    return Math.ceil(-remMins/1440); // days before
  }
  if(obj.unit==='weeks')return n*7;
  if(obj.unit==='months')return n*30;
  return n;
}
function reminderLabel(r){
  var obj=normalizeReminder(r); var n=parseInt(obj.n)||1;
  var u=obj.unit||'days';
  if(u==='event') return 'at time of event';
  var singular=u.replace(/s$/,'');
  return n+' '+(n===1?singular:u)+' before';
}
function populateCalEventUI(ev){
  document.getElementById('calEventTitle').value=ev.title||'';
  document.getElementById('calEventDate').value=ev.date||'';
  document.getElementById('calEventTime').value=ev.time||'';
  document.getElementById('calEventLocation').value=ev.location||'';
  document.getElementById('calEventNotes').value=ev.notes||'';
  var isRecur=ev.recurring&&ev.recurring!=='none';
  document.getElementById('calEventDoRecur').checked=isRecur;
  document.getElementById('calEventRecurGroup').style.display=isRecur?'':'none';
  if(isRecur){
    var n=ev.recurringN||(ev.recurring==='biweekly'?2:1);
    var unit=ev.recurringUnit||(ev.recurring==='biweekly'?'weeks':ev.recurring==='monthly'?'months':'weeks');
    document.getElementById('calEventRecurN').value=n;
    document.getElementById('calEventRecurUnit').value=unit;
    document.getElementById('calEventUntil').value=ev.recurringUntil||'';
  }
  _calReminderDraft=(ev.reminders||[]).map(normalizeReminder);
  renderCalReminderList();
  buildColorPicker('calEventColorPicker',ev.color||'',function(v){state.selectedCalEventColor=v;});
}

// Calendar reminder dot/banner helpers
function getRemindersForDate(ds){
  var data=getData(); var result=[];
  data.calEvents.forEach(function(ev){
    if(ev._overrideFor)return;
    var rems=ev.reminders||[]; if(!rems.length)return;
    rems.forEach(function(r){
      var offset=getReminderOffsetDays(r,ev.time); if(offset===null||offset===undefined||offset<0)return;
      var evDate=new Date(fromDateStr(ds)); evDate.setDate(evDate.getDate()+offset);
      var evDs=toDateStr(evDate);
      var fires;
      if(ev.recurring==='none'||!ev.recurring){ fires=ev.date===evDs; }
      else { fires=isRecurringOccurrence(ev,evDs); }
      if(fires) result.push({ev:ev,label:reminderLabel(r),eventDate:evDs});
    });
  });
  return result;
}
function renderReminderBanner(){
  var todayDs=toDateStr(dateFromOffset(0));
  var rems=getRemindersForDate(todayDs);
  if(!rems.length)return'';
  var rows=rems.map(function(r){
    return'<div class="rem-banner-item">'+
      '<span class="rem-banner-title">'+escHtml(r.ev.title)+'</span>'+
      '<span class="rem-banner-when">'+escHtml(r.label)+'</span>'+
    '</div>';
  }).join('');
  return'<div class="rem-banner"><div class="rem-banner-hdr">🔔 '+rems.length+' upcoming reminder'+(rems.length>1?'s':'')+'</div>'+rows+'</div>';
}

// ============================================================
// NOTES & FOLDERS
// ============================================================
function addFolder(name,parentId,color,password){ var data=getData(); data.folders.push({id:uid(),name:name,parentId:parentId||null,color:color||'',password:password||''}); saveF(data.folders); }
function updateFolder(id,name,color,parentId,password){ var data=getData(); var f=data.folders.find(function(f){return f.id===id;}); if(f){f.name=name;f.color=color||'';f.parentId=parentId||null;f.password=password||'';} saveF(data.folders); }
function reorderFolders(srcId,tgtId){ var data=getData(); var arr=data.folders; var si=arr.findIndex(function(f){return f.id===srcId;}),ti=arr.findIndex(function(f){return f.id===tgtId;}); if(si===-1||ti===-1||si===ti)return; var item=arr.splice(si,1)[0]; arr.splice(ti,0,item); saveF(data.folders); }
function getFolderDescendants(folders,id){
  var ids=[id];
  folders.filter(function(f){return f.parentId===id;}).forEach(function(c){
    getFolderDescendants(folders,c.id).forEach(function(did){ids.push(did);});
  });
  return ids;
}
function deleteFolder(id){
  var data=getData();
  var toDelete=getFolderDescendants(data.folders,id);
  data.notes.forEach(function(n){
    if(toDelete.indexOf(n.folderId)!==-1) n.folderId=null;
    if(n.folderIds) n.folderIds=n.folderIds.filter(function(fid){return toDelete.indexOf(fid)===-1;});
  }); saveN(data.notes);
  data.folders=data.folders.filter(function(f){return toDelete.indexOf(f.id)===-1;}); saveF(data.folders);
}
// Helper: get folderIds array for a note (handles legacy single folderId)
function getNoteFolderIds(note) {
  if (note.folderIds) return note.folderIds;
  return note.folderId ? [note.folderId] : [];
}
function addNote(d){ var data=getData(); data.notes.push({id:uid(),type:d.type,title:d.title,content:d.content||'',items:d.items||[],folderId:(d.folderIds||[])[0]||null,folderIds:d.folderIds||[],color:d.color||'',pinned:d.pinned||false,archived:false,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}); saveN(data.notes); }
function updateNote(id,d){ var data=getData(); var n=data.notes.find(function(n){return n.id===id;}); if(n){n.type=d.type;n.title=d.title;n.content=d.content||'';n.items=d.items||[];n.folderIds=d.folderIds||[];n.folderId=(d.folderIds||[])[0]||null;n.color=d.color||'';n.pinned=d.pinned||false;n.updatedAt=new Date().toISOString();} saveN(data.notes); }
function deleteNote(id){
  var data=getData();
  var n=data.notes.find(function(n){return n.id===id;});
  if(n){n.deleted=true;n.deletedAt=new Date().toISOString();}
  saveN(data.notes);
}
function restoreNote(id){
  var data=getData();
  var n=data.notes.find(function(n){return n.id===id;});
  if(n){delete n.deleted;delete n.deletedAt;}
  saveN(data.notes);
}
function purgeNoteById(id){
  var data=getData();
  saveN(data.notes.filter(function(n){return n.id!==id;}));
}
function purgeOldDeletedNotes(){
  var data=getData(); var cutoff=new Date(); cutoff.setDate(cutoff.getDate()-30);
  var kept=data.notes.filter(function(n){
    if(!n.deleted)return true;
    return n.deletedAt&&new Date(n.deletedAt)>cutoff;
  });
  if(kept.length!==data.notes.length)saveN(kept);
}
function toggleNotePin(id){ var data=getData(); var n=data.notes.find(function(n){return n.id===id;}); if(n)n.pinned=!n.pinned; saveN(data.notes); }

// ============================================================
// SHORT TERM / LONG TERM
// ============================================================
function addSimpleItem(list,text,notes){ var data=getData(); var arr=data[list]; arr.push({id:uid(),title:text,notes:notes||'',done:false,doneAt:null,createdAt:new Date().toISOString()}); list==='shortterm'?saveST(arr):saveLT(arr); }
function updateSimpleItem(list,id,text,notes){ var data=getData(); var item=data[list].find(function(i){return i.id===id;}); if(item){item.title=text;item.notes=notes||'';} list==='shortterm'?saveST(data[list]):saveLT(data[list]); }
function reorderSimpleList(list,srcId,tgtId){ var data=getData(); var arr=data[list]; var si=arr.findIndex(function(i){return i.id===srcId;}),ti=arr.findIndex(function(i){return i.id===tgtId;}); if(si===-1||ti===-1||si===ti)return; var item=arr.splice(si,1)[0]; arr.splice(ti,0,item); list==='shortterm'?saveST(arr):saveLT(arr); }
function toggleSimpleItem(list,id){ var data=getData(); var item=data[list].find(function(i){return i.id===id;}); if(item){item.done=!item.done;item.doneAt=item.done?new Date().toISOString():null;} list==='shortterm'?saveST(data[list]):saveLT(data[list]); }
function deleteSimpleItem(list,id){ var data=getData(); var arr=data[list].filter(function(i){return i.id!==id;}); list==='shortterm'?saveST(arr):saveLT(arr); }
function moveItemToDay(list,id,ds){ var data=getData(); var item=data[list].find(function(i){return i.id===id;}); if(!item)return; addTask(ds,{title:item.title}); deleteSimpleItem(list,id); }

// ============================================================
// REMINDERS
// ============================================================
function addReminder(text,category){ var data=getData(); data.reminders.push({id:uid(),text:text,category:category||'',createdAt:new Date().toISOString()}); saveRem(data.reminders); }
function updateReminder(id,text,category){ var data=getData(); var r=data.reminders.find(function(r){return r.id===id;}); if(r){r.text=text;r.category=category||'';} saveRem(data.reminders); }
function deleteReminder(id){ var data=getData(); saveRem(data.reminders.filter(function(r){return r.id!==id;})); }

// ============================================================
// LEARNING SEDER
// ============================================================
var LEARNING_DAYS = ['mon','tue','wed','thu','fri','sat','sun'];
var LEARNING_DAY_LABELS = {mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday'};
function addLearningItem(day,d){ var data=getData(); if(!data.learning[day])data.learning[day]=[]; data.learning[day].push({id:uid(),subject:d.subject,source:d.source||'',notes:d.notes||'',time:d.time||'',seder:d.seder||''}); saveLrn(data.learning); }
function updateLearningItem(day,id,d){ var data=getData(); if(!data.learning[day])return; var item=data.learning[day].find(function(i){return i.id===id;}); if(item){item.subject=d.subject;item.source=d.source||'';item.notes=d.notes||'';item.time=d.time||'';item.seder=d.seder||'';} saveLrn(data.learning); }
function reorderLearningItem(day,dragId,targetId){ var data=getData(); var items=data.learning[day]||[]; var di=items.findIndex(function(i){return i.id===dragId;}); var ti=items.findIndex(function(i){return i.id===targetId;}); if(di===-1||ti===-1||di===ti)return; var dragged=items.splice(di,1)[0]; var newTi=items.findIndex(function(i){return i.id===targetId;}); items.splice(newTi,0,dragged); data.learning[day]=items; saveLrn(data.learning); renderLearning(); }
function deleteLearningItem(day,id){ var data=getData(); if(!data.learning[day])return; data.learning[day]=data.learning[day].filter(function(i){return i.id!==id;}); saveLrn(data.learning); }

// ============================================================
// FINANCIAL DATA
// ============================================================
function fmtDollar(n) { var x=parseFloat(n)||0; return x%1===0?x.toLocaleString():x.toFixed(2); }
function fmtAmt(lo,hi) { lo=parseFloat(lo)||0; hi=parseFloat(hi)||lo; return lo===hi?'$'+fmtDollar(lo):'$'+fmtDollar(lo)+'–$'+fmtDollar(hi); }
var TAG_CLS={'Need':'tag-need','Flexible':'tag-flex','Self-invest':'tag-invest','Gift':'tag-gift','Income':'tag-income','Bonus':'tag-bonus'};
function tagBadge(tag) { var cls=TAG_CLS[tag]||'tag-need'; return '<span class="fin-tag '+cls+'">'+escHtml(tag||'')+'</span>'; }
function getFinWeeks() {
  var now=new Date(); var y=now.getFullYear(); var m=now.getMonth();
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return [1,8,15,22].map(function(d,i){ return {label:'Week '+(i+1)+' \xb7 '+MON[m]+' '+d,idx:i}; });
}
function getAutoWeekIdx() { var d=new Date().getDate(); if(d<8)return 0; if(d<15)return 1; if(d<22)return 2; return 3; }
function itemInWeek(item,wi) { if(item.frequency==='weekly')return true; return (item.weeks||[]).indexOf(wi)!==-1; }
function addFinInc(d)       { var data=getData(); data.finIncome.push(Object.assign({id:uid()},d)); saveFinInc(data.finIncome); }
function updateFinInc(id,d) { var data=getData(); var i=data.finIncome.findIndex(function(x){return x.id===id;}); if(i>-1)data.finIncome[i]=Object.assign({},data.finIncome[i],d,{id:id}); saveFinInc(data.finIncome); }
function deleteFinInc(id)   { var data=getData(); saveFinInc(data.finIncome.filter(function(x){return x.id!==id;})); }
function addFinExp(d)       { var data=getData(); data.finExpenses.push(Object.assign({id:uid()},d)); saveFinExp(data.finExpenses); }
function updateFinExp(id,d) { var data=getData(); var i=data.finExpenses.findIndex(function(x){return x.id===id;}); if(i>-1)data.finExpenses[i]=Object.assign({},data.finExpenses[i],d,{id:id}); saveFinExp(data.finExpenses); }
function deleteFinExp(id)   { var data=getData(); saveFinExp(data.finExpenses.filter(function(x){return x.id!==id;})); }
function addFinBon(d)       { var data=getData(); data.finBonuses.push(Object.assign({id:uid()},d)); saveFinBon(data.finBonuses); }
function updateFinBon(id,d) { var data=getData(); var i=data.finBonuses.findIndex(function(x){return x.id===id;}); if(i>-1)data.finBonuses[i]=Object.assign({},data.finBonuses[i],d,{id:id}); saveFinBon(data.finBonuses); }
function deleteFinBon(id)   { var data=getData(); saveFinBon(data.finBonuses.filter(function(x){return x.id!==id;})); }
function normalizeWishOrders(list) {
  ['really-want','want','can-wait'].forEach(function(tier){
    list.filter(function(w){return w.tier===tier;}).sort(function(a,b){return (a.order||0)-(b.order||0);}).forEach(function(w,i){w.order=i;});
  });
}
function addFinWish(d)       { var data=getData(); normalizeWishOrders(data.finWishlist); var tier=data.finWishlist.filter(function(x){return x.tier===d.tier;}); d.order=tier.length; data.finWishlist.push(Object.assign({id:uid()},d)); saveFinWish(data.finWishlist); }
function updateFinWish(id,d) { var data=getData(); var i=data.finWishlist.findIndex(function(x){return x.id===id;}); if(i>-1)data.finWishlist[i]=Object.assign({},data.finWishlist[i],d,{id:id}); saveFinWish(data.finWishlist); }
function deleteFinWish(id)   { var data=getData(); saveFinWish(data.finWishlist.filter(function(x){return x.id!==id;})); }
function addMoneyIdea(d){ var data=getData(); data.moneymaking.push({id:uid(),idea:d.idea,status:d.status||'idea',notes:d.notes||'',createdAt:new Date().toISOString()}); saveMM(data.moneymaking); }
function updateMoneyIdea(id,d){ var data=getData(); var item=data.moneymaking.find(function(i){return i.id===id;}); if(item){item.idea=d.idea;item.status=d.status||'idea';item.notes=d.notes||'';} saveMM(data.moneymaking); }
function deleteMoneyIdea(id){ var data=getData(); saveMM(data.moneymaking.filter(function(i){return i.id!==id;})); }

// ============================================================
// HEALTH DATA
// ============================================================
// Activity plan (weekly repeating template)
var PLAN_DAYS      = ['mon','tue','wed','thu','fri','sat','sun'];
var PLAN_DAY_SHORT = {mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat',sun:'Sun'};
var PLAN_DAY_FULL  = {mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday'};

function getPlannerWeekMonday() {
  var now=new Date(); var dow=now.getDay();
  var daysToMon=dow===0?-6:1-dow;
  var mon=new Date(now); mon.setDate(now.getDate()+daysToMon+state.plannerWeekOffset*7); mon.setHours(0,0,0,0);
  return mon;
}
function addActivityPlanItem(day,d){
  var data=getData(); if(!data.activityPlan[day])data.activityPlan[day]=[];
  data.activityPlan[day].push({id:uid(),activityType:d.activityType,time:d.time||'',duration:d.duration||''});
  saveAP(data.activityPlan);
}
function updateActivityPlanItem(day,id,d){
  var data=getData(); var item=(data.activityPlan[day]||[]).find(function(i){return i.id===id;}); if(!item)return;
  item.activityType=d.activityType; item.time=d.time||''; item.duration=d.duration||'';
  saveAP(data.activityPlan);
}
function deleteActivityPlanItem(day,id){
  var data=getData(); if(!data.activityPlan[day])return;
  data.activityPlan[day]=data.activityPlan[day].filter(function(i){return i.id!==id;});
  saveAP(data.activityPlan);
}
function toggleActivityPlanDone(weekKey,itemId){
  var data=getData(); var key=weekKey+'_'+itemId;
  data.activityDone[key]=!data.activityDone[key]; saveAD(data.activityDone);
}

function updateDietPlanDay(day, text) {
  var data=getData(); data.dietPlan[day]=text; saveDietPlan(data.dietPlan);
}
function addHealthActivity(ds, d) {
  var data=getData(); if(!data.healthActivity[ds])data.healthActivity[ds]=[];
  data.healthActivity[ds].push({id:uid(),activityType:d.activityType,duration:d.duration||'',notes:d.notes||'',createdAt:new Date().toISOString()});
  saveHA(data.healthActivity);
}
function updateHealthActivity(ds, id, d) {
  var data=getData(); var arr=data.healthActivity[ds]||[];
  var item=arr.find(function(i){return i.id===id;});
  if(item){item.activityType=d.activityType;item.duration=d.duration||'';item.notes=d.notes||'';} saveHA(data.healthActivity);
}
function deleteHealthActivity(ds, id) {
  var data=getData(); if(!data.healthActivity[ds])return;
  data.healthActivity[ds]=data.healthActivity[ds].filter(function(i){return i.id!==id;}); saveHA(data.healthActivity);
}
function setHealthWater(ds, level) {
  var data=getData(); data.healthWater[ds]=level; saveHW(data.healthWater);
}

// ============================================================
// SEED DATA
// ============================================================
function seedRoutineIfEmpty() {
  var data=getData(); if(data.routine.length>0)return;
  var all=[0,1,2,3,4,5,6];
  [{title:'Shacharit',time:'07:00'},{title:'Mincha',time:'13:30'},{title:'Maariv',time:'21:30'}].forEach(function(s){
    data.routine.push({id:uid(),title:s.title,time:s.time,location:'',days:all});
  });
  saveR(data.routine);
}
function seedFinancialIfEmpty() {
  var data=getData();
  if (!data.finIncome.length) {
    saveFinInc([
      {id:uid(),name:'Weekly pay',      amountLow:350,  amountHigh:350,  frequency:'weekly',   weeks:[0,1,2,3], notes:'Cash, no tax'},
      {id:uid(),name:'Side income',     amountLow:200,  amountHigh:200,  frequency:'monthly',  weeks:[0],       notes:''},
      {id:uid(),name:'TA payment',      amountLow:45,   amountHigh:45,   frequency:'biweekly', weeks:[0,2],     notes:'Weeks 1 & 3'},
      {id:uid(),name:'Amazon side hustle',amountLow:0,  amountHigh:0,    frequency:'monthly',  weeks:[0],       notes:'Variable — log each month'}
    ]);
  }
  if (!data.finExpenses.length) {
    saveFinExp([
      {id:uid(),name:'WiFi',                  amountLow:20,   amountHigh:20,  tag:'Need',       frequency:'monthly',  weeks:[0]},
      {id:uid(),name:'AAA',                   amountLow:6.08, amountHigh:6.08,tag:'Need',       frequency:'monthly',  weeks:[0]},
      {id:uid(),name:'Spotify',               amountLow:21.99,amountHigh:21.99,tag:'Need',      frequency:'monthly',  weeks:[0]},
      {id:uid(),name:'Web Chaver plan 1',     amountLow:5.99, amountHigh:5.99,tag:'Need',       frequency:'monthly',  weeks:[0]},
      {id:uid(),name:'Web Chaver plan 2',     amountLow:7.98, amountHigh:7.98,tag:'Need',       frequency:'monthly',  weeks:[0]},
      {id:uid(),name:'Chavruta',              amountLow:75,   amountHigh:150, tag:'Self-invest', frequency:'biweekly',weeks:[0,2], notes:'Increments of $15, usually $120–$150'},
      {id:uid(),name:"Trader Joe's / Groceries",amountLow:50, amountHigh:50,  tag:'Need',       frequency:'weekly',   weeks:[0,1,2,3]},
      {id:uid(),name:'Dates',                 amountLow:200,  amountHigh:350, tag:'Flexible',   frequency:'weekly',   weeks:[0,1,2,3]},
      {id:uid(),name:'Sudden expenses buffer',amountLow:0,    amountHigh:75,  tag:'Flexible',   frequency:'weekly',   weeks:[0,1,2,3]}
    ]);
  }
  if (!data.finBonuses.length) {
    saveFinBon([
      {id:uid(),name:'One-time payment', amountLow:187.50,amountHigh:187.50,status:'Pending',              notes:'Arriving early May'},
      {id:uid(),name:'Acorns bonus',     amountLow:380,   amountHigh:430,   status:'Better deal possible', notes:'Random timing'}
    ]);
  }
  if (!data.finWishlist.length) {
    saveFinWish([
      {id:uid(),name:'Sunglasses',           cost:110,  tier:'really-want',eta:'',notes:'',order:0},
      {id:uid(),name:'Nice watch',           cost:80,   tier:'really-want',eta:'',notes:'',order:1},
      {id:uid(),name:'Light spring coat',    cost:100,  tier:'really-want',eta:'',notes:'',order:2},
      {id:uid(),name:'Tennis racket set',    cost:250,  tier:'want',       eta:'',notes:'Pending confirmation from Skinny',order:0},
      {id:uid(),name:'Beard trimmer (Ufree)',cost:35,   tier:'want',       eta:'',notes:'',order:1},
      {id:uid(),name:'Ugg house slippers',   cost:50,   tier:'want',       eta:'',notes:'',order:2},
      {id:uid(),name:'Gloves',               cost:40,   tier:'want',       eta:'',notes:'',order:3},
      {id:uid(),name:'Scarves',              cost:0,    tier:'want',       eta:'',notes:'Gift from dad',order:4},
      {id:uid(),name:'Rain/snow shoes',      cost:250,  tier:'want',       eta:'',notes:'',order:5},
      {id:uid(),name:'3× Colognes (Amazon)', cost:450,  tier:'want',       eta:'',notes:'',order:6},
      {id:uid(),name:'On Cloud + dress shoes',cost:500, tier:'want',       eta:'',notes:'',order:7},
      {id:uid(),name:'AirPods 4 ANC',        cost:129,  tier:'can-wait',   eta:'',notes:'Pro 3 at $249 has significantly better ANC',order:0},
      {id:uid(),name:'3 suits (Rahmani)',    cost:1400, tier:'can-wait',   eta:'',notes:'',order:1},
      {id:uid(),name:'iPhone',               cost:750,  tier:'can-wait',   eta:'',notes:'',order:2},
      {id:uid(),name:'MacBook',              cost:1500, tier:'can-wait',   eta:'',notes:'',order:3}
    ]);
  }
  if (!data.moneymaking.length) {
    [{idea:'Amazon FBA / Reselling',status:'idea',notes:'Leverage existing Amazon seller account'},
     {idea:'Freelance Work',status:'idea',notes:'Utilize skills for side income'},
     {idea:'Content Creation',status:'idea',notes:'YouTube/blog around interests'}]
    .forEach(function(d){data.moneymaking.push({id:uid(),idea:d.idea,status:d.status,notes:d.notes,createdAt:new Date().toISOString()});});
    saveMM(data.moneymaking);
  }
}

// ============================================================
// COLOR PICKER
// ============================================================
function buildColorPicker(containerId,selectedVal,onSelect) {
  var el=document.getElementById(containerId); if(!el)return; el.innerHTML='';
  COLORS.forEach(function(c){
    var dot=document.createElement('div');
    dot.className='color-dot'+(c.value===''?' cd-default':'');
    if(c.value===selectedVal)dot.classList.add('selected');
    if(c.value)dot.style.background=c.value;
    dot.title=c.name;
    dot.addEventListener('click',function(){
      el.querySelectorAll('.color-dot').forEach(function(d){d.classList.remove('selected');});
      dot.classList.add('selected'); onSelect(c.value);
    });
    el.appendChild(dot);
  });
}

// ============================================================
// RENDER — TASK ITEM
// Notes are hidden by default; the 📋 button reveals them inline
// ============================================================
// noActions = true in 7-day compact cards (no edit/delete/notes buttons)
function taskHTML(task, ds, noActions) {
  var isR = task.type === 'routine';
  var itemCls = isR ? 'is-routine' : '';
  var priorityCls = isR ? '' : ('task-p-'+(task.priority||'standard'));
  var tb = task.time     ? '<span class="badge badge-time">'+fmt12(task.time)+'</span>'       : '';
  var lb = task.location ? '<span class="badge badge-loc">'+escHtml(task.location)+'</span>'  : '';
  var hasTaskNotes = !isR && task.notes && task.notes.trim();
  var linkedCount = (!isR && task.linkedNoteIds && task.linkedNoteIds.length) ? task.linkedNoteIds.length : 0;
  var notesDot = hasTaskNotes ? '<span class="task-has-notes" title="Has notes"></span>' : '';
  var actionsHTML = '';
  if (!noActions) {
    var eb = isR
      ? '<button class="btn-icon" onclick="openRoutineOverride(\''+ds+'\',\''+task.id+'\')">✏️</button>'
      : '<button class="btn-icon" onclick="openEditTask(\''+ds+'\',\''+task.id+'\')">✏️</button>';
    // Trash: routine = skip today, regular = delete
    var db = isR
      ? '<button class="btn-icon" onclick="skipRoutineDay(\''+ds+'\',\''+task.id+'\')" title="Skip today">🗑</button>'
      : '<button class="btn-icon" onclick="removeTask(\''+ds+'\',\''+task.id+'\')">🗑</button>';
    var moveBtn = '<button class="btn-icon task-move-btn" onclick="openMoveTaskModal(\''+ds+'\',\''+task.id+'\','+isR+')" title="Move to another day">→</button>';
    var nb = hasTaskNotes ? '<button class="btn-icon task-notes-btn" onclick="toggleTaskNotes(this)" title="View notes">📋</button>' : '';
    var linkBtn = !isR ? '<button class="btn-icon task-link-btn'+(linkedCount?' has-links':'')+'" onclick="openTaskNotesLink(\''+ds+'\',\''+task.id+'\')" title="'+(linkedCount?linkedCount+' linked note'+(linkedCount>1?'s':''):'Link notes')+'">📎'+(linkedCount?'<span class="link-count">'+linkedCount+'</span>':'')+'</button>' : '';
    actionsHTML = '<div class="task-actions">'+linkBtn+nb+eb+db+moveBtn+'</div>';
  }
  var notesPanel = (!noActions && hasTaskNotes)
    ? '<div class="task-notes-panel" style="display:none">'+escHtml(task.notes)+'</div>' : '';
  var itemClick = noActions
    ? ' onclick="openDashDayPopup(\''+ds+'\')"'
    : ' onclick="taskClick(\''+ds+'\',\''+task.id+'\','+isR+',event)"';
  var dragAttrs = ' draggable="true"'
    +' ondragstart="taskDragStart(event,\''+ds+'\',\''+task.id+'\')"'
    +' ondragover="taskDragOver(event)"'
    +' ondragleave="taskDragLeave(event)"'
    +' ondrop="taskDrop(event,\''+ds+'\',\''+task.id+'\')"'
    +' ondragend="taskDragEnd(event)"';
  var dragHandle = !noActions
    ? '<span class="task-drag-handle" onclick="event.stopPropagation()" title="Drag to reorder">⠿</span>'
    : '';
  var ctxMenu=!isR?' oncontextmenu="taskContextMenu(event,\''+ds+'\',\''+task.id+'\')"':'';
  return '<div class="task-item '+itemCls+(task.done?' is-done':'')+(noActions?' task-compact-click':' task-clickable')+'" id="ti-'+task.id+'"'+itemClick+dragAttrs+ctxMenu+'>' +
    dragHandle+
    '<input type="checkbox" class="task-check"'+(task.done?' checked':'')+' onclick="event.stopPropagation()" onchange="checkTask(\''+ds+'\',\''+task.id+'\','+isR+')">' +
    '<div class="task-body"><div class="task-title '+priorityCls+'">'+escHtml(task.title)+notesDot+'</div>' +
    '<div class="task-meta">'+tb+lb+'</div>'+notesPanel+'</div>' +
    actionsHTML+'</div>';
}

// ============================================================
// RENDER — DAY CARD
// compact = true (7-day): no zmanim strip, header is clickable popup
// compact = false (today): full card with zmanim strip
// ============================================================
function dayCardHTML(date, compact) {
  var ds    = toDateStr(date);
  var today = isToday(date);
  var tasks = getTasksForDate(ds);
  var chip  = today ? ' <span class="today-chip">Today</span>' : '';
  var head  = compact
    ? '<div class="day-card-name">'+shortDay(date)+chip+'</div><div class="day-card-label">'+shortMonthDay(date)+'</div><div class="day-card-hdate" id="hdate-'+ds+'">...</div>'
    : '<div class="day-card-name">'+dayName(date)+chip+'</div><div class="day-card-label">'+monthDay(date)+'</div><div class="day-card-hdate" id="hdate-'+ds+'">...</div>';
  var displayTasks = compact ? tasks.filter(function(t){return !t.done;}) : tasks;
  var tHTML = displayTasks.length
    ? displayTasks.map(function(t){return taskHTML(t,ds,compact);}).join('')
    : '<div class="empty-tasks">'+(compact?'Nothing pending':'No tasks yet')+'</div>';

  // In compact (7-day) mode: clickable header opens day popup, no zmanim strip
  // In full mode: zmanim strip shown
  var headSection = compact
    ? '<div class="day-card-head">'+head+'</div>'
    : '<div class="day-card-head">'+head+'</div>';
  var zmanimSection = compact ? '' :
    '<div class="zmanim-strip" onclick="openZmanim(\''+ds+'\')">' +
    '<div id="zs-'+ds+'" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;width:100%">' +
    '<span class="z-loading">Loading times…</span><span class="z-expand">Tap for all times ›</span>' +
    '</div></div>';

  var crossDayAttrs=compact?' ondragover="dayCardDragOver(event,\''+ds+'\')" ondragleave="dayCardDragLeave(event)" ondrop="dayCardDrop(event,\''+ds+'\')"':'';
  return '<div class="day-card'+(today?' is-today':'')+(compact?' day-card-compact':'')+'"'+(compact?' onclick="compactCardClick(\''+ds+'\',event)"':'')+crossDayAttrs+'>'+
    headSection + zmanimSection +
    '<div class="task-list">'+tHTML+'</div>' +
    '<button class="add-task-row" onclick="event.stopPropagation();openAddTask(\''+ds+'\')">+ Add task or event</button>' +
    '</div>';
}

// ============================================================
// RENDER — DASHBOARD VIEWS
// ============================================================
function renderSingle() {
  var date=dateFromOffset(state.dayOffset);
  var ds=toDateStr(date);
  var remBanner=state.dayOffset===0?renderReminderBanner():'';
  var banner=state.dayOffset===0?renderCarryOverBanner():'';
  document.getElementById('singleDayContainer').innerHTML=remBanner+banner+dayCardHTML(date,false);
  loadZstrip(ds);
  loadHebrewDate(ds);
  document.getElementById('backToTodayBtn').style.display=state.dayOffset===0?'none':'';
}
function renderSeven() {
  var s=state.weekStart;
  var dates=[]; var html='';
  for (var i=s;i<s+7;i++){
    var d=dateFromOffset(i); dates.push(d); html+=dayCardHTML(d,true);
  }
  document.getElementById('sevenDayGrid').innerHTML=html;
  dates.forEach(function(d){ loadHebrewDate(toDateStr(d)); }); // No zmanim in 7-day
}
function refresh() {
  if (state.dashView==='single') renderSingle();
  else if (state.dashView==='seven') renderSeven();
}
function refreshDashDayModal() {
  if (!state.dashDayModalDs) return;
  var modal=document.getElementById('dashDayModal');
  if (!modal||!modal.classList.contains('open')) return;
  renderDashDayModalBody(state.dashDayModalDs);
}

// ============================================================
// RENDER — SHORT TERM / LONG TERM
// ============================================================
function renderSimpleList(list,containerId) {
  var data=getData(); var items=data[list]; var el=document.getElementById(containerId); if(!el)return;
  if (!items.length){ el.innerHTML='<div class="stl-empty">Nothing here yet. Hit + Add to get started.</div>'; return; }
  var inc=items.filter(function(i){return !i.done;}); var don=items.filter(function(i){return i.done;});
  el.innerHTML=inc.concat(don).map(function(item){
    var notesHTML=item.notes&&item.notes.trim()?'<div class="stl-item-notes">'+escHtml(item.notes)+'</div>':'';
    return '<div class="stl-item'+(item.done?' is-done':'')+'" draggable="true" data-id="'+item.id+'" data-list="'+list+'" '+
      'ondragstart="stlDragStart(event)" ondragover="stlDragOver(event)" ondrop="stlDrop(event)" ondragleave="stlDragLeave(event)" ondragend="stlDragEnd(event)">' +
      '<div class="stl-drag-handle" title="Drag to reorder">⠿</div>' +
      '<input type="checkbox" class="task-check"'+(item.done?' checked':'')+' onchange="toggleSTItem(\''+list+'\',\''+item.id+'\')">' +
      '<div class="stl-item-body"><div class="stl-item-title">'+escHtml(item.title)+'</div>'+notesHTML+'</div>' +
      '<div class="stl-actions">'+
        '<button class="btn-icon" onclick="openEditSTItem(\''+list+'\',\''+item.id+'\')">✏️</button>'+
        (!item.done?'<button class="btn-move" onclick="openMoveToDay(\''+list+'\',\''+item.id+'\')" title="Move to dashboard">→</button>':'')+
        '<button class="btn-icon" onclick="deleteSTItem(\''+list+'\',\''+item.id+'\')">🗑</button>'+
      '</div></div>';
  }).join('');
}
function renderShortTerm(){ renderSimpleList('shortterm','shortTermList'); }
function renderLongTerm() { renderSimpleList('longterm','longTermList');  }
function renderFuture()   { renderShortTerm(); renderLongTerm(); }

// ============================================================
// RENDER — CHESHBON
// ============================================================
var CHESHBON_DAYS = ['mon','tue','wed','thu','fri','sat','sun'];
var CHESHBON_DAY_LABELS = {mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat',sun:'Sun'};

function renderCheshbonLeft() {
  var data = getData();
  // Pad arrays to correct lengths
  var grat = data.gratitude.slice(); while(grat.length<10) grat.push('');
  var ayin = data.ayinTov.slice();   while(ayin.length<5)  ayin.push('');
  var gEl=document.getElementById('gratitudeList'); if(!gEl)return;
  gEl.innerHTML=grat.map(function(v,i){
    return '<div class="refl-input-row"><span class="refl-num">'+(i+1)+'.</span>'+
      '<input type="text" class="refl-input" value="'+escHtml(v)+'" placeholder="I am grateful for..." oninput="autoSaveGratitude()"></div>';
  }).join('');
  var aEl=document.getElementById('ayinTovList'); if(!aEl)return;
  aEl.innerHTML=ayin.map(function(v,i){
    return '<div class="refl-input-row"><span class="refl-num">'+(i+1)+'.</span>'+
      '<input type="text" class="refl-input" value="'+escHtml(v)+'" placeholder="Something good I noticed..." oninput="autoSaveAyinTov()"></div>';
  }).join('');
  var lEl=document.getElementById('learnedToday'); if(lEl) lEl.value=data.learned;
  var fEl=document.getElementById('feelingToday'); if(fEl) fEl.value=data.feeling;
}
function renderCheshbonRight() {
  var data=getData(); var el=document.getElementById('cheshbonItemsList'); if(!el)return;
  if(!data.cheshbonItems.length){el.innerHTML='<div class="cheshbon-empty">No items yet. Click "+ Add Item" to add reflection areas.</div>';return;}
  el.innerHTML=data.cheshbonItems.map(function(item){
    var checks=data.cheshbonChecks[item.id]||{};
    var dayBoxes=CHESHBON_DAYS.map(function(d){
      return '<div class="cheshbon-day-cell"><input type="checkbox"'+(checks[d]?' checked':'')+
        ' onchange="toggleCheshbonCheck(\''+item.id+'\',\''+d+'\')" title="'+CHESHBON_DAY_LABELS[d]+'"></div>';
    }).join('');
    return '<div class="cheshbon-item-row" draggable="true" data-cid="'+item.id+'"'+
      ' ondragstart="chiDragStart(event)" ondragover="chiDragOver(event)" ondrop="chiDrop(event)" ondragleave="chiDragLeave(event)" ondragend="chiDragEnd(event)">'+
      '<span class="chi-drag-handle" title="Drag to reorder">⠿</span>'+
      '<div class="cheshbon-item-text">'+escHtml(item.text)+'</div>'+
      '<div class="cheshbon-item-days">'+dayBoxes+'</div>'+
      '<div class="cheshbon-item-actions">'+
        '<button class="btn-icon" onclick="openEditCheshbonItem(\''+item.id+'\')">✏️</button>'+
        '<button class="btn-icon" onclick="removeCheshbonItem(\''+item.id+'\')">🗑</button>'+
      '</div></div>';
  }).join('');
}

// Drag-and-drop for cheshbon items
var _chiDrag = { srcId: null };
window.chiDragStart = function(e) {
  _chiDrag.srcId = e.currentTarget.dataset.cid;
  e.currentTarget.classList.add('chi-dragging');
  e.dataTransfer.effectAllowed = 'move';
};
window.chiDragOver = function(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('chi-drag-over');
};
window.chiDragLeave = function(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.classList.remove('chi-drag-over');
};
window.chiDragEnd = function(e) {
  e.currentTarget.classList.remove('chi-dragging');
  document.querySelectorAll('.cheshbon-item-row').forEach(function(r){ r.classList.remove('chi-drag-over'); });
};
window.chiDrop = function(e) {
  e.preventDefault();
  var tgtId = e.currentTarget.dataset.cid;
  e.currentTarget.classList.remove('chi-drag-over');
  if (!_chiDrag.srcId || _chiDrag.srcId === tgtId) return;
  var data = getData();
  var arr = data.cheshbonItems;
  var si = arr.findIndex(function(i){return i.id===_chiDrag.srcId;});
  var ti = arr.findIndex(function(i){return i.id===tgtId;});
  if (si === -1 || ti === -1) return;
  var item = arr.splice(si, 1)[0]; arr.splice(ti, 0, item);
  saveChi(arr);
  _chiDrag.srcId = null;
  renderCheshbonRight();
};
function renderCheshbon() {
  renderCheshbonLeft();
  renderCheshbonRight();
  if (state.activeCheshTab === 'weekly')  renderWeeklyTab();
  if (state.activeCheshTab === 'monthly') renderMonthlyTab();
}

// ============================================================
// CHESHBON SUB-TABS
// ============================================================
function getSundayStr(date) {
  var d = date ? new Date(date) : new Date();
  d.setHours(0,0,0,0);
  var dow = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - dow);
  return toDateStr(d);
}

function getWeekDays(sundayStr) {
  var days=[]; var sun=fromDateStr(sundayStr);
  for(var i=0;i<7;i++){var d=new Date(sun);d.setDate(sun.getDate()+i);days.push(toDateStr(d));}
  return days;
}
function calcWeightStats(entries,weekDays){
  var logged=weekDays.filter(function(ds){return entries[ds];}).map(function(ds){return{ds:ds,w:parseFloat(entries[ds])};});
  if(!logged.length)return null;
  var weights=logged.map(function(e){return e.w;});
  var start=logged[0].w, current=logged[logged.length-1].w;
  var avg=weights.reduce(function(a,b){return a+b;},0)/weights.length;
  return{start:start,current:current,change:current-start,avg:avg,min:Math.min.apply(null,weights),max:Math.max.apply(null,weights),count:logged.length};
}
function renderWeightSparkline(entries,weekDays){
  var logged=weekDays.map(function(ds,i){return{i:i,w:entries[ds]?parseFloat(entries[ds]):null};}).filter(function(p){return p.w!==null;});
  if(logged.length<2)return'<div class="wt-spark-placeholder">'+(logged.length===1?'Log more days to see trend':'No entries yet')+'</div>';
  var W=320,H=80,PAD=12;
  var weights=logged.map(function(p){return p.w;});
  var minW=Math.min.apply(null,weights),maxW=Math.max.apply(null,weights),range=maxW-minW||0.5;
  var pts=logged.map(function(p){
    return{x:PAD+(p.i/6)*(W-PAD*2),y:PAD+(1-(p.w-minW)/range)*(H-PAD*2)};
  });
  var path=pts.map(function(p,i){return(i===0?'M':'L')+p.x.toFixed(1)+','+p.y.toFixed(1);}).join(' ');
  var area=path+' L'+pts[pts.length-1].x.toFixed(1)+','+(H-PAD)+' L'+pts[0].x.toFixed(1)+','+(H-PAD)+' Z';
  var dots=pts.map(function(p){return'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="3.5" fill="#6366f1" stroke="#fff" stroke-width="2"/>';}).join('');
  return'<svg class="wt-spark" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">'+
    '<path d="'+area+'" fill="#6366f1" fill-opacity="0.08"/>'+
    '<path d="'+path+'" fill="none" stroke="#6366f1" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>'+
    dots+'</svg>';
}
function checkWeightAutoArchive(){
  var data=getData(); var currentSun=getSundayStr(); var lastSun=data.weightLastSunday;
  if(lastSun&&lastSun<currentSun){
    var weekDays=getWeekDays(lastSun);
    var entries={};
    weekDays.forEach(function(ds){if(data.weightEntries[ds])entries[ds]=data.weightEntries[ds];});
    if(Object.keys(entries).length>0){
      var stats=calcWeightStats(entries,weekDays);
      var history=data.weightHistory||[]; history.unshift({weekStart:lastSun,entries:entries,stats:stats});
      localStorage.setItem('dm_weight_history',JSON.stringify(history));
    }
    localStorage.setItem('dm_weight_last_sunday',currentSun);
  } else if(!lastSun){
    localStorage.setItem('dm_weight_last_sunday',currentSun);
  }
}
function renderWeightTracker(){
  var el=document.getElementById('weightTrackerContent'); if(!el)return;
  checkWeightAutoArchive();
  var data=getData();
  var sundayStr=getSundayStr();
  var weekDays=getWeekDays(sundayStr);
  var todayDs=toDateStr(new Date());
  var entries=data.weightEntries||{};
  var goal=data.weightGoal;
  var stats=calcWeightStats(entries,weekDays);
  var todayWeight=entries[todayDs]||'';
  // Goal
  var goalHTML='';
  if(goal){
    var cur=stats?stats.current:null;
    if(cur!==null){
      var diff=parseFloat((cur-goal).toFixed(1));
      goalHTML=diff<=0
        ?'<div class="wt-goal wt-goal-reached">🎉 Goal reached! ('+goal+' lbs)</div>'
        :'<div class="wt-goal">Goal: <strong>'+goal+' lbs</strong> — <span class="wt-goal-diff">'+diff+' lbs to go</span></div>';
    } else {
      goalHTML='<div class="wt-goal">Goal: <strong>'+goal+' lbs</strong></div>';
    }
  }
  // Stats row
  var statsHTML='';
  if(stats&&stats.count>=1){
    var cs=stats.change>0?'wt-stat-up':stats.change<0?'wt-stat-down':'';
    var csign=stats.change>0?'+':'';
    statsHTML='<div class="wt-stats-row">'+
      '<div class="wt-stat"><div class="wt-stat-label">Start</div><div class="wt-stat-val">'+stats.start.toFixed(1)+'</div></div>'+
      '<div class="wt-stat"><div class="wt-stat-label">Current</div><div class="wt-stat-val">'+stats.current.toFixed(1)+'</div></div>'+
      '<div class="wt-stat"><div class="wt-stat-label">Change</div><div class="wt-stat-val '+cs+'">'+csign+stats.change.toFixed(1)+'</div></div>'+
      '<div class="wt-stat"><div class="wt-stat-label">Avg</div><div class="wt-stat-val">'+stats.avg.toFixed(1)+'</div></div>'+
      '<div class="wt-stat"><div class="wt-stat-label">Low</div><div class="wt-stat-val">'+stats.min.toFixed(1)+'</div></div>'+
      '<div class="wt-stat"><div class="wt-stat-label">High</div><div class="wt-stat-val">'+stats.max.toFixed(1)+'</div></div>'+
    '</div>';
  }
  // Sparkline
  var sparkHTML='<div class="wt-spark-wrap">'+(stats&&stats.count>=2?renderWeightSparkline(entries,weekDays):'<div class="wt-spark-placeholder">'+(stats&&stats.count===1?'Log more days to see chart':'No entries this week yet')+'</div>')+'</div>';
  // Daily list
  var dayLabels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var dailyHTML=weekDays.map(function(ds,i){
    var w=entries[ds]; var isT=ds===todayDs;
    var d=fromDateStr(ds);
    var dLabel=d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    var actions=w
      ?'<div class="wt-day-actions">'+
          '<button class="btn-icon wt-day-btn" onclick="startEditWeightDay(\''+ds+'\')" title="Edit">✏️</button>'+
          '<button class="btn-icon wt-day-btn" onclick="deleteWeightDay(\''+ds+'\')" title="Delete">🗑</button>'+
        '</div>'
      :'';
    return'<div class="wt-day-row'+(isT?' wt-day-today':'')+'" id="wtr-'+ds+'">'+
      '<span class="wt-day-label">'+dayLabels[i]+'<span class="wt-day-date"> '+dLabel+'</span></span>'+
      (w?'<span class="wt-day-weight">'+parseFloat(w).toFixed(1)+' lbs</span>':'<span class="wt-day-empty">—</span>')+
      actions+
    '</div>';
  }).join('');
  el.innerHTML=goalHTML+
    '<div class="wt-log-row">'+
      '<input type="number" id="wtTodayInput" class="field wt-input" placeholder="Today\'s weight (lbs)" value="'+escHtml(String(todayWeight))+'" step="0.1" min="50" max="600">'+
      '<button class="btn-primary wt-log-btn" onclick="logWeight()">Log</button>'+
    '</div>'+
    statsHTML+sparkHTML+
    '<div class="wt-week-list">'+dailyHTML+'</div>';
}

function checkWeeklyAutoArchive() {
  var data = getData();
  var currentSunday = getSundayStr(new Date());
  var stored = data.weeklyLastSunday;
  if (!stored) { saveWLS(currentSunday); return; }
  if (currentSunday <= stored) return;
  // New week — archive old data if there are any items with scores
  if (data.weeklyItems.length) {
    var oldScores = data.weeklyScores[stored] || {};
    var archivedItems = data.weeklyItems.map(function(item) {
      var sc = oldScores[item.id] || {};
      return { text: item.text, score: sc.score || '', focus: sc.focus || '' };
    });
    var oldSunday = fromDateStr(stored);
    var oldSat = new Date(oldSunday); oldSat.setDate(oldSunday.getDate() + 6);
    var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var weekEnd = MON[oldSat.getMonth()]+' '+oldSat.getDate()+', '+oldSat.getFullYear();
    var weekStart = MON[oldSunday.getMonth()]+' '+oldSunday.getDate();
    data.weeklyHistory.unshift({
      id: uid(), weekStart: weekStart, weekEnd: weekEnd,
      archivedAt: new Date().toISOString(), items: archivedItems
    });
    saveWH(data.weeklyHistory);
  }
  saveWLS(currentSunday);
}

function getWeekBannerText() {
  var sunStr = getSundayStr(new Date());
  var sun = fromDateStr(sunStr);
  var sat = new Date(sun); sat.setDate(sun.getDate() + 6);
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  if (sun.getMonth() === sat.getMonth()) {
    return 'Week of '+MONTHS[sun.getMonth()]+' '+sun.getDate()+' – '+sat.getDate()+', '+sat.getFullYear();
  }
  return 'Week of '+MONTHS_SHORT[sun.getMonth()]+' '+sun.getDate()+' – '+MONTHS_SHORT[sat.getMonth()]+' '+sat.getDate()+', '+sat.getFullYear();
}

function renderWeeklyTab() {
  checkWeeklyAutoArchive();
  var data = getData();
  var sunStr = getSundayStr(new Date());
  var scores = data.weeklyScores[sunStr] || {};
  var html = '<div class="weekly-week-banner">' + escHtml(getWeekBannerText()) + '</div>';
  html += '<div style="margin-bottom:12px"><button class="btn-primary" style="font-size:13px;padding:7px 14px" onclick="openAddWeeklyItem()">+ Add Item</button></div>';
  if (data.weeklyItems.length) {
    html += '<div class="weekly-tbl-hdr"><span>Item</span><span>Score (1-10)</span><span>Actions</span></div>';
    html += data.weeklyItems.map(function(item) {
      var sc = scores[item.id] || {};
      return '<div class="weekly-item-row">'+
        '<div class="weekly-item-text">'+escHtml(item.text)+'</div>'+
        '<div><input type="number" class="weekly-score-input" min="1" max="10" value="'+escHtml(String(sc.score||''))+'" placeholder="—" onchange="updateWeeklyScore(\''+item.id+'\',\'score\',this.value)"></div>'+
        '<div style="display:flex;gap:4px">'+
          '<button class="btn-icon" onclick="openEditWeeklyItem(\''+item.id+'\')">✏️</button>'+
          '<button class="btn-icon" onclick="removeWeeklyItem(\''+item.id+'\')">🗑</button>'+
        '</div>'+
      '</div>';
    }).join('');
  } else {
    html += '<div style="color:#aaa;font-size:14px;padding:12px 0">No weekly items yet. Click "+ Add Item" to get started.</div>';
  }
  // History section
  html += '<div class="hist-section" style="margin-top:28px">'+
    '<div class="hist-section-hdr"><span>Past Weeks</span>'+
    '<input type="text" id="weeklyHistSearch" class="hist-search" placeholder="Search..." oninput="renderWeeklyHist()">'+
    '</div><div id="weeklyHistList"></div></div>';
  document.getElementById('weeklyTabContent').innerHTML = html;
  renderWeeklyHist();
}

function renderWeeklyHist() {
  var data = getData();
  var searchEl = document.getElementById('weeklyHistSearch');
  var q = (searchEl ? searchEl.value : '').toLowerCase();
  var list = document.getElementById('weeklyHistList'); if (!list) return;
  var entries = data.weeklyHistory.filter(function(e) {
    if (!q) return true;
    var hay = (e.weekStart+' '+e.weekEnd+' '+e.items.map(function(i){return i.text;}).join(' ')).toLowerCase();
    return hay.includes(q);
  });
  if (!entries.length) { list.innerHTML='<div style="color:#aaa;font-size:13px">No past weeks yet.</div>'; return; }
  list.innerHTML = entries.map(function(e, idx) {
    return '<div class="hist-entry" onclick="toggleWeeklyHistEntry(this,\''+e.id+'\')">'+
      '<div class="hist-entry-hdr">'+
        '<span class="hist-entry-title">Week of '+escHtml(e.weekStart)+' – '+escHtml(e.weekEnd)+'</span>'+
        '<span class="hist-entry-date">'+new Date(e.archivedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})+'</span>'+
      '</div>'+
      '<div class="hist-entry-body" id="wh-body-'+escHtml(e.id)+'"></div>'+
    '</div>';
  }).join('');
}

window.toggleWeeklyHistEntry = function(el, entryId) {
  var body = el.querySelector('.hist-entry-body'); if (!body) return;
  if (body.classList.contains('open')) { body.classList.remove('open'); return; }
  var data = getData();
  var e = data.weeklyHistory.find(function(x){return x.id===entryId;}); if (!e) return;
  body.innerHTML = '<div style="margin-top:8px">'+
    '<div style="display:grid;grid-template-columns:1fr 80px;gap:6px;font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;margin-bottom:4px;padding:0 2px">'+
    '<span>Item</span><span>Score</span></div>'+
    e.items.map(function(item){
      return '<div style="display:grid;grid-template-columns:1fr 80px;gap:6px;font-size:13px;padding:4px 2px;border-bottom:1px solid #f5f5f5">'+
        '<span>'+escHtml(item.text)+'</span>'+
        '<span style="color:#555">'+(item.score||'—')+'</span>'+
      '</div>';
    }).join('')+
  '</div>';
  body.classList.add('open');
};

window.updateWeeklyScore = function(itemId, field, val) {
  var data = getData();
  var sunStr = getSundayStr(new Date());
  if (!data.weeklyScores[sunStr]) data.weeklyScores[sunStr] = {};
  if (!data.weeklyScores[sunStr][itemId]) data.weeklyScores[sunStr][itemId] = {};
  var n = parseInt(val); if (isNaN(n)||n<1) n=''; else if (n>10) n=10;
  data.weeklyScores[sunStr][itemId][field] = n;
  saveWS(data.weeklyScores);
};

window.removeWeeklyItem = function(id) {
  if (!confirm('Remove this weekly item?')) return;
  var data = getData();
  saveWI(data.weeklyItems.filter(function(i){return i.id!==id;}));
  renderWeeklyTab();
};

window.openAddWeeklyItem = function() {
  state.editWeeklyItemId = null;
  document.getElementById('weeklyItemModalTitle').textContent = 'Add Weekly Item';
  document.getElementById('weeklyItemText').value = '';
  openModal('weeklyItemModal');
  setTimeout(function(){document.getElementById('weeklyItemText').focus();}, 80);
};

window.openEditWeeklyItem = function(id) {
  var data = getData();
  var item = data.weeklyItems.find(function(i){return i.id===id;}); if (!item) return;
  state.editWeeklyItemId = id;
  document.getElementById('weeklyItemModalTitle').textContent = 'Edit Weekly Item';
  document.getElementById('weeklyItemText').value = item.text;
  openModal('weeklyItemModal');
  setTimeout(function(){document.getElementById('weeklyItemText').focus();}, 80);
};

// ============================================================
// MONTHLY TAB
// ============================================================
function renderMonthlyTab() {
  var data = getData();
  var jd = data.monthlyJewishDraft;
  var sd = data.monthlySecularDraft;
  var ji = document.getElementById('jewishMonthInput');
  var si = document.getElementById('secularMonthInput');
  var st = document.getElementById('secularMonthText');
  if (ji) ji.value = jd.month || '';
  if (si) si.value = sd.month || '';
  if (st) st.value = sd.text || '';
  renderJewishHist();
  renderSecularHist();
}

window.saveJewishDraft = function() {
  var v = (document.getElementById('jewishMonthInput')||{}).value || '';
  saveMJD({month: v});
};

window.saveSecularDraft = function() {
  var m = (document.getElementById('secularMonthInput')||{}).value || '';
  var t = (document.getElementById('secularMonthText')||{}).value || '';
  saveMSD({month: m, text: t});
};

window.startRecording = function() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Microphone access is not available in this browser.'); return;
  }
  navigator.mediaDevices.getUserMedia({audio: true}).then(function(stream) {
    _audioChunks = []; _recordSecs = 0; _currentAudioBlob = null;
    _mediaRecorder = new MediaRecorder(stream);
    _mediaRecorder.addEventListener('dataavailable', function(e) { _audioChunks.push(e.data); });
    _mediaRecorder.addEventListener('stop', function() {
      _currentAudioBlob = new Blob(_audioChunks, {type: 'audio/webm'});
      var url = URL.createObjectURL(_currentAudioBlob);
      var ap = document.getElementById('audioPlayback');
      if (ap) ap.innerHTML = '<audio controls src="'+url+'" style="width:100%;margin-top:4px"></audio>';
      stream.getTracks().forEach(function(t){t.stop();});
    });
    _mediaRecorder.start();
    document.getElementById('btnStartRecord').style.display = 'none';
    document.getElementById('btnStopRecord').style.display  = '';
    document.getElementById('recordTimer').style.display    = '';
    _recordTimerInt = setInterval(function() {
      _recordSecs++;
      var m = Math.floor(_recordSecs/60), s = _recordSecs%60;
      var el = document.getElementById('recordTimer');
      if (el) el.textContent = m+':'+(s<10?'0':'')+s;
    }, 1000);
  }).catch(function(err) { alert('Could not access microphone: '+err.message); });
};

window.stopRecording = function() {
  if (_mediaRecorder && _mediaRecorder.state !== 'inactive') _mediaRecorder.stop();
  clearInterval(_recordTimerInt);
  document.getElementById('btnStartRecord').style.display = '';
  document.getElementById('btnStopRecord').style.display  = 'none';
  document.getElementById('recordTimer').style.display    = 'none';
};

window.storeJewishMonth = function() {
  var month = (document.getElementById('jewishMonthInput')||{}).value.trim();
  if (!month) { alert('Please enter a Jewish month name.'); return; }
  var doSave = function(audioKey) {
    var data = getData();
    data.monthlyJewishHistory.unshift({
      id: uid(), month: month, audioKey: audioKey || '',
      storedAt: new Date().toISOString()
    });
    saveMJH(data.monthlyJewishHistory);
    saveMJD({month: ''});
    var ji = document.getElementById('jewishMonthInput'); if (ji) ji.value = '';
    var ap = document.getElementById('audioPlayback'); if (ap) ap.innerHTML = '';
    _currentAudioBlob = null;
    renderJewishHist();
  };
  if (_currentAudioBlob) {
    var key = uid();
    saveAudioBlob(key, _currentAudioBlob).then(function(){ doSave(key); });
  } else {
    doSave('');
  }
};

window.storeSecularMonth = function() {
  var month = (document.getElementById('secularMonthInput')||{}).value.trim();
  var text  = (document.getElementById('secularMonthText')||{}).value.trim();
  if (!month) { alert('Please enter a secular month name.'); return; }
  var data = getData();
  data.monthlySecularHistory.unshift({
    id: uid(), month: month, text: text, storedAt: new Date().toISOString()
  });
  saveMSH(data.monthlySecularHistory);
  saveMSD({month:'',text:''});
  var si = document.getElementById('secularMonthInput'); if (si) si.value = '';
  var st = document.getElementById('secularMonthText'); if (st) st.value = '';
  renderSecularHist();
};

function renderJewishHist() {
  var data = getData();
  var searchEl = document.getElementById('jewishHistSearch');
  var q = (searchEl ? searchEl.value : '').toLowerCase();
  var list = document.getElementById('jewishHistList'); if (!list) return;
  var entries = data.monthlyJewishHistory.filter(function(e) {
    return !q || e.month.toLowerCase().includes(q) ||
      new Date(e.storedAt).toLocaleDateString().toLowerCase().includes(q);
  });
  if (!entries.length) { list.innerHTML='<div style="color:#aaa;font-size:13px;margin-top:8px">No entries yet.</div>'; return; }
  list.innerHTML = entries.map(function(e) {
    var dt = new Date(e.storedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    return '<div class="jewish-hist-entry">'+
      '<div style="display:flex;justify-content:space-between;align-items:center">'+
        '<span class="jewish-hist-month">'+escHtml(e.month)+'</span>'+
        '<span class="jewish-hist-date">'+escHtml(dt)+'</span>'+
      '</div>'+
      (e.audioKey ? '<button class="btn-secondary" style="font-size:12px;padding:4px 10px;margin-top:6px" onclick="playJewishAudio(\''+e.audioKey+'\')">▶ Play</button>' : '')+
    '</div>';
  }).join('');
}

function renderSecularHist() {
  var data = getData();
  var searchEl = document.getElementById('secularHistSearch');
  var q = (searchEl ? searchEl.value : '').toLowerCase();
  var list = document.getElementById('secularHistList'); if (!list) return;
  var entries = data.monthlySecularHistory.filter(function(e) {
    return !q || e.month.toLowerCase().includes(q) ||
      (e.text||'').toLowerCase().includes(q) ||
      new Date(e.storedAt).toLocaleDateString().toLowerCase().includes(q);
  });
  if (!entries.length) { list.innerHTML='<div style="color:#aaa;font-size:13px;margin-top:8px">No entries yet.</div>'; return; }
  list.innerHTML = entries.map(function(e) {
    var dt = new Date(e.storedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    return '<div class="hist-entry" onclick="this.querySelector(\'.hist-entry-body\').classList.toggle(\'open\')">'+
      '<div class="hist-entry-hdr">'+
        '<span class="hist-entry-title">'+escHtml(e.month)+'</span>'+
        '<span class="hist-entry-date">'+escHtml(dt)+'</span>'+
      '</div>'+
      '<div class="hist-entry-body">'+escHtml(e.text||'')+'</div>'+
    '</div>';
  }).join('');
}

window.playJewishAudio = function(key) {
  loadAudioBlob(key).then(function(blob) {
    if (!blob) { alert('Audio not found.'); return; }
    var url = URL.createObjectURL(blob);
    var audio = new Audio(url);
    audio.play();
  });
};

// ============================================================
// FREE REFLECTION
// ============================================================
window.storeFreeRefl = function() {
  var title = (document.getElementById('freeReflTitle')||{}).value.trim();
  var text  = (document.getElementById('freeReflText')||{}).value.trim();
  if (!text) { alert('Please write something before storing.'); return; }
  if (!title) title = new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  var data = getData();
  data.freeReflHistory.unshift({
    id: uid(), date: new Date().toISOString(), title: title, text: text
  });
  saveFRH(data.freeReflHistory);
  var ti = document.getElementById('freeReflTitle'); if (ti) ti.value = '';
  var tx = document.getElementById('freeReflText');  if (tx) tx.value = '';
  renderFreeReflHist();
};

window.renderFreeReflHist = function() {
  var data = getData();
  var searchEl = document.getElementById('freeReflSearch');
  var q = (searchEl ? searchEl.value : '').toLowerCase();
  var list = document.getElementById('freeReflHistList'); if (!list) return;
  var entries = data.freeReflHistory.filter(function(e) {
    return !q || e.title.toLowerCase().includes(q) || e.text.toLowerCase().includes(q) ||
      new Date(e.date).toLocaleDateString().toLowerCase().includes(q);
  });
  if (!entries.length) { list.innerHTML='<div style="color:#aaa;font-size:13px">No reflections stored yet.</div>'; return; }
  list.innerHTML = entries.map(function(e) {
    var dt = new Date(e.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    return '<div class="hist-entry" onclick="this.querySelector(\'.hist-entry-body\').classList.toggle(\'open\')">'+
      '<div class="hist-entry-hdr">'+
        '<span class="hist-entry-title">'+escHtml(e.title)+'</span>'+
        '<span class="hist-entry-date">'+escHtml(dt)+'</span>'+
      '</div>'+
      '<div class="hist-entry-body">'+escHtml(e.text)+'</div>'+
    '</div>';
  }).join('');
};

// Auto-save (called inline from input oninput)
window.autoSaveGratitude = function(){ saveGrat(Array.from(document.querySelectorAll('#gratitudeList .refl-input')).map(function(i){return i.value;})); };
window.autoSaveAyinTov   = function(){ saveAyin(Array.from(document.querySelectorAll('#ayinTovList .refl-input')).map(function(i){return i.value;})); };
window.autoSaveLearned   = function(){ var e=document.getElementById('learnedToday'); if(e)saveLrnd(e.value); };
window.autoSaveFeeling   = function(){ var e=document.getElementById('feelingToday'); if(e)saveFeel(e.value); };

// Refresh left panel — stores to history and clears
window.refreshReflection = function() {
  if(!confirm('Save this reflection to history and start a fresh entry?'))return;
  var grat=Array.from(document.querySelectorAll('#gratitudeList .refl-input')).map(function(i){return i.value;});
  var ayin=Array.from(document.querySelectorAll('#ayinTovList .refl-input')).map(function(i){return i.value;});
  var learned=(document.getElementById('learnedToday')||{}).value||'';
  var feeling=(document.getElementById('feelingToday')||{}).value||'';
  var data=getData();
  data.reflHistory.unshift({date:toDateStr(new Date()),gratitude:grat,ayinTov:ayin,learned:learned,feeling:feeling});
  saveRHist(data.reflHistory);
  saveGrat(Array(10).fill('')); saveAyin(Array(5).fill('')); saveLrnd(''); saveFeel('');
  renderCheshbonLeft();
};

// History viewer — left panel
window.openReflectionHistory = function() {
  var data=getData(); var body=document.getElementById('reflHistoryBody'); if(!body)return;
  if(!data.reflHistory.length){
    body.innerHTML='<div style="padding:24px;color:#aaa;font-size:14px;text-align:center">No past reflections yet.</div>';
  } else {
    body.innerHTML=data.reflHistory.map(function(entry,idx){
      var preview=entry.gratitude.filter(function(g){return g.trim();}).slice(0,2).join(' · ');
      return '<div class="refl-hist-entry" onclick="toggleReflHistEntry(this,'+idx+')">'+
        '<div class="refl-hist-date">'+dayName(fromDateStr(entry.date))+', '+monthDay(fromDateStr(entry.date))+'</div>'+
        '<div class="refl-hist-preview">'+(preview?escHtml(preview):'—')+'</div>'+
        '<div class="refl-hist-expanded" style="display:none"></div>'+
        '</div>';
    }).join('');
  }
  openModal('reflHistoryModal');
};
window.toggleReflHistEntry = function(el,idx) {
  var exp=el.querySelector('.refl-hist-expanded'); if(!exp)return;
  if(exp.style.display!=='none'){exp.style.display='none';return;}
  var data=getData(); var entry=data.reflHistory[idx]; if(!entry)return;
  var gratItems=entry.gratitude.filter(function(g){return g.trim();}).map(function(g,i){return (i+1)+'. '+escHtml(g);}).join('<br>');
  var ayinItems=(entry.ayinTov||[]).filter(function(g){return g.trim();}).map(function(g,i){return (i+1)+'. '+escHtml(g);}).join('<br>');
  exp.innerHTML=
    (gratItems?'<div class="refl-hist-section"><div class="refl-hist-section-title">Gratitude</div><div class="refl-hist-items">'+gratItems+'</div></div>':'')+
    (ayinItems?'<div class="refl-hist-section"><div class="refl-hist-section-title">Ayin Tov</div><div class="refl-hist-items">'+ayinItems+'</div></div>':'')+
    (entry.learned?'<div class="refl-hist-section"><div class="refl-hist-section-title">What I Learned</div><div class="refl-hist-items">'+escHtml(entry.learned)+'</div></div>':'')+
    (entry.feeling?'<div class="refl-hist-section"><div class="refl-hist-section-title">How I Felt</div><div class="refl-hist-items">'+escHtml(entry.feeling)+'</div></div>':'');
  exp.style.display='';
};

// Cheshbon HaNefesh actions
window.toggleCheshbonCheck = function(itemId,day){
  var data=getData();
  if(!data.cheshbonChecks[itemId]) data.cheshbonChecks[itemId]={};
  data.cheshbonChecks[itemId][day]=!data.cheshbonChecks[itemId][day];
  saveChk(data.cheshbonChecks);
};
window.openEditCheshbonItem = function(id){
  var data=getData(); var item=data.cheshbonItems.find(function(i){return i.id===id;}); if(!item)return;
  state.editCheshbonItemId=id;
  document.getElementById('cheshbonItemModalTitle').textContent='Edit Item';
  document.getElementById('cheshbonItemText').value=item.text;
  openModal('cheshbonItemModal');
  setTimeout(function(){document.getElementById('cheshbonItemText').focus();},80);
};
window.removeCheshbonItem = function(id){
  if(!confirm('Remove this item?'))return;
  var data=getData();
  saveChi(data.cheshbonItems.filter(function(i){return i.id!==id;}));
  delete data.cheshbonChecks[id]; saveChk(data.cheshbonChecks);
  renderCheshbonRight();
};
window.newCheshbonWeek = function(){
  if(!confirm('Start a new week? Current checkboxes will be saved to history and cleared.'))return;
  var data=getData();
  if(data.cheshbonItems.length){
    var snap=data.cheshbonItems.map(function(item){return {text:item.text,checks:data.cheshbonChecks[item.id]||{}};});
    data.cheshbonWeekHistory.unshift({weekOf:fmtDateDisplay(toDateStr(new Date())),items:snap});
    saveChWH(data.cheshbonWeekHistory);
  }
  saveChk({}); renderCheshbonRight();
};
window.openCheshbonWeekHistory = function(){
  var data=getData(); var body=document.getElementById('cheshbonWeekHistBody'); if(!body)return;
  if(!data.cheshbonWeekHistory.length){
    body.innerHTML='<div style="padding:24px;color:#aaa;font-size:14px;text-align:center">No past weeks yet.</div>';
  } else {
    body.innerHTML=data.cheshbonWeekHistory.map(function(week){
      var rows=week.items.map(function(item){
        var days=CHESHBON_DAYS.map(function(d){
          return '<span class="week-hist-day'+(item.checks[d]?' checked':'')+'">'+CHESHBON_DAY_LABELS[d]+'</span>';
        }).join('');
        return '<div class="week-hist-row"><div class="week-hist-item">'+escHtml(item.text)+'</div>'+
          '<div class="week-hist-days">'+days+'</div></div>';
      }).join('');
      return '<div class="week-hist-entry"><div class="week-hist-date">Week of '+escHtml(week.weekOf)+'</div>'+rows+'</div>';
    }).join('');
  }
  openModal('cheshbonWeekHistModal');
};

// ============================================================
// RENDER — PHYSICAL HEALTH
// ============================================================
function renderHealth() {
  var ds = state.healthDate;
  var date = fromDateStr(ds);
  var label = document.getElementById('healthDateLabel');
  if (label) label.textContent = dayName(date) + ', ' + monthDay(date);
  var todayBtn = document.getElementById('healthBackTodayBtn');
  if (todayBtn) todayBtn.style.display = (ds === toDateStr(new Date())) ? 'none' : '';
  renderHealthWater(ds);
  renderDietPlan();
  renderActivityPlanner();
  renderWeightTracker();
}

function renderActivityPlanner() {
  var grid = document.getElementById('activityPlannerGrid'); if (!grid) return;
  var data = getData();
  var monday = getPlannerWeekMonday();
  var weekKey = toDateStr(monday);
  var endDate = new Date(monday); endDate.setDate(monday.getDate()+6);
  // Week label
  var wLabel = document.getElementById('plannerWeekLabel');
  if (wLabel) wLabel.textContent = shortMonthDay(monday) + ' – ' + shortMonthDay(endDate);
  // This week button
  var twBtn = document.getElementById('plannerThisWeekBtn');
  if (twBtn) twBtn.style.display = state.plannerWeekOffset === 0 ? 'none' : '';
  var today = toDateStr(new Date());
  grid.innerHTML = PLAN_DAYS.map(function(day, idx) {
    var colDate = new Date(monday); colDate.setDate(monday.getDate()+idx);
    var colDs = toDateStr(colDate); var isToday = colDs === today;
    var items = data.activityPlan[day] || [];
    var itemsHTML = items.map(function(item) {
      var doneKey = weekKey+'_'+item.id; var isDone = !!data.activityDone[doneKey];
      var meta = [item.time ? fmt12(item.time) : '', item.duration].filter(Boolean).join(' · ');
      return '<div class="planner-item'+(isDone?' is-done':'')+'">' +
        '<input type="checkbox" class="planner-item-check"'+(isDone?' checked':'')+
        ' onchange="togglePlanDone(\''+weekKey+'\',\''+item.id+'\')">' +
        '<div class="planner-item-body">' +
          '<div class="planner-item-type">'+escHtml(item.activityType)+'</div>' +
          (meta?'<div class="planner-item-meta">'+escHtml(meta)+'</div>':'')+
        '</div>' +
        '<div class="planner-item-actions">' +
          '<button class="btn-icon" style="font-size:11px" onclick="openEditPlanItem(\''+day+'\',\''+item.id+'\')">✏️</button>' +
          '<button class="btn-icon" style="font-size:11px" onclick="removePlanItem(\''+day+'\',\''+item.id+'\')">🗑</button>' +
        '</div></div>';
    }).join('');
    return '<div class="planner-day-col'+(isToday?' is-today':'')+'">' +
      '<div class="planner-day-header">'+PLAN_DAY_SHORT[day]+
        '<div class="planner-day-date">'+shortMonthDay(colDate)+'</div></div>' +
      '<div class="planner-day-body">'+(itemsHTML||'<div class="planner-day-empty">—</div>')+'</div>' +
      '<button class="planner-add-row" onclick="openAddPlanItem(\''+day+'\')">+ Add</button>' +
      '</div>';
  }).join('');
}

function renderHealthWater(ds) {
  var data = getData(); var level = data.healthWater[ds] || '';
  document.querySelectorAll('.water-btn').forEach(function(btn){
    btn.classList.toggle('active', btn.dataset.level === level);
  });
}

var DIET_DAYS = ['mon','tue','wed','thu','fri','sat','sun'];
var DIET_DAY_LABELS = {mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday'};

function renderDietPlan() {
  var data = getData(); var el = document.getElementById('dietPlanGrid'); if(!el)return;
  el.innerHTML = DIET_DAYS.map(function(day) {
    var plan = data.dietPlan[day] || '';
    return '<div class="diet-day-card">'+
      '<div class="diet-day-label">'+DIET_DAY_LABELS[day]+'</div>'+
      '<textarea class="diet-day-text" rows="4" placeholder="Plan your meals for '+DIET_DAY_LABELS[day]+'..." onblur="saveDietDay(\''+day+'\',this.value)">'+escHtml(plan)+'</textarea>'+
    '</div>';
  }).join('');
}

function renderHealthActivity(ds) {
  var data = getData(); var items = (data.healthActivity[ds] || []);
  var el = document.getElementById('healthActivityList'); if(!el)return;
  if (!items.length) { el.innerHTML='<div class="health-activity-empty">No activities logged yet.</div>'; return; }
  el.innerHTML = items.map(function(item){
    return '<div class="health-activity-item">'+
      '<div class="health-activity-body">'+
        '<span class="health-activity-type">'+escHtml(item.activityType)+'</span>'+
        (item.duration?'<span class="health-activity-duration">'+escHtml(item.duration)+'</span>':'')+
        (item.notes?'<div class="health-activity-notes">'+escHtml(item.notes)+'</div>':'')+
      '</div>'+
      '<div class="health-activity-actions">'+
        '<button class="btn-icon" onclick="openEditHealthActivity(\''+ds+'\',\''+item.id+'\')">✏️</button>'+
        '<button class="btn-icon" onclick="removeHealthActivity(\''+ds+'\',\''+item.id+'\')">🗑</button>'+
      '</div></div>';
  }).join('');
}

// Activity planner window callbacks
window.togglePlanDone = function(weekKey, itemId) {
  toggleActivityPlanDone(weekKey, itemId); renderActivityPlanner();
};
window.openAddPlanItem = function(day) {
  state.editActivityPlanDay=day; state.editActivityPlanId=null; state.selectedPlanActivityType='';
  document.getElementById('activityPlanModalTitle').textContent='Add — '+PLAN_DAY_FULL[day];
  document.getElementById('planActivitySave').textContent='Add';
  document.querySelectorAll('.plan-activity-type-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById('planActivityCustom').value='';
  document.getElementById('planActivityTime').value='';
  document.getElementById('planActivityDuration').value='';
  openModal('activityPlanModal');
};
window.openEditPlanItem = function(day, id) {
  var data=getData(); var item=(data.activityPlan[day]||[]).find(function(i){return i.id===id;}); if(!item)return;
  state.editActivityPlanDay=day; state.editActivityPlanId=id; state.selectedPlanActivityType=item.activityType;
  document.getElementById('activityPlanModalTitle').textContent='Edit Activity';
  document.getElementById('planActivitySave').textContent='Save';
  var isPreset=['Cardio','PT','Stretching','Basketball','Biking','Ab Workouts'].indexOf(item.activityType)!==-1;
  document.querySelectorAll('.plan-activity-type-btn').forEach(function(b){
    b.classList.toggle('active', b.dataset.type===item.activityType);
  });
  document.getElementById('planActivityCustom').value=isPreset?'':item.activityType;
  document.getElementById('planActivityTime').value=item.time||'';
  document.getElementById('planActivityDuration').value=item.duration||'';
  openModal('activityPlanModal');
};
window.removePlanItem = function(day, id) {
  if(!confirm('Remove this activity?'))return;
  deleteActivityPlanItem(day,id); renderActivityPlanner();
};

// Health window callbacks
window.saveDietDay = function(day, val) { updateDietPlanDay(day, val.trim()); };
window.openEditHealthActivity = function(ds, id) {
  var data=getData(); var item=(data.healthActivity[ds]||[]).find(function(i){return i.id===id;}); if(!item)return;
  state.editHealthActivityId=id;
  document.getElementById('healthActivityModalTitle').textContent='Edit Activity';
  // Set type buttons
  state.selectedActivityType=item.activityType;
  document.querySelectorAll('.activity-type-btn').forEach(function(btn){
    btn.classList.toggle('active', btn.dataset.type===item.activityType);
  });
  var isPreset=['Cardio','PT','Stretching','Basketball','Biking','Ab Workouts'].indexOf(item.activityType)!==-1;
  document.getElementById('healthActivityCustom').value=isPreset?'':item.activityType;
  document.getElementById('healthActivityDuration').value=item.duration||'';
  document.getElementById('healthActivityNotes').value=item.notes||'';
  openModal('healthActivityModal');
};
window.removeHealthActivity = function(ds, id){
  if(!confirm('Delete this activity?'))return;
  deleteHealthActivity(ds,id); renderHealthActivity(ds);
};

// ============================================================
// RENDER — REMINDERS
// ============================================================
function renderReminders() {
  var data=getData(); var el=document.getElementById('remindersList'); if(!el)return;
  if (!data.reminders.length){ el.innerHTML='<div class="stl-empty">No reminders yet. Add life principles and behavioral reminders here.</div>'; return; }
  el.innerHTML=data.reminders.map(function(r){
    return '<div class="reminder-item">' +
      '<div class="reminder-item-body">' +
        '<div class="reminder-item-text">'+escHtml(r.text)+'</div>'+
        (r.category?'<div class="reminder-item-category">'+escHtml(r.category)+'</div>':'')+
      '</div>' +
      '<div class="reminder-actions">'+
        '<button class="btn-icon" onclick="openEditReminder(\''+r.id+'\')">✏️</button>'+
        '<button class="btn-icon" onclick="deleteRem(\''+r.id+'\')">🗑</button>'+
      '</div></div>';
  }).join('');
}

// ============================================================
// RENDER — LEARNING SEDER
// ============================================================
function getLearningSection(item) {
  if(item.time) {
    var h=parseInt(item.time.split(':')[0],10);
    if(h>=5&&h<12) return 'morning';
    if(h>=12&&h<18) return 'afternoon';
    return 'night';
  }
  if(item.seder) return item.seder;
  return 'unscheduled';
}
var LEARNING_SECTIONS=[
  {key:'morning',   label:'Morning',   hours:'5am–12pm'},
  {key:'afternoon', label:'Afternoon', hours:'12pm–6pm'},
  {key:'night',     label:'Night',     hours:'6pm+'},
  {key:'unscheduled',label:'Unscheduled',hours:'No time set'},
];

// ---- Learning drag system ----
var _dragLrnInfo=null;
window.lrnDragStart=function(e,day,id,sec){
  _dragLrnInfo={day:day,id:id,sec:sec};
  e.dataTransfer.effectAllowed='move';
  setTimeout(function(){
    document.querySelectorAll('[data-lrn-id="'+id+'"]').forEach(function(el){el.classList.add('lrn-dragging');});
  },0);
};
window.lrnDragOver=function(e){
  e.preventDefault(); e.dataTransfer.dropEffect='move';
  var target=e.currentTarget;
  if(!target||(_dragLrnInfo&&target.dataset.lrnId===_dragLrnInfo.id))return;
  document.querySelectorAll('.lrn-drag-above,.lrn-drag-below').forEach(function(el){el.classList.remove('lrn-drag-above','lrn-drag-below');});
  var rect=target.getBoundingClientRect();
  target.classList.add(e.clientY<rect.top+rect.height/2?'lrn-drag-above':'lrn-drag-below');
};
window.lrnDragLeave=function(e){
  var t=e.currentTarget; if(t)t.classList.remove('lrn-drag-above','lrn-drag-below');
};
window.lrnDrop=function(e,day,toId,sec){
  e.preventDefault();
  var target=e.currentTarget;
  var insertBefore=target&&target.classList.contains('lrn-drag-above');
  if(target)target.classList.remove('lrn-drag-above','lrn-drag-below');
  if(!_dragLrnInfo||_dragLrnInfo.id===toId||_dragLrnInfo.day!==day||_dragLrnInfo.sec!==sec)return;
  var fromId=_dragLrnInfo.id;
  var data=getData(); var items=data.learning[day]||[];
  var fromIdx=items.findIndex(function(i){return i.id===fromId;});
  var toIdx=items.findIndex(function(i){return i.id===toId;});
  if(fromIdx===-1||toIdx===-1)return;
  var dragged=items.splice(fromIdx,1)[0];
  var newTo=items.findIndex(function(i){return i.id===toId;});
  items.splice(insertBefore?newTo:newTo+1,0,dragged);
  data.learning[day]=items; saveLrn(data.learning);
  renderLearning();
  if(document.getElementById('learningDayModal').classList.contains('open')) renderLearningDayModal(day);
};
window.lrnDragEnd=function(e){
  _dragLrnInfo=null;
  document.querySelectorAll('.lrn-dragging,.lrn-drag-above,.lrn-drag-below').forEach(function(el){el.classList.remove('lrn-dragging','lrn-drag-above','lrn-drag-below');});
};

function lrnDragAttrs(day,id,sec){
  return ' draggable="true" data-lrn-id="'+id+'"'
    +' ondragstart="lrnDragStart(event,\''+day+'\',\''+id+'\',\''+sec+'\')"'
    +' ondragover="lrnDragOver(event)"'
    +' ondragleave="lrnDragLeave(event)"'
    +' ondrop="lrnDrop(event,\''+day+'\',\''+id+'\',\''+sec+'\')"'
    +' ondragend="lrnDragEnd(event)"';
}

var LRN_DAY_DOW={mon:1,tue:2,wed:3,thu:4,fri:5,sat:6,sun:0};

function renderLearning() {
  var data=getData(); var grid=document.getElementById('learningGrid'); if(!grid)return;
  var todayDow=new Date().getDay();
  grid.innerHTML=LEARNING_DAYS.map(function(day){
    var isToday=LRN_DAY_DOW[day]===todayDow;
    var items=data.learning[day]||[];
    var sections={morning:[],afternoon:[],night:[],unscheduled:[]};
    items.forEach(function(item){sections[getLearningSection(item)].push(item);});
    var mainSecs=[{key:'morning',label:'Morning Seder'},{key:'afternoon',label:'Afternoon Seder'},{key:'night',label:'Night Seder'}];
    var bodyHTML='';
    mainSecs.forEach(function(sec){
      var sItems=sections[sec.key];
      if(!sItems.length)return;
      bodyHTML+='<div class="learning-section-header">'+sec.label+'</div>';
      bodyHTML+=sItems.map(function(item){
        var timeBadge=item.time?'<span class="learning-time-badge">'+fmt12(item.time)+'</span>':'';
        return '<div class="learning-item lrn-compact lrn-draggable"'+lrnDragAttrs(day,item.id,sec.key)+'>'+
          '<div class="learning-item-body">'+
            '<div class="learning-item-subject">'+escHtml(item.subject)+timeBadge+'</div>'+
            (item.source?'<div class="learning-item-source">'+escHtml(item.source)+'</div>':'')+
          '</div></div>';
      }).join('');
    });
    if(sections.unscheduled.length){
      bodyHTML+='<div class="learning-section-header">Unscheduled</div>';
      bodyHTML+=sections.unscheduled.map(function(item){
        return '<div class="learning-item lrn-compact lrn-draggable"'+lrnDragAttrs(day,item.id,'unscheduled')+'>'+
          '<div class="learning-item-body">'+
            '<div class="learning-item-subject">'+escHtml(item.subject)+'</div>'+
            (item.source?'<div class="learning-item-source">'+escHtml(item.source)+'</div>':'')+
          '</div></div>';
      }).join('');
    }
    if(!bodyHTML)bodyHTML='<div class="learning-section-empty" style="padding:14px;color:#ccc">Tap to add items</div>';
    var cnt=items.length?'<span class="lrn-col-count">'+items.length+'</span>':'';
    var todayBadge=isToday?'<span class="lrn-today-badge">Today</span>':'';
    return '<div class="learning-day-col lrn-clickable'+(isToday?' lrn-today-col':'')+'" onclick="openLearningDayModal(\''+day+'\')">'+
      '<div class="learning-day-header">'+LEARNING_DAY_LABELS[day]+todayBadge+cnt+'</div>'+
      '<div class="learning-day-body">'+bodyHTML+'</div>'+
      '<button class="learning-add-row" onclick="event.stopPropagation();openAddLearningItem(\''+day+'\')">+ Add</button>'+
      '</div>';
  }).join('');
}

window.openLearningDayModal=function(day){
  state.learningDay=day;
  document.getElementById('learningDayModalTitle').textContent=LEARNING_DAY_LABELS[day];
  renderLearningDayModal(day);
  openModal('learningDayModal');
};

function renderLearningDayModal(day){
  var data=getData(); var items=data.learning[day]||[];
  var sections={morning:[],afternoon:[],night:[],unscheduled:[]};
  items.forEach(function(item){sections[getLearningSection(item)].push(item);});
  // No auto-sort — array order within each section is fully user-controlled via drag
  var mainSecs=[{key:'morning',label:'Morning Seder'},{key:'afternoon',label:'Afternoon Seder'},{key:'night',label:'Night Seder'}];
  var html='';
  mainSecs.forEach(function(sec){
    var sItems=sections[sec.key];
    html+='<div class="lrn-modal-section">';
    html+='<div class="lrn-modal-sec-hdr">'+sec.label+
      '<button class="lrn-sec-add" onclick="event.stopPropagation();openAddLearningItemInSeder(\''+day+'\',\''+sec.key+'\')">+ Add</button></div>';
    if(!sItems.length){
      html+='<div class="learning-section-empty" style="padding:8px 16px 12px">—</div>';
    }else{
      html+=sItems.map(function(item){
        var timeBadge=item.time?'<span class="learning-time-badge">'+fmt12(item.time)+'</span>':'';
        var hasNote=!!item.notes;
        return '<div class="lrn-modal-item" id="lrni-'+item.id+'"'+lrnDragAttrs(day,item.id,sec.key)+'>'+
          '<div class="lrn-modal-item-main">'+
            '<span class="lrn-drag-handle">⠿</span>'+
            '<div class="lrn-modal-item-title">'+escHtml(item.subject)+timeBadge+'</div>'+
            '<div class="lrn-modal-item-actions">'+
              (hasNote?'<button class="btn-icon" onclick="toggleLrnNote(\''+item.id+'\')" title="Notes">📝</button>':'')+
              '<button class="btn-icon" onclick="openEditLearningItem(\''+day+'\',\''+item.id+'\')" title="Edit">✏️</button>'+
              '<button class="btn-icon" onclick="deleteLrnModal(\''+day+'\',\''+item.id+'\')" title="Delete">🗑</button>'+
              '<button class="btn-icon" onclick="openLearningCopy(\''+day+'\',\''+item.id+'\')" title="Duplicate to other days">⧉</button>'+
            '</div>'+
          '</div>'+
          (item.source?'<div class="learning-item-source" style="margin-top:3px">'+escHtml(item.source)+'</div>':'')+
          (hasNote?'<div class="lrn-note-body" id="lrn-note-'+item.id+'" style="display:none">'+escHtml(item.notes)+'</div>':'')+
        '</div>';
      }).join('');
    }
    html+='</div>';
  });
  if(sections.unscheduled.length){
    html+='<div class="lrn-modal-section">';
    html+='<div class="lrn-modal-sec-hdr">Unscheduled</div>';
    html+=sections.unscheduled.map(function(item){
      var hasNote=!!item.notes;
      return '<div class="lrn-modal-item" id="lrni-'+item.id+'"'+lrnDragAttrs(day,item.id,'unscheduled')+'>'+
        '<div class="lrn-modal-item-main">'+
          '<span class="lrn-drag-handle">⠿</span>'+
          '<div class="lrn-modal-item-title">'+escHtml(item.subject)+'</div>'+
          '<div class="lrn-modal-item-actions">'+
            (hasNote?'<button class="btn-icon" onclick="toggleLrnNote(\''+item.id+'\')" title="Notes">📝</button>':'')+
            '<button class="btn-icon" onclick="openEditLearningItem(\''+day+'\',\''+item.id+'\')" title="Edit">✏️</button>'+
            '<button class="btn-icon" onclick="deleteLrnModal(\''+day+'\',\''+item.id+'\')" title="Delete">🗑</button>'+
            '<button class="btn-icon" onclick="openLearningCopy(\''+day+'\',\''+item.id+'\')" title="Duplicate to other days">⧉</button>'+
          '</div>'+
        '</div>'+
        (item.source?'<div class="learning-item-source" style="margin-top:3px">'+escHtml(item.source)+'</div>':'')+
        (hasNote?'<div class="lrn-note-body" id="lrn-note-'+item.id+'" style="display:none">'+escHtml(item.notes)+'</div>':'')+
      '</div>';
    }).join('');
    html+='</div>';
  }
  document.getElementById('learningDayModalBody').innerHTML=html;
}

// ============================================================
// RENDER — FINANCIAL
// ============================================================
var FREQ_LABEL={weekly:'Weekly',biweekly:'Biweekly',monthly:'Monthly'};

function renderFinancial() {
  var tab=state.activeFinTab;
  if(tab==='monthly')  renderFinMonthly();
  if(tab==='income')   renderFinIncome();
  if(tab==='wishlist') renderFinWishlist();
  // money making always fresh when panel visible
  var mmEl=document.getElementById('moneyMakingList');
  if(mmEl) {
    var data=getData();
    var statusLabel={idea:'💡 Idea',exploring:'🔍 Exploring',inprogress:'⚡ In Progress',earning:'💰 Earning',paused:'⏸ Paused'};
    mmEl.innerHTML=!data.moneymaking.length?'<div class="fin-empty">No ideas yet.</div>':
      data.moneymaking.map(function(item){
        return '<div class="mm-row">'+
          '<div class="mm-row-body"><div class="mm-idea">'+escHtml(item.idea)+'</div>'+(item.notes?'<div class="mm-notes">'+escHtml(item.notes)+'</div>':'')+'</div>'+
          '<span class="mm-status '+item.status+'">'+(statusLabel[item.status]||item.status)+'</span>'+
          '<div class="mm-row-actions"><button class="btn-icon" onclick="openEditMoneyIdea(\''+item.id+'\')">✏️</button><button class="btn-icon" onclick="delMM(\''+item.id+'\')">🗑</button></div></div>';
      }).join('');
  }
}

function renderFinWeekly() {
  var data=getData(); var wi=state.finWeekIdx; var weeks=getFinWeeks();
  var stEl=document.getElementById('finWeekSubtabs');
  if(stEl) stEl.innerHTML=weeks.map(function(w){
    return '<button class="fin-week-tab'+(w.idx===wi?' active':'')+'" onclick="setFinWeek('+w.idx+')">'+escHtml(w.label)+'</button>';
  }).join('');
  var incItems=data.finIncome.filter(function(i){return itemInWeek(i,wi);});
  var expItems=data.finExpenses.filter(function(i){return itemInWeek(i,wi);});
  var incLo=incItems.reduce(function(s,i){return s+(parseFloat(i.amountLow)||0);},0);
  var incHi=incItems.reduce(function(s,i){return s+(parseFloat(i.amountHigh)||parseFloat(i.amountLow)||0);},0);
  var expLo=expItems.reduce(function(s,i){return s+(parseFloat(i.amountLow)||0);},0);
  var expHi=expItems.reduce(function(s,i){return s+(parseFloat(i.amountHigh)||parseFloat(i.amountLow)||0);},0);
  var surpLo=incLo-expHi; var surpHi=incHi-expLo;
  function tblRow(item,type) {
    var lo=parseFloat(item.amountLow)||0; var hi=parseFloat(item.amountHigh)||lo;
    var editFn=type==='inc'?'openEditFinInc':'openEditFinExp';
    var delFn=type==='inc'?'delFinInc':'delFinExp';
    return '<div class="fin-tbl-row">'+
      '<span class="fin-tbl-name">'+escHtml(item.name)+(item.notes?'<span class="fin-note-dot" title="'+escHtml(item.notes)+'"> ·</span>':'')+'</span>'+
      tagBadge(item.tag||(type==='inc'?'Income':'Need'))+
      '<span class="fin-tbl-freq">'+escHtml(FREQ_LABEL[item.frequency]||'')+'</span>'+
      '<span class="fin-tbl-amt '+(type==='inc'?'inc':'exp')+'">$'+fmtDollar(lo)+'</span>'+
      '<span class="fin-tbl-amt '+(type==='inc'?'inc':'exp')+'">$'+fmtDollar(hi)+'</span>'+
      '<span class="fin-tbl-act">'+
        '<button class="btn-icon-sm" onclick="'+editFn+'(\''+item.id+'\')">✏️</button>'+
        '<button class="btn-icon-sm" onclick="'+delFn+'(\''+item.id+'\')">🗑</button>'+
      '</span></div>';
  }
  var incHdr='<div class="fin-tbl-hdr"><span>Item</span><span>Tag</span><span>Freq</span><span>Low</span><span>High</span><span></span></div>';
  var callout='';
  if(surpLo<0) callout='<div class="fin-callout fin-callout-alert">⚠️ Possible deficit of $'+Math.abs(Math.round(surpLo))+' at max spend</div>';
  else if(surpHi<50) callout='<div class="fin-callout fin-callout-warn">Tight week — max surplus under $50</div>';
  else callout='<div class="fin-callout fin-callout-ok">✓ Surplus range: $'+Math.max(0,Math.round(surpLo))+' – $'+Math.max(0,Math.round(surpHi))+'</div>';
  var expPct=incHi?Math.min(100,Math.round(expHi/incHi*100)):100;
  var cEl=document.getElementById('finWeekContent');
  if(!cEl)return;
  cEl.innerHTML=
    '<div class="fin-section">'+
      '<div class="fin-section-header"><h3>Income</h3><button class="btn-primary" style="font-size:13px;padding:6px 13px" onclick="openAddFinInc()">+ Add</button></div>'+
      '<div class="fin-tbl-wrap">'+incHdr+(incItems.length?incItems.map(function(i){return tblRow(i,'inc');}).join(''):'<div class="fin-empty">No income this week.</div>')+
      (incItems.length?'<div class="fin-total-row"><span class="fin-total-lbl">Total Income</span><span></span><span></span><span class="fin-tbl-amt inc">$'+fmtDollar(incLo)+'</span><span class="fin-tbl-amt inc">$'+fmtDollar(incHi)+'</span><span></span></div>':'')+'</div>'+
    '</div>'+
    '<div class="fin-section">'+
      '<div class="fin-section-header"><h3>Expenses</h3><button class="btn-primary" style="font-size:13px;padding:6px 13px" onclick="openAddFinExp()">+ Add</button></div>'+
      '<div class="fin-tbl-wrap">'+incHdr+(expItems.length?expItems.map(function(i){return tblRow(i,'exp');}).join(''):'<div class="fin-empty">No expenses this week.</div>')+
      (expItems.length?'<div class="fin-total-row"><span class="fin-total-lbl">Total Expenses</span><span></span><span></span><span class="fin-tbl-amt exp">$'+fmtDollar(expLo)+'</span><span class="fin-tbl-amt exp">$'+fmtDollar(expHi)+'</span><span></span></div>':'')+'</div>'+
    '</div>'+
    '<div class="fin-surplus-block">'+
      '<div class="fin-surplus-bar-outer"><div class="fin-surplus-bar-fill" style="width:'+expPct+'%"></div></div>'+
      callout+
    '</div>';
}

function renderFinMonthly() {
  var data=getData();
  function mTot(items,field) {
    return items.reduce(function(s,i){
      var val=parseFloat(i[field])||parseFloat(i.amountLow)||0;
      var m=i.frequency==='weekly'?4:i.frequency==='biweekly'?2:1;
      return s+val*m;
    },0);
  }
  var incLo=mTot(data.finIncome,'amountLow'); var incHi=mTot(data.finIncome,'amountHigh');
  var expLo=mTot(data.finExpenses,'amountLow'); var expHi=mTot(data.finExpenses,'amountHigh');
  var fixedExp=data.finExpenses.filter(function(e){return (parseFloat(e.amountLow)||0)===(parseFloat(e.amountHigh)||0);});
  var flexExp=data.finExpenses.filter(function(e){return (parseFloat(e.amountHigh)||0)>(parseFloat(e.amountLow)||0);});
  var fixHi=mTot(fixedExp,'amountHigh'); var flexHi=mTot(flexExp,'amountHigh');
  var freeLo=Math.max(0,incLo-expHi); var freeHi=Math.max(0,incHi-expLo);
  var tot=incHi||1; var fixPct=Math.round(fixHi/tot*100); var flxPct=Math.round(flexHi/tot*100); var frePct=Math.max(0,100-fixPct-flxPct);
  function mRow(item,type) {
    var lo=parseFloat(item.amountLow)||0; var hi=parseFloat(item.amountHigh)||lo;
    var m=item.frequency==='weekly'?4:item.frequency==='biweekly'?2:1;
    var editFn=type==='inc'?'openEditFinInc':'openEditFinExp'; var delFn=type==='inc'?'delFinInc':'delFinExp';
    return '<div class="fin-mrow">'+
      '<span class="fin-tbl-name">'+escHtml(item.name)+'</span>'+
      (type==='exp'?tagBadge(item.tag):'<span></span>')+
      '<span class="fin-tbl-freq">'+escHtml(FREQ_LABEL[item.frequency]||'')+'</span>'+
      '<span class="fin-tbl-amt '+(type==='inc'?'inc':'exp')+'">'+fmtAmt(lo*m,hi*m)+'</span>'+
      '<span class="fin-tbl-act">'+
        '<button class="btn-icon-sm" onclick="'+editFn+'(\''+item.id+'\')">✏️</button>'+
        '<button class="btn-icon-sm" onclick="'+delFn+'(\''+item.id+'\')">🗑</button>'+
      '</span></div>';
  }
  var el=document.getElementById('finMonthlyContent'); if(!el)return;
  var netFixLo=incLo-fixHi; var netFixHi=incHi-fixHi;
  var flexLo2=mTot(flexExp,'amountLow');
  var netAllLo=incLo-fixHi-flexHi; var netAllHi=incHi-fixHi-flexLo2;
  function netAmt(lo,hi){
    var lo2=Math.round(lo); var hi2=Math.round(hi);
    if(lo2===hi2)return(lo2>=0?'<span class="fin-net-pos">$'+fmtDollar(lo2)+'</span>':'<span class="fin-net-neg">−$'+fmtDollar(Math.abs(lo2))+'</span>');
    var loStr=lo2>=0?'$'+fmtDollar(lo2):'−$'+fmtDollar(Math.abs(lo2));
    var hiStr=hi2>=0?'$'+fmtDollar(hi2):'−$'+fmtDollar(Math.abs(hi2));
    var cls=hi2>=0?'fin-net-pos':'fin-net-neg';
    return '<span class="'+cls+'">'+loStr+' – '+hiStr+'</span>';
  }
  el.innerHTML=
    '<div class="fin-metric-grid">'+
      '<div class="fin-metric-card"><div class="fin-metric-lbl">Monthly Income</div><div class="fin-metric-val inc">'+fmtAmt(incLo,incHi)+'</div></div>'+
      '<div class="fin-metric-card"><div class="fin-metric-lbl">Fixed Expenses</div><div class="fin-metric-val exp">$'+fmtDollar(fixHi)+'</div></div>'+
      '<div class="fin-metric-card"><div class="fin-metric-lbl">Flexible Range</div><div class="fin-metric-val amb">'+fmtAmt(mTot(flexExp,'amountLow'),flexHi)+'</div></div>'+
      '<div class="fin-metric-card"><div class="fin-metric-lbl">Free Cash</div><div class="fin-metric-val inc">'+fmtAmt(freeLo,freeHi)+'</div></div>'+
    '</div>'+
    '<div class="fin-pill-wrap">'+
      '<div class="fin-pill-lbl">Income split</div>'+
      '<div class="fin-pill-bar">'+
        '<div class="fin-pill-seg pill-fixed" style="width:'+fixPct+'%" title="Fixed">'+fixPct+'%</div>'+
        '<div class="fin-pill-seg pill-flex"  style="width:'+flxPct+'%" title="Flexible">'+flxPct+'%</div>'+
        '<div class="fin-pill-seg pill-free"  style="width:'+frePct+'%" title="Free">'+frePct+'%</div>'+
      '</div>'+
      '<div class="fin-pill-legend">'+
        '<span class="fin-legend-dot" style="background:#ef4444"></span> Fixed ($'+fmtDollar(fixHi)+')  '+
        '<span class="fin-legend-dot" style="background:#f59e0b"></span> Flexible  '+
        '<span class="fin-legend-dot" style="background:#10b981"></span> Free cash'+
      '</div>'+
    '</div>'+
    '<div class="fin-net-summary">'+
      '<div class="fin-net-row">'+
        '<div class="fin-net-label">'+
          '<span class="fin-net-title">Net after fixed</span>'+
          '<span class="fin-net-sub">Income minus fixed commitments</span>'+
        '</div>'+
        '<div class="fin-net-value">'+netAmt(netFixLo,netFixHi)+'</div>'+
      '</div>'+
      '<div class="fin-net-divider"></div>'+
      '<div class="fin-net-row">'+
        '<div class="fin-net-label">'+
          '<span class="fin-net-title">Net after fixed + flexible</span>'+
          '<span class="fin-net-sub">Income minus all committed expenses</span>'+
        '</div>'+
        '<div class="fin-net-value">'+netAmt(netAllLo,netAllHi)+'</div>'+
      '</div>'+
    '</div>'+
    '<div class="fin-monthly-cards">'+
      '<div class="fin-section"><div class="fin-section-header"><h3>Income Breakdown</h3></div>'+
        '<div class="fin-tbl-wrap">'+(data.finIncome.length?data.finIncome.map(function(i){return mRow(i,'inc');}).join('')+'<div class="fin-mrow fin-total-mrow"><span class="fin-total-lbl">Total Income</span><span></span><span></span><span class="fin-tbl-amt inc">'+fmtAmt(incLo,incHi)+'</span><span></span></div>':'<div class="fin-empty">No income streams.</div>')+'</div></div>'+
      '<div class="fin-section"><div class="fin-section-header"><h3>Fixed Commitments</h3></div>'+
        '<div class="fin-tbl-wrap">'+(fixedExp.length?fixedExp.map(function(i){return mRow(i,'exp');}).join('')+'<div class="fin-mrow fin-total-mrow"><span class="fin-total-lbl">Total Fixed</span><span></span><span></span><span class="fin-tbl-amt exp">$'+fmtDollar(fixHi)+'</span><span></span></div>':'<div class="fin-empty">None.</div>')+'</div></div>'+
      '<div class="fin-section"><div class="fin-section-header"><h3>Flexible Expenses</h3></div>'+
        '<div class="fin-tbl-wrap">'+(flexExp.length?flexExp.map(function(i){return mRow(i,'exp');}).join('')+'<div class="fin-mrow fin-total-mrow"><span class="fin-total-lbl">Total Flexible</span><span></span><span></span><span class="fin-tbl-amt exp">'+fmtAmt(mTot(flexExp,'amountLow'),flexHi)+'</span><span></span></div>':'<div class="fin-empty">None.</div>')+'</div></div>'+
    '</div>';
}

function renderFinIncome() {
  var data=getData(); var el=document.getElementById('finIncomeContent'); if(!el)return;
  function iRow(item) {
    var lo=parseFloat(item.amountLow)||0; var hi=parseFloat(item.amountHigh)||lo;
    return '<div class="fin-tbl-row">'+
      '<span class="fin-tbl-name">'+escHtml(item.name)+(item.notes?'<span class="fin-note-dot" title="'+escHtml(item.notes)+'"> ·</span>':'')+'</span>'+
      '<span class="fin-tbl-freq">'+escHtml(FREQ_LABEL[item.frequency]||'')+'</span>'+
      '<span class="fin-tbl-amt inc">'+fmtAmt(lo,hi)+'</span>'+
      '<span class="fin-tbl-act"><button class="btn-icon-sm" onclick="openEditFinInc(\''+item.id+'\')">✏️</button><button class="btn-icon-sm" onclick="delFinInc(\''+item.id+'\')">🗑</button></span></div>';
  }
  function bRow(item,isHistory) {
    var lo=parseFloat(item.amountLow)||0; var hi=parseFloat(item.amountHigh)||lo;
    var sc=item.status==='Received'?'bon-got':item.status==='Better deal possible'?'bon-better':'bon-pending';
    var historyTag=isHistory?'<span class="bon-history-tag">archived</span>':'';
    return '<div class="fin-tbl-row'+(isHistory?' bon-history-row':'')+'">'+
      '<span class="fin-tbl-name">'+escHtml(item.name)+historyTag+(item.notes?'<span class="fin-note-dot" title="'+escHtml(item.notes)+'"> ·</span>':'')+'</span>'+
      '<span class="fin-bon-status '+sc+'">'+escHtml(item.status)+'</span>'+
      '<span class="fin-tbl-amt inc">'+fmtAmt(lo,hi)+'</span>'+
      '<span class="fin-tbl-act"><button class="btn-icon-sm" onclick="openEditFinBon(\''+item.id+'\')">✏️</button><button class="btn-icon-sm" onclick="delFinBon(\''+item.id+'\')">🗑</button></span></div>';
  }
  // Split bonuses: Received = history, everything else = active
  var activeBonuses=[]; var historyBonuses=[];
  data.finBonuses.forEach(function(b){
    if(b.status==='Received'){historyBonuses.push(b);}
    else{activeBonuses.push(b);}
  });
  var hv=state.finBonHistoryVisible;
  var historySection=historyBonuses.length?
    '<div class="fin-bon-history-toggle-wrap">'+
      '<button class="fin-bon-history-btn" onclick="toggleBonHistory()">'+
        (hv?'▾ Hide History':'▸ View History')+' ('+historyBonuses.length+')'+
      '</button>'+
    '</div>'+
    (hv?'<div class="fin-tbl-wrap fin-has-hdr fin-bon-history-block"><div class="fin-tbl-hdr"><span>Source</span><span>Status</span><span>Amount</span><span></span></div>'+
      historyBonuses.map(function(b){return bRow(b,true);}).join('')+'</div>':'')
    :'';
  el.innerHTML=
    '<div class="fin-section"><div class="fin-section-header"><h3>Income Streams</h3><button class="btn-primary" style="font-size:13px;padding:6px 13px" onclick="openAddFinInc()">+ Add</button></div>'+
      '<div class="fin-tbl-wrap fin-has-hdr"><div class="fin-tbl-hdr"><span>Source</span><span>Frequency</span><span>Amount</span><span></span></div>'+
      (data.finIncome.length?data.finIncome.map(iRow).join('')+
        '<div class="fin-total-row fin-has-hdr-total"><span class="fin-total-lbl">Total</span><span></span><span class="fin-tbl-amt inc">'+fmtAmt(data.finIncome.reduce(function(s,i){return s+(parseFloat(i.amountLow)||0);},0),data.finIncome.reduce(function(s,i){return s+(parseFloat(i.amountHigh)||parseFloat(i.amountLow)||0);},0))+'</span><span></span></div>'
      :'<div class="fin-empty">No income streams yet.</div>')+'</div></div>'+
    '<div class="fin-section"><div class="fin-section-header"><h3>Bonuses &amp; Irregular Income</h3><button class="btn-primary" style="font-size:13px;padding:6px 13px" onclick="openAddFinBon()">+ Add</button></div>'+
      '<div class="fin-tbl-wrap fin-has-hdr"><div class="fin-tbl-hdr"><span>Source</span><span>Status</span><span>Amount</span><span></span></div>'+
      (activeBonuses.length?activeBonuses.map(function(b){return bRow(b,false);}).join('')+
        '<div class="fin-total-row fin-has-hdr-total"><span class="fin-total-lbl">Total Active</span><span></span><span class="fin-tbl-amt inc">'+fmtAmt(activeBonuses.reduce(function(s,i){return s+(parseFloat(i.amountLow)||0);},0),activeBonuses.reduce(function(s,i){return s+(parseFloat(i.amountHigh)||parseFloat(i.amountLow)||0);},0))+'</span><span></span></div>'
      :'<div class="fin-empty">No active bonuses.</div>')+'</div>'+
      historySection+
    '</div>';
}
window.toggleBonHistory=function(){state.finBonHistoryVisible=!state.finBonHistoryVisible;renderFinancial();};

function renderFinWishlist() {
  var data=getData(); var el=document.getElementById('finWishlistContent'); if(!el)return;
  var incLo=data.finIncome.reduce(function(s,i){var m=i.frequency==='weekly'?4:i.frequency==='biweekly'?2:1;return s+(parseFloat(i.amountLow)||0)*m;},0);
  var expHi=data.finExpenses.reduce(function(s,i){var m=i.frequency==='weekly'?4:i.frequency==='biweekly'?2:1;return s+(parseFloat(i.amountHigh)||parseFloat(i.amountLow)||0)*m;},0);
  var freeMo=Math.max(0,incLo-expHi);
  var TIERS=[{key:'really-want',lbl:'Really Want',cls:'tier-purple'},{key:'want',lbl:'Want',cls:'tier-amber'},{key:'can-wait',lbl:'Can Wait',cls:'tier-gray'}];
  el.innerHTML=TIERS.map(function(tier){
    var items=data.finWishlist.filter(function(w){return w.tier===tier.key;}).sort(function(a,b){return (a.order||0)-(b.order||0);});
    var tot=items.reduce(function(s,w){return s+(parseFloat(w.cost)||0);},0);
    var rows=items.length?items.map(function(w,i){
      var cost=parseFloat(w.cost)||0;
      var etaStr=w.eta||(cost>0&&freeMo>0?'~'+Math.ceil(cost/freeMo)+' mo':'—');
      return '<div class="fin-wish-row">'+
        '<span class="fin-tbl-num">'+(i+1)+'</span>'+
        '<span class="fin-tbl-name">'+escHtml(w.name)+
          (w.notes?'<span class="fin-note-dot" title="'+escHtml(w.notes)+'"> ·</span>':'')+'</span>'+
        '<span class="fin-tbl-amt">$'+fmtDollar(cost)+'</span>'+
        '<span class="fin-tbl-eta">'+escHtml(etaStr)+'</span>'+
        '<span class="fin-tbl-act">'+
          '<button class="btn-icon-sm" onclick="wishMoveUp(\''+w.id+'\')" title="Move up">↑</button>'+
          '<button class="btn-icon-sm" onclick="wishMoveDown(\''+w.id+'\')" title="Move down">↓</button>'+
          '<button class="btn-icon-sm" onclick="openEditFinWish(\''+w.id+'\')">✏️</button>'+
          '<button class="btn-icon-sm" onclick="delFinWish(\''+w.id+'\')">🗑</button>'+
        '</span></div>';
    }).join(''):'<div class="fin-empty">Nothing here yet.</div>';
    return '<div class="fin-tier-section '+tier.cls+'">'+
      '<div class="fin-tier-header">'+
        '<h3>'+escHtml(tier.lbl)+'</h3>'+
        '<span class="fin-tier-total">$'+fmtDollar(tot)+'</span>'+
        '<button class="btn-primary" style="font-size:12px;padding:5px 10px" onclick="openAddFinWish(\''+tier.key+'\')">+ Add</button>'+
      '</div>'+
      (items.length?'<div class="fin-wish-hdr"><span>#</span><span>Item</span><span>Cost</span><span>ETA</span><span>Actions</span></div>':'')+
      rows+'</div>';
  }).join('')+
  (freeMo>0?'<div class="fin-info-box">Free cash/month (conservative): <strong>$'+fmtDollar(freeMo)+'</strong> — used for ETA calculations</div>':'')+
  (function(){
    var grandTotal=data.finWishlist.reduce(function(s,w){return s+(parseFloat(w.cost)||0);},0);
    var incTotal=data.finWishlist.filter(function(w){return w.tier==='really-want';}).reduce(function(s,w){return s+(parseFloat(w.cost)||0);},0);
    var wantTotal=data.finWishlist.filter(function(w){return w.tier==='want';}).reduce(function(s,w){return s+(parseFloat(w.cost)||0);},0);
    var cwTotal=data.finWishlist.filter(function(w){return w.tier==='can-wait';}).reduce(function(s,w){return s+(parseFloat(w.cost)||0);},0);
    return grandTotal>0?
      '<div class="fin-wish-grand-total">'+
        '<span>Really Want: <strong>$'+fmtDollar(incTotal)+'</strong></span>'+
        '<span>Want: <strong>$'+fmtDollar(wantTotal)+'</strong></span>'+
        '<span>Can Wait: <strong>$'+fmtDollar(cwTotal)+'</strong></span>'+
        '<span class="fin-wish-gt-lbl">Grand Total: <strong>$'+fmtDollar(grandTotal)+'</strong></span>'+
      '</div>':'';
  })();
}

// ============================================================
// RENDER — CALENDAR
// ============================================================
// ============================================================
// HOLIDAYS — US & Jewish
// ============================================================
function getNthWeekday(year,month,weekday,n){
  var d=new Date(year,month,1);
  var diff=(weekday-d.getDay()+7)%7;
  d.setDate(1+diff+(n-1)*7); return d;
}
function getLastWeekday(year,month,weekday){
  var d=new Date(year,month+1,0);
  var diff=(d.getDay()-weekday+7)%7;
  d.setDate(d.getDate()-diff); return d;
}
function getUSHolidays(year){
  var h=[]; function add(d,t){h.push({date:toDateStr(d),title:t,_holType:'us'});}
  add(new Date(year,0,1),"New Year's Day");
  add(getNthWeekday(year,0,1,3),"MLK Jr. Day");
  add(getNthWeekday(year,1,1,3),"Presidents' Day");
  add(getNthWeekday(year,4,0,2),"Mother's Day");
  add(getLastWeekday(year,4,1),"Memorial Day");
  add(new Date(year,5,19),"Juneteenth");
  add(getNthWeekday(year,5,0,3),"Father's Day");
  add(new Date(year,6,4),"Independence Day");
  add(getNthWeekday(year,8,1,1),"Labor Day");
  add(getNthWeekday(year,9,1,2),"Columbus Day");
  add(new Date(year,10,11),"Veterans Day");
  add(getNthWeekday(year,10,4,4),"Thanksgiving");
  add(new Date(year,11,25),"Christmas Day");
  return h;
}
var _jewishHolCache={};
function getJewishHolidaysForYear(year,callback){
  if(_jewishHolCache[year]){if(callback)callback(_jewishHolCache[year]);return;}
  var stored=localStorage.getItem('dm_jewish_hol_'+year);
  if(stored){try{var p=JSON.parse(stored);_jewishHolCache[year]=p;if(callback)callback(p);return;}catch(e){}}
  var url='https://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year='+year+'&ss=off&mf=off&c=off&geo=none&M=off&s=off&leyning=off&i=off';
  fetch(url).then(function(r){return r.json();}).then(function(data){
    var items=(data.items||[]).filter(function(item){
      if(item.category!=='holiday')return false;
      if(item.title&&item.title.indexOf('Chol ha-Moed')>=0)return false;
      return true;
    }).map(function(item){return{date:item.date.substring(0,10),title:item.title,_holType:'jewish'};});
    _jewishHolCache[year]=items;
    localStorage.setItem('dm_jewish_hol_'+year,JSON.stringify(items));
    if(callback)callback(items);
  }).catch(function(){if(callback)callback([]);});
}
function getHolidaysForDate(ds){
  var year=parseInt(ds.substring(0,4),10);
  var us=getUSHolidays(year).filter(function(h){return h.date===ds;});
  var jewish=(_jewishHolCache[year]||[]).filter(function(h){return h.date===ds;});
  return us.concat(jewish);
}

function renderCalendar() {
  var year=state.calYear, month=state.calMonth, now=new Date();
  var labelText=new Date(year,month,1).toLocaleDateString('en-US',{month:'long',year:'numeric'});
  document.getElementById('calMonthLabel').textContent=labelText;
  // Fetch Jewish holidays for year(s) visible — re-render when loaded
  if(!_jewishHolCache[year]){
    getJewishHolidaysForYear(year,function(){renderCalendar();});
  }
  var prevYear=month===0?year-1:year, nextYear=month===11?year+1:year;
  if(prevYear!==year&&!_jewishHolCache[prevYear])getJewishHolidaysForYear(prevYear,null);
  if(nextYear!==year&&!_jewishHolCache[nextYear])getJewishHolidaysForYear(nextYear,null);

  var firstDay=new Date(year,month,1).getDay(), daysInMonth=new Date(year,month+1,0).getDate(), daysInPrevMonth=new Date(year,month,0).getDate();
  var grid=document.getElementById('calGrid'); grid.innerHTML='';
  var totalCells=Math.ceil((firstDay+daysInMonth)/7)*7; var hdatesToLoad=[];
  for (var i=0;i<totalCells;i++){
    var cell=document.createElement('div'); cell.className='cal-cell';
    var dayNum,cellDate,otherMonth=false;
    if (i<firstDay){ dayNum=daysInPrevMonth-firstDay+i+1; cellDate=new Date(year,month-1,dayNum); otherMonth=true; }
    else if (i>=firstDay+daysInMonth){ dayNum=i-firstDay-daysInMonth+1; cellDate=new Date(year,month+1,dayNum); otherMonth=true; }
    else { dayNum=i-firstDay+1; cellDate=new Date(year,month,dayNum); }
    if (otherMonth) cell.classList.add('other-month');
    if (cellDate.toDateString()===now.toDateString()) cell.classList.add('is-today');
    var ds=toDateStr(cellDate);
    var numEl=document.createElement('div'); numEl.className='cal-cell-top';
    numEl.innerHTML='<div class="cal-day-num">'+dayNum+'</div><div class="cal-hdate" id="chd-'+ds+'"></div>';
    cell.appendChild(numEl);
    var holidays=getHolidaysForDate(ds);
    var events=getEventsForDate(ds);
    if(holidays.length||events.length){
      var evDiv=document.createElement('div'); evDiv.className='cal-events';
      holidays.forEach(function(h){
        var chip=document.createElement('div');
        chip.className='cal-event-chip '+(h._holType==='jewish'?'cc-jewish-hol':'cc-us-hol');
        chip.textContent=(h._holType==='jewish'?'✡️ ':'🇺🇸 ')+h.title;
        chip.onclick=(function(d){return function(e){e.stopPropagation();openDayDetail(d);};})(ds);
        evDiv.appendChild(chip);
      });
      events.forEach(function(ev){
        var c=colorByValue(ev.color); var chip=document.createElement('div');
        chip.className='cal-event-chip '+(c.chipCls||'');
        chip.textContent=(ev.time?fmt12(ev.time)+' ':'')+ev.title;
        chip.onclick=(function(d){return function(e){e.stopPropagation();openDayDetail(d);};})(ds);
        evDiv.appendChild(chip);
      });
      cell.appendChild(evDiv);
    }
    var reminders=getRemindersForDate(ds);
    if(reminders.length){
      var remDot=document.createElement('div');
      remDot.className='cal-reminder-dot';
      remDot.title=reminders.map(function(r){return r.ev.title+' ('+r.label+' reminder)';}).join('\n');
      cell.appendChild(remDot);
    }
    cell.addEventListener('click',(function(d){return function(){openDayDetail(d);};})(ds));
    grid.appendChild(cell);
    if (!otherMonth) hdatesToLoad.push(ds);
  }
  hdatesToLoad.forEach(function(ds){loadCalHdate(ds);});
}

// ============================================================
// RENDER — NOTES
// ============================================================
function renderFolderSubtree(folders, parentId, depth) {
  var active=state.activeFolderId;
  return folders.filter(function(f){return (f.parentId||null)===(parentId||null);}).map(function(f){
    var hasChildren=folders.some(function(c){return c.parentId===f.id;});
    var expanded=state.expandedFolders[f.id]!==false; // default expanded
    var dot=f.color?'<span class="folder-color-dot" style="background:'+f.color+'"></span>':'📁 ';
    var lockIcon=f.password?'<span class="folder-lock-icon">🔒</span>':'';
    var toggle=hasChildren?'<span class="folder-toggle-btn" onclick="event.stopPropagation();toggleFolderExpand(\''+f.id+'\')">'+(expanded?'▾':'▸')+'</span>':'<span class="folder-toggle-placeholder"></span>';
    var indent=depth*18;
    var isDrag=depth===0;
    var row='<div class="sidebar-item folder-item'+(active===f.id?' active':'')+'" '+
      (isDrag?'draggable="true" data-fid="'+f.id+'" ondragstart="folderDragStart(event)" ondragover="folderDragOver(event)" ondragleave="folderDragLeave(event)" ondragend="folderDragEnd(event)" ondrop="folderDrop(event)"':'')+
      ' style="padding-left:'+(16+indent)+'px" onclick="setNoteFolder(\''+f.id+'\')">'+
      (depth===0?'<span class="folder-drag-handle">⠿</span>':'')+
      toggle+dot+lockIcon+escHtml(f.name)+
      '<div class="folder-item-actions">'+
        '<button class="btn-icon" style="font-size:12px" onclick="event.stopPropagation();openEditFolder(\''+f.id+'\')">✏️</button>'+
        '<button class="btn-icon" style="font-size:12px" onclick="event.stopPropagation();removeFolder(\''+f.id+'\')">✕</button>'+
      '</div></div>';
    var children=hasChildren&&expanded?renderFolderSubtree(folders,f.id,depth+1):'';
    return row+children;
  }).join('');
}
function renderNotesSidebar() {
  var data=getData(); var sidebar=document.getElementById('notesSidebar'); var active=state.activeFolderId;
  var html='';
  html+='<div class="sidebar-item'+(active==='all'?' active':'')+'" onclick="setNoteFolder(\'all\')">📝 All Notes</div>';
  html+='<div class="sidebar-item'+(active==='pinned'?' active':'')+'" onclick="setNoteFolder(\'pinned\')">📌 Pinned</div>';
  html+='<div class="sidebar-item'+(active==='trash'?' active':'')+' trash" onclick="setNoteFolder(\'trash\')">🗑 Recently Deleted</div>';
  html+='<hr class="sidebar-divider">';
  html+=renderFolderSubtree(data.folders,null,0);
  html+='<hr class="sidebar-divider">';
  html+='<div class="sidebar-add-folder" onclick="openFolderModal()">+ New Folder</div>';
  sidebar.innerHTML=html;
}
function trashNoteCardHTML(note) {
  var c=colorByValue(note.color); var colorClass=c.noteCls?' '+c.noteCls:'';
  var contentHTML = note.type==='checklist'
    ? '<div class="note-card-content">'+note.items.slice(0,3).map(function(item){return escHtml(item.text);}).join(', ')+'</div>'
    : '<div class="note-card-content">'+escHtml(note.content||'')+'</div>';
  var daysLeft='';
  if(note.deletedAt){
    var d=Math.ceil((new Date(note.deletedAt).getTime()+30*24*60*60*1000-Date.now())/(1000*60*60*24));
    daysLeft='<div class="note-deleted-info">Auto-deleted in '+Math.max(0,d)+' day'+(Math.max(0,d)!==1?'s':'')+'</div>';
  }
  return '<div class="note-card is-deleted'+colorClass+'">'+(note.title?'<div class="note-card-title">'+escHtml(note.title)+'</div>':'')+contentHTML+daysLeft+
    '<div class="note-restore-actions">'+
    '<button class="btn-restore" onclick="event.stopPropagation();restoreNoteCard(\''+note.id+'\')">↩ Restore</button>'+
    '<button class="btn-icon" onclick="event.stopPropagation();permanentlyDeleteNote(\''+note.id+'\')" title="Delete permanently" style="color:#e53e3e">🗑</button>'+
    '</div></div>';
}
window.restoreNoteCard = function(id){ restoreNote(id); renderNotes(); };
window.permanentlyDeleteNote = function(id){ if(confirm('Permanently delete this note? This cannot be undone.')){ purgeNoteById(id); renderNotes(); } };

// Note drag-and-drop reorder
window.noteDragStart=function(e,id){
  _draggingNoteId=id; e.dataTransfer.effectAllowed='move';
  e.currentTarget.classList.add('note-dragging');
};
window.noteDragOver=function(e,id){
  e.preventDefault(); e.stopPropagation();
  if(id===_draggingNoteId)return;
  var src=_draggingNoteId; if(!src)return;
  var data=getData();
  var srcNote=data.notes.find(function(n){return n.id===src;});
  var tgtNote=data.notes.find(function(n){return n.id===id;});
  if(!srcNote||!tgtNote||srcNote.pinned!==tgtNote.pinned)return;
  e.currentTarget.classList.add('note-drag-over');
};
window.noteDragLeave=function(e){
  e.currentTarget.classList.remove('note-drag-over');
};
window.noteDragEnd=function(e){
  _draggingNoteId=null;
  document.querySelectorAll('.note-dragging,.note-drag-over').forEach(function(el){
    el.classList.remove('note-dragging','note-drag-over');
  });
};
window.noteDragDrop=function(e,targetId){
  e.preventDefault(); e.stopPropagation();
  var srcId=_draggingNoteId; _draggingNoteId=null;
  document.querySelectorAll('.note-dragging,.note-drag-over').forEach(function(el){
    el.classList.remove('note-dragging','note-drag-over');
  });
  if(!srcId||srcId===targetId)return;
  var data=getData(); var notes=data.notes;
  var si=notes.findIndex(function(n){return n.id===srcId;});
  var ti=notes.findIndex(function(n){return n.id===targetId;});
  if(si===-1||ti===-1)return;
  if(notes[si].pinned!==notes[ti].pinned)return;
  var item=notes.splice(si,1)[0];
  notes.splice(ti,0,item);
  saveN(notes); renderNotes();
};

function renderNotesMain() {
  var data=getData(); var main=document.getElementById('notesMain');

  if(state.activeFolderId==='trash'){
    var deleted=data.notes.filter(function(n){return n.deleted;});
    if(!deleted.length){
      main.innerHTML='<div class="notes-empty"><div class="notes-empty-icon">🗑</div><p>Recently Deleted is empty.<br>Deleted notes stay here for 30 days.</p></div>';
    } else {
      main.innerHTML='<p style="color:#aaa;font-size:13px;margin-bottom:12px">Deleted notes are permanently removed after 30 days.</p><div class="notes-grid">'+deleted.map(trashNoteCardHTML).join('')+'</div>';
    }
    return;
  }

  var query=state.notesSearchQuery.toLowerCase();
  var notes=data.notes.filter(function(n){
    if(n.deleted||n.archived) return false;
    if (query) return (n.title+' '+n.content+' '+n.items.map(function(i){return i.text;}).join(' ')).toLowerCase().includes(query);
    if (state.activeFolderId==='pinned') return n.pinned;
    if (state.activeFolderId==='all') return true;
    return getNoteFolderIds(n).indexOf(state.activeFolderId) !== -1;
  });
  var pinned=notes.filter(function(n){return n.pinned;}), regular=notes.filter(function(n){return !n.pinned;});
  if (!notes.length){ main.innerHTML='<div class="notes-empty"><div class="notes-empty-icon">📝</div><p>No notes here yet.<br>Click "+ New Note" to add one.</p></div>'; return; }
  var html='';
  if (pinned.length){ html+='<div class="notes-section-label">📌 Pinned</div><div class="notes-grid">'+pinned.map(noteCardHTML).join('')+'</div>'; }
  if (regular.length){ if(pinned.length)html+='<div class="notes-section-label" style="margin-top:8px">Other notes</div>'; html+='<div class="notes-grid">'+regular.map(noteCardHTML).join('')+'</div>'; }
  main.innerHTML=html;
}
function noteCardHTML(note) {
  var c=colorByValue(note.color); var colorClass=c.noteCls?' '+c.noteCls:'';
  var contentHTML='';
  if (note.type==='checklist'){
    contentHTML='<div class="note-card-content">'+
      note.items.slice(0,5).map(function(item){return '<div class="note-checklist-item'+(item.done?' done':'')+'">'+'<input type="checkbox"'+(item.done?' checked':'')+' disabled> <span>'+escHtml(item.text)+'</span></div>';}).join('')+
      (note.items.length>5?'<div style="font-size:12px;color:#aaa;margin-top:4px">+'+(note.items.length-5)+' more</div>':'')+
      '</div>';
  } else { contentHTML='<div class="note-card-content">'+(note.content||'')+'</div>'; }
  // Folder badges
  var data=getData(); var folderIds=getNoteFolderIds(note);
  var badges=folderIds.map(function(fid){
    var f=data.folders.find(function(f){return f.id===fid;}); if(!f)return '';
    var bg=f.color?'background:'+f.color+';':'';
    return '<span class="note-folder-badge" style="'+bg+'">'+escHtml(f.name)+'</span>';
  }).filter(Boolean).join('');
  var badgesHTML=badges?'<div class="note-folder-badges">'+badges+'</div>':'';
  var dateStr = fmtNoteDate(note.updatedAt||note.createdAt);
  return '<div class="note-card'+colorClass+(note.pinned?' is-pinned':'')+'" '+
    'draggable="true" data-note-id="'+note.id+'" data-pinned="'+(note.pinned?'1':'0')+'" '+
    'ondragstart="noteDragStart(event,\''+note.id+'\')" ondragover="noteDragOver(event,\''+note.id+'\')" '+
    'ondragleave="noteDragLeave(event)" ondragend="noteDragEnd(event)" ondrop="noteDragDrop(event,\''+note.id+'\')" '+
    'onclick="openNoteView(\''+note.id+'\')">'+(note.pinned?'<span class="note-pin-flag">📌</span>':'')+
    (dateStr?'<div class="note-card-date">'+escHtml(dateStr)+'</div>':'')+
    (note.title?'<div class="note-card-title">'+escHtml(note.title)+'</div>':'')+contentHTML+badgesHTML+
    '<div class="note-card-actions">'+
    '<button class="btn-icon" onclick="event.stopPropagation();openEditNote(\''+note.id+'\')" title="Edit">✏️</button>'+
    '<button class="btn-icon" onclick="event.stopPropagation();pinNote(\''+note.id+'\')" title="Pin">'+(note.pinned?'📌':'📍')+'</button>'+
    '<button class="btn-icon" onclick="event.stopPropagation();removeNote(\''+note.id+'\')" title="Delete">🗑</button></div></div>';
}
function renderNotes(){ renderNotesSidebar(); renderNotesMain(); }

// ============================================================
// DASHBOARD DAY POPUP (7-day card click)
// ============================================================
window.compactCardClick = function(ds, e) {
  if (e.target.closest('button,input,a')) return;
  openDashDayPopup(ds);
};
window.taskClick = function(ds, id, isR, e) {
  if (e.target.closest('button,input')) return;
  if (isR) { openRoutineOverride(ds, id); }
  else { openEditTask(ds, id); }
};
window.openDashDayPopup = function(ds) {
  state.dashDayModalDs = ds;
  var date = fromDateStr(ds);
  document.getElementById('dashDayModalTitle').textContent = dayName(date) + ', ' + shortMonthDay(date);
  var hdateEl = document.getElementById('dashDayModalHdate');
  if (hdateEl) { hdateEl.textContent = '...'; fetchHebrewDate(ds).then(function(h){ if(hdateEl&&h)hdateEl.textContent=h; }); }
  renderDashDayModalBody(ds);
  document.getElementById('dashDayAddTaskBtn').onclick = function() {
    closeModal('dashDayModal');
    window.openAddTask(ds);
  };
  openModal('dashDayModal');
};
function renderDashDayModalBody(ds) {
  var body = document.getElementById('dashDayModalBody'); if(!body)return;
  var tasks = getTasksForDate(ds);
  var tHTML = tasks.length
    ? tasks.map(function(t){return taskHTML(t,ds);}).join('')
    : '<div class="empty-tasks" style="padding:20px 22px">No tasks yet for this day.</div>';
  body.innerHTML = '<div class="task-list">'+tHTML+'</div>';
}

// ============================================================
// CHESHBON TAB SWITCHING
// ============================================================
window.setCheshTab = function(tab) {
  state.activeCheshTab = tab;
  document.querySelectorAll('.chesh-tab').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('onclick') === "setCheshTab('"+tab+"')");
  });
  document.getElementById('chesh-panel-daily').style.display   = tab==='daily'   ? '' : 'none';
  document.getElementById('chesh-panel-weekly').style.display  = tab==='weekly'  ? '' : 'none';
  document.getElementById('chesh-panel-monthly').style.display = tab==='monthly' ? '' : 'none';
  if (tab === 'daily')   { renderCheshbonLeft(); renderCheshbonRight(); renderFreeReflHist(); }
  if (tab === 'weekly')  renderWeeklyTab();
  if (tab === 'monthly') renderMonthlyTab();
};

// ============================================================
// DASHBOARD VIEW SWITCHING
// ============================================================
function setDashView(viewName) {
  var viewMap = {single:'singleDayView',seven:'sevenDayView',future:'futureView',cheshbon:'cheshbonView',health:'healthView',reminders:'remindersView'};
  var pillMap = {single:'pillDay',seven:'pillSeven',future:'pillFuture',cheshbon:'pillCheshbon',health:'pillHealth',reminders:'pillReminders'};
  Object.values(viewMap).forEach(function(v){ var el=document.getElementById(v); if(el)el.classList.remove('active'); });
  Object.values(pillMap).forEach(function(p){ var el=document.getElementById(p); if(el)el.classList.remove('active'); });
  state.dashView=viewName;
  var vEl=document.getElementById(viewMap[viewName]); if(vEl)vEl.classList.add('active');
  var pEl=document.getElementById(pillMap[viewName]); if(pEl)pEl.classList.add('active');
  if (viewName==='single')    renderSingle();
  if (viewName==='seven')     renderSeven();
  if (viewName==='future')    renderFuture();
  if (viewName==='cheshbon')  { setCheshTab('daily'); }
  if (viewName==='health')    renderHealth();
  if (viewName==='reminders') renderReminders();
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.header-nav-tab').forEach(function(t){t.classList.remove('active');});
  document.getElementById('page-'+pageId).classList.add('active');
  var activeTab=document.querySelector('.header-nav-tab[data-page="'+pageId+'"]');
  if (activeTab) activeTab.classList.add('active');
  state.currentPage=pageId;
  if (pageId==='dashboard') { setDashView('seven'); checkMissedTasks(); }
  if (pageId==='calendar')  renderCalendar();
  if (pageId==='notes')     renderNotes();
  if (pageId==='learning')  renderLearning();
  if (pageId==='financial') renderFinancial();
}

// ============================================================
// DRAG-AND-DROP (Simple Lists)
// ============================================================
var _stlDrag = { srcId: null, srcList: null };
var _folderDrag = { srcId: null };

window.stlDragStart = function(e) {
  _stlDrag.srcId   = e.currentTarget.dataset.id;
  _stlDrag.srcList = e.currentTarget.dataset.list;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
};
window.stlDragOver = function(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
};
window.stlDragLeave = function(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over');
  }
};
window.stlDragEnd = function(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.stl-item').forEach(function(el){ el.classList.remove('drag-over'); });
};
window.stlDrop = function(e) {
  e.preventDefault();
  var tgtId   = e.currentTarget.dataset.id;
  var tgtList = e.currentTarget.dataset.list;
  e.currentTarget.classList.remove('drag-over');
  if (!_stlDrag.srcId || _stlDrag.srcId === tgtId || _stlDrag.srcList !== tgtList) return;
  reorderSimpleList(tgtList, _stlDrag.srcId, tgtId);
  _stlDrag.srcId = null; _stlDrag.srcList = null;
  tgtList === 'shortterm' ? renderShortTerm() : renderLongTerm();
};

// ============================================================
// DRAG-AND-DROP (Folders sidebar)
// ============================================================
window.folderDragStart = function(e) {
  _folderDrag.srcId = e.currentTarget.dataset.fid;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
};
window.folderDragOver = function(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
};
window.folderDragLeave = function(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over');
  }
};
window.folderDragEnd = function(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.folder-item').forEach(function(el){ el.classList.remove('drag-over'); });
};
window.folderDrop = function(e) {
  e.preventDefault();
  var tgtId = e.currentTarget.dataset.fid;
  e.currentTarget.classList.remove('drag-over');
  if (!_folderDrag.srcId || _folderDrag.srcId === tgtId) return;
  reorderFolders(_folderDrag.srcId, tgtId);
  _folderDrag.srcId = null;
  renderNotesSidebar();
};

// ============================================================
// CARRY OVER BANNER — yesterday's unfinished tasks
// ============================================================
function renderCarryOverBanner() {
  var todayDs = toDateStr(dateFromOffset(0));
  var yesterDs = toDateStr(dateFromOffset(-1));
  var tasks = getTasksForDate(yesterDs).filter(function(t){ return !t.done && t.type !== 'routine'; });
  if (!tasks.length) return '';
  var rows = tasks.map(function(t){
    return '<div class="co-item">' +
      '<span class="co-item-title">'+escHtml(t.title)+'</span>' +
      '<div class="co-item-btns">' +
        '<button class="co-btn co-today" onclick="executeMoveTask(\''+yesterDs+'\',\''+t.id+'\',false,\''+todayDs+'\')">→ Today</button>' +
        '<button class="co-btn co-other" onclick="openMoveTaskModal(\''+yesterDs+'\',\''+t.id+'\',false)">→ Other day</button>' +
        '<button class="co-btn co-done" onclick="markCarryOverDone(\''+yesterDs+'\',\''+t.id+'\')">✓ Done</button>' +
      '</div></div>';
  }).join('');
  return '<div class="co-banner">' +
    '<div class="co-banner-hdr">📋 '+tasks.length+' unfinished from yesterday</div>' +
    rows + '</div>';
}

// ============================================================
// GLOBAL CALLBACKS
// ============================================================
window.checkTask = function(ds,id,isR){ toggleDone(ds,id,isR); refresh(); refreshDashDayModal(); };
window.removeTask = function(ds,id){ if(confirm('Delete this task?')){ deleteTask(ds,id); refresh(); refreshDashDayModal(); } };
window.markCarryOverDone = function(ds,id){ toggleDone(ds,id,false); refresh(); };
window.skipRoutineDay = function(ds, routineId) {
  var data=getData(); var key=ds+'_'+routineId;
  data.routineOverrides[key]=data.routineOverrides[key]||{};
  data.routineOverrides[key].skipped=true;
  saveRO(data.routineOverrides); refresh(); refreshDashDayModal();
};
window.executeMoveTask = function(fromDs, id, isR, toDs) {
  if (fromDs===toDs) { closeModal('moveDayModal'); return; }
  var data=getData();
  if (isR) {
    var r=data.routine.find(function(r){return r.id===id;}); if(!r)return;
    var key=fromDs+'_'+id;
    data.routineOverrides[key]=data.routineOverrides[key]||{};
    data.routineOverrides[key].skipped=true; saveRO(data.routineOverrides);
    addTask(toDs,{title:r.title,time:r.time||'',location:r.location||''});
  } else {
    var t=(data.tasks[fromDs]||[]).find(function(t){return t.id===id;}); if(!t)return;
    addTask(toDs,{title:t.title,time:t.time,location:t.location,notes:t.notes,color:t.color,priority:t.priority,linkedNoteIds:t.linkedNoteIds||[]});
    deleteTask(fromDs,id);
  }
  closeModal('moveDayModal'); refresh(); refreshDashDayModal();
};
window.openMoveTaskModal = function(ds, id, isR) {
  closeModal('dashDayModal');
  state.moveTaskDs=ds; state.moveTaskId=id; state.moveTaskIsR=isR;
  var today=dateFromOffset(0); var grid=document.getElementById('moveDayGrid');
  if (!grid) return;
  var days=[]; for(var i=0;i<14;i++) days.push(dateFromOffset(i));
  grid.innerHTML=days.map(function(d){
    var dds=toDateStr(d);
    var isT=dds===toDateStr(today);
    return '<button class="move-day-btn'+(isT?' move-day-today':'')+'" onclick="executeMoveTask(\''+ds+'\',\''+id+'\','+isR+',\''+dds+'\')">'+
      '<span class="mdb-day">'+d.toLocaleDateString('en-US',{weekday:'short'})+'</span>'+
      '<span class="mdb-date">'+d.toLocaleDateString('en-US',{month:'short',day:'numeric'})+'</span>'+
    '</button>';
  }).join('');
  openModal('moveDayModal');
};

// Build note rows HTML for a set of notes
function notePickerRowsHTML(notes, linked) {
  return notes.map(function(n){
    var chk=linked.indexOf(n.id)!==-1;
    var preview=n.content?escHtml(n.content.replace(/<[^>]*>/g,'').slice(0,60)):'';
    return '<label class="note-pick-row">'+
      '<input type="checkbox" class="note-pick-chk" data-nid="'+n.id+'"'+(chk?' checked':'')+'>'+
      '<span class="note-pick-title">'+(n.title||'Untitled')+'</span>'+
      (preview?'<span class="note-pick-preview">'+preview+'</span>':'')+
    '</label>';
  }).join('');
}
// Recursively build folder tree picker HTML
function buildFolderPickerHTML(parentId, folders, allNotes, linked) {
  var children=folders.filter(function(f){return (f.parentId||null)===(parentId||null);});
  if(!children.length) return '';
  return children.map(function(f){
    var directNotes=allNotes.filter(function(n){return getNoteFolderIds(n).indexOf(f.id)!==-1;});
    var subHTML=buildFolderPickerHTML(f.id,folders,allNotes,linked);
    var border=f.color?'border-left:3px solid '+f.color+';':'border-left:3px solid #ddd;';
    var hasSubFolders=folders.some(function(sf){return sf.parentId===f.id;});
    var icon=hasSubFolders?'📂':'📁';
    return '<div class="npg-wrap">'+
      '<div class="npg-hdr" onclick="this.parentElement.classList.toggle(\'open\')" style="'+border+'">'+
        '<span class="npg-icon">'+icon+'</span>'+
        '<span class="npg-name">'+escHtml(f.name)+'</span>'+
        (directNotes.length?'<span class="npg-count">'+directNotes.length+'</span>':'')+
        '<span class="npg-arrow">▸</span>'+
      '</div>'+
      '<div class="npg-body">'+notePickerRowsHTML(directNotes,linked)+subHTML+'</div>'+
    '</div>';
  }).join('');
}
// Build a hierarchical (by folder tree) note picker into `el`
function buildNotePickerCategorized(linked, el) {
  var data=getData();
  var allNotes=data.notes.filter(function(n){return !n.deleted&&!n.archived;});
  var folders=data.folders||[];
  if(!allNotes.length){el.innerHTML='<div style="color:#aaa;font-size:13px">No notes found.</div>';return;}
  var html=buildFolderPickerHTML(null,folders,allNotes,linked);
  // Unfiled: notes not in any folder
  var uncat=allNotes.filter(function(n){return !getNoteFolderIds(n).length;});
  if(uncat.length){
    html+='<div class="npg-wrap">'+
      '<div class="npg-hdr" onclick="this.parentElement.classList.toggle(\'open\')" style="border-left:3px solid #ddd;">'+
        '<span class="npg-icon">📄</span>'+
        '<span class="npg-name">Unfiled</span>'+
        '<span class="npg-count">'+uncat.length+'</span>'+
        '<span class="npg-arrow">▸</span>'+
      '</div>'+
      '<div class="npg-body">'+notePickerRowsHTML(uncat,linked)+'</div>'+
    '</div>';
  }
  if(!html){el.innerHTML='<div style="color:#aaa;font-size:13px">No notes found.</div>';return;}
  el.innerHTML=html;
}
// ============================================================
// DRAG-TO-REORDER TASKS (today view only)
// ============================================================
var _dragTaskInfo=null;
window.taskDragStart=function(e,ds,id){
  _dragTaskInfo={ds:ds,id:id};
  e.dataTransfer.effectAllowed='move';
  setTimeout(function(){var el=document.getElementById('ti-'+id);if(el)el.classList.add('task-dragging');},0);
};
window.taskDragOver=function(e){
  e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect='move';
  var target=e.currentTarget;
  if(!target||(_dragTaskInfo&&target.id==='ti-'+_dragTaskInfo.id))return;
  document.querySelectorAll('.task-drag-above,.task-drag-below').forEach(function(el){el.classList.remove('task-drag-above','task-drag-below');});
  // Clear whole-card drop highlight when hovering over a specific task
  document.querySelectorAll('.day-card-drop-target').forEach(function(el){el.classList.remove('day-card-drop-target');});
  var rect=target.getBoundingClientRect();
  target.classList.add(e.clientY<rect.top+rect.height/2?'task-drag-above':'task-drag-below');
};
window.taskDragLeave=function(e){
  var t=e.currentTarget; if(t){t.classList.remove('task-drag-above','task-drag-below');}
};
window.taskDrop=function(e,ds,toId){
  e.preventDefault(); e.stopPropagation();
  var target=e.currentTarget;
  var insertBefore=target&&target.classList.contains('task-drag-above');
  if(target)target.classList.remove('task-drag-above','task-drag-below');
  if(!_dragTaskInfo||_dragTaskInfo.id===toId)return;
  var fromId=_dragTaskInfo.id;
  var fromDs=_dragTaskInfo.ds;

  if(fromDs===ds){
    // ── Same-day reorder ──
    var allTasks=getTasksForDate(ds);
    var ids=allTasks.map(function(t){return t.id;});
    var fromIdx=ids.indexOf(fromId); var toIdx=ids.indexOf(toId);
    if(fromIdx===-1||toIdx===-1)return;
    ids.splice(fromIdx,1);
    var newTo=ids.indexOf(toId);
    ids.splice(insertBefore?newTo:newTo+1,0,fromId);
    var orderData=JSON.parse(localStorage.getItem('dm_task_order')||'{}');
    orderData[ds]=ids; localStorage.setItem('dm_task_order',JSON.stringify(orderData));
    refresh(); refreshDashDayModal();
  } else {
    // ── Cross-day move: insert at exact position ──
    var data=getData();
    var task=(data.tasks[fromDs]||[]).find(function(t){return t.id===fromId&&!t._rc;});
    if(!task)return; // routine — blocked
    // Remove from source day
    data.tasks[fromDs]=(data.tasks[fromDs]||[]).filter(function(t){return t.id!==fromId;});
    // Build new task for target day
    var newId=uid();
    if(!data.tasks[ds])data.tasks[ds]=[];
    data.tasks[ds].push(Object.assign({},task,{id:newId,done:false}));
    saveT(data.tasks);
    // Place at the correct position in target day
    var targetTasks=getTasksForDate(ds); // new task is at end
    var tIds=targetTasks.map(function(t){return t.id;});
    var nIdx=tIds.indexOf(newId); var tIdx=tIds.indexOf(toId);
    if(nIdx!==-1&&tIdx!==-1){
      tIds.splice(nIdx,1);
      var newTo2=tIds.indexOf(toId);
      tIds.splice(insertBefore?newTo2:newTo2+1,0,newId);
    }
    var orderData2=JSON.parse(localStorage.getItem('dm_task_order')||'{}');
    delete orderData2[fromDs]; orderData2[ds]=tIds;
    localStorage.setItem('dm_task_order',JSON.stringify(orderData2));
    _dragTaskInfo=null; refresh(); refreshDashDayModal();
  }
};
window.taskDragEnd=function(e){
  _dragTaskInfo=null;
  document.querySelectorAll('.task-dragging,.task-drag-above,.task-drag-below').forEach(function(el){el.classList.remove('task-dragging','task-drag-above','task-drag-below');});
};

// ============================================================
// MISSED TASKS — surface unfinished tasks from skipped days
// ============================================================
var _missedTasks=[];
function checkMissedTasks(){
  var todayDs=toDateStr(new Date());
  var lastDs=localStorage.getItem('dm_last_opened')||todayDs;
  localStorage.setItem('dm_last_opened',todayDs);
  if(lastDs>=todayDs)return;
  var data=getData(); var missed=[];
  var cur=new Date(fromDateStr(lastDs)); cur.setDate(cur.getDate()+1);
  var today=new Date(fromDateStr(todayDs));
  while(cur<today){
    var ds=toDateStr(cur);
    (data.tasks[ds]||[]).forEach(function(t){
      if(t.type!=='routine'&&!t.done) missed.push({task:t,ds:ds,action:null,pickDate:''});
    });
    cur.setDate(cur.getDate()+1);
  }
  if(!missed.length)return;
  _missedTasks=missed;
  openMissedTasksModal();
}
function openMissedTasksModal(){
  document.getElementById('missedTasksSubtitle').textContent=
    _missedTasks.length+' unfinished task'+(_missedTasks.length>1?'s':'')+' from days you were away';
  renderMissedTasksList();
  openModal('missedTasksModal');
}
function renderMissedTasksList(){
  var el=document.getElementById('missedTasksList'); if(!el)return;
  var byDate={};
  _missedTasks.forEach(function(m,idx){if(!byDate[m.ds])byDate[m.ds]=[];byDate[m.ds].push({m:m,idx:idx});});
  el.innerHTML=Object.keys(byDate).sort().map(function(ds){
    var d=fromDateStr(ds);
    var lbl=d.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'});
    var rows=byDate[ds].map(function(item){
      var m=item.m; var i=item.idx;
      var btns=['today','keep','delete','pick'].map(function(a){
        var labels={today:'→ Today',keep:'Keep',delete:'🗑 Delete',pick:'📅 Pick Date'};
        var active=m.action===a?' mta-active':'';
        return '<button class="missed-action-btn'+active+'" onclick="setMissedTaskAction('+i+',\''+a+'\')">'+labels[a]+'</button>';
      }).join('');
      var datePicker=m.action==='pick'?'<input type="date" class="field missed-date-pick" value="'+m.pickDate+'" onchange="setMissedTaskPickDate('+i+',this.value)">':'';
      return '<div class="missed-task-row"><div class="missed-task-title">'+escHtml(m.task.title)+'</div>'+
        '<div class="missed-task-actions">'+btns+datePicker+'</div></div>';
    }).join('');
    return '<div class="missed-date-group"><div class="missed-date-hdr">'+lbl+'</div>'+rows+'</div>';
  }).join('');
}
window.setMissedTaskAction=function(idx,action){
  if(!_missedTasks[idx])return;
  _missedTasks[idx].action=action;
  if(action!=='pick')_missedTasks[idx].pickDate='';
  renderMissedTasksList();
};
window.setMissedTaskPickDate=function(idx,val){if(_missedTasks[idx])_missedTasks[idx].pickDate=val;};
window.missedTasksBulk=function(action){_missedTasks.forEach(function(m){m.action=action;});renderMissedTasksList();};
window.applyMissedTasks=function(){
  var todayDs=toDateStr(new Date()); var data=getData();
  _missedTasks.forEach(function(m){
    if(!m.action||m.action==='keep')return;
    data.tasks[m.ds]=(data.tasks[m.ds]||[]).filter(function(t){return t.id!==m.task.id;});
    if(m.action==='delete')return;
    var targetDs=m.action==='today'?todayDs:m.pickDate;
    if(!targetDs)return;
    if(!data.tasks[targetDs])data.tasks[targetDs]=[];
    data.tasks[targetDs].push(Object.assign({},m.task));
  });
  saveT(data.tasks); closeModal('missedTasksModal'); refresh();
};

// Render the "linked" chips in the task modal
function renderTaskModalLinkedDisplay() {
  var el=document.getElementById('taskModalLinkedDisplay'); if(!el)return;
  var data=getData();
  if(!state.taskModalLinkedNotes.length){el.innerHTML='<span class="no-linked-notes">None linked</span>';return;}
  el.innerHTML=state.taskModalLinkedNotes.map(function(nid){
    var n=data.notes.find(function(n){return n.id===nid;}); if(!n)return'';
    return '<span class="linked-note-chip">'+escHtml(n.title||'Untitled')+
      '<button class="linked-chip-del" onclick="removeTaskModalLinkedNote(\''+nid+'\')">×</button></span>';
  }).filter(Boolean).join('');
}
window.removeTaskModalLinkedNote=function(nid){
  state.taskModalLinkedNotes=state.taskModalLinkedNotes.filter(function(id){return id!==nid;});
  renderTaskModalLinkedDisplay();
  var chk=document.querySelector('#taskModalNotePickerList .note-pick-chk[data-nid="'+nid+'"]');
  if(chk)chk.checked=false;
};
window.toggleTaskModalNotePicker=function(){
  var wrap=document.getElementById('taskModalNotePickerWrap'); if(!wrap)return;
  var open=wrap.style.display!=='none';
  var btn=document.getElementById('taskModalLinkNoteBtn');
  if(open){wrap.style.display='none';if(btn)btn.textContent='📎 Link a Note';}
  else{
    buildNotePickerCategorized(state.taskModalLinkedNotes,document.getElementById('taskModalNotePickerList'));
    wrap.style.display='';
    if(btn)btn.textContent='✕ Close';
  }
};
window.openLinkedNote=function(id){
  closeModal('taskNotesLinkModal');
  setTimeout(function(){openNoteView(id);},150);
};
window.openTaskNotesLink = function(ds, taskId) {
  closeModal('dashDayModal');
  state.linkNotesTaskDs=ds; state.linkNotesTaskId=taskId;
  var data=getData();
  var task=(data.tasks[ds]||[]).find(function(t){return t.id===taskId;}); if(!task)return;
  var linked=task.linkedNoteIds||[];
  var allNotes=data.notes.filter(function(n){return !n.deleted&&!n.archived;});
  var viewer=document.getElementById('linkedNotesViewer');
  if(linked.length){
    var lnotes=linked.map(function(nid){return allNotes.find(function(n){return n.id===nid;});}).filter(Boolean);
    viewer.innerHTML='<div class="lnv-hdr">Linked Notes <span style="font-weight:400;color:#aaa;font-size:11px">— click to open</span></div>'+
      lnotes.map(function(n){
        var preview=n.content?n.content.replace(/<[^>]*>/g,'').slice(0,200):'';
        return '<div class="lnv-item lnv-clickable" onclick="openLinkedNote(\''+n.id+'\')">'+
          '<div class="lnv-title">'+escHtml(n.title||'Untitled')+'</div>'+
          (preview?'<div class="lnv-body">'+escHtml(preview)+(preview.length>=200?'…':'')+'</div>':'')+
          '<span class="lnv-open-hint">Open full note →</span>'+
        '</div>';
      }).join('');
  } else {
    viewer.innerHTML='<div style="color:#aaa;font-size:13px;margin-bottom:12px">No notes linked yet.</div>';
  }
  buildNotePickerCategorized(linked, document.getElementById('notePickerList'));
  openModal('taskNotesLinkModal');
};
window.saveTaskNotesLink = function() {
  var data=getData();
  var task=(data.tasks[state.linkNotesTaskDs]||[]).find(function(t){return t.id===state.linkNotesTaskId;}); if(!task)return;
  var checked=[]; document.querySelectorAll('#notePickerList .note-pick-chk:checked').forEach(function(el){checked.push(el.dataset.nid);});
  task.linkedNoteIds=checked; saveT(data.tasks);
  closeModal('taskNotesLinkModal'); refresh(); refreshDashDayModal();
};
window.toggleTaskNotes = function(btn) {
  var item=btn.closest('.task-item');
  var panel=item.querySelector('.task-notes-panel');
  if (panel){ var vis=panel.style.display!=='none'; panel.style.display=vis?'none':''; btn.classList.toggle('active',!vis); }
};

window.openAddTask = function(ds) {
  state.editTaskId=null; state.editTaskDate=ds; state.selectedTaskColor=''; state.selectedTaskPriority='standard';
  state.taskModalLinkedNotes=[];
  document.getElementById('taskModalTitle').textContent='Add Task or Event';
  document.getElementById('taskTitle').value='';
  document.getElementById('taskTime').value='';
  document.getElementById('taskLocation').value='';
  document.getElementById('taskNotes').value='';
  document.getElementById('taskReminder').value='';
  document.getElementById('taskAddToCalendar').checked=false;
  document.querySelectorAll('.priority-btn').forEach(function(b){b.classList.toggle('active',b.dataset.priority==='standard');});
  var pw=document.getElementById('taskModalNotePickerWrap');if(pw)pw.style.display='none';
  var lb=document.getElementById('taskModalLinkNoteBtn');if(lb)lb.textContent='📎 Link a Note';
  renderTaskModalLinkedDisplay();
  openModal('taskModal');
  setTimeout(function(){document.getElementById('taskTitle').focus();},80);
};
window.openEditTask = function(ds,id) {
  closeModal('dashDayModal');
  var data=getData(); var t=(data.tasks[ds]||[]).find(function(t){return t.id===id;}); if(!t)return;
  state.editTaskId=id; state.editTaskDate=ds; state.selectedTaskColor=t.color||''; state.selectedTaskPriority=t.priority||'standard';
  state.taskModalLinkedNotes=(t.linkedNoteIds||[]).slice();
  document.getElementById('taskModalTitle').textContent='Edit Task';
  document.getElementById('taskTitle').value=t.title;
  document.getElementById('taskTime').value=t.time||'';
  document.getElementById('taskLocation').value=t.location||'';
  document.getElementById('taskNotes').value=t.notes||'';
  document.getElementById('taskReminder').value=t.reminder||'';
  document.getElementById('taskAddToCalendar').checked=false;
  document.querySelectorAll('.priority-btn').forEach(function(b){b.classList.toggle('active',b.dataset.priority===(t.priority||'standard'));});
  var pw=document.getElementById('taskModalNotePickerWrap');if(pw)pw.style.display='none';
  var lb=document.getElementById('taskModalLinkNoteBtn');if(lb)lb.textContent='📎 Link a Note';
  renderTaskModalLinkedDisplay();
  openModal('taskModal');
};
window.openZmanim = async function(ds) {
  var date=fromDateStr(ds);
  document.getElementById('zmanimModalDate').textContent=date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})+' — Zmanim';
  document.getElementById('zmanimModalBody').innerHTML='<p style="color:#aaa;text-align:center;padding:20px">Loading…</p>';
  openModal('zmanimModal');
  var times=await fetchZmanim(ds);
  var body=document.getElementById('zmanimModalBody'); if(body)body.innerHTML=zmanimFullHTML(times);
};
// Open the one-time routine override modal for a specific date
window.openRoutineOverride = function(ds, routineId) {
  closeModal('dashDayModal');
  var data=getData();
  var r=data.routine.find(function(r){return r.id===routineId;}); if(!r)return;
  var ov=data.routineOverrides[ds+'_'+routineId]||{};
  state.routineOverrideDs=ds; state.routineOverrideId=routineId;
  var date=fromDateStr(ds);
  document.getElementById('routineOverrideModalTitle').textContent='Edit "'+r.title+'" — '+shortMonthDay(date)+' only';
  document.getElementById('routineOverrideTitle').value=ov.title!==undefined?ov.title:r.title;
  document.getElementById('routineOverrideTime').value=ov.time!==undefined?ov.time:(r.time||'');
  document.getElementById('routineOverrideLocation').value=ov.location!==undefined?ov.location:(r.location||'');
  openModal('routineOverrideModal');
  setTimeout(function(){document.getElementById('routineOverrideTitle').focus();},80);
};
function saveRoutineOverrideModal() {
  var title=document.getElementById('routineOverrideTitle').value.trim();
  if (!title){document.getElementById('routineOverrideTitle').classList.add('error');document.getElementById('routineOverrideTitle').focus();return;}
  document.getElementById('routineOverrideTitle').classList.remove('error');
  var data=getData();
  var key=state.routineOverrideDs+'_'+state.routineOverrideId;
  data.routineOverrides[key]={
    title:title,
    time:document.getElementById('routineOverrideTime').value,
    location:document.getElementById('routineOverrideLocation').value.trim()
  };
  saveRO(data.routineOverrides);
  closeModal('routineOverrideModal');
  refresh(); refreshDashDayModal();
}

window.openEditRoutineItem = function(id) {
  var data=getData(); var r=data.routine.find(function(r){return r.id===id;}); if(!r)return;
  state.editRoutineId=id;
  document.getElementById('routineItemModalTitle').textContent='Edit Routine Task';
  document.getElementById('routineTitle').value=r.title;
  document.getElementById('routineTime').value=r.time||'';
  document.getElementById('routineLocation').value=r.location||'';
  document.querySelectorAll('input[name="rDay"]').forEach(function(cb){cb.checked=r.days.includes(+cb.value);});
  openModal('routineItemModal');
};
window.removeRoutineItem = function(id){ if(confirm('Remove this routine task?')){ deleteRoutineItem(id); renderRoutineList(); refresh(); } };
window.toggleFolderExpand = function(id){ state.expandedFolders[id]=state.expandedFolders[id]===false?true:false; renderNotesSidebar(); };
window.setNoteFolder = function(id){
  state.unlockedFolders={};
  var data=getData();
  var folder=data.folders.find(function(f){return f.id===id;});
  if(folder&&folder.password){
    state.pendingFolderId=id;
    var lbl=document.getElementById('folderPasswordLabel');
    if(lbl)lbl.textContent='Enter password to open "'+escHtml(folder.name)+'"';
    document.getElementById('folderPasswordInput').value='';
    document.getElementById('folderPasswordError').style.display='none';
    openModal('folderPasswordModal');
    setTimeout(function(){document.getElementById('folderPasswordInput').focus();},80);
    return;
  }
  state.activeFolderId=id; renderNotes();
};
window.openEditNote = function(id) {
  var data=getData(); var n=data.notes.find(function(n){return n.id===id;}); if(!n)return;
  state.editNoteId=id; state.selectedNoteColor=n.color||''; state.noteType=n.type;
  document.getElementById('noteModalTitle').textContent='Edit Note';
  document.getElementById('noteTitle').value=n.title||'';
  document.getElementById('notePinned').checked=n.pinned||false;
  setNoteType(n.type);
  document.getElementById('noteContent').innerHTML=n.content||'';
  state.noteCheckItems=(n.items||[]).map(function(i){return {id:uid(),text:i.text,done:i.done};});
  renderCheckItems();
  buildColorPicker('noteColorPicker',n.color||'',function(v){state.selectedNoteColor=v;});
  populateFolderSelect(getNoteFolderIds(n));
  openModal('noteModal');
};
// Save whatever is currently typed in the view modal back to localStorage
function saveNoteViewModal() {
  var id=state.viewingNoteId; if(!id)return;
  var data=getData(); var n=data.notes.find(function(n){return n.id===id;}); if(!n)return;
  n.title=document.getElementById('noteViewTitleInput').value.trim();
  if(n.type==='checklist'){
    n.items=state.viewNoteCheckItems.filter(function(i){return i.text.trim();});
  } else {
    n.content=document.getElementById('noteViewContent').innerHTML;
  }
  n.updatedAt=new Date().toISOString();
  saveN(data.notes);
}

function renderNoteViewChecklist() {
  var el=document.getElementById('noteViewCheckItems'); if(!el)return;
  el.innerHTML=state.viewNoteCheckItems.map(function(item,i){
    return '<div class="note-view-check-row'+(item.done?' is-done':'')+'">' +
      '<input type="checkbox"'+(item.done?' checked':'')+' onchange="nvToggle('+i+')">' +
      '<input type="text" class="note-view-check-input" value="'+escHtml(item.text)+'" placeholder="List item..." oninput="nvUpdate('+i+',this.value)">' +
      '<button class="btn-icon" style="font-size:12px;opacity:0.4" onclick="nvRemove('+i+')">✕</button>' +
      '</div>';
  }).join('');
}
window.nvToggle = function(i){ state.viewNoteCheckItems[i].done=!state.viewNoteCheckItems[i].done; renderNoteViewChecklist(); };
window.nvUpdate = function(i,v){ state.viewNoteCheckItems[i].text=v; };
window.nvRemove = function(i){ state.viewNoteCheckItems.splice(i,1); renderNoteViewChecklist(); };

window.openNoteView = function(id) {
  var data=getData(); var n=data.notes.find(function(n){return n.id===id;}); if(!n)return;
  state.viewingNoteId=id;
  state.viewNoteCheckItems=(n.items||[]).map(function(i){return {id:i.id||uid(),text:i.text,done:!!i.done};});

  // Apply note color to the box
  var box=document.querySelector('#noteViewModal .note-view-box');
  if(box){
    COLORS.forEach(function(c){ if(c.noteCls)box.classList.remove(c.noteCls); });
    var c=colorByValue(n.color); if(c.noteCls)box.classList.add(c.noteCls);
  }

  // Pin button state
  var pinBtn=document.getElementById('noteViewPinBtn');
  if(pinBtn){ pinBtn.style.opacity=n.pinned?'1':'0.4'; pinBtn.title=n.pinned?'Unpin note':'Pin note'; }

  // Title
  document.getElementById('noteViewTitleInput').value=n.title||'';

  // Content
  if(n.type==='checklist'){
    document.getElementById('noteViewTextWrap').style.display='none';
    document.getElementById('noteViewCheckWrap').style.display='';
    renderNoteViewChecklist();
  } else {
    document.getElementById('noteViewTextWrap').style.display='';
    document.getElementById('noteViewCheckWrap').style.display='none';
    var ta=document.getElementById('noteViewContent');
    ta.innerHTML=n.content||'';
  }

  // Folder badges in footer
  var footer=document.getElementById('noteViewFooter');
  var folderIds=getNoteFolderIds(n);
  var badges=folderIds.map(function(fid){
    var f=data.folders.find(function(f){return f.id===fid;}); if(!f)return '';
    var bg=f.color?'background:'+f.color+';':'';
    return '<span class="note-folder-badge" style="'+bg+'">'+escHtml(f.name)+'</span>';
  }).filter(Boolean).join('');
  if(footer){ footer.innerHTML=badges; footer.style.display=badges?'':'none'; }

  openModal('noteViewModal');
  setTimeout(function(){
    if(n.type!=='checklist') document.getElementById('noteViewContent').focus();
    else document.getElementById('noteViewTitleInput').focus();
  },80);
};
window.pinNote       = function(id){ toggleNotePin(id); renderNotes(); };
window.removeNote    = function(id){ if(confirm('Delete this note?')){ deleteNote(id); renderNotes(); } };
window.removeFolder  = function(id){ if(confirm('Delete this folder? Notes inside will be moved to All Notes.')){ deleteFolder(id); renderNotes(); } };
window.openEditFolder = function(id) {
  var data=getData(); var f=data.folders.find(function(f){return f.id===id;}); if(!f)return;
  state.editFolderId=id; state.selectedFolderColor=f.color||'';
  document.getElementById('folderModalTitle').textContent='Edit Folder';
  document.getElementById('saveFolder').textContent='Save Changes';
  document.getElementById('folderName').value=f.name;
  document.getElementById('folderPasswordField').value=f.password||'';
  document.getElementById('folderParentGroup').style.display='';
  var descendants=getFolderDescendants(data.folders,id);
  var sel=document.getElementById('folderParent');
  sel.innerHTML='<option value="">None (top-level)</option>';
  function addFolderOpts(parentId,depth){
    data.folders.filter(function(ff){return (ff.parentId||null)===(parentId||null);}).forEach(function(ff){
      if(descendants.indexOf(ff.id)!==-1)return;
      var opt=document.createElement('option');
      opt.value=ff.id; opt.textContent=' '.repeat(depth*2)+ff.name;
      if(ff.id===(f.parentId||''))opt.selected=true;
      sel.appendChild(opt); addFolderOpts(ff.id,depth+1);
    });
  }
  addFolderOpts(null,0);
  buildColorPicker('folderColorPicker',f.color||'',function(v){state.selectedFolderColor=v;});
  openModal('folderModal');
  setTimeout(function(){document.getElementById('folderName').focus();},80);
};
window.openDayDetail = function(ds) {
  var date=fromDateStr(ds);
  document.getElementById('dayDetailTitle').textContent=date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  var holidays=getHolidaysForDate(ds);
  var events=getEventsForDate(ds); var body=document.getElementById('dayDetailBody');
  if (!events.length&&!holidays.length){ body.innerHTML='<p style="color:#aaa;font-size:14px;padding:8px 0">No events on this day.</p>'; }
  else {
    var holHTML=holidays.map(function(h){
      var icon=h._holType==='jewish'?'✡️':'🇺🇸';
      return '<div class="cal-event-detail-row" style="background:'+(h._holType==='jewish'?'#fefbf0':'#fff5f5')+'">'+
        '<div class="cal-event-detail-title">'+icon+' '+escHtml(h.title)+'</div></div>';
    }).join('');
    body.innerHTML=holHTML+events.map(function(ev){
      var isRec=ev.recurring&&ev.recurring!=='none';
      var recIcon=isRec?'<span class="cal-recurring-icon" title="Recurring: '+escHtml(ev.recurring)+'">🔄</span>':'';
      var delBtns=isRec
        ? '<button class="btn-icon" onclick="delCalEvOcc(\''+ev.id+'\',\''+ds+'\',\'single\')" title="Skip this occurrence">✕</button>'+
          '<button class="btn-icon" onclick="delCalEvOcc(\''+ev.id+'\',\''+ds+'\',\'future\')" title="Delete this & all future" style="font-size:10px">✕✕</button>'
        : '<button class="btn-icon" onclick="removeCalEvent(\''+ev.id+'\')">🗑</button>';
      return '<div class="cal-event-detail-row">'+
        '<div style="display:flex;justify-content:space-between;align-items:flex-start">'+
          '<div>'+
            '<div class="cal-event-detail-title">'+escHtml(ev.title)+recIcon+'</div>'+
            ((ev.time||ev.location)?'<div class="cal-event-detail-meta">'+(ev.time?fmt12(ev.time):'')+(ev.time&&ev.location?' · ':'')+escHtml(ev.location||'')+'</div>':'')+
            (ev.notes?'<div class="cal-event-detail-notes">'+escHtml(ev.notes)+'</div>':'')+
          '</div>'+
          '<div style="display:flex;gap:4px;flex-shrink:0">'+
            '<button class="btn-icon" onclick="openEditCalEvent(\''+ev.id+'\',\''+ds+'\')">✏️</button>'+
            delBtns+
          '</div>'+
        '</div>'+
        '</div>';
    }).join('');
  }
  state.pendingCalDate=ds;
  document.getElementById('addEventOnDay').onclick=function(){ closeModal('dayDetailModal'); openAddCalEvent(ds); };
  openModal('dayDetailModal');
};
// ============================================================
// CALENDAR MONTH PICKER
// ============================================================
var _calPickerYear=new Date().getFullYear();
var MONTH_NAMES=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function openCalMonthPicker(){
  _calPickerYear=state.calYear;
  renderCalMonthPickerGrid();
  var picker=document.getElementById('calMonthPicker');
  picker.style.display='block';
  // Position below the label
  var label=document.getElementById('calMonthLabel');
  var rect=label.getBoundingClientRect();
  picker.style.top=(rect.bottom+6)+'px';
  picker.style.left=rect.left+'px';
}
function closeCalMonthPicker(){document.getElementById('calMonthPicker').style.display='none';}
function renderCalMonthPickerGrid(){
  document.getElementById('calPickerYear').textContent=_calPickerYear;
  var grid=document.getElementById('calPickerMonths');
  grid.innerHTML=MONTH_NAMES.map(function(m,i){
    var active=(_calPickerYear===state.calYear&&i===state.calMonth);
    return '<button class="cal-picker-month-btn'+(active?' active':'')+'" data-month="'+i+'">'+m+'</button>';
  }).join('');
}
window.calPickerSelectMonth=function(month){
  state.calYear=_calPickerYear; state.calMonth=month;
  closeCalMonthPicker(); renderCalendar();
};

// ============================================================
// CROSS-DAY TASK DRAG (7-day view)
// ============================================================
window.dayCardDragOver=function(e,ds){
  if(!_dragTaskInfo||_dragTaskInfo.ds===ds)return;
  var data=getData();
  var isOnetime=(data.tasks[_dragTaskInfo.ds]||[]).some(function(t){return t.id===_dragTaskInfo.id&&!t._rc;});
  if(!isOnetime)return; // block routine tasks
  e.preventDefault(); e.stopPropagation();
  e.dataTransfer.dropEffect='move';
  document.querySelectorAll('.day-card-drop-target').forEach(function(el){el.classList.remove('day-card-drop-target');});
  e.currentTarget.classList.add('day-card-drop-target');
};
window.dayCardDragLeave=function(e){
  if(!e.currentTarget.contains(e.relatedTarget))
    e.currentTarget.classList.remove('day-card-drop-target');
};
window.dayCardDrop=function(e,ds){
  e.preventDefault(); e.stopPropagation();
  document.querySelectorAll('.day-card-drop-target').forEach(function(el){el.classList.remove('day-card-drop-target');});
  if(!_dragTaskInfo||_dragTaskInfo.ds===ds)return;
  var fromDs=_dragTaskInfo.ds; var taskId=_dragTaskInfo.id;
  var data=getData();
  var task=(data.tasks[fromDs]||[]).find(function(t){return t.id===taskId&&!t._rc;});
  if(!task)return; // not found or is routine completion record
  data.tasks[fromDs]=(data.tasks[fromDs]||[]).filter(function(t){return t.id!==taskId;});
  if(!data.tasks[ds])data.tasks[ds]=[];
  data.tasks[ds].push(Object.assign({},task,{id:uid(),done:false}));
  saveT(data.tasks);
  var orderData=JSON.parse(localStorage.getItem('dm_task_order')||'{}');
  delete orderData[fromDs]; delete orderData[ds];
  localStorage.setItem('dm_task_order',JSON.stringify(orderData));
  _dragTaskInfo=null; refresh();
};

// ============================================================
// TASK RIGHT-CLICK CONTEXT MENU
// ============================================================
var _ctxTask=null;
window.taskContextMenu=function(e,ds,id){
  e.preventDefault(); e.stopPropagation();
  _ctxTask={ds:ds,id:id};
  var menu=document.getElementById('taskContextMenu');
  menu.style.display='block';
  var x=Math.min(e.clientX,window.innerWidth-180), y=Math.min(e.clientY,window.innerHeight-80);
  menu.style.left=x+'px'; menu.style.top=y+'px';
};

window.delCalEvOcc = function(id, ds, mode) {
  var data=getData();
  var ev=data.calEvents.find(function(e){return e.id===id;}); if(!ev)return;
  if(mode==='single'){
    if(!ev.exceptions)ev.exceptions=[];
    ev.exceptions.push(ds); saveCE(data.calEvents);
  } else {
    var d=fromDateStr(ds); d.setDate(d.getDate()-1);
    if(d<fromDateStr(ev.date)){ deleteCalEvent(id); }
    else{ ev.recurringUntil=toDateStr(d); saveCE(data.calEvents); }
  }
  closeModal('dayDetailModal'); renderCalendar();
};
function openEditCalEvent(id, ds) {
  var data=getData(); var ev=data.calEvents.find(function(e){return e.id===id;}); if(!ev)return;
  state.editCalEventId=id; state.selectedCalEventColor=ev.color||'';
  state.pendingEditCalDs=ds||ev.date;
  document.getElementById('calEventModalTitle').textContent='Edit Event';
  populateCalEventUI(Object.assign({},ev,{date:ds||ev.date}));
  document.getElementById('calEventAddToDashboard').checked=false;
  closeModal('dayDetailModal');
  openModal('calEventModal');
  setTimeout(function(){document.getElementById('calEventTitle').focus();},80);
}
window.openEditCalEvent = openEditCalEvent;
window.removeCalEvent = function(id){ if(confirm('Delete this event?')){ deleteCalEvent(id); closeModal('dayDetailModal'); renderCalendar(); } };

// Short/Long Term
window.toggleSTItem  = function(list,id){ toggleSimpleItem(list,id); list==='shortterm'?renderShortTerm():renderLongTerm(); };
window.deleteSTItem  = function(list,id){ if(confirm('Delete this item?')){ deleteSimpleItem(list,id); list==='shortterm'?renderShortTerm():renderLongTerm(); } };
window.openMoveToDay = function(list,id){ state.movingItemId=id; state.movingItemList=list; document.getElementById('moveToDayDate').value=toDateStr(new Date()); openModal('moveToDayModal'); };
window.openEditSTItem = function(list,id) {
  var data=getData(); var item=data[list].find(function(i){return i.id===id;}); if(!item)return;
  state.simpleItemContext=list; state.editSimpleItemId=id;
  document.getElementById('simpleItemModalTitle').textContent='Edit Task';
  document.getElementById('simpleItemLabel').textContent='Task';
  document.getElementById('simpleItemText').value=item.title;
  document.getElementById('simpleItemNotes').value=item.notes||'';
  openModal('simpleItemModal');
  setTimeout(function(){document.getElementById('simpleItemText').focus();},80);
};

// Reminders
window.openEditReminder = function(id) {
  var data=getData(); var r=data.reminders.find(function(r){return r.id===id;}); if(!r)return;
  state.editReminderId=id;
  document.getElementById('reminderModalTitle').textContent='Edit Reminder';
  document.getElementById('reminderText').value=r.text;
  document.getElementById('reminderCategory').value=r.category||'';
  openModal('reminderModal');
};
window.deleteRem = function(id){ if(confirm('Delete this reminder?')){ deleteReminder(id); renderReminders(); } };

// Learning
function setLearningSedarUI(seder){
  state.selectedLearningSeder=seder||'';
  document.querySelectorAll('#learningSedarGroup .seder-btn').forEach(function(b){
    b.classList.toggle('active',b.dataset.seder===seder);
  });
}
window.openAddLearningItem = function(day){
  state.learningDay=day; state.editLearningItemId=null;
  document.getElementById('learningItemModalTitle').textContent='Add to '+LEARNING_DAY_LABELS[day];
  document.getElementById('learningSubject').value='';
  document.getElementById('learningTime').value='';
  document.getElementById('learningSource').value='';
  document.getElementById('learningNotes').value='';
  document.getElementById('learningTimeError').style.display='none';
  setLearningSedarUI('');
  // Populate "Also add to" chips (all days except current)
  var alsoHtml=LEARNING_DAYS.filter(function(d){return d!==day;}).map(function(d){
    return '<button type="button" class="seder-btn lrn-also-btn" data-day="'+d+'">'+LEARNING_DAY_LABELS[d].substring(0,3)+'</button>';
  }).join('');
  document.getElementById('learningAlsoDays').innerHTML=alsoHtml;
  document.querySelectorAll('#learningAlsoDays .lrn-also-btn').forEach(function(btn){
    btn.addEventListener('click',function(){btn.classList.toggle('active');});
  });
  document.getElementById('learningAlsoSection').style.display='block';
  openModal('learningItemModal');
  setTimeout(function(){document.getElementById('learningSubject').focus();},80);
};
window.openAddLearningItemInSeder=function(day,seder){
  openAddLearningItem(day);
  setTimeout(function(){setLearningSedarUI(seder);},60);
};
window.openEditLearningItem = function(day,id){
  var data=getData(); var items=data.learning[day]||[]; var item=items.find(function(i){return i.id===id;}); if(!item)return;
  state.learningDay=day; state.editLearningItemId=id;
  document.getElementById('learningItemModalTitle').textContent='Edit '+LEARNING_DAY_LABELS[day];
  document.getElementById('learningSubject').value=item.subject;
  document.getElementById('learningTime').value=item.time||'';
  document.getElementById('learningSource').value=item.source||'';
  document.getElementById('learningNotes').value=item.notes||'';
  document.getElementById('learningTimeError').style.display='none';
  setLearningSedarUI(item.seder||'');
  document.getElementById('learningAlsoSection').style.display='none';
  openModal('learningItemModal');
  setTimeout(function(){document.getElementById('learningSubject').focus();},80);
};
window.deleteLrn = function(day,id){ if(confirm('Remove this entry?')){ deleteLearningItem(day,id); renderLearning(); } };
window.deleteLrnModal=function(day,id){
  if(!confirm('Remove this entry?'))return;
  deleteLearningItem(day,id);
  renderLearningDayModal(day);
  renderLearning();
};
window.toggleLrnNote=function(id){
  var el=document.getElementById('lrn-note-'+id);
  if(el)el.style.display=el.style.display==='none'?'block':'none';
};
window.openLearningCopy=function(day,id){
  state.learningCopyItem={day:day,id:id};
  var html=LEARNING_DAYS.filter(function(d){return d!==day;}).map(function(d){
    return '<button type="button" class="seder-btn lrn-copy-btn" data-day="'+d+'">'+LEARNING_DAY_LABELS[d].substring(0,3)+'</button>';
  }).join('');
  document.getElementById('learningCopyDays').innerHTML=html;
  document.querySelectorAll('#learningCopyDays .lrn-copy-btn').forEach(function(btn){
    btn.addEventListener('click',function(){btn.classList.toggle('active');});
  });
  openModal('learningCopyModal');
};

// Financial — week selection
window.setFinWeek = function(idx) { state.finWeekIdx=idx; renderFinWeekly(); };

// Financial — CRUD globals
window.delFinInc  = function(id){ if(confirm('Delete this income stream?')){ deleteFinInc(id); renderFinancial(); } };
window.delFinExp  = function(id){ if(confirm('Delete this expense?')){ deleteFinExp(id); renderFinancial(); } };
window.delFinBon  = function(id){ if(confirm('Delete this bonus entry?')){ deleteFinBon(id); renderFinancial(); } };
window.delFinWish = function(id){ if(confirm('Delete this wishlist item?')){ deleteFinWish(id); renderFinancial(); } };

window.wishMoveUp = function(id) {
  var data=getData(); normalizeWishOrders(data.finWishlist);
  var item=data.finWishlist.find(function(w){return w.id===id;}); if(!item)return;
  var tier=data.finWishlist.filter(function(w){return w.tier===item.tier;}).sort(function(a,b){return a.order-b.order;});
  var idx=tier.findIndex(function(w){return w.id===id;}); if(idx<=0)return;
  tier[idx].order=idx-1; tier[idx-1].order=idx; saveFinWish(data.finWishlist); renderFinancial();
};
window.wishMoveDown = function(id) {
  var data=getData(); normalizeWishOrders(data.finWishlist);
  var item=data.finWishlist.find(function(w){return w.id===id;}); if(!item)return;
  var tier=data.finWishlist.filter(function(w){return w.tier===item.tier;}).sort(function(a,b){return a.order-b.order;});
  var idx=tier.findIndex(function(w){return w.id===id;}); if(idx>=tier.length-1)return;
  tier[idx].order=idx+1; tier[idx+1].order=idx; saveFinWish(data.finWishlist); renderFinancial();
};

window.saveFinPointsBalance = function() {
  var v=parseInt(document.getElementById('finPointsInput').value)||0;
  saveFinPts(v); renderFinancial();
};

// Expense modal open
window.openAddFinExp = function(prefillTier) {
  state.editFinExpId=null;
  document.getElementById('finExpModalTitle').textContent='Add Expense';
  document.getElementById('finExpName').value='';
  document.querySelectorAll('#finExpAmtToggle .fin-amt-btn').forEach(function(b,i){b.classList.toggle('active',i===0);});
  document.getElementById('finExpAmtFixed').style.display='';
  document.getElementById('finExpAmtRange').style.display='none';
  document.getElementById('finExpAmtSingle').value='';
  document.getElementById('finExpAmtLow').value=''; document.getElementById('finExpAmtHigh').value='';
  document.getElementById('finExpTag').value='Need';
  document.getElementById('finExpFreq').value='weekly';
  document.getElementById('finExpWeeksRow').style.display='none';
  document.querySelectorAll('#finExpWeeksRow .fin-wk-check').forEach(function(c){c.checked=false;});
  document.getElementById('finExpNotes').value='';
  openModal('finExpModal'); setTimeout(function(){document.getElementById('finExpName').focus();},80);
};
window.openEditFinExp = function(id) {
  var data=getData(); var item=data.finExpenses.find(function(x){return x.id===id;}); if(!item)return;
  state.editFinExpId=id;
  document.getElementById('finExpModalTitle').textContent='Edit Expense';
  document.getElementById('finExpName').value=item.name;
  var isRange=(parseFloat(item.amountHigh)||0)>(parseFloat(item.amountLow)||0);
  document.querySelectorAll('#finExpAmtToggle .fin-amt-btn').forEach(function(b){b.classList.toggle('active',isRange?b.dataset.type==='range':b.dataset.type==='fixed');});
  document.getElementById('finExpAmtFixed').style.display=isRange?'none':'';
  document.getElementById('finExpAmtRange').style.display=isRange?'':'none';
  if(isRange){document.getElementById('finExpAmtLow').value=item.amountLow||'';document.getElementById('finExpAmtHigh').value=item.amountHigh||'';}
  else document.getElementById('finExpAmtSingle').value=item.amountLow||'';
  document.getElementById('finExpTag').value=item.tag||'Need';
  document.getElementById('finExpFreq').value=item.frequency||'weekly';
  var sw=item.frequency!=='weekly';
  document.getElementById('finExpWeeksRow').style.display=sw?'':'none';
  document.querySelectorAll('#finExpWeeksRow .fin-wk-check').forEach(function(c){c.checked=(item.weeks||[]).indexOf(parseInt(c.value))!==-1;});
  document.getElementById('finExpNotes').value=item.notes||'';
  openModal('finExpModal'); setTimeout(function(){document.getElementById('finExpName').focus();},80);
};

// Income modal open
window.openAddFinInc = function() {
  state.editFinIncId=null;
  document.getElementById('finIncModalTitle').textContent='Add Income Stream';
  document.getElementById('finIncName').value='';
  document.querySelectorAll('#finIncAmtToggle .fin-amt-btn').forEach(function(b,i){b.classList.toggle('active',i===0);});
  document.getElementById('finIncAmtFixed').style.display='';
  document.getElementById('finIncAmtRange').style.display='none';
  document.getElementById('finIncAmtSingle').value='';
  document.getElementById('finIncAmtLow').value=''; document.getElementById('finIncAmtHigh').value='';
  document.getElementById('finIncFreq').value='weekly';
  document.getElementById('finIncWeeksRow').style.display='none';
  document.querySelectorAll('#finIncWeeksRow .fin-wk-check').forEach(function(c){c.checked=false;});
  document.getElementById('finIncNotes').value='';
  openModal('finIncModal'); setTimeout(function(){document.getElementById('finIncName').focus();},80);
};
window.openEditFinInc = function(id) {
  var data=getData(); var item=data.finIncome.find(function(x){return x.id===id;}); if(!item)return;
  state.editFinIncId=id;
  document.getElementById('finIncModalTitle').textContent='Edit Income Stream';
  document.getElementById('finIncName').value=item.name;
  var isVar=(parseFloat(item.amountHigh)||0)>(parseFloat(item.amountLow)||0);
  document.querySelectorAll('#finIncAmtToggle .fin-amt-btn').forEach(function(b){b.classList.toggle('active',isVar?b.dataset.type==='variable':b.dataset.type==='fixed');});
  document.getElementById('finIncAmtFixed').style.display=isVar?'none':'';
  document.getElementById('finIncAmtRange').style.display=isVar?'':'none';
  if(isVar){document.getElementById('finIncAmtLow').value=item.amountLow||'';document.getElementById('finIncAmtHigh').value=item.amountHigh||'';}
  else document.getElementById('finIncAmtSingle').value=item.amountLow||'';
  document.getElementById('finIncFreq').value=item.frequency||'weekly';
  var sw=item.frequency!=='weekly';
  document.getElementById('finIncWeeksRow').style.display=sw?'':'none';
  document.querySelectorAll('#finIncWeeksRow .fin-wk-check').forEach(function(c){c.checked=(item.weeks||[]).indexOf(parseInt(c.value))!==-1;});
  document.getElementById('finIncNotes').value=item.notes||'';
  openModal('finIncModal'); setTimeout(function(){document.getElementById('finIncName').focus();},80);
};

// Bonus modal open
window.openAddFinBon = function() {
  state.editFinBonId=null;
  document.getElementById('finBonModalTitle').textContent='Add Bonus';
  document.getElementById('finBonName').value='';
  document.getElementById('finBonAmtLow').value=''; document.getElementById('finBonAmtHigh').value='';
  document.getElementById('finBonStatus').value='Pending';
  document.getElementById('finBonNotes').value='';
  openModal('finBonModal'); setTimeout(function(){document.getElementById('finBonName').focus();},80);
};
window.openEditFinBon = function(id) {
  var data=getData(); var item=data.finBonuses.find(function(x){return x.id===id;}); if(!item)return;
  state.editFinBonId=id;
  document.getElementById('finBonModalTitle').textContent='Edit Bonus';
  document.getElementById('finBonName').value=item.name;
  document.getElementById('finBonAmtLow').value=item.amountLow||'';
  document.getElementById('finBonAmtHigh').value=item.amountHigh||item.amountLow||'';
  document.getElementById('finBonStatus').value=item.status||'Pending';
  document.getElementById('finBonNotes').value=item.notes||'';
  openModal('finBonModal'); setTimeout(function(){document.getElementById('finBonName').focus();},80);
};

// Wishlist modal open
window.openAddFinWish = function(tier) {
  state.editFinWishId=null;
  document.getElementById('finWishModalTitle').textContent='Add Wishlist Item';
  document.getElementById('finWishName').value='';
  document.getElementById('finWishCost').value='';
  document.getElementById('finWishTier').value=tier||'really-want';
  document.getElementById('finWishETA').value='';
  document.getElementById('finWishNotes').value='';
  openModal('finWishModal'); setTimeout(function(){document.getElementById('finWishName').focus();},80);
};
window.openEditFinWish = function(id) {
  var data=getData(); var item=data.finWishlist.find(function(x){return x.id===id;}); if(!item)return;
  state.editFinWishId=id;
  document.getElementById('finWishModalTitle').textContent='Edit Wishlist Item';
  document.getElementById('finWishName').value=item.name;
  document.getElementById('finWishCost').value=item.cost||'';
  document.getElementById('finWishTier').value=item.tier||'want';
  document.getElementById('finWishETA').value=item.eta||'';
  document.getElementById('finWishNotes').value=item.notes||'';
  openModal('finWishModal'); setTimeout(function(){document.getElementById('finWishName').focus();},80);
};

window.delMM   = function(id){ if(confirm('Delete this idea?')){ deleteMoneyIdea(id); renderFinancial(); } };
window.openEditMoneyIdea = function(id) {
  var data=getData(); var item=data.moneymaking.find(function(i){return i.id===id;}); if(!item)return;
  state.editMoneyIdeaId=id;
  document.getElementById('moneyIdeaModalTitle').textContent='Edit Idea';
  document.getElementById('moneyIdeaName').value=item.idea;
  document.getElementById('moneyIdeaStatus').value=item.status;
  document.getElementById('moneyIdeaNotes').value=item.notes||'';
  openModal('moneyIdeaModal');
};

// ============================================================
// MODALS
// ============================================================
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function saveTaskModal() {
  var title=document.getElementById('taskTitle').value.trim();
  if (!title){ document.getElementById('taskTitle').classList.add('error'); document.getElementById('taskTitle').focus(); return; }
  document.getElementById('taskTitle').classList.remove('error');
  var d={title:title,time:document.getElementById('taskTime').value,location:document.getElementById('taskLocation').value.trim(),notes:document.getElementById('taskNotes').value.trim(),reminder:document.getElementById('taskReminder').value,color:state.selectedTaskColor,priority:state.selectedTaskPriority,linkedNoteIds:state.taskModalLinkedNotes.slice()};
  var addToCal=document.getElementById('taskAddToCalendar').checked;
  state.editTaskId ? updateTask(state.editTaskDate,state.editTaskId,d) : addTask(state.editTaskDate,d);
  if (addToCal) addCalEvent({title:d.title,date:state.editTaskDate,time:d.time,color:d.color});
  // If this task was moved from Future tab, delete the source item
  if(state.movingFromFutureId){
    deleteSimpleItem(state.movingFromFutureList,state.movingFromFutureId);
    var movedList=state.movingFromFutureList;
    state.movingFromFutureId=null; state.movingFromFutureList=null;
    movedList==='shortterm'?renderShortTerm():renderLongTerm();
  }
  closeModal('taskModal'); refresh(); refreshDashDayModal();
}

function renderRoutineList() {
  var data=getData(); var el=document.getElementById('routineList');
  if (!data.routine.length){ el.innerHTML='<p style="color:#aaa;font-size:14px">No routine tasks yet.</p>'; return; }
  var dn=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  el.innerHTML=data.routine.map(function(r){
    var days=r.days.length===7?'Every day':r.days.map(function(d){return dn[d];}).join(', ');
    var meta=[days,r.time?fmt12(r.time):'',r.location].filter(Boolean).join(' · ');
    return '<div class="routine-row"><div><div class="routine-row-title">'+escHtml(r.title)+'</div><div class="routine-row-meta">'+escHtml(meta)+'</div></div>'+
      '<div class="routine-row-actions"><button class="btn-icon" onclick="openEditRoutineItem(\''+r.id+'\')">✏️</button>'+
      '<button class="btn-icon" onclick="removeRoutineItem(\''+r.id+'\')">🗑</button></div></div>';
  }).join('');
}

function saveRoutineModal() {
  var title=document.getElementById('routineTitle').value.trim();
  if (!title){ document.getElementById('routineTitle').classList.add('error'); document.getElementById('routineTitle').focus(); return; }
  document.getElementById('routineTitle').classList.remove('error');
  var days=Array.from(document.querySelectorAll('input[name="rDay"]:checked')).map(function(cb){return +cb.value;});
  var d={title:title,time:document.getElementById('routineTime').value,location:document.getElementById('routineLocation').value.trim(),days:days};
  state.editRoutineId?updateRoutineItem(state.editRoutineId,d):addRoutineItem(d);
  state.editRoutineId=null; closeModal('routineItemModal'); renderRoutineList(); refresh();
}

function openAddCalEvent(ds) {
  state.editCalEventId=null; state.selectedCalEventColor='';
  document.getElementById('calEventModalTitle').textContent='Add Event';
  populateCalEventUI({title:'',date:ds||toDateStr(new Date()),time:'',location:'',notes:'',recurring:'none',reminders:[]});
  document.getElementById('calEventAddToDashboard').checked=false;
  openModal('calEventModal');
  setTimeout(function(){document.getElementById('calEventTitle').focus();},80);
}
function saveCalEventModal() {
  var title=document.getElementById('calEventTitle').value.trim();
  if(!title){document.getElementById('calEventTitle').classList.add('error');document.getElementById('calEventTitle').focus();return;}
  document.getElementById('calEventTitle').classList.remove('error');
  var recur=getRecurFromUI();
  var d={
    title:title,
    date:document.getElementById('calEventDate').value,
    time:document.getElementById('calEventTime').value,
    location:document.getElementById('calEventLocation').value.trim(),
    notes:document.getElementById('calEventNotes').value.trim(),
    color:state.selectedCalEventColor,
    recurring:recur.recurring,
    recurringN:recur.recurringN,
    recurringUnit:recur.recurringUnit,
    recurringUntil:recur.recurringUntil,
    reminders:getRemindersFromUI()
  };
  if(state.editCalEventId){
    var data=getData();
    var ev=data.calEvents.find(function(e){return e.id===state.editCalEventId;});
    // Guard: preserve original date if field was cleared
    if(!d.date&&ev)d.date=ev.date||d.date;
    var isRec=ev&&ev.recurring&&ev.recurring!=='none';
    if(isRec){
      state.pendingEditCalData=d;
      closeModal('calEventModal');
      openModal('editCalScopeModal');
      return;
    }
    updateCalEvent(state.editCalEventId,d);
    // Navigate to the new date's month so the user can see it
    if(d.date){var nd=fromDateStr(d.date);state.calYear=nd.getFullYear();state.calMonth=nd.getMonth();}
  } else {
    addCalEvent(d);
    if(d.date){var nd2=fromDateStr(d.date);state.calYear=nd2.getFullYear();state.calMonth=nd2.getMonth();}
  }
  if(document.getElementById('calEventAddToDashboard').checked&&d.date) addTask(d.date,{title:d.title,time:d.time,color:d.color});
  closeModal('calEventModal'); renderCalendar();
}

window.executeEditCalEvent = function(scope) {
  var id=state.editCalEventId; var d=state.pendingEditCalData; var ds=state.pendingEditCalDs;
  if(!id||!d)return;
  var data=getData();
  var ev=data.calEvents.find(function(e){return e.id===id;}); if(!ev)return;
  if(scope==='single'){
    if(!ev.exceptions)ev.exceptions=[];
    if(ev.exceptions.indexOf(ds)===-1)ev.exceptions.push(ds);
    var newDate=d.date||ds;
    if(newDate!==ds){
      // Date changed — can't use override (it's pinned to original occurrence date).
      // Create a brand-new standalone event on the new date instead.
      saveCE(data.calEvents); // save exceptions update first
      addCalEvent({title:d.title,date:newDate,time:d.time||'',location:d.location||'',notes:d.notes||'',color:d.color||'',recurring:'none',recurringN:null,recurringUnit:null,recurringUntil:null,reminders:d.reminders||[]});
      if(newDate){var nd3=fromDateStr(newDate);state.calYear=nd3.getFullYear();state.calMonth=nd3.getMonth();}
    } else {
      // Date unchanged — use override so title/time/notes edits apply to this occurrence only
      data.calEvents.push({
        id:uid(),_overrideFor:id,_overrideDate:ds,
        title:d.title,date:ds,time:d.time||'',location:d.location||'',
        notes:d.notes||'',color:d.color||'',recurring:'none',
        recurringN:null,recurringUnit:null,recurringUntil:null,
        exceptions:[],reminders:d.reminders||[]
      });
      saveCE(data.calEvents);
    }
  } else {
    var prevD=fromDateStr(ds); prevD.setDate(prevD.getDate()-1);
    var prevDs=toDateStr(prevD);
    if(prevDs<ev.date){
      deleteCalEvent(id);
    } else {
      ev.recurringUntil=prevDs;
      ev.exceptions=(ev.exceptions||[]).filter(function(x){return x<ds;});
      saveCE(data.calEvents);
    }
    var updated=getData().calEvents.filter(function(e){
      return !(e._overrideFor===id&&e._overrideDate>=ds);
    });
    saveCE(updated);
    addCalEvent(Object.assign({},d,{date:ds}));
  }
  state.pendingEditCalData=null; state.pendingEditCalDs=null;
  closeModal('editCalScopeModal'); renderCalendar();
};

function setNoteType(type) {
  state.noteType=type;
  document.getElementById('noteTypeText').classList.toggle('active',type==='text');
  document.getElementById('noteTypeCheck').classList.toggle('active',type==='checklist');
  document.getElementById('noteTextArea').style.display=type==='text'?'':'none';
  document.getElementById('noteCheckArea').style.display=type==='checklist'?'':'none';
}
function renderCheckItems() {
  document.getElementById('noteCheckItems').innerHTML=state.noteCheckItems.map(function(item,i){
    return '<div class="check-input-row">'+'<input type="checkbox"'+(item.done?' checked':'')+' onchange="toggleCheckItem('+i+')">'+'<input type="text" value="'+escHtml(item.text)+'" placeholder="List item..." oninput="updateCheckItem('+i+', this.value)">'+'<button class="btn-icon" onclick="removeCheckItem('+i+')">✕</button></div>';
  }).join('');
}
window.toggleCheckItem = function(i){ state.noteCheckItems[i].done=!state.noteCheckItems[i].done; renderCheckItems(); };
window.updateCheckItem = function(i,v){ state.noteCheckItems[i].text=v; };
window.removeCheckItem = function(i){ state.noteCheckItems.splice(i,1); renderCheckItems(); };

function populateFolderSelect(selectedIds) {
  var ids=Array.isArray(selectedIds)?selectedIds:(selectedIds?[selectedIds]:[]);
  var data=getData(); var container=document.getElementById('noteFolderSelect'); if(!container)return;
  function buildOpts(parentId, depth){
    return data.folders.filter(function(f){return (f.parentId||null)===(parentId||null);}).map(function(f){
      var checked=ids.indexOf(f.id)!==-1;
      return '<label class="folder-pick-row" style="padding-left:'+(8+depth*14)+'px">'+
        '<input type="checkbox" class="folder-pick-chk" data-fid="'+f.id+'"'+(checked?' checked':'')+'>'+
        (f.color?'<span class="folder-color-dot" style="background:'+f.color+';margin-right:4px"></span>':'')+
        '<span>'+escHtml(f.name)+'</span></label>'+
        buildOpts(f.id,depth+1);
    }).join('');
  }
  container.innerHTML=buildOpts(null,0)||'<div style="color:#aaa;font-size:12px;padding:4px 0">No folders yet</div>';
}
function openNoteModal() {
  state.editNoteId=null; state.selectedNoteColor=''; state.noteType='text'; state.noteCheckItems=[];
  var initFolder=(state.activeFolderId!=='all'&&state.activeFolderId!=='pinned')?state.activeFolderId:'';
  document.getElementById('noteModalTitle').textContent='New Note';
  document.getElementById('noteTitle').value=''; document.getElementById('noteContent').innerHTML=''; document.getElementById('notePinned').checked=false;
  setNoteType('text'); renderCheckItems();
  buildColorPicker('noteColorPicker','',function(v){state.selectedNoteColor=v;});
  populateFolderSelect(initFolder);
  openModal('noteModal'); setTimeout(function(){document.getElementById('noteTitle').focus();},80);
}
function saveNoteModal() {
  var rawNC=document.getElementById('noteContent').innerHTML;
  var content=state.noteType==='text'?(rawNC==='<br>'?'':rawNC):'';
  var title=document.getElementById('noteTitle').value.trim();
  if (!title&&!content&&!state.noteCheckItems.length){ document.getElementById('noteTitle').classList.add('error'); return; }
  document.getElementById('noteTitle').classList.remove('error');
  var folderIds=[]; document.querySelectorAll('#noteFolderSelect .folder-pick-chk:checked').forEach(function(el){folderIds.push(el.dataset.fid);});
  var d={type:state.noteType,title:title,content:content,items:state.noteType==='checklist'?state.noteCheckItems.filter(function(i){return i.text.trim();}):[], folderIds:folderIds,color:state.selectedNoteColor,pinned:document.getElementById('notePinned').checked};
  state.editNoteId?updateNote(state.editNoteId,d):addNote(d);
  state.editNoteId=null; closeModal('noteModal'); renderNotes();
}
function openFolderModal() {
  state.editFolderId=null; state.selectedFolderColor='';
  var data=getData();
  document.getElementById('folderModalTitle').textContent='New Folder';
  document.getElementById('saveFolder').textContent='Create Folder';
  document.getElementById('folderName').value='';
  document.getElementById('folderPasswordField').value='';
  document.getElementById('folderParentGroup').style.display='';
  var sel=document.getElementById('folderParent'); sel.innerHTML='<option value="">None (top-level)</option>';
  function addOpts(parentId,depth){
    data.folders.filter(function(f){return (f.parentId||null)===(parentId||null);}).forEach(function(f){
      var opt=document.createElement('option'); opt.value=f.id; opt.textContent=' '.repeat(depth*2)+f.name; sel.appendChild(opt); addOpts(f.id,depth+1);
    });
  }
  addOpts(null,0);
  buildColorPicker('folderColorPicker','',function(v){state.selectedFolderColor=v;});
  openModal('folderModal'); setTimeout(function(){document.getElementById('folderName').focus();},80);
}
function saveFolderModal() {
  var name=document.getElementById('folderName').value.trim();
  if (!name){ document.getElementById('folderName').classList.add('error'); return; }
  document.getElementById('folderName').classList.remove('error');
  var pw=document.getElementById('folderPasswordField').value.trim();
  if (state.editFolderId) {
    var parentVal=document.getElementById('folderParent').value||null;
    updateFolder(state.editFolderId,name,state.selectedFolderColor,parentVal,pw);
    state.editFolderId=null;
  } else {
    addFolder(name,document.getElementById('folderParent').value||null,state.selectedFolderColor,pw);
  }
  closeModal('folderModal'); renderNotes();
}

// ============================================================
// SWIPE (iPhone)
// ============================================================
function initSwipe() {
  var startX=0; var el=document.getElementById('singleDayView');
  el.addEventListener('touchstart',function(e){startX=e.touches[0].clientX;},{passive:true});
  el.addEventListener('touchend',function(e){ var diff=startX-e.changedTouches[0].clientX; if(Math.abs(diff)>60){state.dayOffset+=diff>0?1:-1;renderSingle();} },{passive:true});
}

// ============================================================
// WEIGHT TRACKER WINDOW FUNCTIONS
// ============================================================
window.logWeight = function(){
  var input=document.getElementById('wtTodayInput'); if(!input)return;
  var val=parseFloat(input.value);
  if(!val||val<50||val>600){input.classList.add('error');input.focus();return;}
  input.classList.remove('error');
  var data=getData(); var todayDs=toDateStr(new Date());
  data.weightEntries[todayDs]=val;
  localStorage.setItem('dm_weight_entries',JSON.stringify(data.weightEntries));
  renderWeightTracker();
};
window.openWeightGoalModal=function(){
  var data=getData();
  document.getElementById('wtGoalInput').value=data.weightGoal||'';
  openModal('weightGoalModal');
  setTimeout(function(){document.getElementById('wtGoalInput').focus();},80);
};
window.saveWeightGoal=function(){
  var raw=document.getElementById('wtGoalInput').value.trim();
  var val=parseFloat(raw);
  if(raw===''){ localStorage.removeItem('dm_weight_goal'); }
  else if(val>=50&&val<=600){ localStorage.setItem('dm_weight_goal',JSON.stringify(val)); }
  closeModal('weightGoalModal'); renderWeightTracker();
};
window.openWeightHistory=function(){
  var data=getData(); var history=data.weightHistory||[];
  var el=document.getElementById('wtHistoryContent'); if(!el)return;
  if(!history.length){
    el.innerHTML='<div style="color:#aaa;font-size:13px;padding:16px 0;text-align:center">No past weeks yet. History builds automatically each Sunday.</div>';
  } else {
    var dayLabels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    el.innerHTML=history.map(function(week,wi){
      var weekDays=getWeekDays(week.weekStart);
      var sun=fromDateStr(week.weekStart); var sat=new Date(sun); sat.setDate(sun.getDate()+6);
      var lbl=sun.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' – '+sat.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      var s=week.stats;
      var csign=s&&s.change>0?'+':'';
      var statsStr=s?s.start.toFixed(1)+' → '+s.current.toFixed(1)+' lbs ('+csign+s.change.toFixed(1)+')':'';
      var dailyRows=weekDays.map(function(ds,i){
        var w=week.entries[ds];
        return w?'<div class="wt-hist-day"><span>'+dayLabels[i]+'</span><span>'+parseFloat(w).toFixed(1)+' lbs</span></div>':'';
      }).filter(Boolean).join('');
      return'<div class="wt-hist-week">'+
        '<div class="wt-hist-week-hdr" onclick="toggleWtHistWeek('+wi+')">'+
          '<span class="wt-hist-week-label">'+lbl+'</span>'+
          (statsStr?'<span class="wt-hist-week-stats">'+statsStr+'</span>':'')+
          '<span class="wt-hist-week-arrow" id="wt-hist-arrow-'+wi+'">▾</span>'+
        '</div>'+
        '<div class="wt-hist-week-body" id="wt-hist-body-'+wi+'">'+
          (s?'<div class="wt-hist-stats-row"><span>Avg: '+s.avg.toFixed(1)+'</span><span>Low: '+s.min.toFixed(1)+'</span><span>High: '+s.max.toFixed(1)+'</span></div>':'')+
          dailyRows+
          renderWeightSparkline(week.entries,weekDays)+
        '</div>'+
      '</div>';
    }).join('');
  }
  openModal('weightHistoryModal');
};
window.startEditWeightDay=function(ds){
  var row=document.getElementById('wtr-'+ds); if(!row)return;
  var data=getData(); var cur=data.weightEntries[ds]||'';
  row.innerHTML=
    '<span class="wt-day-label" style="flex-shrink:0">'+row.querySelector('.wt-day-label').innerHTML+'</span>'+
    '<div style="display:flex;gap:6px;align-items:center;flex:1;justify-content:flex-end">'+
      '<input type="number" class="field wt-inline-input" id="wt-edit-'+ds+'" value="'+cur+'" step="0.1" min="50" max="600" style="width:90px;padding:4px 8px;font-size:13px">'+
      '<button class="btn-primary" style="font-size:12px;padding:4px 10px" onclick="saveWeightDay(\''+ds+'\')">✓</button>'+
      '<button class="btn-cancel" style="font-size:12px;padding:4px 10px" onclick="renderWeightTracker()">✕</button>'+
    '</div>';
  var inp=document.getElementById('wt-edit-'+ds); if(inp){inp.focus();inp.select();}
  inp.addEventListener('keydown',function(e){if(e.key==='Enter')saveWeightDay(ds);if(e.key==='Escape')renderWeightTracker();});
};
window.saveWeightDay=function(ds){
  var inp=document.getElementById('wt-edit-'+ds); if(!inp)return;
  var val=parseFloat(inp.value);
  if(!val||val<50||val>600){inp.classList.add('error');inp.focus();return;}
  var data=getData();
  data.weightEntries[ds]=val;
  localStorage.setItem('dm_weight_entries',JSON.stringify(data.weightEntries));
  renderWeightTracker();
};
window.deleteWeightDay=function(ds){
  var data=getData();
  delete data.weightEntries[ds];
  localStorage.setItem('dm_weight_entries',JSON.stringify(data.weightEntries));
  renderWeightTracker();
};
window.toggleWtHistWeek=function(wi){
  var body=document.getElementById('wt-hist-body-'+wi);
  var arrow=document.getElementById('wt-hist-arrow-'+wi);
  if(!body)return;
  var isOpen=body.style.display!=='none';
  body.style.display=isOpen?'none':'';
  if(arrow)arrow.textContent=isOpen?'▸':'▾';
};

// ============================================================
// EVENT LISTENERS
// ============================================================
function initListeners() {
  // Page navigation
  document.querySelectorAll('.header-nav-tab').forEach(function(tab){ tab.addEventListener('click',function(){showPage(tab.dataset.page);}); });

  // Dashboard sub-nav pills
  document.getElementById('pillDay').addEventListener('click',       function(){ setDashView('single'); });
  document.getElementById('pillSeven').addEventListener('click',     function(){ setDashView('seven'); });
  document.getElementById('pillRoutine').addEventListener('click',   function(){ renderRoutineList(); openModal('routineModal'); });
  document.getElementById('pillFuture').addEventListener('click',   function(){ setDashView('future'); });
  document.getElementById('pillCheshbon').addEventListener('click', function(){ setDashView('cheshbon'); });
  document.getElementById('pillHealth').addEventListener('click',   function(){ setDashView('health'); });
  document.getElementById('pillReminders').addEventListener('click', function(){ setDashView('reminders'); });

  // Date jump
  document.getElementById('dateJumpInput').addEventListener('change', function(e){
    var val=e.target.value; if(!val)return;
    var today=new Date(); today.setHours(0,0,0,0);
    var target=fromDateStr(val); target.setHours(0,0,0,0);
    state.dayOffset=Math.round((target-today)/(1000*60*60*24));
    setDashView('single');
  });

  // Single day nav
  document.getElementById('closeMissedTasksModal').addEventListener('click', function(){ closeModal('missedTasksModal'); });
  document.getElementById('prevDayBtn').addEventListener('click',     function(){ state.dayOffset--; renderSingle(); });
  document.getElementById('nextDayBtn').addEventListener('click',     function(){ state.dayOffset++; renderSingle(); });
  document.getElementById('backToTodayBtn').addEventListener('click', function(){ state.dayOffset=0; renderSingle(); });

  // 7-day nav — no Math.max restriction, allow going into past
  document.getElementById('prevWeekBtn').addEventListener('click',        function(){ state.weekStart-=7; renderSeven(); });
  document.getElementById('prevDayBtn7').addEventListener('click',        function(){ state.weekStart--;  renderSeven(); });
  document.getElementById('backToTodayWeekBtn').addEventListener('click', function(){ state.weekStart=0;  renderSeven(); });
  document.getElementById('nextDayBtn7').addEventListener('click',        function(){ state.weekStart++;  renderSeven(); });
  document.getElementById('nextWeekBtn').addEventListener('click',        function(){ state.weekStart+=7; renderSeven(); });

  // Dash day modal
  document.getElementById('closeDashDayModal').addEventListener('click', function(){ state.dashDayModalDs=null; closeModal('dashDayModal'); });

  // Move day modal
  document.getElementById('closeMoveDayModal').addEventListener('click', function(){ closeModal('moveDayModal'); });
  document.getElementById('moveDayPickerBtn').addEventListener('click', function(){
    var v=document.getElementById('moveDayCustomPicker').value; if(!v)return;
    executeMoveTask(state.moveTaskDs, state.moveTaskId, state.moveTaskIsR, v);
  });

  // Task notes link modal
  document.getElementById('closeTaskNotesLinkModal').addEventListener('click', function(){ closeModal('taskNotesLinkModal'); });
  document.getElementById('cancelTaskNotesLink').addEventListener('click',     function(){ closeModal('taskNotesLinkModal'); });
  document.getElementById('saveTaskNotesLink').addEventListener('click', saveTaskNotesLink);

  // Task modal note picker — event delegation for checkbox changes
  document.getElementById('taskModalNotePickerWrap').addEventListener('change', function(e){
    if(!e.target.classList.contains('note-pick-chk'))return;
    var nid=e.target.dataset.nid;
    if(e.target.checked){if(state.taskModalLinkedNotes.indexOf(nid)===-1)state.taskModalLinkedNotes.push(nid);}
    else{state.taskModalLinkedNotes=state.taskModalLinkedNotes.filter(function(id){return id!==nid;});}
    renderTaskModalLinkedDisplay();
  });

  // Task modal
  document.getElementById('closeTaskModal').addEventListener('click', function(){ closeModal('taskModal'); });
  document.getElementById('cancelTask').addEventListener('click',     function(){ closeModal('taskModal'); });
  document.getElementById('saveTask').addEventListener('click', saveTaskModal);
  document.getElementById('taskTitle').addEventListener('keydown', function(e){ if(e.key==='Enter')saveTaskModal(); });
  // Priority picker
  document.querySelectorAll('.priority-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.priority-btn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active'); state.selectedTaskPriority=btn.dataset.priority;
    });
  });

  // Routine override modal
  document.getElementById('closeRoutineOverrideModal').addEventListener('click', function(){ closeModal('routineOverrideModal'); });
  document.getElementById('cancelRoutineOverride').addEventListener('click',     function(){ closeModal('routineOverrideModal'); });
  document.getElementById('saveRoutineOverride').addEventListener('click', saveRoutineOverrideModal);
  document.getElementById('skipRoutineDay').addEventListener('click', function(){
    if(!confirm('Skip "'+document.getElementById('routineOverrideTitle').value+'" for this day only?'))return;
    var data=getData();
    var key=state.routineOverrideDs+'_'+state.routineOverrideId;
    data.routineOverrides[key]={skipped:true};
    saveRO(data.routineOverrides);
    closeModal('routineOverrideModal');
    refresh(); refreshDashDayModal();
  });

  // Routine modals
  document.getElementById('closeRoutineModal').addEventListener('click',     function(){ closeModal('routineModal'); });
  document.getElementById('closeRoutineItemModal').addEventListener('click', function(){ closeModal('routineItemModal'); });
  document.getElementById('cancelRoutineItem').addEventListener('click',     function(){ closeModal('routineItemModal'); });
  document.getElementById('saveRoutineItem').addEventListener('click', saveRoutineModal);
  document.getElementById('addRoutineItemBtn').addEventListener('click', function(){
    state.editRoutineId=null;
    document.getElementById('routineItemModalTitle').textContent='Add Routine Task';
    document.getElementById('routineTitle').value=''; document.getElementById('routineTime').value=''; document.getElementById('routineLocation').value='';
    document.querySelectorAll('input[name="rDay"]').forEach(function(cb){cb.checked=false;});
    openModal('routineItemModal');
  });

  // Zmanim
  document.getElementById('closeZmanimModal').addEventListener('click', function(){ closeModal('zmanimModal'); });

  // Short/Long Term
  function openAddSTModal(list, label) {
    state.simpleItemContext=list; state.editSimpleItemId=null;
    document.getElementById('simpleItemModalTitle').textContent='Add Task';
    document.getElementById('simpleItemLabel').textContent=label||'Task';
    document.getElementById('simpleItemText').value='';
    document.getElementById('simpleItemNotes').value='';
    openModal('simpleItemModal');
    setTimeout(function(){document.getElementById('simpleItemText').focus();},80);
  }
  document.getElementById('addShortTermBtn').addEventListener('click', function(){ openAddSTModal('shortterm','Task'); });
  document.getElementById('addLongTermBtn').addEventListener('click',  function(){ openAddSTModal('longterm','Task'); });
  document.getElementById('closeSimpleItemModal').addEventListener('click', function(){ closeModal('simpleItemModal'); });
  document.getElementById('cancelSimpleItem').addEventListener('click',     function(){ closeModal('simpleItemModal'); });
  document.getElementById('saveSimpleItem').addEventListener('click', function(){
    var text=document.getElementById('simpleItemText').value.trim();
    var notes=document.getElementById('simpleItemNotes').value.trim();
    if (!text){ document.getElementById('simpleItemText').classList.add('error'); return; }
    document.getElementById('simpleItemText').classList.remove('error');
    if (state.editSimpleItemId) {
      updateSimpleItem(state.simpleItemContext,state.editSimpleItemId,text,notes);
      state.editSimpleItemId=null;
    } else {
      addSimpleItem(state.simpleItemContext,text,notes);
    }
    closeModal('simpleItemModal');
    state.simpleItemContext==='shortterm'?renderShortTerm():renderLongTerm();
  });
  document.getElementById('simpleItemText').addEventListener('keydown', function(e){ if(e.key==='Enter')document.getElementById('saveSimpleItem').click(); });

  // Move to Day
  document.getElementById('closeMoveToDayModal').addEventListener('click', function(){ closeModal('moveToDayModal'); });
  document.getElementById('cancelMoveToDay').addEventListener('click',     function(){ closeModal('moveToDayModal'); });
  document.getElementById('confirmMoveToDay').addEventListener('click', function(){
    var ds=document.getElementById('moveToDayDate').value;
    if (!ds||!state.movingItemId){ closeModal('moveToDayModal'); return; }
    var data=getData();
    var item=data[state.movingItemList].find(function(i){return i.id===state.movingItemId;});
    closeModal('moveToDayModal');
    if(!item)return;
    // Store future item info so it gets deleted after task is saved
    state.movingFromFutureId=state.movingItemId;
    state.movingFromFutureList=state.movingItemList;
    state.movingItemId=null; state.movingItemList=null;
    // Open task modal pre-filled
    window.openAddTask(ds);
    setTimeout(function(){
      document.getElementById('taskTitle').value=item.title;
      document.getElementById('taskNotes').value=item.notes||'';
    },10);
  });

  // Cheshbon HaNefesh
  document.getElementById('reflRefreshBtn').addEventListener('click', refreshReflection);
  document.getElementById('reflHistoryBtn').addEventListener('click', openReflectionHistory);
  document.getElementById('newWeekBtn').addEventListener('click', newCheshbonWeek);
  document.getElementById('cheshbonWeekHistBtn').addEventListener('click', openCheshbonWeekHistory);
  document.getElementById('addCheshbonItemBtn').addEventListener('click', function(){
    state.editCheshbonItemId=null;
    document.getElementById('cheshbonItemModalTitle').textContent='Add Item';
    document.getElementById('cheshbonItemText').value='';
    openModal('cheshbonItemModal');
    setTimeout(function(){document.getElementById('cheshbonItemText').focus();},80);
  });
  document.getElementById('closeCheshbonItemModal').addEventListener('click', function(){ closeModal('cheshbonItemModal'); });
  document.getElementById('cancelCheshbonItem').addEventListener('click',     function(){ closeModal('cheshbonItemModal'); });
  document.getElementById('saveCheshbonItem').addEventListener('click', function(){
    var text=document.getElementById('cheshbonItemText').value.trim();
    if(!text){document.getElementById('cheshbonItemText').classList.add('error');return;}
    document.getElementById('cheshbonItemText').classList.remove('error');
    var data=getData();
    if(state.editCheshbonItemId){
      var item=data.cheshbonItems.find(function(i){return i.id===state.editCheshbonItemId;});
      if(item)item.text=text; saveChi(data.cheshbonItems); state.editCheshbonItemId=null;
    } else {
      data.cheshbonItems.push({id:uid(),text:text}); saveChi(data.cheshbonItems);
    }
    closeModal('cheshbonItemModal'); renderCheshbonRight();
  });
  document.getElementById('cheshbonItemText').addEventListener('keydown', function(e){ if(e.key==='Enter')document.getElementById('saveCheshbonItem').click(); });
  document.getElementById('closeReflHistoryModal').addEventListener('click',      function(){ closeModal('reflHistoryModal'); });
  document.getElementById('closeCheshbonWeekHistModal').addEventListener('click', function(){ closeModal('cheshbonWeekHistModal'); });

  // Weekly item modal
  document.getElementById('closeWeeklyItemModal').addEventListener('click', function(){ closeModal('weeklyItemModal'); });
  document.getElementById('cancelWeeklyItem').addEventListener('click',     function(){ closeModal('weeklyItemModal'); });
  document.getElementById('saveWeeklyItem').addEventListener('click', function(){
    var text = document.getElementById('weeklyItemText').value.trim();
    if (!text) { document.getElementById('weeklyItemText').classList.add('error'); return; }
    document.getElementById('weeklyItemText').classList.remove('error');
    var data = getData();
    if (state.editWeeklyItemId) {
      var item = data.weeklyItems.find(function(i){return i.id===state.editWeeklyItemId;});
      if (item) item.text = text;
      saveWI(data.weeklyItems); state.editWeeklyItemId = null;
    } else {
      data.weeklyItems.push({id: uid(), text: text});
      saveWI(data.weeklyItems);
    }
    closeModal('weeklyItemModal');
    renderWeeklyTab();
  });
  document.getElementById('weeklyItemText').addEventListener('keydown', function(e){ if(e.key==='Enter') document.getElementById('saveWeeklyItem').click(); });

  // Physical Health nav
  document.getElementById('healthPrevDayBtn').addEventListener('click', function(){
    var d=fromDateStr(state.healthDate); d.setDate(d.getDate()-1); state.healthDate=toDateStr(d); renderHealth();
  });
  document.getElementById('healthNextDayBtn').addEventListener('click', function(){
    var d=fromDateStr(state.healthDate); d.setDate(d.getDate()+1); state.healthDate=toDateStr(d); renderHealth();
  });
  document.getElementById('healthBackTodayBtn').addEventListener('click', function(){
    state.healthDate=toDateStr(new Date()); renderHealth();
  });

  // Water picker
  document.getElementById('waterPicker').addEventListener('click', function(e){
    var btn=e.target.closest('.water-btn'); if(!btn)return;
    var level=btn.dataset.level; var ds=state.healthDate;
    var data=getData(); var current=data.healthWater[ds]||'';
    setHealthWater(ds, current===level?'':level); renderHealthWater(ds);
  });


  // Activity Plan modal
  document.getElementById('planActivityTypePicker').addEventListener('click', function(e){
    var btn=e.target.closest('.plan-activity-type-btn'); if(!btn)return;
    document.querySelectorAll('.plan-activity-type-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active'); state.selectedPlanActivityType=btn.dataset.type;
    document.getElementById('planActivityCustom').value='';
  });
  document.getElementById('planActivityCustom').addEventListener('input', function(){
    if(this.value.trim()){
      document.querySelectorAll('.plan-activity-type-btn').forEach(function(b){b.classList.remove('active');});
      state.selectedPlanActivityType='';
    }
  });
  document.getElementById('closeActivityPlanModal').addEventListener('click', function(){ closeModal('activityPlanModal'); });
  document.getElementById('cancelActivityPlan').addEventListener('click',     function(){ closeModal('activityPlanModal'); });
  document.getElementById('planActivitySave').addEventListener('click', function(){
    var custom=document.getElementById('planActivityCustom').value.trim();
    var actType=custom||state.selectedPlanActivityType;
    if(!actType){alert('Please select or type an activity.');return;}
    var d={activityType:actType,time:document.getElementById('planActivityTime').value,duration:document.getElementById('planActivityDuration').value.trim()};
    var day=state.editActivityPlanDay;
    state.editActivityPlanId?updateActivityPlanItem(day,state.editActivityPlanId,d):addActivityPlanItem(day,d);
    state.editActivityPlanId=null; state.selectedPlanActivityType='';
    closeModal('activityPlanModal'); renderActivityPlanner();
  });
  // Planner week nav
  document.getElementById('plannerPrevWeekBtn').addEventListener('click', function(){ state.plannerWeekOffset--; renderActivityPlanner(); });
  document.getElementById('plannerNextWeekBtn').addEventListener('click', function(){ state.plannerWeekOffset++; renderActivityPlanner(); });
  document.getElementById('plannerThisWeekBtn').addEventListener('click', function(){ state.plannerWeekOffset=0; renderActivityPlanner(); });

  // Reminders
  if(document.getElementById('closeWeightGoalModal'))
    document.getElementById('closeWeightGoalModal').addEventListener('click',function(){closeModal('weightGoalModal');});
  if(document.getElementById('cancelWeightGoalModal'))
    document.getElementById('cancelWeightGoalModal').addEventListener('click',function(){closeModal('weightGoalModal');});
  if(document.getElementById('closeWeightHistoryModal'))
    document.getElementById('closeWeightHistoryModal').addEventListener('click',function(){closeModal('weightHistoryModal');});

  document.getElementById('addReminderBtn').addEventListener('click', function(){ state.editReminderId=null; document.getElementById('reminderModalTitle').textContent='Add Reminder'; document.getElementById('reminderText').value=''; document.getElementById('reminderCategory').value=''; openModal('reminderModal'); setTimeout(function(){document.getElementById('reminderText').focus();},80); });
  document.getElementById('closeReminderModal').addEventListener('click', function(){ closeModal('reminderModal'); });
  document.getElementById('cancelReminder').addEventListener('click',     function(){ closeModal('reminderModal'); });
  document.getElementById('saveReminder').addEventListener('click', function(){
    var text=document.getElementById('reminderText').value.trim();
    if (!text){ document.getElementById('reminderText').classList.add('error'); return; }
    document.getElementById('reminderText').classList.remove('error');
    var cat=document.getElementById('reminderCategory').value.trim();
    state.editReminderId?updateReminder(state.editReminderId,text,cat):addReminder(text,cat);
    state.editReminderId=null; closeModal('reminderModal'); renderReminders();
  });

  // Learning Seder
  document.getElementById('closeLearningItemModal').addEventListener('click', function(){ closeModal('learningItemModal'); });
  document.getElementById('cancelLearningItem').addEventListener('click',     function(){ closeModal('learningItemModal'); });
  // Learning Day Modal
  document.getElementById('closeLearningDayModal').addEventListener('click', function(){ closeModal('learningDayModal'); });
  document.getElementById('learningDayAddBtn').addEventListener('click', function(){ openAddLearningItem(state.learningDay); });
  // Learning Copy Modal
  document.getElementById('closeLearningCopyModal').addEventListener('click', function(){ closeModal('learningCopyModal'); });
  document.getElementById('cancelLearningCopy').addEventListener('click', function(){ closeModal('learningCopyModal'); });
  document.getElementById('confirmLearningCopy').addEventListener('click', function(){
    if(!state.learningCopyItem)return;
    var src=state.learningCopyItem;
    var data=getData();
    var item=(data.learning[src.day]||[]).find(function(i){return i.id===src.id;});
    if(!item)return;
    var selectedDays=[];
    document.querySelectorAll('#learningCopyDays .lrn-copy-btn.active').forEach(function(btn){selectedDays.push(btn.dataset.day);});
    selectedDays.forEach(function(d){
      addLearningItem(d,{subject:item.subject,source:item.source,notes:item.notes,time:item.time,seder:item.seder});
    });
    state.learningCopyItem=null;
    closeModal('learningCopyModal');
    renderLearning();
    if(document.getElementById('learningDayModal').classList.contains('open')){
      renderLearningDayModal(state.learningDay);
    }
  });
  document.getElementById('learningSedarGroup').addEventListener('click', function(e){
    var btn=e.target.closest('.seder-btn'); if(!btn)return;
    var s=btn.dataset.seder;
    setLearningSedarUI(state.selectedLearningSeder===s?'':s);
  });
  document.getElementById('learningTime').addEventListener('input', function(){
    if(this.value) setLearningSedarUI('');
  });
  document.getElementById('saveLearningItem').addEventListener('click', function(){
    var subject=document.getElementById('learningSubject').value.trim();
    if (!subject){ document.getElementById('learningSubject').classList.add('error'); return; }
    document.getElementById('learningSubject').classList.remove('error');
    var time=document.getElementById('learningTime').value;
    var seder=state.selectedLearningSeder;
    var errEl=document.getElementById('learningTimeError');
    if(seder&&time){
      var h=parseInt(time.split(':')[0],10);
      var valid=(seder==='morning'&&h>=5&&h<12)||(seder==='afternoon'&&h>=12&&h<18)||(seder==='night'&&h>=18);
      if(!valid){
        var rangeMap={morning:'5am–12pm',afternoon:'12pm–6pm',night:'6pm+'};
        errEl.textContent=seder.charAt(0).toUpperCase()+seder.slice(1)+' Seder must be within '+rangeMap[seder];
        errEl.style.display='block'; return;
      }
    }
    errEl.style.display='none';
    var d={subject:subject,source:document.getElementById('learningSource').value.trim(),notes:document.getElementById('learningNotes').value.trim(),time:time,seder:seder};
    if(state.editLearningItemId){
      updateLearningItem(state.learningDay,state.editLearningItemId,d);
    }else{
      addLearningItem(state.learningDay,d);
      // Also add to any selected days
      document.querySelectorAll('#learningAlsoDays .lrn-also-btn.active').forEach(function(btn){
        addLearningItem(btn.dataset.day,d);
      });
    }
    state.editLearningItemId=null;
    closeModal('learningItemModal');
    renderLearning();
    if(document.getElementById('learningDayModal').classList.contains('open')){
      renderLearningDayModal(state.learningDay);
    }
  });

  // Financial tabs
  document.querySelectorAll('.fin-tab').forEach(function(tab){
    tab.addEventListener('click',function(){
      document.querySelectorAll('.fin-tab').forEach(function(t){t.classList.remove('active');});
      document.querySelectorAll('.fin-panel').forEach(function(p){p.classList.remove('active');});
      tab.classList.add('active');
      state.activeFinTab=tab.dataset.tab;
      var panel=document.getElementById('fin-'+tab.dataset.tab); if(panel)panel.classList.add('active');
      renderFinancial();
    });
  });

  // Expense modal frequency → show/hide weeks row
  document.getElementById('finExpFreq').addEventListener('change', function(){
    document.getElementById('finExpWeeksRow').style.display=this.value!=='weekly'?'':'none';
  });
  // Expense amount toggle
  document.getElementById('finExpAmtToggle').addEventListener('click', function(e){
    var btn=e.target.closest('.fin-amt-btn'); if(!btn)return;
    document.querySelectorAll('#finExpAmtToggle .fin-amt-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    var isRange=btn.dataset.type==='range';
    document.getElementById('finExpAmtFixed').style.display=isRange?'none':'';
    document.getElementById('finExpAmtRange').style.display=isRange?'':'none';
  });
  // Expense save
  document.getElementById('closeFinExpModal').addEventListener('click', function(){ closeModal('finExpModal'); });
  document.getElementById('cancelFinExp').addEventListener('click',     function(){ closeModal('finExpModal'); });
  document.getElementById('saveFinExp').addEventListener('click', function(){
    var name=document.getElementById('finExpName').value.trim();
    if(!name){ document.getElementById('finExpName').classList.add('error'); return; }
    document.getElementById('finExpName').classList.remove('error');
    var isRange=document.querySelector('#finExpAmtToggle .fin-amt-btn.active').dataset.type==='range';
    var lo=parseFloat(isRange?document.getElementById('finExpAmtLow').value:document.getElementById('finExpAmtSingle').value)||0;
    var hi=parseFloat(isRange?document.getElementById('finExpAmtHigh').value:document.getElementById('finExpAmtSingle').value)||lo;
    var freq=document.getElementById('finExpFreq').value;
    var weeks=freq==='weekly'?[0,1,2,3]:Array.from(document.querySelectorAll('#finExpWeeksRow .fin-wk-check:checked')).map(function(c){return parseInt(c.value);});
    var d={name:name,amountLow:lo,amountHigh:hi,tag:document.getElementById('finExpTag').value,frequency:freq,weeks:weeks,notes:document.getElementById('finExpNotes').value.trim()};
    state.editFinExpId?updateFinExp(state.editFinExpId,d):addFinExp(d);
    state.editFinExpId=null; closeModal('finExpModal'); renderFinancial();
  });

  // Income modal frequency → weeks row
  document.getElementById('finIncFreq').addEventListener('change', function(){
    document.getElementById('finIncWeeksRow').style.display=this.value!=='weekly'?'':'none';
  });
  // Income amount toggle
  document.getElementById('finIncAmtToggle').addEventListener('click', function(e){
    var btn=e.target.closest('.fin-amt-btn'); if(!btn)return;
    document.querySelectorAll('#finIncAmtToggle .fin-amt-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    var isVar=btn.dataset.type==='variable';
    document.getElementById('finIncAmtFixed').style.display=isVar?'none':'';
    document.getElementById('finIncAmtRange').style.display=isVar?'':'none';
  });
  // Income save
  document.getElementById('closeFinIncModal').addEventListener('click', function(){ closeModal('finIncModal'); });
  document.getElementById('cancelFinInc').addEventListener('click',     function(){ closeModal('finIncModal'); });
  document.getElementById('saveFinInc').addEventListener('click', function(){
    var name=document.getElementById('finIncName').value.trim();
    if(!name){ document.getElementById('finIncName').classList.add('error'); return; }
    document.getElementById('finIncName').classList.remove('error');
    var isVar=document.querySelector('#finIncAmtToggle .fin-amt-btn.active').dataset.type==='variable';
    var lo=parseFloat(isVar?document.getElementById('finIncAmtLow').value:document.getElementById('finIncAmtSingle').value)||0;
    var hi=parseFloat(isVar?document.getElementById('finIncAmtHigh').value:document.getElementById('finIncAmtSingle').value)||lo;
    var freq=document.getElementById('finIncFreq').value;
    var weeks=freq==='weekly'?[0,1,2,3]:Array.from(document.querySelectorAll('#finIncWeeksRow .fin-wk-check:checked')).map(function(c){return parseInt(c.value);});
    var d={name:name,amountLow:lo,amountHigh:hi,frequency:freq,weeks:weeks,notes:document.getElementById('finIncNotes').value.trim()};
    state.editFinIncId?updateFinInc(state.editFinIncId,d):addFinInc(d);
    state.editFinIncId=null; closeModal('finIncModal'); renderFinancial();
  });

  // Bonus save
  document.getElementById('closeFinBonModal').addEventListener('click', function(){ closeModal('finBonModal'); });
  document.getElementById('cancelFinBon').addEventListener('click',     function(){ closeModal('finBonModal'); });
  document.getElementById('saveFinBon').addEventListener('click', function(){
    var name=document.getElementById('finBonName').value.trim();
    if(!name){ document.getElementById('finBonName').classList.add('error'); return; }
    document.getElementById('finBonName').classList.remove('error');
    var lo=parseFloat(document.getElementById('finBonAmtLow').value)||0;
    var hi=parseFloat(document.getElementById('finBonAmtHigh').value)||lo;
    var d={name:name,amountLow:lo,amountHigh:hi,status:document.getElementById('finBonStatus').value,notes:document.getElementById('finBonNotes').value.trim()};
    state.editFinBonId?updateFinBon(state.editFinBonId,d):addFinBon(d);
    state.editFinBonId=null; closeModal('finBonModal'); renderFinancial();
  });

  // Wishlist save
  document.getElementById('closeFinWishModal').addEventListener('click', function(){ closeModal('finWishModal'); });
  document.getElementById('cancelFinWish').addEventListener('click',     function(){ closeModal('finWishModal'); });
  document.getElementById('saveFinWish').addEventListener('click', function(){
    var name=document.getElementById('finWishName').value.trim();
    if(!name){ document.getElementById('finWishName').classList.add('error'); return; }
    document.getElementById('finWishName').classList.remove('error');
    var d={name:name,cost:parseFloat(document.getElementById('finWishCost').value)||0,
      tier:document.getElementById('finWishTier').value,
      eta:document.getElementById('finWishETA').value.trim(),
      notes:document.getElementById('finWishNotes').value.trim()};
    state.editFinWishId?updateFinWish(state.editFinWishId,d):addFinWish(d);
    state.editFinWishId=null; closeModal('finWishModal'); renderFinancial();
  });

  // Money Making
  document.getElementById('addMoneyIdeaBtn').addEventListener('click', function(){ state.editMoneyIdeaId=null; document.getElementById('moneyIdeaModalTitle').textContent='Add Idea'; document.getElementById('moneyIdeaName').value=''; document.getElementById('moneyIdeaStatus').value='idea'; document.getElementById('moneyIdeaNotes').value=''; openModal('moneyIdeaModal'); setTimeout(function(){document.getElementById('moneyIdeaName').focus();},80); });
  document.getElementById('closeMoneyIdeaModal').addEventListener('click', function(){ closeModal('moneyIdeaModal'); });
  document.getElementById('cancelMoneyIdea').addEventListener('click',     function(){ closeModal('moneyIdeaModal'); });
  document.getElementById('saveMoneyIdea').addEventListener('click', function(){
    var idea=document.getElementById('moneyIdeaName').value.trim();
    if (!idea){ document.getElementById('moneyIdeaName').classList.add('error'); return; }
    document.getElementById('moneyIdeaName').classList.remove('error');
    var d={idea:idea,status:document.getElementById('moneyIdeaStatus').value,notes:document.getElementById('moneyIdeaNotes').value.trim()};
    state.editMoneyIdeaId?updateMoneyIdea(state.editMoneyIdeaId,d):addMoneyIdea(d);
    state.editMoneyIdeaId=null; closeModal('moneyIdeaModal'); renderFinancial();
  });

  // Calendar month picker
  document.getElementById('calMonthLabel').addEventListener('click',function(e){
    e.stopPropagation();
    var picker=document.getElementById('calMonthPicker');
    if(picker.style.display==='block'){closeCalMonthPicker();}else{openCalMonthPicker();}
  });
  document.getElementById('calPickerYearPrev').addEventListener('click',function(){_calPickerYear--;renderCalMonthPickerGrid();});
  document.getElementById('calPickerYearNext').addEventListener('click',function(){_calPickerYear++;renderCalMonthPickerGrid();});
  document.getElementById('calPickerToday').addEventListener('click',function(){
    var now=new Date(); state.calYear=now.getFullYear(); state.calMonth=now.getMonth();
    closeCalMonthPicker(); renderCalendar();
  });
  document.getElementById('calPickerMonths').addEventListener('click',function(e){
    var btn=e.target.closest('.cal-picker-month-btn'); if(!btn)return;
    calPickerSelectMonth(parseInt(btn.dataset.month,10));
  });
  document.addEventListener('click',function(e){
    var picker=document.getElementById('calMonthPicker');
    if(picker&&picker.style.display==='block'&&!picker.contains(e.target)&&e.target.id!=='calMonthLabel'){
      closeCalMonthPicker();
    }
    if(document.getElementById('taskContextMenu').style.display==='block'&&!document.getElementById('taskContextMenu').contains(e.target)){
      document.getElementById('taskContextMenu').style.display='none';
    }
  });
  document.getElementById('taskCtxDuplicate').addEventListener('click',function(){
    if(!_ctxTask)return;
    var data=getData();
    var task=(data.tasks[_ctxTask.ds]||[]).find(function(t){return t.id===_ctxTask.id;});
    if(!task)return;
    if(!data.tasks[_ctxTask.ds])data.tasks[_ctxTask.ds]=[];
    data.tasks[_ctxTask.ds].push(Object.assign({},task,{id:uid(),done:false,createdAt:new Date().toISOString()}));
    saveT(data.tasks); refresh();
    document.getElementById('taskContextMenu').style.display='none'; _ctxTask=null;
  });

  // Calendar
  document.getElementById('calPrevBtn').addEventListener('click', function(){ state.calMonth--; if(state.calMonth<0){state.calMonth=11;state.calYear--;} renderCalendar(); });
  document.getElementById('calNextBtn').addEventListener('click', function(){ state.calMonth++; if(state.calMonth>11){state.calMonth=0;state.calYear++;} renderCalendar(); });
  document.getElementById('addCalEventBtn').addEventListener('click', function(){ openAddCalEvent(null); });
  document.getElementById('closeCalEventModal').addEventListener('click', function(){ closeModal('calEventModal'); });
  document.getElementById('cancelCalEvent').addEventListener('click',     function(){ closeModal('calEventModal'); });
  document.getElementById('saveCalEvent').addEventListener('click', saveCalEventModal);
  document.getElementById('calEventDoRecur').addEventListener('change',function(){
    document.getElementById('calEventRecurGroup').style.display=this.checked?'':'none';
  });
  if(document.getElementById('closeEditCalScopeModal'))
    document.getElementById('closeEditCalScopeModal').addEventListener('click',function(){closeModal('editCalScopeModal');});
  document.getElementById('closeDayDetailModal').addEventListener('click', function(){ closeModal('dayDetailModal'); });
  document.getElementById('calMonthViewBtn') && document.getElementById('calMonthViewBtn').addEventListener('click', function(){ renderCalendar(); });

  // Note view modal (inline editable)
  function closeNoteView() { saveNoteViewModal(); closeModal('noteViewModal'); renderNotes(); }
  document.getElementById('closeNoteViewModal').addEventListener('click', closeNoteView);
  document.getElementById('noteViewModal').addEventListener('click', function(e){ if(e.target===this) closeNoteView(); });
  document.getElementById('noteViewOptionsBtn').addEventListener('click', function(){
    saveNoteViewModal(); closeModal('noteViewModal'); openEditNote(state.viewingNoteId);
  });
  document.getElementById('noteViewPinBtn').addEventListener('click', function(){
    saveNoteViewModal();
    toggleNotePin(state.viewingNoteId);
    var n=getData().notes.find(function(n){return n.id===state.viewingNoteId;});
    this.style.opacity=n&&n.pinned?'1':'0.4';
    this.title=n&&n.pinned?'Unpin note':'Pin note';
  });
  document.getElementById('noteViewTrashBtn').addEventListener('click', function(){
    if(!confirm('Delete this note? You can restore it from Recently Deleted within 30 days.'))return;
    var id=state.viewingNoteId;
    closeModal('noteViewModal');
    deleteNote(id);
    renderNotes();
  });
  document.getElementById('noteViewContent').addEventListener('input', function(){
    clearTimeout(_noteUndoTimer); _noteUndoTimer=setTimeout(function(){ saveNoteViewModal(); },600);
  });
  // Shared keydown handler for all note contenteditable editors
  function noteEditorKeydown(e) {
    if((e.metaKey||e.ctrlKey)&&e.key==='b'){e.preventDefault();document.execCommand('bold',false,null);}
    if((e.metaKey||e.ctrlKey)&&e.key==='i'){e.preventDefault();document.execCommand('italic',false,null);}
    if((e.metaKey||e.ctrlKey)&&e.key==='u'){e.preventDefault();document.execCommand('underline',false,null);}
    function getNoteLineInfo(editor){
      var sel=window.getSelection(); if(!sel.rangeCount)return{tn:null,text:''};
      var cn=sel.getRangeAt(0).startContainer;
      var el=cn.nodeType===3?cn.parentNode:cn;
      while(el&&el.parentNode!==editor&&el!==editor)el=el.parentNode;
      var inBlock=(el&&el!==editor);
      if(inBlock){var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);return{tn:w.nextNode(),text:el.textContent};}
      else{var tn=cn.nodeType===3?cn:null;return{tn:tn,text:tn?tn.textContent:''};}
    }
    if(e.key==='Tab'){
      e.preventDefault();
      var edT=this; var selT=window.getSelection(); if(!selT.rangeCount)return;
      var infoT=getNoteLineInfo(edT); var tnT=infoT.tn; var ltT=infoT.text;
      if(e.shiftKey){
        if(tnT){var mT=ltT.match(/^( {1,4})/);
          if(mT){var rT=document.createRange();rT.setStart(tnT,0);rT.setEnd(tnT,mT[1].length);selT.removeAllRanges();selT.addRange(rT);document.execCommand('delete');}}
      } else {
        var isListT=/^\s*-/.test(ltT)||/^\s*\d+\./.test(ltT);
        if(isListT&&tnT){var rT2=document.createRange();rT2.setStart(tnT,0);rT2.collapse(true);selT.removeAllRanges();selT.addRange(rT2);}
        document.execCommand('insertText',false,'    ');
      }
      return;
    }
    if(e.key==='Enter'&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey){
      var ed2=this; var info2=getNoteLineInfo(ed2); var lt2=info2.text;
      var bulletM=lt2.match(/^(\s*)-/); var numM=lt2.match(/^(\s*)(\d+)\./);
      if(bulletM){var pfx=bulletM[1]+'- ';setTimeout(function(){document.execCommand('insertText',false,pfx);},0);}
      else if(numM){var pfx2=numM[1]+(parseInt(numM[2])+1)+'. ';setTimeout(function(){document.execCommand('insertText',false,pfx2);},0);}
    }
  }
  document.getElementById('noteViewContent').addEventListener('keydown', noteEditorKeydown);
  document.getElementById('noteContent').addEventListener('keydown', noteEditorKeydown);
  document.getElementById('noteViewAddCheckItem').addEventListener('click', function(){
    state.viewNoteCheckItems.push({id:uid(),text:'',done:false}); renderNoteViewChecklist();
    var inputs=document.getElementById('noteViewCheckItems').querySelectorAll('.note-view-check-input');
    if(inputs.length) inputs[inputs.length-1].focus();
  });
  document.getElementById('addNoteBtn').addEventListener('click', openNoteModal);
  document.getElementById('closeNoteModal').addEventListener('click', function(){ closeModal('noteModal'); });
  document.getElementById('cancelNote').addEventListener('click',     function(){ closeModal('noteModal'); });
  document.getElementById('saveNote').addEventListener('click', saveNoteModal);
  document.getElementById('noteTypeText').addEventListener('click',  function(){ setNoteType('text'); });
  document.getElementById('noteTypeCheck').addEventListener('click', function(){ setNoteType('checklist'); });
  document.getElementById('addCheckItem').addEventListener('click', function(){
    state.noteCheckItems.push({id:uid(),text:'',done:false}); renderCheckItems();
    var inputs=document.getElementById('noteCheckItems').querySelectorAll('input[type="text"]');
    if (inputs.length) inputs[inputs.length-1].focus();
  });
  document.getElementById('notesSearch').addEventListener('input', function(e){ state.notesSearchQuery=e.target.value; renderNotesMain(); });

  // Folder
  document.getElementById('closeFolderModal').addEventListener('click', function(){ closeModal('folderModal'); });
  document.getElementById('cancelFolder').addEventListener('click',     function(){ closeModal('folderModal'); });
  document.getElementById('saveFolder').addEventListener('click', saveFolderModal);
  // Folder password modal (null-guarded in case HTML cache lags)
  if(document.getElementById('cancelFolderPassword'))
    document.getElementById('cancelFolderPassword').addEventListener('click', function(){ closeModal('folderPasswordModal'); });
  if(document.getElementById('confirmFolderPassword'))
    document.getElementById('confirmFolderPassword').addEventListener('click', function(){
    var data=getData();
    var folder=data.folders.find(function(f){return f.id===state.pendingFolderId;}); if(!folder)return;
    var entered=document.getElementById('folderPasswordInput').value;
    if(entered===folder.password){
      state.unlockedFolders[state.pendingFolderId]=true;
      state.activeFolderId=state.pendingFolderId; state.pendingFolderId=null;
      closeModal('folderPasswordModal'); renderNotes();
    } else {
      document.getElementById('folderPasswordError').style.display='';
      document.getElementById('folderPasswordInput').select();
    }
  });
  if(document.getElementById('folderPasswordInput'))
    document.getElementById('folderPasswordInput').addEventListener('keydown',function(e){if(e.key==='Enter')document.getElementById('confirmFolderPassword').click();});
  document.getElementById('folderName').addEventListener('keydown', function(e){ if(e.key==='Enter')saveFolderModal(); });

  // Close modals on backdrop (noteViewModal handled separately above so it saves first)
  document.querySelectorAll('.modal').forEach(function(m){
    if(m.id==='noteViewModal')return;
    m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('open');});
  });
}

// ============================================================
// INIT
// ============================================================
function updateHeaderDate() {
  var el=document.getElementById('headerDate');
  if (el) el.textContent=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
}
async function loadHeaderHebrewDate() {
  var ds=toDateStr(new Date()); var hdate=await fetchHebrewDate(ds);
  var el=document.getElementById('headerHdate'); if(el&&hdate)el.textContent=hdate;
}

function init() {
  localStorage.removeItem('dm_health_diet');
  purgeOldDeletedNotes();
  seedRoutineIfEmpty();
  seedFinancialIfEmpty();
  updateHeaderDate();
  loadHeaderHebrewDate();
  setInterval(updateHeaderDate,60000);
  initListeners();
  initSwipe();
  setDashView('seven');
  checkMissedTasks();
}

document.addEventListener('DOMContentLoaded', init);
