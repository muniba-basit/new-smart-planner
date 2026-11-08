/* =============================================
   SMART DAILY PLANNER — SCRIPT.JS 2025
   ============================================= */

// =====================
// STATE
// =====================
const API_URL    = 'http://localhost:5000';
let tasks        = [];
let calTasks     = {};
let timeBlocks   = {};
let currentFilter= 'all';
let currentCat   = 'all';
let currentSort  = 'newest';
let calDate      = new Date();
let selectedDate = null;
let charts       = {};

// =====================
// HELPERS
// =====================
function byId(id)    { return document.getElementById(id); }
function byQ(sel)    { return document.querySelector(sel); }
function byQA(sel)   { return document.querySelectorAll(sel); }
function esc(str)    { var d=document.createElement('div'); d.textContent=str; return d.innerHTML; }
function save()      {
    // We no longer save primary data to localStorage!
    // Only UI preferences like Theme should stay here.
}

async function fetchTasksFromServer() {
    try {
        // 1. Fetch Tasks
        const resTasks = await fetch(`${API_URL}/tasks`);
        const jsonTasks = await resTasks.json();
        
        if (jsonTasks.success) {
            // Map DB columns to Frontend property names
            tasks = (jsonTasks.data || []).map(t => ({
                id: t.id,
                text: t.title,
                completed: t.status === 'completed',
                category: t.category,
                priority: t.priority,
                due_date: t.due_date,
                createdAt: t.created_at ? new Date(t.created_at).getTime() : Date.now() // Ensure valid timestamp for sorting
            }));

            // Rebuild calTasks object for the calendar view
            calTasks = {};
            tasks.forEach(t => {
                if (t.due_date) {
                    const dateKey = t.due_date.split('T')[0];
                    if (!calTasks[dateKey]) calTasks[dateKey] = [];
                    calTasks[dateKey].push(t);
                }
            });
        }

        // 2. Fetch Time Blocks
        const resBlocks = await fetch(`${API_URL}/time-blocks`);
        if (resBlocks.ok) {
            const jsonBlocks = await resBlocks.json();
            timeBlocks = {};
            jsonBlocks.data.forEach(item => {
                if (!timeBlocks[item.time_slot]) timeBlocks[item.time_slot] = [];
                timeBlocks[item.time_slot].push(item.task_id);
            });
        }

        renderTasks();
        renderCalendar();
        renderTimeGrid(); // Fix: Actually draw the tasks into their time slots
        renderTray(); // Ensure Time Blocking tray is updated
        updateStats(); // Update statistics display
        updateCounts(); // Update category counts
    } catch (err) { console.error("Sync failed:", err); }
}

// =====================
// SIDEBAR
// =====================
byId('hamburger-btn').addEventListener('click', function() {
    byId('sidebar').classList.add('open');
    byId('sidebar-overlay').classList.add('show');
});
byId('sidebar-close').addEventListener('click', closeSidebar);
byId('sidebar-overlay').addEventListener('click', closeSidebar);

function closeSidebar() {
    byId('sidebar').classList.remove('open');
    byId('sidebar-overlay').classList.remove('show');
}

function handleResize() {
    if (window.innerWidth >= 1024) {
        byId('sidebar').classList.add('open');
        byId('sidebar-overlay').classList.remove('show');
    } else {
        byId('sidebar').classList.remove('open');
    }
}
window.addEventListener('resize', handleResize);

// =====================
// VIEW NAVIGATION
// =====================
byQA('.nav-item').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var view = btn.getAttribute('data-view');
        // update active nav
        byQA('.nav-item').forEach(function(n) {
            n.classList.remove('active');
            n.removeAttribute('aria-current');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
        // switch view
        byQA('.view').forEach(function(v) { v.classList.remove('active'); });
        var target = byId('view-' + view);
        if (target) target.classList.add('active');
        // init view
        if (view === 'analytics') renderAnalytics();
        if (view === 'timeblock') { renderTray(); renderTimeGrid(); }
        if (view === 'calendar')  renderCalendar();
        if (window.innerWidth < 1024) closeSidebar();
    });
});

// =====================
// THEME
// =====================
byId('theme-btn').addEventListener('click', function() {
    var isDark = document.body.getAttribute('data-theme') === 'dark';
    var next   = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('planner-theme', next);
    setThemeLabel(next);
});

