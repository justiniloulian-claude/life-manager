'use strict';

// ============================================================
// STATE
// ============================================================
const state = {
  view: 'single',
  dayOffset: 0,
  weekStart: 0,
  editTaskId: null,
  editTaskDate: null,
  editRoutineId: null,
  zmanimCache: {},
  location: null,
};

// ============================================================
// DATA — reads/writes to browser storage
// ============================================================
function getData() {
  return {
    tasks:   JSON.parse(localStorage.getItem('dm_tasks')   || '{}'),
    routine: JSON.parse(localStorage.getItem('dm_routine') || '[]'),
  };
}
function saveT(tasks)   { localStorage.setItem('dm_tasks',   JSON.stringify(tasks)); }
function saveR(routine) { localStorage.setItem('dm_routine', JSON.stringify(routine)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ============================================================
// DATE HELPERS
// ============================================================
function dateFromOffset(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
function toDateStr(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}
function fromDateStr(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function isToday(date) {
  return date.toDateString() === new Date().toDateString();
}
function fmt12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + ' ' + (h >= 12 ? 'PM' : 'AM');
}
function fmtISO(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + ' ' + (h >= 12 ? 'PM' : 'AM');
}
function dayName(d)       { return d.toLocaleDateString('en-US', { weekday: 'long' }); }
function shortDay(d)      { return d.toLocaleDateString('en-US', { weekday: 'short' }); }
function monthDay(d)      { return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
function shortMonthDay(d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

// ============================================================
// ZMANIM — fetches from Hebcal (free, no API key needed)
// ============================================================
async function getUserLoc() {
  if (state.location) return state.location;
  const fallback = { lat: 40.7128, lng: -74.0060, tz: 'America/New_York' };
  return new Promise(function(resolve) {
    if (!navigator.geolocation) {
      state.location = fallback;
      resolve(fallback);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function(p) {
        state.location = {
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        resolve(state.location);
      },
      function() {
        state.location = fallback;
        resolve(fallback);
      },
      { timeout: 7000 }
    );
  });
}

async function fetchZmanim(ds) {
  if (state.zmanimCache[ds]) return state.zmanimCache[ds];
  const loc = await getUserLoc();
  try {
    const url = 'https://www.hebcal.com/zmanim?cfg=json' +
      '&latitude=' + loc.lat +
      '&longitude=' + loc.lng +
      '&tzid=' + encodeURIComponent(loc.tz) +
      '&date=' + ds;
    const res  = await fetch(url);
    const json = await res.json();
    state.zmanimCache[ds] = json.times || null;
    return state.zmanimCache[ds];
  } catch (e) {
    return null;
  }
}

async function loadZstrip(ds) {
  const times = await fetchZmanim(ds);
  const el = document.getElementById('zs-' + ds);
  if (!el) return;
  if (!times) {
    el.innerHTML = '<span class="z-loading">Times unavailable</span>' +
                   '<span class="z-expand">Tap for details &rsaquo;</span>';
    return;
  }
  el.innerHTML =
    '<span class="z-label">Shema:</span>' +
    '<span class="z-time">' + fmtISO(times.sofZmanShmaGRA) + '</span>' +
    '<span class="z-label">Sunset:</span>' +
    '<span class="z-time">' + fmtISO(times.sunset) + '</span>' +
    '<span class="z-expand">Tap for all times &rsaquo;</span>';
}

function zmanimFullHTML(times) {
  if (!times) return '<p style="color:#aaa;text-align:center;padding:12px 0">Times could not be loaded.</p>';
  const rows = [
    ['Sof Zman Shema (GRA)', times.sofZmanShmaGRA],
    ['Sof Zman Shema (MGA)', times.sofZmanShmaMGA],
    ['Sof Zman Tefillah',    times.sofZmanTfillaGRA || times.sofZmanTfilla],
    ['Mincha Gedolah',       times.minchaGedola],
    ['Plag HaMincha',        times.plagHaMincha],
    ['Sunset',               times.sunset],
    ['Tzait Hakochavim',     times.tzeit7083deg || times.tzeit],
  ];
  return rows.map(function(r) {
    return '<div class="zmanim-row">' +
      '<span class="zmanim-row-name">' + r[0] + '</span>' +
      '<span class="zmanim-row-time">' + fmtISO(r[1]) + '</span>' +
      '</div>';
  }).join('');
}

// ============================================================
// TASKS
// ============================================================
function getTasksForDate(ds) {
  const data = getData();
  const dow  = fromDateStr(ds).getDay();

  // Routine tasks that apply to this day of week
  const completions = (data.tasks[ds] || []).filter(function(t) { return t._rc; });
  const routineTasks = data.routine
    .filter(function(r) { return r.days.includes(dow); })
    .map(function(r) {
      const c = completions.find(function(c) { return c._rc === r.id; });
      return {
        id: r.id, title: r.title, time: r.time, location: r.location,
        type: 'routine', done: c ? c.done : false,
      };
    });

  // One-time tasks for this specific date
  const oneTasks = (data.tasks[ds] || []).filter(function(t) { return !t._rc; });

  // Sort: timed incomplete first, then untimed incomplete, then completed at bottom
  const all = routineTasks.concat(oneTasks);
  const inc = all.filter(function(t) { return !t.done; });
  const don = all.filter(function(t) { return t.done; });
  const withT = inc.filter(function(t) { return t.time; })
    .sort(function(a, b) { return a.time.localeCompare(b.time); });
  const noT = inc.filter(function(t) { return !t.time; });
  return withT.concat(noT).concat(don);
}

function toggleDone(ds, id, isRoutine) {
  const data = getData();
  if (!data.tasks[ds]) data.tasks[ds] = [];
  if (isRoutine) {
    const ex = data.tasks[ds].find(function(t) { return t._rc === id; });
    if (ex) {
      ex.done  = !ex.done;
      ex.doneAt = ex.done ? new Date().toISOString() : null;
    } else {
      data.tasks[ds].push({ id: uid(), _rc: id, done: true, doneAt: new Date().toISOString() });
    }
  } else {
    const t = data.tasks[ds].find(function(t) { return t.id === id; });
    if (t) { t.done = !t.done; t.doneAt = t.done ? new Date().toISOString() : null; }
  }
  saveT(data.tasks);
}

function addTask(ds, data) {
  const d = getData();
  if (!d.tasks[ds]) d.tasks[ds] = [];
  d.tasks[ds].push({
    id: uid(), type: 'once',
    title: data.title, time: data.time || '', location: data.location || '',
    notes: data.notes || '', reminder: data.reminder || '',
    done: false, createdAt: new Date().toISOString(),
  });
  saveT(d.tasks);
}

function updateTask(ds, id, data) {
  const d = getData();
  const t = (d.tasks[ds] || []).find(function(t) { return t.id === id; });
  if (t) {
    t.title    = data.title;
    t.time     = data.time || '';
    t.location = data.location || '';
    t.notes    = data.notes || '';
    t.reminder = data.reminder || '';
  }
  saveT(d.tasks);
}

function deleteTask(ds, id) {
  const d = getData();
  if (!d.tasks[ds]) return;
  d.tasks[ds] = d.tasks[ds].filter(function(t) { return t.id !== id; });
  saveT(d.tasks);
}

// ============================================================
// ROUTINE
// ============================================================
function addRoutineItem(data) {
  const d = getData();
  d.routine.push({
    id: uid(), title: data.title,
    time: data.time || '', location: data.location || '', days: data.days,
  });
  saveR(d.routine);
}

function updateRoutineItem(id, data) {
  const d = getData();
  const r = d.routine.find(function(r) { return r.id === id; });
  if (r) {
    r.title    = data.title;
    r.time     = data.time || '';
    r.location = data.location || '';
    r.days     = data.days;
  }
  saveR(d.routine);
}

function deleteRoutineItem(id) {
  const d = getData();
  saveR(d.routine.filter(function(r) { return r.id !== id; }));
}

// ============================================================
// RENDER — build HTML for each day card and task
// ============================================================
function taskHTML(task, ds) {
  const isR = task.type === 'routine';
  const tb  = task.time     ? '<span class="badge badge-time">' + fmt12(task.time) + '</span>' : '';
  const lb  = task.location ? '<span class="badge badge-loc">'  + escHtml(task.location) + '</span>' : '';
  const rb  = isR           ? '<span class="badge badge-rec">↻ Routine</span>' : '';
  const eb  = !isR ? '<button class="btn-icon" onclick="openEditTask(\'' + ds + '\',\'' + task.id + '\')" title="Edit">✏️</button>' : '';
  const db  = !isR ? '<button class="btn-icon" onclick="removeTask(\'' + ds + '\',\'' + task.id + '\')" title="Delete">🗑</button>' : '';

  return '<div class="task-item' + (task.done ? ' is-done' : '') + '" id="ti-' + task.id + '">' +
    '<input type="checkbox" class="task-check"' + (task.done ? ' checked' : '') +
    ' onchange="checkTask(\'' + ds + '\',\'' + task.id + '\',' + isR + ')">' +
    '<div class="task-body">' +
      '<div class="task-title">' + escHtml(task.title) + '</div>' +
      '<div class="task-meta">' + tb + lb + rb + '</div>' +
    '</div>' +
    '<div class="task-actions">' + eb + db + '</div>' +
    '</div>';
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function dayCardHTML(date, compact) {
  const ds    = toDateStr(date);
  const today = isToday(date);
  const tasks = getTasksForDate(ds);

  const chip = today ? ' <span class="today-chip">Today</span>' : '';
  const head = compact
    ? '<div class="day-card-label">' + shortMonthDay(date) + '</div>' +
      '<div class="day-card-name">'  + shortDay(date) + chip + '</div>'
    : '<div class="day-card-label">' + monthDay(date) + '</div>' +
      '<div class="day-card-name">'  + dayName(date)  + chip + '</div>';

  const tHTML = tasks.length
    ? tasks.map(function(t) { return taskHTML(t, ds); }).join('')
    : '<div class="empty-tasks">No tasks yet</div>';

  return '<div class="day-card' + (today ? ' is-today' : '') + '">' +
    '<div class="day-card-head">' + head + '</div>' +
    '<div class="zmanim-strip" onclick="openZmanim(\'' + ds + '\')">' +
      '<div id="zs-' + ds + '" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;width:100%">' +
        '<span class="z-loading">Loading times…</span>' +
        '<span class="z-expand">Tap for all times ›</span>' +
      '</div>' +
    '</div>' +
    '<div class="task-list">' + tHTML + '</div>' +
    '<button class="add-task-row" onclick="openAddTask(\'' + ds + '\')">+ Add task</button>' +
    '</div>';
}

// ============================================================
// RENDER VIEWS
// ============================================================
function renderSingle() {
  const date = dateFromOffset(state.dayOffset);
  document.getElementById('singleDayContainer').innerHTML = dayCardHTML(date, false);
  loadZstrip(toDateStr(date));
  document.getElementById('backToTodayBtn').style.display = state.dayOffset === 0 ? 'none' : '';
}

function renderSeven() {
  const s = state.weekStart;
  const dates = [];
  let html = '';
  for (let i = s; i < s + 7; i++) {
    const d = dateFromOffset(i);
    dates.push(d);
    html += dayCardHTML(d, true);
  }
  document.getElementById('sevenDayGrid').innerHTML = html;
  dates.forEach(function(d) { loadZstrip(toDateStr(d)); });
  document.getElementById('nextWeekBtn').textContent     = 'Days ' + (s + 2) + '–' + (s + 8) + ' →';
  document.getElementById('nextTwoWeeksBtn').textContent = 'Days ' + (s + 8) + '–' + (s + 14) + ' →';
  document.getElementById('prevWeekBtn').style.display   = s <= 0 ? 'none' : '';
}

function refresh() {
  state.view === 'single' ? renderSingle() : renderSeven();
}

// ============================================================
// GLOBAL CALLBACKS (called from inline onclick in rendered HTML)
// ============================================================
window.checkTask = function(ds, id, isR) {
  toggleDone(ds, id, isR);
  refresh();
};

window.removeTask = function(ds, id) {
  if (confirm('Delete this task?')) { deleteTask(ds, id); refresh(); }
};

window.openAddTask = function(ds) {
  state.editTaskId   = null;
  state.editTaskDate = ds;
  document.getElementById('taskModalTitle').textContent = 'Add Task';
  document.getElementById('taskTitle').value    = '';
  document.getElementById('taskTime').value     = '';
  document.getElementById('taskLocation').value = '';
  document.getElementById('taskNotes').value    = '';
  document.getElementById('taskReminder').value = '';
  openModal('taskModal');
  setTimeout(function() { document.getElementById('taskTitle').focus(); }, 80);
};

window.openEditTask = function(ds, id) {
  const data = getData();
  const t = (data.tasks[ds] || []).find(function(t) { return t.id === id; });
  if (!t) return;
  state.editTaskId   = id;
  state.editTaskDate = ds;
  document.getElementById('taskModalTitle').textContent = 'Edit Task';
  document.getElementById('taskTitle').value    = t.title;
  document.getElementById('taskTime').value     = t.time || '';
  document.getElementById('taskLocation').value = t.location || '';
  document.getElementById('taskNotes').value    = t.notes || '';
  document.getElementById('taskReminder').value = t.reminder || '';
  openModal('taskModal');
};

window.openZmanim = async function(ds) {
  const date = fromDateStr(ds);
  document.getElementById('zmanimModalDate').textContent =
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ' — Zmanim';
  document.getElementById('zmanimModalBody').innerHTML =
    '<p style="color:#aaa;text-align:center;padding:20px">Loading…</p>';
  openModal('zmanimModal');
  const times = await fetchZmanim(ds);
  const body  = document.getElementById('zmanimModalBody');
  if (body) body.innerHTML = zmanimFullHTML(times);
};

window.openEditRoutineItem = function(id) {
  const data = getData();
  const r = data.routine.find(function(r) { return r.id === id; });
  if (!r) return;
  state.editRoutineId = id;
  document.getElementById('routineItemModalTitle').textContent = 'Edit Routine Task';
  document.getElementById('routineTitle').value    = r.title;
  document.getElementById('routineTime').value     = r.time || '';
  document.getElementById('routineLocation').value = r.location || '';
  document.querySelectorAll('input[name="rDay"]').forEach(function(cb) {
    cb.checked = r.days.includes(+cb.value);
  });
  openModal('routineItemModal');
};

window.removeRoutineItem = function(id) {
  if (confirm('Remove this routine task? It will stop appearing on your dashboard.')) {
    deleteRoutineItem(id);
    renderRoutineList();
    refresh();
  }
};

// ============================================================
// MODALS
// ============================================================
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function saveTaskModal() {
  const title = document.getElementById('taskTitle').value.trim();
  if (!title) {
    document.getElementById('taskTitle').classList.add('error');
    document.getElementById('taskTitle').focus();
    return;
  }
  document.getElementById('taskTitle').classList.remove('error');
  const data = {
    title:    title,
    time:     document.getElementById('taskTime').value,
    location: document.getElementById('taskLocation').value.trim(),
    notes:    document.getElementById('taskNotes').value.trim(),
    reminder: document.getElementById('taskReminder').value,
  };
  if (state.editTaskId) {
    updateTask(state.editTaskDate, state.editTaskId, data);
  } else {
    addTask(state.editTaskDate, data);
  }
  closeModal('taskModal');
  refresh();
}

function renderRoutineList() {
  const data = getData();
  const el   = document.getElementById('routineList');
  if (!data.routine.length) {
    el.innerHTML = '<p style="color:#aaa;font-size:14px">No routine tasks yet. Add one above.</p>';
    return;
  }
  const dn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  el.innerHTML = data.routine.map(function(r) {
    const days = r.days.length === 7
      ? 'Every day'
      : r.days.map(function(d) { return dn[d]; }).join(', ');
    const meta = [days, r.time ? fmt12(r.time) : '', r.location].filter(Boolean).join(' · ');
    return '<div class="routine-row">' +
      '<div>' +
        '<div class="routine-row-title">' + escHtml(r.title) + '</div>' +
        '<div class="routine-row-meta">'  + escHtml(meta)    + '</div>' +
      '</div>' +
      '<div class="routine-row-actions">' +
        '<button class="btn-icon" onclick="openEditRoutineItem(\'' + r.id + '\')">✏️</button>' +
        '<button class="btn-icon" onclick="removeRoutineItem(\''   + r.id + '\')">🗑</button>' +
      '</div>' +
      '</div>';
  }).join('');
}

function saveRoutineModal() {
  const title = document.getElementById('routineTitle').value.trim();
  if (!title) {
    document.getElementById('routineTitle').classList.add('error');
    document.getElementById('routineTitle').focus();
    return;
  }
  document.getElementById('routineTitle').classList.remove('error');
  const days = Array.from(document.querySelectorAll('input[name="rDay"]:checked'))
    .map(function(cb) { return +cb.value; });
  const data = {
    title:    title,
    time:     document.getElementById('routineTime').value,
    location: document.getElementById('routineLocation').value.trim(),
    days:     days,
  };
  if (state.editRoutineId) {
    updateRoutineItem(state.editRoutineId, data);
  } else {
    addRoutineItem(data);
  }
  state.editRoutineId = null;
  closeModal('routineItemModal');
  renderRoutineList();
  refresh();
}

// ============================================================
// VIEW TOGGLE
// ============================================================
function toggleView() {
  if (state.view === 'single') {
    state.view      = 'seven';
    state.weekStart = Math.max(0, state.dayOffset);
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
// SWIPE SUPPORT (iPhone left/right swipe)
// ============================================================
function initSwipe() {
  var startX = 0;
  var el = document.getElementById('singleDayView');
  el.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  el.addEventListener('touchend', function(e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      state.dayOffset += diff > 0 ? 1 : -1;
      renderSingle();
    }
  }, { passive: true });
}

// ============================================================
// HEADER
// ============================================================
function updateHeaderDate() {
  document.getElementById('headerDate').textContent =
    new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
}

// ============================================================
// EVENT LISTENERS
// ============================================================
function initListeners() {
  // Header buttons
  document.getElementById('toggleViewBtn').addEventListener('click', toggleView);
  document.getElementById('routineBtn').addEventListener('click', function() {
    renderRoutineList();
    openModal('routineModal');
  });

  // Task modal
  document.getElementById('closeTaskModal').addEventListener('click', function() { closeModal('taskModal'); });
  document.getElementById('cancelTask').addEventListener('click',     function() { closeModal('taskModal'); });
  document.getElementById('saveTask').addEventListener('click', saveTaskModal);
  document.getElementById('taskTitle').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') saveTaskModal();
  });

  // Routine modal
  document.getElementById('closeRoutineModal').addEventListener('click', function() { closeModal('routineModal'); });
  document.getElementById('addRoutineItemBtn').addEventListener('click', function() {
    state.editRoutineId = null;
    document.getElementById('routineItemModalTitle').textContent = 'Add Routine Task';
    document.getElementById('routineTitle').value    = '';
    document.getElementById('routineTime').value     = '';
    document.getElementById('routineLocation').value = '';
    document.querySelectorAll('input[name="rDay"]').forEach(function(cb) { cb.checked = false; });
    openModal('routineItemModal');
  });
  document.getElementById('closeRoutineItemModal').addEventListener('click', function() { closeModal('routineItemModal'); });
  document.getElementById('cancelRoutineItem').addEventListener('click',     function() { closeModal('routineItemModal'); });
  document.getElementById('saveRoutineItem').addEventListener('click', saveRoutineModal);

  // Zmanim modal
  document.getElementById('closeZmanimModal').addEventListener('click', function() { closeModal('zmanimModal'); });

  // Single day navigation
  document.getElementById('prevDayBtn').addEventListener('click', function() {
    state.dayOffset--;
    renderSingle();
  });
  document.getElementById('nextDayBtn').addEventListener('click', function() {
    state.dayOffset++;
    renderSingle();
  });
  document.getElementById('backToTodayBtn').addEventListener('click', function() {
    state.dayOffset = 0;
    renderSingle();
  });

  // 7-day navigation
  document.getElementById('prevWeekBtn').addEventListener('click', function() {
    state.weekStart = Math.max(0, state.weekStart - 7);
    renderSeven();
  });
  document.getElementById('nextWeekBtn').addEventListener('click', function() {
    state.weekStart += 1;
    renderSeven();
  });
  document.getElementById('nextTwoWeeksBtn').addEventListener('click', function() {
    state.weekStart += 7;
    renderSeven();
  });
  document.getElementById('backToTodayWeekBtn').addEventListener('click', function() {
    state.weekStart = 0;
    renderSeven();
  });

  // Close any modal by clicking the dark backdrop behind it
  document.querySelectorAll('.modal').forEach(function(m) {
    m.addEventListener('click', function(e) {
      if (e.target === m) m.classList.remove('open');
    });
  });
}

// ============================================================
// INIT — runs when the page first loads
// ============================================================
function init() {
  updateHeaderDate();
  setInterval(updateHeaderDate, 60000);
  initListeners();
  initSwipe();
  renderSingle();
}

document.addEventListener('DOMContentLoaded', init);
