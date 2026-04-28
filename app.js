'use strict';

// ============================================================
// COLOR OPTIONS (shared across tasks, notes, calendar events)
// ============================================================
const COLORS = [
  { name: 'Default',  value: '',           cls: 'cd-default', chipCls: '' },
  { name: 'Yellow',   value: '#fef9c3',    cls: '',           chipCls: 'cc-yellow',   taskCls: 'tc-yellow',   noteCls: 'nc-yellow'   },
  { name: 'Green',    value: '#d1fae5',    cls: '',           chipCls: 'cc-green',    taskCls: 'tc-green',    noteCls: 'nc-green'    },
  { name: 'Teal',     value: '#ccfbf1',    cls: '',           chipCls: 'cc-teal',     taskCls: 'tc-teal',     noteCls: 'nc-teal'     },
  { name: 'Blue',     value: '#dbeafe',    cls: '',           chipCls: 'cc-blue',     taskCls: 'tc-blue',     noteCls: 'nc-blue'     },
  { name: 'Lavender', value: '#ede9fe',    cls: '',           chipCls: 'cc-lavender', taskCls: 'tc-lavender', noteCls: 'nc-lavender' },
  { name: 'Pink',     value: '#fce7f3',    cls: '',           chipCls: 'cc-pink',     taskCls: 'tc-pink',     noteCls: 'nc-pink'     },
  { name: 'Stone',    value: '#f3f4f6',    cls: '',           chipCls: 'cc-stone',    taskCls: 'tc-stone',    noteCls: 'nc-stone'    },
];

function colorByValue(val) {
  return COLORS.find(function(c) { return c.value === val; }) || COLORS[0];
}