function setThemeLabel(theme) {
    byId('theme-icon').textContent  = theme === 'dark' ? '☀️' : '🌙';
    byId('theme-label').textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

// =====================
// TOPBAR DATE
// =====================
function setDate() {
    var el = byId('topbar-date');
    if (el) el.textContent = new Date().toLocaleDateString('en-US',
        { weekday:'long', month:'long', day:'numeric', year:'numeric' });
}

// =====================
// ADD TASK
// =====================
byId('todo-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var text = byId('todo-input').value.trim();
    if (!text) return;

    const newTask = {
        title: text,
        category: byId('todo-category').value,
        priority: byId('todo-priority').value,
        status: 'pending'
    };

    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    });
    
    if (res.ok) {
        byId('todo-input').value = '';
        fetchTasksFromServer(); // Refresh everything
    }

    var btn = byId('add-btn');
    var origBg = btn.style.background;
    btn.textContent = '✓ Added!';
    btn.style.background = '#7FB3A8';
    setTimeout(function() { btn.textContent = '+ Add Task'; btn.style.background = origBg; }, 900);
});

// =====================
// TOGGLE / DELETE (called from onclick in HTML)
// =====================
window.toggleTask = async function(id) {
    const task = tasks.find(t => t.id === id);
    const newStatus = task.completed ? 'pending' : 'completed';
    
    await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    fetchTasksFromServer();
};

window.deleteTask = async function(id) {
    var li = byQ('[data-id="' + id + '"]');
    async function doDelete() {
        await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
        fetchTasksFromServer();
    }
    if (li) {
        li.style.transition = 'all .2s ease';
        li.style.opacity = '0';
        li.style.transform = 'translateX(20px)';
        setTimeout(doDelete, 200);
    } else {
        doDelete();
    }
};

// =====================
// RENDER TASKS
// =====================
function renderTasks() {
    var list = tasks.slice();

    // category filter
    if (currentCat !== 'all') {
        list = list.filter(function(t) { return t.category === currentCat; });
    }
    // status filter
    if (currentFilter === 'pending')   list = list.filter(function(t) { return !t.completed; });
    if (currentFilter === 'completed') list = list.filter(function(t) { return t.completed; });
    // sort
    var pOrder = { high:0, medium:1, low:2 };
    if (currentSort === 'newest')   list.sort(function(a,b){ return b.createdAt - a.createdAt; });
    if (currentSort === 'oldest')   list.sort(function(a,b){ return a.createdAt - b.createdAt; });
    if (currentSort === 'priority') list.sort(function(a,b){ return (pOrder[a.priority]||1)-(pOrder[b.priority]||1); });
    if (currentSort === 'category') list.sort(function(a,b){ return a.category.localeCompare(b.category); });

    var ul = byId('todo-list');
    ul.innerHTML = '';
    var empty = byId('empty-state');

    if (list.length === 0) {
        empty.classList.add('show');
    } else {
        empty.classList.remove('show');
        list.forEach(function(task) {
            var li = document.createElement('li');
            li.className = 'todo-item' + (task.completed ? ' completed' : '');
            li.setAttribute('data-id', task.id);
            li.setAttribute('data-priority', task.priority || 'medium');
            li.setAttribute('draggable', 'true');
            li.innerHTML =
                '<span class="drag-handle" aria-hidden="true">⠿</span>' +
                '<button class="task-check' + (task.completed ? ' done' : '') + '"' +
                  ' onclick="toggleTask(' + task.id + ')"' +
                  ' aria-label="' + (task.completed ? 'Mark pending' : 'Mark complete') + '">' +
                  (task.completed ? '✓' : '') +
                '</button>' +
                '<div class="task-body">' +
                  '<div class="task-text">' + esc(task.text) + '</div>' +
                  '<div class="task-meta">' +
                    '<span class="badge badge-cat ' + task.category + '">' + task.category + '</span>' +
                    '<span class="badge badge-priority ' + (task.priority||'medium') + '">' + (task.priority||'medium') + '</span>' +
                  '</div>' +
                '</div>' +
                '<div class="task-actions">' +
                  '<button class="task-btn del" onclick="deleteTask(' + task.id + ')" aria-label="Delete task">✕</button>' +
                '</div>';

            li.addEventListener('dragstart', dragStart);
            li.addEventListener('dragover',  dragOver);
            li.addEventListener('drop',      dragDrop);
            li.addEventListener('dragend',   dragEnd);
            ul.appendChild(li);
        });
    }
    updateStats();
    updateCounts();
}

// =====================
// STATS & COUNTS
// =====================
function updateStats() {
    var total   = tasks.length;
    var done    = tasks.filter(function(t){ return t.completed; }).length;
    var pending = total - done;
    var rate    = total === 0 ? 0 : Math.round(done / total * 100);
    var streak  = calcStreak();

    function set(id, val) { var el = byId(id); if (el) el.textContent = val; }
    set('stat-total',         total);
    set('stat-done',          done);
    set('stat-pending-count', pending);
    set('stat-rate',          rate + '%');
    set('sidebar-streak-val', streak);
}

