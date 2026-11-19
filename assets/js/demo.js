/* Interactive AI Executive Assistant demonstration.
   Runs entirely in the browser with SAMPLE data — nothing is sent anywhere. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------- Date helpers (relative to today) ---------- */
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return d; }
  function nextDow(dow) { var d = new Date(); var diff = (dow - d.getDay() + 7) % 7 || 7; return addDays(diff); }
  function fmt(d) { return DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()]; }
  var today = new Date();

  /* ---------- Sample inbox ---------- */
  var EMAILS = [
    {
      id: 1, from: "Wanjiru K.", org: "Bloom Interiors (sample client)", time: "08:12",
      subject: "Urgent: revised quote needed before tomorrow's board meeting",
      body: "Hi, our board meets tomorrow at 10am and we need the revised quote for the office fit-out, including the extra meeting room. Can you also confirm the earliest delivery date? Thanks, Wanjiru",
      summary: "Client needs a revised office fit-out quote (including an extra meeting room) before a board meeting tomorrow at 10:00, plus confirmation of the earliest delivery date.",
      priority: "High", reason: "Hard deadline within 24 hours from an existing client.", category: "Client request",
      tasks: [["Send revised quote incl. extra meeting room", fmt(addDays(1)) + ", 09:00"], ["Confirm earliest delivery date", fmt(addDays(1)) + ", 09:00"]],
      followup: fmt(addDays(1)), calendar: "Block 30 min today to prepare the quote",
      draft: "Hi Wanjiru,\n\nThank you for the update. I'm preparing the revised quote with the additional meeting room and will send it to you before 9:00 tomorrow, together with the earliest confirmed delivery date.\n\nKind regards,\n[Your name]"
    },
    {
      id: 2, from: "David O.", org: "Prospective client (sample)", time: "08:47",
      subject: "Enquiry: help with monthly bookkeeping admin",
      body: "Hello, I run a small logistics company with 12 staff. We spend a lot of time chasing invoices and receipts by email. Do you offer support for this and what would it cost?",
      summary: "New lead: small logistics company (12 staff) wants help reducing time spent chasing invoices and receipts by email. Asking about services and cost.",
      priority: "Medium", reason: "New business opportunity — reply within the same working day.", category: "New lead",
      tasks: [["Reply with service overview and pricing guide", fmt(today) + ", 14:00"], ["Offer a 30-minute discovery call", fmt(today) + ", 14:00"]],
      followup: fmt(addDays(3)), calendar: "Suggest discovery call: " + fmt(nextDow(4)) + ", 11:00",
      draft: "Hello David,\n\nThank you for getting in touch. Yes — automating invoice and receipt follow-ups is exactly the kind of process I help businesses with.\n\nWould you be available for a 30-minute discovery call on " + fmt(nextDow(4)) + " at 11:00? I'll walk you through how it could work for your team and the likely cost.\n\nBest regards,\n[Your name]"
    },
    {
      id: 3, from: "Accounts", org: "Safari Supplies Ltd (sample supplier)", time: "09:05",
      subject: "Invoice INV-2041 — payment due Friday",
      body: "Dear customer, please find attached invoice INV-2041 for stationery supplies. Payment is due by Friday. Kindly share the remittance advice once paid.",
      summary: "Supplier invoice INV-2041 for stationery is due on Friday. Supplier requests remittance advice after payment.",
      priority: "Medium", reason: "Payment deadline this week.", category: "Finance / invoice",
      tasks: [["Approve & pay INV-2041", fmt(nextDow(5))], ["Send remittance advice to supplier", fmt(nextDow(5))]],
      followup: fmt(nextDow(5)), calendar: "Reminder: " + fmt(nextDow(5)) + ", 09:00 — pay INV-2041",
      draft: "Dear Safari Supplies team,\n\nThank you — invoice INV-2041 has been received and is scheduled for payment by Friday. We'll send the remittance advice once processed.\n\nRegards,\n[Your name]"
    },
    {
      id: 4, from: "Grace M.", org: "Partner organisation (sample)", time: "10:20",
      subject: "Can we move Friday's planning meeting to Monday?",
      body: "Hi! Something has come up on Friday. Could we move our planning meeting to Monday afternoon, maybe 2pm? Let me know what works.",
      summary: "Grace asks to reschedule Friday's planning meeting to Monday afternoon, suggesting 14:00.",
      priority: "Medium", reason: "Affects an existing calendar commitment.", category: "Scheduling",
      tasks: [["Confirm new meeting time with Grace", fmt(today)], ["Update calendar invite", fmt(today)]],
      followup: fmt(addDays(1)), calendar: "Proposed move: Fri meeting → " + fmt(nextDow(1)) + ", 14:00 (slot is free)",
      draft: "Hi Grace,\n\nNo problem at all. Monday at 2:00 pm works for me — I'll update the calendar invite now.\n\nSee you then,\n[Your name]"
    },
    {
      id: 5, from: "James N.", org: "Existing client (sample)", time: "11:02",
      subject: "Re: Proposal for website maintenance",
      body: "Thanks for the proposal last week. I've reviewed it with my partner and we have two questions about the support hours. Could you call me this week?",
      summary: "Client reviewed last week's maintenance proposal and has two questions about support hours. Requests a call this week.",
      priority: "High", reason: "Warm deal close to decision — responsiveness matters.", category: "Sales follow-up",
      tasks: [["Call James about support-hour questions", fmt(addDays(2))], ["Prepare answers on support hours", fmt(addDays(1))]],
      followup: fmt(addDays(2)), calendar: "Suggest call: " + fmt(addDays(2)) + ", 15:00",
      draft: "Hi James,\n\nThank you for reviewing the proposal. I'd be happy to talk through the support hours. Would " + fmt(addDays(2)) + " at 3:00 pm suit you for a short call?\n\nBest regards,\n[Your name]"
    },
    {
      id: 6, from: "Tech Weekly", org: "Newsletter (sample)", time: "11:30",
      subject: "This week in productivity tools",
      body: "Your weekly roundup of productivity tips, app updates and tutorials.",
      summary: "Weekly newsletter. No action required.",
      priority: "Low", reason: "Informational only.", category: "Newsletter",
      tasks: [], followup: "—", calendar: "No calendar action",
      draft: ""
    }
  ];

  var state = {}; // id -> {processed, status}
  var selected = null, running = false;
  var inboxEl = $("#inbox"), resultEl = $("#result"), sheetBody = $("#sheet-body"), briefingEl = $("#briefing");
  var pipes = Array.prototype.slice.call(document.querySelectorAll(".pipe"));

  function pClass(p) { return p === "High" ? "high-l" : p === "Medium" ? "med-l" : "low-l"; }
  function initials(n) { return n.split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase(); }

  function renderInbox() {
    inboxEl.innerHTML = "";
    EMAILS.forEach(function (m) {
      var st = state[m.id] || {};
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-pressed", selected === m.id ? "true" : "false");
      b.innerHTML =
        '<span class="from">' + m.from + '</span><span class="time">' + m.time + '</span>' +
        '<span class="subj">' + m.subject + '</span>' +
        '<span class="state">' + (st.processed
          ? '<span class="tag tag--' + pClass(m.priority) + '">' + m.priority + '</span><span class="tag tag--l">' + m.category + '</span>' + (st.status ? '<span class="tag tag--low-l">' + st.status + '</span>' : "")
          : '<span class="tag tag--l">Unprocessed</span>') + '</span>';
      b.addEventListener("click", function () { select(m.id); });
      li.appendChild(b);
      inboxEl.appendChild(li);
    });
  }

  function setPipe(i) {
    pipes.forEach(function (p, idx) {
      p.classList.toggle("is-done", idx < i);
      p.classList.toggle("is-active", idx === i);
    });
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function process(m, fast) {
    var step = fast ? 160 : 520;
    var chain = Promise.resolve();
    for (var i = 0; i < pipes.length; i++) {
      (function (i) { chain = chain.then(function () { setPipe(i); return wait(step); }); })(i);
    }
    return chain.then(function () {
      setPipe(pipes.length); // all done
      state[m.id] = state[m.id] || {};
      if (!state[m.id].processed) { state[m.id].processed = true; addSheetRow(m); }
      renderInbox();
      updateCounts();
    });
  }

  function addSheetRow(m) {
    var empty = $("#sheet-empty"); if (empty) empty.remove();
    var tr = document.createElement("tr");
    tr.className = "is-new"; tr.id = "row-" + m.id;
    tr.innerHTML = "<td>" + fmt(today) + " " + m.time + "</td><td>" + m.from + "</td><td>" + m.subject + "</td><td>" +
      '<span class="tag tag--' + pClass(m.priority) + '">' + m.priority + "</span></td><td>" + m.category + "</td><td>" +
      (m.tasks.length ? m.tasks.map(function (t) { return t[0]; }).join("; ") : "—") + "</td><td>" + m.followup + '</td><td class="st">' +
      (m.draft ? "Draft awaiting approval" : "No reply needed") + "</td>";
    sheetBody.appendChild(tr);
  }
  function setRowStatus(id, text) { var c = document.querySelector("#row-" + id + " .st"); if (c) c.textContent = text; }

  function renderResult(m) {
    var st = state[m.id] || {};
    if (!st.processed) {
      resultEl.innerHTML =
        '<div class="result result--wide"><h4>Original email</h4><p><strong>' + m.from + '</strong> · ' + m.org + '</p><p><strong>' + m.subject + '</strong></p><p class="mb-0">' + m.body + '</p></div>' +
        '<div class="result result--wide center"><p class="muted">This email has not been processed yet.</p><button class="btn btn--primary" id="run-one" type="button">Run AI assistant on this email</button></div>';
      $("#run-one").addEventListener("click", function () {
        if (running) return; running = true;
        this.disabled = true; this.innerHTML = '<span class="spinner"></span> Processing…';
        process(m, false).then(function () { running = false; renderResult(m); });
      });
      return;
    }
    var html =
      '<div class="result result--wide"><h4>Original email</h4><p><strong>' + m.from + '</strong> · ' + m.org + '</p><p><strong>' + m.subject + '</strong></p><p class="mb-0">' + m.body + '</p></div>' +
      '<div class="result"><h4>' + ico("sum") + 'AI summary</h4><p class="mb-0">' + m.summary + '</p></div>' +
      '<div class="result"><h4>' + ico("flag") + 'Priority</h4><p><span class="tag tag--' + pClass(m.priority) + '">' + m.priority + '</span> <span class="tag tag--l">' + m.category + '</span></p><p class="mb-0 small muted">' + m.reason + '</p></div>' +
      '<div class="result"><h4>' + ico("task") + 'Tasks extracted</h4>' + (m.tasks.length ? "<ul>" + m.tasks.map(function (t) { return "<li>" + t[0] + ' <span class="muted small">— due ' + t[1] + "</span></li>"; }).join("") + "</ul>" : '<p class="mb-0 muted">No action items found.</p>') + '</div>' +
      '<div class="result"><h4>' + ico("cal") + 'Follow-up & calendar</h4><p class="mb-1">Follow-up: <strong>' + m.followup + '</strong></p><p class="mb-0">' + m.calendar + '</p></div>';
    if (m.draft) {
      html += '<div class="result result--wide"><h4>' + ico("pen") + 'Draft reply — waiting for your approval</h4>' +
        '<label for="draft" class="visually-hidden">Draft reply</label><textarea id="draft" class="draft">' + m.draft + '</textarea>' +
        '<div class="btn-row mt-1"><button type="button" class="btn btn--primary btn--sm" id="approve">Approve & send</button>' +
        '<button type="button" class="btn btn--outline btn--sm" id="reject">Reject — I\'ll handle it</button></div>' +
        '<p class="small muted mt-1 mb-0">Nothing is sent without a human decision. In this demo, sending is simulated.</p></div>';
    } else {
      html += '<div class="result result--wide"><h4>' + ico("pen") + 'Reply</h4><p class="mb-0 muted">No reply needed — suggested action: archive.</p></div>';
    }
    resultEl.innerHTML = html;
    var ap = $("#approve"), rj = $("#reject");
    if (ap) ap.addEventListener("click", function () {
      state[m.id].status = "Replied"; setRowStatus(m.id, "Approved & sent (simulated)"); renderInbox();
      toast("Approved. In the live system this reply is sent from your Gmail and logged in Google Sheets.");
    });
    if (rj) rj.addEventListener("click", function () {
      state[m.id].status = "Manual"; setRowStatus(m.id, "Flagged for manual reply"); renderInbox();
      toast("Marked for manual handling — the task stays on your tracker.");
    });
  }

  function select(id) {
    selected = id;
    renderInbox();
    var m = EMAILS.filter(function (e) { return e.id === id; })[0];
    renderResult(m);
    if (window.innerWidth < 960) resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateCounts() {
    var done = EMAILS.filter(function (m) { return state[m.id] && state[m.id].processed; });
    $("#c-processed").textContent = done.length + "/" + EMAILS.length;
    $("#c-high").textContent = done.filter(function (m) { return m.priority === "High"; }).length;
    $("#c-tasks").textContent = done.reduce(function (a, m) { return a + m.tasks.length; }, 0);
    $("#btn-brief").disabled = done.length === 0;
  }

  function runAll() {
    if (running) return; running = true;
    var btn = $("#btn-run"); btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Processing inbox…';
    var chain = Promise.resolve();
    EMAILS.forEach(function (m) {
      chain = chain.then(function () {
        if (state[m.id] && state[m.id].processed) return;
        selected = m.id; renderInbox(); return process(m, true);
      });
    });
    chain.then(function () {
      running = false; btn.disabled = false; btn.textContent = "Inbox processed ✓";
      select(EMAILS[0].id); toast("All sample emails processed and logged to the tracker.");
    });
  }

  function briefing() {
    var done = EMAILS.filter(function (m) { return state[m.id] && state[m.id].processed; });
    var high = done.filter(function (m) { return m.priority === "High"; });
    var tasks = []; done.forEach(function (m) { m.tasks.forEach(function (t) { tasks.push(t[0] + " (" + t[1] + ")"); }); });
    var cal = done.filter(function (m) { return /Suggest|Proposed|Reminder|Block/.test(m.calendar); }).map(function (m) { return m.calendar; });
    var awaiting = done.filter(function (m) { return m.draft && !(state[m.id].status); }).length;
    briefingEl.innerHTML =
      '<h3>Daily briefing — ' + fmt(today) + '</h3><p class="muted">Generated from ' + done.length + ' processed emails (sample data).</p>' +
      '<p class="mb-0"><strong style="color:#fff">Needs attention first</strong></p><ul>' + (high.length ? high.map(function (m) { return "<li>" + m.from + ": " + m.subject + "</li>"; }).join("") : "<li>No high-priority emails.</li>") + '</ul>' +
      '<p class="mb-0 mt-1"><strong style="color:#fff">Tasks due</strong></p><ul>' + (tasks.length ? tasks.map(function (t) { return "<li>" + t + "</li>"; }).join("") : "<li>None</li>") + '</ul>' +
      '<p class="mb-0 mt-1"><strong style="color:#fff">Calendar</strong></p><ul>' + (cal.length ? cal.map(function (c) { return "<li>" + c + "</li>"; }).join("") : "<li>No changes</li>") + '</ul>' +
      '<p class="mt-1 mb-0"><strong style="color:#fff">Drafts awaiting your approval:</strong> ' + awaiting + '</p>';
    briefingEl.hidden = false;
    briefingEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function reset() {
    state = {}; selected = null; running = false;
    sheetBody.innerHTML = '<tr id="sheet-empty"><td colspan="8" class="center muted">No rows yet — process an email to log it here.</td></tr>';
    briefingEl.hidden = true; setPipe(-1);
    var btn = $("#btn-run"); btn.disabled = false; btn.textContent = "Process entire inbox";
    resultEl.innerHTML = emptyHtml;
    renderInbox(); updateCounts();
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("is-visible");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("is-visible"); }, 3800);
  }

  function ico(n) {
    var p = {
      sum: '<path d="M4 6h16M4 12h16M4 18h10"/>',
      flag: '<path d="M4 22V4m0 0h13l-2 4 2 4H4"/>',
      task: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
      cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
      pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'
    }[n];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  }

  var emptyHtml = resultEl.innerHTML;
  $("#btn-run").addEventListener("click", runAll);
  $("#btn-brief").addEventListener("click", briefing);
  $("#btn-reset").addEventListener("click", reset);
  renderInbox(); updateCounts();
})();