// ============================================================
// STATE
// ============================================================
const state = {
  // Dashboard
  view: 'single',
  dayOffset: 0,
  weekStart: 0,
  editTaskId: null,
  editTaskDate: null,
  editRoutineId: null,
  selectedTaskColor: '',
  // Calendar
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  calView: 'month',
  editCalEventId: null,
  selectedCalEventColor: '',
  pendingCalDate: null,
  // Notes
  activeFolderId: 'all',
  editNoteId: null,
  selectedNoteColor: '',
  noteType: 'text',
  noteCheckItems: [],
  editFolderId: null,
  notesSearchQuery: '',
  // Shared
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
    tasks:    JSON.parse(localStorage.getItem('dm_tasks')    || '{}'),
    routine:  JSON.parse(localStorage.getItem('dm_routine')  || '[]'),
    calEvents:JSON.parse(localStorage.getItem('dm_calEvents')|| '[]'),
    notes:    JSON.parse(localStorage.getItem('dm_notes')    || '[]'),
    folders:  JSON.parse(localStorage.getItem('dm_folders')  || '[]'),
  };
}
function saveT(v)  { localStorage.setItem('dm_tasks',     JSON.stringify(v)); }
function saveR(v)  { localStorage.setItem('dm_routine',   JSON.stringify(v)); }
function saveCE(v) { localStorage.setItem('dm_calEvents', JSON.stringify(v)); }
function saveN(v)  { localStorage.setItem('dm_notes',     JSON.stringify(v)); }
function saveF(v)  { localStorage.setItem('dm_folders',   JSON.stringify(v)); }
function uid()     { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ============================================================
// DATE HELPERS
// ============================================================
function dateFromOffset(n) {
  var d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
function toDateStr(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}
function fromDateStr(s) {
  var parts = s.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}
function isToday(date) { return date.toDateString() === new Date().toDateString(); }
function fmt12(t) {
  if (!t) return '';
  var parts = t.split(':').map(Number);
  var h = parts[0], m = parts[1];
  return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + ' ' + (h >= 12 ? 'PM' : 'AM');
}
function fmtISO(iso) {
  if (!iso) return '—';
  var d = new Date(iso);
  var h = d.getHours(), m = d.getMinutes();
  return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + ' ' + (h >= 12 ? 'PM' : 'AM');
}
function dayName(d)       { return d.toLocaleDateString('en-US', { weekday: 'long' }); }
function shortDay(d)      { return d.toLocaleDateString('en-US', { weekday: 'short' }); }
function monthDay(d)      { return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
function shortMonthDay(d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
// ZMANIM
// ============================================================
async function getUserLoc() {
  if (state.location) return state.location;
  var fallback = { lat: 40.7128, lng: -74.0060, tz: 'America/New_York' };
  return new Promise(function(resolve) {
    if (!navigator.geolocation) { state.location = fallback; resolve(fallback); return; }
    navigator.geolocation.getCurrentPosition(
      function(p) {
        state.location = { lat: p.coords.latitude, lng: p.coords.longitude, tz: Intl.DateTimeFormat().resolvedOptions().timeZone };
        resolve(state.location);
      },
      function() { state.location = fallback; resolve(fallback); },
      { timeout: 7000 }
    );
  });
}
async function fetchZmanim(ds) {
  if (state.zmanimCache[ds]) return state.zmanimCache[ds];
  var loc = await getUserLoc();
  try {
    var url = 'https://www.hebcal.com/zmanim?cfg=json&latitude=' + loc.lat + '&longitude=' + loc.lng + '&tzid=' + encodeURIComponent(loc.tz) + '&date=' + ds;
    var res  = await fetch(url);
    var json = await res.json();
    state.zmanimCache[ds] = json.times || null;
    return state.zmanimCache[ds];
  } catch(e) { return null; }
}
async function loadZstrip(ds) {
  var times = await fetchZmanim(ds);
  var el = document.getElementById('zs-' + ds);
  if (!el) return;
  if (!times) { el.innerHTML = '<span class="z-loading">Times unavailable</span><span class="z-expand">Tap ›</span>'; return; }
  el.innerHTML =
    '<span class="z-label">Shema:</span><span class="z-time">' + fmtISO(times.sofZmanShmaGRA) + '</span>' +
    '<span class="z-label">Sunset:</span><span class="z-time">' + fmtISO(times.sunset) + '</span>' +
    '<span class="z-expand">Tap for all times ›</span>';
}
function zmanimFullHTML(times) {
  if (!times) return '<p style="color:#aaa;text-align:center;padding:12px 0">Times unavailable.</p>';
  var rows = [
    ['Sof Zman Shema (GRA)', times.sofZmanShmaGRA],
    ['Sof Zman Shema (MGA)', times.sofZmanShmaMGA],
    ['Sof Zman Tefillah',    times.sofZmanTfillaGRA || times.sofZmanTfilla],
    ['Mincha Gedolah',       times.minchaGedola],
    ['Plag HaMincha',        times.plagHaMincha],
    ['Sunset',               times.sunset],
    ['Tzait Hakochavim',     times.tzeit7083deg || times.tzeit],
  ];
  return rows.map(function(r) {
    return '<div class="zmanim-row"><span class="zmanim-row-name">' + r[0] + '</span><span class="zmanim-row-time">' + fmtISO(r[1]) + '</span></div>';
  }).join('');
}

// ============================================================
// HEBREW DATE
// ============================================================
async function fetchHebrewDate(ds) {
  if (state.hebrewCache[ds]) return state.hebrewCache[ds];
  var parts = ds.split('-');
  try {
    var url = 'https://www.hebcal.com/converter?cfg=json&gy=' + parts[0] + '&gm=' + parts[1] + '&gd=' + parts[2] + '&g2h=1';
    var res  = await fetch(url);
    var json = await res.json();
    var result = json.hd + ' ' + json.hm + ' ' + json.hy;
    state.hebrewCache[ds] = result;
    return result;
  } catch(e) { return null; }
}
async function loadHebrewDate(ds) {
  var hdate = await fetchHebrewDate(ds);
  var el = document.getElementById('hdate-' + ds);
  if (el && hdate) el.textContent = hdate;
}
async function loadCalHdate(ds) {
  var hdate = await fetchHebrewDate(ds);
  var el = document.getElementById('chd-' + ds);
  if (el && hdate) {
    // Show just day number + abbreviated month from Hebrew date
    var hdParts = hdate.split(' ');
    el.textContent = hdParts[0] + ' ' + (hdParts[1] || '');
  }
}

// ============================================================
// TASKS
// ============================================================
function getTasksForDate(ds) {
  var data = getData();
  var dow  = fromDateStr(ds).getDay();
  var completions = (data.tasks[ds] || []).filter(function(t) { return t._rc; });
  var routineTasks = data.routine.filter(function(r) { return r.days.includes(dow); }).map(function(r) {
    var c = completions.find(function(c) { return c._rc === r.id; });
    return { id: r.id, title: r.title, time: r.time, location: r.location, color: '', type: 'routine', done: c ? c.done : false };
  });
  var oneTasks = (data.tasks[ds] || []).filter(function(t) { return !t._rc; });
  var all = routineTasks.concat(oneTasks);
  var inc = all.filter(function(t) { return !t.done; });
  var don = all.filter(function(t) { return t.done; });
  var withT = inc.filter(function(t) { return t.time; }).sort(function(a, b) { return a.time.localeCompare(b.time); });
  return withT.concat(inc.filter(function(t) { return !t.time; })).concat(don);
}
function toggleDone(ds, id, isRoutine) {
  var data = getData();
  if (!data.tasks[ds]) data.tasks[ds] = [];
  if (isRoutine) {
    var ex = data.tasks[ds].find(function(t) { return t._rc === id; });
    if (ex) { ex.done = !ex.done; ex.doneAt = ex.done ? new Date().toISOString() : null; }
    else data.tasks[ds].push({ id: uid(), _rc: id, done: true, doneAt: new Date().toISOString() });
  } else {
    var t = data.tasks[ds].find(function(t) { return t.id === id; });
    if (t) { t.done = !t.done; t.doneAt = t.done ? new Date().toISOString() : null; }
  }
  saveT(data.tasks);
}
function addTask(ds, d) {
  var data = getData();
  if (!data.tasks[ds]) data.tasks[ds] = [];
  data.tasks[ds].push({ id: uid(), type: 'once', title: d.title, time: d.time || '', location: d.location || '', notes: d.notes || '', reminder: d.reminder || '', color: d.color || '', done: false, createdAt: new Date().toISOString() });
  saveT(data.tasks);
}
function updateTask(ds, id, d) {
  var data = getData();
  var t = (data.tasks[ds] || []).find(function(t) { return t.id === id; });
  if (t) { t.title = d.title; t.time = d.time || ''; t.location = d.location || ''; t.notes = d.notes || ''; t.reminder = d.reminder || ''; t.color = d.color || ''; }
  saveT(data.tasks);
}
function deleteTask(ds, id) {
  var data = getData();
  if (data.tasks[ds]) data.tasks[ds] = data.tasks[ds].filter(function(t) { return t.id !== id; });
  saveT(data.tasks);
}

// ============================================================
// ROUTINE
// ============================================================
function addRoutineItem(d)    { var data = getData(); data.routine.push({ id: uid(), title: d.title, time: d.time || '', location: d.location || '', days: d.days }); saveR(data.routine); }
function updateRoutineItem(id, d) { var data = getData(); var r = data.routine.find(function(r) { return r.id === id; }); if (r) { r.title = d.title; r.time = d.time || ''; r.location = d.location || ''; r.days = d.days; } saveR(data.routine); }
function deleteRoutineItem(id) { var data = getData(); saveR(data.routine.filter(function(r) { return r.id !== id; })); }

// ============================================================
// CALENDAR EVENTS
// ============================================================
function getEventsForDate(ds) {
  return getData().calEvents.filter(function(e) { return e.date === ds; });
}
function addCalEvent(d) {
  var data = getData();
  data.calEvents.push({ id: uid(), title: d.title, date: d.date, time: d.time || '', color: d.color || '', fromTask: false });
  saveCE(data.calEvents);
}
function updateCalEvent(id, d) {
  var data = getData();
  var e = data.calEvents.find(function(e) { return e.id === id; });
  if (e) { e.title = d.title; e.date = d.date; e.time = d.time || ''; e.color = d.color || ''; }
  saveCE(data.calEvents);
}
function deleteCalEvent(id) {
  var data = getData();
  saveCE(data.calEvents.filter(function(e) { return e.id !== id; }));
}

// ============================================================
// NOTES & FOLDERS
// ============================================================
function addFolder(name, parentId) {
  var data = getData();
  data.folders.push({ id: uid(), name: name, parentId: parentId || null });
  saveF(data.folders);
}
function deleteFolder(id) {
  var data = getData();
  // Move notes in this folder to root
  data.notes.forEach(function(n) { if (n.folderId === id) n.folderId = null; });
  saveN(data.notes);
  data.folders = data.folders.filter(function(f) { return f.id !== id && f.parentId !== id; });
  saveF(data.folders);
}
function addNote(d) {
  var data = getData();
  data.notes.push({ id: uid(), type: d.type, title: d.title, content: d.content || '', items: d.items || [], folderId: d.folderId || null, color: d.color || '', pinned: d.pinned || false, archived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  saveN(data.notes);
}
function updateNote(id, d) {
  var data = getData();
  var n = data.notes.find(function(n) { return n.id === id; });
  if (n) { n.type = d.type; n.title = d.title; n.content = d.content || ''; n.items = d.items || []; n.folderId = d.folderId || null; n.color = d.color || ''; n.pinned = d.pinned || false; n.updatedAt = new Date().toISOString(); }
  saveN(data.notes);
}
function deleteNote(id) {
  var data = getData();
  saveN(data.notes.filter(function(n) { return n.id !== id; }));
}
function toggleNotePin(id) {
  var data = getData();
  var n = data.notes.find(function(n) { return n.id === id; });
  if (n) n.pinned = !n.pinned;
  saveN(data.notes);
}

// ============================================================
// COLOR PICKER BUILDER
// ============================================================
function buildColorPicker(containerId, selectedVal, onSelect) {
  var el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  COLORS.forEach(function(c) {
    var dot = document.createElement('div');
    dot.className = 'color-dot' + (c.value === '' ? ' cd-default' : '');
    if (c.value === selectedVal) dot.classList.add('selected');
    if (c.value) dot.style.background = c.value;
    dot.title = c.name;
    dot.addEventListener('click', function() {
      el.querySelectorAll('.color-dot').forEach(function(d) { d.classList.remove('selected'); });
      dot.classList.add('selected');
      onSelect(c.value);
    });
    el.appendChild(dot);
  });
}

// ============================================================
// RENDER — TASK ITEM
// ============================================================
function taskHTML(task, ds) {
  var isR = task.type === 'routine';
  var colorObj = colorByValue(task.color || '');
  var colorClass = isR ? 'is-routine' : (colorObj.taskCls || '');
  var tb = task.time     ? '<span class="badge badge-time">' + fmt12(task.time)      + '</span>' : '';
  var lb = task.location ? '<span class="badge badge-loc">'  + escHtml(task.location)+ '</span>' : '';
  var eb = !isR ? '<button class="btn-icon" onclick="openEditTask(\'' + ds + '\',\'' + task.id + '\')">✏️</button>' : '';
  var db = !isR ? '<button class="btn-icon" onclick="removeTask(\'' + ds + '\',\'' + task.id + '\')">🗑</button>' : '';
  return '<div class="task-item ' + colorClass + (task.done ? ' is-done' : '') + '" id="ti-' + task.id + '">' +
    '<input type="checkbox" class="task-check"' + (task.done ? ' checked' : '') + ' onchange="checkTask(\'' + ds + '\',\'' + task.id + '\',' + isR + ')">' +
    '<div class="task-body"><div class="task-title">' + escHtml(task.title) + '</div>' +
    '<div class="task-meta">' + tb + lb + '</div></div>' +
    '<div class="task-actions">' + eb + db + '</div></div>';
}

// ============================================================
// RENDER — DAY CARD
// ============================================================
function dayCardHTML(date, compact) {
  var ds    = toDateStr(date);
  var today = isToday(date);
  var tasks = getTasksForDate(ds);
  var chip  = today ? ' <span class="today-chip">Today</span>' : '';
  var head  = compact
    ? '<div class="day-card-name">' + shortDay(date) + chip + '</div><div class="day-card-label">' + shortMonthDay(date) + '</div><div class="day-card-hdate" id="hdate-' + ds + '">...</div>'
    : '<div class="day-card-name">' + dayName(date) + chip + '</div><div class="day-card-label">' + monthDay(date) + '</div><div class="day-card-hdate" id="hdate-' + ds + '">...</div>';
  var tHTML = tasks.length
    ? tasks.map(function(t) { return taskHTML(t, ds); }).join('')
    : '<div class="empty-tasks">No tasks yet</div>';
  return '<div class="day-card' + (today ? ' is-today' : '') + '">' +
    '<div class="day-card-head">' + head + '</div>' +
    '<div class="zmanim-strip" onclick="openZmanim(\'' + ds + '\')">' +
      '<div id="zs-' + ds + '" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;width:100%">' +
        '<span class="z-loading">Loading times…</span><span class="z-expand">Tap for all times ›</span>' +
      '</div></div>' +
    '<div class="task-list">' + tHTML + '</div>' +
    '<button class="add-task-row" onclick="openAddTask(\'' + ds + '\')">+ Add task or event</button>' +
    '</div>';
}

// ============================================================
// RENDER — DASHBOARD VIEWS
// ============================================================
function renderSingle() {
  var date = dateFromOffset(state.dayOffset);
  var ds   = toDateStr(date);
  document.getElementById('singleDayContainer').innerHTML = dayCardHTML(date, false);
  loadZstrip(ds);
  loadHebrewDate(ds);
  document.getElementById('backToTodayBtn').style.display = state.dayOffset === 0 ? 'none' : '';
}
function renderSeven() {
  var s = state.weekStart;
  var dates = [];
  var html  = '';
  for (var i = s; i < s + 7; i++) {
    var d = dateFromOffset(i);
    dates.push(d);
    html += dayCardHTML(d, true);
  }
  document.getElementById('sevenDayGrid').innerHTML = html;
  dates.forEach(function(d) {
    var ds = toDateStr(d);
    loadZstrip(ds);
    loadHebrewDate(ds);
  });
  document.getElementById('prevWeekBtn').style.display = s <= 0 ? 'none' : '';
}
function refresh() { state.view === 'single' ? renderSingle() : renderSeven(); }

function toggleView() {
  if (state.view === 'single') {
    state.view = 'seven'; state.weekStart = 0;
    document.getElementById('singleDayView').classList.remove('active');
    document.getElementById('sevenDayView').classList.add('active');
    document.getElementById('toggleViewBtn').textContent = 'Today View';
    document.getElementById('toggleViewBtn').classList.add('active');
    renderSeven();
  } else {
    state.view = 'single';
    document.getElementById('sevenDayView').classList.remove('active');
    document.getElementById('singleDayView').classList.add('active');
    document.getElementById('toggleViewBtn').textContent = '7-Day View';
    document.getElementById('toggleViewBtn').classList.remove('active');
    renderSingle();
  }
}

// ============================================================
// RENDER — CALENDAR (monthly)
// ============================================================
function renderCalendar() {
  var year  = state.calYear;
  var month = state.calMonth;
  var now   = new Date();

  document.getElementById('calMonthLabel').textContent =
    new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  var firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var daysInPrevMonth = new Date(year, month, 0).getDate();

  var grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  var totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  var hdatesToLoad = [];

  for (var i = 0; i < totalCells; i++) {
    var cell = document.createElement('div');
    cell.className = 'cal-cell';

    var dayNum, cellDate, otherMonth = false;
    if (i < firstDay) {
      dayNum = daysInPrevMonth - firstDay + i + 1;
      cellDate = new Date(year, month - 1, dayNum);
      otherMonth = true;
    } else if (i >= firstDay + daysInMonth) {
      dayNum = i - firstDay - daysInMonth + 1;
      cellDate = new Date(year, month + 1, dayNum);
      otherMonth = true;
    } else {
      dayNum = i - firstDay + 1;
      cellDate = new Date(year, month, dayNum);
    }

    if (otherMonth) cell.classList.add('other-month');
    if (cellDate.toDateString() === now.toDateString()) cell.classList.add('is-today');

    var ds = toDateStr(cellDate);

    // Day number
    var numEl = document.createElement('div');
    numEl.className = 'cal-cell-top';
    numEl.innerHTML = '<div class="cal-day-num">' + dayNum + '</div><div class="cal-hdate" id="chd-' + ds + '"></div>';
    cell.appendChild(numEl);

    // Events
    var events = getEventsForDate(ds);
    if (events.length) {
      var evDiv = document.createElement('div');
      evDiv.className = 'cal-events';
      events.forEach(function(ev) {
        var c = colorByValue(ev.color);
        var chip = document.createElement('div');
        chip.className = 'cal-event-chip ' + (c.chipCls || '');
        chip.textContent = (ev.time ? fmt12(ev.time) + ' ' : '') + ev.title;
        chip.onclick = function(e) { e.stopPropagation(); openDayDetail(ds); };
        evDiv.appendChild(chip);
      });
      cell.appendChild(evDiv);
    }

    cell.addEventListener('click', function(capturedDs) {
      return function() { openDayDetail(capturedDs); };
    }(ds));

    grid.appendChild(cell);
    if (!otherMonth) hdatesToLoad.push(ds);
  }

  // Load Hebrew dates asynchronously
  hdatesToLoad.forEach(function(ds) { loadCalHdate(ds); });
}

// ============================================================
// RENDER — NOTES
// ============================================================
function renderNotesSidebar() {
  var data    = getData();
  var sidebar = document.getElementById('notesSidebar');
  var active  = state.activeFolderId;

  var html = '';
  html += '<div class="sidebar-item' + (active === 'all' ? ' active' : '') + '" onclick="setNoteFolder(\'all\')">📝 All Notes</div>';
  html += '<div class="sidebar-item' + (active === 'pinned' ? ' active' : '') + '" onclick="setNoteFolder(\'pinned\')">📌 Pinned</div>';
  html += '<hr class="sidebar-divider">';

  // Build folder tree
  var topFolders = data.folders.filter(function(f) { return !f.parentId; });
  topFolders.forEach(function(f) {
    html += '<div class="sidebar-item folder-item' + (active === f.id ? ' active' : '') + '" onclick="setNoteFolder(\'' + f.id + '\')">' +
      '📁 ' + escHtml(f.name) +
      '<button class="btn-icon" style="margin-left:auto;font-size:12px;opacity:0.5" onclick="event.stopPropagation();removeFolder(\'' + f.id + '\')">✕</button>' +
      '</div>';
    var subs = data.folders.filter(function(sf) { return sf.parentId === f.id; });
    subs.forEach(function(sf) {
      html += '<div class="sidebar-item subfolder-item' + (active === sf.id ? ' active' : '') + '" onclick="setNoteFolder(\'' + sf.id + '\')">' +
        '↳ ' + escHtml(sf.name) +
        '<button class="btn-icon" style="margin-left:auto;font-size:12px;opacity:0.5" onclick="event.stopPropagation();removeFolder(\'' + sf.id + '\')">✕</button>' +
        '</div>';
    });
  });

  html += '<hr class="sidebar-divider">';
  html += '<div class="sidebar-add-folder" onclick="openFolderModal()">+ New Folder</div>';

  sidebar.innerHTML = html;
}

function renderNotesMain() {
  var data  = getData();
  var main  = document.getElementById('notesMain');
  var query = state.notesSearchQuery.toLowerCase();

  var notes = data.notes.filter(function(n) {
    if (n.archived) return false;
    if (query) {
      return (n.title + ' ' + n.content + ' ' + n.items.map(function(i) { return i.text; }).join(' ')).toLowerCase().includes(query);
    }
    if (state.activeFolderId === 'pinned') return n.pinned;
    if (state.activeFolderId === 'all') return true;
    return n.folderId === state.activeFolderId;
  });

  var pinned  = notes.filter(function(n) { return n.pinned; });
  var regular = notes.filter(function(n) { return !n.pinned; });

  if (!notes.length) {
    main.innerHTML = '<div class="notes-empty"><div class="notes-empty-icon">📝</div><p>No notes here yet.<br>Click "+ New Note" to add one.</p></div>';
    return;
  }

  var html = '';
  if (pinned.length) {
    html += '<div class="notes-section-label">📌 Pinned</div>';
    html += '<div class="notes-grid">' + pinned.map(noteCardHTML).join('') + '</div>';
  }
  if (regular.length) {
    if (pinned.length) html += '<div class="notes-section-label" style="margin-top:8px">Other notes</div>';
    html += '<div class="notes-grid">' + regular.map(noteCardHTML).join('') + '</div>';
  }

  main.innerHTML = html;
}

function noteCardHTML(note) {
  var c = colorByValue(note.color);
  var colorClass = c.noteCls ? ' ' + c.noteCls : '';
  var contentHTML = '';
  if (note.type === 'checklist') {
    contentHTML = '<div class="note-card-content">' +
      note.items.slice(0, 5).map(function(item) {
        return '<div class="note-checklist-item' + (item.done ? ' done' : '') + '">' +
          '<input type="checkbox"' + (item.done ? ' checked' : '') + ' disabled> <span>' + escHtml(item.text) + '</span></div>';
      }).join('') +
      (note.items.length > 5 ? '<div style="font-size:12px;color:#aaa;margin-top:4px">+' + (note.items.length - 5) + ' more</div>' : '') +
      '</div>';
  } else {
    contentHTML = '<div class="note-card-content">' + escHtml(note.content || '') + '</div>';
  }
  return '<div class="note-card' + colorClass + (note.pinned ? ' is-pinned' : '') + '">' +
    (note.pinned ? '<span class="note-pin-flag">📌</span>' : '') +
    (note.title  ? '<div class="note-card-title">' + escHtml(note.title) + '</div>' : '') +
    contentHTML +
    '<div class="note-card-actions">' +
      '<button class="btn-icon" onclick="openEditNote(\'' + note.id + '\')" title="Edit">✏️</button>' +
      '<button class="btn-icon" onclick="pinNote(\'' + note.id + '\')" title="Pin">' + (note.pinned ? '📌' : '📍') + '</button>' +
      '<button class="btn-icon" onclick="removeNote(\'' + note.id + '\')" title="Delete">🗑</button>' +
    '</div></div>';
}

function renderNotes() {
  renderNotesSidebar();
  renderNotesMain();
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.page-tab').forEach(function(t) { t.classList.remove('active'); });
  document.getElementById('page-' + pageId).classList.add('active');
  var activeTab = document.querySelector('.page-tab[data-page="' + pageId + '"]');
  if (activeTab) activeTab.classList.add('active');
  // Show/hide dashboard-only header buttons
  var toggleBtn  = document.getElementById('toggleViewBtn');
  var routineBtn = document.getElementById('routineBtn');
  if (toggleBtn)  toggleBtn.style.display  = pageId === 'dashboard' ? '' : 'none';
  if (routineBtn) routineBtn.style.display = pageId === 'dashboard' ? '' : 'none';
  state.currentPage = pageId;
  if (pageId === 'calendar') renderCalendar();
  if (pageId === 'notes')    renderNotes();
}

// ============================================================
// GLOBAL CALLBACKS (called from inline onclick)
// ============================================================
window.checkTask = function(ds, id, isR) { toggleDone(ds, id, isR); refresh(); };
window.removeTask = function(ds, id) { if (confirm('Delete this task?')) { deleteTask(ds, id); refresh(); } };

window.openAddTask = function(ds) {
  state.editTaskId = null; state.editTaskDate = ds; state.selectedTaskColor = '';
  document.getElementById('taskModalTitle').textContent = 'Add Task or Event';
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskTime').value = '';
  document.getElementById('taskLocation').value = '';
  document.getElementById('taskNotes').value = '';
  document.getElementById('taskReminder').value = '';
  document.getElementById('taskAddToCalendar').checked = false;
  buildColorPicker('taskColorPicker', '', function(v) { state.selectedTaskColor = v; });
  openModal('taskModal');
  setTimeout(function() { document.getElementById('taskTitle').focus(); }, 80);
};
window.openEditTask = function(ds, id) {
  var data = getData();
  var t = (data.tasks[ds] || []).find(function(t) { return t.id === id; });
  if (!t) return;
  state.editTaskId = id; state.editTaskDate = ds; state.selectedTaskColor = t.color || '';
  document.getElementById('taskModalTitle').textContent = 'Edit Task';
  document.getElementById('taskTitle').value    = t.title;
  document.getElementById('taskTime').value     = t.time || '';
  document.getElementById('taskLocation').value = t.location || '';
  document.getElementById('taskNotes').value    = t.notes || '';
  document.getElementById('taskReminder').value = t.reminder || '';
  document.getElementById('taskAddToCalendar').checked = false;
  buildColorPicker('taskColorPicker', t.color || '', function(v) { state.selectedTaskColor = v; });
  openModal('taskModal');
};
window.openZmanim = async function(ds) {
  var date = fromDateStr(ds);
  document.getElementById('zmanimModalDate').textContent =
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ' — Zmanim';
  document.getElementById('zmanimModalBody').innerHTML = '<p style="color:#aaa;text-align:center;padding:20px">Loading…</p>';
  openModal('zmanimModal');
  var times = await fetchZmanim(ds);
  var body  = document.getElementById('zmanimModalBody');
  if (body) body.innerHTML = zmanimFullHTML(times);
};
window.openEditRoutineItem = function(id) {
  var data = getData();
  var r = data.routine.find(function(r) { return r.id === id; });
  if (!r) return;
  state.editRoutineId = id;
  document.getElementById('routineItemModalTitle').textContent = 'Edit Routine Task';
  document.getElementById('routineTitle').value    = r.title;
  document.getElementById('routineTime').value     = r.time || '';
  document.getElementById('routineLocation').value = r.location || '';
  document.querySelectorAll('input[name="rDay"]').forEach(function(cb) { cb.checked = r.days.includes(+cb.value); });
  openModal('routineItemModal');
};
window.removeRoutineItem = function(id) {
  if (confirm('Remove this routine task?')) { deleteRoutineItem(id); renderRoutineList(); refresh(); }
};
window.setNoteFolder = function(id) {
  state.activeFolderId = id;
  renderNotes();
};
window.openEditNote = function(id) {
  var data = getData();
  var n = data.notes.find(function(n) { return n.id === id; });
  if (!n) return;
  state.editNoteId = id; state.selectedNoteColor = n.color || ''; state.noteType = n.type;
  document.getElementById('noteModalTitle').textContent = 'Edit Note';
  document.getElementById('noteTitle').value = n.title || '';
  document.getElementById('notePinned').checked = n.pinned || false;
  setNoteType(n.type);
  document.getElementById('noteContent').value = n.content || '';
  state.noteCheckItems = (n.items || []).map(function(i) { return { id: uid(), text: i.text, done: i.done }; });
  renderCheckItems();
  buildColorPicker('noteColorPicker', n.color || '', function(v) { state.selectedNoteColor = v; });
  populateFolderSelect(n.folderId);
  openModal('noteModal');
};
window.pinNote = function(id) { toggleNotePin(id); renderNotes(); };
window.removeNote = function(id) { if (confirm('Delete this note?')) { deleteNote(id); renderNotes(); } };
window.removeFolder = function(id) { if (confirm('Delete this folder? Notes inside will be moved to All Notes.')) { deleteFolder(id); renderNotes(); } };
window.openDayDetail = function(ds) {
  var date = fromDateStr(ds);
  document.getElementById('dayDetailTitle').textContent =
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  var events = getEventsForDate(ds);
  var body   = document.getElementById('dayDetailBody');
  if (!events.length) {
    body.innerHTML = '<p style="color:#aaa;font-size:14px;padding:8px 0">No events on this day.</p>';
  } else {
    body.innerHTML = events.map(function(ev) {
      var c = colorByValue(ev.color);
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f2f2f2">' +
        '<div><strong style="font-size:14px">' + escHtml(ev.title) + '</strong>' +
        (ev.time ? '<div style="font-size:12px;color:#888;margin-top:2px">' + fmt12(ev.time) + '</div>' : '') +
        '</div>' +
        '<button class="btn-icon" onclick="removeCalEvent(\'' + ev.id + '\')">🗑</button>' +
        '</div>';
    }).join('');
  }
  state.pendingCalDate = ds;
  document.getElementById('addEventOnDay').onclick = function() {
    closeModal('dayDetailModal');
    openAddCalEvent(ds);
  };
  openModal('dayDetailModal');
};
window.removeCalEvent = function(id) {
  if (confirm('Delete this event?')) {
    deleteCalEvent(id);
    closeModal('dayDetailModal');
    renderCalendar();
  }
};

// ============================================================
// MODALS
// ============================================================
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function saveTaskModal() {
  var title = document.getElementById('taskTitle').value.trim();
  if (!title) { document.getElementById('taskTitle').classList.add('error'); document.getElementById('taskTitle').focus(); return; }
  document.getElementById('taskTitle').classList.remove('error');
  var d = {
    title:    title,
    time:     document.getElementById('taskTime').value,
    location: document.getElementById('taskLocation').value.trim(),
    notes:    document.getElementById('taskNotes').value.trim(),
    reminder: document.getElementById('taskReminder').value,
    color:    state.selectedTaskColor,
  };
  var addToCal = document.getElementById('taskAddToCalendar').checked;
  if (state.editTaskId) { updateTask(state.editTaskDate, state.editTaskId, d); }
  else { addTask(state.editTaskDate, d); }
  if (addToCal) {
    addCalEvent({ title: d.title, date: state.editTaskDate, time: d.time, color: d.color });
  }
  closeModal('taskModal');
  refresh();
}

function renderRoutineList() {
  var data = getData();
  var el   = document.getElementById('routineList');
  if (!data.routine.length) { el.innerHTML = '<p style="color:#aaa;font-size:14px">No routine tasks yet.</p>'; return; }
  var dn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  el.innerHTML = data.routine.map(function(r) {
    var days = r.days.length === 7 ? 'Every day' : r.days.map(function(d) { return dn[d]; }).join(', ');
    var meta = [days, r.time ? fmt12(r.time) : '', r.location].filter(Boolean).join(' · ');
    return '<div class="routine-row"><div><div class="routine-row-title">' + escHtml(r.title) + '</div><div class="routine-row-meta">' + escHtml(meta) + '</div></div>' +
      '<div class="routine-row-actions"><button class="btn-icon" onclick="openEditRoutineItem(\'' + r.id + '\')">✏️</button>' +
      '<button class="btn-icon" onclick="removeRoutineItem(\'' + r.id + '\')">🗑</button></div></div>';
  }).join('');
}

function saveRoutineModal() {
  var title = document.getElementById('routineTitle').value.trim();
  if (!title) { document.getElementById('routineTitle').classList.add('error'); document.getElementById('routineTitle').focus(); return; }
  document.getElementById('routineTitle').classList.remove('error');
  var days = Array.from(document.querySelectorAll('input[name="rDay"]:checked')).map(function(cb) { return +cb.value; });
  var d = { title: title, time: document.getElementById('routineTime').value, location: document.getElementById('routineLocation').value.trim(), days: days };
  state.editRoutineId ? updateRoutineItem(state.editRoutineId, d) : addRoutineItem(d);
  state.editRoutineId = null;
  closeModal('routineItemModal');
  renderRoutineList();
  refresh();
}

// Calendar event modal
function openAddCalEvent(ds) {
  state.editCalEventId = null; state.selectedCalEventColor = '';
  document.getElementById('calEventModalTitle').textContent = 'Add Event';
  document.getElementById('calEventTitle').value = '';
  document.getElementById('calEventDate').value  = ds || toDateStr(new Date());
  document.getElementById('calEventTime').value  = '';
  buildColorPicker('calEventColorPicker', '', function(v) { state.selectedCalEventColor = v; });
  openModal('calEventModal');
  setTimeout(function() { document.getElementById('calEventTitle').focus(); }, 80);
}
function saveCalEventModal() {
  var title = document.getElementById('calEventTitle').value.trim();
  if (!title) { document.getElementById('calEventTitle').classList.add('error'); document.getElementById('calEventTitle').focus(); return; }
  document.getElementById('calEventTitle').classList.remove('error');
  var d = { title: title, date: document.getElementById('calEventDate').value, time: document.getElementById('calEventTime').value, color: state.selectedCalEventColor };
  state.editCalEventId ? updateCalEvent(state.editCalEventId, d) : addCalEvent(d);
  closeModal('calEventModal');
  renderCalendar();
}

// Notes modal
function setNoteType(type) {
  state.noteType = type;
  document.getElementById('noteTypeText').classList.toggle('active',  type === 'text');
  document.getElementById('noteTypeCheck').classList.toggle('active', type === 'checklist');
  document.getElementById('noteTextArea').style.display  = type === 'text'      ? '' : 'none';
  document.getElementById('noteCheckArea').style.display = type === 'checklist' ? '' : 'none';
}
function renderCheckItems() {
  var container = document.getElementById('noteCheckItems');
  container.innerHTML = state.noteCheckItems.map(function(item, i) {
    return '<div class="check-input-row">' +
      '<input type="checkbox"' + (item.done ? ' checked' : '') + ' onchange="toggleCheckItem(' + i + ')">' +
      '<input type="text" value="' + escHtml(item.text) + '" placeholder="List item..." oninput="updateCheckItem(' + i + ', this.value)">' +
      '<button class="btn-icon" onclick="removeCheckItem(' + i + ')">✕</button>' +
      '</div>';
  }).join('');
}
window.toggleCheckItem = function(i) { state.noteCheckItems[i].done = !state.noteCheckItems[i].done; renderCheckItems(); };
window.updateCheckItem = function(i, v) { state.noteCheckItems[i].text = v; };
window.removeCheckItem = function(i) { state.noteCheckItems.splice(i, 1); renderCheckItems(); };

function populateFolderSelect(selectedId) {
  var data = getData();
  var sel  = document.getElementById('noteFolderSelect');
  sel.innerHTML = '<option value="">No folder</option>';
  data.folders.forEach(function(f) {
    var opt = document.createElement('option');
    opt.value = f.id; opt.textContent = f.name;
    if (f.id === selectedId) opt.selected = true;
    sel.appendChild(opt);
  });
}

function openNoteModal() {
  state.editNoteId = null; state.selectedNoteColor = ''; state.noteType = 'text';
  state.noteCheckItems = [];
  document.getElementById('noteModalTitle').textContent = 'New Note';
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('notePinned').checked = false;
  setNoteType('text');
  renderCheckItems();
  buildColorPicker('noteColorPicker', '', function(v) { state.selectedNoteColor = v; });
  populateFolderSelect(state.activeFolderId !== 'all' && state.activeFolderId !== 'pinned' ? state.activeFolderId : null);
  openModal('noteModal');
  setTimeout(function() { document.getElementById('noteTitle').focus(); }, 80);
}

function saveNoteModal() {
  var content = state.noteType === 'text' ? document.getElementById('noteContent').value.trim() : '';
  var title   = document.getElementById('noteTitle').value.trim();
  if (!title && !content && !state.noteCheckItems.length) {
    document.getElementById('noteTitle').classList.add('error'); return;
  }
  document.getElementById('noteTitle').classList.remove('error');
  var d = {
    type:     state.noteType,
    title:    title,
    content:  content,
    items:    state.noteType === 'checklist' ? state.noteCheckItems.filter(function(i) { return i.text.trim(); }) : [],
    folderId: document.getElementById('noteFolderSelect').value || null,
    color:    state.selectedNoteColor,
    pinned:   document.getElementById('notePinned').checked,
  };
  state.editNoteId ? updateNote(state.editNoteId, d) : addNote(d);
  state.editNoteId = null;
  closeModal('noteModal');
  renderNotes();
}

// Folder modal
function openFolderModal() {
  var data = getData();
  document.getElementById('folderName').value = '';
  var sel = document.getElementById('folderParent');
  sel.innerHTML = '<option value="">None (top-level)</option>';
  data.folders.filter(function(f) { return !f.parentId; }).forEach(function(f) {
    var opt = document.createElement('option');
    opt.value = f.id; opt.textContent = f.name;
    sel.appendChild(opt);
  });
  openModal('folderModal');
  setTimeout(function() { document.getElementById('folderName').focus(); }, 80);
}
function saveFolderModal() {
  var name = document.getElementById('folderName').value.trim();
  if (!name) { document.getElementById('folderName').classList.add('error'); return; }
  document.getElementById('folderName').classList.remove('error');
  addFolder(name, document.getElementById('folderParent').value || null);
  closeModal('folderModal');
  renderNotes();
}

// ============================================================
// SEED ROUTINE
// ============================================================
function seedRoutineIfEmpty() {
  var data = getData();
  if (data.routine.length > 0) return;
  var all = [0, 1, 2, 3, 4, 5, 6];
  [{ title: 'Shacharit', time: '07:00' }, { title: 'Mincha', time: '13:30' }, { title: 'Maariv', time: '21:30' }].forEach(function(s) {
    data.routine.push({ id: uid(), title: s.title, time: s.time, location: '', days: all });
  });
  saveR(data.routine);
}

// ============================================================
// SWIPE (iPhone)
// ============================================================
function initSwipe() {
  var startX = 0;
  var el = document.getElementById('singleDayView');
  el.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', function(e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) { state.dayOffset += diff > 0 ? 1 : -1; renderSingle(); }
  }, { passive: true });
}

// ============================================================
// EVENT LISTENERS
// ============================================================
function initListeners() {
  // Page navigation
  document.querySelectorAll('.page-tab').forEach(function(tab) {
    tab.addEventListener('click', function() { showPage(tab.dataset.page); });
  });

  // Dashboard controls
  document.getElementById('toggleViewBtn').addEventListener('click', toggleView);
  document.getElementById('routineBtn').addEventListener('click', function() { renderRoutineList(); openModal('routineModal'); });

  // Single day nav
  document.getElementById('prevDayBtn').addEventListener('click', function() { state.dayOffset--; renderSingle(); });
  document.getElementById('nextDayBtn').addEventListener('click', function() { state.dayOffset++; renderSingle(); });
  document.getElementById('backToTodayBtn').addEventListener('click', function() { state.dayOffset = 0; renderSingle(); });

  // 7-day nav
  document.getElementById('prevWeekBtn').addEventListener('click', function() { state.weekStart = Math.max(0, state.weekStart - 7); renderSeven(); });
  document.getElementById('prevDayBtn7').addEventListener('click', function() { state.weekStart = Math.max(0, state.weekStart - 1); renderSeven(); });
  document.getElementById('backToTodayWeekBtn').addEventListener('click', function() { state.weekStart = 0; renderSeven(); });
  document.getElementById('nextDayBtn7').addEventListener('click', function() { state.weekStart++; renderSeven(); });
  document.getElementById('nextWeekBtn').addEventListener('click', function() { state.weekStart += 7; renderSeven(); });

  // Task modal
  document.getElementById('closeTaskModal').addEventListener('click', function() { closeModal('taskModal'); });
  document.getElementById('cancelTask').addEventListener('click',     function() { closeModal('taskModal'); });
  document.getElementById('saveTask').addEventListener('click', saveTaskModal);
  document.getElementById('taskTitle').addEventListener('keydown', function(e) { if (e.key === 'Enter') saveTaskModal(); });

  // Routine modals
  document.getElementById('closeRoutineModal').addEventListener('click',     function() { closeModal('routineModal'); });
  document.getElementById('closeRoutineItemModal').addEventListener('click', function() { closeModal('routineItemModal'); });
  document.getElementById('cancelRoutineItem').addEventListener('click',     function() { closeModal('routineItemModal'); });
  document.getElementById('saveRoutineItem').addEventListener('click', saveRoutineModal);
  document.getElementById('addRoutineItemBtn').addEventListener('click', function() {
    state.editRoutineId = null;
    document.getElementById('routineItemModalTitle').textContent = 'Add Routine Task';
    document.getElementById('routineTitle').value = '';
    document.getElementById('routineTime').value = '';
    document.getElementById('routineLocation').value = '';
    document.querySelectorAll('input[name="rDay"]').forEach(function(cb) { cb.checked = false; });
    openModal('routineItemModal');
  });

  // Zmanim modal
  document.getElementById('closeZmanimModal').addEventListener('click', function() { closeModal('zmanimModal'); });

  // Calendar
  document.getElementById('calPrevBtn').addEventListener('click', function() {
    state.calMonth--; if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; } renderCalendar();
  });
  document.getElementById('calNextBtn').addEventListener('click', function() {
    state.calMonth++; if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; } renderCalendar();
  });
  document.getElementById('addCalEventBtn').addEventListener('click', function() { openAddCalEvent(null); });
  document.getElementById('closeCalEventModal').addEventListener('click', function() { closeModal('calEventModal'); });
  document.getElementById('cancelCalEvent').addEventListener('click',     function() { closeModal('calEventModal'); });
  document.getElementById('saveCalEvent').addEventListener('click', saveCalEventModal);
  document.getElementById('closeDayDetailModal').addEventListener('click', function() { closeModal('dayDetailModal'); });
  document.getElementById('calMonthViewBtn').addEventListener('click', function() {
    state.calView = 'month';
    document.getElementById('calMonthViewBtn').classList.add('active-view');
    document.getElementById('calWeekViewBtn').classList.remove('active-view');
    renderCalendar();
  });
  document.getElementById('calWeekViewBtn').addEventListener('click', function() {
    state.calView = 'month'; // week view coming soon — keep month for now
    alert('Week view coming soon!');
  });

  // Notes
  document.getElementById('addNoteBtn').addEventListener('click', openNoteModal);
  document.getElementById('closeNoteModal').addEventListener('click', function() { closeModal('noteModal'); });
  document.getElementById('cancelNote').addEventListener('click',     function() { closeModal('noteModal'); });
  document.getElementById('saveNote').addEventListener('click', saveNoteModal);
  document.getElementById('noteTypeText').addEventListener('click',  function() { setNoteType('text'); });
  document.getElementById('noteTypeCheck').addEventListener('click', function() { setNoteType('checklist'); });
  document.getElementById('addCheckItem').addEventListener('click', function() {
    state.noteCheckItems.push({ id: uid(), text: '', done: false });
    renderCheckItems();
    var inputs = document.getElementById('noteCheckItems').querySelectorAll('input[type="text"]');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });
  document.getElementById('notesSearch').addEventListener('input', function(e) {
    state.notesSearchQuery = e.target.value;
    renderNotesMain();
  });

  // Folder modal
  document.getElementById('closeFolderModal').addEventListener('click', function() { closeModal('folderModal'); });
  document.getElementById('cancelFolder').addEventListener('click',     function() { closeModal('folderModal'); });
  document.getElementById('saveFolder').addEventListener('click', saveFolderModal);
  document.getElementById('folderName').addEventListener('keydown', function(e) { if (e.key === 'Enter') saveFolderModal(); });

  // Close modals on backdrop
  document.querySelectorAll('.modal').forEach(function(m) {
    m.addEventListener('click', function(e) { if (e.target === m) m.classList.remove('open'); });
  });
}

// ============================================================
// INIT
// ============================================================
function updateHeaderDate() {
  var el = document.getElementById('headerDate');
  if (el) el.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function init() {
  seedRoutineIfEmpty();
  updateHeaderDate();
  setInterval(updateHeaderDate, 60000);
  initListeners();
  initSwipe();
  renderSingle();
}

document.addEventListener('DOMContentLoaded', init);