function updateCounts() {
    var cats = ['all','General','Work','Personal','Health'];
    cats.forEach(function(cat) {
        var el = byId('cnt-' + cat);
        if (!el) return;
        el.textContent = cat === 'all'
            ? tasks.length
            : tasks.filter(function(t){ return t.category === cat; }).length;
    });
}

// =====================
// FILTERS / SORT / CAT
// =====================
byQA('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        byQA('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

byId('sort-select').addEventListener('change', function() {
    currentSort = this.value;
    renderTasks();
});

byQA('.cat-filter').forEach(function(btn) {
    btn.addEventListener('click', function() {
        byQA('.cat-filter').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        currentCat = btn.getAttribute('data-cat');
        renderTasks();
    });
});

// =====================
// DRAG & DROP — TASK REORDER
// =====================
var dragSrcEl = null;

function dragStart(e) {
    dragSrcEl = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
}
function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    byQA('.todo-item').forEach(function(i){ i.classList.remove('drag-over'); });
    if (this !== dragSrcEl) this.classList.add('drag-over');
}
function dragDrop(e) {
    e.stopPropagation();
    if (dragSrcEl && this !== dragSrcEl) {
        var srcId = parseInt(dragSrcEl.getAttribute('data-id'));
        var dstId = parseInt(this.getAttribute('data-id'));
        var si = tasks.findIndex(function(t){ return t.id === srcId; });
        var di = tasks.findIndex(function(t){ return t.id === dstId; });
        if (si !== -1 && di !== -1) {
            var item = tasks.splice(si, 1)[0];
            tasks.splice(di, 0, item);
            save();
            renderTasks();
        }
    }
}
function dragEnd() {
    byQA('.todo-item').forEach(function(i){ i.classList.remove('dragging','drag-over'); });
}

// =====================
// ANALYTICS
// =====================
function renderAnalytics() {
    var total  = tasks.length;
    var done   = tasks.filter(function(t){ return t.completed; }).length;
    var rate   = total === 0 ? 0 : Math.round(done / total * 100);
    var streak = calcStreak();

    function set(id, val) { var el = byId(id); if (el) el.textContent = val; }
    set('big-rate', rate + '%');
    set('analytics-streak', streak);
    set('sidebar-streak-val', streak);

    var bar = byId('rate-bar');
    if (bar) bar.style.width = rate + '%';

    renderDonut(done, total - done);
    renderCatChart();
    renderBurndown();
}

function killChart(key) {
    if (charts[key]) { try { charts[key].destroy(); } catch(e){} delete charts[key]; }
}

function renderDonut(done, pending) {
    var ctx = byId('productivityChart');
    if (!ctx) return;
    killChart('donut');
    charts.donut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed','Pending'],
            datasets: [{ data: [done, pending], backgroundColor: ['#A38A75','#B0C4DE'], borderWidth: 0 }]
        },
        options: { responsive:true, maintainAspectRatio:false, cutout:'68%',
            plugins: { legend: { position:'bottom', labels:{ font:{family:'DM Sans',size:12} } } } }
    });
}

function renderCatChart() {
    var ctx = byId('categoryChart');
    if (!ctx) return;
    killChart('cat');
    var cats = {};
    tasks.forEach(function(t){ cats[t.category] = (cats[t.category]||0)+1; });
    if (Object.keys(cats).length === 0) cats['No Tasks'] = 1;
    charts.cat = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(cats),
            datasets: [{ data: Object.values(cats), backgroundColor:['#A38A75','#8FAFC5','#7FB3A8','#C4A882'], borderWidth:0 }]
        },
        options: { responsive:true, maintainAspectRatio:false,
            plugins: { legend: { position:'bottom', labels:{ font:{family:'DM Sans',size:11}, boxWidth:12 } } } }
    });
}

function renderBurndown() {
    var ctx = byId('burndownChart');
    if (!ctx) return;
    killChart('burndown');
    var total  = Math.max(tasks.length, 1);
    var done   = tasks.filter(function(t){ return t.completed; }).length;
    var hours  = ['9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM'];
    var n      = hours.length;
    var ideal  = hours.map(function(_,i){ return +(total - (total/(n-1))*i).toFixed(1); });
    var actual = hours.map(function(_,i){ return Math.max(0, total - Math.floor(done/(n-1)*i)); });
    charts.burndown = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [
                { label:'Ideal', data:ideal, borderColor:'#B0C4DE', borderDash:[6,4], fill:false, tension:0, pointRadius:2 },
                { label:'Actual', data:actual, borderColor:'#A38A75', fill:true,
                  backgroundColor:'rgba(163,138,117,0.08)', tension:0.3, pointRadius:3, pointBackgroundColor:'#A38A75' }
            ]
        },
        options: { responsive:true, maintainAspectRatio:false,
            plugins: { legend:{ position:'bottom', labels:{ font:{family:'DM Sans',size:12}, boxWidth:14 } } },
            scales: {
                y: { beginAtZero:true, grid:{color:'rgba(163,138,117,0.1)'} },
                x: { grid:{display:false} }
            }
        }
    });
}

