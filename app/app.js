/* =========================================================
   AI Executive Assistant — interactive demonstration app
   ========================================================= */
(function () {
  "use strict";
  var E = window.DemoEngine, CFG = window.APP_CONFIG || {};
  var esc = E.esc, fmt = E.fmt, fmtTime = E.fmtTime, rel = E.rel, iso = E.iso;
  var KEY = "eaDemoApp.v2";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- Icons ---------------- */
  var IC = {
    home: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z"/>',
    spark: '<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z"/><path d="M19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7z"/>',
    check: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
    repeat: '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.8 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7.3 19.6l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.8H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.4 7.3l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.8-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.8 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.8H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1.1z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    flag: '<path d="M4 22V4m0 0h13l-2 4 2 4H4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    archive: '<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    bolt: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
    ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    board: '<rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="11" rx="1"/>',
    grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
    chev: '<path d="M9 18l6-6-6-6"/>', chevL: '<path d="M15 18l-9-6 9-6"/>'
  };
  function ic(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + "</svg>"; }

  /* ---------------- State ---------------- */
  var S, ui = { useLive: true, editing: null, taskView: "list", notifOpen: false, view: "overview", filter: "all", selected: null, query: "", taskTab: "open", weekOffset: 0, analyzeResult: null, analyzeInput: null };
  var uid = function () { return Math.random().toString(36).slice(2, 9); };
  var DEFAULT_SETTINGS = { yourName: "Naomi Mwangi", businessName: "AI Automation Services", tone: "Formal",
    vipSenders: "", urgentKeywords: "urgent, asap, immediately, deadline, overdue, critical, final reminder", autoProcess: true };

  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } }
  function load() {
    try { localStorage.removeItem("eaDemoApp.v1"); } catch (e) { /* old sample data */ }
    try { var raw = localStorage.getItem(KEY); if (raw) { var d = JSON.parse(raw); if (d && d.v === 1) { d.notifications = d.notifications || []; d.notified = d.notified || {}; return d; } } } catch (e) { /* ignore */ }
    return null;
  }

  function seed() {
    S = { v: 1, settings: Object.assign({}, DEFAULT_SETTINGS), emails: [], tasks: [], events: [], followups: [], activity: [], notifications: [], notified: {}, created: Date.now() };
    save();
  }

  function addTasksFrom(em, silent) {
    var a = em.analysis; if (!a) return 0; var n = 0;
    a.tasks.forEach(function (t) {
      if (S.tasks.some(function (x) { return x.emailId === em.id && x.text === t.text; })) return;
      S.tasks.push({ id: uid(), text: t.text, due: t.due, done: false, priority: a.priority, emailId: em.id, createdTs: Date.now() }); n++;
    });
    if (n && !silent) log("task", n + " task" + (n > 1 ? "s" : "") + " created from “" + trunc(em.subject, 50) + "”");
    return n;
  }
  function log(type, text, ts) { S.activity.unshift({ ts: ts || Date.now(), type: type, text: text }); S.activity.sort(function (a, b) { return b.ts - a.ts; }); S.activity = S.activity.slice(0, 60); }
  function trunc(s, n) { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  function email(id) { return S.emails.filter(function (e) { return e.id === id; })[0]; }
  function ago(ts) {
    var m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return "just now"; if (m < 60) return m + " min ago"; var h = Math.round(m / 60); if (h < 24) return h + " h ago";
    var d = Math.round(h / 24); return d === 1 ? "yesterday" : d + " days ago";
  }
  function when(ts) {
    var d = new Date(ts), n = new Date();
    if (d.toDateString() === n.toDateString()) return pad(d.getHours()) + ":" + pad(d.getMinutes());
    var y = new Date(); y.setDate(y.getDate() - 1); if (d.toDateString() === y.toDateString()) return "Yesterday";
    return fmt(iso(d));
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var COLORS = ["#6c5ce7", "#3d7bf0", "#149a6c", "#d9821a", "#c2458d", "#0f1e45", "#2a9bb5", "#7a5c3e"];
  function avColor(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return COLORS[h % COLORS.length]; }
  function initials(n) { return String(n).replace(/<.*$/, "").split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase(); }
  function pClass(p) { return "p-" + String(p || "low").toLowerCase(); }
  function pBadge(p) { return '<span class="badge ' + pClass(p) + '">' + esc(p) + "</span>"; }
  function catBadge(c) { return '<span class="badge b-cat">' + esc(c) + "</span>"; }
  var PRANK = { Urgent: 0, Important: 1, Normal: 2, Low: 3 };

  /* ---------------- Analysis provider ---------------- */
  var AI_LIMIT = CFG.aiDailyLimit || 8;
  function aiQuota() {
    var t = iso(new Date());
    try { var d = JSON.parse(localStorage.getItem("eaAiQuota") || "{}"); return d.day === t ? d : { day: t, n: 0 }; } catch (e) { return { day: t, n: 0 }; }
  }
  function aiLeft() { return Math.max(0, AI_LIMIT - aiQuota().n); }
  function aiUse() { var q = aiQuota(); q.n++; try { localStorage.setItem("eaAiQuota", JSON.stringify(q)); } catch (e) { /* */ } }
  function liveAvailable() { return !!CFG.aiEndpoint; }
  function runAnalysis(em, live) {
    var base = E.analyze(em, S.settings);
    if (!live || !liveAvailable()) return Promise.resolve(base);
    if (!aiLeft()) { base.engineNote = "Today's live-AI limit for this browser is used up — demonstration engine shown"; return Promise.resolve(base); }
    aiUse();
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, (CFG.aiTimeoutSeconds || 60) * 1000);
    var body = new URLSearchParams({ from: em.from || "", email: em.email || "", subject: em.subject || "", body: em.body || "", yourName: S.settings.yourName || "" });
    return fetch(CFG.aiEndpoint, { method: "POST", body: body, signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .then(function (t) { clearTimeout(timer); var ai = parseAI(t); if (!ai) throw new Error("not JSON"); return normaliseAI(ai, base); })
      .catch(function () { clearTimeout(timer); base.engineNote = "Live AI is unavailable right now — demonstration engine shown instead"; return base; });
  }
  function parseAI(t) {
    if (!t) return null;
    t = String(t).replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/, "");
    var a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a < 0 || b <= a) return null;
    try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { return null; }
  }
  function normaliseAI(ai, base) {
    var DATE = /^\d{4}-\d{2}-\d{2}$/, TIME = /^\d{2}:\d{2}$/;
    function str(v, d, n) { return typeof v === "string" && v.trim() ? v.trim().slice(0, n || 400) : d; }
    function arr(v, n) { return Array.isArray(v) ? v.filter(function (x) { return typeof x === "string" && x.trim(); }).map(function (x) { return x.trim().slice(0, 120); }).slice(0, n || 5) : []; }
    function oneOf(v, list, d) { return list.indexOf(v) >= 0 ? v : d; }
    var o = Object.assign({}, base), en = ai.entities && typeof ai.entities === "object" ? ai.entities : {};
    o.engine = "ai"; o.engineNote = null;
    o.category = oneOf(ai.category, E.CATEGORIES, base.category);
    o.intent = str(ai.intent, base.intent, 90);
    o.intentId = "ai";
    o.confidence = typeof ai.confidence === "number" && ai.confidence >= 0 && ai.confidence <= 1 ? ai.confidence : base.confidence;
    o.secondaryIntents = arr(ai.secondaryIntents, 2);
    o.priority = oneOf(ai.priority, ["Urgent", "Important", "Normal", "Low"], base.priority);
    o.reasons = arr(ai.reasons, 4); if (!o.reasons.length) o.reasons = base.reasons;
    o.requiresResponse = typeof ai.requiresResponse === "boolean" ? ai.requiresResponse : base.requiresResponse;
    o.sentiment = oneOf(ai.sentiment, ["Positive", "Neutral", "Concerned", "Negative"], base.sentiment);
    o.summary = str(ai.summary, base.summary, 420);
    o.shortSummary = str(ai.shortSummary, trunc(o.summary, 118), 120);
    o.entities = { people: arr(en.people, 4), organisations: arr(en.organisations, 4), amounts: arr(en.amounts, 4), references: arr(en.references, 4),
      dates: Array.isArray(en.dates) ? en.dates.filter(function (d) { return d && DATE.test(d.date); }).map(function (d) { return { phrase: str(d.phrase, d.date, 60), date: d.date }; }).slice(0, 5) : [],
      times: arr(en.times, 4), locations: arr(en.locations, 4), phones: arr(en.phones, 3), emails: arr(en.emails, 3), links: arr(en.links, 3) };
    o.deadlines = Array.isArray(ai.deadlines) ? ai.deadlines.filter(function (d) { return d && DATE.test(d.date); }).map(function (d) {
      return { label: oneOf(d.label, ["Deadline", "Meeting / event", "Mentioned date"], "Deadline"), date: d.date, time: TIME.test(d.time) ? d.time : null, phrase: str(d.phrase, E.fmt(d.date), 60), context: str(d.context, "", 120) };
    }).slice(0, 4) : base.deadlines;
    o.tasks = Array.isArray(ai.tasks) ? ai.tasks.filter(function (t) { return t && typeof t.text === "string" && t.text.trim(); }).map(function (t) { return { text: t.text.trim().slice(0, 100), due: DATE.test(t.due) ? t.due : null }; }).slice(0, 5) : base.tasks;
    o.event = ai.event && typeof ai.event === "object" && DATE.test(ai.event.date) ? { title: str(ai.event.title, "Meeting", 80), date: ai.event.date, time: TIME.test(ai.event.time) ? ai.event.time : "10:00", kind: oneOf(ai.event.kind, ["meeting", "call", "event"], "meeting"), proposed: !!ai.event.proposed } : null;
    o.followup = ai.followup && DATE.test(ai.followup.date) ? { date: ai.followup.date, note: str(ai.followup.note, "Check in", 100) } : (o.requiresResponse ? base.followup : null);
    o.action = str(ai.action, base.action, 120);
    o.actionType = oneOf(ai.actionType, ["reply", "calendar", "task", "archive", "file", "read"], base.actionType);
    o.responseTime = str(ai.responseTime, base.responseTime, 40);
    o.drafts = ai.drafts && typeof ai.drafts === "object" ? { Formal: str(ai.drafts.Formal, "", 3000), Friendly: str(ai.drafts.Friendly, "", 3000), Concise: str(ai.drafts.Concise, "", 3000) } : null;
    o.keywords = [];
    return o;
  }
  function draftFor(e, a, tone) {
    if (a.drafts && a.drafts[tone]) return a.drafts[tone].replace(/\\n/g, "\n");
    return E.draft(e, a, tone, S.settings);
  }
  function engineLabel() { return liveAvailable() ? "Demo engine + Live AI" : "Demonstration engine"; }

  /* ---------------- Derived data ---------------- */
  function active() { return S.emails.filter(function (e) { return e.status !== "archived"; }); }
  function processed() { return S.emails.filter(function (e) { return e.analysis; }); }
  function needsReply(e) { return e.analysis && e.analysis.requiresResponse && e.status !== "replied" && e.status !== "archived"; }
  function isImportant(e) { return e.analysis && (e.analysis.priority === "Urgent" || e.analysis.priority === "Important"); }
  var FILTERS = [
    { id: "all", label: "All emails", test: function () { return true; } },
    { id: "urgent", label: "Urgent", test: function (e) { return e.analysis && e.analysis.priority === "Urgent"; } },
    { id: "important", label: "Important", test: function (e) { return e.analysis && e.analysis.priority === "Important"; } },
    { id: "response", label: "Requires response", test: needsReply },
    { id: "meetings", label: "Meetings", test: function (e) { return e.analysis && (e.analysis.category === "Meeting" || !!(e.analysis.event && !e.analysis.event.proposed)); } },
    { id: "info", label: "General information", test: function (e) { return e.analysis && (e.analysis.category === "General information" || e.analysis.category === "Internal" || e.analysis.intentId === "receipt"); } },
    { id: "unprocessed", label: "Not analysed", test: function (e) { return !e.analysis; }, hideIfEmpty: true }
  ];
  function openTasks() { return S.tasks.filter(function (t) { return !t.done; }); }
  function upcomingDeadlines() {
    var today = iso(new Date()), lim = iso(E.addDays(new Date(), 7));
    return openTasks().filter(function (t) { return t.due && t.due <= lim; }).sort(function (a, b) { return a.due < b.due ? -1 : a.due > b.due ? 1 : 0; });
  }
  function pendingFollowups() { return S.followups.filter(function (f) { return f.status === "waiting"; }); }

  /* ---------------- Shell ---------------- */
  var VIEWS = {
    overview: { title: "Overview", sub: "Your inbox, tasks and schedule at a glance", icon: "home" },
    inbox: { title: "Smart Inbox", sub: "Every email summarised, prioritised and ready for action", icon: "inbox" },
    analyze: { title: "Analyse an email", sub: "Paste or write a fictional email and watch the assistant work", icon: "spark" },
    tasks: { title: "Tasks & deadlines", sub: "Action items extracted from your email", icon: "check" },
    followups: { title: "Follow-ups", sub: "Conversations waiting on you — or on someone else", icon: "repeat" },
    calendar: { title: "Calendar", sub: "Meetings and suggestions from your inbox", icon: "cal" },
    briefing: { title: "Daily briefing", sub: "What needs your attention today", icon: "sun" },
    settings: { title: "Assistant settings", sub: "Tune how the assistant prioritises and writes", icon: "cog" }
  };
  function renderNav() {
    var counts = {
      inbox: active().filter(function (e) { return !e.read; }).length,
      tasks: openTasks().length,
      followups: pendingFollowups().length + S.emails.filter(needsReply).length,
      calendar: S.events.filter(function (e) { return e.status === "suggested"; }).length
    };
    var groups = [["Workspace", ["overview", "inbox", "analyze"]], ["Organise", ["tasks", "followups", "calendar", "briefing"]], ["", ["settings"]]];
    $("#nav").innerHTML = groups.map(function (g) {
      return (g[0] ? '<li class="nav__label">' + g[0] + "</li>" : '<li class="nav__label" aria-hidden="true"></li>') + g[1].map(function (k) {
        var c = counts[k] ? '<span class="count" aria-label="' + counts[k] + ' items">' + counts[k] + "</span>" : "";
        return '<li><a href="#' + k + '"' + (ui.view === k ? ' aria-current="page"' : "") + ">" + ic(VIEWS[k].icon) + "<span>" + VIEWS[k].title + "</span>" + c + "</a></li>";
      }).join("");
    }).join("");
    $("#engine-name").textContent = engineLabel();
    $("#engine-dot").className = "dot" + (liveAvailable() ? " dot--live" : "");
    $("#engine-desc").textContent = liveAvailable() ? "Emails you paste on “Analyse an email” can be read by a live AI model through Make.com, or by the instant rule-based engine in your browser." : "Rule-based analysis running in your browser. No AI service is called and no data leaves this page.";
    $("#avatar").textContent = initials(S.settings.yourName || "You");
  }
  function render() {
    var v = VIEWS[ui.view] || VIEWS.overview;
    $("#page-title").textContent = v.title; $("#page-sub").textContent = v.sub;
    document.title = v.title + " — AI Executive Assistant (Demo)";
    renderNav();
    var html = ({ overview: vOverview, inbox: vInbox, analyze: vAnalyze, tasks: vTasks, followups: vFollowups, calendar: vCalendar, briefing: vBriefing, settings: vSettings }[ui.view] || vOverview)();
    $("#view").innerHTML = html;
    afterRender();
  }
  function go(view) { if (location.hash !== "#" + view) location.hash = view; else { ui.view = view; render(); } }
  function onHash() {
    var h = (location.hash || "#overview").slice(1);
    if (!VIEWS[h]) h = "overview";
    ui.view = h; closeMenu(); render(); window.scrollTo(0, 0);
    var v = $("#view"); if (v) v.focus({ preventScroll: true });
  }

  /* ---------------- Overview ---------------- */
  function vOverview() {
    var hr = new Date().getHours(), greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
    var name = String(S.settings.yourName || "").split(" ")[0];
    var p = processed(), imp = active().filter(isImportant).filter(function (e) { return e.status !== "replied"; });
    var dl = upcomingDeadlines(), done = S.tasks.filter(function (t) { return t.done; });
    var overdue = openTasks().filter(function (t) { return t.due && t.due < iso(new Date()); }).length;
    var kpis = [
      ["mail", "tone-purple", p.length, "Emails processed", "inbox", S.emails.length - p.length ? (S.emails.length - p.length) + " pending" : "all analysed"],
      ["flag", "tone-red", imp.length, "Important emails", "inbox:important", active().filter(function (e) { return e.analysis && e.analysis.priority === "Urgent" && e.status !== "replied"; }).length + " urgent"],
      ["list", "tone-blue", openTasks().length, "Pending tasks", "tasks", overdue ? overdue + " overdue" : ""],
      ["clock", "tone-amber", dl.length, "Upcoming deadlines", "tasks", "next 7 days"],
      ["repeat", "tone-navy", pendingFollowups().length + S.emails.filter(needsReply).length, "Pending follow-ups", "followups", S.emails.filter(needsReply).length + " need a reply"],
      ["check", "tone-green", done.length, "Tasks completed", "tasks:done", "this week"]
    ];
    var kHtml = kpis.map(function (k) {
      return '<button class="card kpi" data-act="nav" data-to="' + k[4] + '"><span class="kpi__delta">' + esc(k[5]) + '</span><div class="kpi__icon ' + k[1] + '">' + ic(k[0]) + '</div><div class="kpi__val">' + k[2] + '</div><div class="kpi__label">' + k[3] + "</div></button>";
    }).join("");

    var attention = active().filter(function (e) { return e.analysis && e.status !== "replied" && (isImportant(e) || needsReply(e)); })
      .sort(function (a, b) { return PRANK[a.analysis.priority] - PRANK[b.analysis.priority] || b.ts - a.ts; }).slice(0, 5);
    var attHtml = attention.length ? '<ul class="list">' + attention.map(function (e) {
      return '<li><button class="row row--btn" data-act="open" data-id="' + e.id + '"><span class="pdot ' + e.analysis.priority.toLowerCase() + '"></span><span class="row__main"><span class="row__title">' + esc(e.subject) + '</span><span class="row__sub">' + esc(e.from) + " · " + esc(e.analysis.action) + '</span></span>' + pBadge(e.analysis.priority) + "</button></li>";
    }).join("") + "</ul>" : (S.emails.length ? empty("check", "You're all caught up.") : startHtml());

    var actIc = { process: ["spark", "tone-purple"], task: ["check", "tone-green"], sent: ["send", "tone-blue"], calendar: ["cal", "tone-amber"], alert: ["alert", "tone-red"], followup: ["repeat", "tone-navy"], new: ["mail", "tone-blue"], settings: ["cog", "tone-navy"] };
    var actHtml = !S.activity.length ? empty("bolt", "Activity will appear here as you use the assistant.") : '<ul class="list activity">' + S.activity.slice(0, 7).map(function (a) {
      var x = actIc[a.type] || actIc.process;
      return '<li><span class="a-ico ' + x[1] + '">' + ic(x[0]) + '</span><span>' + esc(a.text) + '<time datetime="' + new Date(a.ts).toISOString() + '">' + ago(a.ts) + "</time></span></li>";
    }).join("") + "</ul>";

    var dlHtml = dl.length ? '<ul class="list">' + dl.slice(0, 6).map(function (t) {
      return '<li class="row"><span class="pdot ' + String(t.priority || "normal").toLowerCase() + '"></span><span class="row__main"><span class="row__title">' + esc(t.text) + '</span><span class="row__sub">' + (t.emailId && email(t.emailId) ? esc(email(t.emailId).from) : "Manual task") + '</span></span><span class="row__meta">' + dueLabel(t.due) + "</span></li>";
    }).join("") + "</ul>" : empty("clock", "No deadlines in the next 7 days.");

    var cats = {}; p.forEach(function (e) { cats[e.analysis.category] = (cats[e.analysis.category] || 0) + 1; });
    var maxC = Math.max.apply(null, Object.keys(cats).map(function (k) { return cats[k]; }).concat([1]));
    var barHtml = !p.length ? '<p class="muted small">Categories appear once emails are analysed.</p>' : '<div class="bars">' + Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; }).map(function (k) {
      return '<div class="bar"><span>' + esc(k) + '</span><span class="bar__track"><span class="bar__fill" style="width:' + Math.round(cats[k] / maxC * 100) + '%"></span></span><b>' + cats[k] + "</b></div>";
    }).join("") + "</div>";
    var pr = { Urgent: 0, Important: 0, Normal: 0, Low: 0 }; p.forEach(function (e) { pr[e.analysis.priority]++; });
    var tot = p.length || 1, pc = { Urgent: "var(--urgent)", Important: "var(--important)", Normal: "var(--normal)", Low: "#c3c8d4" };
    var stack = '<div class="stack" role="img" aria-label="Priority mix: ' + Object.keys(pr).map(function (k) { return pr[k] + " " + k; }).join(", ") + '">' + Object.keys(pr).map(function (k) { return '<span style="width:' + (pr[k] / tot * 100) + "%;background:" + pc[k] + '"></span>'; }).join("") + '</div><div class="legend">' + Object.keys(pr).map(function (k) { return '<span><i class="pdot ' + k.toLowerCase() + '"></i>' + k + " " + pr[k] + "</span>"; }).join("") + "</div>";

    var today = iso(new Date()), tmr = iso(E.addDays(new Date(), 1));
    var sched = S.events.filter(function (e) { return e.status === "confirmed" && (e.date === today || e.date === tmr); }).sort(evSort);
    var schedHtml = sched.length ? '<ul class="list">' + sched.map(function (e) { return '<li class="row"><span class="row__meta" style="width:58px">' + fmtTime(e.time) + '</span><span class="row__main"><span class="row__title">' + esc(e.title) + '</span><span class="row__sub">' + (e.date === today ? "Today" : "Tomorrow") + "</span></span></li>"; }).join("") + "</ul>" : empty("cal", "Nothing scheduled today or tomorrow.");
    var sugg = S.events.filter(function (e) { return e.status === "suggested"; }).length;

    return '<div class="page-head fade-in"><div><h2 style="font-size:1.45rem">' + greet + ", " + esc(name) + '</h2><p>' + esc(longDate()) + " · Here's what your assistant has prepared.</p></div>" +
      '<div class="btn-row"><a class="btn" href="#briefing">' + ic("sun") + ' Daily briefing</a><a class="btn btn--primary" href="#analyze">' + ic("spark") + " Analyse an email</a></div></div>" +
      '<div class="kpis fade-in">' + kHtml + "</div>" +
      '<div class="ov-grid fade-in"><section class="card" id="attention"><div class="card__head"><h2>' + ic("flag") + 'Needs your attention</h2><a class="btn btn--ghost btn--sm" href="#inbox">Open inbox ' + ic("arrow") + "</a></div>" + attHtml + "</section>" +
      '<section class="card"><div class="card__head"><h2>' + ic("bolt") + "Recent activity</h2></div>" + actHtml + "</section></div>" +
      '<div class="ov-grid ov-grid--3 fade-in" style="margin-top:1rem"><section class="card"><div class="card__head"><h2>' + ic("clock") + 'Upcoming deadlines</h2><a class="btn btn--ghost btn--sm" href="#tasks">All tasks</a></div>' + dlHtml + "</section>" +
      '<section class="card"><div class="card__head"><h2>' + ic("tag") + 'Inbox by category</h2></div><div class="card__body">' + barHtml + '<h3 class="mt-1" style="font-size:.8rem;color:var(--muted);margin-bottom:.2rem">Priority mix</h3>' + stack + "</div></section>" +
      '<section class="card"><div class="card__head"><h2>' + ic("cal") + 'Today &amp; tomorrow</h2><a class="btn btn--ghost btn--sm" href="#calendar">Calendar</a></div>' + schedHtml + (sugg ? '<div class="card__foot small"><a href="#calendar">' + sugg + " meeting suggestion" + (sugg > 1 ? "s" : "") + " waiting for approval →</a></div>" : "") + "</section></div>";
  }
  function longDate() { var d = new Date(); return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()] + ", " + d.getDate() + " " + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()] + " " + d.getFullYear(); }
  function dueLabel(due) {
    if (!due) return '<span class="muted">No date</span>';
    var d = E.daysFrom(due), cls = d < 0 ? "overdue" : d === 0 ? "today" : "";
    return '<span class="due ' + cls + '">' + (d < 0 ? "Overdue · " : "") + fmt(due) + "</span>";
  }
  function startHtml() {
    return '<div class="empty start">' + ic("spark") + '<p><b style="color:var(--ink)">Your inbox is empty.</b><br>Paste or write an email and the assistant will summarise it, set a priority, pull out tasks and deadlines, and draft a reply.</p><a class="btn btn--primary" href="#analyze">' + ic("spark") + " Analyse your first email</a></div>";
  }
  function empty(icon, text) { return '<div class="empty">' + ic(icon) + "<p class=\"mb-0\">" + esc(text) + "</p></div>"; }
  function evSort(a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : (a.time || "") < (b.time || "") ? -1 : 1; }

  /* ---------------- Inbox ---------------- */
  function visibleEmails() {
    var f = FILTERS.filter(function (x) { return x.id === ui.filter; })[0] || FILTERS[0];
    var q = ui.query.trim().toLowerCase();
    return active().filter(f.test).filter(function (e) {
      if (!q) return true;
      return (e.from + " " + e.org + " " + e.subject + " " + e.body + " " + (e.analysis ? e.analysis.summary + " " + e.analysis.category : "")).toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return b.ts - a.ts; });
  }
  function vInbox() {
    var list = visibleEmails();
    var chips = FILTERS.filter(function (f) { return !f.hideIfEmpty || active().filter(f.test).length; }).map(function (f) {
      return '<button class="chip" data-act="filter" data-f="' + f.id + '" aria-pressed="' + (ui.filter === f.id) + '">' + f.label + ' <span class="n">' + active().filter(f.test).length + "</span></button>";
    }).join("");
    var items = list.length ? list.map(mailItem).join("") : (!active().length && !ui.query ? startHtml() : empty("inbox", ui.query ? "No emails match “" + ui.query + "”." : "No emails in this view."));
    var sel = ui.selected && email(ui.selected);
    var mobileSearch = '<div class="field" style="margin-bottom:.6rem"><label class="sr-only" for="inbox-q">Search emails</label><input id="inbox-q" type="search" placeholder="Search sender, subject or content…" value="' + esc(ui.query) + '"></div>';
    return '<div class="inbox-layout' + (sel ? " has-detail" : "") + '">' +
      '<section class="inbox-list"><div class="chips" role="toolbar" aria-label="Inbox filters">' + chips + "</div>" + mobileSearch +
      '<div class="card"><div class="card__head" style="padding-bottom:.6rem"><h2>' + ic("inbox") + esc((FILTERS.filter(function (f) { return f.id === ui.filter; })[0] || FILTERS[0]).label) + '</h2><span class="small muted">' + list.length + " email" + (list.length === 1 ? "" : "s") + '</span></div><div class="mail-list"><ul class="list" aria-label="Emails">' + items + "</ul></div></div></section>" +
      '<section class="detail" aria-live="polite">' + (sel ? detailHtml(sel) : '<div class="card">' + empty("mail", active().length ? "Select an email to see the assistant's analysis." : "Analysed emails you add will appear here with their full analysis.") + "</div>") + "</section></div>";
  }
  function mailItem(e) {
    var a = e.analysis;
    var tags = a ? pBadge(a.priority) + catBadge(a.category) + (e.status === "replied" ? '<span class="badge b-green">Replied</span>' : needsReply(e) ? '<span class="badge b-outline">Needs reply</span>' : "") : '<span class="badge b-outline">Not analysed</span>';
    return '<li><button class="mail' + (e.read ? "" : " unread") + '" data-act="open" data-id="' + e.id + '" aria-current="' + (ui.selected === e.id) + '">' +
      '<span class="av" style="background:' + avColor(e.from) + '" aria-hidden="true">' + esc(initials(e.from)) + '</span>' +
      '<span class="mail__top"><span class="mail__from">' + esc(e.from) + '</span><time class="mail__date">' + when(e.ts) + "</time></span>" +
      '<span class="mail__subj">' + esc(e.subject) + "</span>" +
      '<span class="mail__sum">' + esc(a ? a.shortSummary : trunc(e.body.replace(/\s+/g, " "), 110)) + "</span>" +
      '<span class="mail__tags">' + tags + (a ? '<span class="mail__action">' + ic("target") + esc(trunc(a.action, 46)) + "</span>" : "") + "</span></button></li>";
  }
  function highlight(e) {
    var text = esc(e.body), a = e.analysis; if (!a) return text;
    var terms = [];
    (a.keywords || []).forEach(function (k) { terms.push(k); });
    (a.entities.amounts || []).concat(a.entities.references || [], a.entities.times || [], (a.entities.dates || []).map(function (d) { return d.phrase; })).forEach(function (t) { terms.push(t); });
    terms = terms.filter(function (t) { return t && t.length > 2; }).sort(function (x, y) { return y.length - x.length; });
    if (!terms.length) return text;
    var re = new RegExp("(" + terms.map(function (t) { return esc(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")", "gi");
    return text.replace(re, "<mark>$1</mark>");
  }
  function detailHtml(e) {
    var head = '<button class="btn btn--sm back-btn" data-act="close-detail">' + ic("back") + " Back to inbox</button>" +
      '<div class="card"><div class="detail__head"><div class="detail__meta">' + (e.analysis ? pBadge(e.analysis.priority) + catBadge(e.analysis.category) : "") + (e.status === "replied" ? '<span class="badge b-green">Replied</span>' : "") + "</div>" +
      '<h2 class="detail__subj">' + esc(e.subject) + "</h2>" +
      '<div class="detail__meta"><span class="av" style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:.65rem;font-weight:700;background:' + avColor(e.from) + '">' + esc(initials(e.from)) + "</span><span><b style=\"color:var(--ink)\">" + esc(e.from) + "</b>" + (e.org ? " · " + esc(e.org) : "") + '</span><span>&lt;' + esc(e.email || "") + '&gt;</span><span>' + when(e.ts) + " (" + ago(e.ts) + ")</span></div>" +
      '<div class="btn-row" style="margin-top:.8rem">' +
      (e.analysis ? "" : '<button class="btn btn--primary btn--sm" data-act="process" data-id="' + e.id + '">' + ic("spark") + " Run AI analysis</button>") +
      (e.analysis ? '<button class="btn btn--sm" data-act="reanalyse" data-id="' + e.id + '">' + ic("refresh") + " Re-analyse</button>" : "") +
      '<button class="btn btn--sm" data-act="archive" data-id="' + e.id + '">' + ic("archive") + " Archive</button>" +
      '<button class="btn btn--sm" data-act="toggle-read" data-id="' + e.id + '">' + ic("mail") + (e.read ? " Mark unread" : " Mark read") + "</button></div></div>" +
      '<div class="detail__body" aria-label="Email body">' + highlight(e) + "</div>";
    if (!e.analysis) return head + '<div class="card__body" style="padding-top:1rem">' + empty("spark", "This email hasn't been analysed yet.") + "</div></div>";
    return head + '<div class="hint" style="padding:.6rem 1.2rem 0">Highlighted text influenced the analysis. ' + engineBadge(e.analysis) + "</div>" + analysisHtml(e, e.analysis, "inbox") + "</div>";
  }
  function engineBadge(a) {
    return a.engine === "ai" ? '<span class="badge b-green">' + esc(CFG.aiEndpointLabel || "Live AI") + "</span>" : '<span class="badge b-purple" title="Rule-based analysis running in your browser">Demonstration engine</span>' + (a.engineNote ? ' <span class="small muted">' + esc(a.engineNote) + "</span>" : "");
  }

  /* Shared analysis component (inbox detail + analyse page) */
  function editBtn(id, block, label) { return '<button class="icon-btn edit-btn" data-act="edit" data-id="' + id + '" data-block="' + block + '" aria-label="Edit ' + label + '" title="Edit">' + ic("pen") + "</button>"; }
  function editFoot(id) { return '<div class="btn-row mt-1"><button class="btn btn--primary btn--sm" data-act="save-edit" data-id="' + id + '">Save</button><button class="btn btn--sm" data-act="cancel-edit">Cancel</button></div>'; }
  var ENT_FIELDS = [["people", "People"], ["organisations", "Organisations"], ["amounts", "Amounts"], ["references", "References"], ["times", "Times"], ["locations", "Locations"], ["phones", "Phones"], ["emails", "Emails"]];
  function analysisHtml(e, a, ctx) {
    var ed = ctx === "inbox" && ui.editing && ui.editing.id === e.id ? ui.editing.block : null;
    var en = a.entities, rows = [];
    function kv(label, arr, map) { if (arr && arr.length) rows.push("<dt>" + label + "</dt><dd>" + arr.map(function (x) { return '<span class="ent">' + esc(map ? map(x) : x) + "</span>"; }).join("") + "</dd>"); }
    kv("People", en.people); kv("Organisations", en.organisations); kv("Amounts", en.amounts); kv("References", en.references);
    kv("Dates", en.dates, function (d) { return d.phrase + " → " + fmt(d.date); }); kv("Times", en.times); kv("Locations", en.locations);
    kv("Contact", (en.phones || []).concat(en.emails || [])); kv("Links", en.links);
    var extracted = rows.length ? '<dl class="kv">' + rows.join("") + "</dl>" : '<p class="muted mb-0">No specific details found.</p>';
    if (ed === "entities") extracted = '<div class="form">' + ENT_FIELDS.map(function (f) { return '<div class="field"><label for="ed-' + f[0] + '">' + f[1] + ' <span class="muted" style="font-weight:400">(comma-separated)</span></label><input id="ed-' + f[0] + '" value="' + esc((en[f[0]] || []).join(", ")) + '"></div>'; }).join("") + "</div>" + editFoot(e.id);
    var dls = a.deadlines.length ? a.deadlines.map(function (d, i) {
      return '<div class="deadline">' + ic(d.label === "Deadline" ? "clock" : "cal") + '<span><b style="color:var(--ink)">' + esc(d.label) + '</b><br><span class="rel">“' + esc(d.phrase) + "” · " + esc(rel(d.date)) + '</span></span><span class="when">' + fmt(d.date) + (d.time ? ", " + fmtTime(d.time) : "") + "</span></div>";
    }).join("") : '<p class="muted mb-0">No deadlines detected.</p>';
    if (ed === "deadlines") dls = '<div class="form">' + a.deadlines.map(function (d, i) { return '<div class="field"><label>' + esc(d.label) + " — “" + esc(d.phrase) + '”</label><div class="field-row"><input type="date" id="ed-dl-' + i + '-date" value="' + d.date + '" aria-label="Date"><input type="time" id="ed-dl-' + i + '-time" value="' + (d.time || "") + '" aria-label="Time"></div><label class="small" style="font-weight:500;display:flex;gap:.4rem;align-items:center;margin-top:.3rem"><input type="checkbox" id="ed-dl-' + i + '-del"> Remove</label></div>'; }).join("") +
      '<div class="field"><label for="ed-dl-new">Add a deadline</label><div class="field-row"><input id="ed-dl-new" placeholder="e.g. Send contract"><input type="date" id="ed-dl-new-date" aria-label="New deadline date"></div></div></div>' + editFoot(e.id);
    var inTasks = ctx === "inbox";
    var tasks = a.tasks.length ? '<ul class="list">' + a.tasks.map(function (t) {
      var listed = inTasks && S.tasks.some(function (x) { return x.emailId === e.id && x.text === t.text; });
      return '<li style="display:flex;gap:.5rem;align-items:flex-start;padding:.4rem 0;border-top:1px dashed var(--line)"><span style="flex:1;min-width:0">' + esc(t.text) + '<br><span class="small muted">Due ' + (t.due ? fmt(t.due) + " · " + rel(t.due) : "—") + "</span></span>" + (listed ? '<span class="badge b-green">In tasks</span>' : "") + "</li>";
    }).join("") + "</ul>" + (inTasks && a.tasks.some(function (t) { return !S.tasks.some(function (x) { return x.emailId === e.id && x.text === t.text; }); }) ? '<button class="btn btn--sm mt-1" data-act="add-tasks" data-id="' + e.id + '">' + ic("plus") + " Add to task list</button>" : "") : '<p class="muted mb-0">No action items.</p>';
    var ev = a.event, evHtml = "";
    if (ev) {
      var existing = inTasks && S.events.filter(function (x) { return x.emailId === e.id; })[0];
      var conflict = findConflict(ev, existing && existing.id);
      evHtml = '<div class="status-line" style="background:var(--blue-soft);color:var(--navy)">' + ic("cal") + "<span><b>" + esc(ev.title) + "</b><br>" + fmt(ev.date) + " at " + fmtTime(ev.time) + (ev.proposed ? " · proposed slot" : "") + (conflict ? ' · <span style="color:var(--urgent)">clashes with “' + esc(conflict.title) + "”</span>" : "") + "</span></div>" +
        (inTasks ? (existing && existing.status === "confirmed" ? '<p class="small muted mt-1 mb-0">✓ On your calendar</p>' : '<div class="btn-row mt-1"><button class="btn btn--sm btn--navy" data-act="accept-event-email" data-id="' + e.id + '">' + ic("cal") + " Add to calendar</button></div>") : "");
    }
    var conf = Math.round(a.confidence * 100);
    var tone = e.tone || S.settings.tone || "Formal";
    var draftText = e.draft != null ? e.draft : draftFor(e, a, tone);
    var actionBtn = { reply: ["Review the draft reply", "focus-draft", "pen"], calendar: ["Add to calendar", "accept-event-email", "cal"], task: ["Add to task list", "add-tasks", "check"], archive: ["Archive email", "archive", "archive"], file: ["Archive & file", "archive", "archive"], read: ["Mark as read", "mark-read", "mail"] }[a.actionType] || ["Review", "focus-draft", "pen"];
    var replied = e.status === "replied";
    var draftBlock = a.requiresResponse ? (replied ? '<div class="status-line" style="background:var(--green-soft);color:var(--green)">' + ic("check") + "<span>Reply approved and sent" + (e.sentAt ? " " + ago(e.sentAt) : "") + " (simulated). A follow-up reminder was created.</span></div>" :
      '<div class="draft-tools"><div class="seg" role="group" aria-label="Reply tone">' + ["Formal", "Friendly", "Concise"].map(function (t) { return '<button type="button" data-act="tone" data-tone="' + t + '" data-id="' + e.id + '" aria-pressed="' + (tone === t) + '">' + t + "</button>"; }).join("") + '</div><button class="btn btn--ghost btn--sm" data-act="regen" data-id="' + e.id + '">' + ic("refresh") + " Regenerate</button></div>" +
      '<label class="sr-only" for="draft-' + e.id + '">Suggested response</label><textarea class="draft" id="draft-' + e.id + '" data-draft="' + e.id + '">' + esc(draftText) + "</textarea>" +
      '<div class="btn-row mt-1">' + (inTasks ? '<button class="btn btn--primary" data-act="approve" data-id="' + e.id + '">' + ic("send") + " Approve &amp; send</button>" : '<button class="btn btn--primary" data-act="add-to-inbox">' + ic("inbox") + " Add to Smart Inbox</button>") + '<button class="btn" data-act="copy-draft" data-id="' + e.id + '">' + ic("copy") + ' Copy</button><span class="hint">Nothing is sent without your approval. Sending is simulated in this demo.</span></div>') :
      '<p class="muted mb-0">No reply needed for this email.</p>';

    return '<div class="analysis">' +
      '<div class="ablock ablock--wide"><h4>' + ic("list") + "Email summary" + (a.edited ? ' <span class="badge b-outline" style="margin-left:.3rem">Edited by you</span>' : "") + (inTasks && !ed ? editBtn(e.id, "summary", "summary") : "") + "</h4>" + (ed === "summary" ? '<label class="sr-only" for="ed-summary">Summary</label><textarea class="draft" id="ed-summary" style="min-height:90px">' + esc(a.summary) + "</textarea>" + editFoot(e.id) : "<p>" + esc(a.summary) + "</p>") + '<p class="small muted mb-0">Sentiment: ' + esc(a.sentiment) + " · Response needed: " + (a.requiresResponse ? "Yes" : "No") + "</p></div>" +
      '<div class="ablock"><h4>' + ic("target") + "Intent detection</h4><p class=\"mb-0\" style=\"color:var(--ink);font-weight:600\">" + esc(a.intent) + '</p><div class="conf"><span>Confidence</span><span class="conf__track"><span class="conf__fill" style="width:' + conf + '%"></span></span><b>' + conf + "%</b></div>" + (a.secondaryIntents && a.secondaryIntents.length ? '<p class="small muted mt-1 mb-0">Also: ' + esc(a.secondaryIntents.join("; ")) + "</p>" : "") + "</div>" +
      '<div class="ablock"><h4>' + ic("flag") + 'Priority classification</h4><div class="btn-row">' + pBadge(a.priority) + catBadge(a.category) + '<span class="small muted">score ' + a.score + "</span></div>" +
      '<ul class="reasons">' + a.reasons.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" +
      (inTasks ? '<label class="small muted" style="display:flex;gap:.4rem;align-items:center;margin-top:.5rem">Override <select data-act="override" data-id="' + e.id + '" style="font:inherit;font-size:.8rem;padding:.15rem .3rem;border:1px solid var(--line);border-radius:6px">' + ["Urgent", "Important", "Normal", "Low"].map(function (p) { return "<option" + (p === a.priority ? " selected" : "") + ">" + p + "</option>"; }).join("") + "</select></label>" : "") + "</div>" +
      '<div class="ablock"><h4>' + ic("tag") + "Important information extracted" + (inTasks && !ed ? editBtn(e.id, "entities", "extracted information") : "") + "</h4>" + extracted + "</div>" +
      '<div class="ablock"><h4>' + ic("clock") + "Deadlines" + (inTasks && !ed ? editBtn(e.id, "deadlines", "deadlines") : "") + "</h4>" + dls + "</div>" +
      '<div class="ablock ablock--wide ablock--action"><h4>' + ic("bolt") + 'Recommended action</h4><p class="action">' + esc(a.action) + '</p><p class="small muted">Suggested response time: ' + esc(a.responseTime) + "</p>" +
      (inTasks && !replied ? '<button class="btn btn--navy btn--sm" data-act="' + actionBtn[1] + '" data-id="' + e.id + '">' + ic(actionBtn[2]) + " " + actionBtn[0] + "</button>" : "") + "</div>" +
      '<div class="ablock"><h4>' + ic("check") + "Tasks extracted</h4>" + tasks + "</div>" +
      '<div class="ablock"><h4>' + ic("cal") + "Calendar &amp; follow-up</h4>" + (evHtml || '<p class="muted">No meeting detected.</p>') + (a.followup ? '<p class="small mt-1 mb-0">Follow-up: <b>' + fmt(a.followup.date) + "</b> — " + esc(a.followup.note) + "</p>" : "") + "</div>" +
      '<div class="ablock ablock--wide" id="' + (inTasks ? "draft-block" : "draft-block-a") + '"><h4>' + ic("pen") + "Suggested response" + (a.drafts ? ' <span class="badge b-green" style="margin-left:.3rem">Written by AI</span>' : "") + "</h4>" + draftBlock + "</div>" +
      "</div>";
  }
  function findConflict(ev, ignoreId) {
    var t = toMin(ev.time);
    return S.events.filter(function (x) { return x.status === "confirmed" && x.id !== ignoreId && x.date === ev.date && Math.abs(toMin(x.time) - t) < 60; })[0];
  }
  function toMin(t) { var p = String(t || "09:00").split(":"); return +p[0] * 60 + +p[1]; }

  /* ---------------- Analyse page ---------------- */
  function vAnalyze() {
    var inp = ui.analyzeInput || { from: "", email: "", subject: "", body: "" };
    var steps = ["Receive", "Classify", "Extract", "Prioritise", "Draft reply"].map(function (s, i) { return '<span class="step" data-step="' + i + '">' + ic(["mail", "tag", "list", "flag", "pen"][i]) + s + "</span>"; }).join('<span class="step-sep" aria-hidden="true">→</span>');
    var res = ui.analyzeResult;
    return '<div class="analyze-layout">' +
      '<section class="card"><div class="card__head"><h2>' + ic("mail") + 'Your email</h2></div><div class="card__body"><form class="form" id="analyze-form" novalidate>' +
      '<div class="field-row"><div class="field"><label for="a-from">Sender name</label><input id="a-from" name="from" maxlength="60" placeholder="e.g. Jane Wairimu" value="' + esc(inp.from) + '"></div>' +
      '<div class="field"><label for="a-email">Sender email</label><input id="a-email" name="email" type="email" maxlength="80" placeholder="jane@example.com" value="' + esc(inp.email) + '"></div></div>' +
      '<div class="field"><label for="a-subject">Subject</label><input id="a-subject" name="subject" maxlength="140" placeholder="e.g. Proposal needed by Friday" value="' + esc(inp.subject) + '"></div>' +
      '<div class="field" id="f-body"><label for="a-body">Email body *</label><textarea id="a-body" name="body" maxlength="5000" placeholder="Write or paste a fictional email here…">' + esc(inp.body) + '</textarea><p class="err" role="alert">Please enter the email text (at least a sentence).</p></div>' +
      (liveAvailable() ? '<div class="field"><span class="label-like">Analysis engine</span><div class="engine-pick"><div class="seg" role="group" aria-label="Analysis engine"><button type="button" data-act="engine" data-engine="live" aria-pressed="' + ui.useLive + '">' + ic("bolt") + ' Live AI</button><button type="button" data-act="engine" data-engine="demo" aria-pressed="' + !ui.useLive + '">' + ic("cog") + ' Demo engine</button></div><span class="hint">' + (ui.useLive ? aiLeft() + " of " + AI_LIMIT + " live analyses left today in this browser" : "Instant, rule-based, runs in your browser") + "</span></div></div>" : "") +
      '<div class="btn-row"><button type="submit" class="btn btn--primary">' + ic("spark") + ' Run analysis</button><button type="button" class="btn btn--ghost" data-act="clear-analyze">Clear</button></div>' +
      '<p class="hint mb-0">' + ic("info").replace("<svg", '<svg style="display:inline;width:13px;height:13px;vertical-align:-2px"') + " Use fictional content only. " + (liveAvailable() && ui.useLive ? "With Live AI, the text is sent to Make.com and an AI model to be analysed, then returned here. It is not stored on this website." : "The demonstration engine runs in your browser — nothing is sent anywhere.") + "</p>" +
      "</form></div></section>" +
      '<section class="card" id="analyze-out"><div class="card__head"><h2>' + ic("spark") + 'Assistant analysis</h2><span id="analyze-engine">' + (res ? engineBadge(res.a) : '<span class="badge b-purple">' + esc(engineLabel()) + "</span>") + '</span></div><div class="card__body" style="padding-bottom:.4rem"><div class="pipeline" id="pipeline">' + steps + "</div></div>" +
      '<div id="analyze-result">' + (res ? analyzeResultHtml(res) : '<div class="card__body">' + empty("spark", "Write or paste an email, then click “Run analysis”. Add the result to your Smart Inbox to track its tasks, deadlines and reply.") + "</div>") + "</div></section></div>";
  }
  function currentAnalyzeInput() {
    var f = $("#analyze-form"); if (!f) return ui.analyzeInput;
    return { from: f.from.value, email: f.email.value, subject: f.subject.value, body: f.body.value };
  }
  function analyzeResultHtml(res) {
    var json = JSON.stringify({ category: res.a.category, intent: res.a.intent, confidence: res.a.confidence, priority: res.a.priority, requires_response: res.a.requiresResponse, summary: res.a.summary, entities: res.a.entities, deadlines: res.a.deadlines, tasks: res.a.tasks, calendar_event: res.a.event, recommended_action: res.a.action }, null, 2);
    return '<div class="fade-in">' + analysisHtml(res.e, res.a, "analyze") +
      '<div class="card__body"><details><summary class="small" style="cursor:pointer;font-weight:600;color:var(--purple-2)">' + ic("code").replace("<svg", '<svg style="display:inline;width:14px;height:14px;vertical-align:-2px"') + " View structured output (what Make.com receives)</summary><pre class=\"json mt-1\">" + esc(json) + "</pre></details></div></div>";
  }
  function runAnalyzePage(form) {
    var data = { from: form.from.value.trim() || "Demo Sender", email: form.email.value.trim() || "sender@example.com", subject: form.subject.value.trim() || "(no subject)", body: form.body.value.trim() };
    ui.analyzeInput = { from: form.from.value, email: form.email.value, subject: form.subject.value, body: form.body.value };
    var fb = $("#f-body");
    if (data.body.split(/\s+/).length < 3) { fb.classList.add("has-error"); form.body.focus(); return; }
    fb.classList.remove("has-error");
    var btn = form.querySelector("[type=submit]"); btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Analysing…';
    var em = { id: "draft-" + uid(), from: data.from, email: data.email, org: "", subject: data.subject, body: data.body, ts: Date.now(), read: true, status: "new" };
    var live = liveAvailable() && ui.useLive;
    $("#analyze-result").innerHTML = '<div class="card__body"><div class="empty"><span class="spinner spinner--dark" style="display:block;margin:0 auto .7rem;width:26px;height:26px"></span><p class="mb-0" id="wait-msg">' + (live ? "Sending to the live AI model through Make.com… this usually takes 5–20 seconds." : "Analysing…") + "</p></div></div>";
    var analysis = runAnalysis(em, live);
    Promise.all([animatePipeline(true), analysis]).then(function (r) { finishPipeline(); return r[1]; }).then(function (a) {
      em.analysis = a; ui.analyzeResult = { e: em, a: a };
      $("#analyze-result").innerHTML = analyzeResultHtml(ui.analyzeResult);
      $("#analyze-engine").innerHTML = engineBadge(a);
      btn.disabled = false; btn.innerHTML = ic("spark") + " Run analysis";
      log("process", "Analysed a test email: “" + trunc(em.subject, 50) + "” → " + a.priority); save(); renderNav();
      if (window.innerWidth < 1100) $("#analyze-out").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  function animatePipeline(holdLast) {
    var steps = $$("#pipeline .step"), i = 0;
    steps.forEach(function (s) { s.classList.remove("is-active", "is-done"); });
    return new Promise(function (resolve) {
      (function next() {
        if (i > 0) { steps[i - 1].classList.remove("is-active"); steps[i - 1].classList.add("is-done"); }
        if (holdLast && i === steps.length - 1) { steps[i].classList.add("is-active"); return resolve(); }
        if (i >= steps.length) return resolve();
        steps[i].classList.add("is-active"); i++; setTimeout(next, reduced() ? 40 : 380);
      })();
    });
  }
  function finishPipeline() { $$("#pipeline .step").forEach(function (s) { s.classList.remove("is-active"); s.classList.add("is-done"); }); }
  function reduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  /* ---------------- Tasks ---------------- */
  function vTasks() {
    var open = openTasks(), done = S.tasks.filter(function (t) { return t.done; }).sort(function (a, b) { return b.doneTs - a.doneTs; });
    var today = iso(new Date()), week = iso(E.addDays(new Date(), 7));
    var groups = [["Overdue", function (t) { return t.due && t.due < today; }], ["Due today", function (t) { return t.due === today; }], ["Next 7 days", function (t) { return t.due && t.due > today && t.due <= week; }], ["Later", function (t) { return t.due && t.due > week; }], ["No due date", function (t) { return !t.due; }]];
    var body;
    if (ui.taskTab === "open") {
      body = open.length ? groups.map(function (g) {
        var items = open.filter(g[1]).sort(function (a, b) { return (a.due || "z") < (b.due || "z") ? -1 : 1 || PRANK[a.priority] - PRANK[b.priority]; });
        if (!items.length) return "";
        return '<div class="group-h"><span>' + g[0] + "</span><span>" + items.length + '</span></div><ul class="list">' + items.map(taskRow).join("") + "</ul>";
      }).join("") : empty("check", "No open tasks — nice work.");
    } else body = done.length ? '<ul class="list">' + done.map(taskRow).join("") + "</ul>" : empty("check", "No completed tasks yet.");
    var viewSeg = '<div class="seg" role="group" aria-label="Task view"><button type="button" data-act="task-view" data-v="list" aria-pressed="' + (ui.taskView === "list") + '">' + ic("list") + ' List</button><button type="button" data-act="task-view" data-v="board" aria-pressed="' + (ui.taskView === "board") + '">' + ic("board") + " Board</button></div>";
    if (ui.taskView === "board") return '<div class="card" id="tasks-card"><div class="card__head"><h2>' + ic("check") + 'Tasks</h2><div class="btn-row"><span class="small muted">Drag cards between columns</span>' + viewSeg + "</div></div>" + addTaskForm() + boardHtml() + "</div>";
    return '<div class="card" id="tasks-card"><div class="card__head"><h2>' + ic("check") + 'Tasks</h2><div class="btn-row"><span class="small muted">' + open.length + " open · " + done.length + " completed</span>" + viewSeg + "</div></div>" +
      addTaskForm() +
      '<div class="tabs" role="tablist"><button role="tab" data-act="task-tab" data-tab="open" aria-selected="' + (ui.taskTab === "open") + '">Open (' + open.length + ')</button><button role="tab" data-act="task-tab" data-tab="done" aria-selected="' + (ui.taskTab === "done") + '">Completed (' + done.length + ")</button></div>" + body + "</div>";
  }
  function addTaskForm() {
    return '<form class="add-task" id="add-task" autocomplete="off"><label class="sr-only" for="t-text">New task</label><input id="t-text" placeholder="Add a task…" maxlength="120" required><label class="sr-only" for="t-due">Due date</label><input id="t-due" type="date" value="' + iso(E.addDays(new Date(), 1)) + '"><label class="sr-only" for="t-pri">Priority</label><select id="t-pri"><option>Urgent</option><option>Important</option><option selected>Normal</option><option>Low</option></select><button class="btn btn--primary" type="submit">' + ic("plus") + " Add</button></form>";
  }
  function boardHtml() {
    var cols = [["todo", "To do"], ["doing", "In progress"], ["done", "Done"]];
    return '<div class="board">' + cols.map(function (c) {
      var items = S.tasks.filter(function (t) { return taskStatus(t) === c[0]; }).sort(function (a, b) { return c[0] === "done" ? (b.doneTs || 0) - (a.doneTs || 0) : ((a.due || "z") < (b.due || "z") ? -1 : 1); });
      if (c[0] === "done") items = items.slice(0, 12);
      return '<section class="kcol" data-drop-status="' + c[0] + '" aria-label="' + c[1] + '"><div class="kcol__h"><b>' + c[1] + '</b><span class="count">' + S.tasks.filter(function (t) { return taskStatus(t) === c[0]; }).length + "</span></div>" +
        (items.length ? items.map(function (t) {
          var src = t.emailId && email(t.emailId);
          return '<article class="kcard' + (c[0] === "done" ? " done" : "") + '" draggable="true" data-drag-task="' + t.id + '"><div class="kcard__top"><span class="grip" aria-hidden="true">' + ic("grip") + '</span><span class="kcard__text">' + esc(t.text) + "</span></div>" +
            '<div class="task__meta"><span class="pdot ' + String(t.priority || "normal").toLowerCase() + '"></span>' + (c[0] === "done" ? "<span>Done " + ago(t.doneTs) + "</span>" : dueLabel(t.due)) + (src ? "<span>" + esc(src.from) + "</span>" : "") + "</div>" +
            '<label class="sr-only" for="ts-' + t.id + '">Status</label><select class="kstatus" id="ts-' + t.id + '" data-task-status="' + t.id + '">' + cols.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === c[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select></article>";
        }).join("") : '<p class="kempty">Drop tasks here</p>') + "</section>";
    }).join("") + "</div>";
  }
  function taskRow(t) {
    var src = t.emailId && email(t.emailId);
    return '<li class="task' + (t.done ? " done" : "") + '" id="task-' + t.id + '"><input type="checkbox" data-act="toggle-task" data-id="' + t.id + '"' + (t.done ? " checked" : "") + ' aria-label="Mark “' + esc(t.text) + '” as ' + (t.done ? "not done" : "done") + '">' +
      '<div class="row__main"><div class="row__title" style="white-space:normal">' + esc(t.text) + '</div><div class="task__meta"><span class="pdot ' + String(t.priority || "normal").toLowerCase() + '"></span>' + esc(t.priority || "Normal") +
      (t.done ? '<span>Completed ' + ago(t.doneTs) + "</span>" : "<span>" + dueLabel(t.due) + "</span>") +
      (src ? '<a href="#inbox" data-act="open" data-id="' + src.id + '">From ' + esc(src.from) + "</a>" : '<span>Added manually</span>') + "</div></div>" +
      '<button class="icon-btn" data-act="delete-task" data-id="' + t.id + '" aria-label="Delete task">' + ic("trash") + "</button></li>";
  }

  /* ---------------- Follow-ups ---------------- */
  function vFollowups() {
    var waiting = pendingFollowups().sort(function (a, b) { return a.due < b.due ? -1 : 1; });
    var resolved = S.followups.filter(function (f) { return f.status === "done"; });
    var reply = S.emails.filter(needsReply).sort(function (a, b) { return PRANK[a.analysis.priority] - PRANK[b.analysis.priority] || a.ts - b.ts; });
    var wHtml = waiting.length ? '<ul class="list">' + waiting.map(function (f) {
      var d = E.daysFrom(f.due);
      return '<li class="task"><span class="av" style="width:32px;height:32px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:.7rem;font-weight:700;flex:none;background:' + avColor(f.contact) + '">' + esc(initials(f.contact)) + '</span><div class="row__main"><div class="row__title">' + esc(f.contact) + (f.org ? ' <span class="muted" style="font-weight:500">· ' + esc(f.org) + "</span>" : "") + '</div><div class="row__sub" style="white-space:normal">Waiting on: ' + esc(f.topic) + '</div><div class="task__meta"><span>Sent ' + ago(f.sentTs) + "</span><span>Follow up " + (d < 0 ? '<span class="due overdue">overdue (' + fmt(f.due) + ")</span>" : d === 0 ? '<span class="due today">today</span>' : fmt(f.due)) + "</span>" + (f.nudges ? "<span>" + f.nudges + " reminder" + (f.nudges > 1 ? "s" : "") + " sent</span>" : "") + "</div>" +
        '<div class="btn-row mt-1"><button class="btn btn--sm btn--primary" data-act="fu-draft" data-id="' + f.id + '">' + ic("pen") + ' Draft follow-up</button><button class="btn btn--sm" data-act="fu-snooze" data-id="' + f.id + '">Snooze 2 days</button><button class="btn btn--sm" data-act="fu-done" data-id="' + f.id + '">' + ic("check") + " They replied</button></div></div></li>";
    }).join("") + "</ul>" : empty("repeat", "You're not waiting on anyone.");
    var rHtml = reply.length ? '<ul class="list">' + reply.map(function (e) {
      return '<li><button class="row row--btn" data-act="open" data-id="' + e.id + '"><span class="pdot ' + e.analysis.priority.toLowerCase() + '"></span><span class="row__main"><span class="row__title">' + esc(e.from) + " — " + esc(e.subject) + '</span><span class="row__sub">' + esc(e.analysis.action) + " · respond " + esc(e.analysis.responseTime.toLowerCase()) + '</span></span><span class="row__meta">' + ago(e.ts) + "</span></button></li>";
    }).join("") + "</ul>" : empty("check", "No emails are waiting for your reply.");
    return '<div class="ov-grid"><section class="card"><div class="card__head"><h2>' + ic("repeat") + 'Waiting on others</h2><span class="small muted">' + waiting.length + " open · " + resolved.length + ' resolved</span></div>' + wHtml + "</section>" +
      '<section class="card"><div class="card__head"><h2>' + ic("mail") + 'Awaiting your reply</h2><span class="small muted">' + reply.length + "</span></div>" + rHtml + "</section></div>";
  }

  /* ---------------- Calendar ---------------- */
  function vCalendar() {
    var start = E.addDays(new Date(), ui.weekOffset * 7), today = iso(new Date()), days = [];
    for (var i = 0; i < 7; i++) days.push(E.addDays(start, i));
    var evs = S.events.slice().sort(evSort);
    var cols = days.map(function (d) {
      var k = iso(d), list = evs.filter(function (e) { return e.date === k; });
      return '<div class="day' + (k === today ? " today" : "") + (d.getDay() % 6 === 0 ? " weekend" : "") + '" data-drop-date="' + k + '"><div class="day__h"><span>' + ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] + "</span><b>" + d.getDate() + "</b></div><div>" +
        (list.length ? list.map(evHtml).join("") : '<span class="small" style="color:var(--faint)">Free</span>') + "</div></div>";
    }).join("");
    var lastDay = iso(days[6]);
    var later = evs.filter(function (e) { return e.date > lastDay; }).slice(0, 6);
    var sugg = evs.filter(function (e) { return e.status === "suggested"; });
    return '<div class="card"><div class="card__head"><h2>' + ic("cal") + fmt(iso(days[0])) + " – " + fmt(lastDay) + '</h2><div class="btn-row"><button class="icon-btn" data-act="week" data-d="-1" aria-label="Previous week">' + ic("chevL") + '</button><button class="btn btn--sm" data-act="week" data-d="0">Today</button><button class="icon-btn" data-act="week" data-d="1" aria-label="Next week">' + ic("chev") + '</button><button class="btn btn--sm btn--primary" data-act="new-event">' + ic("plus") + " New event</button></div></div>" +
      '<div class="card__body small muted" style="padding-bottom:.6rem">Dashed items are suggestions from your inbox, waiting for approval. Drag events between days, or click one to edit. ' + sugg.length + " suggestion" + (sugg.length === 1 ? "" : "s") + " pending.</div>" +
      '<div class="week">' + cols + "</div></div>" +
      (later.length ? '<section class="card" style="margin-top:1rem"><div class="card__head"><h2>' + ic("clock") + 'Later</h2></div><ul class="list">' + later.map(function (e) { return '<li class="row"><span class="row__meta" style="width:110px">' + fmt(e.date) + ", " + fmtTime(e.time) + '</span><span class="row__main"><span class="row__title">' + esc(e.title) + '</span><span class="row__sub">' + (e.status === "suggested" ? "Suggested — awaiting approval" : "Confirmed") + "</span></span>" + (e.status === "suggested" ? '<button class="btn btn--xs btn--navy" data-act="ev-accept" data-id="' + e.id + '">Accept</button>' : "") + "</li>"; }).join("") + "</ul></section>" : "");
  }
  function evHtml(e) {
    var cls = e.status === "suggested" ? "suggested" : e.kind === "external" || e.kind === "meeting" ? "purple" : e.kind === "event" ? "amber" : "";
    var conflict = e.status === "suggested" && findConflict(e, e.id);
    return '<div class="ev ' + cls + (conflict ? " conflict" : "") + '" draggable="true" data-drag-ev="' + e.id + '"><b>' + fmtTime(e.time) + (e.status === "suggested" ? " · suggested" : "") + '</b><button class="ev-title" data-act="ev-edit" data-id="' + e.id + '" title="Edit event">' + esc(e.title) + "</button>" +
      (conflict ? '<div style="color:var(--urgent);font-size:.7rem;margin-top:.2rem">Clashes with ' + esc(conflict.title) + "</div>" : "") +
      (e.status === "suggested" ? '<div class="ev-actions"><button class="btn btn--xs btn--navy" data-act="ev-accept" data-id="' + e.id + '">Accept</button><button class="btn btn--xs" data-act="ev-dismiss" data-id="' + e.id + '">Dismiss</button></div>' :
        '<div class="ev-actions"><button class="btn btn--xs btn--ghost" data-act="ev-delete" data-id="' + e.id + '" aria-label="Remove ' + esc(e.title) + '">Remove</button></div>') + "</div>";
  }

  /* ---------------- Briefing ---------------- */
  function briefingData() {
    var today = iso(new Date()), tmr = iso(E.addDays(new Date(), 1));
    return {
      top: active().filter(function (e) { return e.analysis && e.status !== "replied" && isImportant(e); }).sort(function (a, b) { return PRANK[a.analysis.priority] - PRANK[b.analysis.priority]; }).slice(0, 5),
      overdue: openTasks().filter(function (t) { return t.due && t.due < today; }),
      dueToday: openTasks().filter(function (t) { return t.due === today; }),
      dueTmr: openTasks().filter(function (t) { return t.due === tmr; }),
      meetings: S.events.filter(function (e) { return e.status === "confirmed" && (e.date === today || e.date === tmr); }).sort(evSort),
      suggestions: S.events.filter(function (e) { return e.status === "suggested"; }).sort(evSort),
      followups: pendingFollowups().filter(function (f) { return f.due <= today; }),
      replies: S.emails.filter(needsReply).length,
      unread: active().filter(function (e) { return !e.read; }).length,
      info: active().filter(function (e) { return e.analysis && e.analysis.category === "General information"; }).length
    };
  }
  function vBriefing() {
    var b = briefingData(), name = String(S.settings.yourName || "").split(" ")[0], hr = new Date().getHours();
    function sec(title, icon, items, fn, none) { return '<section class="card"><div class="card__head"><h2>' + ic(icon) + title + '</h2><span class="small muted">' + items.length + '</span></div><div class="card__body">' + (items.length ? "<ul>" + items.map(fn).join("") + "</ul>" : '<p class="muted mb-0">' + none + "</p>") + "</div></section>"; }
    return '<div class="brief fade-in"><div class="brief__hero"><p class="small mb-0" style="opacity:.8">' + esc(longDate()) + " · generated " + new Date().toTimeString().slice(0, 5) + '</p><h2>' + (hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening") + ", " + esc(name) + '.</h2><p class="mb-0">' + esc(briefSentence(b)) + '</p><div class="brief__stats"><span><b>' + b.top.length + "</b>priority emails</span><span><b>" + (b.dueToday.length + b.overdue.length) + "</b>tasks due / overdue</span><span><b>" + b.meetings.length + "</b>meetings today &amp; tomorrow</span><span><b>" + b.replies + '</b>replies needed</span></div></div>' +
      '<div class="btn-row" style="margin-bottom:1rem"><button class="btn" data-act="copy-brief">' + ic("copy") + ' Copy as text</button><button class="btn" data-act="regen-brief">' + ic("refresh") + ' Refresh</button><a class="btn btn--ghost" href="#inbox">Go to inbox ' + ic("arrow") + "</a></div>" +
      '<div class="grid">' +
      sec("Top priorities", "flag", b.top, function (e) { return '<li><a href="#inbox" data-act="open" data-id="' + e.id + '"><b>' + esc(e.from) + "</b></a> — " + esc(e.subject) + ' <span class="badge ' + pClass(e.analysis.priority) + '">' + e.analysis.priority + '</span><br><span class="small muted">' + esc(e.analysis.action) + "</span></li>"; }, "Nothing urgent. Enjoy the calm.") +
      sec("Overdue", "alert", b.overdue, function (t) { return "<li>" + esc(t.text) + ' <span class="due overdue small">(' + fmt(t.due) + ")</span></li>"; }, "Nothing overdue.") +
      sec("Due today &amp; tomorrow", "clock", b.dueToday.concat(b.dueTmr), function (t) { return "<li>" + esc(t.text) + ' <span class="small muted">· ' + (t.due === iso(new Date()) ? "today" : "tomorrow") + "</span></li>"; }, "No tasks due.") +
      sec("Meetings", "cal", b.meetings, function (e) { return "<li><b>" + (e.date === iso(new Date()) ? "Today" : "Tomorrow") + " " + fmtTime(e.time) + "</b> — " + esc(e.title) + "</li>"; }, "No meetings today or tomorrow.") +
      sec("Meeting suggestions to approve", "spark", b.suggestions, function (e) { return "<li>" + esc(e.title) + ' <span class="small muted">· ' + fmt(e.date) + ", " + fmtTime(e.time) + '</span> <button class="btn btn--xs btn--navy" data-act="ev-accept" data-id="' + e.id + '">Accept</button></li>'; }, "No pending suggestions.") +
      sec("Follow-ups due", "repeat", b.followups, function (f) { return "<li><b>" + esc(f.contact) + "</b> — " + esc(f.topic) + "</li>"; }, "No follow-ups due today.") +
      "</div></div>";
  }
  function briefSentence(b) {
    var parts = [];
    if (b.top.length) parts.push(b.top.length + " email" + (b.top.length > 1 ? "s need" : " needs") + " your attention, led by " + b.top[0].from + "'s “" + trunc(b.top[0].subject, 48) + "”");
    if (b.overdue.length) parts.push(b.overdue.length + " task" + (b.overdue.length > 1 ? "s are" : " is") + " overdue");
    if (b.meetings.length) parts.push("you have " + b.meetings.length + " meeting" + (b.meetings.length > 1 ? "s" : "") + " in the next two days");
    if (b.info) parts.push(b.info + " informational email" + (b.info > 1 ? "s were" : " was") + " set aside");
    return parts.length ? cap(parts.join("; ")) + "." : "Your inbox is clear and nothing is due.";
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function briefText() {
    var b = briefingData(), L = ["DAILY BRIEFING — " + longDate(), "", briefSentence(b), ""];
    function block(t, items, fn) { L.push(t.toUpperCase()); if (!items.length) L.push("- None"); items.forEach(function (x) { L.push("- " + fn(x)); }); L.push(""); }
    block("Top priorities", b.top, function (e) { return e.from + ": " + e.subject + " [" + e.analysis.priority + "] → " + e.analysis.action; });
    block("Overdue", b.overdue, function (t) { return t.text + " (" + fmt(t.due) + ")"; });
    block("Due today & tomorrow", b.dueToday.concat(b.dueTmr), function (t) { return t.text + " (" + fmt(t.due) + ")"; });
    block("Meetings", b.meetings, function (e) { return fmt(e.date) + " " + fmtTime(e.time) + " — " + e.title; });
    block("Follow-ups due", b.followups, function (f) { return f.contact + " — " + f.topic; });
    L.push("Generated by the AI Executive Assistant demo (fictional data).");
    return L.join("\n");
  }

  /* ---------------- Settings ---------------- */
  function vSettings() {
    var s = S.settings;
    return '<div class="settings grid"><section class="card"><div class="card__head"><h2>' + ic("user") + 'Profile &amp; writing</h2></div><div class="card__body"><form class="form" id="settings-form">' +
      '<div class="field-row"><div class="field"><label for="s-name">Your name (used in signatures)</label><input id="s-name" name="yourName" maxlength="60" value="' + esc(s.yourName) + '"></div><div class="field"><label for="s-biz">Business name</label><input id="s-biz" name="businessName" maxlength="80" value="' + esc(s.businessName) + '"></div></div>' +
      '<div class="field"><label for="s-tone">Default reply tone</label><select id="s-tone" name="tone">' + ["Formal", "Friendly", "Concise"].map(function (t) { return "<option" + (t === s.tone ? " selected" : "") + ">" + t + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="s-vip">VIP senders (names, companies or domains, comma-separated)</label><input id="s-vip" name="vipSenders" value="' + esc(s.vipSenders) + '"><p class="hint mb-0">Emails from these senders get a priority boost.</p></div>' +
      '<div class="field"><label for="s-urg">Urgent keywords (comma-separated)</label><input id="s-urg" name="urgentKeywords" value="' + esc(s.urgentKeywords) + '"></div>' +
      '<label class="switch"><input type="checkbox" name="autoProcess"' + (s.autoProcess ? " checked" : "") + '><span class="track"></span>Analyse new emails automatically</label>' +
      '<div class="btn-row"><button class="btn btn--primary" type="submit">Save &amp; re-analyse inbox</button></div></form></div></section>' +
      '<section class="card"><div class="card__head"><h2>' + ic("spark") + 'Analysis engine</h2>' + (CFG.aiEndpoint ? '<span class="badge b-green">Live AI endpoint</span>' : '<span class="badge b-purple">Demonstration engine</span>') + '</div><div class="card__body"><p>' +
      (CFG.aiEndpoint ? "Emails are analysed by your connected endpoint (" + esc(CFG.aiEndpointLabel || "") + "). If it is unreachable, the demonstration engine is used and clearly labelled." :
        "This demo uses a <b>rule-based demonstration engine</b> that runs in your browser. It detects intent, priority, dates, amounts and action items with transparent rules, so it works on any website without exposing an AI key. It is not a large language model and will be less accurate on unusual emails.") +
      '</p><p class="mb-0">In a client deployment, the same steps run in <b>Make.com</b>: Gmail triggers the scenario, an AI model returns this same structured output, and results go to Google Sheets and Google Calendar — with replies always waiting for human approval.</p></div></section>' +
      '<section class="card"><div class="card__head"><h2>' + ic("refresh") + 'Your data</h2></div><div class="card__body"><p>Everything you add is saved in this browser only and is never uploaded to this website.</p><div class="btn-row"><button class="btn" data-act="show-note"' + ($("#demo-note") && !$("#demo-note").hidden ? " disabled" : "") + ">" + ic("info") + " Show the demo notice" + '</button><button class="btn" data-act="tour">' + ic("help") + ' Replay the tour</button><button class="btn btn--danger" data-act="reset">' + ic("trash") + " Clear all data</button></div></div></section></div>";
  }

  /* ---------------- After render: bind non-delegated bits ---------------- */
  function afterRender() {
    bindDnD();
    $$("select[data-task-status]").forEach(function (sel) { sel.addEventListener("change", function () { setTaskStatus(sel.getAttribute("data-task-status"), sel.value); }); });
    var af = $("#analyze-form"); if (af) af.addEventListener("submit", function (e) { e.preventDefault(); runAnalyzePage(af); });
    var tf = $("#add-task"); if (tf) tf.addEventListener("submit", function (e) {
      e.preventDefault(); var t = $("#t-text").value.trim(); if (!t) { $("#t-text").focus(); return; }
      S.tasks.push({ id: uid(), text: t, due: $("#t-due").value || null, priority: $("#t-pri").value, done: false, createdTs: Date.now() });
      log("task", "Task added: " + trunc(t, 60)); save(); render(); toast("Task added"); var n = $("#t-text"); if (n) n.focus();
    });
    var sf = $("#settings-form"); if (sf) sf.addEventListener("submit", function (e) {
      e.preventDefault();
      ["yourName", "businessName", "tone", "vipSenders", "urgentKeywords"].forEach(function (k) { S.settings[k] = sf[k].value.trim(); });
      S.settings.autoProcess = sf.autoProcess.checked;
      S.emails.forEach(function (em) { if (em.analysis) { em.analysis = E.analyze(em, S.settings); if (em.draft == null) em.tone = null; } });
      log("settings", "Settings updated — inbox re-analysed"); save(); render(); toast("Saved. " + processed().length + " emails re-analysed with your settings.");
    });
    var q = $("#inbox-q"); if (q) q.addEventListener("input", function () { ui.query = q.value; var pos = q.selectionStart; render(); var nq = $("#inbox-q"); if (nq) { nq.focus(); try { nq.setSelectionRange(pos, pos); } catch (er) { /* */ } } });
    $$("textarea[data-draft]").forEach(function (ta) { ta.addEventListener("input", function () { var em = email(ta.getAttribute("data-draft")); if (em) { em.draft = ta.value; save(); } }); });
    $$("select[data-act=override]").forEach(function (sel) { sel.addEventListener("change", function () {
      var em = email(sel.getAttribute("data-id")); em.analysis.priority = sel.value; em.analysis.reasons = ["Manually set by you"].concat(em.analysis.reasons.filter(function (r) { return r !== "Manually set by you"; }));
      S.tasks.forEach(function (t) { if (t.emailId === em.id) t.priority = sel.value; });
      log("process", "Priority changed to " + sel.value + ": “" + trunc(em.subject, 50) + "”"); save(); render(); toast("Priority set to " + sel.value);
    }); });
  }

  /* ---------------- Actions ---------------- */
  function onClick(ev) {
    var el = ev.target.closest("[data-act]"); if (!el) return;
    var act = el.getAttribute("data-act"), id = el.getAttribute("data-id");
    if (el.tagName === "SELECT" || (el.tagName === "INPUT" && el.type !== "checkbox")) return;
    var em = id && email(id);
    switch (act) {
      case "nav": var to = el.getAttribute("data-to").split(":"); if (to[0] === "inbox") ui.filter = to[1] || "all"; if (to[0] === "tasks") ui.taskTab = to[1] === "done" ? "done" : "open"; go(to[0]); break;
      case "open": ev.preventDefault(); openEmail(id); break;
      case "close-detail": ui.selected = null; render(); break;
      case "filter": ui.filter = el.getAttribute("data-f"); ui.selected = null; render(); break;
      case "process": case "reanalyse": processEmail(em, act === "reanalyse"); break;
      case "archive": em.status = "archived"; log("process", "Archived: “" + trunc(em.subject, 50) + "”"); ui.selected = null; save(); render(); toast("Email archived", "Undo", function () { em.status = "new"; save(); render(); }); break;
      case "mark-read": em.read = true; save(); render(); toast("Marked as read"); break;
      case "toggle-read": em.read = !em.read; save(); render(); break;
      case "add-tasks": var n = addTasksFrom(em); save(); render(); toast(n ? n + " task" + (n > 1 ? "s" : "") + " added to your list" : "Tasks are already on your list"); break;
      case "accept-event-email": acceptEmailEvent(em); break;
      case "focus-draft": var ta = $("#draft-" + id); if (ta) { ta.scrollIntoView({ behavior: "smooth", block: "center" }); ta.focus(); } break;
      case "tone":
        var target = em || (ui.analyzeResult && ui.analyzeResult.e.id === id ? ui.analyzeResult.e : null);
        if (!target) break; target.tone = el.getAttribute("data-tone"); target.draft = draftFor(target, target.analysis, target.tone);
        if (em) save(); refreshDraft(target); break;
      case "regen":
        var tg = em || (ui.analyzeResult && ui.analyzeResult.e);
        tg.draft = draftFor(tg, tg.analysis, tg.tone || S.settings.tone); if (em) save(); refreshDraft(tg); toast("Draft regenerated"); break;
      case "copy-draft": copy(($("#draft-" + id) || {}).value || "", "Draft copied"); break;
      case "approve": approve(em); break;
      case "override": break;
      case "engine": ui.useLive = el.getAttribute("data-engine") === "live"; ui.analyzeInput = currentAnalyzeInput(); render(); break;
      case "clear-analyze": ui.analyzeInput = null; ui.analyzeResult = null; render(); break;
      case "add-to-inbox": addAnalyzedToInbox(); break;
      case "task-tab": ui.taskTab = el.getAttribute("data-tab"); render(); break;
      case "toggle-task": toggleTask(id, el.checked); break;
      case "delete-task":
        var gt = S.tasks.filter(function (t) { return t.id === id; })[0]; if (!gt) break;
        animateOut(el.closest(".task"), function () { S.tasks = S.tasks.filter(function (t) { return t.id !== id; }); save(); render(); toast("Task deleted", "Undo", function () { S.tasks.push(gt); save(); render(); }); });
        break;
      case "show-note": showNote(); toast("Demo notice is visible again"); break;
      case "fu-draft": followupModal(id); break;
      case "fu-snooze": var f = fu(id); f.due = iso(E.addDays(new Date(), 2)); log("followup", "Follow-up with " + f.contact + " snoozed to " + fmt(f.due)); save(); render(); toast("Snoozed until " + fmt(f.due)); break;
      case "fu-done": var f2 = fu(id); f2.status = "done"; log("followup", f2.contact + " replied — follow-up resolved"); save(); render(); toast("Follow-up resolved"); break;
      case "week": var d = +el.getAttribute("data-d"); ui.weekOffset = d === 0 ? 0 : ui.weekOffset + d; render(); break;
      case "new-event": eventModal(); break;
      case "ev-accept": var e1 = evById(id); var c = findConflict(e1, e1.id); e1.status = "confirmed"; log("calendar", "Meeting added: " + e1.title); save(); render(); toast("Added to calendar" + (c ? " — note: clashes with “" + c.title + "”" : "")); break;
      case "ev-dismiss": case "ev-delete":
        var gone = evById(id); if (!gone) break; el.disabled = true;
        animateOut(el.closest(".ev, li"), function () {
          S.events = S.events.filter(function (x) { return x.id !== id; }); save(); render();
          toast(act === "ev-dismiss" ? "Suggestion dismissed" : "Event removed", "Undo", function () { S.events.push(gone); save(); render(); });
        });
        break;
      case "copy-brief": copy(briefText(), "Briefing copied"); break;
      case "regen-brief": log("process", "Daily briefing regenerated"); save(); render(); toast("Briefing refreshed"); break;
      case "reset": confirmModal("Clear all data?", "This removes every email, task, event and follow-up saved in this browser and starts again with an empty workspace.", "Clear everything", function () { try { localStorage.removeItem(KEY); } catch (e) { /* */ } seed(); ui.selected = null; ui.analyzeResult = null; render(); toast("Workspace cleared"); }); break;
      case "close-modal": closeModal(); break;
      case "bell": ev.stopPropagation(); toggleBell(); break;
      case "notif-readall": S.notifications.forEach(function (n) { n.read = true; }); save(); renderBell(); break;
      case "notif-open":
        var nt = S.notifications.filter(function (n) { return n.id === id; })[0]; if (!nt) break;
        nt.read = true; save(); toggleBell(false); renderBell();
        if (nt.emailId && email(nt.emailId)) openEmail(nt.emailId); else go(nt.view || "overview");
        break;
      case "tour": startTour(); break;
      case "tour-next": tour.dir = 1; tour.i++; if (tour.i >= TOUR.length) endTour(true); else showStep(); break;
      case "tour-prev": tour.dir = -1; tour.i = Math.max(0, tour.i - 1); showStep(); break;
      case "tour-skip": endTour(false); break;
      case "task-view": ui.taskView = el.getAttribute("data-v"); render(); break;
      case "edit": ui.editing = { id: id, block: el.getAttribute("data-block") }; render(); var f0 = $(".analysis textarea#ed-summary, .analysis input"); if (f0) f0.focus(); break;
      case "cancel-edit": ui.editing = null; render(); break;
      case "save-edit": saveEdit(em); break;
      case "ev-edit": eventModal(evById(id)); break;
      case "menu": openMenu(); break;
    }
  }
  function saveEdit(em) {
    var a = em.analysis, blk = ui.editing && ui.editing.block; if (!a || !blk) return;
    function list(v) { return String(v || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 8); }
    if (blk === "summary") { var v = $("#ed-summary").value.trim(); if (v) { a.summary = v; a.shortSummary = trunc(v, 118); } }
    if (blk === "entities") ENT_FIELDS.forEach(function (f) { var inp = $("#ed-" + f[0]); if (inp) a.entities[f[0]] = list(inp.value); });
    if (blk === "deadlines") {
      var keep = [];
      a.deadlines.forEach(function (d, i) { if ($("#ed-dl-" + i + "-del").checked) return; d.date = $("#ed-dl-" + i + "-date").value || d.date; d.time = $("#ed-dl-" + i + "-time").value || null; keep.push(d); });
      var nt = $("#ed-dl-new").value.trim(), nd = $("#ed-dl-new-date").value;
      if (nt && nd) { keep.push({ label: "Deadline", date: nd, time: null, phrase: nt, context: nt }); S.tasks.push({ id: uid(), text: nt, due: nd, done: false, priority: a.priority, emailId: em.id, createdTs: Date.now() }); }
      a.deadlines = keep.sort(function (x, y) { return x.date < y.date ? -1 : 1; });
    }
    a.edited = true; ui.editing = null;
    log("process", "Analysis corrected by you: “" + trunc(em.subject, 50) + "”"); save(); render(); toast("Saved — your corrections are kept");
  }
  function flashInbox() { var n = $('#nav a[href="#inbox"]'); if (n) { n.classList.remove("ping"); void n.offsetWidth; n.classList.add("ping"); } }
  function dismissNote() {
    var n = $("#demo-note"); if (!n || n.hidden) return;
    var btn = $("#note-close"); btn.disabled = true;
    n.style.height = n.offsetHeight + "px"; void n.offsetHeight;
    n.classList.add("is-leaving");
    setTimeout(function () { n.hidden = true; n.classList.remove("is-leaving"); n.style.height = ""; btn.disabled = false; }, reduced() ? 0 : 300);
    try { localStorage.setItem("eaNoteHidden", "1"); } catch (e) { /* */ }
    var v = $("#view"); if (v) v.focus({ preventScroll: true });
    toast("Demo notice hidden. You can bring it back in Settings.", "Undo", showNote);
    if (ui.view === "settings") setTimeout(render, 320);
  }
  function showNote() {
    var n = $("#demo-note"); if (!n) return;
    n.hidden = false; n.classList.add("is-entering"); setTimeout(function () { n.classList.remove("is-entering"); }, 400);
    try { localStorage.removeItem("eaNoteHidden"); } catch (e) { /* */ }
    var b = $("#note-close"); if (b) b.focus({ preventScroll: true });
    if (ui.view === "settings") render();
  }
  function animateOut(el, done) {
    if (!el || reduced()) return done();
    el.classList.add("is-leaving"); setTimeout(done, 220);
  }
  function fu(id) { return S.followups.filter(function (f) { return f.id === id; })[0]; }
  function evById(id) { return S.events.filter(function (e) { return e.id === id; })[0]; }
  function openEmail(id) {
    var em = email(id); if (!em) return;
    ui.selected = id; em.read = true;
    if (em.status === "archived") em.status = "new";
    var f = FILTERS.filter(function (x) { return x.id === ui.filter; })[0];
    if (f && !f.test(em)) ui.filter = "all";
    save();
    if (ui.view !== "inbox") { location.hash = "inbox"; } else { render(); }
    if (window.innerWidth < 1150) window.scrollTo(0, 0);
  }
  function refreshDraft(target) {
    var ta = $("#draft-" + target.id); if (ta) typeInto(ta, target.draft);
    $$('[data-act=tone][data-id="' + target.id + '"]').forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-tone") === target.tone); });
  }
  function approve(em) {
    finishTyping();
    var ta = $("#draft-" + em.id), text = ta ? ta.value.trim() : "";
    if (!text) { toast("The reply is empty — write or regenerate a draft first."); return; }
    em.status = "replied"; em.sentAt = Date.now(); em.draft = text;
    S.followups.push({ id: uid(), contact: em.from, org: em.org, topic: "Your reply to “" + trunc(em.subject, 60) + "”", sentTs: Date.now(), due: iso(E.bizDays(new Date(), 3)), status: "waiting", emailId: em.id });
    S.tasks.forEach(function (t) { if (t.emailId === em.id && /^(reply to|respond to|offer|confirm new meeting)/i.test(t.text)) { t.done = true; t.doneTs = Date.now(); } });
    log("sent", "Reply approved and sent to " + em.from + " (simulated)");
    save(); render(); toast("Reply sent to " + em.from + " (simulated). Follow-up set for " + fmt(iso(E.bizDays(new Date(), 3))) + ".");
  }
  function acceptEmailEvent(em) {
    var ev = em.analysis.event; if (!ev) { toast("No meeting detected in this email."); return; }
    var existing = S.events.filter(function (x) { return x.emailId === em.id; })[0];
    var conflict = findConflict(ev, existing && existing.id);
    if (existing) { existing.status = "confirmed"; existing.date = ev.date; existing.time = ev.time; existing.title = ev.title; }
    else S.events.push(Object.assign({ id: uid(), status: "confirmed", emailId: em.id }, ev));
    S.tasks.forEach(function (t) { if (t.emailId === em.id && /meeting|calendar/i.test(t.text)) { t.done = true; t.doneTs = Date.now(); } });
    log("calendar", "Meeting added: " + ev.title); save(); render();
    toast("Added: " + fmt(ev.date) + " at " + fmtTime(ev.time) + (conflict ? " — clashes with “" + conflict.title + "”" : ""));
  }
  function toggleTask(id, done) {
    var t = S.tasks.filter(function (x) { return x.id === id; })[0]; if (!t) return;
    t.done = done; t.doneTs = done ? Date.now() : null;
    if (done) log("task", "Task completed: " + trunc(t.text, 60));
    save();
    var li = $("#task-" + id); if (li) li.classList.toggle("done", done);
    setTimeout(function () { render(); }, 350);
    toast(done ? "Task completed" : "Task reopened", done ? "Undo" : null, function () { t.done = false; t.doneTs = null; save(); render(); });
  }
  function processEmail(em, re) {
    var btn = $('[data-act="' + (re ? "reanalyse" : "process") + '"][data-id="' + em.id + '"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner' + (re ? " spinner--dark" : "") + '"></span> Analysing…'; }
    return new Promise(function (r) { setTimeout(r, reduced() ? 50 : 900); }).then(function () { return runAnalysis(em); }).then(function (a) {
      em.analysis = a; em.draft = null; em.tone = null;
      addTasksFrom(em, true);
      if (a.event && !S.events.some(function (x) { return x.emailId === em.id; })) S.events.push(Object.assign({ id: uid(), status: "suggested", emailId: em.id }, a.event));
      log(a.priority === "Urgent" ? "alert" : "process", "Analysed: “" + trunc(em.subject, 50) + "” → " + a.priority + " · " + a.category);
      save(); render();
      return a;
    });
  }
  function addAnalyzedToInbox() {
    var r = ui.analyzeResult; if (!r) return;
    var em = r.e; em.id = "u" + uid(); em.read = false; em.ts = Date.now();
    var ta = $("textarea[data-draft]"); em.draft = ta ? ta.value : null;
    S.emails.push(em); addTasksFrom(em, true);
    if (em.analysis.event) S.events.push(Object.assign({ id: uid(), status: "suggested", emailId: em.id }, em.analysis.event));
    log("new", "Test email added to Smart Inbox: “" + trunc(em.subject, 50) + "”");
    ui.analyzeResult = null; ui.analyzeInput = null; save(); openEmail(em.id); toast("Added to Smart Inbox with its tasks and suggestions");
  }

  /* ---------------- Modals ---------------- */
  var lastFocus = null;
  function openModal(html) {
    lastFocus = document.activeElement;
    var m = $("#modal"); m.innerHTML = '<div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="modal-title">' + html + "</div>"; m.hidden = false;
    var f = m.querySelector("input, textarea, select, button"); if (f) f.focus();
  }
  function closeModal() { var m = $("#modal"); m.hidden = true; m.innerHTML = ""; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function confirmModal(title, text, okLabel, onOk) {
    openModal('<h2 id="modal-title">' + esc(title) + '</h2><p class="muted">' + esc(text) + '</p><div class="btn-row" style="justify-content:flex-end"><button class="btn" data-act="close-modal">Cancel</button><button class="btn btn--primary" id="modal-ok">' + esc(okLabel) + "</button></div>");
    $("#modal-ok").addEventListener("click", function () { closeModal(); onOk(); });
  }
  function followupModal(id) {
    var f = fu(id), text = E.followupDraft(f, S.settings);
    openModal('<h2 id="modal-title">Follow up with ' + esc(f.contact) + '</h2><p class="small muted">Re: ' + esc(f.topic) + '</p><label class="sr-only" for="fu-text">Follow-up email</label><textarea class="draft" id="fu-text">' + esc(text) + '</textarea><p class="hint">Sending is simulated in this demo.</p><div class="btn-row" style="justify-content:flex-end"><button class="btn" data-act="close-modal">Cancel</button><button class="btn btn--primary" id="fu-send">' + ic("send") + " Approve &amp; send</button></div>");
    $("#fu-send").addEventListener("click", function () {
      f.sentTs = Date.now(); f.nudges = (f.nudges || 0) + 1; f.due = iso(E.bizDays(new Date(), 3));
      log("followup", "Follow-up sent to " + f.contact + " (simulated)"); save(); closeModal(); render(); toast("Follow-up sent to " + f.contact + ". Next check: " + fmt(f.due));
    });
  }
  function eventModal(existing) {
    var x = existing || { title: "", date: iso(E.addDays(new Date(), 1)), time: "10:00" };
    openModal('<h2 id="modal-title">' + (existing ? "Edit event" : "New event") + '</h2>' + (existing && existing.status === "suggested" ? '<p class="small muted">Suggested from your inbox — saving will confirm it.</p>' : "") + '<form class="form" id="ev-form" novalidate><div class="field"><label for="ev-title">Title</label><input id="ev-title" required maxlength="80" placeholder="e.g. Client call" value="' + esc(x.title) + '"></div><div class="field-row"><div class="field"><label for="ev-date">Date</label><input id="ev-date" type="date" required value="' + x.date + '"></div><div class="field"><label for="ev-time">Time</label><input id="ev-time" type="time" required value="' + (x.time || "10:00") + '"></div></div><div class="btn-row" style="justify-content:flex-end">' + (existing ? '<button type="button" class="btn btn--danger" id="ev-del" style="margin-right:auto">' + ic("trash") + " Delete</button>" : "") + '<button type="button" class="btn" data-act="close-modal">Cancel</button><button class="btn btn--primary" type="submit">' + (existing ? "Save" : "Add event") + "</button></div></form>");
    if (existing) $("#ev-del").addEventListener("click", function () { S.events = S.events.filter(function (v) { return v.id !== existing.id; }); log("calendar", "Event deleted: " + existing.title); save(); closeModal(); render(); toast("Event deleted"); });
    $("#ev-form").addEventListener("submit", function (e) {
      e.preventDefault(); var t = $("#ev-title").value.trim(); if (!t || !$("#ev-date").value) { $("#ev-title").focus(); return; }
      var ev = existing || { id: uid(), kind: "internal" };
      ev.title = t; ev.date = $("#ev-date").value; ev.time = $("#ev-time").value || "10:00"; ev.status = "confirmed";
      if (!existing) S.events.push(ev);
      var c = findConflict(ev, ev.id); log("calendar", (existing ? "Event updated: " : "Event added: ") + t); save(); closeModal(); render(); toast((existing ? "Event updated" : "Event added") + (c ? " — clashes with “" + c.title + "”" : ""));
    });
  }

  /* ---------------- Toast & clipboard ---------------- */
  function toast(msg, actionLabel, onAction) {
    var box = $("#toasts"), t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status");
    t.innerHTML = ic("check") + "<span>" + esc(msg) + "</span>" + (actionLabel ? '<button type="button" class="t-action">' + esc(actionLabel) + "</button>" : "") + '<button type="button" class="t-close" aria-label="Close notification">' + ic("x") + "</button>";
    var timer, ms = actionLabel ? 6500 : 4000;
    function close() { clearTimeout(timer); t.classList.add("is-leaving"); setTimeout(function () { t.remove(); }, reduced() ? 0 : 200); }
    function arm() { clearTimeout(timer); timer = setTimeout(close, ms); }
    if (actionLabel) t.querySelector(".t-action").addEventListener("click", function () { close(); onAction(); });
    t.querySelector(".t-close").addEventListener("click", close);
    t.addEventListener("mouseenter", function () { clearTimeout(timer); }); t.addEventListener("mouseleave", arm);
    t.addEventListener("focusin", function () { clearTimeout(timer); }); t.addEventListener("focusout", arm);
    box.appendChild(t); arm();
    while (box.children.length > 3) box.firstChild.remove();
  }
  function copy(text, ok) {
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast(ok); } catch (e) { toast("Copy isn't available here — select the text manually."); } ta.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast(ok); }, fallback); else fallback();
  }

  /* ---------------- Mobile menu ---------------- */
  function openMenu() { $("#side").classList.add("is-open"); $("#scrim").hidden = false; $("#menu-btn").setAttribute("aria-expanded", "true"); }
  function closeMenu() { var s = $("#side"); if (!s) return; s.classList.remove("is-open"); $("#scrim").hidden = true; $("#menu-btn").setAttribute("aria-expanded", "false"); }


  /* =========================================================
     LIVE BEHAVIOUR: notifications, live arrivals, typing drafts
     ========================================================= */
  function notify(text, view, emailId, kind) {
    S.notifications.unshift({ id: uid(), ts: Date.now(), text: text, view: view || "overview", emailId: emailId || null, kind: kind || "info", read: false });
    S.notifications = S.notifications.slice(0, 30); save(); renderBell();
  }
  function renderBell() {
    var n = S.notifications.filter(function (x) { return !x.read; }).length, b = $("#bell-n");
    if (b) { b.textContent = n > 9 ? "9+" : n; b.hidden = !n; }
    var btn = $("#bell-btn"); if (btn) btn.setAttribute("aria-label", "Notifications" + (n ? ", " + n + " unread" : ""));
    if (ui.notifOpen) renderBellPanel();
  }
  var NIC = { alert: ["alert", "tone-red"], mail: ["mail", "tone-blue"], task: ["clock", "tone-amber"], followup: ["repeat", "tone-navy"], calendar: ["cal", "tone-purple"], info: ["info", "tone-purple"] };
  function renderBellPanel() {
    var p = $("#bell-panel"); if (!p) return;
    var items = S.notifications.slice(0, 12);
    p.innerHTML = '<div class="np-head"><b>Notifications</b>' + (items.some(function (x) { return !x.read; }) ? '<button class="btn btn--ghost btn--xs" data-act="notif-readall">Mark all read</button>' : "") + "</div>" +
      (items.length ? '<ul class="list">' + items.map(function (n) {
        var k = NIC[n.kind] || NIC.info;
        return '<li><button class="np-item' + (n.read ? "" : " unread") + '" data-act="notif-open" data-id="' + n.id + '"><span class="a-ico ' + k[1] + '">' + ic(k[0]) + "</span><span>" + esc(n.text) + "<time>" + ago(n.ts) + "</time></span></button></li>";
      }).join("") + "</ul>" : empty("bell", "No notifications yet."));
  }
  function toggleBell(force) {
    ui.notifOpen = typeof force === "boolean" ? force : !ui.notifOpen;
    var p = $("#bell-panel"), b = $("#bell-btn"); if (!p) return;
    p.hidden = !ui.notifOpen; b.setAttribute("aria-expanded", ui.notifOpen);
    if (ui.notifOpen) renderBellPanel();
  }
  function checkDueNotifications() {
    var today = iso(new Date()); S.notified = S.notified || {};
    if (S.notified["due" + today]) return;
    S.notified["due" + today] = 1;
    var due = openTasks().filter(function (t) { return t.due === today; }).length, over = openTasks().filter(function (t) { return t.due && t.due < today; }).length;
    var fus = pendingFollowups().filter(function (f) { return f.due <= today; }).length;
    if (fus) notify(fus + " follow-up" + (fus > 1 ? "s are" : " is") + " due — check who hasn't replied", "followups", null, "followup");
    if (over) notify(over + " task" + (over > 1 ? "s are" : " is") + " overdue", "tasks", null, "task");
    if (due) notify(due + " task" + (due > 1 ? "s are" : " is") + " due today", "tasks", null, "task");
  }

  var typing = null;
  function typeInto(ta, text) {
    finishTyping();
    if (reduced() || text.length > 3000) { ta.value = text; return; }
    var i = 0, step = Math.max(2, Math.round(text.length / 110));
    ta.value = ""; ta.classList.add("is-typing");
    typing = { ta: ta, text: text, timer: setInterval(function () {
      i += step; ta.value = text.slice(0, i); ta.scrollTop = ta.scrollHeight;
      if (i >= text.length) finishTyping();
    }, 16) };
  }
  function finishTyping() { if (!typing) return; clearInterval(typing.timer); typing.ta.value = typing.text; typing.ta.classList.remove("is-typing"); typing = null; }

  /* ---------- Drag & drop (tasks board, calendar) ---------- */
  function bindDnD() {
    $$("[data-drag-task]").forEach(function (c) {
      c.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", "task:" + c.getAttribute("data-drag-task")); e.dataTransfer.effectAllowed = "move"; c.classList.add("dragging"); });
      c.addEventListener("dragend", function () { c.classList.remove("dragging"); });
    });
    $$("[data-drag-ev]").forEach(function (c) {
      c.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", "ev:" + c.getAttribute("data-drag-ev")); e.dataTransfer.effectAllowed = "move"; c.classList.add("dragging"); });
      c.addEventListener("dragend", function () { c.classList.remove("dragging"); });
    });
    $$("[data-drop-status], [data-drop-date]").forEach(function (z) {
      z.addEventListener("dragover", function (e) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; z.classList.add("drop-over"); });
      z.addEventListener("dragleave", function (e) { if (!z.contains(e.relatedTarget)) z.classList.remove("drop-over"); });
      z.addEventListener("drop", function (e) {
        e.preventDefault(); z.classList.remove("drop-over");
        var d = (e.dataTransfer.getData("text/plain") || "").split(":");
        if (d[0] === "task" && z.hasAttribute("data-drop-status")) setTaskStatus(d[1], z.getAttribute("data-drop-status"));
        if (d[0] === "ev" && z.hasAttribute("data-drop-date")) moveEvent(d[1], z.getAttribute("data-drop-date"));
      });
    });
  }
  function taskStatus(t) { return t.done ? "done" : t.status === "doing" ? "doing" : "todo"; }
  function setTaskStatus(id, st) {
    var t = S.tasks.filter(function (x) { return x.id === id; })[0]; if (!t || taskStatus(t) === st) return;
    t.status = st; t.done = st === "done"; t.doneTs = t.done ? Date.now() : null;
    log("task", (st === "done" ? "Task completed: " : st === "doing" ? "Task started: " : "Task moved to To do: ") + trunc(t.text, 60));
    save(); render(); toast(st === "done" ? "Task completed" : st === "doing" ? "Moved to In progress" : "Moved to To do");
  }
  function moveEvent(id, date) {
    var ev = evById(id); if (!ev || ev.date === date) return;
    ev.date = date; var c = findConflict(ev, ev.id);
    log("calendar", "Event moved: " + ev.title + " → " + fmt(date)); save(); render();
    toast("Moved to " + fmt(date) + (c ? " — clashes with “" + c.title + "”" : ""));
  }

  /* =========================================================
     GUIDED TOUR
     ========================================================= */
  var TOUR = [
    { view: "overview", sel: ".kpis", title: "Your day at a glance", text: "Live counters for emails processed, important emails, pending tasks, deadlines, follow-ups and completed tasks. They fill up as you add emails." },
    { view: "analyze", sel: "#analyze-form", title: "Start here", text: "Write or paste an email. Choose Live AI to have a real AI model analyse it through Make.com, or the instant in-browser engine." },
    { view: "inbox", sel: ".chips", title: "Your Smart Inbox", text: "Analysed emails you add appear here with a summary, priority and recommended action. Filter by Urgent, Important, Requires response, Meetings or General information.", before: function () { ui.selected = null; ui.filter = "all"; ui.query = ""; } },
    { view: "inbox", sel: ".analysis", optional: true, title: "The full analysis", text: "Intent, priority with reasons, extracted names, amounts and dates, deadlines, tasks and a suggested reply — all editable.", before: function () { var v = visibleEmails(); ui.selected = v.length ? v[0].id : null; } },
    { view: "tasks", sel: "#tasks-card", title: "Tasks & deadlines", text: "Action items from your emails land here automatically. Switch to Board view and drag tasks between To do, In progress and Done.", before: function () { ui.selected = null; } },
    { view: "calendar", sel: ".week", title: "Calendar", text: "Meetings found in email appear as suggestions to accept or dismiss. Drag events between days or click one to edit." },
    { view: "briefing", sel: ".brief__hero", title: "Daily briefing", text: "A ready-made summary of priorities, deadlines and meetings, which you can copy in one click." },
    { view: "briefing", sel: "#bell-btn", title: "Notifications", text: "Due tasks and follow-ups show up here. You're ready — analyse your first email!" }
  ];
  var tour = { i: -1 };
  function startTour() { closeMenu(); toggleBell(false); tour.i = 0; document.body.classList.add("touring"); showStep(); }
  function endTour(done) {
    tour.i = -1; document.body.classList.remove("touring");
    ["tour-block", "tour-spot", "tour-pop"].forEach(function (id) { var el = document.getElementById(id); if (el) el.remove(); });
    try { localStorage.setItem("eaTourDone", "1"); } catch (e) { /* */ }
    if (done) toast("Tour complete — the demo is yours to explore.");
    window.removeEventListener("resize", placeStep); window.removeEventListener("scroll", onTourScroll, true);
  }
  function showStep() {
    var st = TOUR[tour.i]; if (!st) return endTour(true);
    if (st.before) st.before();
    if (st.optional && !ui.selected) { tour.i += tour.dir || 1; if (tour.i < 0) tour.i = 0; return showStep(); }
    if (ui.view !== st.view) { ui.view = st.view; try { history.replaceState(null, "", "#" + st.view); } catch (e) { /* */ } }
    render();
    if (!$("#tour-block")) {
      document.body.insertAdjacentHTML("beforeend", '<div id="tour-block"></div><div id="tour-spot" aria-hidden="true"></div><div id="tour-pop" role="dialog" aria-modal="true" aria-labelledby="tour-title"></div>');
      window.addEventListener("resize", placeStep); window.addEventListener("scroll", onTourScroll, true);
    }
    var pop = $("#tour-pop");
    pop.innerHTML = '<p class="tour-count">Step ' + (tour.i + 1) + " of " + TOUR.length + '</p><h2 id="tour-title">' + esc(st.title) + "</h2><p>" + esc(st.text) + '</p><div class="tour-dots" aria-hidden="true">' + TOUR.map(function (_, i) { return '<span class="' + (i === tour.i ? "on" : "") + '"></span>'; }).join("") + '</div><div class="btn-row"><button class="btn btn--ghost btn--sm" data-act="tour-skip">Skip tour</button><span style="flex:1"></span>' +
      (tour.i ? '<button class="btn btn--sm" data-act="tour-prev">Back</button>' : "") + '<button class="btn btn--primary btn--sm" data-act="tour-next">' + (tour.i === TOUR.length - 1 ? "Finish" : "Next") + "</button></div>";
    var el = $(st.sel);
    if (el) el.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" });
    setTimeout(function () { placeStep(); var n = $("#tour-pop [data-act=tour-next]"); if (n) n.focus({ preventScroll: true }); }, reduced() ? 10 : 380);
    setTimeout(placeStep, 750); setTimeout(placeStep, 1200);
  }
  var tourRaf = 0;
  function onTourScroll() { cancelAnimationFrame(tourRaf); tourRaf = requestAnimationFrame(placeStep); }
  function placeStep() {
    if (tour.i < 0) return;
    var st = TOUR[tour.i], el = $(st.sel), spot = $("#tour-spot"), pop = $("#tour-pop"); if (!spot || !pop) return;
    var vw = window.innerWidth, vh = window.innerHeight, pw = Math.min(360, vw - 24);
    pop.style.width = pw + "px";
    if (!el || !el.getClientRects().length) { spot.style.opacity = "0"; pop.style.left = (vw - pw) / 2 + "px"; pop.style.top = Math.max(16, vh / 2 - 120) + "px"; return; }
    var r = el.getBoundingClientRect(), pad = 8;
    var top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad), w = Math.min(vw - 8, r.width + pad * 2), h = Math.min(vh - 8, r.height + pad * 2);
    spot.style.opacity = "1"; spot.style.top = top + "px"; spot.style.left = left + "px"; spot.style.width = w + "px"; spot.style.height = h + "px";
    var ph = pop.offsetHeight || 200, py;
    if (vw < 640) { pop.style.left = "12px"; pop.style.top = (vh - ph - 12) + "px"; return; }
    if (top + h + 12 + ph < vh) py = top + h + 12; else if (top - ph - 12 > 0) py = top - ph - 12; else py = Math.max(12, vh - ph - 12);
    var px = Math.min(Math.max(12, left), vw - pw - 12);
    pop.style.top = py + "px"; pop.style.left = px + "px";
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    S = load(); if (!S) seed();
    document.addEventListener("click", onClick);
    document.addEventListener("change", function (e) { if (e.target.matches('input[type=checkbox][data-act="toggle-task"]')) { /* handled in click */ } });
    document.addEventListener("click", function (e) { if (ui.notifOpen && !e.target.closest("#bell-panel, #bell-btn")) toggleBell(false); });
    document.addEventListener("keydown", function (e) {
      if (tour.i >= 0) { if (e.key === "Escape") endTour(false); if (e.key === "ArrowRight") { tour.dir = 1; tour.i++; tour.i >= TOUR.length ? endTour(true) : showStep(); } if (e.key === "ArrowLeft" && tour.i > 0) { tour.dir = -1; tour.i--; showStep(); } return; }
      if (e.key === "Escape") { if (!$("#modal").hidden) closeModal(); else if (ui.notifOpen) toggleBell(false); else closeMenu(); }
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { var s = $("#global-q"); if (s && s.offsetParent) { e.preventDefault(); s.focus(); } }
    });
    $("#modal").addEventListener("click", function (e) { if (e.target.id === "modal") closeModal(); });
    $("#scrim").addEventListener("click", closeMenu);
    $("#global-q").addEventListener("input", function (e) { ui.query = e.target.value; ui.selected = null; if (ui.view !== "inbox") go("inbox"); else render(); });
    $("#note-close").addEventListener("click", dismissNote);
    try { if (localStorage.getItem("eaNoteHidden")) $("#demo-note").hidden = true; } catch (e) { /* */ }
    if (CFG.websiteUrl) $("#back-site").href = CFG.websiteUrl;
    if (CFG.contactUrl) $("#cta-book").href = CFG.contactUrl;
    window.addEventListener("hashchange", onHash);
    onHash();
    checkDueNotifications(); renderBell();
    var noTour = /[?&]notour\b/.test(location.search);
    try { if (!noTour && !localStorage.getItem("eaTourDone")) setTimeout(function () { if (tour.i < 0 && $("#modal").hidden) startTour(); }, 900); } catch (e) { /* */ }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
