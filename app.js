'use strict';

// ============================================================
// COLOR OPTIONS
// ============================================================
const COLORS = [
  { name: 'Default',  value: '',        cls: 'cd-default', chipCls: '' },
  { name: 'Yellow',   value: '#fef9c3', cls: '', chipCls: 'cc-yellow',   taskCls: 'tc-yellow',   noteCls: 'nc-yellow'   },
  { name: 'Green',    value: '#d1fae5', cls: '', chipCls: 'cc-green',    taskCls: 'tc-green',    noteCls: 'nc-green'    },
  { name: 'Teal',     value: '#ccfbf1', cls: '', chipCls: 'cc-teal',     taskCls: 'tc-teal',     noteCls: 'nc-teal'     },
  { name: 'Blue',     value: '#dbeafe', cls: '', chipCls: 'cc-blue',     taskCls: 'tc-blue',     noteCls: 'nc-blue'     },
  { name: 'Lavender', value: '#ede9fe', cls: '', chipCls: 'cc-lavender', taskCls: 'tc-lavender', noteCls: 'nc-lavender' },
  { name: 'Pink',     value: '#fce7f3', cls: '', chipCls: 'cc-pink',     taskCls: 'tc-pink',     noteCls: 'nc-pink'     },
  { name: 'Stone',    value: '#f3f4f6', cls: '', chipCls: 'cc-stone',    taskCls: 'tc-stone',    noteCls: 'nc-stone'    },
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
  editReminderId: null,
  editCheshbonItemId: null,
  healthDate: toDateStr(new Date()),
  editHealthFoodId: null,
  editHealthActivityId: null,
  selectedActivityType: '',
  learningDay: null,
  editLearningItemId: null,
  activeFinTab: 'finances',
  finEntryType: null,
  editFinEntryId: null,
  editShoppingId: null,
  editMoneyIdeaId: null,
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  calView: 'month',
  editCalEventId: null,
  selectedCalEventColor: '',
  pendingCalDate: null,
  activeFolderId: 'all',
  editNoteId: null,
  editFolderId: null,
  selectedNoteColor: '',
  selectedFolderColor: '',
  noteType: 'text',
  noteCheckItems: [],
  notesSearchQuery: '',
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
    income:      JSON.parse(localStorage.getItem('dm_income')      || '[]'),
    expenses:    JSON.parse(localStorage.getItem('dm_expenses')    || '[]'),
    shopping:    JSON.parse(localStorage.getItem('dm_shopping')    || '[]'),
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
    healthDiet:            JSON.parse(localStorage.getItem('dm_health_diet'))                || {},
    healthActivity:        JSON.parse(localStorage.getItem('dm_health_activity'))            || {},
    healthWater:           JSON.parse(localStorage.getItem('dm_health_water'))               || {},
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
function saveInc(v) { localStorage.setItem('dm_income',      JSON.stringify(v)); }
function saveExp(v) { localStorage.setItem('dm_expenses',    JSON.stringify(v)); }
function saveSho(v) { localStorage.setItem('dm_shopping',    JSON.stringify(v)); }
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
function saveHD(v)   { localStorage.setItem('dm_health_diet',             JSON.stringify(v)); }
function saveHA(v)   { localStorage.setItem('dm_health_activity',         JSON.stringify(v)); }
function saveHW(v)   { localStorage.setItem('dm_health_water',            JSON.stringify(v)); }
function uid()      { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ============================================================
// DATE HELPERS
// ============================================================
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
    return {
      id:       r.id,
      title:    ov.title    !== undefined ? ov.title    : r.title,
      time:     ov.time     !== undefined ? ov.time     : r.time,
      location: ov.location !== undefined ? ov.location : r.location,
      color:'', type:'routine', done: c ? c.done : false
    };
  });
  var oneTasks=(data.tasks[ds]||[]).filter(function(t){return !t._rc;});
  var all=routineTasks.concat(oneTasks);
  var inc=all.filter(function(t){return !t.done;});
  var don=all.filter(function(t){return t.done;});
  var withT=inc.filter(function(t){return t.time;}).sort(function(a,b){return a.time.localeCompare(b.time);});
  return withT.concat(inc.filter(function(t){return !t.time;})).concat(don);
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
  data.tasks[ds].push({id:uid(),type:'once',title:d.title,time:d.time||'',location:d.location||'',notes:d.notes||'',reminder:d.reminder||'',color:d.color||'',priority:d.priority||'standard',done:false,createdAt:new Date().toISOString()});
  saveT(data.tasks);
}
function updateTask(ds,id,d) {
  var data=getData();
  var t=(data.tasks[ds]||[]).find(function(t){return t.id===id;});
  if (t){t.title=d.title;t.time=d.time||'';t.location=d.location||'';t.notes=d.notes||'';t.reminder=d.reminder||'';t.color=d.color||'';t.priority=d.priority||'standard';}
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
function getEventsForDate(ds){ return getData().calEvents.filter(function(e){return e.date===ds;}); }
function addCalEvent(d){ var data=getData(); data.calEvents.push({id:uid(),title:d.title,date:d.date,time:d.time||'',color:d.color||'',fromTask:false}); saveCE(data.calEvents); }
function updateCalEvent(id,d){ var data=getData(); var e=data.calEvents.find(function(e){return e.id===id;}); if(e){e.title=d.title;e.date=d.date;e.time=d.time||'';e.color=d.color||'';} saveCE(data.calEvents); }
function deleteCalEvent(id){ var data=getData(); saveCE(data.calEvents.filter(function(e){return e.id!==id;})); }

// ============================================================
// NOTES & FOLDERS
// ============================================================
function addFolder(name,parentId,color){ var data=getData(); data.folders.push({id:uid(),name:name,parentId:parentId||null,color:color||''}); saveF(data.folders); }
function updateFolder(id,name,color){ var data=getData(); var f=data.folders.find(function(f){return f.id===id;}); if(f){f.name=name;f.color=color||'';} saveF(data.folders); }
function reorderFolders(srcId,tgtId){ var data=getData(); var arr=data.folders; var si=arr.findIndex(function(f){return f.id===srcId;}),ti=arr.findIndex(function(f){return f.id===tgtId;}); if(si===-1||ti===-1||si===ti)return; var item=arr.splice(si,1)[0]; arr.splice(ti,0,item); saveF(data.folders); }
function deleteFolder(id){
  var data=getData();
  data.notes.forEach(function(n){
    if(n.folderId===id) n.folderId=null;
    if(n.folderIds) n.folderIds=n.folderIds.filter(function(fid){return fid!==id;});
  }); saveN(data.notes);
  data.folders=data.folders.filter(function(f){return f.id!==id&&f.parentId!==id;}); saveF(data.folders);
}
// Helper: get folderIds array for a note (handles legacy single folderId)
function getNoteFolderIds(note) {
  if (note.folderIds) return note.folderIds;
  return note.folderId ? [note.folderId] : [];
}
function addNote(d){ var data=getData(); data.notes.push({id:uid(),type:d.type,title:d.title,content:d.content||'',items:d.items||[],folderId:(d.folderIds||[])[0]||null,folderIds:d.folderIds||[],color:d.color||'',pinned:d.pinned||false,archived:false,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}); saveN(data.notes); }
function updateNote(id,d){ var data=getData(); var n=data.notes.find(function(n){return n.id===id;}); if(n){n.type=d.type;n.title=d.title;n.content=d.content||'';n.items=d.items||[];n.folderIds=d.folderIds||[];n.folderId=(d.folderIds||[])[0]||null;n.color=d.color||'';n.pinned=d.pinned||false;n.updatedAt=new Date().toISOString();} saveN(data.notes); }
function deleteNote(id){ var data=getData(); saveN(data.notes.filter(function(n){return n.id!==id;})); }
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
function addLearningItem(day,d){ var data=getData(); if(!data.learning[day])data.learning[day]=[]; data.learning[day].push({id:uid(),subject:d.subject,source:d.source||'',notes:d.notes||''}); saveLrn(data.learning); }
function updateLearningItem(day,id,d){ var data=getData(); if(!data.learning[day])return; var item=data.learning[day].find(function(i){return i.id===id;}); if(item){item.subject=d.subject;item.source=d.source||'';item.notes=d.notes||'';} saveLrn(data.learning); }
function deleteLearningItem(day,id){ var data=getData(); if(!data.learning[day])return; data.learning[day]=data.learning[day].filter(function(i){return i.id!==id;}); saveLrn(data.learning); }

// ============================================================
// FINANCIAL DATA
// ============================================================
function addIncome(d){ var data=getData(); data.income.push({id:uid(),name:d.name,amount:+d.amount,date:d.date,category:d.category||''}); saveInc(data.income); }
function deleteIncome(id){ var data=getData(); saveInc(data.income.filter(function(i){return i.id!==id;})); }
function addExpense(d){ var data=getData(); data.expenses.push({id:uid(),name:d.name,amount:+d.amount,date:d.date,category:d.category||''}); saveExp(data.expenses); }
function deleteExpense(id){ var data=getData(); saveExp(data.expenses.filter(function(e){return e.id!==id;})); }
function addShoppingItem(name,qty){ var data=getData(); data.shopping.push({id:uid(),name:name,qty:+qty||1,done:false}); saveSho(data.shopping); }
function toggleShoppingItem(id){ var data=getData(); var item=data.shopping.find(function(i){return i.id===id;}); if(item)item.done=!item.done; saveSho(data.shopping); }
function deleteShoppingItem(id){ var data=getData(); saveSho(data.shopping.filter(function(i){return i.id!==id;})); }
function addMoneyIdea(d){ var data=getData(); data.moneymaking.push({id:uid(),idea:d.idea,status:d.status||'idea',notes:d.notes||'',createdAt:new Date().toISOString()}); saveMM(data.moneymaking); }
function updateMoneyIdea(id,d){ var data=getData(); var item=data.moneymaking.find(function(i){return i.id===id;}); if(item){item.idea=d.idea;item.status=d.status||'idea';item.notes=d.notes||'';} saveMM(data.moneymaking); }
function deleteMoneyIdea(id){ var data=getData(); saveMM(data.moneymaking.filter(function(i){return i.id!==id;})); }

// ============================================================
// HEALTH DATA
// ============================================================
function addHealthFood(ds, d) {
  var data=getData(); if(!data.healthDiet[ds])data.healthDiet[ds]=[];
  data.healthDiet[ds].push({id:uid(),mealType:d.mealType,description:d.description,createdAt:new Date().toISOString()});
  saveHD(data.healthDiet);
}
function updateHealthFood(ds, id, d) {
  var data=getData(); var arr=data.healthDiet[ds]||[];
  var item=arr.find(function(i){return i.id===id;});
  if(item){item.mealType=d.mealType;item.description=d.description;} saveHD(data.healthDiet);
}
function deleteHealthFood(ds, id) {
  var data=getData(); if(!data.healthDiet[ds])return;
  data.healthDiet[ds]=data.healthDiet[ds].filter(function(i){return i.id!==id;}); saveHD(data.healthDiet);
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
  if (!data.income.length) {
    [{name:'Law School Scholarship',amount:45000,date:'2026-01-15',category:'Education'},
     {name:'Part-time Work',amount:2800,date:'2026-03-01',category:'Employment'},
     {name:'Freelance Project',amount:1500,date:'2026-02-20',category:'Freelance'}]
    .forEach(function(d){data.income.push({id:uid(),name:d.name,amount:d.amount,date:d.date,category:d.category});});
    saveInc(data.income);
  }
  if (!data.expenses.length) {
    [{name:'Rent',amount:1800,date:'2026-04-01',category:'Housing'},
     {name:'Groceries',amount:280,date:'2026-04-15',category:'Food'},
     {name:'Phone Bill',amount:85,date:'2026-04-10',category:'Utilities'},
     {name:'Books & Supplies',amount:320,date:'2026-03-28',category:'Education'},
     {name:'Dining Out',amount:145,date:'2026-04-20',category:'Food'}]
    .forEach(function(d){data.expenses.push({id:uid(),name:d.name,amount:d.amount,date:d.date,category:d.category});});
    saveExp(data.expenses);
  }
  if (!data.shopping.length) {
    [{name:'Printer Paper',qty:2,done:false},{name:'Laptop Charger',qty:1,done:true},
     {name:'Highlighters',qty:3,done:false},{name:'Case Briefs Book',qty:1,done:false}]
    .forEach(function(d){data.shopping.push({id:uid(),name:d.name,qty:d.qty,done:d.done});});
    saveSho(data.shopping);
  }
  if (!data.moneymaking.length) {
    [{idea:'Legal Research Service',status:'exploring',notes:'Help law firms with targeted research'},
     {idea:'Case Brief Templates',status:'inprogress',notes:'Sell templates to 1L students'},
     {idea:'LSAT Tutoring',status:'idea',notes:'Tutor undergrads for LSAT prep'},
     {idea:'Real Estate Research',status:'idea',notes:'Research REITs for passive income'}]
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
  var actionsHTML = '';
  if (!noActions) {
    var eb = isR
      ? '<button class="btn-icon" onclick="openRoutineOverride(\''+ds+'\',\''+task.id+'\')">✏️</button>'
      : '<button class="btn-icon" onclick="openEditTask(\''+ds+'\',\''+task.id+'\')">✏️</button>';
    var db = !isR ? '<button class="btn-icon" onclick="removeTask(\''+ds+'\',\''+task.id+'\')">🗑</button>' : '';
    var hasNotes = !isR && task.notes && task.notes.trim();
    var nb = hasNotes ? '<button class="btn-icon task-notes-btn" onclick="toggleTaskNotes(this)" title="View notes">📋</button>' : '';
    var notesPanel = hasNotes ? '<div class="task-notes-panel" style="display:none">'+escHtml(task.notes)+'</div>' : '';
    actionsHTML = '<div class="task-actions">'+nb+eb+db+'</div>';
  }
  var notesPanel = (!noActions && !isR && task.notes && task.notes.trim())
    ? '<div class="task-notes-panel" style="display:none">'+escHtml(task.notes)+'</div>' : '';
  return '<div class="task-item '+itemCls+(task.done?' is-done':'')+'" id="ti-'+task.id+'">' +
    '<input type="checkbox" class="task-check"'+(task.done?' checked':'')+' onchange="checkTask(\''+ds+'\',\''+task.id+'\','+isR+')">' +
    '<div class="task-body"><div class="task-title '+priorityCls+'">'+escHtml(task.title)+'</div>' +
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
  var tHTML = tasks.length
    ? tasks.map(function(t){return taskHTML(t,ds,compact);}).join('')
    : '<div class="empty-tasks">No tasks yet</div>';

  // In compact (7-day) mode: clickable header opens day popup, no zmanim strip
  // In full mode: zmanim strip shown
  var headSection = compact
    ? '<div class="day-card-head day-card-head-clickable" onclick="openDashDayPopup(\''+ds+'\')">'+head+'</div>'
    : '<div class="day-card-head">'+head+'</div>';
  var zmanimSection = compact ? '' :
    '<div class="zmanim-strip" onclick="openZmanim(\''+ds+'\')">' +
    '<div id="zs-'+ds+'" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;width:100%">' +
    '<span class="z-loading">Loading times…</span><span class="z-expand">Tap for all times ›</span>' +
    '</div></div>';

  return '<div class="day-card'+(today?' is-today':'')+'">' +
    headSection + zmanimSection +
    '<div class="task-list">'+tHTML+'</div>' +
    '<button class="add-task-row" onclick="openAddTask(\''+ds+'\')">+ Add task or event</button>' +
    '</div>';
}

// ============================================================
// RENDER — DASHBOARD VIEWS
// ============================================================
function renderSingle() {
  var date=dateFromOffset(state.dayOffset);
  var ds=toDateStr(date);
  document.getElementById('singleDayContainer').innerHTML=dayCardHTML(date,false);
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
        (!item.done?'<button class="btn-move" onclick="openMoveToDay(\''+list+'\',\''+item.id+'\')">📅</button>':'')+
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
    return '<div class="cheshbon-item-row">'+
      '<div class="cheshbon-item-text">'+escHtml(item.text)+'</div>'+
      '<div class="cheshbon-item-days">'+dayBoxes+'</div>'+
      '<div class="cheshbon-item-actions">'+
        '<button class="btn-icon" onclick="openEditCheshbonItem(\''+item.id+'\')">✏️</button>'+
        '<button class="btn-icon" onclick="removeCheshbonItem(\''+item.id+'\')">🗑</button>'+
      '</div></div>';
  }).join('');
}
function renderCheshbon() { renderCheshbonLeft(); renderCheshbonRight(); }

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
var MEAL_LABELS = {breakfast:'🌅 Breakfast',lunch:'☀️ Lunch',dinner:'🌙 Dinner',snacks:'🍎 Snacks'};
var MEAL_TYPES  = ['breakfast','lunch','dinner','snacks'];