// =====================
// STREAK
// =====================
function calcStreak() {
    var lastDate = localStorage.getItem('planner-last-day');
    var today    = new Date().toDateString();
    var streak   = parseInt(localStorage.getItem('planner-streak') || '0');
    var hasDone  = tasks.some(function(t){ return t.completed; });
    if (hasDone && lastDate !== today) {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        streak = (lastDate === yesterday.toDateString()) ? streak + 1 : 1;
        localStorage.setItem('planner-last-day', today);
        localStorage.setItem('planner-streak', streak);
    }
    return streak;
}

// =====================
// CALENDAR
// =====================
byId('cal-prev').addEventListener('click', function() {
    calDate.setMonth(calDate.getMonth() - 1);
    renderCalendar();
});
byId('cal-next').addEventListener('click', function() {
    calDate.setMonth(calDate.getMonth() + 1);
    renderCalendar();
});
byId('cal-panel-close').addEventListener('click', function() {
    byId('cal-panel').classList.remove('open');
    selectedDate = null;
    renderCalendar();
});

function renderCalendar() {
    var y     = calDate.getFullYear();
    var m     = calDate.getMonth();
    var today = new Date();

    byId('cal-month-title').textContent = new Date(y, m, 1)
        .toLocaleDateString('en-US', { month:'long', year:'numeric' });

    var firstWday  = new Date(y, m, 1).getDay();
    var daysInMon  = new Date(y, m+1, 0).getDate();
    var daysInPrev = new Date(y, m, 0).getDate();

    var grid = byId('cal-grid');
    grid.innerHTML = '';

    for (var i = firstWday - 1; i >= 0; i--) {
        grid.appendChild(makeCalDay(y, m-1, daysInPrev - i, true));
    }
    for (var d = 1; d <= daysInMon; d++) {
        var isToday = (d === today.getDate() && m === today.getMonth() && y === today.getFullYear());
        grid.appendChild(makeCalDay(y, m, d, false, isToday));
    }
    var total = firstWday + daysInMon;
    for (var nd = 1; nd <= (42 - total); nd++) {
        grid.appendChild(makeCalDay(y, m+1, nd, true));
    }
}

function mkKey(y, m, d) {
    return y + '-' + String(m+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
}

function makeCalDay(y, m, d, otherMonth, isToday) {
    var key       = mkKey(y, m, d);
    var dayTasks  = calTasks[key] || [];
    var isSelected= selectedDate === key;

    var div = document.createElement('div');
    div.className =
        'cal-day' +
        (otherMonth    ? ' other-month' : '') +
        (isToday       ? ' today'       : '') +
        (dayTasks.length > 0 ? ' has-tasks' : '') +
        (isSelected    ? ' selected'    : '');

    var num = document.createElement('div');
    num.className   = 'cal-day-num';
    num.textContent = d;
    div.appendChild(num);

    if (!otherMonth) {
        dayTasks.slice(0,2).forEach(function(t) {
            var p = document.createElement('div');
            p.className   = 'cal-task-preview';
            p.textContent = t.text;
            div.appendChild(p);
        });
        div.style.cursor = 'pointer';
        div.addEventListener('click', function() { openCalPanel(key, d, m, y); });
    }
    return div;
}

function openCalPanel(key, d, m, y) {
    selectedDate = key;
    renderCalendar();
    var monthName = new Date(y, m, 1).toLocaleDateString('en-US', { month:'long' });
    byId('cal-panel-title').textContent = monthName + ' ' + d + ', ' + y;
    renderCalList(key);
    byId('cal-panel').classList.add('open');
    setTimeout(function(){ byId('cal-task-input').focus(); }, 60);
}

function renderCalList(key) {
    var list = calTasks[key] || [];
    var ul   = byId('cal-task-list');
    ul.innerHTML = '';
    if (list.length === 0) {
        var li = document.createElement('li');
        li.style.cssText = 'color:var(--text-muted);font-size:13px;padding:6px 0;';
        li.textContent   = 'No tasks for this day.';
        ul.appendChild(li);
        return;
    }
    list.forEach(function(task, idx) {
        var li = document.createElement('li');
        li.className = 'cal-li' + (task.completed ? ' done' : '');
        li.innerHTML =
            '<button class="task-check' + (task.completed ? ' done' : '') + '"' +
              ' onclick="toggleCalTask(\'' + key + '\',' + idx + ')">' +
              (task.completed ? '✓' : '') +
            '</button>' +
            '<span class="cal-li-text">' + esc(task.text) + '</span>' +
            '<span class="badge badge-cat ' + task.category + '">' + task.category + '</span>' +
            '<button class="task-btn del" onclick="deleteCalTask(\'' + key + '\',' + idx + ')">✕</button>';
        ul.appendChild(li);
    });
}

byId('cal-add-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!selectedDate) return;
    var text = byId('cal-task-input').value.trim();
    if (!text) return;

    await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: text,
            category: byId('cal-cat').value,
            due_date: selectedDate
        })
    });
    
    byId('cal-task-input').value = '';
    fetchTasksFromServer();
});

