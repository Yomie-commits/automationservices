/* =========================================================
   AI Executive Assistant — fully interactive demo
   Everything runs in the visitor's browser. No email is read
   or sent; nothing leaves the page. State is kept in this
   browser only (localStorage) and can be reset at any time.
   ========================================================= */
(function () {
  "use strict";
  var E = window.DemoEngine;
  var root = document.getElementById("demo-app");
  if (!E || !root) return;
  var KEY = "aea-demo-v2";

  /* ---------------- Utilities ---------------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(s, r) { return (r || root).querySelector(s); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function nowTime() { var d = new Date(); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
  function today() { return E.ymd(new Date()); }
  function hhmm(iso) { var d = new Date(iso); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
  function whenLabel(iso) { var d = new Date(iso); return E.ymd(d) === today() ? hhmm(iso) : E.label(d); }
  function pTag(p) { return '<span class="tag tag--' + (p === "High" ? "high-l" : p === "Medium" ? "med-l" : "low-l") + '">' + esc(p) + "</span>"; }
  function nextWeekday(d) { var x = E.startOfDay(d); while (x.getDay() === 0 || x.getDay() === 6) x = E.addDays(x, 1); return x; }
  var P = {
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    task: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    sheet: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    log: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    sum: '<path d="M4 6h16M4 12h16M4 18h10"/>', flag: '<path d="M4 22V4m0 0h13l-2 4 2 4H4"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    tag: '<path d="M20.6 13.4L13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    brain: '<path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.3A3 3 0 0 0 4.5 8a3 3 0 0 0-.5 5.4A3 3 0 0 0 7 18a2.5 2.5 0 0 0 5 .5V4.5A2.5 2.5 0 0 0 9.5 2zM14.5 2A2.5 2.5 0 0 1 17 4.5v.3A3 3 0 0 1 19.5 8a3 3 0 0 1 .5 5.4A3 3 0 0 1 17 18a2.5 2.5 0 0 1-5 .5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', plus: '<path d="M12 5v14M5 12h14"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'
  };
  function ic(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + "</svg>"; }

  /* ---------------- Sample data ---------------- */
  var SAMPLES = [
    { fromName: "Wanjiru K.", fromEmail: "wanjiru@bloominteriors.example", mins: 190, subject: "Urgent: revised quote needed before tomorrow's board meeting", body: "Hi Naomi,\n\nOur board meets tomorrow at 10am and we need the revised quote for the office fit-out, including the extra meeting room. Could you also confirm the earliest delivery date?\n\nThanks,\nWanjiru" },
    { fromName: "David Otieno", fromEmail: "david@swiftlogistics.example", mins: 150, subject: "Enquiry: help with monthly bookkeeping admin", body: "Hello,\n\nI run a small logistics company with 12 staff. We spend a lot of time chasing invoices and receipts by email. Do you offer support for this, and how much would it cost?\n\nRegards,\nDavid Otieno" },
    { fromName: "Safari Supplies Accounts", fromEmail: "accounts@safarisupplies.example", mins: 120, subject: "Invoice INV-2041 — payment due Friday", body: "Dear customer,\n\nPlease find attached invoice INV-2041 for stationery supplies (KES 18,500). Payment is due by Friday. Kindly share the remittance advice once paid.\n\nAccounts Team\nSafari Supplies Ltd" },
    { fromName: "Grace Mutua", fromEmail: "grace@partnerorg.example", mins: 75, subject: "Can we move Friday's planning meeting to Monday?", body: "Hi Naomi!\n\nSomething has come up on Friday. Could we move our planning meeting to Monday afternoon, maybe 2pm? Let me know what works for you.\n\nGrace" },
    { fromName: "James Njoroge", fromEmail: "james@njorogeco.example", mins: 40, subject: "Re: Proposal for website maintenance", body: "Hi Naomi,\n\nThanks for the proposal last week. I've reviewed it with my partner and we have two questions about the support hours. Could you call me this week? Thursday afternoon would be ideal.\n\nBest,\nJames" },
    { fromName: "Tech Weekly", fromEmail: "news@techweekly.example", mins: 20, subject: "This week in productivity tools", body: "This week in productivity tools: 5 apps to try, a webinar invitation and exclusive offers. Unsubscribe at any time." }
  ];
  var POOL = [
    { fromName: "Peter Kamau", fromEmail: "peter@kamau.example", subject: "Order delayed again — very disappointed", body: "Hello,\n\nThis is the second time my order #4471 has been delayed. I'm really disappointed. Please tell me when it will be delivered or I would like a refund. I need an answer today.\n\nPeter" },
    { fromName: "Amina Hassan", fromEmail: "amina@zuriwellness.example", subject: "New website enquiry — appointment reminders", body: "Hello,\n\nWe run a wellness spa and receive many booking requests on WhatsApp and email, and we lose track of some of them. I'm interested in automating our appointment reminders. Could you send me your pricing? Are you available for a call on Tuesday at 11am?\n\nAmina Hassan\nZuri Wellness Spa" },
    { fromName: "Brian Ochieng", fromEmail: "brian@yourteam.example", subject: "Client report needed by 4pm today", body: "Hi Naomi,\n\nPlease send me the updated client report by 4pm today so I can include it in the management pack. Also, can you confirm the October numbers?\n\nThanks,\nBrian" },
    { fromName: "Lucy Wambui", fromEmail: "lucy@kilimafoods.example", subject: "Payment sent for invoice 0087", body: "Hi Naomi,\n\nJust to let you know we've sent the payment for invoice 0087 today. Thanks for the great work on the dashboard — the team loves it!\n\nLucy" },
    { fromName: "SME Digital Forum", fromEmail: "events@smeforum.example", subject: "Invitation to speak: AI for small businesses panel", body: "Dear Naomi,\n\nYou're invited to speak on a panel about AI for small businesses on 4 December at 2pm at the Sarit Expo Centre. Kindly confirm your availability by Friday.\n\nEvents Team\nSME Digital Forum" }
  ];
  var EXAMPLES = {
    "Urgent request": { fromName: "Mary Achieng", fromEmail: "mary@achiengco.example", subject: "Urgent: contract changes needed today", body: "Hi,\n\nOur lawyer has asked for two changes to the service contract. Could you send the updated version by 3pm today? We need to sign before the end of the day.\n\nThanks,\nMary" },
    "Meeting request": { fromName: "Kevin Mwangi", fromEmail: "kevin@greenbuild.example", subject: "Quick catch-up next week?", body: "Hi Naomi,\n\nCould we meet next Wednesday at 10am to review the automation progress? Google Meet is fine.\n\nRegards,\nKevin" },
    "New lead": POOL[1], "Complaint": POOL[0], "Invoice": SAMPLES[2], "Newsletter": SAMPLES[5]
  };

  /* ---------------- State ---------------- */
  var state, queue = [], running = false, pipeEls = [];
  function defaultSettings() { return { name: "Naomi Mwangi", business: "AI Automation Services", tone: "friendly", vip: "", auto: true }; }
  function seed() {
    var now = Date.now(), t = new Date();
    state = { v: 2, seq: 1, exec: 4180, emails: [], tasks: [], events: [], log: [], settings: defaultSettings(), poolIdx: 0, view: "inbox", selected: null, filter: "all", q: "", rows: 0 };
    SAMPLES.forEach(function (s) { addEmail(s, new Date(now - s.mins * 60000).toISOString(), false); });
    var tmr = nextWeekday(E.addDays(t, 1));
    addEvent({ title: "Team check-in", date: E.ymd(tmr), time: "10:00", source: "existing", status: "confirmed" });
    addEvent({ title: "Supplier call", date: E.ymd(E.nextDow(t, 1)), time: "14:00", source: "existing", status: "confirmed" });
    addEvent({ title: "Project review", date: E.ymd(E.nextDow(t, 3)), time: "11:00", source: "existing", status: "confirmed" });
    state.selected = state.emails[state.emails.length - 1].id;
    log("make", "Demo workspace ready — " + state.emails.length + " sample emails waiting in Gmail");
  }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 2 && s.emails) { state = s; state.emails.forEach(function (e) { if (e.status === "processing") e.status = "new"; }); return; } } catch (e) { /* ignore */ }
    seed();
  }
  var saveTimer;
  function save() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ } }, 150); }
  function id() { return "x" + (state.seq++); }
  function addEmail(s, iso, isNew) {
    var e = { id: id(), fromName: s.fromName, fromEmail: s.fromEmail, subject: s.subject, body: s.body, received: iso || new Date().toISOString(), status: "new", unread: true, isNew: !!isNew, analysis: null, reply: null };
    state.emails.unshift(e); return e;
  }
  function addEvent(ev) { ev.id = id(); ev.dur = ev.dur || 60; state.events.push(ev); return ev; }
  function getEmail(i) { return state.emails.filter(function (e) { return e.id === i; })[0]; }
  function log(mod, msg) { state.log.unshift({ t: nowTime(), mod: mod, msg: msg }); if (state.log.length > 200) state.log.length = 200; var tk = $("#ticker"); if (tk) tk.textContent = "› " + modName(mod) + " · " + msg; }
  function modName(m) { return { gmail: "Gmail", make: "Make.com", ai: "AI", sheets: "Google Sheets", calendar: "Google Calendar", you: "You" }[m] || m; }

  /* ---------------- Processing pipeline ---------------- */
  function enqueue(ids, fast) { ids.forEach(function (i) { var e = getEmail(i); if (e && e.status === "new" && queue.indexOf(i) === -1) { queue.push(i); e.status = "queued"; } }); render(); run(fast); }
  function run(fast) {
    if (running) return; running = true;
    (function next() {
      if (!queue.length) { running = false; setPipe(-1); render(); save(); return; }
      process(queue.shift(), fast || queue.length > 0).then(next);
    })();
  }
  function setPipe(i) { pipeEls.forEach(function (p, k) { p.classList.toggle("is-done", i >= 0 && k < i); p.classList.toggle("is-active", k === i); }); }
  function process(emailId, fast) {
    var e = getEmail(emailId); if (!e) return Promise.resolve();
    e.status = "processing"; render();
    var a = E.analyse(e, { today: new Date(), settings: state.settings, events: state.events });
    var ms = fast ? 220 : 600, n = ++state.exec;
    var steps = [
      function () { log("gmail", "Watch emails · new message from " + e.fromName + " — “" + e.subject + "”"); },
      function () { log("make", "Scenario “AI Executive Assistant” started · execution #" + n); },
      function () { log("ai", "Analysed · " + a.priority + " priority · " + a.category + " · " + a.tasks.length + " task" + (a.tasks.length === 1 ? "" : "s") + " · sentiment " + a.sentiment.toLowerCase()); },
      function () {
        log("sheets", "Add a row · tracker row " + (state.rows + 1) + (a.tasks.length ? " · " + a.tasks.length + " task(s) added" : ""));
        if (a.meeting) log("calendar", "Event suggested · " + a.meeting.title + " · " + E.label((a.meeting.alt || a.meeting).date) + " " + (a.meeting.alt || a.meeting).time + (a.meeting.conflict ? " (original time clashes)" : a.meeting.passed ? " (original time has passed)" : ""));
      },
      function () { log(a.draft ? "gmail" : "make", a.draft ? "Draft reply created — waiting for your approval" : "No reply needed — marked for archive"); }
    ];
    var chain = Promise.resolve();
    steps.forEach(function (fn, i) { chain = chain.then(function () { setPipe(i); fn(); return wait(ms); }); });
    return chain.then(function () {
      e.analysis = a; e.status = "processed"; e.processedAt = new Date().toISOString(); e.row = ++state.rows;
      e.reply = a.draft ? { status: "draft", text: a.draft, tone: state.settings.tone } : { status: "none" };
      a.tasks.forEach(function (t) { state.tasks.push({ id: id(), text: t.text, due: t.due, time: t.time, done: false, emailId: e.id }); });
      if (a.meeting) { var sl = a.meeting.alt || a.meeting; e.eventId = addEvent({ title: a.meeting.title, date: sl.date, time: sl.time, source: "assistant", status: "pending", emailId: e.id }).id; }
      setPipe(5); save(); render();
    });
  }

  /* ---------------- Actions ---------------- */
  function select(i) { state.selected = i; state.view = "inbox"; var e = getEmail(i); if (e) { e.unread = false; e.isNew = false; } render(); save(); if (window.innerWidth < 1100) { var d = $(".detail"); if (d) d.scrollIntoView({ behavior: "smooth", block: "start" }); } }
  function approve(e) {
    var ta = $("#draft-text"); if (ta) e.reply.text = ta.value;
    if (!e.reply.text.trim()) { toast("The reply is empty — write something first."); return; }
    e.reply.status = "sent"; e.reply.sentAt = new Date().toISOString();
    log("you", "Approved reply to " + e.fromName); log("gmail", "Send email · to " + e.fromEmail + " (simulated)"); log("sheets", "Update row " + e.row + " · status → Replied");
    state.tasks.forEach(function (t) { if (t.emailId === e.id && /^(reply|confirm|offer)/i.test(t.text)) t.done = true; });
    toast("Reply approved and sent (simulated). Logged to the tracker."); save(); render();
  }
  function reject(e) { e.reply.status = "manual"; log("you", "Rejected draft for " + e.fromName + " — handling manually"); log("sheets", "Update row " + e.row + " · status → Manual reply"); toast("Marked for manual reply. The tasks stay on your list."); save(); render(); }
  function confirmEvent(ev) {
    ev.status = "confirmed"; log("you", "Approved calendar event"); log("calendar", "Create event · " + ev.title + " · " + E.label(ev.date) + " " + ev.time);
    state.tasks.forEach(function (t) { if (t.emailId === ev.emailId && /calendar invite/i.test(t.text)) t.done = true; });
    toast("Added to calendar: " + ev.title + ", " + E.label(ev.date) + " at " + E.time12(ev.time)); save(); render();
  }
  function dismissEvent(ev) { ev.status = "dismissed"; log("you", "Dismissed calendar suggestion · " + ev.title); save(); render(); }
  function simulate() {
    if (state.poolIdx >= POOL.length) { toast("All sample emails delivered. Click “New email” to write your own."); openCompose(); return; }
    var s = POOL[state.poolIdx++]; var e = addEmail(s, null, true);
    log("gmail", "New email received from " + s.fromName); toast("New email from " + s.fromName);
    state.selected = e.id; state.view = "inbox"; render(); save();
    if (state.settings.auto) enqueue([e.id]);
  }
  function csv() {
    var head = ["Row", "Received", "From", "Email", "Subject", "Category", "Priority", "Sentiment", "Summary", "Tasks", "Follow-up", "Reply status"];
    var rows = processed().map(function (e) {
      var a = e.analysis;
      return [e.row, new Date(e.received).toLocaleString(), e.fromName, e.fromEmail, e.subject, a.category, a.priority, a.sentiment, a.summary,
        state.tasks.filter(function (t) { return t.emailId === e.id; }).map(function (t) { return t.text; }).join("; "), a.followup || "", replyStatus(e)];
    });
    return [head].concat(rows).map(function (r) { return r.map(function (c) { c = String(c == null ? "" : c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(","); }).join("\n");
  }
  function processed() { return state.emails.filter(function (e) { return e.status === "processed"; }).sort(function (a, b) { return a.row - b.row; }); }
  function replyStatus(e) { return !e.reply ? "—" : { draft: "Draft awaiting approval", sent: "Replied", manual: "Manual reply", none: "No reply needed" }[e.reply.status]; }
  function copy(text, okMsg) {
    try { navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, function () { toast("Copy isn't available here — select the text and copy it manually."); }); }
    catch (err) { toast("Copy isn't available here — select the text and copy it manually."); }
  }

  /* ---------------- Rendering ---------------- */
  function render() {
    var awaiting = state.emails.filter(function (e) { return e.reply && e.reply.status === "draft"; }).length;
    var unproc = state.emails.filter(function (e) { return e.status !== "processed"; }).length;
    var openTasks = state.tasks.filter(function (t) { return !t.done; }).length;
    var pend = state.events.filter(function (e) { return e.status === "pending"; }).length;
    var done = processed();
    var sent = state.emails.filter(function (e) { return e.reply && e.reply.status === "sent"; }).length;
    $("#st-processed").textContent = done.length + "/" + state.emails.length;
    $("#st-high").textContent = done.filter(function (e) { return e.analysis.priority === "High"; }).length;
    $("#st-tasks").textContent = openTasks;
    $("#st-drafts").textContent = awaiting;
    $("#st-saved").textContent = "~" + (done.length * 3 + sent * 4) + " min";
    var counts = { inbox: unproc, sent: sent, tasks: openTasks, calendar: pend, tracker: done.length, briefing: "", log: "", settings: "" };
    root.querySelectorAll("[data-view]").forEach(function (b) {
      var v = b.getAttribute("data-view"); b.setAttribute("aria-selected", v === state.view ? "true" : "false");
      var c = b.querySelector(".count"); if (c) { c.textContent = counts[v] === "" ? "" : counts[v]; c.hidden = counts[v] === "" || counts[v] === 0; c.classList.toggle("count--hot", (v === "inbox" && unproc > 0) || (v === "calendar" && pend > 0)); }
    });
    $("#auto-toggle").checked = !!state.settings.auto;
    $("#btn-process-all").disabled = !state.emails.some(function (e) { return e.status === "new"; });
    var view = $("#view");
    var html = ({ inbox: vInbox, sent: vSent, tasks: vTasks, calendar: vCalendar, tracker: vTracker, briefing: vBriefing, log: vLog, settings: vSettings }[state.view] || vInbox)();
    var active = document.activeElement, keepId = active && root.contains(active) && active.id;
    var selStart = keepId && active.selectionStart, selEnd = keepId && active.selectionEnd;
    view.innerHTML = html;
    if (keepId) { var el = document.getElementById(keepId); if (el) { el.focus(); try { if (selStart != null) el.setSelectionRange(selStart, selEnd); } catch (e) { /* not text */ } } }
  }

  function vInbox() {
    var q = (state.q || "").toLowerCase();
    var list = state.emails.filter(function (e) {
      if (q && (e.fromName + " " + e.subject + " " + e.body).toLowerCase().indexOf(q) === -1) return false;
      if (state.filter === "new") return e.status !== "processed";
      if (state.filter === "high") return e.analysis && e.analysis.priority === "High";
      if (state.filter === "approval") return e.reply && e.reply.status === "draft";
      return true;
    });
    var items = list.map(function (e) {
      var a = e.analysis, st;
      if (e.status === "processing") st = '<span class="tag tag--l"><span class="spinner" style="width:10px;height:10px;border-color:rgba(109,76,240,.3);border-top-color:#6d4cf0"></span>&nbsp;Processing</span>';
      else if (e.status === "queued") st = '<span class="tag tag--l">Queued</span>';
      else if (!a) st = '<span class="tag tag--l">Unprocessed</span>';
      else st = pTag(a.priority) + '<span class="tag tag--l">' + esc(a.category.split(" / ")[0]) + "</span>" + (e.reply && e.reply.status === "draft" ? '<span class="tag tag--med-l">Needs approval</span>' : e.reply && e.reply.status === "sent" ? '<span class="tag tag--low-l">Replied</span>' : "");
      return '<button type="button" class="mail-item' + (e.unread ? " is-unread" : "") + '" data-act="select" data-id="' + e.id + '" aria-current="' + (state.selected === e.id) + '"><span class="from">' + esc(e.fromName) + (e.isNew ? '<span class="new-pill">New</span>' : "") + '</span><span class="time">' + whenLabel(e.received) + '</span><span class="subj">' + esc(e.subject) + '</span><span class="state">' + st + "</span></button>";
    }).join("") || '<div class="empty-state"><p class="mb-0">No emails match.</p></div>';
    var f = function (k, l) { return '<button type="button" data-act="filter" data-filter="' + k + '" aria-pressed="' + (state.filter === k) + '">' + l + "</button>"; };
    return '<div class="mail-split"><div class="mail-list"><div class="mail-tools"><label class="visually-hidden" for="mail-search">Search emails</label><input type="search" id="mail-search" placeholder="Search emails…" value="' + esc(state.q) + '"><div class="filters" role="group" aria-label="Filter emails">' + f("all", "All") + f("new", "Unprocessed") + f("high", "High priority") + f("approval", "Needs approval") + "</div></div>" + items + "</div>" + vDetail() + "</div>";
  }

  function highlight(body, words) {
    var h = esc(body);
    (words || []).slice().sort(function (a, b) { return b.length - a.length; }).forEach(function (w) {
      var ew = esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      h = h.replace(new RegExp("(^|[^\\w<])(" + ew + ")(?![\\w])", "gi"), "$1<mark>$2</mark>");
    });
    return h;
  }

  function vDetail() {
    var e = getEmail(state.selected);
    if (!e) return '<div class="detail"><div class="empty-state">' + ic("inbox") + '<p class="mb-0">Select an email, or click <strong>New email</strong> to write your own.</p></div></div>';
    var a = e.analysis;
    var head = '<div class="detail__email"><h4>' + esc(e.subject) + '</h4><p class="detail__meta"><strong>' + esc(e.fromName) + "</strong> &lt;" + esc(e.fromEmail) + "&gt; · " + whenLabel(e.received) + "</p>" +
      '<div class="detail__body">' + (a ? highlight(e.body, a.signalWords) : esc(e.body)) + "</div>" + (a && a.signalWords.length ? '<p class="how-note mt-1 mb-0">Highlighted words influenced the priority score.</p>' : "") + "</div>";
    if (e.status === "processing" || e.status === "queued")
      return '<div class="detail">' + head + '<div class="processing"><span class="spinner"></span><p class="mb-0">' + (e.status === "queued" ? "Queued — waiting for the current email to finish…" : "The assistant is processing this email…") + "</p></div></div>";
    if (!a)
      return '<div class="detail">' + head + '<div class="processing">' + ic("brain") + '<p class="mb-0">This email hasn\'t been processed yet.</p><button type="button" class="btn btn--primary" data-act="process" data-id="' + e.id + '">' + ic("brain") + ' Run AI assistant</button><p class="how-note mb-0">Tip: turn on <strong>Auto-process</strong> to handle new emails automatically.</p></div></div>';

    var tasks = state.tasks.filter(function (t) { return t.emailId === e.id; });
    var tHtml = tasks.length ? tasks.map(taskRow).join("") : '<p class="mb-0 muted small">No action items found.</p>';
    var ev = e.eventId && state.events.filter(function (x) { return x.id === e.eventId; })[0];
    var mHtml = "";
    if (ev && ev.status !== "dismissed") {
      var m = a.meeting;
      mHtml = '<div class="meet-card' + (ev.status === "confirmed" ? " is-confirmed" : "") + '"><p class="mb-0"><strong>' + esc(ev.title) + "</strong></p><p class=\"small mb-0\">" + E.label(ev.date) + " at " + E.time12(ev.time) + "</p>" +
        (m.conflict ? '<p class="small mb-0" style="color:#94600a">Requested ' + E.label(m.date) + " " + E.time12(m.time) + " clashes with your calendar — next free slot suggested.</p>" : m.passed ? '<p class="small mb-0" style="color:#94600a">Requested time has passed — next free slot suggested.</p>' : m.requested ? '<p class="small mb-0 muted">Slot is free in your calendar.</p>' : '<p class="small mb-0 muted">Proposed by the assistant (free slot).</p>') +
        (ev.status === "pending" ? '<div class="btn-row mt-1"><button type="button" class="btn btn--navy btn--sm" data-act="ev-confirm" data-id="' + ev.id + '">Add to calendar</button><button type="button" class="btn btn--outline btn--sm" data-act="ev-dismiss" data-id="' + ev.id + '">Dismiss</button></div>' : '<p class="sent-badge mt-1 mb-0">' + ic("check") + " Added to calendar</p>") + "</div>";
    } else if (ev && ev.status === "dismissed") mHtml = '<p class="small muted mb-0">Calendar suggestion dismissed.</p>';
    else mHtml = '<p class="small muted mb-0">No meeting or date requiring a calendar entry.</p>';

    var reply = "";
    if (e.reply.status === "none") reply = '<p class="mb-0 muted">No reply needed. Suggested action: <strong>' + esc(a.suggestedAction) + "</strong>.</p>";
    else if (e.reply.status === "sent") reply = '<p class="sent-badge">' + ic("check") + " Sent (simulated) at " + hhmm(e.reply.sentAt) + '</p><div class="detail__body">' + esc(e.reply.text) + "</div>";
    else {
      var tone = e.reply.tone || state.settings.tone;
      var tb = function (k, l) { return '<button type="button" data-act="tone" data-tone="' + k + '" aria-pressed="' + (tone === k) + '">' + l + "</button>"; };
      reply = (e.reply.status === "manual" ? '<p class="small" style="color:#94600a">Marked for manual reply — you can still edit and send this draft.</p>' : "") +
        '<div style="display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;justify-content:space-between;margin-bottom:.6rem"><span class="small muted">Tone</span><div class="seg" role="group" aria-label="Reply tone">' + tb("friendly", "Friendly") + tb("formal", "Formal") + tb("brief", "Brief") + "</div></div>" +
        '<label for="draft-text" class="visually-hidden">Draft reply</label><textarea id="draft-text" class="draft" rows="9">' + esc(e.reply.text) + "</textarea>" +
        '<div class="btn-row mt-1"><button type="button" class="btn btn--primary btn--sm" data-act="approve">' + ic("send") + " Approve &amp; send</button>" +
        (e.reply.status !== "manual" ? '<button type="button" class="btn btn--outline btn--sm" data-act="reject">I\'ll handle it myself</button>' : "") + "</div>" +
        '<p class="how-note mt-1 mb-0">Nothing is sent without your approval. Edit freely — sending is simulated in this demo.</p>';
    }

    return '<div class="detail">' + head + '<div class="detail__grid">' +
      '<div class="result result--wide"><h4>' + ic("sum") + "AI summary</h4><p class=\"mb-0\">" + esc(a.summary) + "</p></div>" +
      '<div class="result"><h4>' + ic("flag") + "Priority</h4><p class=\"mb-0\">" + pTag(a.priority) + ' <span class="small muted">score ' + a.score + "</span></p>" + (a.reasons.length ? '<ul class="reason-list">' + a.reasons.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" : "") + "</div>" +
      '<div class="result"><h4>' + ic("tag") + "Classification</h4><p class=\"mb-0\"><span class=\"tag tag--l\">" + esc(a.category) + '</span></p><p class="small mb-0 mt-1">Sentiment: <strong>' + esc(a.sentiment) + "</strong><br>Suggested: <strong>" + esc(a.suggestedAction) + "</strong></p></div>" +
      '<div class="result"><h4>' + ic("task") + "Tasks extracted</h4>" + tHtml + "</div>" +
      '<div class="result"><h4>' + ic("cal") + "Calendar &amp; follow-up</h4>" + mHtml +
      (a.followup ? '<p class="small mt-1 mb-0"><label for="fu-date">Follow-up date</label><br><input class="inline-input" type="date" id="fu-date" value="' + a.followup + '"></p>' : "") + "</div>" +
      '<div class="result result--wide"><h4>' + ic("pen") + "Reply</h4>" + reply + "</div>" +
      "</div></div>";
  }

  function taskRow(t) {
    var late = !t.done && t.due && t.due < today();
    var src = t.emailId && getEmail(t.emailId);
    return '<div class="task-row' + (t.done ? " is-done" : "") + '"><input type="checkbox" id="tk-' + t.id + '" data-act="task-toggle" data-id="' + t.id + '"' + (t.done ? " checked" : "") + '><label for="tk-' + t.id + '" class="task-text">' + esc(t.text) +
      (state.view === "tasks" && src ? '<span class="src">From ' + esc(src.fromName) + " — " + esc(src.subject) + "</span>" : "") + "</label>" +
      '<span class="due' + (late ? " due--late" : "") + '">' + (t.due ? (late ? "Overdue · " : "") + E.label(t.due) + (t.time ? " " + t.time : "") : "No date") + "</span>" +
      (state.view === "tasks" ? '<button type="button" class="del" data-act="task-del" data-id="' + t.id + '" aria-label="Delete task">×</button>' : "") + "</div>";
  }

  function vSent() {
    var list = state.emails.filter(function (e) { return e.reply && e.reply.status === "sent"; }).sort(function (a, b) { return a.reply.sentAt < b.reply.sentAt ? 1 : -1; });
    var body = list.length ? list.map(function (e) {
      return '<div class="result" style="margin-bottom:.8rem"><p class="small muted mb-0">To ' + esc(e.fromName) + " &lt;" + esc(e.fromEmail) + "&gt; · " + hhmm(e.reply.sentAt) + '</p><p class="mb-0"><strong>Re: ' + esc(e.subject.replace(/^re:\s*/i, "")) + '</strong></p><div class="detail__body mt-1">' + esc(e.reply.text) + "</div></div>";
    }).join("") : '<div class="empty-state">' + ic("send") + '<p class="mb-0">No replies sent yet. Approve a draft in the inbox to see it here.</p></div>';
    return '<div class="view__head"><h3>Sent (simulated)</h3></div><div class="view__pad">' + body + "</div>";
  }

  function vTasks() {
    var open = state.tasks.filter(function (t) { return !t.done; }).sort(function (a, b) { return (a.due || "9") < (b.due || "9") ? -1 : 1; });
    var done = state.tasks.filter(function (t) { return t.done; });
    return '<div class="view__head"><h3>Tasks</h3><span class="small muted">' + open.length + " open · " + done.length + " done</span></div><div class=\"view__pad\">" +
      '<form class="form-grid" id="task-form" style="grid-template-columns:1fr auto auto;align-items:end;margin-bottom:1rem"><div class="field"><label for="new-task">Add a task</label><input id="new-task" placeholder="e.g. Prepare proposal for Zuri Wellness" maxlength="120"></div><div class="field"><label for="new-due">Due</label><input id="new-due" type="date" value="' + today() + '"></div><button class="btn btn--navy btn--sm" type="submit" style="margin-bottom:.15rem">' + ic("plus") + " Add</button></form>" +
      (open.length ? open.map(taskRow).join("") : '<div class="empty-state">' + ic("task") + '<p class="mb-0">No open tasks. Process some emails — tasks are extracted automatically.</p></div>') +
      (done.length ? '<h4 class="mt-2">Completed</h4>' + done.map(taskRow).join("") : "") + "</div>";
  }

  function vCalendar() {
    var start = E.startOfDay(new Date()), days = "";
    for (var i = 0; i < 7; i++) {
      var d = E.addDays(start, i), ds = E.ymd(d);
      var evs = state.events.filter(function (e) { return e.date === ds && e.status !== "dismissed"; }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
      days += '<div class="cal-day' + (i === 0 ? " is-today" : "") + (d.getDay() % 6 === 0 ? " is-weekend" : "") + '"><div class="cal-day__head"><span>' + E.label(d) + "</span>" + (i === 0 ? "<span>Today</span>" : "") + '</div><div class="cal-day__body">' +
        (evs.map(function (ev) {
          return '<div class="event' + (ev.source === "assistant" ? " event--assistant" : "") + (ev.status === "pending" ? " event--pending" : "") + '"><b>' + E.time12(ev.time) + "</b>" + esc(ev.title) +
            (ev.status === "pending" ? '<div class="mt-1"><span class="small muted">Suggested · </span><button type="button" data-act="ev-confirm" data-id="' + ev.id + '">Add</button><button type="button" data-act="ev-dismiss" data-id="' + ev.id + '">Dismiss</button></div>' : "") + "</div>";
        }).join("") || '<span class="small muted">Free</span>') + "</div></div>";
    }
    var later = state.events.filter(function (e) { return e.date > E.ymd(E.addDays(start, 6)) && e.status !== "dismissed"; });
    return '<div class="view__head"><h3>Google Calendar (next 7 days)</h3><span class="small muted">Dashed = suggested by the assistant, waiting for approval</span></div><div class="view__pad"><div class="cal-week">' + days + "</div>" +
      (later.length ? '<h4 class="mt-2">Later</h4>' + later.map(function (ev) { return '<div class="task-row"><span>' + E.label(ev.date) + " " + E.time12(ev.time) + " — " + esc(ev.title) + (ev.status === "pending" ? ' <span class="tag tag--med-l">Suggested</span>' : "") + "</span>" + (ev.status === "pending" ? '<span class="due"><button type="button" class="btn btn--navy btn--sm" data-act="ev-confirm" data-id="' + ev.id + '">Add</button></span>' : "") + "</div>"; }).join("") : "") + "</div>";
  }

  function vTracker() {
    var pf = state.trackerP || "all";
    var rows = processed().filter(function (e) { return pf === "all" || e.analysis.priority === pf; });
    var body = rows.map(function (e) {
      var a = e.analysis, ts = state.tasks.filter(function (t) { return t.emailId === e.id; });
      return '<tr><td>' + e.row + "</td><td>" + whenLabel(e.received) + "</td><td>" + esc(e.fromName) + "</td><td>" + esc(e.subject) + "</td><td>" + pTag(a.priority) + "</td><td>" + esc(a.category) + "</td><td>" + esc(a.summary.length > 110 ? a.summary.slice(0, 108) + "…" : a.summary) + "</td><td>" + (ts.length ? ts.map(function (t) { return (t.done ? "✓ " : "• ") + esc(t.text); }).join("<br>") : "—") + "</td><td>" + (a.followup ? E.label(a.followup) : "—") + "</td><td>" + esc(replyStatus(e)) + "</td></tr>";
    }).join("") || '<tr><td colspan="10" class="center muted">No rows yet — process an email and it will be logged here automatically.</td></tr>';
    var opt = function (v, l) { return '<option value="' + v + '"' + (pf === v ? " selected" : "") + ">" + l + "</option>"; };
    return '<div class="view__head"><h3>Google Sheets tracker</h3><div class="btn-row"><label class="visually-hidden" for="tr-filter">Filter by priority</label><select id="tr-filter" class="inline-input">' + opt("all", "All priorities") + opt("High", "High") + opt("Medium", "Medium") + opt("Low", "Low") + '</select><button type="button" class="btn btn--outline btn--sm" data-act="csv-download">Download CSV</button><button type="button" class="btn btn--outline btn--sm" data-act="csv-copy">Copy</button></div></div>' +
      '<div style="overflow-x:auto"><table class="sheet" style="min-width:980px"><thead><tr><th>#</th><th>Received</th><th>From</th><th>Subject</th><th>Priority</th><th>Category</th><th>Summary</th><th>Tasks</th><th>Follow-up</th><th>Reply</th></tr></thead><tbody>' + body + "</tbody></table></div>";
  }

  function briefingText() {
    var h = new Date().getHours(), s = state.settings, done = processed(), t = today();
    var name = (s.name || "").split(" ")[0] || "there";
    var high = done.filter(function (e) { return e.analysis.priority === "High" && e.reply && e.reply.status !== "sent"; });
    var open = state.tasks.filter(function (x) { return !x.done; });
    var overdue = open.filter(function (x) { return x.due && x.due < t; });
    var dueToday = open.filter(function (x) { return x.due === t; });
    var soon = open.filter(function (x) { return x.due && x.due > t && x.due <= E.ymd(E.addDays(new Date(), 3)); });
    var cal = state.events.filter(function (e) { return e.status === "confirmed" && e.date >= t && e.date <= E.ymd(E.addDays(new Date(), 1)); }).sort(function (a, b) { return (a.date + a.time) < (b.date + b.time) ? -1 : 1; });
    var pend = state.events.filter(function (e) { return e.status === "pending"; });
    var drafts = done.filter(function (e) { return e.reply && e.reply.status === "draft"; });
    var unproc = state.emails.filter(function (e) { return e.status !== "processed"; }).length;
    var L = [];
    L.push({ h: (h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening") + ", " + name + ".", items: [done.length + " emails processed · " + high.length + " high-priority awaiting a reply · " + open.length + " open tasks · " + drafts.length + " drafts to approve" + (unproc ? " · " + unproc + " emails not yet processed" : "")] });
    L.push({ h: "Needs your attention first", items: high.map(function (e) { return e.fromName + " — " + e.subject; }) });
    L.push({ h: "Overdue", items: overdue.map(function (x) { return x.text + " (was due " + E.label(x.due) + ")"; }) });
    L.push({ h: "Due today", items: dueToday.map(function (x) { return x.text + (x.time ? " — by " + E.time12(x.time) : ""); }) });
    L.push({ h: "Coming up (next 3 days)", items: soon.map(function (x) { return x.text + " — " + E.label(x.due); }) });
    L.push({ h: "Calendar today & tomorrow", items: cal.map(function (e) { return E.friendlyDay(e.date) + " " + E.time12(e.time) + " — " + e.title; }) });
    L.push({ h: "Calendar suggestions to approve", items: pend.map(function (e) { return e.title + " — " + E.label(e.date) + " " + E.time12(e.time); }) });
    L.push({ h: "Drafts awaiting your approval", items: drafts.map(function (e) { return "Reply to " + e.fromName + " — " + e.subject; }) });
    return L;
  }
  function vBriefing() {
    var L = briefingText();
    var html = L.map(function (sec, i) {
      if (i === 0) return '<h3>' + esc(sec.h) + '</h3><p class="muted">' + esc(sec.items[0]) + "</p>";
      return '<p class="mb-0 mt-1"><strong style="color:#fff">' + esc(sec.h) + "</strong></p>" + (sec.items.length ? "<ul>" + sec.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : '<p class="muted mb-0">Nothing here.</p>');
    }).join("");
    return '<div class="view__head"><h3>Daily briefing</h3><div class="btn-row"><button type="button" class="btn btn--outline btn--sm" data-act="brief-refresh">Refresh</button><button type="button" class="btn btn--outline btn--sm" data-act="brief-copy">Copy</button></div></div><div class="view__pad"><div class="briefing">' + html +
      '</div><p class="how-note mt-1 mb-0">In the live system this briefing is generated automatically each morning and emailed to you or posted to WhatsApp/Slack.</p></div>';
  }
  function vLog() {
    return '<div class="view__head"><h3>Execution log</h3><span class="small muted">What the automation did, step by step</span></div><div class="view__pad"><ul class="log">' +
      (state.log.map(function (l) { return '<li><span class="t">' + l.t + '</span><span class="mod mod--' + l.mod + '">' + modName(l.mod) + '</span><span class="msg">' + esc(l.msg) + "</span></li>"; }).join("") || "<li>No activity yet.</li>") + "</ul></div>";
  }
  function vSettings() {
    var s = state.settings, o = function (v, l) { return '<option value="' + v + '"' + (s.tone === v ? " selected" : "") + ">" + l + "</option>"; };
    return '<div class="view__head"><h3>Assistant settings</h3></div><div class="view__pad"><form id="settings-form" class="form-grid" style="max-width:720px">' +
      '<div class="field"><label for="s-name">Your name (signature)</label><input id="s-name" value="' + esc(s.name) + '" maxlength="60"></div>' +
      '<div class="field"><label for="s-biz">Business name</label><input id="s-biz" value="' + esc(s.business) + '" maxlength="80"></div>' +
      '<div class="field"><label for="s-tone">Default reply tone</label><select id="s-tone">' + o("friendly", "Friendly") + o("formal", "Formal") + o("brief", "Brief") + "</select></div>" +
      '<div class="field"><label class="consent" style="margin-top:1.9rem"><input type="checkbox" id="s-auto"' + (s.auto ? " checked" : "") + "> Auto-process new emails</label></div>" +
      '<div class="field full"><label for="s-vip">VIP senders</label><input id="s-vip" value="' + esc(s.vip) + '" placeholder="e.g. grace, accounts@safarisupplies.example"><p class="hint">Names or email addresses, separated by commas. Emails from VIPs get a priority boost.</p></div>' +
      '<div class="full btn-row"><button type="submit" class="btn btn--primary btn--sm">Save settings</button><button type="button" class="btn btn--outline btn--sm" data-act="reset" id="reset-btn">Reset demo</button></div>' +
      '<p class="how-note full mb-0">Settings apply to emails processed after saving. Your demo data is stored only in this browser.</p></form>' +
      '<div class="notice mt-2" style="max-width:720px">' + ic("brain") + '<div><p class="mb-0"><strong>About this demo:</strong> to run on any website without sharing data, the analysis here uses a built-in rules engine that mimics the AI step. In a real deployment, an AI language model connected through Make.com performs this step for more nuanced summaries and replies, and Gmail, Google Sheets and Google Calendar are updated for real.</p></div></div></div>';
  }

  /* ---------------- Compose dialog ---------------- */
  var dlg = document.getElementById("compose");
  function openCompose(sample) {
    var f = document.getElementById("compose-form"); f.reset();
    if (sample) fill(sample);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    setTimeout(function () { document.getElementById("c-from").focus(); }, 30);
  }
  function fill(s) { document.getElementById("c-from").value = s.fromName; document.getElementById("c-addr").value = s.fromEmail; document.getElementById("c-subj").value = s.subject; document.getElementById("c-body").value = s.body; }
  function closeCompose() { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); }

  /* ---------------- Toast ---------------- */
  var tt;
  function toast(msg) { var t = document.getElementById("toast"); t.textContent = msg; t.classList.add("is-visible"); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("is-visible"); }, 3600); }

  /* ---------------- Events ---------------- */
  root.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-act],[data-view]"); if (!b || !root.contains(b)) return;
    if (b.hasAttribute("data-view")) { state.view = b.getAttribute("data-view"); render(); save(); return; }
    var act = b.getAttribute("data-act"), did = b.getAttribute("data-id"), e = getEmail(state.selected);
    switch (act) {
      case "select": select(did); break;
      case "process": enqueue([did]); break;
      case "process-all": enqueue(state.emails.filter(function (x) { return x.status === "new"; }).map(function (x) { return x.id; }).reverse(), true); toast("Processing every unprocessed email…"); break;
      case "simulate": simulate(); break;
      case "compose": openCompose(); break;
      case "filter": state.filter = b.getAttribute("data-filter"); render(); save(); break;
      case "approve": if (e) approve(e); break;
      case "reject": if (e) reject(e); break;
      case "tone":
        if (e && e.analysis) {
          var tone = b.getAttribute("data-tone"); e.reply.tone = tone;
          e.reply.text = E.draftReply(e.analysis, e, Object.assign({}, state.settings, { tone: tone }));
          log("ai", "Redrafted reply to " + e.fromName + " · " + tone + " tone"); save(); render();
        } break;
      case "ev-confirm": var c = state.events.filter(function (x) { return x.id === did; })[0]; if (c) confirmEvent(c); break;
      case "ev-dismiss": var d = state.events.filter(function (x) { return x.id === did; })[0]; if (d) dismissEvent(d); break;
      case "task-del": state.tasks = state.tasks.filter(function (t) { return t.id !== did; }); save(); render(); break;
      case "csv-download":
        try { var blob = new Blob([csv()], { type: "text/csv" }); var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ai-assistant-tracker.csv"; document.body.appendChild(a); a.click(); a.remove(); toast("Tracker downloaded as CSV — opens in Excel or Google Sheets."); }
        catch (err) { toast("Download isn't available here — use Copy instead."); } break;
      case "csv-copy": copy(csv(), "Tracker copied — paste it into Google Sheets or Excel."); break;
      case "brief-refresh": log("ai", "Daily briefing generated"); render(); toast("Briefing refreshed."); break;
      case "brief-copy": copy(briefingText().map(function (s, i) { return i === 0 ? s.h + "\n" + s.items[0] : s.h + ":\n" + (s.items.length ? s.items.map(function (x) { return "• " + x; }).join("\n") : "• Nothing"); }).join("\n\n"), "Briefing copied."); break;
      case "reset":
        if (b.getAttribute("data-armed") !== "1") { b.setAttribute("data-armed", "1"); b.textContent = "Click again to confirm reset"; return; }
        try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ }
        queue = []; seed(); render(); save(); toast("Demo reset to the starting inbox."); break;
    }
  });
  root.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t.matches("[data-act='task-toggle']")) {
      var task = state.tasks.filter(function (x) { return x.id === t.getAttribute("data-id"); })[0];
      if (task) { task.done = t.checked; if (task.done) log("you", "Completed task · " + task.text); save(); render(); }
    } else if (t.id === "fu-date") {
      var e = getEmail(state.selected); if (e && e.analysis && t.value) { e.analysis.followup = t.value; log("sheets", "Update row " + e.row + " · follow-up → " + E.label(t.value)); save(); }
    } else if (t.id === "tr-filter") { state.trackerP = t.value; render(); }
    else if (t.id === "auto-toggle") { state.settings.auto = t.checked; save(); toast(t.checked ? "Auto-process on — new emails are handled as they arrive." : "Auto-process off — run the assistant manually."); render(); }
  });
  root.addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.id === "mail-search") { state.q = t.value; render(); }
    else if (t.id === "draft-text") { var e = getEmail(state.selected); if (e && e.reply) { e.reply.text = t.value; save(); } }
  });
  root.addEventListener("submit", function (ev) {
    var f = ev.target; ev.preventDefault();
    if (f.id === "task-form") {
      var txt = document.getElementById("new-task").value.trim(); if (!txt) { document.getElementById("new-task").focus(); return; }
      state.tasks.push({ id: id(), text: txt, due: document.getElementById("new-due").value || null, done: false, emailId: null });
      log("you", "Added task · " + txt); save(); render(); document.getElementById("new-task").focus();
    } else if (f.id === "settings-form") {
      var s = state.settings;
      s.name = document.getElementById("s-name").value.trim() || "Your name"; s.business = document.getElementById("s-biz").value.trim();
      s.tone = document.getElementById("s-tone").value; s.vip = document.getElementById("s-vip").value; s.auto = document.getElementById("s-auto").checked;
      log("you", "Updated assistant settings"); save(); render(); toast("Settings saved.");
    } else if (f.id === "compose-form") {
      var data = { fromName: document.getElementById("c-from").value.trim(), fromEmail: document.getElementById("c-addr").value.trim(), subject: document.getElementById("c-subj").value.trim(), body: document.getElementById("c-body").value.trim() };
      if (!data.subject || !data.body) { document.getElementById("compose-err").hidden = false; return; }
      data.fromName = data.fromName || "Website visitor"; data.fromEmail = data.fromEmail || "visitor@example.com";
      document.getElementById("compose-err").hidden = true;
      var e = addEmail(data, null, true); closeCompose(); log("gmail", "New email received from " + data.fromName);
      state.selected = e.id; state.view = "inbox"; state.filter = "all"; state.q = ""; render(); save();
      toast(state.settings.auto ? "Email received — the assistant is processing it…" : "Email added to the inbox.");
      if (state.settings.auto) enqueue([e.id]);
    }
  });
  dlg.addEventListener("click", function (ev) {
    var ex = ev.target.closest("[data-example]"); if (ex) { fill(EXAMPLES[ex.getAttribute("data-example")]); return; }
    if (ev.target.closest("[data-close]") || ev.target === dlg) closeCompose();
  });

  /* ---------------- Init ---------------- */
  pipeEls = Array.prototype.slice.call(root.querySelectorAll(".pipe"));
  document.getElementById("compose-examples").innerHTML = Object.keys(EXAMPLES).map(function (k) { return '<button type="button" data-example="' + esc(k) + '">' + esc(k) + "</button>"; }).join("");
  load(); render();
  var tk = $("#ticker"); if (tk && state.log[0]) tk.textContent = "› " + modName(state.log[0].mod) + " · " + state.log[0].msg;
})();
