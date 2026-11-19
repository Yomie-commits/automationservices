/* Main site script — navigation, links from config, animations, forms */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var C = window.SITE_CONFIG || {};

  /* ---------- Links driven by config ---------- */
  function waLink(msg) {
    var n = String(C.whatsappNumber || "").replace(/\D/g, "");
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(msg || C.whatsappMessage || "");
  }
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa-msg"));
    a.target = "_blank"; a.rel = "noopener";
  });
  document.querySelectorAll("[data-email]").forEach(function (a) {
    if (C.email) a.href = "mailto:" + C.email;
  });
  document.querySelectorAll("[data-email-text]").forEach(function (el) { if (C.email) el.textContent = C.email; });
  document.querySelectorAll("[data-wa-text]").forEach(function (el) {
    var n = String(C.whatsappNumber || "").replace(/\D/g, "");
    el.textContent = n ? "+" + n.replace(/^(\d{3})(\d{3})(\d{3})(\d+)$/, "$1 $2 $3 $4") : "";
  });
  document.querySelectorAll("[data-linkedin]").forEach(function (a) {
    if (C.linkedin) { a.href = C.linkedin; a.target = "_blank"; a.rel = "noopener"; }
  });
  if (C.bookingUrl) {
    document.querySelectorAll("[data-book]").forEach(function (a) { a.href = C.bookingUrl; a.target = "_blank"; a.rel = "noopener"; });
  }
  if (C.liveDemoUrl) {
    document.querySelectorAll("[data-demo]").forEach(function (a) { a.href = C.liveDemoUrl; a.target = "_blank"; a.rel = "noopener"; });
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) { menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.focus(); }
    });
  }

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Reveal on scroll ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add("is-in"); }); }

  /* ---------- Pre-select from URL (?plan=, ?service=) ---------- */
  try {
    var params = new URLSearchParams(location.search);
    var plan = params.get("plan"), service = params.get("service");
    if (plan) document.querySelectorAll("select[name='package']").forEach(function (s) { s.value = plan; });
    if (service) {
      document.querySelectorAll("input[name='automation_needs'][value='" + service.replace(/'/g, "") + "']").forEach(function (c) { c.checked = true; });
    }
  } catch (e) { /* ignore */ }

  /* ---------- Forms ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(field, msg) {
    var wrap = field.closest(".field");
    if (!wrap) return;
    var err = wrap.querySelector(".err");
    if (msg) {
      wrap.classList.add("has-error");
      if (field.setAttribute) field.setAttribute("aria-invalid", "true");
      if (err) err.textContent = msg;
    } else {
      wrap.classList.remove("has-error");
      if (field.removeAttribute) field.removeAttribute("aria-invalid");
    }
  }

  function validate(form) {
    var firstBad = null;
    form.querySelectorAll("[required]").forEach(function (f) {
      var v = (f.type === "checkbox") ? f.checked : String(f.value || "").trim();
      var msg = "";
      if (!v) msg = f.getAttribute("data-msg") || "This field is required.";
      else if (f.type === "email" && !EMAIL_RE.test(f.value.trim())) msg = "Please enter a valid email address.";
      setError(f, msg);
      if (msg && !firstBad) firstBad = f;
    });
    form.querySelectorAll("[data-required-group]").forEach(function (group) {
      var checked = group.querySelectorAll("input:checked").length > 0;
      var wrap = group.closest(".field");
      if (!checked) { wrap.classList.add("has-error"); if (!firstBad) firstBad = group.querySelector("input"); }
      else wrap.classList.remove("has-error");
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function status(form, type, html) {
    var box = form.querySelector(".form-status");
    if (!box) return;
    box.className = "form-status form-status--" + type + " is-visible";
    box.innerHTML = html;
  }

  function fallbackHtml() {
    return ' Please reach out directly on <a href="' + waLink() + '" target="_blank" rel="noopener">WhatsApp</a>' +
      (C.email ? ' or email <a href="mailto:' + C.email + '">' + C.email + "</a>" : "") + ".";
  }

  function send(form) {
    /* Merge repeated keys (checkbox groups) into one comma-separated value */
    var raw = new FormData(form), merged = {}, order = [];
    raw.forEach(function (v, k) {
      if (!(k in merged)) { merged[k] = []; order.push(k); }
      merged[k].push(v);
    });
    var data = new FormData();
    order.forEach(function (k) { data.append(k, merged[k].join(", ")); });
    var provider = (C.formProvider || "netlify").toLowerCase();
    data.append("_subject", "New website enquiry — " + (form.getAttribute("name") || "form"));

    if (provider === "formspree") {
      if (!C.formspreeEndpoint) return Promise.reject(new Error("config"));
      return fetch(C.formspreeEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
    }
    if (provider === "formsubmit") {
      if (!C.email || /yourdomain/.test(C.email)) return Promise.reject(new Error("config"));
      data.append("_template", "table");
      data.append("_captcha", "false");
      return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(C.email), { method: "POST", body: data, headers: { Accept: "application/json" } });
    }
    /* Netlify Forms (AJAX submission) */
    var body = new URLSearchParams();
    data.forEach(function (v, k) { if (k !== "_subject") body.append(k, v); });
    return fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
  }

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("input", function (e) {
      if (e.target.closest(".field.has-error")) setError(e.target, "");
      var g = e.target.closest("[data-required-group]");
      if (g && g.querySelector("input:checked")) g.closest(".field").classList.remove("has-error");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) { status(form, "err", "Please complete the highlighted fields."); return; }
      if (form.querySelector("[name='bot-field']") && form.querySelector("[name='bot-field']").value) return; /* spam trap */

      if (location.protocol === "file:") {
        status(form, "info", "<strong>Preview mode:</strong> the form is valid. Submissions are delivered once the site is deployed (see README).");
        return;
      }
      var btn = form.querySelector("[type='submit']");
      var label = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending…'; }

      send(form).then(function (res) {
        if (!res.ok) throw new Error("http " + res.status);
        form.reset();
        var next = form.getAttribute("data-success") || "thank-you.html";
        window.location.href = next;
      }).catch(function (err) {
        var cfg = err && err.message === "config";
        status(form, "err", (cfg
          ? "<strong>Form not configured yet.</strong> The site owner needs to finish the form setup in assets/js/config.js."
          : "<strong>Sorry — your message could not be sent right now.</strong>") + fallbackHtml());
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
      });
    });
  });
})();