window.toggleCalTask = function(key, idx) {
    const task = calTasks[key][idx];
    toggleTask(task.id);
};
window.deleteCalTask = function(key, idx) {
    const task = calTasks[key][idx];
    deleteTask(task.id);
};

// =====================
// TIME BLOCKING
// =====================
var TIME_SLOTS = [
    '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
    '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
    '6:00 PM','7:00 PM','8:00 PM','9:00 PM'
];

function renderTray() {
    var tray = byId('tray-items');
    if (!tray) return;
    tray.innerHTML = '';
    var blocked = {};
    Object.values(timeBlocks).forEach(function(arr) {
        arr.forEach(function(id){ blocked[id] = true; });
    });
    var unsched = tasks.filter(function(t){ return !t.completed && !blocked[t.id]; });
    if (unsched.length === 0) {
        tray.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">All tasks scheduled ✓</span>';
        return;
    }
    unsched.forEach(function(task) {
        var chip = document.createElement('div');
        chip.className = 'tray-chip';
        chip.setAttribute('draggable','true');
        chip.innerHTML = '<span class="badge badge-cat ' + task.category + '">' + task.category[0] + '</span>' + esc(task.text);
        chip.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('tb-id', String(task.id));
            e.dataTransfer.effectAllowed = 'move';
            chip.classList.add('dragging');
        });
        chip.addEventListener('dragend', function(){ chip.classList.remove('dragging'); });
        tray.appendChild(chip);
    });
}

function renderTimeGrid() {
    var grid = byId('time-grid');
    if (!grid) return;
    grid.innerHTML = '';
    TIME_SLOTS.forEach(function(slot) {
        var row   = document.createElement('div');
        row.className = 'time-row';
        var label = document.createElement('div');
        label.className   = 'time-label';
        label.textContent = slot;
        var zone = document.createElement('div');
        zone.className = 'drop-zone';

        var ids = timeBlocks[slot] || [];
        ids.forEach(function(tid) {
            var task = tasks.find(function(t){ return t.id === tid; });
            if (task) zone.appendChild(makeBlockChip(task, slot));
        });

        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', function() {
            zone.classList.remove('drag-over');
        });
        zone.addEventListener('drop', async function(e) {
            e.preventDefault();
            zone.classList.remove('drag-over');
            var idStr = e.dataTransfer.getData('tb-id');
            if (!idStr) return;
            var tid = parseInt(idStr);
            
            await fetch(`${API_URL}/time-blocks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: tid, time_slot: slot })
            });
            fetchTasksFromServer();
        });
        row.appendChild(label);
        row.appendChild(zone);
        grid.appendChild(row);
    });
}

function makeBlockChip(task, slot) {
    var chip = document.createElement('div');
    chip.className = 'block-chip';
    chip.setAttribute('draggable','true');
    chip.innerHTML = esc(task.text) + '<button aria-label="Remove from slot">✕</button>';
    chip.querySelector('button').addEventListener('click', async function(e) {
        e.stopPropagation();
        await fetch(`${API_URL}/time-blocks/${task.id}`, { method: 'DELETE' });
        fetchTasksFromServer();
    });
    chip.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('tb-id', String(task.id));
        chip.style.opacity = '.4';
    });
    chip.addEventListener('dragend', function(){ chip.style.opacity = ''; });
    return chip;
}

// =====================
// INIT — runs on page load
// =====================
(function init() {
    var theme = localStorage.getItem('planner-theme') || 'light';
    document.body.setAttribute('data-theme', theme);
    setThemeLabel(theme);
    setDate();
    handleResize();
    fetchTasksFromServer();
})();