function renderHealth() {
  var ds = state.healthDate;
  var date = fromDateStr(ds);
  // Nav label
  var label = document.getElementById('healthDateLabel');
  if (label) label.textContent = dayName(date) + ', ' + monthDay(date);
  // Today button
  var todayBtn = document.getElementById('healthBackTodayBtn');
  if (todayBtn) todayBtn.style.display = (ds === toDateStr(new Date())) ? 'none' : '';
  // Diet
  renderHealthDiet(ds);
  // Activity
  renderHealthActivity(ds);
  // Water
  renderHealthWater(ds);
}

function renderHealthWater(ds) {
  var data = getData(); var level = data.healthWater[ds] || '';
  document.querySelectorAll('.water-btn').forEach(function(btn){
    btn.classList.toggle('active', btn.dataset.level === level);
  });
}

function renderHealthDiet(ds) {
  var data = getData(); var items = (data.healthDiet[ds] || []);
  var el = document.getElementById('healthDietList'); if(!el)return;
  if (!items.length) { el.innerHTML='<div class="health-meals-empty">No meals logged yet.</div>'; return; }
  var html = '';
  MEAL_TYPES.forEach(function(mtype) {
    var group = items.filter(function(i){return i.mealType===mtype;});
    if (!group.length) return;
    html += '<div class="health-meal-group">';
    html += '<div class="health-meal-group-header"><span class="health-meal-type-label">'+(MEAL_LABELS[mtype]||mtype)+'</span></div>';
    group.forEach(function(item){
      html += '<div class="health-meal-item">'+
        '<div class="health-meal-text">'+escHtml(item.description)+'</div>'+
        '<div class="health-meal-actions">'+
          '<button class="btn-icon" onclick="openEditHealthFood(\''+ds+'\',\''+item.id+'\')">✏️</button>'+
          '<button class="btn-icon" onclick="removeHealthFood(\''+ds+'\',\''+item.id+'\')">🗑</button>'+
        '</div></div>';
    });
    html += '</div>';
  });
  el.innerHTML = html;
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

// Health window callbacks
window.openEditHealthFood = function(ds, id) {
  var data=getData(); var item=(data.healthDiet[ds]||[]).find(function(i){return i.id===id;}); if(!item)return;
  state.editHealthFoodId=id;
  document.getElementById('healthFoodModalTitle').textContent='Edit Meal';
  document.getElementById('healthFoodMealType').value=item.mealType||'breakfast';
  document.getElementById('healthFoodDescription').value=item.description||'';
  openModal('healthFoodModal');
  setTimeout(function(){document.getElementById('healthFoodDescription').focus();},80);
};
window.removeHealthFood = function(ds, id){
  if(!confirm('Delete this meal entry?'))return;
  deleteHealthFood(ds,id); renderHealthDiet(ds);
};
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
function renderLearning() {
  var data=getData(); var grid=document.getElementById('learningGrid'); if(!grid)return;
  grid.innerHTML=LEARNING_DAYS.map(function(day){
    var items=data.learning[day]||[];
    var itemsHTML=items.map(function(item){
      return '<div class="learning-item">' +
        '<div class="learning-item-body">' +
          '<div class="learning-item-subject">'+escHtml(item.subject)+'</div>'+
          (item.source?'<div class="learning-item-source">'+escHtml(item.source)+'</div>':'')+
          (item.notes ?'<div class="learning-item-notes">'+escHtml(item.notes)+'</div>' :'')+
        '</div>' +
        '<div class="learning-item-actions">' +
          '<button class="btn-icon" onclick="openEditLearningItem(\''+day+'\',\''+item.id+'\')">✏️</button>'+
          '<button class="btn-icon" onclick="deleteLrn(\''+day+'\',\''+item.id+'\')">🗑</button>'+
        '</div></div>';
    }).join('');
    return '<div class="learning-day-col">' +
      '<div class="learning-day-header">'+LEARNING_DAY_LABELS[day]+'</div>' +
      '<div class="learning-day-body">'+(itemsHTML||'<div style="padding:12px 14px;font-size:13px;color:#ccc">Empty</div>')+'</div>' +
      '<button class="learning-add-row" onclick="openAddLearningItem(\''+day+'\')">+ Add</button>' +
      '</div>';
  }).join('');
}

// ============================================================
// RENDER — FINANCIAL
// ============================================================
function renderFinancial() {
  var data=getData();
  var incEl=document.getElementById('incomeList');
  if (incEl) {
    if (!data.income.length) { incEl.innerHTML='<div class="fin-empty">No income entries yet.</div>'; }
    else {
      var incTotal=data.income.reduce(function(s,i){return s+i.amount;},0);
      incEl.innerHTML=data.income.map(function(item){
        return '<div class="fin-row"><div class="fin-row-main"><div class="fin-row-name">'+escHtml(item.name)+'</div>'+
          '<div class="fin-row-meta">'+fmtDateDisplay(item.date)+(item.category?' · '+escHtml(item.category):'')+'</div></div>'+
          '<div class="fin-row-right"><span class="fin-row-amount income">+$'+item.amount.toLocaleString()+'</span>'+
          '<button class="btn-icon" onclick="delInc(\''+item.id+'\')">🗑</button></div></div>';
      }).join('')+
      '<div class="fin-row" style="background:#f9fef9"><div class="fin-row-main"><strong>Total</strong></div>'+
      '<div class="fin-row-right"><span class="fin-row-amount income" style="font-size:16px">$'+incTotal.toLocaleString()+'</span></div></div>';
    }
  }
  var expEl=document.getElementById('expenseList');
  if (expEl) {
    if (!data.expenses.length) { expEl.innerHTML='<div class="fin-empty">No expense entries yet.</div>'; }
    else {
      var expTotal=data.expenses.reduce(function(s,i){return s+i.amount;},0);
      expEl.innerHTML=data.expenses.map(function(item){
        return '<div class="fin-row"><div class="fin-row-main"><div class="fin-row-name">'+escHtml(item.name)+'</div>'+
          '<div class="fin-row-meta">'+fmtDateDisplay(item.date)+(item.category?' · '+escHtml(item.category):'')+'</div></div>'+
          '<div class="fin-row-right"><span class="fin-row-amount expense">-$'+item.amount.toLocaleString()+'</span>'+
          '<button class="btn-icon" onclick="delExp(\''+item.id+'\')">🗑</button></div></div>';
      }).join('')+
      '<div class="fin-row" style="background:#fff5f5"><div class="fin-row-main"><strong>Total</strong></div>'+
      '<div class="fin-row-right"><span class="fin-row-amount expense" style="font-size:16px">$'+expTotal.toLocaleString()+'</span></div></div>';
    }
  }
  var shoEl=document.getElementById('shoppingList');
  if (shoEl) {
    if (!data.shopping.length) { shoEl.innerHTML='<div class="fin-empty">Your shopping list is empty.</div>'; }
    else {
      shoEl.innerHTML=data.shopping.map(function(item){
        return '<div class="shopping-item'+(item.done?' is-done':'')+'">' +
          '<input type="checkbox" class="task-check"'+(item.done?' checked':'')+' onchange="toggleShop(\''+item.id+'\')">' +
          '<span class="shopping-name">'+escHtml(item.name)+'</span>' +
          '<span class="shopping-qty">×'+item.qty+'</span>' +
          '<button class="btn-icon" onclick="delShop(\''+item.id+'\')">🗑</button></div>';
      }).join('');
    }
  }
  var mmEl=document.getElementById('moneyMakingList');
  if (mmEl) {
    var statusLabel={idea:'💡 Idea',exploring:'🔍 Exploring',inprogress:'⚡ In Progress',earning:'💰 Earning',paused:'⏸ Paused'};
    if (!data.moneymaking.length) { mmEl.innerHTML='<div class="fin-empty">No ideas yet.</div>'; }
    else {
      mmEl.innerHTML=data.moneymaking.map(function(item){
        return '<div class="mm-row">' +
          '<div class="mm-row-body"><div class="mm-idea">'+escHtml(item.idea)+'</div>'+(item.notes?'<div class="mm-notes">'+escHtml(item.notes)+'</div>':'')+' </div>'+
          '<span class="mm-status '+item.status+'">'+(statusLabel[item.status]||item.status)+'</span>'+
          '<div class="mm-row-actions"><button class="btn-icon" onclick="openEditMoneyIdea(\''+item.id+'\')">✏️</button><button class="btn-icon" onclick="delMM(\''+item.id+'\')">🗑</button></div></div>';
      }).join('');
    }
  }
}

// ============================================================
// RENDER — CALENDAR
// ============================================================
function renderCalendar() {
  var year=state.calYear, month=state.calMonth, now=new Date();
  document.getElementById('calMonthLabel').textContent=new Date(year,month,1).toLocaleDateString('en-US',{month:'long',year:'numeric'});
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
    var events=getEventsForDate(ds);
    if (events.length){
      var evDiv=document.createElement('div'); evDiv.className='cal-events';
      events.forEach(function(ev){
        var c=colorByValue(ev.color); var chip=document.createElement('div');
        chip.className='cal-event-chip '+(c.chipCls||'');
        chip.textContent=(ev.time?fmt12(ev.time)+' ':'')+ev.title;
        chip.onclick=function(e){e.stopPropagation();openDayDetail(ds);}; evDiv.appendChild(chip);
      }); cell.appendChild(evDiv);
    }
    cell.addEventListener('click',function(capturedDs){return function(){openDayDetail(capturedDs);};}(ds));
    grid.appendChild(cell);
    if (!otherMonth) hdatesToLoad.push(ds);
  }
  hdatesToLoad.forEach(function(ds){loadCalHdate(ds);});
}

