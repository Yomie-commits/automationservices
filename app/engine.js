/* =========================================================
   DEMONSTRATION ENGINE
   A transparent, rules-based stand-in for the AI step. It runs
   entirely in the visitor's browser: no AI service is called and
   no data leaves the page. In the production system this step is
   performed by an AI language model through Make.com.
   Output shape is identical either way (see normalise() in app.js).
   ========================================================= */
(function (root) {
  "use strict";

  var DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------------- Dates ---------------- */
  function sod(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function addDays(d, n) { var x = sod(d); x.setDate(x.getDate() + n); return x; }
  function iso(d) { d = new Date(d); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fromIso(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(s) { if (!s) return "—"; var d = fromIso(s); return DOW[d.getDay()] + " " + d.getDate() + " " + MON[d.getMonth()]; }
  function fmtTime(t) { if (!t) return ""; var p = t.split(":"), h = +p[0]; return (h % 12 || 12) + (p[1] !== "00" ? ":" + p[1] : "") + (h >= 12 ? " pm" : " am"); }
  function daysFrom(s, now) { return Math.round((fromIso(s) - sod(now || new Date())) / 864e5); }
  function rel(s, now) {
    if (!s) return "";
    var d = daysFrom(s, now);
    if (d === 0) return "today"; if (d === 1) return "tomorrow"; if (d === -1) return "yesterday";
    if (d < 0) return Math.abs(d) + " days overdue";
    if (d < 7) return "in " + d + " days";
    return "in " + Math.round(d / 7) + " wk";
  }
  function nextDow(base, dow) { var diff = (dow - base.getDay() + 7) % 7; return addDays(base, diff); }
  function bizDays(base, n) { var d = sod(base), k = 0; while (k < n) { d.setDate(d.getDate() + 1); if (d.getDay() % 6 !== 0) k++; } return d; }

  function findTime(text) {
    var m = text.match(/\b(\d{1,2})(?:[:.](\d{2}))?\s*(a\.?m\.?|p\.?m\.?)(?![a-z])/i);
    if (m) { var h = +m[1] % 12; if (/p/i.test(m[3])) h += 12; return pad(h) + ":" + (m[2] || "00"); }
    m = text.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
    if (m) return pad(+m[1]) + ":" + m[2];
    if (/\b(noon|midday|lunch ?time)\b/i.test(text)) return "12:00";
    return null;
  }
  function findDates(text, now) {
    var t = " " + text.toLowerCase().replace(/\s+/g, " ") + " ", out = [], m, re;
    function push(d, i, ph) { out.push({ date: iso(d), index: i, phrase: ph.trim() }); }
    re = /\b(today|tonight|this (morning|afternoon|evening)|end of (the )?day|eod|close of business|asap|immediately|right away)\b/g;
    while ((m = re.exec(t))) push(now, m.index, m[0]);
    re = /\b(tomorrow|tmrw)\b/g; while ((m = re.exec(t))) push(addDays(now, 1), m.index, m[0]);
    re = /\bin (\d{1,2}|two|three|four|five|a couple of) (days?|weeks?)\b/g;
    var W = { two: 2, three: 3, four: 4, five: 5, "a couple of": 2 };
    while ((m = re.exec(t))) { var n = W[m[1]] || +m[1]; push(addDays(now, /week/.test(m[2]) ? n * 7 : n), m.index, m[0]); }
    re = /\b(end of (the |this )?week|this week)\b/g; while ((m = re.exec(t))) push(nextDow(now, 5), m.index, m[0]);
    re = /\bnext week\b/g; while ((m = re.exec(t))) push(addDays(nextDow(addDays(now, 1), 1), 0), m.index, m[0]);
    re = /\b(next |this |on |by |before |until |coming )?(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tues|thurs)\b/g;
    while ((m = re.exec(t))) {
      var dow = -1; for (var i = 0; i < 7; i++) if (DAYS[i].indexOf(m[2].slice(0, 3)) === 0) dow = i;
      var d = nextDow(now, dow);
      if (m[1] && /next/.test(m[1]) && daysFrom(iso(d), now) < 3) d = addDays(d, 7);
      if (d.getTime() === sod(now).getTime() && /^(last|past)/.test(t.slice(Math.max(0, m.index - 5), m.index))) continue;
      push(d, m.index, m[0]);
    }
    var mr = "(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*";
    re = new RegExp("\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?" + mr + "\\b", "g"); while ((m = re.exec(t))) dm(+m[1], m[2], m.index, m[0]);
    re = new RegExp("\\b" + mr + "\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b", "g"); while ((m = re.exec(t))) dm(+m[2], m[1], m.index, m[0]);
    re = /\b(\d{4})-(\d{2})-(\d{2})\b/g; while ((m = re.exec(t))) push(new Date(+m[1], +m[2] - 1, +m[3]), m.index, m[0]);
    re = /\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/g;
    while ((m = re.exec(t))) {
      var dd = +m[1], mm = +m[2]; if (dd < 1 || dd > 31 || mm < 1 || mm > 12) continue;
      var yy = m[3] ? (+m[3] < 100 ? 2000 + +m[3] : +m[3]) : now.getFullYear();
      var x = new Date(yy, mm - 1, dd); if (!m[3] && x < addDays(now, -60)) x.setFullYear(yy + 1); push(x, m.index, m[0]);
    }
    function dm(day, mon, i, ph) {
      var mi = MONTHS.indexOf(mon.slice(0, 3)); if (mi < 0 || day < 1 || day > 31) return;
      var x = new Date(now.getFullYear(), mi, day); if (x < addDays(now, -60)) x.setFullYear(x.getFullYear() + 1); push(x, i, ph);
    }
    out.sort(function (a, b) { return a.index - b.index; });
    return out;
  }

  /* ---------------- Text ---------------- */
  function splitSentences(body) {
    var out = [];
    String(body || "").replace(/\r/g, "").split(/\n+/).forEach(function (line) {
      line = line.trim(); if (!line) return;
      (line.match(/(?:[^.!?]|[.!?](?=[^\s.!?]))+(?:[.!?]+|$)/g) || [line]).forEach(function (s) { s = s.trim(); if (s.length > 1) out.push(s); });
    });
    return out;
  }
  var GREET = /^(hi|hello|hey|dear|good (morning|afternoon|evening)|greetings|habari|jambo)\b[^.!?]{0,40}[,!.]?$/i;
  var SIGN = /^(thanks|thank you|regards|kind regards|best|best regards|cheers|warm regards|sincerely|many thanks|asante|blessings|yours)\b[^.!?]{0,30}[,!.]?$/i;
  function fluff(s) { return GREET.test(s) || SIGN.test(s) || s.split(/\s+/).length < 3 || /^(i hope|hope you|trust you|i trust|sent from my)/i.test(s); }
  function deGreet(s) { return s.replace(/^(hi|hello|hey|dear|good (morning|afternoon|evening))\b[^,!]{0,30}[,!]\s*/i, "").replace(/^(also|and|so|but|then|finally|additionally|lastly),?\s+/i, ""); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function trunc(s, n) { return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; }
  function cleanSubject(s) { return String(s || "").replace(/^\s*((re|fw|fwd|urgent|important|reminder|action required|invitation|enquiry|inquiry|question|final reminder)\s*[:\-–]\s*)+/i, "").trim(); }
  function firstName(from) {
    var n = String(from || "").replace(/<.*$/, "").trim().split(/\s+/)[0] || "";
    return /^(accounts|billing|support|info|team|admin|noreply|no-reply|hello|sales|newsletter|the|registrar|notifications?)$/i.test(n) ? "" : cap(n);
  }
  function swap(s) {
    return s.replace(/\bme\b/gi, "them").replace(/\bmy\b/gi, "their").replace(/\bus\b/g, "them").replace(/\bour\b/gi, "their").replace(/\bours\b/gi, "theirs");
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------------- Category & intent ---------------- */
  var CATEGORIES = ["Client request", "New lead", "Meeting", "Finance", "Issue / complaint", "Internal", "General information"];
  var CAT_RULES = {
    "New lead": [/\b(enquir|inquir)\w*/g, 3, /\binterested in\b/g, 3, /\bdo you (offer|provide|do|handle|have)\b/g, 3, /\bhow much\b/g, 3,
      /\b(pricing|prices?|rates|costs?|fees?|quotation|packages?)\b/g, 1.2, /\byour (services|company|business|work)\b/g, 2, /\b(found you|came across|referred|recommended you)\b/g, 2.5],
    "Meeting": [/\b(meet|meeting|call|catch[- ]up|appointment|zoom|google meet|teams|reschedul\w*|availability|available|slot|invit\w*|agenda|summit|workshop|webinar|conference|calendar)\b/g, 1.5],
    "Finance": [/\b(invoice|inv[-\s]?\d+|payment|remittance|receipt|overdue|balance|billing|refund|m-?pesa|paybill|renew\w*|subscription|expir\w*|due date|paid)\b/g, 2, /\b(kes|ksh|usd|\$)\s?\d/g, 1.5],
    "Issue / complaint": [/\b(problem|issue|not working|stopped|broken|error|complain\w*|disappoint\w*|frustrat\w*|unhappy|fail(ed|ing|ure)?|bug|wrong|delay(ed)?|missing|down)\b/g, 2, /\b(has not|hasn['’]t|have not|haven['’]t|nothing is|not (sent|arriving|received|loading|showing))\b/g, 2.5],
    "Client request": [/\b(revised|revise|update|send|share|prepare|draft|review|approve|deliver\w*|proposal|document|report|deck|quote|deadline|comments|feedback|sign off)\b/g, 1.1],
    "Internal": [/\b(team|staff|colleagues|everyone|all hands|internal|weekly update|standup|stand-up|leave|office)\b/g, 1.2],
    "General information": [/\b(unsubscribe|newsletter|webinar|weekly roundup|digest|promo\w*|% off|discount|view in browser|this week in|tips|fyi|for your information|no action|announcement|notification)\b/g, 2.5]
  };
  function classify(subject, body) {
    var text = (subject + "\n" + body).toLowerCase(), scores = {}, best = "General information", bestScore = 1.4;
    Object.keys(CAT_RULES).forEach(function (c) {
      var r = CAT_RULES[c], s = 0;
      for (var i = 0; i < r.length; i += 2) { var m = text.match(r[i]); if (m) s += m.length * r[i + 1]; }
      if (c === "Client request" && /^\s*re:/i.test(subject)) s += 1;
      scores[c] = s; if (s > bestScore) { best = c; bestScore = s; }
    });
    return best;
  }

  var INTENTS = [
    { id: "quote", label: "Requests a quote or pricing", re: /\b(quote|quotation|pricing|price|how much|cost|rates|fees?)\b/i, w: 2 },
    { id: "info", label: "Requests information", re: /\b(do you offer|can you tell|could you explain|more information|more details|wondering|interested in)\b/i, w: 1.6 },
    { id: "schedule", label: "Wants to schedule a meeting", re: /\b(meet|meeting|call|catch[- ]up|available|availability|slot|free on|appointment)\b/i, w: 1.4 },
    { id: "reschedule", label: "Wants to reschedule a meeting", re: /\b(reschedul\w*|move (our|the|it)\b[^.?!]{0,30}\b(meeting|call)|postpone|push (it|the meeting)|change the time|something has come up)/i, w: 4.5 },
    { id: "confirm", label: "Confirms an arrangement", re: /\b(confirm(ing|ation)?|see you (on|at)|looking forward to (meeting|seeing))\b/i, w: 1.5 },
    { id: "payment", label: "Requests payment", re: /\b(invoice (no|number|#)|inv-?\d+|[A-Z]{2,4}-\d{3,}|payment (is )?due|overdue|amount due|settle|remittance|pay by|is due)\b/i, w: 2.5 },
    { id: "renewal", label: "Service renewal or expiry notice", re: /\b(renew\w*|expir\w*|subscription)\b/i, w: 2.5 },
    { id: "receipt", label: "Confirms a payment received", re: /\b(payment received|receipt|we have received|has been received|paid in full)\b/i, w: 2.6 },
    { id: "problem", label: "Reports a problem", re: /\b(problem|issue|not working|stopped|broken|error|fail\w*|down|complain\w*|delay\w*|disappoint\w*|(has|have)n['’]?t been|has not|nothing is|still hasn)/i, w: 2.4 },
    { id: "deliverable", label: "Requests a deliverable or action", re: /\b(could you|can you|please|kindly|need you to|we need|send|share|review|prepare|revise|update)\b/i, w: 1.3 },
    { id: "followup", label: "Follows up on an earlier conversation", re: /\b(following up|follow up|re:|as discussed|last week|previous email|reminder|checking in|any update)\b/i, w: 1.6 },
    { id: "invite", label: "Invitation to an event", re: /\b(invit\w*|summit|conference|workshop|webinar|event|rsvp|register)\b/i, w: 2 },
    { id: "fyi", label: "Shares information (no action needed)", re: /\b(fyi|for your information|update|newsletter|roundup|digest|no action|announcement)\b/i, w: 1.2 },
    { id: "marketing", label: "Marketing / newsletter", re: /\b(unsubscribe|newsletter|% off|discount|promo\w*|view in browser|this week in)\b/i, w: 3 }
  ];
  function detectIntent(subject, body) {
    var text = subject + "\n" + body, hits = [];
    INTENTS.forEach(function (it) {
      var m = text.match(new RegExp(it.re.source, "gi"));
      if (m) hits.push({ id: it.id, label: it.label, score: m.length * it.w });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    if (!hits.length) return { primary: { id: "fyi", label: "Shares information (no action needed)" }, confidence: 0.55, secondary: [] };
    var total = hits.reduce(function (a, h) { return a + h.score; }, 0);
    var conf = Math.min(0.97, 0.55 + 0.42 * (hits[0].score / total) + (hits[0].score > 4 ? 0.05 : 0));
    return { primary: hits[0], confidence: Math.round(conf * 100) / 100, secondary: hits.slice(1, 3).map(function (h) { return h.label; }) };
  }

  /* ---------------- Entities ---------------- */
  var PLACES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Machakos", "Nyeri", "Westlands", "Kilimani", "Karen", "Upper Hill", "CBD", "Lavington", "Gigiri", "Kileleshwa", "Kampala", "Kigali", "Dar es Salaam", "Addis Ababa", "Lagos", "Accra", "Johannesburg", "Dubai", "London", "New York", "Kenya", "Uganda", "Tanzania", "Rwanda"];
  function extractEntities(email, now) {
    var text = email.subject + "\n" + email.body, uniq = function (a) { return a.filter(function (v, i) { return v && a.indexOf(v) === i; }); };
    var people = [], m, re;
    var sender = String(email.from || "").replace(/<.*$/, "").trim();
    if (firstName(sender)) people.push(sender);
    re = /\b(?:Mr|Mrs|Ms|Dr|Prof|Eng)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g; while ((m = re.exec(text))) people.push(m[0]);
    re = /\bwith (?:my |our )?(?:partner|colleague|manager|director|accountant|assistant)?\s*([A-Z][a-z]+ [A-Z][a-z]+)\b/g; while ((m = re.exec(text))) people.push(m[1]);
    var orgs = [];
    re = /\b((?:[A-Z][A-Za-z&'-]+[ \t]){1,3}(?:Ltd|Limited|Inc|LLC|PLC|Group|Bank|Hotels?|Agency|Foundation|School|Academy|Clinic|Realty|Supplies|Logistics|Ventures|Interiors|Consulting|Partners|Sacco|University|Hospital|Company))\b\.?/g;
    while ((m = re.exec(text))) orgs.push(m[1].trim());
    if (email.org) orgs.unshift(email.org);
    var money = []; re = /\b(?:KES|Ksh\.?|KSh|USD|US\$|\$|€|£)\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:k|m|million|thousand))?/gi; while ((m = re.exec(text))) money.push(m[0].replace(/\s+/g, " "));
    re = /\b\d[\d,]*(?:\.\d+)?\s?(?:KES|shillings|dollars|USD)\b/gi; while ((m = re.exec(text))) money.push(m[0]);
    var refs = []; re = /\b(?:INV|PO|REF|QT|ORD|TKT)[-#\s]?\d{2,}\b|\b[A-Z]{2,4}-\d{3,}\b|#\d{3,}\b|\b(?:invoice|order|ticket|ref(?:erence)?)\s*(?:no\.?|number|#)\s*[A-Z0-9-]{3,}\b/gi; while ((m = re.exec(text))) refs.push(m[0].toUpperCase().replace(/\s+/g, " "));
    var phones = []; re = /(?:\+254|\b0)(?:[17]\d{2})[\s-]?\d{3}[\s-]?\d{3}\b|\+\d{1,3}[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}/g; while ((m = re.exec(text))) phones.push(m[0]);
    var emails = []; re = /[\w.+-]+@[\w-]+\.[\w.]+/g; while ((m = re.exec(email.body || ""))) emails.push(m[0]);
    var urls = []; re = /\bhttps?:\/\/[^\s)]+|\bwww\.[^\s)]+|\b[a-z0-9-]+\.(?:co\.ke|com|org|net|io)\b/gi; while ((m = re.exec(email.body || ""))) urls.push(m[0]);
    var places = PLACES.filter(function (p) { return new RegExp("\\b" + p + "\\b").test(text); });
    var dates = findDates(text, now).map(function (d) { return { phrase: d.phrase, date: d.date }; });
    var times = []; re = /\b\d{1,2}(?:[:.]\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)|\b(?:[01]?\d|2[0-3]):[0-5]\d\b/gi; while ((m = re.exec(text))) times.push(m[0]);
    var seen = {}, dd = [];
    dates.forEach(function (d) { var k = d.phrase + d.date; if (!seen[k]) { seen[k] = 1; dd.push(d); } });
    return {
      people: uniq(people).slice(0, 4), organisations: uniq(orgs).slice(0, 4), amounts: uniq(money).slice(0, 4), references: uniq(refs).slice(0, 4),
      dates: dd.slice(0, 5), times: uniq(times).slice(0, 4), locations: places.slice(0, 4), phones: uniq(phones).slice(0, 3), emails: uniq(emails).slice(0, 3), links: uniq(urls).slice(0, 3)
    };
  }

  /* ---------------- Tasks ---------------- */
  var REQ = /\b(could you|can you|would you|will you|please|kindly|i need you to|we need|i need|need you to|let me know|let us know|i'?d (like|appreciate)|are you able to|is it possible|call me|get back to (me|us)|send (me|us|over)|share|confirm|remind|rsvp)\b/i;
  function toTask(sentence, who) {
    var s = deGreet(sentence).replace(/\s+/g, " ").trim(), m;
    if (/^rsvp\b/i.test(s)) return "RSVP to " + who + (findDates(s, new Date()).length ? "" : "");
    if (/^(please )?(find|see) (the )?attached\b/i.test(s)) return null;
    if (/\bcall me\b/i.test(s)) { m = s.match(/call me ([^.?!,]+)/i); return "Call " + who + (m ? " " + m[1].replace(/\b(please|if possible|back)\b/gi, "").trim() : ""); }
    if ((m = s.match(/\b(?:let me know|let us know|get back to (?:me|us)(?: on)?)\b\s*(.*)$/i))) {
      var rest = m[1].replace(/[?.!]+$/, "").trim();
      rest = rest.replace(/^(today|tomorrow|asap|soon)\s+/i, "");
      if (/^(if|whether) |^what works|^your availability|^(a|the) time/i.test(rest)) return null;
      return "Reply to " + who + (rest ? " — " + swap(rest) : "");
    }
    var P = [/\b(?:could|can|would|will) (?:you|we) (?:please |also |kindly |possibly |just )*(.+)$/i, /\b(?:please|kindly) (?:also )?(.+)$/i,
      /\b(?:i|we)(?:'d| would) (?:like|appreciate it if) you (?:to |could )?(.+)$/i, /\b(?:i|we) need you to (.+)$/i, /\b(?:are you able|is it possible) (?:for you )?to (.+)$/i];
    for (var i = 0; i < P.length; i++) if ((m = s.match(P[i]))) { s = m[1]; break; }
    if (!m) { if ((m = s.match(/\b(?:i|we) (?:need|require) (.+)$/i))) s = "Provide " + m[1]; else return null; }
    s = swap(s).replace(/\b(please|kindly)\b\s*/gi, "").replace(/[?.!]+$/, "").trim();
    var cut = s.match(/^(.*?)\s+(?:by|before|no later than|until)\s+(.+)$/i);
    if (cut && findDates(cut[2], new Date()).length && cut[1].split(/\s+/).length >= 2) s = cut[1];
    s = s.replace(/^(send|give|email|forward|share|show) them\b/i, function (w, v) { return v + " " + who; });
    if (/^(meet|have (a |the |our )?(quick )?(meeting|call|chat)|be available|be free|move (our|the|it)|catch up|join)\b/i.test(s)) return null;
    s = s.replace(/\s+(today|tomorrow|this week|asap|immediately|right away|now)$/i, "");
    if (s.split(/\s+/).length < 2) return null;
    if (/^(have|move|meet|do) /i.test(s) && /\b(meeting|call|catch)/i.test(s)) return null; // handled as meeting
    if (s.split(/\s+/).length < 2) return null;
    return trunc(cap(s), 95);
  }

  /* ---------------- Main analysis ---------------- */
  function analyze(email, settings, nowArg) {
    var now = nowArg ? new Date(nowArg) : new Date();
    settings = settings || {};
    var subject = email.subject || "", body = email.body || "", all = subject + ". " + body, lower = all.toLowerCase();
    var first = firstName(email.from), who = first || String(email.org || email.from || "the sender").replace(/<.*$/, "").trim();
    var category = classify(subject, body);
    var intent = detectIntent(subject, body);
    if (intent.primary.id === "marketing" || intent.primary.id === "fyi") { if (category !== "Meeting" && category !== "Internal") category = "General information"; }
    if (intent.primary.id === "receipt") category = "Finance";
    var entities = extractEntities(email, now);
    var sents = splitSentences(body);
    var dates = findDates(all, now).filter(function (d) { return daysFrom(d.date, now) >= 0; });
    var earliest = dates.slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; })[0];

    /* priority */
    var score = 0, reasons = [];
    var urgentWords = String(settings.urgentKeywords || "urgent, asap, immediately, deadline, overdue, critical, final reminder").split(",").map(function (w) { return w.trim().toLowerCase(); }).filter(Boolean);
    var hit = urgentWords.filter(function (w) { return lower.indexOf(w) >= 0; });
    if (hit.length) { score += 3; reasons.push("Urgent wording: “" + hit.slice(0, 2).join("”, “") + "”"); }
    var vip = String(settings.vipSenders || "").split(",").map(function (w) { return w.trim().toLowerCase(); }).filter(Boolean);
    var fromL = ((email.from || "") + " " + (email.email || "") + " " + (email.org || "")).toLowerCase();
    if (vip.some(function (v) { return fromL.indexOf(v) >= 0; })) { score += 2.5; reasons.push("Sender is on your VIP list"); }
    if (earliest) {
      var dd = daysFrom(earliest.date, now);
      if (dd <= 1) { score += 3.5; reasons.push("Deadline " + (dd <= 0 ? "today" : "tomorrow")); }
      else if (dd <= 3) { score += 2; reasons.push("Time-sensitive date: " + fmt(earliest.date)); }
      else if (dd <= 7) { score += 1; reasons.push("Date within the next week"); }
    }
    var catWeight = { "Issue / complaint": [2.5, "Reported problem affecting operations"], "New lead": [2.5, "New business opportunity"], "Client request": [1.5, "Request from a client"], "Meeting": [1, "Affects your calendar"], "Finance": [1.2, "Money involved"], "Internal": [0, ""], "General information": [-4, "Informational / marketing content"] };
    var cw = catWeight[category]; score += cw[0]; if (cw[1]) reasons.push(cw[1]);
    if (intent.primary.id === "receipt") { score -= 2; }
    if (/\?/.test(body)) score += 0.5;
    var priority = score >= 5.5 ? "Urgent" : score >= 3.5 ? "Important" : score >= 1.5 ? "Normal" : "Low";
    if (!reasons.length) reasons.push("No urgency signals detected");

    /* response needed? */
    var requiresResponse = category !== "General information" && intent.primary.id !== "receipt" &&
      (/\?/.test(body) || REQ.test(body) || ["New lead", "Meeting", "Issue / complaint", "Client request"].indexOf(category) >= 0);
    if (category === "Internal" && !/\?/.test(body) && !REQ.test(body)) requiresResponse = false;

    /* tasks */
    var tasks = [];
    function add(text, due) {
      if (!text) return; var k = text.toLowerCase().slice(0, 22);
      if (tasks.some(function (t) { return t.text.toLowerCase().slice(0, 22) === k; })) return;
      tasks.push({ text: text, due: due || null });
    }
    function defDue() { return earliest ? earliest.date : priority === "Urgent" ? iso(now) : priority === "Important" ? iso(bizDays(now, 1)) : priority === "Normal" ? iso(bizDays(now, 3)) : null; }
    if (category !== "General information" && intent.primary.id !== "receipt") {
      if (intent.primary.id === "renewal" || (category === "Finance" && /renew|expir/i.test(all))) add("Renew " + ((all.match(/\b(domain|subscription|licen[cs]e|hosting|plan|insurance)\b/i) || ["service"])[0].toLowerCase()) + " before it expires", defDue());
      else if (category === "Finance" && /\b(due|pay|payment|overdue|settle)/i.test(all)) add("Process payment" + (entities.references[0] ? " for " + entities.references[0] : "") + (entities.amounts[0] ? " (" + entities.amounts[0] + ")" : ""), defDue());
      sents.forEach(function (s) {
        if (fluff(s) || !REQ.test(s)) return;
        var t = toTask(s, who); if (!t) return;
        var sd = findDates(s, now).filter(function (d) { return daysFrom(d.date, now) >= 0; });
        add(t, sd.length ? sd[0].date : defDue());
      });
      if (category === "New lead") { add("Reply to " + who + " with service details and a pricing guide", iso(now)); add("Offer " + who + " a discovery call", iso(now)); }
      if (category === "Meeting" && requiresResponse && intent.primary.id !== "invite") add((intent.primary.id === "reschedule" ? "Confirm new meeting time with " : "Respond to meeting request from ") + who, iso(now));
      if (category === "Issue / complaint") add("Investigate the issue and update " + who, priority === "Urgent" ? iso(now) : defDue());
      if (!tasks.length && requiresResponse) add("Reply to " + who, defDue());
    }
    tasks = tasks.slice(0, 5);

    /* deadlines */
    var deadlines = [];
    dates.forEach(function (d) {
      var near = all.toLowerCase().slice(Math.max(0, d.index - 40), d.index + d.phrase.length + 25);
      var sent = sents.filter(function (s) { return s.toLowerCase().indexOf(d.phrase) >= 0; })[0] || "";
      var t = findTime(sent || near);
      var label = /\b(due|deadline|by|before|expire|expires|no later)\b/.test(near) ? "Deadline" : /\b(meet|meeting|call|appointment|summit|event)\b/.test(near) ? "Meeting / event" : "Mentioned date";
      if (!deadlines.some(function (x) { return x.date === d.date && x.label === label; }))
        deadlines.push({ label: label, date: d.date, time: t, phrase: d.phrase, context: trunc(deGreet(sent || d.phrase), 110) });
    });
    if (category === "General information") deadlines = [];
    var specific = deadlines.filter(function (d) { return !/^(next week|this week|end of (the |this )?week)$/.test(d.phrase); });
    if (specific.length) deadlines = specific;
    var byDate = {}; deadlines = deadlines.filter(function (d) { if (byDate[d.date]) { if (!byDate[d.date].time && d.time) byDate[d.date].time = d.time; if (d.label === "Deadline") byDate[d.date].label = "Deadline"; return false; } byDate[d.date] = d; return true; });
    deadlines.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    deadlines = deadlines.slice(0, 4);

    /* summary */
    var ranked = sents.map(function (s, i) {
      if (fluff(s)) return null;
      var sc = 1; if (REQ.test(s)) sc += 3; if (findDates(s, now).length) sc += 2; if (/\d/.test(s)) sc += 1; if (/\?/.test(s)) sc += 1;
      if (/\b(urgent|asap|deadline|due|need|problem|issue|interested|stopped|expire)/i.test(s)) sc += 1.5; if (s.length > 230) sc -= 1;
      return { s: s, i: i, sc: sc };
    }).filter(Boolean);
    var top = ranked.slice().sort(function (a, b) { return b.sc - a.sc; }).slice(0, 2).sort(function (a, b) { return a.i - b.i; });
    var core = top.map(function (x) { return deGreet(x.s); }).join(" ").replace(/\s+/g, " ");
    var lead = {
      "New lead": "New enquiry from " + who + (entities.organisations[0] ? " (" + entities.organisations[0] + ")" : "") + ". ",
      "Meeting": who + (intent.primary.id === "reschedule" ? " wants to reschedule. " : intent.primary.id === "confirm" ? " is confirming a meeting. " : intent.primary.id === "invite" ? " sent an event invitation. " : " wants to arrange a meeting. "),
      "Finance": intent.primary.id === "receipt" ? "Payment confirmation. " : "Finance: ",
      "Issue / complaint": who + " reports a problem. ",
      "Client request": who + " is requesting action. ",
      "Internal": "Internal update from " + who + ". ",
      "General information": ""
    }[category];
    var summary = category === "General information" && !core ? "Informational email: “" + trunc(cleanSubject(subject), 70) + "”." :
      category === "General information" ? "For information only — " + trunc(core || cleanSubject(subject), 200) :
      lead + trunc(core || cleanSubject(subject) + ".", 240);
    var shortSummary = trunc(summary, 120);

    /* calendar suggestion */
    var event = null, timeAll = findTime(all);
    var meetRe = category === "Client request" ? /\b(call me|call|catch[- ]up|meet (with )?(me|us|you)|zoom)\b/i : /\b(meet|meeting|call|catch|appointment|summit|event|workshop|session)/i;
    var meetSent = sents.filter(function (s) { return meetRe.test(s) && !/\bboard (meets|meeting)\b/i.test(s) && findDates(s, now).length; });
    var withTime = meetSent.filter(function (s) { return findTime(s); });
    if ((category === "Meeting" || category === "New lead" || category === "Client request" || intent.primary.id === "invite") && (withTime.length || meetSent.length)) {
      var src = (withTime[withTime.length - 1] || meetSent[meetSent.length - 1]);
      var ds = findDates(src, now).filter(function (d) { return daysFrom(d.date, now) >= 0; });
      if (ds.length) {
        var chosen = intent.primary.id === "reschedule" ? ds[ds.length - 1] : ds[0];
        event = { title: category === "New lead" ? "Discovery call — " + who : category === "Client request" ? "Call — " + who : (intent.primary.id === "invite" ? trunc(cleanSubject(subject), 56) : (intent.primary.id === "reschedule" ? "Rescheduled meeting with " : "Meeting with ") + who + (email.org ? ", " + email.org : "")),
          date: chosen.date, time: findTime(src) || timeAll || (/afternoon/i.test(src) ? "14:00" : /morning/i.test(src) ? "10:00" : "11:00"), kind: intent.primary.id === "invite" ? "event" : "meeting", proposed: false };
      }
    }
    if (!event && (category === "New lead" || (category === "Meeting" && requiresResponse))) {
      event = { title: (category === "New lead" ? "Discovery call — " : "Call — ") + who, date: iso(bizDays(now, 2)), time: "11:00", kind: "call", proposed: true };
    }

    /* follow-up */
    var followup = null;
    if (requiresResponse) followup = { date: priority === "Urgent" ? iso(addDays(now, 1)) : iso(bizDays(now, priority === "Important" ? 2 : 3)), note: "Check " + who + " has what they need" };

    /* recommended action */
    var action, actionType, sla;
    var due0 = tasks[0] && tasks[0].due ? fmt(tasks[0].due) : null;
    if (category === "General information") { action = "Archive — no action needed"; actionType = "archive"; sla = "None"; }
    else if (intent.primary.id === "receipt") { action = "File the receipt and mark the invoice as paid"; actionType = "file"; sla = "None"; }
    else if (category === "Issue / complaint") { action = "Acknowledge now, then investigate and update " + who + (due0 ? " by " + due0 : ""); actionType = "reply"; sla = "Within 1 hour"; }
    else if (category === "New lead") { action = "Reply today and offer " + who + " a discovery call"; actionType = "reply"; sla = "Within 2 hours"; }
    else if (intent.primary.id === "reschedule") { action = "Accept the new time" + (event ? " (" + fmt(event.date) + ", " + fmtTime(event.time) + ")" : "") + " and update the invite"; actionType = "calendar"; sla = "Today"; }
    else if (intent.primary.id === "confirm" && category === "Meeting") { action = "Add to calendar and send a short confirmation"; actionType = "calendar"; sla = "Today"; }
    else if (intent.primary.id === "invite") { action = "Decide whether to attend; hold the date as tentative"; actionType = "calendar"; sla = "This week"; }
    else if (category === "Meeting" && event && !event.proposed) { action = "Accept the proposed time (" + fmt(event.date) + ", " + fmtTime(event.time) + ") and send the invite"; actionType = "calendar"; sla = "Today"; }
    else if (category === "Meeting") { action = "Propose a time and send the invite"; actionType = "calendar"; sla = "Today"; }
    else if (intent.primary.id === "renewal") { action = "Renew before " + (earliest ? fmt(earliest.date) : "the expiry date") + " to avoid disruption"; actionType = "task"; sla = earliest ? fmt(earliest.date) : "This week"; }
    else if (category === "Finance") { action = "Schedule payment" + (due0 ? " before " + due0 : "") + " and acknowledge receipt"; actionType = "task"; sla = due0 || "This week"; }
    else if (category === "Internal" && !requiresResponse) { action = "Read when convenient — no reply required"; actionType = "read"; sla = "None"; }
    else { action = (priority === "Urgent" ? "Respond today: " : "Reply and ") + (tasks[0] ? lc(trunc(tasks[0].text, 64)) : "confirm next steps") + (due0 && priority !== "Urgent" ? " by " + due0 : ""); actionType = "reply"; sla = priority === "Urgent" ? "Today" : "Within 1 working day"; }

    var core2 = sents.filter(function (x) { return !fluff(x); }).join(" ");
    var sentiment = /\b(disappoint|frustrat|unhappy|unacceptable|angry|terrible|worst|complain)/i.test(core2) ? "Negative" :
      category === "Issue / complaint" ? "Concerned" :
      /\b(thanks for|thank you for|great|appreciate|pleased|happy|excited|love|wonderful|looking forward)/i.test(core2) ? "Positive" : "Neutral";

    return {
      engine: "demo", category: category, intent: intent.primary.label, intentId: intent.primary.id, confidence: intent.confidence, secondaryIntents: intent.secondary,
      priority: priority, score: Math.round(score * 10) / 10, reasons: reasons, requiresResponse: requiresResponse, sentiment: sentiment,
      summary: summary, shortSummary: shortSummary, entities: entities, deadlines: deadlines, tasks: tasks, event: event, followup: followup,
      action: action, actionType: actionType, responseTime: sla, firstName: first, who: who, keywords: hit
    };
  }
  function lc(s) { return s && /^[A-Z][a-z]/.test(s) && !/^(I|Google|Gmail|Monday|Tuesday|Wednesday|Thursday|Friday)\b/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s; }

  /* ---------------- Suggested responses ---------------- */
  function draft(email, a, tone, settings) {
    settings = settings || {};
    if (!a.requiresResponse) return "";
    var name = settings.yourName || "Naomi", biz = settings.businessName ? "\n" + settings.businessName : "";
    var first = a.firstName, topic = cleanSubject(email.subject).replace(/[?.!]+$/, "");
    var P = tone === "Formal", F = tone === "Friendly", B = tone === "Concise";
    var hi = first ? (P ? "Dear " + first + "," : "Hi " + first + ",") : (P ? "Dear Sir or Madam," : "Hello,");
    var due = a.tasks[0] && a.tasks[0].due ? fmt(a.tasks[0].due) : (a.followup ? fmt(a.followup.date) : "shortly");
    var ev = a.event, L = [];
    switch (a.category) {
      case "New lead":
        L.push(B ? "Thanks for getting in touch — yes, I can help with this." : F ? "Thank you so much for reaching out — this is exactly the kind of work I enjoy helping businesses with!" : "Thank you for your enquiry regarding " + lc(topic) + ". I would be glad to assist.");
        if (!B) L.push("The best next step is a short discovery call so I can understand your current process and recommend a suitable solution with a clear quote.");
        if (ev) L.push(B ? "Are you free " + fmt(ev.date) + " at " + fmtTime(ev.time) + "?" : "Would " + fmt(ev.date) + " at " + fmtTime(ev.time) + " suit you for a 30-minute call? If not, please suggest a time that works better.");
        break;
      case "Meeting":
        if (a.intentId === "invite") { L.push(B ? "Thanks for the invitation — I'll confirm my attendance by " + due + "." : "Thank you for the invitation. I've noted the date and will confirm my attendance by " + due + "."); break; }
        if (ev && !ev.proposed) {
          L.push(B ? fmt(ev.date) + " at " + fmtTime(ev.time) + " works for me." : F ? "No problem at all — " + fmt(ev.date) + " at " + fmtTime(ev.time) + " works perfectly for me." : "Thank you for your message. " + fmt(ev.date) + " at " + fmtTime(ev.time) + " suits me well.");
          if (!B) L.push(a.intentId === "confirm" ? "I look forward to seeing you then." : "I'll send an updated calendar invitation shortly.");
        } else L.push(B ? "Happy to meet — what times suit you?" : "Thank you for your message. I'd be happy to arrange a time to talk. Could you share two or three times that work for you this week?");
        break;
      case "Finance":
        L.push(B ? "Received, thank you — this is scheduled for " + due + "." : (F ? "Thanks for sending this through! " : "Thank you for your email. ") + "I've noted " + (a.entities.references[0] || "this") + " and it is scheduled to be processed by " + due + ".");
        if (!B && /remittance/i.test(email.body)) L.push("We will share the remittance advice once payment has been made.");
        break;
      case "Issue / complaint":
        L.push(B ? "Sorry about this — I'm looking into it now." : F ? "I'm really sorry about this, and thank you for flagging it so quickly. I'm looking into it right away." : "Thank you for letting me know, and please accept my apologies for the inconvenience. I am investigating the issue now.");
        if (!B) L.push("I'll update you by " + due + " with the cause and the fix.");
        break;
      default:
        L.push(B ? "Thanks — noted. I'll get back to you by " + due + "." : (F ? "Thanks for your message! " : "Thank you for your email regarding " + lc(topic) + ". ") + "I'll take care of this and get back to you by " + due + ".");
    }
    var commits = a.tasks.filter(function (t) { return !/^(reply to|offer|respond to|confirm new|call |investigate|process payment|renew)/i.test(t.text); });
    if (!B && commits.length && ["Client request", "Internal"].indexOf(a.category) >= 0) {
      L.push("To confirm, I will:\n" + commits.slice(0, 3).map(function (t) { return "• " + lc(t.text.replace(/\btheir\b/g, "your").replace(/\bthem\b/g, "you")) + (t.due ? " (by " + fmt(t.due) + ")" : ""); }).join("\n"));
    }
    return hi + "\n\n" + L.join("\n\n") + "\n\n" + (P ? "Kind regards," : F ? "Warm wishes," : "Thanks,") + "\n" + name + biz;
  }

  function followupDraft(item, settings) {
    settings = settings || {};
    var f = firstName(item.contact) || "there";
    return "Hi " + f + ",\n\nI hope you're well. I'm following up on " + lc(item.topic) + ". Have you had a chance to review it? I'm happy to answer any questions or adjust anything you need.\n\nLooking forward to hearing from you.\n\nKind regards,\n" + (settings.yourName || "Naomi");
  }

  root.DemoEngine = { analyze: analyze, draft: draft, followupDraft: followupDraft, fmt: fmt, fmtTime: fmtTime, rel: rel, iso: iso, fromIso: fromIso, addDays: addDays, bizDays: bizDays, daysFrom: daysFrom, cleanSubject: cleanSubject, esc: esc, CATEGORIES: CATEGORIES, findDates: findDates };
})(typeof window !== "undefined" ? window : globalThis);
