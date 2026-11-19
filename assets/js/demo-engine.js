/* =========================================================
   Demo analysis engine
   A transparent, rules-based stand-in for the AI step so the
   demo works on any static host with no API keys. The real
   system uses an AI language model for this step.
   ========================================================= */
(function (global) {
  "use strict";

  var DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  var DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  var MONTH_LABEL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------------- Date helpers ---------------- */
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function addDays(d, n) { var x = startOfDay(d); x.setDate(x.getDate() + n); return x; }
  function ymd(d) { var x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); }
  function fromYmd(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function nextDow(base, dow, strictlyNext) {
    var b = startOfDay(base); var diff = (dow - b.getDay() + 7) % 7;
    if (diff === 0) diff = 7;
    if (strictlyNext && diff < 7 && false) diff += 7;
    return addDays(b, diff);
  }
  function label(s) { var d = typeof s === "string" ? fromYmd(s) : s; return DOW_SHORT[d.getDay()] + " " + d.getDate() + " " + MONTH_LABEL[d.getMonth()]; }
  function friendlyDay(s, today) {
    var d = typeof s === "string" ? fromYmd(s) : s; var t = startOfDay(today || new Date());
    var diff = Math.round((startOfDay(d) - t) / 864e5);
    if (diff === 0) return "today";
    if (diff === 1) return "tomorrow";
    if (diff > 1 && diff < 7) return DAY_NAMES[d.getDay()].replace(/^./, function (c) { return c.toUpperCase(); });
    return label(d);
  }
  function time12(t) {
    if (!t) return "";
    var h = +t.slice(0, 2), m = t.slice(3, 5);
    var ap = h >= 12 ? "pm" : "am"; var h12 = h % 12 || 12;
    return h12 + (m !== "00" ? ":" + m : "") + " " + ap;
  }
  function weekday(d) { var x = d.getDay(); return x !== 0 && x !== 6; }

  /* ---------------- Text helpers ---------------- */
  function splitSentences(text) {
    return String(text).replace(/\r/g, "").split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean)
      .reduce(function (acc, line) {
        var parts = line.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [line];
        parts.forEach(function (p) { p = p.trim(); if (p) acc.push(p); });
        return acc;
      }, []);
  }
  var GREETING = /^(hi|hello|hey|dear|good (morning|afternoon|evening)|greetings)\b[^.!?,]*[,!.]?\s*/i;
  var SIGNOFF = /^(thanks|thank you|many thanks|regards|best|kind regards|warm regards|best regards|cheers|sincerely|yours)\b[\s\S]{0,30}$/i;
  function isNoise(s, fromName) {
    var t = s.trim();
    if (t.length < 3) return true;
    if (SIGNOFF.test(t)) return true;
    if (/^(hi|hello|hey|dear|good (morning|afternoon|evening))\b[^.!?]{0,40}[,!]?$/i.test(t)) return true;
    var first = (fromName || "").split(/\s+/)[0];
    if (first && t.toLowerCase().indexOf(first.toLowerCase()) === 0 && t.split(/\s+/).length <= 4) return true;
    if (t.split(/\s+/).length <= 3 && !/[?]/.test(t)) return true;
    return false;
  }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function lowerFirst(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  function trunc(s, n) { return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; }
  function isOrg(n) { return /\b(accounts?|team|ltd|limited|inc|supplies|support|info|admin|company|co\.|services|newsletter|weekly|hr|office|department|desk)\b/i.test(n || ""); }
  function firstName(n) { return String(n || "there").trim().split(/\s+/)[0].replace(/[^A-Za-z'\-]/g, "") || "there"; }

  /* ---------------- Date & time extraction ---------------- */
  function findTime(s) {
    var m;
    if (/\bnoon|midday\b/i.test(s)) return "12:00";
    if ((m = s.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)/i))) {
      var h = +m[1] % 12; if (/p/i.test(m[3])) h += 12; return String(h).padStart(2, "0") + ":" + (m[2] || "00");
    }
    if ((m = s.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\s*(hrs|h)?\b/))) return String(+m[1]).padStart(2, "0") + ":" + m[2];
    if ((m = s.match(/\bat\s+(\d{1,2})\b(?!\s*(%|percent|people|staff|days?|weeks?|st|nd|rd|th))/i))) {
      var hh = +m[1]; if (hh >= 1 && hh <= 12) { if (hh < 8) hh += 12; return String(hh).padStart(2, "0") + ":00"; }
    }
    if (/\bmorning\b/i.test(s)) return "10:00";
    if (/\bafternoon\b/i.test(s)) return "14:00";
    if (/\bevening\b/i.test(s)) return "17:00";
    return null;
  }
  function findDate(s, today) {
    var t = s.toLowerCase(), m;
    if (/\bday after tomorrow\b/.test(t)) return { date: addDays(today, 2), phrase: "day after tomorrow" };
    if (/\btomorrow\b/.test(t)) return { date: addDays(today, 1), phrase: "tomorrow" };
    if (/\b(today|tonight|this (morning|afternoon|evening)|end of (the )?day|eod|close of business|cob)\b/.test(t)) return { date: startOfDay(today), phrase: "today" };
    if ((m = t.match(/\b(next |this |on |by |before |until )?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/))) {
      var dow = DAY_NAMES.indexOf(m[2]), d = nextDow(today, dow);
      if ((m[1] || "").trim() === "next") { var nextMon = nextDow(today, 1); if (d < nextMon) d = addDays(d, 7); }
      if (dow === startOfDay(today).getDay() && /\b(this week|today|this afternoon|this morning)\b/.test(t) && (m[1] || "").trim() !== "next") d = startOfDay(today);
      return { date: d, phrase: (m[1] || "") + m[2] };
    }
    if ((m = t.match(/\b(\d{1,2})(st|nd|rd|th)?\s+(of\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/))) return mk(+m[1], MONTHS.indexOf(m[4]), m[0]);
    if ((m = t.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})(st|nd|rd|th)?\b/))) return mk(+m[2], MONTHS.indexOf(m[1]), m[0]);
    if ((m = t.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/))) { if (+m[2] >= 1 && +m[2] <= 12) return mk(+m[1], +m[2] - 1, m[0]); }
    if (/\bnext week\b/.test(t)) return { date: nextDow(addDays(today, 0), 1), phrase: "next week" };
    if (/\b(end of (the )?week|this week)\b/.test(t)) { var f = nextDow(addDays(today, -1), 5); return { date: f, phrase: "this week" }; }
    return null;
    function mk(day, mon, phrase) {
      var y = today.getFullYear(); var d = new Date(y, mon, day);
      if (d < addDays(today, -1)) d = new Date(y + 1, mon, day);
      return { date: d, phrase: phrase };
    }
  }

  /* ---------------- Classification ---------------- */
  var CATS = {
    "Newsletter / marketing": [/\bunsubscribe\b/, /\bnewsletter\b/, /\bweekly (roundup|digest)\b/, /\b(promo|promotion|exclusive offer|offers|discount|% off|sale)\b/, /\bwebinar\b/, /\bno-?reply\b/],
    "Complaint / issue": [/\b(complain|complaint|disappointed|unhappy|frustrat|unacceptable|refund|not working|broken|faulty|wrong|delay(ed)?|late|issue|problem|error|still (have|haven't|not))\b/],
    "Invoice / finance": [/\binvoice\b/, /\bpayment\b/, /\bremittance\b/, /\breceipt\b/, /\bbilling\b/, /\b(paid|pay|overdue|statement)\b/, /\binv[-\s]?\d+/],
    "New lead / enquiry": [/\b(enquiry|inquiry|enquire|interested in|how much|pricing|price|cost|rates?|your services|do you offer|would like to know|quotation|set up an automation|automate)\b/],
    "Meeting / scheduling": [/\bmeeting\b/, /\b(reschedule|move (our|the)|postpone)\b/, /\b(call|zoom|google meet|teams)\b/, /\b(appointment|catch up|catch-up|available|availability|calendar|slot)\b/],
    "Sales follow-up": [/\bproposal\b/, /\bfollow(ing)?[- ]up\b/, /^re:/, /\bcontract\b/, /\bdecision\b/],
    "Client request": [/\b(could you|can you|please|kindly|we need|i need|need you to|send|confirm|update|revised|quote)\b/],
    "Internal / team": [/\b(team|staff|colleague|report|weekly report|leave|hr|internal)\b/]
  };
  var CAT_ORDER = Object.keys(CATS);

  function classify(text, subject) {
    var t = (subject + " \n " + text).toLowerCase(), best = "General / FYI", bestScore = 0, scores = {};
    CAT_ORDER.forEach(function (c, i) {
      var s = 0; CATS[c].forEach(function (re) { var m = t.match(new RegExp(re.source, "g")); if (m) s += m.length; });
      if (/^re:/i.test(subject) && c === "Sales follow-up") s += 1;
      if (c === "Client request") s *= 0.6;
      if (c === "Internal / team") s *= 0.5;
      if (c === "Newsletter / marketing" && s) s += 2;
      scores[c] = s;
      if (s > bestScore + 0.001) { best = c; bestScore = s; }
    });
    return { category: best, scores: scores };
  }

  var SIGNALS = [
    { re: /\b(urgent|urgently|asap|as soon as possible|immediately|emergency|critical|right away)\b/gi, w: 3, why: "urgent language" },
    { re: /\b(deadline|overdue|final notice|last chance|due (today|tomorrow))\b/gi, w: 3, why: "deadline mentioned" },
    { re: /\b(today|tonight|end of (the )?day|eod|close of business)\b/gi, w: 2, why: "needed today" },
    { re: /\btomorrow\b/gi, w: 2, why: "needed tomorrow" },
    { re: /\b(this week|by (monday|tuesday|wednesday|thursday|friday))\b/gi, w: 1, why: "due this week" },
    { re: /\b(complain|complaint|disappointed|unhappy|frustrated|unacceptable|refund|cancel(ling|lation)?|not working|faulty)\b/gi, w: 2, why: "unhappy customer" },
    { re: /\b(invoice|payment|quote|quotation|proposal|contract|kes|ksh|usd|\$)\b/gi, w: 1, why: "money / deal involved" },
    { re: /\b(board|ceo|director|client)\b/gi, w: 1, why: "senior stakeholder or client" }
  ];
  var LOW_SIGNALS = /\b(unsubscribe|newsletter|webinar|promotion|exclusive offer|no-?reply|weekly roundup|digest)\b/gi;

  function prioritise(text, subject, fromName, fromEmail, settings, category) {
    var full = subject + " \n " + text, score = 0, reasons = [], words = [];
    SIGNALS.forEach(function (s) {
      var m = full.match(s.re);
      if (m) { score += Math.min(m.length, 2) * s.w; reasons.push(s.why); m.forEach(function (w) { words.push(w); }); }
    });
    var q = (text.match(/\?/g) || []).length; if (q) { score += 1; reasons.push("asks " + (q > 1 ? q + " questions" : "a question")); }
    var vip = String(settings && settings.vip || "").toLowerCase().split(/[,;\n]/).map(function (x) { return x.trim(); }).filter(Boolean);
    var who = (fromName + " " + fromEmail).toLowerCase();
    if (vip.some(function (v) { return who.indexOf(v) !== -1; })) { score += 4; reasons.unshift("VIP sender"); }
    var low = full.match(LOW_SIGNALS); if (low) { score -= 6; reasons = ["marketing / newsletter content"]; low.forEach(function (w) { words.push(w); }); }
    if (category === "New lead / enquiry") { score += 2; reasons.push("potential new business"); }
    if (category === "Meeting / scheduling") { score += 2; reasons.push("affects your calendar"); }
    var p = score >= 6 ? "High" : score >= 2 ? "Medium" : "Low";
    return { priority: p, score: score, reasons: uniq(reasons), words: uniq(words.map(function (w) { return w.toLowerCase(); })) };
  }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

  /* ---------------- Tasks ---------------- */
  var REQ = /\b(can you|could you|would you|will you|can we|could we|please|kindly|i need|we need|need you to|let me know|let us know|get back to me|call me|send (me|us)|confirm|share)\b/i;
  var SKIP = /\b(please find attached|please see attached|please note|feel free|don't hesitate|do not hesitate)\b/i;

  function toTask(s) {
    var t = s.replace(GREETING, "");
    var m = t.match(/\b(can you|could you|would you|will you|can we|could we|please|kindly|need you to|i need|we need|let me know|let us know|call me|get back to me)\b/i);
    if (m) {
      var verb = m[1].toLowerCase(); var rest = t.slice(m.index + m[0].length).trim();
      if (verb === "let me know" || verb === "let us know") rest = "confirm " + rest;
      else if (verb === "call me") rest = "call " + "them " + rest;
      else if (verb === "get back to me") rest = "reply " + rest;
      else if (verb === "i need" || verb === "we need") rest = (/^(to)\b/i.test(rest) ? rest.replace(/^to\s+/i, "") : "provide " + rest);
      t = rest;
    }
    t = t.replace(/^(also|and|so|but|then|just)[,\s]+/i, "").replace(/^(please|kindly)[,\s]+/i, "").replace(/^(also|just)\s+/i, "");
    t = t.replace(/\s+(for me|for us)\b/gi, "").replace(/\byour\b/gi, "your").replace(/\bme\b/g, "them").replace(/\bus\b/g, "them").replace(/\bmy\b/g, "their").replace(/\bour\b/g, "their");
    t = t.replace(/\s+or (i|we) (would|will|'ll)\b.*$/i, "").replace(/[?.!]+$/, "").replace(/,\s*$/, "").trim();
    if (t.split(/\s+/).length < 2) return null;
    return trunc(cap(t), 110);
  }

  function extractTasks(sentences, category, today, ctx) {
    var tasks = [];
    sentences.forEach(function (s) {
      if (!REQ.test(s) || SKIP.test(s) && !/kindly|could you|can you/i.test(s.replace(SKIP, ""))) return;
      var clean = s.replace(SKIP, "");
      if (!REQ.test(clean)) return;
      var task = toTask(clean); if (!task) return;
      var d = findDate(s, today), tm = findTime(s);
      tasks.push({ text: task, due: d ? ymd(d.date) : null, time: tm });
    });
    if (category === "Invoice / finance" && /\b((sent|made|received|processed|completed) (the )?payment|payment (has been |was )?(sent|made|received|processed|completed)|paid (the )?invoice)\b/i.test(ctx.full)) {
      tasks.unshift({ text: "Confirm receipt of payment and update records", due: ctx.firstDate || ymd(addDays(today, 1)), time: null });
    } else if (category === "Invoice / finance") {
      var ref = (ctx.full.match(/\b(INV[-\s]?\d+|invoice\s*(no\.?|number|#)\s*[\w-]+)/i) || [])[0];
      var amt = (ctx.full.match(/\b(KES|Ksh|KSh|USD|US\$|\$)\s?[\d,]+(\.\d+)?/i) || [])[0];
      if (!tasks.some(function (t) { return /\bpay|payment\b/i.test(t.text); }))
        tasks.unshift({ text: "Approve and pay " + (ref ? "invoice " + ref.toUpperCase().replace(/^INVOICE\s*/, "") : "the invoice") + (amt ? " (" + amt + ")" : ""), due: ctx.firstDate, time: null });
    }
    if (category === "New lead / enquiry" && !tasks.length) {
      tasks.push({ text: "Reply with a service overview and pricing guide", due: ymd(today), time: null });
      tasks.push({ text: "Offer a short discovery call", due: ymd(today), time: null });
    }
    if (category === "Complaint / issue" && !tasks.some(function (t) { return /investigat|resolve|fix/i.test(t.text); }))
      tasks.unshift({ text: "Investigate the issue and agree a resolution", due: ymd(today), time: null });
    if (category === "Meeting / scheduling") {
      var other = tasks.filter(function (t) { return !MEET_RE.test(t.text) && !/\b(move|reschedule|what works|time works|availability|available)\b/i.test(t.text); });
      tasks = other.concat([{ text: "Reply to confirm the meeting time", due: ymd(today), time: null }, { text: "Update the calendar invite", due: ymd(today), time: null }]);
    }
    var seen = {}; tasks = tasks.filter(function (t) { var k = t.text.toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; });
    tasks.forEach(function (t) { if (!t.due) t.due = ctx.defaultDue; });
    return tasks.slice(0, 4);
  }

  /* ---------------- Summary ---------------- */
  var LEADS = {
    "Client request": "Client request", "New lead / enquiry": "New enquiry", "Meeting / scheduling": "Scheduling",
    "Invoice / finance": "Finance", "Complaint / issue": "Complaint", "Sales follow-up": "Follow-up",
    "Internal / team": "Internal", "General / FYI": "FYI", "Newsletter / marketing": "Newsletter"
  };
  function summarise(sentences, category, fromName, subject) {
    if (category === "Newsletter / marketing") return "Newsletter or marketing email from " + fromName + ". No action required — suggested action: archive.";
    var content = sentences.map(function (s, i) { return { s: s.replace(GREETING, ""), i: i }; }).filter(function (o) { return !isNoise(o.s, fromName) && !SKIP.test(o.s) || REQ.test(o.s); });
    if (!content.length) return LEADS[category] + ": " + subject;
    content.forEach(function (o, k) {
      var sc = 0;
      if (REQ.test(o.s)) sc += 2;
      if (findDate(o.s, new Date()) || findTime(o.s)) sc += 2;
      if (/\d/.test(o.s)) sc += 1;
      if (/\?/.test(o.s)) sc += 1;
      if (k === 0) sc += 1.5;
      if (o.s.length < 25) sc -= 1;
      o.sc = sc;
    });
    var top = content.slice().sort(function (a, b) { return b.sc - a.sc; }).slice(0, 2).sort(function (a, b) { return a.i - b.i; });
    var body = top.map(function (o) { return o.s.replace(/\s+/g, " ").trim(); }).join(" ");
    return LEADS[category] + " from " + (isOrg(fromName) ? fromName : firstName(fromName)) + ": " + trunc(body, 260);
  }

  /* ---------------- Sentiment ---------------- */
  function sentiment(text) {
    var neg = (text.match(/\b(disappointed|unhappy|frustrat\w*|angry|unacceptable|poor|bad|worst|complain\w*|refund|delay\w*|problem|issue|wrong|not working)\b/gi) || []).length;
    var pos = (text.match(/\b(thanks|thank you|great|appreciate\w*|pleased|happy|excellent|wonderful|love|glad)\b/gi) || []).length;
    if (neg >= 2 && neg > pos) return "Negative";
    if (neg > pos) return "Slightly negative";
    if (pos > neg) return "Positive";
    return "Neutral";
  }

  /* ---------------- Calendar ---------------- */
  function overlaps(events, date, time, dur) {
    var s = toMin(time), e = s + (dur || 60);
    return events.filter(function (ev) { return ev.date === date && ev.status !== "dismissed"; }).some(function (ev) {
      var es = toMin(ev.time), ee = es + (ev.dur || 60); return s < ee && es < e;
    });
  }
  function toMin(t) { return (+t.slice(0, 2)) * 60 + (+t.slice(3, 5)); }
  function fromMin(m) { return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); }
  function findFree(events, dateStr, time, today) {
    var d = fromYmd(dateStr);
    for (var day = 0; day < 10; day++) {
      var cur = addDays(d, day); if (!weekday(cur)) continue;
      var ds = ymd(cur);
      var start = day === 0 ? toMin(time) : 9 * 60;
      for (var m = start; m <= 16 * 60; m += 60) {
        if (cur.getTime() === startOfDay(today).getTime() && m <= new Date().getHours() * 60) continue;
        if (!overlaps(events, ds, fromMin(m), 60)) return { date: ds, time: fromMin(m) };
      }
    }
    return { date: dateStr, time: time };
  }

  var MEET_RE = /\b(meeting|meet|call|zoom|google meet|catch[- ]up|appointment|discuss|session|interview|visit|panel|forum|workshop|event)\b/i;
  function detectMeeting(sentences, category, fromName, subject, events, today) {
    if (category === "Newsletter / marketing") return null;
    var cand = null;
    var schedCat = /Meeting|New lead|Sales follow-up/.test(category);
    sentences.forEach(function (s0, i) {
      var asks = /\b(can|could|shall|would|will|are) (we|you)\b[^.?!]*\b(meet|call|catch|talk|discuss|zoom|available)/i.test(s0) || /\b(call me|let's meet|lets meet|meet up|invited|invitation)\b/i.test(s0);
      if (!(schedCat && MEET_RE.test(s0)) && !asks && !(category === "Meeting / scheduling")) return;
      var s = s0 + " " + (sentences[i + 1] && !MEET_RE.test(sentences[i + 1]) ? sentences[i + 1] : "");
      var d = findDate(s, today), t = findTime(s);
      if (!d && !t) return;
      var score = (d ? 1 : 0) + (t ? 1 : 0) + (MEET_RE.test(s) ? 1 : 0);
      if (!cand || score > cand.score) cand = { d: d, t: t, s: s0, score: score };
    });
    if (!cand) {
      if (category === "Meeting / scheduling" || (category === "New lead / enquiry")) cand = { d: null, t: null, s: "", score: 0, proposed: true };
      else return null;
    }
    var date = cand.d ? ymd(cand.d.date) : ymd(nextWeekday(addDays(today, 1)));
    var time = cand.t || (category === "New lead / enquiry" ? "11:00" : "10:00");
    var kind = /\b(panel|forum|workshop|event|invit)/i.test(cand.s + subject) ? "Event" : /\bcall\b/i.test(cand.s + subject) ? "Call" : category === "New lead / enquiry" ? "Discovery call" : "Meeting";
    var title = kind + " with " + fromName;
    var now = new Date(), passed = date < ymd(now) || (date === ymd(now) && toMin(time) <= now.getHours() * 60 + now.getMinutes());
    var conflict = !passed && overlaps(events, date, time, 60);
    var alt = null;
    if (conflict) alt = findFree(events, date, time, today);
    else if (passed) {
      var late = now.getHours() >= 16;
      alt = findFree(events, ymd(late ? addDays(now, 1) : now), late ? "09:00" : fromMin(Math.max(9 * 60, (now.getHours() + 1) * 60)), today);
    }
    return { title: title, date: date, time: time, conflict: conflict, passed: passed, alt: alt, requested: !cand.proposed, phrase: cand.s };
  }
  function nextWeekday(d) { var x = startOfDay(d); while (!weekday(x)) x = addDays(x, 1); return x; }

  /* ---------------- Draft reply ---------------- */
  function draftReply(a, email, settings) {
    if (a.category === "Newsletter / marketing") return "";
    var tone = settings.tone || "friendly", org = isOrg(email.fromName), name = firstName(email.fromName);
    var sig = (settings.name || "Your name") + (settings.business ? "\n" + settings.business : "");
    var L = [];
    var greet = org ? (tone === "formal" ? "Dear " + email.fromName + "," : "Hello,") : (tone === "formal" ? "Dear " + name + "," : "Hi " + name + ",");
    var close = tone === "formal" ? "Kind regards," : tone === "brief" ? "Thanks," : "Best regards,";
    var mt = a.meeting, slot = mt ? (mt.alt ? mt.alt : { date: mt.date, time: mt.time }) : null;
    var when = slot ? friendlyDay(slot.date) + (/^(today|tomorrow)$/.test(friendlyDay(slot.date)) ? "" : " (" + label(slot.date) + ")") + " at " + time12(slot.time) : "";

    function commits(max) {
      return a.tasks.filter(function (t) { return !/^(reply|call them|offer|investigate)/i.test(t.text); }).slice(0, max).map(function (t) {
        var txt = lowerFirst(t.text.replace(/\s*\(.*\)$/, "")).replace(/^approve and pay/, "process payment for");
        var due = /\b(once|when|after|today|tomorrow|this week|by)\b/i.test(txt) || !t.due ? "" : " by " + friendlyDay(t.due) + (t.time ? " at " + time12(t.time) : "");
        return "I'll " + txt + due + ".";
      });
    }

    switch (a.category) {
      case "Complaint / issue":
        L.push(tone === "formal" ? "Thank you for bringing this to my attention, and I apologise for the inconvenience this has caused." : "I'm really sorry about this, and thank you for letting me know.");
        if (tone !== "brief") L.push("I'm looking into it now and will update you with a clear resolution as soon as possible" + (a.followup ? ", no later than " + friendlyDay(a.followup) : "") + ".");
        break;
      case "New lead / enquiry":
        L.push(tone === "formal" ? "Thank you for your enquiry and for your interest in my services." : "Thanks for getting in touch — this is exactly the kind of work I help businesses with.");
        if (mt && mt.requested && !mt.conflict && !mt.passed) L.push((tone === "formal" ? "I would be glad to speak with you " : "A call ") + when + (tone === "formal" ? " — I have reserved that time." : " works for me — I'll send a calendar invite.") + (tone === "brief" ? "" : " I'll walk you through how it could work for you and the likely cost."));
        else if (when) L.push((mt && mt.requested ? "That time isn't available, but " : "") + (tone === "brief" ? "Could we have a quick call " : "Would you be available for a short discovery call ") + when + "? " + (tone === "brief" ? "" : "I'll walk you through how it could work for you and the likely cost."));
        break;
      case "Meeting / scheduling":
        if (mt && mt.passed && mt.alt) L.push("That time has already passed, but " + when + " is free. Would that work for you?");
        else if (mt && mt.conflict && mt.alt) L.push("Unfortunately I'm already booked " + friendlyDay(mt.date) + " at " + time12(mt.time) + ", but " + (mt.alt.date === mt.date ? time12(mt.alt.time) + " the same day" : when) + " is free. Would that work for you?");
        else if (mt) L.push((tone === "formal" ? "That works for me — I can confirm " : "No problem at all — ") + when + (tone === "formal" ? "." : " works for me.") + (tone === "brief" ? "" : " I'll send a calendar invite."));
        else L.push("Thanks for your message — let me check my calendar and confirm a time shortly.");
        break;
      case "Invoice / finance":
        L.push(tone === "formal" ? "Thank you — your invoice has been received." : "Thanks — invoice received.");
        commits(2).forEach(function (c) { L.push(c); });

        break;
      case "Sales follow-up":
        L.push(tone === "formal" ? "Thank you for following up and for taking the time to review the proposal." : "Thanks for following up — glad you've had a chance to review the proposal.");
        if (mt && mt.requested && !mt.conflict && !mt.passed) L.push("I'd be happy to talk it through — " + when + " works for me.");
        else if (when) L.push("I'd be happy to talk it through. Would " + when + " suit you for a call?");
        break;
      default:
        L.push(tone === "formal" ? "Thank you for your message." : "Thanks for your message.");
        var c = commits(tone === "brief" ? 1 : 3); c.forEach(function (x) { L.push(x); });
        if (!c.length) L.push("I'll review this and come back to you " + (a.followup ? "by " + friendlyDay(a.followup) : "shortly") + ".");
        if (mt && when && tone !== "brief") L.push("I can also make " + when + " if you'd like to talk it through.");
    }
    return greet + "\n\n" + L.join(tone === "brief" ? " " : "\n\n") + "\n\n" + close + "\n" + sig;
  }

  /* ---------------- Main ---------------- */
  function analyse(email, ctx) {
    var today = ctx.today || new Date(), settings = ctx.settings || {}, events = ctx.events || [];
    var body = String(email.body || ""), subject = String(email.subject || "");
    var sentences = splitSentences(body);
    var cls = classify(body, subject);
    var cat = cls.category;
    var pr = prioritise(body, subject, email.fromName || "", email.fromEmail || "", settings, cat);
    var dates = [];
    sentences.concat([subject]).forEach(function (s) { var d = findDate(s, today); if (d) dates.push({ date: ymd(d.date), time: findTime(s), phrase: d.phrase }); });
    var firstDate = dates.length ? dates.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; })[0].date : null;
    var defaultDue = firstDate || (pr.priority === "High" ? ymd(addDays(today, 1)) : pr.priority === "Medium" ? ymd(nextWeekday(addDays(today, 2))) : null);
    var tasks = cat === "Newsletter / marketing" ? [] : extractTasks((sentences.some(function (x) { return REQ.test(x); }) || !/\?$/.test(subject)) ? sentences : sentences.concat([subject]), cat, today, { full: subject + " " + body, firstDate: firstDate || defaultDue, defaultDue: defaultDue });
    var followup = cat === "Newsletter / marketing" ? null : ymd(pr.priority === "High" ? addDays(today, 1) : pr.priority === "Medium" ? nextWeekday(addDays(today, 3)) : nextWeekday(addDays(today, 7)));
    if (firstDate && firstDate < followup && firstDate >= ymd(today)) followup = firstDate;
    var meeting = detectMeeting(sentences.concat([subject]), cat, email.fromName || "Contact", subject, events, today);
    var a = {
      category: cat, priority: pr.priority, score: pr.score, reasons: pr.reasons, signalWords: pr.words,
      sentiment: sentiment(sentences.filter(function (x) { return !isNoise(x, email.fromName); }).join(" ")), summary: summarise(sentences, cat, email.fromName || "the sender", subject),
      tasks: tasks, dates: dates, followup: followup, meeting: meeting,
      suggestedAction: cat === "Newsletter / marketing" ? "Archive" : pr.priority === "High" ? "Reply today" : "Reply within 1 working day"
    };
    a.draft = draftReply(a, email, settings);
    return a;
  }

  global.DemoEngine = {
    analyse: analyse, draftReply: draftReply, label: label, friendlyDay: friendlyDay, time12: time12,
    ymd: ymd, fromYmd: fromYmd, addDays: addDays, nextDow: nextDow, overlaps: overlaps, findFree: findFree, startOfDay: startOfDay
  };
})(window);