// ============================================================
// RENDER — NOTES
// ============================================================
function renderNotesSidebar() {
  var data=getData(); var sidebar=document.getElementById('notesSidebar'); var active=state.activeFolderId;
  var html='';
  html+='<div class="sidebar-item'+(active==='all'?' active':'')+'" onclick="setNoteFolder(\'all\')">📝 All Notes</div>';
  html+='<div class="sidebar-item'+(active==='pinned'?' active':'')+'" onclick="setNoteFolder(\'pinned\')">📌 Pinned</div>';
  html+='<hr class="sidebar-divider">';
  data.folders.filter(function(f){return !f.parentId;}).forEach(function(f){
    var dot = f.color ? '<span class="folder-color-dot" style="background:'+f.color+'"></span>' : '📁 ';
    html+='<div class="sidebar-item folder-item'+(active===f.id?' active':'')+'" '+
      'draggable="true" data-fid="'+f.id+'" '+
      'onclick="setNoteFolder(\''+f.id+'\')" '+
      'ondragstart="folderDragStart(event)" ondragover="folderDragOver(event)" '+
      'ondragleave="folderDragLeave(event)" ondragend="folderDragEnd(event)" ondrop="folderDrop(event)">'+
      '<span class="folder-drag-handle" title="Drag to reorder">⠿</span>'+
      dot+escHtml(f.name)+
      '<div class="folder-item-actions">'+
        '<button class="btn-icon" style="font-size:12px" onclick="event.stopPropagation();openEditFolder(\''+f.id+'\')">✏️</button>'+
        '<button class="btn-icon" style="font-size:12px" onclick="event.stopPropagation();removeFolder(\''+f.id+'\')">✕</button>'+
      '</div></div>';
    data.folders.filter(function(sf){return sf.parentId===f.id;}).forEach(function(sf){
      var sdot = sf.color ? '<span class="folder-color-dot" style="background:'+sf.color+'"></span>' : '';
      html+='<div class="sidebar-item subfolder-item'+(active===sf.id?' active':'')+'" onclick="setNoteFolder(\''+sf.id+'\')">'+'↳ '+sdot+escHtml(sf.name)+
        '<div class="folder-item-actions">'+
          '<button class="btn-icon" style="font-size:12px" onclick="event.stopPropagation();openEditFolder(\''+sf.id+'\')">✏️</button>'+
          '<button class="btn-icon" style="font-size:12px" onclick="event.stopPropagation();removeFolder(\''+sf.id+'\')">✕</button>'+
        '</div></div>';
    });
  });
  html+='<hr class="sidebar-divider">';
  html+='<div class="sidebar-add-folder" onclick="openFolderModal()">+ New Folder</div>';
  sidebar.innerHTML=html;
}
function renderNotesMain() {
  var data=getData(); var main=document.getElementById('notesMain'); var query=state.notesSearchQuery.toLowerCase();
  var notes=data.notes.filter(function(n){
    if (n.archived) return false;
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
  } else { contentHTML='<div class="note-card-content">'+escHtml(note.content||'')+'</div>'; }
  // Folder badges
  var data=getData(); var folderIds=getNoteFolderIds(note);
  var badges=folderIds.map(function(fid){
    var f=data.folders.find(function(f){return f.id===fid;}); if(!f)return '';
    var bg=f.color?'background:'+f.color+';':'';
    return '<span class="note-folder-badge" style="'+bg+'">'+escHtml(f.name)+'</span>';
  }).filter(Boolean).join('');
  var badgesHTML=badges?'<div class="note-folder-badges">'+badges+'</div>':'';
  return '<div class="note-card'+colorClass+(note.pinned?' is-pinned':'')+'" onclick="openEditNote(\''+note.id+'\')">'+(note.pinned?'<span class="note-pin-flag">📌</span>':'')+
    (note.title?'<div class="note-card-title">'+escHtml(note.title)+'</div>':'')+contentHTML+badgesHTML+
    '<div class="note-card-actions">'+
    '<button class="btn-icon" onclick="event.stopPropagation();pinNote(\''+note.id+'\')" title="Pin">'+(note.pinned?'📌':'📍')+'</button>'+
    '<button class="btn-icon" onclick="event.stopPropagation();removeNote(\''+note.id+'\')" title="Delete">🗑</button></div></div>';
}
function renderNotes(){ renderNotesSidebar(); renderNotesMain(); }

// ============================================================
// DASHBOARD DAY POPUP (7-day card click)
// ============================================================
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
  if (viewName==='cheshbon')  renderCheshbon();
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
  if (pageId==='dashboard') setDashView('seven');
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
// GLOBAL CALLBACKS
// ============================================================
window.checkTask = function(ds,id,isR){ toggleDone(ds,id,isR); refresh(); refreshDashDayModal(); };
window.removeTask = function(ds,id){ if(confirm('Delete this task?')){ deleteTask(ds,id); refresh(); refreshDashDayModal(); } };

window.toggleTaskNotes = function(btn) {
  var item=btn.closest('.task-item');
  var panel=item.querySelector('.task-notes-panel');
  if (panel){ var vis=panel.style.display!=='none'; panel.style.display=vis?'none':''; btn.classList.toggle('active',!vis); }
};

window.openAddTask = function(ds) {
  state.editTaskId=null; state.editTaskDate=ds; state.selectedTaskColor=''; state.selectedTaskPriority='standard';
  document.getElementById('taskModalTitle').textContent='Add Task or Event';
  document.getElementById('taskTitle').value='';
  document.getElementById('taskTime').value='';
  document.getElementById('taskLocation').value='';
  document.getElementById('taskNotes').value='';
  document.getElementById('taskReminder').value='';
  document.getElementById('taskAddToCalendar').checked=false;
  document.querySelectorAll('.priority-btn').forEach(function(b){b.classList.toggle('active',b.dataset.priority==='standard');});
  buildColorPicker('taskColorPicker','',function(v){state.selectedTaskColor=v;});
  openModal('taskModal');
  setTimeout(function(){document.getElementById('taskTitle').focus();},80);
};
window.openEditTask = function(ds,id) {
  var data=getData(); var t=(data.tasks[ds]||[]).find(function(t){return t.id===id;}); if(!t)return;
  state.editTaskId=id; state.editTaskDate=ds; state.selectedTaskColor=t.color||''; state.selectedTaskPriority=t.priority||'standard';
  document.getElementById('taskModalTitle').textContent='Edit Task';
  document.getElementById('taskTitle').value=t.title;
  document.getElementById('taskTime').value=t.time||'';
  document.getElementById('taskLocation').value=t.location||'';
  document.getElementById('taskNotes').value=t.notes||'';
  document.getElementById('taskReminder').value=t.reminder||'';
  document.getElementById('taskAddToCalendar').checked=false;
  document.querySelectorAll('.priority-btn').forEach(function(b){b.classList.toggle('active',b.dataset.priority===(t.priority||'standard'));});
  buildColorPicker('taskColorPicker',t.color||'',function(v){state.selectedTaskColor=v;});
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
window.setNoteFolder    = function(id){ state.activeFolderId=id; renderNotes(); };
window.openEditNote = function(id) {
  var data=getData(); var n=data.notes.find(function(n){return n.id===id;}); if(!n)return;
  state.editNoteId=id; state.selectedNoteColor=n.color||''; state.noteType=n.type;
  var currentFolderId=getNoteFolderIds(n)[0]||'';
  document.getElementById('noteModalTitle').textContent='Edit Note';
  document.getElementById('noteTitle').value=n.title||'';
  document.getElementById('notePinned').checked=n.pinned||false;
  setNoteType(n.type);
  document.getElementById('noteContent').value=n.content||'';
  state.noteCheckItems=(n.items||[]).map(function(i){return {id:uid(),text:i.text,done:i.done};});
  renderCheckItems();
  buildColorPicker('noteColorPicker',n.color||'',function(v){state.selectedNoteColor=v;});
  populateFolderSelect(currentFolderId);
  openModal('noteModal');
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
  document.getElementById('folderParentGroup').style.display='none';
  buildColorPicker('folderColorPicker',f.color||'',function(v){state.selectedFolderColor=v;});
  openModal('folderModal');
  setTimeout(function(){document.getElementById('folderName').focus();},80);
};
window.openDayDetail = function(ds) {
  var date=fromDateStr(ds);
  document.getElementById('dayDetailTitle').textContent=date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  var events=getEventsForDate(ds); var body=document.getElementById('dayDetailBody');
  if (!events.length){ body.innerHTML='<p style="color:#aaa;font-size:14px;padding:8px 0">No events on this day.</p>'; }
  else { body.innerHTML=events.map(function(ev){ return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f2f2f2">'+
    '<div><strong style="font-size:14px">'+escHtml(ev.title)+'</strong>'+(ev.time?'<div style="font-size:12px;color:#888;margin-top:2px">'+fmt12(ev.time)+'</div>':'')+
    '</div><button class="btn-icon" onclick="removeCalEvent(\''+ev.id+'\')">🗑</button></div>'; }).join(''); }
  state.pendingCalDate=ds;
  document.getElementById('addEventOnDay').onclick=function(){ closeModal('dayDetailModal'); openAddCalEvent(ds); };
  openModal('dayDetailModal');
};
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
window.openAddLearningItem = function(day){ state.learningDay=day; state.editLearningItemId=null; document.getElementById('learningItemModalTitle').textContent='Add to '+LEARNING_DAY_LABELS[day]; document.getElementById('learningSubject').value=''; document.getElementById('learningSource').value=''; document.getElementById('learningNotes').value=''; openModal('learningItemModal'); setTimeout(function(){document.getElementById('learningSubject').focus();},80); };
window.openEditLearningItem = function(day,id){ var data=getData(); var items=data.learning[day]||[]; var item=items.find(function(i){return i.id===id;}); if(!item)return; state.learningDay=day; state.editLearningItemId=id; document.getElementById('learningItemModalTitle').textContent='Edit '+LEARNING_DAY_LABELS[day]; document.getElementById('learningSubject').value=item.subject; document.getElementById('learningSource').value=item.source||''; document.getElementById('learningNotes').value=item.notes||''; openModal('learningItemModal'); };
window.deleteLrn = function(day,id){ if(confirm('Remove this entry?')){ deleteLearningItem(day,id); renderLearning(); } };

// Financial
window.delInc  = function(id){ if(confirm('Delete income entry?'  )){ deleteIncome(id);       renderFinancial(); } };
window.delExp  = function(id){ if(confirm('Delete expense entry?' )){ deleteExpense(id);      renderFinancial(); } };
window.delShop = function(id){ if(confirm('Remove this item?'     )){ deleteShoppingItem(id); renderFinancial(); } };
window.toggleShop = function(id){ toggleShoppingItem(id); renderFinancial(); };
window.delMM   = function(id){ if(confirm('Delete this idea?'     )){ deleteMoneyIdea(id);    renderFinancial(); } };
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
  var d={title:title,time:document.getElementById('taskTime').value,location:document.getElementById('taskLocation').value.trim(),notes:document.getElementById('taskNotes').value.trim(),reminder:document.getElementById('taskReminder').value,color:state.selectedTaskColor,priority:state.selectedTaskPriority};
  var addToCal=document.getElementById('taskAddToCalendar').checked;
  state.editTaskId ? updateTask(state.editTaskDate,state.editTaskId,d) : addTask(state.editTaskDate,d);
  if (addToCal) addCalEvent({title:d.title,date:state.editTaskDate,time:d.time,color:d.color});
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
  document.getElementById('calEventTitle').value='';
  document.getElementById('calEventDate').value=ds||toDateStr(new Date());
  document.getElementById('calEventTime').value='';
  document.getElementById('calEventAddToDashboard').checked=false;
  buildColorPicker('calEventColorPicker','',function(v){state.selectedCalEventColor=v;});
  openModal('calEventModal');
  setTimeout(function(){document.getElementById('calEventTitle').focus();},80);
}
function saveCalEventModal() {
  var title=document.getElementById('calEventTitle').value.trim();
  if (!title){ document.getElementById('calEventTitle').classList.add('error'); document.getElementById('calEventTitle').focus(); return; }
  document.getElementById('calEventTitle').classList.remove('error');
  var d={title:title,date:document.getElementById('calEventDate').value,time:document.getElementById('calEventTime').value,color:state.selectedCalEventColor};
  state.editCalEventId?updateCalEvent(state.editCalEventId,d):addCalEvent(d);
  if (document.getElementById('calEventAddToDashboard').checked&&d.date) addTask(d.date,{title:d.title,time:d.time,color:d.color});
  closeModal('calEventModal'); renderCalendar();
}

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

function populateFolderSelect(selectedFolderId) {
  var data=getData(); var sel=document.getElementById('noteFolderSelect'); if(!sel)return;
  sel.innerHTML='<option value="">No folder</option>';
  data.folders.forEach(function(f){
    var opt=document.createElement('option');
    opt.value=f.id; opt.textContent=f.name;
    if(f.id===selectedFolderId)opt.selected=true;
    sel.appendChild(opt);
  });
}
function openNoteModal() {
  state.editNoteId=null; state.selectedNoteColor=''; state.noteType='text'; state.noteCheckItems=[];
  var initFolder=(state.activeFolderId!=='all'&&state.activeFolderId!=='pinned')?state.activeFolderId:'';
  document.getElementById('noteModalTitle').textContent='New Note';
  document.getElementById('noteTitle').value=''; document.getElementById('noteContent').value=''; document.getElementById('notePinned').checked=false;
  setNoteType('text'); renderCheckItems();
  buildColorPicker('noteColorPicker','',function(v){state.selectedNoteColor=v;});
  populateFolderSelect(initFolder);
  openModal('noteModal'); setTimeout(function(){document.getElementById('noteTitle').focus();},80);
}
function saveNoteModal() {
  var content=state.noteType==='text'?document.getElementById('noteContent').value.trim():'';
  var title=document.getElementById('noteTitle').value.trim();
  if (!title&&!content&&!state.noteCheckItems.length){ document.getElementById('noteTitle').classList.add('error'); return; }
  document.getElementById('noteTitle').classList.remove('error');
  var selFolderEl=document.getElementById('noteFolderSelect');
  var selectedFolderId=selFolderEl?selFolderEl.value:'';
  var folderIds=selectedFolderId?[selectedFolderId]:[];
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
  document.getElementById('folderParentGroup').style.display='';
  var sel=document.getElementById('folderParent'); sel.innerHTML='<option value="">None (top-level)</option>';
  data.folders.filter(function(f){return !f.parentId;}).forEach(function(f){ var opt=document.createElement('option'); opt.value=f.id; opt.textContent=f.name; sel.appendChild(opt); });
  buildColorPicker('folderColorPicker','',function(v){state.selectedFolderColor=v;});
  openModal('folderModal'); setTimeout(function(){document.getElementById('folderName').focus();},80);
}
function saveFolderModal() {
  var name=document.getElementById('folderName').value.trim();
  if (!name){ document.getElementById('folderName').classList.add('error'); return; }
  document.getElementById('folderName').classList.remove('error');
  if (state.editFolderId) {
    updateFolder(state.editFolderId,name,state.selectedFolderColor);
    state.editFolderId=null;
  } else {
    addFolder(name,document.getElementById('folderParent').value||null,state.selectedFolderColor);
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
    moveItemToDay(state.movingItemList,state.movingItemId,ds); closeModal('moveToDayModal');
    state.movingItemList==='shortterm'?renderShortTerm():renderLongTerm();
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

  // Health Food modal
  document.getElementById('addHealthFoodBtn').addEventListener('click', function(){
    state.editHealthFoodId=null;
    document.getElementById('healthFoodModalTitle').textContent='Log Meal';
    document.getElementById('healthFoodMealType').value='breakfast';
    document.getElementById('healthFoodDescription').value='';
    openModal('healthFoodModal');
    setTimeout(function(){document.getElementById('healthFoodDescription').focus();},80);
  });
  document.getElementById('closeHealthFoodModal').addEventListener('click', function(){ closeModal('healthFoodModal'); });
  document.getElementById('cancelHealthFood').addEventListener('click',     function(){ closeModal('healthFoodModal'); });
  document.getElementById('saveHealthFood').addEventListener('click', function(){
    var desc=document.getElementById('healthFoodDescription').value.trim();
    if(!desc){document.getElementById('healthFoodDescription').classList.add('error');return;}
    document.getElementById('healthFoodDescription').classList.remove('error');
    var d={mealType:document.getElementById('healthFoodMealType').value,description:desc};
    var ds=state.healthDate;
    state.editHealthFoodId?updateHealthFood(ds,state.editHealthFoodId,d):addHealthFood(ds,d);
    state.editHealthFoodId=null; closeModal('healthFoodModal'); renderHealthDiet(ds);
  });

  // Health Activity modal
  document.getElementById('addHealthActivityBtn').addEventListener('click', function(){
    state.editHealthActivityId=null; state.selectedActivityType='';
    document.getElementById('healthActivityModalTitle').textContent='Log Activity';
    document.querySelectorAll('.activity-type-btn').forEach(function(btn){btn.classList.remove('active');});
    document.getElementById('healthActivityCustom').value='';
    document.getElementById('healthActivityDuration').value='';
    document.getElementById('healthActivityNotes').value='';
    openModal('healthActivityModal');
  });
  document.getElementById('activityTypePicker').addEventListener('click', function(e){
    var btn=e.target.closest('.activity-type-btn'); if(!btn)return;
    document.querySelectorAll('.activity-type-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active'); state.selectedActivityType=btn.dataset.type;
    document.getElementById('healthActivityCustom').value=''; // clear custom when preset chosen
  });
  document.getElementById('healthActivityCustom').addEventListener('input', function(){
    if(this.value.trim()){
      document.querySelectorAll('.activity-type-btn').forEach(function(b){b.classList.remove('active');});
      state.selectedActivityType='';
    }
  });
  document.getElementById('closeHealthActivityModal').addEventListener('click', function(){ closeModal('healthActivityModal'); });
  document.getElementById('cancelHealthActivity').addEventListener('click',     function(){ closeModal('healthActivityModal'); });
  document.getElementById('saveHealthActivity').addEventListener('click', function(){
    var custom=document.getElementById('healthActivityCustom').value.trim();
    var actType=custom||state.selectedActivityType;
    if(!actType){alert('Please select or enter an activity type.');return;}
    var d={activityType:actType,duration:document.getElementById('healthActivityDuration').value.trim(),notes:document.getElementById('healthActivityNotes').value.trim()};
    var ds=state.healthDate;
    state.editHealthActivityId?updateHealthActivity(ds,state.editHealthActivityId,d):addHealthActivity(ds,d);
    state.editHealthActivityId=null; state.selectedActivityType=''; closeModal('healthActivityModal'); renderHealthActivity(ds);
  });

  // Reminders
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
  document.getElementById('saveLearningItem').addEventListener('click', function(){
    var subject=document.getElementById('learningSubject').value.trim();
    if (!subject){ document.getElementById('learningSubject').classList.add('error'); return; }
    document.getElementById('learningSubject').classList.remove('error');
    var d={subject:subject,source:document.getElementById('learningSource').value.trim(),notes:document.getElementById('learningNotes').value.trim()};
    state.editLearningItemId?updateLearningItem(state.learningDay,state.editLearningItemId,d):addLearningItem(state.learningDay,d);
    state.editLearningItemId=null; closeModal('learningItemModal'); renderLearning();
  });

  // Financial tabs
  document.querySelectorAll('.fin-tab').forEach(function(tab){
    tab.addEventListener('click',function(){
      document.querySelectorAll('.fin-tab').forEach(function(t){t.classList.remove('active');});
      document.querySelectorAll('.fin-panel').forEach(function(p){p.classList.remove('active');});
      tab.classList.add('active');
      var panel=document.getElementById('fin-'+tab.dataset.tab); if(panel)panel.classList.add('active');
    });
  });

  // Income / Expense
  document.getElementById('addIncomeBtn').addEventListener('click',  function(){ state.finEntryType='income';  state.editFinEntryId=null; document.getElementById('finEntryModalTitle').textContent='Add Income';  document.getElementById('finEntryName').value=''; document.getElementById('finEntryAmount').value=''; document.getElementById('finEntryDate').value=toDateStr(new Date()); document.getElementById('finEntryCategory').value=''; openModal('finEntryModal'); setTimeout(function(){document.getElementById('finEntryName').focus();},80); });
  document.getElementById('addExpenseBtn').addEventListener('click', function(){ state.finEntryType='expense'; state.editFinEntryId=null; document.getElementById('finEntryModalTitle').textContent='Add Expense'; document.getElementById('finEntryName').value=''; document.getElementById('finEntryAmount').value=''; document.getElementById('finEntryDate').value=toDateStr(new Date()); document.getElementById('finEntryCategory').value=''; openModal('finEntryModal'); setTimeout(function(){document.getElementById('finEntryName').focus();},80); });
  document.getElementById('closeFinEntryModal').addEventListener('click', function(){ closeModal('finEntryModal'); });
  document.getElementById('cancelFinEntry').addEventListener('click',     function(){ closeModal('finEntryModal'); });
  document.getElementById('saveFinEntry').addEventListener('click', function(){
    var name=document.getElementById('finEntryName').value.trim(), amt=document.getElementById('finEntryAmount').value;
    if (!name||!amt){ if(!name)document.getElementById('finEntryName').classList.add('error'); if(!amt)document.getElementById('finEntryAmount').classList.add('error'); return; }
    document.getElementById('finEntryName').classList.remove('error'); document.getElementById('finEntryAmount').classList.remove('error');
    var d={name:name,amount:amt,date:document.getElementById('finEntryDate').value,category:document.getElementById('finEntryCategory').value.trim()};
    state.finEntryType==='income'?addIncome(d):addExpense(d); closeModal('finEntryModal'); renderFinancial();
  });

  // Shopping
  document.getElementById('addShoppingBtn').addEventListener('click',  function(){ document.getElementById('shoppingItemName').value=''; document.getElementById('shoppingItemQty').value='1'; openModal('shoppingModal'); setTimeout(function(){document.getElementById('shoppingItemName').focus();},80); });
  document.getElementById('closeShoppingModal').addEventListener('click', function(){ closeModal('shoppingModal'); });
  document.getElementById('cancelShopping').addEventListener('click',     function(){ closeModal('shoppingModal'); });
  document.getElementById('saveShopping').addEventListener('click', function(){
    var name=document.getElementById('shoppingItemName').value.trim();
    if (!name){ document.getElementById('shoppingItemName').classList.add('error'); return; }
    document.getElementById('shoppingItemName').classList.remove('error');
    addShoppingItem(name,document.getElementById('shoppingItemQty').value||1); closeModal('shoppingModal'); renderFinancial();
  });
  document.getElementById('shoppingItemName').addEventListener('keydown', function(e){ if(e.key==='Enter')document.getElementById('saveShopping').click(); });

  // Money Making
  document.getElementById('addMoneyIdeaBtn').addEventListener('click',    function(){ state.editMoneyIdeaId=null; document.getElementById('moneyIdeaModalTitle').textContent='Add Idea'; document.getElementById('moneyIdeaName').value=''; document.getElementById('moneyIdeaStatus').value='idea'; document.getElementById('moneyIdeaNotes').value=''; openModal('moneyIdeaModal'); setTimeout(function(){document.getElementById('moneyIdeaName').focus();},80); });
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

  // Calendar
  document.getElementById('calPrevBtn').addEventListener('click', function(){ state.calMonth--; if(state.calMonth<0){state.calMonth=11;state.calYear--;} renderCalendar(); });
  document.getElementById('calNextBtn').addEventListener('click', function(){ state.calMonth++; if(state.calMonth>11){state.calMonth=0;state.calYear++;} renderCalendar(); });
  document.getElementById('addCalEventBtn').addEventListener('click', function(){ openAddCalEvent(null); });
  document.getElementById('closeCalEventModal').addEventListener('click', function(){ closeModal('calEventModal'); });
  document.getElementById('cancelCalEvent').addEventListener('click',     function(){ closeModal('calEventModal'); });
  document.getElementById('saveCalEvent').addEventListener('click', saveCalEventModal);
  document.getElementById('closeDayDetailModal').addEventListener('click', function(){ closeModal('dayDetailModal'); });
  document.getElementById('calMonthViewBtn') && document.getElementById('calMonthViewBtn').addEventListener('click', function(){ renderCalendar(); });

  // Notes
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
  document.getElementById('folderName').addEventListener('keydown', function(e){ if(e.key==='Enter')saveFolderModal(); });

  // Close modals on backdrop
  document.querySelectorAll('.modal').forEach(function(m){ m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('open');}); });
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
  seedRoutineIfEmpty();
  seedFinancialIfEmpty();
  updateHeaderDate();
  loadHeaderHebrewDate();
  setInterval(updateHeaderDate,60000);
  initListeners();
  initSwipe();
  setDashView('seven'); // Default: open to 7-day view
}

document.addEventListener('DOMContentLoaded', init);
