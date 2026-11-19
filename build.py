#!/usr/bin/env python3
"""
Static site generator for the AI Automation Services website.

You do NOT need to run this to use the site — the generated .html files are
already included. Run it only if you want to change shared parts (header,
footer, SEO settings) across every page at once:

    python3 build.py

Settings you are most likely to change are at the top of this file.
Contact details (WhatsApp, email, LinkedIn, form delivery) live in
assets/js/config.js and do not require a rebuild.
"""
import json, os, datetime

# ------------------------------------------------------------------ SETTINGS
SITE_URL = "https://yomie-commits.github.io/ai-automation-services"   # <-- your live domain, no trailing slash
BRAND = "Naomi Mwangi"
BRAND_TAG = "AI Automation Services"
INITIALS = "NM"
CITY = "Nairobi, Kenya"
OUT = os.path.dirname(os.path.abspath(__file__))
# ---------------------------------------------------------------------------

ICONS = {
  "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  "check": '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  "bot": '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M8 4h8"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="14" r="1.2"/>',
  "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  "cog": '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  "cal": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  "puzzle": '<path d="M19.4 13.5a2.5 2.5 0 1 0 0-3H18V7a1 1 0 0 0-1-1h-3.5V4.6a2.5 2.5 0 1 0-3 0V6H7a1 1 0 0 0-1 1v3.5h1.4a2.5 2.5 0 1 1 0 3H6V17a1 1 0 0 0 1 1h3.5v-1.4a2.5 2.5 0 1 1 3 0V18H17a1 1 0 0 0 1-1v-3.5z"/>',
  "sheet": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
  "zap": '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
  "brain": '<path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.3A3 3 0 0 0 4.5 8a3 3 0 0 0-.5 5.4A3 3 0 0 0 7 18a2.5 2.5 0 0 0 5 .5V4.5A2.5 2.5 0 0 0 9.5 2zM14.5 2A2.5 2.5 0 0 1 17 4.5v.3A3 3 0 0 1 19.5 8a3 3 0 0 1 .5 5.4A3 3 0 0 1 17 18a2.5 2.5 0 0 1-5 .5"/>',
  "hand": '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"/>',
  "clock": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  "eye": '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
  "trend": '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  "repeat": '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  "inbox": '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  "list": '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  "flag": '<path d="M4 22V4m0 0h13l-2 4 2 4H4"/>',
  "pen": '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  "bell": '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  "alert": '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  "spark": '<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z"/><path d="M19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7z"/>',
  "layers": '<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  "briefcase": '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  "megaphone": '<path d="M3 11l18-8v18L3 13z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  "home": '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  "scale": '<path d="M12 3v18M5 21h14M3 7h18M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z"/>',
  "heart": '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  "book": '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  "globe": '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  "cart": '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  "search": '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
  "tool": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
  "plug": '<path d="M12 22v-5M9 8V2M15 8V2M18 8v5a6 6 0 0 1-12 0V8z"/>',
  "test": '<path d="M9 2v6L4 18a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 18l-5-10V2M8 2h8M7 14h10"/>',
  "grad": '<path d="M22 10L12 5 2 10l10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  "life": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.9 4.9l4.3 4.3M14.8 14.8l4.3 4.3M14.8 9.2l4.3-4.3M4.9 19.1l4.3-4.3"/>',
  "map": '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  "linkedin": '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  "play": '<circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z"/>',
  "menu": '<path d="M3 6h18M3 12h18M3 18h18"/>',
  "lang": '<path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>',
}
WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.2 0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.1 1.3 15.2.1 12 .1 5.5.1.2 5.4.2 11.9c0 2.1.5 4.1 1.6 5.9L.1 24l6.3-1.7c1.7.9 3.7 1.4 5.6 1.4 6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.3z"/></svg>'

def ic(name, cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<svg{c} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>'

def icon_box(name):
    return f'<div class="icon">{ic(name)}</div>'

NAV = [
    ("index.html", "Home"),
    ("services.html", "Services"),
    ("ai-executive-assistant.html", "AI Assistant"),
    ("how-it-works.html", "How It Works"),
    ("pricing.html", "Pricing"),
    ("about.html", "About"),
    ("contact.html", "Contact"),
]

def header(current):
    links = "".join(
        f'<li><a href="{href}"{" aria-current=\"page\"" if href == current else ""}>{label}</a></li>'
        for href, label in NAV)
    return f'''<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <nav class="container nav" aria-label="Main">
    <a class="brand" href="index.html" aria-label="{BRAND} — {BRAND_TAG}, home">
      <span class="brand__mark" aria-hidden="true">{INITIALS}</span>
      <span class="brand__text"><span class="brand__name">{BRAND}</span><span class="brand__tag">{BRAND_TAG}</span></span>
    </a>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Open menu">{ic("menu")}</button>
    <div class="nav__menu" id="nav-menu">
      <ul class="nav__links">{links}</ul>
      <div class="nav__cta">
        <a class="btn btn--ghost btn--sm" href="demo.html" data-demo>{ic("play")}Live Demo</a>
        <a class="btn btn--primary btn--sm" href="contact.html#consultation" data-book>Book a Consultation</a>
      </div>
    </div>
  </nav>
</header>'''

def footer():
    return f'''<footer class="site-footer">
  <div class="container">
    <div class="footer__grid">
      <div>
        <a class="brand" href="index.html"><span class="brand__mark" aria-hidden="true">{INITIALS}</span><span class="brand__text"><span class="brand__name">{BRAND}</span><span class="brand__tag">{BRAND_TAG}</span></span></a>
        <p class="mt-1">AI-powered automation that simplifies email, enquiries, tasks, follow-ups and scheduling — so you can focus on growing your business.</p>
        <div class="socials">
          <a href="contact.html" data-linkedin aria-label="LinkedIn">{ic("linkedin")}</a>
          <a href="contact.html" data-wa aria-label="WhatsApp">{WA_SVG}</a>
          <a href="contact.html" data-email aria-label="Email">{ic("mail")}</a>
        </div>
      </div>
      <div>
        <h4>Services</h4>
        <ul>
          <li><a href="services.html#ai-executive-assistant">AI Executive Assistant</a></li>
          <li><a href="services.html#email-management">Email Management</a></li>
          <li><a href="services.html#client-lead-management">Client &amp; Lead Management</a></li>
          <li><a href="services.html#admin-workflows">Admin Workflows</a></li>
          <li><a href="services.html#calendar-tasks">Calendar &amp; Tasks</a></li>
          <li><a href="services.html#custom-automation">Custom Automation</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="how-it-works.html">How It Works</a></li>
          <li><a href="pricing.html">Pricing</a></li>
          <li><a href="demo.html" data-demo>Live Demo</a></li>
          <li><a href="privacy.html">Privacy Notice</a></li>
        </ul>
      </div>
      <div>
        <h4>Get in touch</h4>
        <ul>
          <li><a href="contact.html" data-email><span data-email-text>Email</span></a></li>
          <li><a href="contact.html" data-wa>WhatsApp enquiry</a></li>
          <li><a href="contact.html#consultation" data-book>Book a consultation</a></li>
          <li>{CITY} · Working with clients locally and remotely</li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <span>&copy; <span data-year>{datetime.date.today().year}</span> {BRAND} — {BRAND_TAG}. All rights reserved.</span>
      <span><a href="privacy.html">Privacy</a> · <a href="sitemap.xml">Sitemap</a></span>
    </div>
  </div>
</footer>
<a class="wa-float" href="contact.html" data-wa aria-label="Chat on WhatsApp">{WA_SVG}</a>
<script src="assets/js/config.js"></script>
<script src="assets/js/main.js"></script>'''

def page(filename, title, description, body, extra_head="", extra_scripts="", noindex=False, jsonld=None):
    url = SITE_URL + "/" + ("" if filename == "index.html" else filename)
    robots = '<meta name="robots" content="noindex, follow">' if noindex else '<meta name="robots" content="index, follow">'
    ld = ""
    if jsonld:
        ld = '<script type="application/ld+json">' + json.dumps(jsonld, ensure_ascii=False) + "</script>"
    html = f'''<!DOCTYPE html>
<html lang="en-KE" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
{robots}
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#060f26">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{BRAND} — {BRAND_TAG}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE_URL}/assets/img/og-image.png">
<meta property="og:locale" content="en_KE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{SITE_URL}/assets/img/og-image.png">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
{extra_head}{ld}
</head>
<body>
{header(filename)}
<main id="main">
{body}
</main>
{footer()}
{extra_scripts}
</body>
</html>
'''
    with open(os.path.join(OUT, filename), "w", encoding="utf-8") as f:
        f.write(html)
    return filename

def page_hero(crumb, eyebrow, h1, text, buttons=""):
    return f'''<section class="page-hero">
  <div class="container">
    <p class="breadcrumb"><a href="index.html">Home</a> / {crumb}</p>
    <span class="eyebrow">{eyebrow}</span>
    <h1>{h1}</h1>
    <p>{text}</p>
    {f'<div class="btn-row mt-2">{buttons}</div>' if buttons else ""}
  </div>
</section>'''

def cta_band(title="Ready to take repetitive work off your plate?",
             text="Book a free consultation. We'll look at how your business runs today and identify what can realistically be automated."):
    return f'''<section class="section">
  <div class="container">
    <div class="cta-band reveal">
      <div><h2>{title}</h2><p>{text}</p></div>
      <div class="btn-row">
        <a class="btn btn--primary" href="contact.html#consultation" data-book>Book a Consultation {ic("arrow")}</a>
        <a class="btn btn--whatsapp" href="contact.html" data-wa>{WA_SVG} WhatsApp</a>
      </div>
    </div>
  </div>
</section>'''

def faq(items):
    out = '<div class="faq">'
    for q, a in items:
        out += f'<details class="reveal"><summary>{q}</summary><div><p class="mb-0">{a}</p></div></details>'
    return out + "</div>"

def faq_ld(items):
    import re
    strip = lambda s: re.sub(r"<[^>]+>", "", s)
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": strip(q),
                            "acceptedAnswer": {"@type": "Answer", "text": strip(a)}} for q, a in items]}

ORG_LD = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": f"{BRAND} — {BRAND_TAG}",
    "url": SITE_URL + "/",
    "image": SITE_URL + "/assets/img/og-image.png",
    "description": "AI-powered business automation: email management, client enquiries, task and follow-up tracking, scheduling and custom Make.com integrations.",
    "address": {"@type": "PostalAddress", "addressLocality": "Nairobi", "addressCountry": "KE"},
    "areaServed": ["Kenya", "Worldwide"],
    "founder": {"@type": "Person", "name": "Naomi Mwangi", "jobTitle": "AI Automation Specialist"},
    "priceRange": "KES 15,000 – KES 50,000+",
    "sameAs": ["https://www.linkedin.com/in/naomi-njeri-m/"],
}

# ============================================================== DATA
SERVICES = [
  {
    "id": "ai-executive-assistant", "icon": "bot", "name": "AI Executive Assistant Systems",
    "short": "An AI-supported assistant that reads, summarises and prioritises your email, extracts tasks, drafts replies and prepares a daily briefing.",
    "problem": "Business owners and executives lose hours every day reading, sorting and responding to email. Important requests get buried, deadlines are missed and nobody has a clear picture of what needs attention first.",
    "solution": "A connected assistant system that monitors your inbox, summarises each message, flags what is urgent, turns requests into tracked tasks and prepares draft responses — all reviewed and approved by you before anything is sent.",
    "how": ["New emails in Gmail trigger a Make.com scenario.", "An AI model summarises the message, assigns a priority and extracts action items.", "Results are logged to a Google Sheets dashboard and, where relevant, Google Calendar.", "Draft replies wait for your approval; a daily briefing summarises what matters."],
    "benefits": ["Less time spent reading and triaging email", "Urgent messages surface first", "Requests become trackable tasks", "A clear daily overview of your workload"],
    "slug": "ai-executive-assistant",
  },
  {
    "id": "email-management", "icon": "mail", "name": "Email Management Automation",
    "short": "Gmail automation that sorts, labels, summarises and routes messages so your inbox stays organised without constant manual effort.",
    "problem": "Shared and personal inboxes fill up with enquiries, invoices, notifications and internal messages. Sorting them manually is slow and inconsistent, and important emails are easy to miss.",
    "solution": "Rules-plus-AI email management: messages are automatically categorised, labelled, summarised and routed to the right place or person, with priority alerts for anything time-sensitive.",
    "how": ["Gmail filters and Make.com watch for new messages.", "AI classifies each email (e.g. lead, invoice, support, internal) and writes a short summary.", "Emails are labelled, forwarded or logged according to your rules.", "High-priority messages trigger an alert (e.g. email or chat notification)."],
    "benefits": ["A consistently organised inbox", "Faster handling of time-sensitive email", "Less manual sorting and forwarding", "A searchable log of important correspondence"],
    "slug": "email-management",
  },
  {
    "id": "client-lead-management", "icon": "users", "name": "Client and Lead Management",
    "short": "Capture every enquiry automatically, log it in one place, reply quickly and follow up on time — so no potential client is forgotten.",
    "problem": "Enquiries arrive through email, website forms and messaging. Without a system, leads are recorded inconsistently, replies are slow and follow-ups depend on memory.",
    "solution": "An enquiry pipeline that captures new leads automatically, records them in a central tracker, prepares a personalised first response and schedules follow-up reminders until the lead is closed.",
    "how": ["Website forms and enquiry emails feed into Make.com.", "Lead details are extracted and added to a Google Sheets tracker.", "A tailored acknowledgement is drafted for your approval.", "Follow-up reminders are scheduled based on the lead's status."],
    "benefits": ["Every enquiry captured in one place", "Faster first responses", "Consistent follow-up", "Clear visibility of your pipeline"],
    "slug": "client-lead-management",
  },
  {
    "id": "admin-workflows", "icon": "sheet", "name": "Administrative Workflow Automation",
    "short": "Automate repetitive admin — data entry, reporting, document requests and Google Sheets workflows — with clean, reliable processes.",
    "problem": "Teams spend significant time copying data between apps, updating spreadsheets, compiling reports and chasing routine information. The work is repetitive and prone to errors.",
    "solution": "Structured workflows that move data between your tools automatically, keep Google Sheets up to date, generate routine summaries and send reminders for recurring admin tasks.",
    "how": ["Map the current manual process step by step.", "Connect the apps involved through Make.com.", "Automate data capture, updates and formatting in Google Sheets.", "Schedule routine reports and reminders."],
    "benefits": ["Fewer manual data-entry errors", "Up-to-date records without extra effort", "Routine reports produced on schedule", "Staff time freed for higher-value work"],
    "slug": "admin-workflows",
  },
  {
    "id": "calendar-tasks", "icon": "cal", "name": "Calendar and Task Automation",
    "short": "Turn emails and requests into scheduled tasks, track deadlines and get reminders — with calendar suggestions ready for your approval.",
    "problem": "Meeting requests, deadlines and to-dos are scattered across email threads and notes. Rescheduling takes back-and-forth, and deadlines slip when tasks aren't tracked.",
    "solution": "Automation that extracts dates and deadlines from messages, creates tasks with due dates, suggests calendar entries and sends reminders before things fall due.",
    "how": ["AI identifies meeting requests, dates and deadlines in incoming messages.", "Tasks are created in a tracker with owners and due dates.", "Calendar entries are suggested in Google Calendar for your confirmation.", "Reminders are sent ahead of deadlines and follow-up dates."],
    "benefits": ["Deadlines tracked automatically", "Less scheduling back-and-forth", "Timely reminders", "A clear view of what is due and when"],
    "slug": "calendar-tasks",
  },
  {
    "id": "custom-automation", "icon": "puzzle", "name": "Custom Business Automation",
    "short": "Bespoke Make.com integrations and business process automation designed around how your organisation actually works.",
    "problem": "Off-the-shelf tools rarely match your exact process. Teams end up working around software, repeating steps manually across several apps.",
    "solution": "A custom automation designed after reviewing your process — connecting the apps you already use through Make.com and adding AI steps only where they genuinely help.",
    "how": ["Discovery session to understand your process and tools.", "Solution design with a clear scope and quote.", "Build and connect the integrations in Make.com.", "Test with real scenarios, then hand over with documentation."],
    "benefits": ["Automation that fits your process", "Works with tools you already pay for", "Documented and maintainable", "Can grow as your business grows"],
    "slug": "custom-automation",
  },
]

HOME_FAQ = [
  ("What kind of tasks can be automated?", "Repetitive, rule-based or text-heavy work is usually a good fit: sorting and summarising email, logging enquiries, updating Google Sheets, creating tasks from requests, sending follow-up reminders and preparing draft replies. During the consultation we identify which of your tasks are worth automating."),
  ("Will the AI send emails without my approval?", "No — by default, AI-drafted replies wait for human approval before anything is sent. You stay in control of what goes out in your name. Fully automatic sending can be considered only for low-risk messages, if you request it."),
  ("Which tools do you work with?", "Core systems are built with Gmail, Google Sheets, Google Calendar and Make.com, with an AI model for summarising, classifying and drafting. Other apps can often be connected through Make.com — ask about your specific tools."),
  ("Do I need technical knowledge?", "No. I handle the setup and testing, then train you or your team and provide simple documentation explaining how the system works and what to do if something needs attention."),
  ("Is my business data safe?", "Automations run inside your own accounts (for example your Google Workspace and Make.com), with access limited to what each workflow needs. We agree what data is processed before building, and you can revoke access at any time."),
  ("How long does a setup take?", "It depends on the scope. A focused email automation can be quicker than a multi-integration business workflow. You'll receive a timeline with your proposal after the assessment."),
  ("Are there ongoing costs?", "Apart from my fee, some tools have their own subscriptions or usage-based costs (for example Make.com operations and AI model usage). These are explained upfront so there are no surprises. Optional monthly maintenance is also available."),
  ("Do you work with clients outside Kenya?", "Yes. I'm based in Nairobi and work remotely, so I can support clients in Kenya and internationally. Consultations can be held by video call or WhatsApp."),
]

INDUSTRIES = [
  ("briefcase", "Consultants & coaches", "Manage enquiries, bookings and client follow-ups."),
  ("megaphone", "Agencies & creatives", "Track client requests, approvals and deadlines."),
  ("scale", "Professional services", "Organise correspondence and document requests for legal, accounting and advisory firms."),
  ("home", "Real estate", "Capture property enquiries and schedule viewings."),
  ("heart", "Clinics & wellness (admin)", "Handle appointment requests and reminders on the admin side."),
  ("book", "Education & training", "Manage applications, course enquiries and communication."),
  ("globe", "NGOs & organisations", "Coordinate partner emails, reporting and tasks."),
  ("cart", "SMEs & e-commerce", "Automate order enquiries, supplier email and admin."),
]

# ============================================================== PAGES
def build_home():
    services_cards = "".join(f'''<article class="card reveal">
      {icon_box(s["icon"])}
      <h3>{s["name"]}</h3>
      <p>{s["short"]}</p>
      <a class="card__link" href="services.html#{s["id"]}">Learn more {ic("arrow")}</a>
    </article>''' for s in SERVICES)

    industries = "".join(f'''<div class="industry reveal">{icon_box(i)}<div><h4>{t}</h4><p>{d}</p></div></div>''' for i, t, d in INDUSTRIES)

    benefits = [
      ("clock", "Reclaim your time", "Hand repetitive admin to reliable workflows and spend more time on clients, strategy and growth."),
      ("zap", "Respond faster", "Summaries, priorities and draft replies help you respond to important messages sooner."),
      ("repeat", "Nothing slips through", "Tasks and follow-ups are tracked automatically instead of relying on memory."),
      ("layers", "Consistent processes", "Every enquiry and request is handled the same way, every time."),
      ("eye", "Clear visibility", "A live dashboard shows what's open, urgent and due."),
      ("hand", "You stay in control", "Human approval is built in — automation supports your decisions, it doesn't replace them."),
    ]
    ben = "".join(f'<div class="card card--dark reveal">{icon_box(i)}<h3>{t}</h3><p>{d}</p></div>' for i, t, d in benefits)

    body = f'''
<section class="hero">
  <div class="container hero__grid">
    <div>
      <span class="eyebrow">AI Automation Services · {CITY} &amp; remote</span>
      <h1>Work Smarter. Automate More. <span class="accent">Focus on Growth.</span></h1>
      <p class="hero__text">We help businesses simplify everyday operations through intelligent AI-powered automation. From managing emails and client enquiries to tracking tasks and follow-ups, we build systems that give you more time to focus on what matters.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="demo.html" data-demo>{ic("play")} View Live Demo</a>
        <a class="btn btn--ghost" href="contact.html#consultation" data-book>Book a Consultation {ic("arrow")}</a>
      </div>
      <div class="hero__note">
        <span>{ic("shield")} Human approval built in</span>
        <span>{ic("plug")} Uses tools you already have</span>
        <span>{ic("globe")} Kenyan &amp; international clients</span>
      </div>
    </div>
    <div class="reveal" aria-hidden="true">
      <div class="dash">
        <div class="dash__float dash__float--b"><span class="ico">{ic("sun")}</span><span><b>Daily briefing ready</b><small>3 priorities · 5 tasks</small></span></div>
        <div class="dash__bar"><span class="dash__dot"></span><span class="dash__dot"></span><span class="dash__dot"></span><span class="dash__title">AI Executive Assistant — Today</span></div>
        <div class="dash__stats">
          <div class="stat"><b>24</b><small>Emails processed</small></div>
          <div class="stat"><b>3</b><small>High priority</small></div>
          <div class="stat"><b>7</b><small>Tasks extracted</small></div>
        </div>
        <div class="dash__list">
          <div class="mail"><span class="mail__av" style="background:#6d4cf0">WK</span><div><div class="mail__from">Revised quote request</div><div class="mail__sum">Client needs updated quote before 10:00 tomorrow</div></div><span class="tag tag--high">High</span></div>
          <div class="mail"><span class="mail__av" style="background:#2c6bd6">DO</span><div><div class="mail__from">New enquiry — bookkeeping admin</div><div class="mail__sum">Lead logged · discovery call suggested</div></div><span class="tag tag--med">Lead</span></div>
          <div class="mail"><span class="mail__av" style="background:#0f8c6b">GM</span><div><div class="mail__from">Reschedule planning meeting</div><div class="mail__sum">Calendar slot found · reply drafted</div></div><span class="tag tag--med">Medium</span></div>
          <div class="mail"><span class="mail__av">TW</span><div><div class="mail__from">Weekly newsletter</div><div class="mail__sum">No action required</div></div><span class="tag tag--low">Low</span></div>
        </div>
        <div class="dash__float dash__float--a"><span class="ico">{ic("pen")}</span><span><b>Reply drafted</b><small>Waiting for your approval</small></span></div>
      </div>
      <p class="small center mt-1" style="color:#7f90b6">Illustrative dashboard with sample data</p>
    </div>
  </div>
</section>

<section class="section section--soft" style="padding:2.2rem 0">
  <div class="container">
    <div class="chip-row justify-center">
      <span class="muted small" style="align-self:center;margin-right:.4rem">Built with tools you already use:</span>
      <span class="chip">{ic("mail")} Gmail</span>
      <span class="chip">{ic("sheet")} Google Sheets</span>
      <span class="chip">{ic("cal")} Google Calendar</span>
      <span class="chip">{ic("zap")} Make.com</span>
      <span class="chip">{ic("brain")} AI language models</span>
    </div>
  </div>
</section>

<section class="section" id="services">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Services</span>
      <h2>Automation for the work that slows you down</h2>
      <p class="lead">Practical AI-powered systems that handle repetitive administrative and operational tasks — designed around your business, not a generic template.</p>
    </div>
    <div class="grid grid--3">{services_cards}</div>
    <div class="center mt-2"><a class="btn btn--outline" href="services.html">Explore all services {ic("arrow")}</a></div>
  </div>
</section>

<section class="section section--soft">
  <div class="container split">
    <div class="reveal">
      <span class="eyebrow">Featured product</span>
      <h2>The AI Executive Assistant System</h2>
      <p class="lead">Your inbox, summarised, prioritised and organised — with replies drafted and tasks tracked, ready for your approval.</p>
      <ul class="check-list">
        <li>Monitors incoming emails and summarises each message</li>
        <li>Detects priority and extracts actionable tasks</li>
        <li>Prepares draft responses for your approval</li>
        <li>Tracks follow-ups and supports calendar management</li>
        <li>Generates a daily briefing of what needs attention</li>
      </ul>
      <div class="btn-row mt-2">
        <a class="btn btn--primary" href="demo.html" data-demo>{ic("play")} Try the interactive demo</a>
        <a class="btn btn--outline" href="ai-executive-assistant.html">How it works {ic("arrow")}</a>
      </div>
    </div>
    <div class="feature-panel reveal">
      <p class="small mb-0" style="color:#9fb0d4">Workflow</p>
      <h3 style="color:#fff">From inbox to action</h3>
      <ol class="check-list" style="margin-top:1rem">
        <li><strong style="color:#fff">Gmail</strong> — a new email arrives</li>
        <li><strong style="color:#fff">Make.com</strong> — the workflow is triggered</li>
        <li><strong style="color:#fff">AI processing</strong> — summary, priority, tasks, draft</li>
        <li><strong style="color:#fff">Google Sheets / Calendar</strong> — everything logged and scheduled</li>
        <li><strong style="color:#fff">Human approval</strong> — you review and decide</li>
      </ol>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">How it works</span>
      <h2>A clear, low-risk process</h2>
      <p class="lead">Every project starts with understanding your business. Nothing is built until we agree on what will genuinely save you time.</p>
    </div>
    <div class="steps">
      <div class="step reveal"><div class="step__num">01</div><h3>Discover &amp; assess</h3><p class="mb-0">We review your current processes and identify repetitive tasks suitable for automation.</p></div>
      <div class="step reveal"><div class="step__num">02</div><h3>Design</h3><p class="mb-0">You receive a tailored solution design with a clear scope, timeline and quote.</p></div>
      <div class="step reveal"><div class="step__num">03</div><h3>Build &amp; test</h3><p class="mb-0">Your apps are connected and every workflow is tested with realistic scenarios.</p></div>
      <div class="step reveal"><div class="step__num">04</div><h3>Handover &amp; support</h3><p class="mb-0">You're trained, given documentation and supported as the system is refined.</p></div>
    </div>
    <div class="center mt-2"><a class="btn btn--outline" href="how-it-works.html">See the full process {ic("arrow")}</a></div>
  </div>
</section>

<section class="section section--navy">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Benefits</span>
      <h2>What automation changes for your business</h2>
      <p class="lead">Less time on repetitive admin. More consistency, visibility and time for the work that grows your business.</p>
    </div>
    <div class="grid grid--3">{ben}</div>
  </div>
</section>

<section class="section section--soft">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Industries served</span>
      <h2>Built for busy teams of every kind</h2>
      <p class="lead">If your business runs on email, enquiries, spreadsheets and deadlines, there is likely work that can be automated.</p>
    </div>
    <div class="grid grid--4">{industries}</div>
  </div>
</section>

<section class="section" id="faq">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">FAQ</span>
      <h2>Frequently asked questions</h2>
    </div>
    {faq(HOME_FAQ)}
  </div>
</section>
{cta_band()}
'''
    page("index.html",
         f"AI Automation Services in Kenya | {BRAND} — Email, Tasks & Workflow Automation",
         "AI-powered business automation for email management, client enquiries, tasks, follow-ups and scheduling. Gmail, Google Sheets and Make.com automation for Kenyan and international businesses.",
         body, jsonld=[ORG_LD, faq_ld(HOME_FAQ)])


def build_services():
    toc = "".join(f'<a href="#{s["id"]}">{s["name"]}</a>' for s in SERVICES)
    blocks = ""
    for n, s in enumerate(SERVICES, 1):
        how = "".join(f"<li>{x}</li>" for x in s["how"])
        ben = "".join(f"<li>{x}</li>" for x in s["benefits"])
        blocks += f'''
    <article class="service" id="{s["id"]}">
      <div class="service__aside reveal">
        {icon_box(s["icon"])}
        <div class="service__num">SERVICE {n:02d}</div>
        <h2 style="font-size:1.6rem">{s["name"]}</h2>
        <p class="muted">{s["short"]}</p>
        <div class="btn-row">
          <a class="btn btn--primary btn--sm" href="contact.html?service={s["slug"]}#enquiry">Enquire about this {ic("arrow")}</a>
        </div>
      </div>
      <div class="service__blocks reveal">
        <div class="sblock sblock--problem"><h4>{ic("alert")} The business problem</h4><p class="mb-0">{s["problem"]}</p></div>
        <div class="sblock"><h4>{ic("spark")} The solution</h4><p class="mb-0">{s["solution"]}</p></div>
        <div class="sblock"><h4>{ic("cog")} How the automation works</h4><ol style="margin:0;padding-left:1.2rem">{how}</ol></div>
        <div class="sblock"><h4>{ic("trend")} Expected operational benefits</h4><ul class="check-list mb-0">{ben}</ul></div>
        <div class="sblock sblock--wide" style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between;background:#fff">
          <p class="mb-0"><strong style="color:var(--ink)">Could this work for your business?</strong> Let's look at your process together.</p>
          <div class="btn-row"><a class="btn btn--navy btn--sm" href="contact.html#consultation" data-book>Book a consultation</a><a class="btn btn--outline btn--sm" href="contact.html" data-wa data-wa-msg="Hello Naomi, I'm interested in {s["name"]}. Can we talk?">Ask on WhatsApp</a></div>
        </div>
      </div>
    </article>'''

    body = f'''
<section class="page-hero">
  <div class="container">
    <p class="breadcrumb"><a href="index.html">Home</a> / Services</p>
    <span class="eyebrow">Services</span>
    <h1>AI automation services that remove repetitive work</h1>
    <p>From inbox management to custom Make.com integrations, each service is designed to solve a specific operational problem — with clear benefits and human oversight built in.</p>
    <nav class="toc mt-2" aria-label="Services on this page">{toc}</nav>
  </div>
</section>
<section class="section">
  <div class="container">{blocks}
  </div>
</section>
<section class="section section--soft">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Also included</span><h2>Capabilities across every service</h2></div>
    <div class="chip-row justify-center reveal">
      <span class="chip">{ic("mail")} Gmail &amp; email automation</span>
      <span class="chip">{ic("brain")} AI-powered email management</span>
      <span class="chip">{ic("list")} Task &amp; deadline automation</span>
      <span class="chip">{ic("inbox")} Client enquiry management</span>
      <span class="chip">{ic("repeat")} Follow-up automation</span>
      <span class="chip">{ic("cal")} Calendar &amp; scheduling</span>
      <span class="chip">{ic("sheet")} Google Sheets workflows</span>
      <span class="chip">{ic("cog")} Business process automation</span>
      <span class="chip">{ic("zap")} Custom Make.com integrations</span>
    </div>
  </div>
</section>
{cta_band("Not sure which service you need?", "Tell me how your business currently works. I'll recommend the automation that will make the biggest difference — or tell you honestly if automation isn't the right fit.")}
'''
    ld = {"@context": "https://schema.org", "@type": "ItemList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1,
         "item": {"@type": "Service", "name": s["name"], "description": s["short"],
                  "provider": {"@type": "ProfessionalService", "name": f"{BRAND} — {BRAND_TAG}"},
                  "url": f"{SITE_URL}/services.html#{s['id']}"}} for i, s in enumerate(SERVICES)]}
    page("services.html",
         f"AI Automation Services — Email, Leads, Admin & Make.com | {BRAND}",
         "AI Executive Assistant systems, Gmail automation, client and lead management, admin workflow automation, calendar and task automation, and custom Make.com integrations.",
         body, jsonld=ld)


def build_product():
    caps = [
      ("inbox", "Monitors incoming emails", "Watches your Gmail inbox (or selected labels) and picks up new messages as they arrive, on a schedule you choose."),
      ("list", "Summarises messages", "Turns long emails and threads into short, clear summaries so you understand each message in seconds."),
      ("flag", "Detects priority", "Rates each email as high, medium or low priority — with a short reason — based on deadlines, senders and content."),
      ("check", "Extracts actionable tasks", "Pulls out requests and deadlines and turns them into tasks with due dates in your tracker."),
      ("pen", "Prepares email responses", "Drafts replies in a professional tone for you to review, edit and approve before sending."),
      ("repeat", "Tracks follow-ups", "Records follow-up dates and reminds you when a conversation needs attention again."),
      ("cal", "Supports calendar management", "Spots meeting requests and suggests calendar entries or reschedules for your confirmation."),
      ("sun", "Generates daily briefings", "Prepares a short daily overview: priorities, tasks due, calendar changes and drafts awaiting approval."),
    ]
    capcards = "".join(f'<div class="card reveal">{icon_box(i)}<h3>{t}</h3><p>{d}</p></div>' for i, t, d in caps)
    flow = [
      ("mail", "Step 1", "Gmail", "Where your emails arrive. The system reads new messages from your inbox."),
      ("zap", "Step 2", "Make.com", "The automation engine. It detects new emails and passes them through each step in order."),
      ("brain", "Step 3", "AI Processing", "An AI language model reads the email and returns a summary, priority, tasks and a draft reply."),
      ("sheet", "Step 4", "Sheets / Calendar", "Results are logged to a Google Sheets dashboard; meetings and reminders go to Google Calendar."),
      ("hand", "Step 5", "Human Approval", "You review drafts and suggestions, then approve, edit or reject. Nothing is sent without you."),
    ]
    flowhtml = "".join(f'<div class="flow__node reveal">{icon_box(i)}<span class="flow__step">{s}</span><h4>{t}</h4><p>{d}</p></div>' for i, s, t, d in flow)
    roles = [
      ("mail", "Gmail — your inbox", "Nothing changes about how people email you. The assistant simply has permission to read new messages and, once you approve, send replies from your account."),
      ("zap", "Make.com — the connector", "Make.com is a visual automation platform. Think of it as a set of instructions: <em>when a new email arrives, do these steps in this order</em>. It connects Gmail, the AI and Google's apps without custom servers."),
      ("brain", "AI processing — the reader", "An AI language model handles the reading and writing work: summarising, judging urgency, spotting tasks and drafting a reply. It follows instructions tailored to your business and tone."),
      ("sheet", "Google Sheets — the dashboard", "Every processed email becomes a row: sender, summary, priority, tasks, follow-up date and status. It's simple, shareable and easy to filter or report on."),
      ("cal", "Google Calendar — the schedule", "Meeting requests, reminders and follow-ups can be added as calendar suggestions, so your schedule reflects what's in your inbox."),
      ("hand", "Human approval — you", "The final decision is always yours. You approve, edit or reject drafts and suggestions. This keeps quality high and protects your relationships."),
    ]
    rolehtml = "".join(f'<div class="industry reveal">{icon_box(i)}<div><h4>{t}</h4><p>{d}</p></div></div>' for i, t, d in roles)
    pfaq = [
      ("Does it work with Google Workspace business accounts?", "Yes. It works with both personal Gmail and Google Workspace accounts. Workspace admin settings may need to allow the connection."),
      ("Can it reply in my tone of voice?", "Yes. The AI is given instructions and examples that reflect how you write, and you can edit any draft before approving it."),
      ("What happens if the AI gets something wrong?", "Because drafts and suggestions require approval, mistakes are caught before they reach anyone. You can reject or edit, and recurring issues are used to refine the instructions."),
      ("How often does it check my inbox?", "That depends on your Make.com plan and needs — for example every 15 minutes or hourly. Frequency affects usage costs, so we choose a sensible schedule together."),
    ]
    body = f'''
{page_hero("AI Executive Assistant", "Featured product", "The AI Executive Assistant System",
  "An intelligent assistant system that keeps your inbox under control: it summarises and prioritises email, extracts tasks, drafts replies, tracks follow-ups and briefs you every morning — with you approving every important action.",
  f'<a class="btn btn--primary" href="demo.html" data-demo>{ic("play")} Launch the interactive demo</a><a class="btn btn--ghost" href="contact.html#consultation" data-book>Book a Consultation</a>')}

<section class="section">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Capabilities</span><h2>What the assistant does for you</h2><p class="lead">Eight connected capabilities that turn a busy inbox into an organised, actionable workload.</p></div>
    <div class="grid grid--4">{capcards}</div>
  </div>
</section>

<section class="section section--navy" id="workflow">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Workflow diagram</span><h2>How the system fits together</h2><p class="lead">Gmail → Make.com → AI Processing → Google Sheets / Google Calendar → Human Approval</p></div>
    <div class="flow" role="list" aria-label="Workflow: Gmail, then Make.com, then AI processing, then Google Sheets or Google Calendar, then human approval">{flowhtml}</div>
  </div>
</section>

<section class="section section--soft">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">In simple language</span><h2>The role of each technology</h2><p class="lead">No jargon — here's what each part of the system does.</p></div>
    <div class="grid grid--2">{rolehtml}</div>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div class="reveal">
      <span class="eyebrow">Interactive demonstration</span>
      <h2>See it working before you commit</h2>
      <p class="lead">Explore a sample inbox and watch the assistant summarise emails, set priorities, extract tasks, draft replies, log everything to a tracker and generate a daily briefing.</p>
      <a class="btn btn--primary" href="demo.html" data-demo>{ic("play")} Open the live demo</a>
    </div>
    <div class="feature-panel reveal">
      <h3 style="color:#fff">Included in every assistant setup</h3>
      <ul class="check-list mb-0">
        <li>Tailored AI instructions for your business and tone</li>
        <li>Google Sheets tracker / dashboard</li>
        <li>Testing with realistic email scenarios</li>
        <li>Human approval step for replies</li>
        <li>Handover training and documentation</li>
      </ul>
      <p class="small mt-1 mb-0" style="color:#9fb0d4">Features vary by package — see <a href="pricing.html" style="color:#b9a8ff">pricing</a>.</p>
    </div>
  </div>
</section>

<section class="section section--soft">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Questions</span><h2>About the AI Executive Assistant</h2></div>
    {faq(pfaq)}
  </div>
</section>
{cta_band("Want an assistant like this for your inbox?", "Book a consultation to discuss your email volume, tools and goals. You'll get a clear recommendation and quote.")}
'''
    ld = {"@context": "https://schema.org", "@type": "Service", "name": "AI Executive Assistant System",
          "serviceType": "AI email and business automation",
          "provider": {"@type": "ProfessionalService", "name": f"{BRAND} — {BRAND_TAG}"},
          "areaServed": ["Kenya", "Worldwide"],
          "description": "Monitors incoming email, summarises messages, detects priority, extracts tasks, drafts replies, tracks follow-ups, supports calendar management and generates daily briefings."}
    page("ai-executive-assistant.html",
         f"AI Executive Assistant System — Gmail, Make.com & AI | {BRAND}",
         "An AI Executive Assistant that monitors Gmail, summarises and prioritises email, extracts tasks, drafts replies, tracks follow-ups and prepares daily briefings — with human approval.",
         body, jsonld=[ld, faq_ld(pfaq)])


def build_process():
    steps = [
      ("search", "Discovery", "Understand your existing business processes.", ["A conversation about how your business runs today", "Which tools you use and where time is being lost", "Your goals and any constraints (budget, data, team)"]),
      ("eye", "Assessment", "Identify repetitive tasks suitable for automation.", ["Map the tasks that are repetitive and rule-based", "Estimate where automation will have real impact", "Flag anything that should stay manual"]),
      ("layers", "Design", "Develop a customised automation solution.", ["A written solution design with workflow diagram", "Clear scope, timeline and quote", "Agreement on approvals, data and access"]),
      ("plug", "Implementation", "Connect the necessary applications.", ["Build the workflows in Make.com", "Connect Gmail, Google Sheets, Calendar and other tools", "Configure AI instructions for your business"]),
      ("test", "Testing", "Verify that workflows function correctly.", ["Test with realistic scenarios and edge cases", "Check error handling and notifications", "Your review and sign-off before going live"]),
      ("grad", "Handover", "Train the client and provide documentation.", ["A walkthrough training session", "Simple documentation and how-to guides", "Clear ownership of accounts and access"]),
      ("life", "Ongoing support", "Monitor and improve the system.", ["Optional monthly maintenance", "Monitoring, fixes and adjustments", "Improvements as your business changes"]),
    ]
    tl = "".join(f'''<div class="tl-item reveal"><div class="tl-dot">{n:02d}</div><div class="tl-body"><div class="meta">Step {n} · {t}</div><h3>{h}</h3><ul>{"".join(f"<li>{x}</li>" for x in xs)}</ul></div></div>''' for n, (i, t, h, xs) in enumerate(steps, 1))
    body = f'''
{page_hero("How It Works", "How it works", "From first conversation to a working system",
  "A structured, transparent process that starts with your business — not the technology. You'll know exactly what is being built, why, and what it will cost before any work begins.",
  f'<a class="btn btn--primary" href="contact.html#consultation" data-book>Start with a consultation {ic("arrow")}</a>')}
<section class="section section--soft">
  <div class="container"><div class="timeline">{tl}</div></div>
</section>
<section class="section">
  <div class="container split split--top">
    <div class="reveal">
      <span class="eyebrow">What I need from you</span>
      <h2>Simple to get started</h2>
      <ul class="check-list">
        <li>Time for a discovery conversation (usually 30–60 minutes)</li>
        <li>Examples of the tasks or emails you want to automate</li>
        <li>Access to the relevant accounts, granted securely when we build</li>
        <li>Feedback during testing</li>
      </ul>
    </div>
    <div class="reveal">
      <span class="eyebrow">Principles</span>
      <h2>How I work</h2>
      <ul class="check-list">
        <li><strong>Practical first</strong> — automate what genuinely saves time</li>
        <li><strong>Human in the loop</strong> — approvals where decisions matter</li>
        <li><strong>Transparent costs</strong> — including third-party tool costs</li>
        <li><strong>Your accounts, your data</strong> — systems run in tools you own</li>
        <li><strong>Documented</strong> — you understand what was built</li>
      </ul>
    </div>
  </div>
</section>
{cta_band()}
'''
    ld = {"@context": "https://schema.org", "@type": "HowTo", "name": "How an AI automation project works",
          "step": [{"@type": "HowToStep", "position": n, "name": t, "text": h} for n, (i, t, h, xs) in enumerate(steps, 1)]}
    page("how-it-works.html",
         f"How It Works — The AI Automation Process | {BRAND}",
         "Discovery, assessment, design, implementation, testing, handover and ongoing support — a clear seven-step process for building reliable AI business automation.",
         body, jsonld=ld)


def build_pricing():
    plans = [
      ("starter", "Starter", "KES 15,000", "", "For individuals and small businesses starting with email automation.",
       ["Basic email automation", "Email summaries", "Priority detection", "Google Sheets tracking", "Initial setup and testing"], False),
      ("professional", "Professional", "KES 30,000", "", "For busy professionals who want a full assistant workflow.",
       ["Everything in Starter", "AI response drafting", "Task extraction", "Follow-up tracking", "Calendar assistance", "Custom dashboard"], True),
      ("business", "Business", "KES 50,000", "+", "For organisations needing tailored, multi-system automation.",
       ["Customised workflows", "Multiple integrations", "Advanced reporting", "Business-specific automation", "Implementation and training"], False),
    ]
    cards = ""
    for key, name, price, plus, forwho, feats, featured in plans:
        li = "".join(f"<li>{f}</li>" for f in feats)
        cards += f'''<article class="plan{" plan--featured" if featured else ""} reveal">
      {'<span class="plan__badge">Most popular</span>' if featured else ""}
      <div class="plan__name">{name}</div>
      <div class="plan__price">{price}<small>{plus}</small></div>
      <p class="small muted mb-0">One-time setup fee · starting price</p>
      <hr>
      <p class="plan__for mt-1">{forwho}</p>
      <ul class="check-list">{li}</ul>
      <a class="btn {"btn--primary" if featured else "btn--navy"} btn--block" href="contact.html?plan={key}#enquiry">Get started with {name}</a>
    </article>'''
    rows = [
      ("Email summaries", 1, 1, 1), ("Priority detection", 1, 1, 1), ("Google Sheets tracking", 1, 1, 1),
      ("Setup and testing", 1, 1, 1), ("AI response drafting", 0, 1, 1), ("Task extraction", 0, 1, 1),
      ("Follow-up tracking", 0, 1, 1), ("Calendar assistance", 0, 1, 1), ("Custom dashboard", 0, 1, 1),
      ("Customised workflows", 0, 0, 1), ("Multiple integrations", 0, 0, 1), ("Advanced reporting", 0, 0, 1),
      ("Implementation and training", "Basic handover", "Handover + guide", 1),
    ]
    def cell(v):
        if v == 1: return '<td><span class="yes" aria-label="Included">✓</span></td>'
        if v == 0: return '<td><span class="no" aria-label="Not included">—</span></td>'
        return f'<td class="small">{v}</td>'
    trs = "".join(f"<tr><td>{r[0]}</td>{cell(r[1])}{cell(r[2])}{cell(r[3])}</tr>" for r in rows)
    pfaq = [
      ("Why is the price a starting point?", "Final pricing depends on workflow complexity, the number of integrations, expected usage and implementation requirements. You'll receive a fixed quote after the assessment, before any work starts."),
      ("Are third-party tool costs included?", "No. Tools such as Make.com and AI model providers have their own plans and usage-based charges, paid directly by you from your own accounts. I'll recommend the most cost-effective option for your volume."),
      ("Is usage unlimited?", "No. Every automation runs within the limits of the plans you choose (for example Make.com operations and AI usage). We size the system to your expected volume and explain what happens if it grows."),
      ("What does monthly maintenance include?", "Monitoring, fixing issues if a connected app changes, small adjustments to AI instructions and workflows, and periodic check-ins. The exact scope is agreed in writing."),
      ("Do you work with international clients?", "Yes. Prices are shown in Kenyan shillings; international clients can request a quote in USD or another currency."),
    ]
    body = f'''
{page_hero("Pricing", "Pricing", "Transparent packages, tailored quotes",
  "Choose a starting point that matches your needs. Every project begins with an assessment, so your final quote reflects what you actually need — nothing more.")}
<section class="section section--soft">
  <div class="container">
    <div class="pricing">{cards}</div>
    <div class="notice mt-3 reveal" role="note">{ic("alert")}<div><p><strong>Final pricing depends on your requirements.</strong> Prices shown are starting points for setup. Your final quote depends on workflow complexity, integrations, usage and implementation requirements, and is confirmed in writing before work begins.</p><p>Third-party subscriptions and usage-based fees (e.g. Make.com, AI model usage) are billed separately by those providers. Usage is not unlimited — systems are configured for your expected volume.</p></div></div>
  </div>
</section>
<section class="section">
  <div class="container split">
    <div class="reveal">
      <span class="eyebrow">Optional add-on</span>
      <h2>Monthly maintenance</h2>
      <p class="lead">Keep your automations running smoothly as your business and tools change.</p>
      <ul class="check-list">
        <li>Monitoring of workflows and error alerts</li>
        <li>Fixes when connected apps change</li>
        <li>Small improvements and instruction tuning</li>
        <li>Priority support via WhatsApp and email</li>
      </ul>
    </div>
    <div class="plan reveal">
      <div class="plan__name">Maintenance plan</div>
      <div class="plan__price" style="font-size:1.9rem">Quoted monthly</div>
      <p class="muted">Priced according to the number and complexity of workflows maintained. <span class="placeholder">Optional: add your starting monthly rate here</span></p>
      <a class="btn btn--navy btn--block" href="contact.html?plan=maintenance#enquiry">Ask about maintenance</a>
    </div>
  </div>
</section>
<section class="section section--soft">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Compare</span><h2>Package comparison</h2></div>
    <div class="table-wrap reveal">
      <table class="compare">
        <caption class="visually-hidden">Features included in each package</caption>
        <thead><tr><th scope="col">Feature</th><th scope="col">Starter</th><th scope="col">Professional</th><th scope="col">Business</th></tr></thead>
        <tbody>{trs}</tbody>
      </table>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Pricing FAQ</span><h2>Common pricing questions</h2></div>
    {faq(pfaq)}
  </div>
</section>
{cta_band("Get a quote for your business", "Book a consultation and receive a clear recommendation and written quote.")}
'''
    offers = {"@context": "https://schema.org", "@type": "Service", "name": "AI business automation packages",
              "provider": {"@type": "ProfessionalService", "name": f"{BRAND} — {BRAND_TAG}"},
              "offers": [{"@type": "Offer", "name": p[1], "price": p[2].replace("KES ", "").replace(",", ""), "priceCurrency": "KES",
                          "description": ", ".join(p[5])} for p in plans]}
    page("pricing.html",
         f"Pricing — AI Automation Packages from KES 15,000 | {BRAND}",
         "Starter, Professional and Business AI automation packages from KES 15,000, plus optional monthly maintenance. Final pricing depends on complexity, integrations and usage.",
         body, jsonld=[offers, faq_ld(pfaq)])


def build_about():
    areas = [("globe", "Information & Communication Technology"), ("tool", "Web development"), ("megaphone", "Digital marketing"),
             ("users", "Virtual assistance"), ("brain", "AI data training & annotation"), ("cog", "Business process automation")]
    areahtml = "".join(f'<div class="industry reveal">{icon_box(i)}<div><h4>{t}</h4></div></div>' for i, t in areas)
    body = f'''
{page_hero("About", "About", "Hi, I'm Naomi — AI Automation Specialist",
  "I help businesses use technology to simplify operations and work more efficiently, by building practical AI-powered automation around the tools they already use.")}
<section class="section">
  <div class="container split split--top">
    <div class="reveal">
      <div class="portrait">
        <!-- To add your photo: save it as assets/img/naomi.jpg and uncomment the next line -->
        <!-- <img src="assets/img/naomi.jpg" alt="Naomi Mwangi, AI Automation Specialist" width="800" height="1000" loading="lazy"> -->
        <span class="portrait__initials" aria-hidden="true">{INITIALS}</span>
        <span class="portrait__note">Photo placeholder — add your professional headshot</span>
      </div>
    </div>
    <div class="reveal">
      <span class="eyebrow">My story</span>
      <h2>Technology should give you time back</h2>
      <p>I'm Naomi Mwangi, an AI Automation Specialist based in {CITY}. My background spans information and communication technology, web development, digital marketing, virtual assistance and AI data training and annotation — work that has shown me, from several angles, how much time businesses spend on repetitive administration.</p>
      <p>Having worked on the administrative side of businesses, I know how quickly email, enquiries, follow-ups and spreadsheets can take over a working day. My focus is helping businesses use technology to simplify those operations — designing automation that is practical, reliable and easy to understand, with people kept in control of important decisions.</p>
      <p>I hold a Diploma in Information Communication Technology and work remotely with clients and teams, both in Kenya and internationally. I work in English and Kiswahili, with conversational French.</p>
      <p class="small muted"><span class="placeholder">Optional: add years of experience, notable projects, certifications or tools you specialise in — only details you can verify.</span></p>
      <div class="btn-row mt-2">
        <a class="btn btn--primary" href="contact.html#consultation" data-book>Book a Consultation</a>
        <a class="btn btn--outline" href="contact.html" data-linkedin>{ic("linkedin")} Connect on LinkedIn</a>
      </div>
    </div>
  </div>
</section>
<section class="section section--soft">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Experience &amp; interests</span><h2>A practical, multi-disciplinary background</h2></div>
    <div class="grid grid--3">{areahtml}</div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Approach</span><h2>What you can expect working with me</h2></div>
    <div class="grid grid--3">
      <div class="card reveal">{icon_box("search")}<h3>Business first</h3><p>I start with how your business works and what slows it down — then choose the technology.</p></div>
      <div class="card reveal">{icon_box("shield")}<h3>Honest advice</h3><p>If something shouldn't be automated, or a simpler fix exists, I'll tell you.</p></div>
      <div class="card reveal">{icon_box("book")}<h3>Clear handover</h3><p>You get training and plain-language documentation, so you understand and own your system.</p></div>
    </div>
  </div>
</section>
{cta_band("Let's talk about your business", "Tell me what's taking up your time. I'll show you what can realistically be automated.")}
'''
    ld = {"@context": "https://schema.org", "@type": "Person", "name": "Naomi Mwangi", "jobTitle": "AI Automation Specialist",
          "address": {"@type": "PostalAddress", "addressLocality": "Nairobi", "addressCountry": "KE"},
          "knowsLanguage": ["English", "Swahili", "French"], "sameAs": ["https://www.linkedin.com/in/naomi-njeri-m/"],
          "knowsAbout": [t for _, t in areas]}
    page("about.html",
         f"About Naomi Mwangi — AI Automation Specialist, Nairobi",
         "Naomi Mwangi is an AI Automation Specialist in Nairobi, Kenya, with a background in ICT, web development, digital marketing, virtual assistance and AI data annotation.",
         body, jsonld=ld)


def build_contact():
    needs = ["AI Executive Assistant", "Email management", "Client & lead management", "Follow-up automation",
             "Calendar & scheduling", "Task & deadline tracking", "Google Sheets workflows", "Custom Make.com integration", "Not sure yet"]
    slugs = {"AI Executive Assistant": "ai-executive-assistant", "Email management": "email-management",
             "Client & lead management": "client-lead-management", "Google Sheets workflows": "admin-workflows",
             "Calendar & scheduling": "calendar-tasks", "Custom Make.com integration": "custom-automation"}
    checks = "".join(f'<label><input type="checkbox" name="automation_needs" value="{slugs.get(n, n)}"> {n.replace("&", "&amp;")}</label>' for n in needs)
    body = f'''
{page_hero("Contact", "Contact", "Let's automate the work that slows you down",
  "Send an enquiry, request a consultation or message me on WhatsApp. I usually reply within one working day.")}
<section class="section section--soft">
  <div class="container split split--top split--contact">
    <div class="reveal">
      <h2 style="font-size:1.6rem">Get in touch directly</h2>
      <p class="muted">Prefer a quick chat? Reach out on WhatsApp or email.</p>
      <ul class="contact-list mt-2">
        <li>{icon_box("mail")}<div><b>Email</b><a href="#enquiry" data-email><span data-email-text>Email address</span></a></div></li>
        <li><div class="icon" style="background:#e3f7ea;color:#1fa855">{WA_SVG}</div><div><b>WhatsApp</b><a href="#enquiry" data-wa><span data-wa-text>WhatsApp</span></a></div></li>
        <li>{icon_box("linkedin")}<div><b>LinkedIn</b><a href="#enquiry" data-linkedin>Naomi Mwangi on LinkedIn</a></div></li>
        <li>{icon_box("map")}<div><b>Location</b><span>{CITY} — serving clients locally and remotely (EAT, UTC+3)</span></div></li>
      </ul>
      <a class="btn btn--whatsapp btn--block mt-2" href="#enquiry" data-wa>{WA_SVG} Start a WhatsApp enquiry</a>
      <div class="notice mt-2">{ic("shield")}<p class="mb-0 small">Your details are used only to respond to your enquiry. See the <a href="privacy.html">privacy notice</a>.</p></div>
    </div>

    <div class="form-card reveal" id="enquiry">
      <h2 style="font-size:1.5rem">Project enquiry</h2>
      <p class="muted small">Fields marked <span class="req" style="color:var(--purple-600)">*</span> are required.</p>
      <form name="enquiry" method="POST" action="thank-you.html" data-form data-netlify="true" netlify-honeypot="bot-field" data-success="thank-you.html">
        <input type="hidden" name="form-name" value="enquiry">
        <p class="hp" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <div class="form-grid">
          <div class="field"><label for="e-name">Name <span class="req">*</span></label><input id="e-name" name="name" autocomplete="name" required maxlength="100"><p class="err" role="alert"></p></div>
          <div class="field"><label for="e-business">Business name <span class="req">*</span></label><input id="e-business" name="business_name" autocomplete="organization" required maxlength="120"><p class="err" role="alert"></p></div>
          <div class="field"><label for="e-email">Email address <span class="req">*</span></label><input id="e-email" type="email" name="email" autocomplete="email" required maxlength="160"><p class="err" role="alert"></p></div>
          <div class="field"><label for="e-type">Business type <span class="req">*</span></label>
            <select id="e-type" name="business_type" required data-msg="Please choose your business type.">
              <option value="">Select…</option><option>Sole proprietor / freelancer</option><option>Consultant / coach</option><option>Agency</option>
              <option>Professional services (legal, accounting, advisory)</option><option>Real estate</option><option>Healthcare / wellness (admin)</option>
              <option>Education / training</option><option>NGO / non-profit</option><option>Retail / e-commerce</option><option>SME / other company</option><option>Other</option>
            </select><p class="err" role="alert"></p></div>
          <fieldset class="field full"><legend>Automation needs <span class="req">*</span></legend>
            <div class="checks" data-required-group>{checks}</div>
            <p class="err" role="alert">Please choose at least one option.</p></fieldset>
          <div class="field"><label for="e-budget">Budget range <span class="req">*</span></label>
            <select id="e-budget" name="budget_range" required data-msg="Please choose a budget range.">
              <option value="">Select…</option><option>Under KES 15,000</option><option>KES 15,000 – 30,000</option><option>KES 30,000 – 50,000</option>
              <option>KES 50,000 – 100,000</option><option>Above KES 100,000</option><option>Not sure yet</option>
            </select><p class="err" role="alert"></p></div>
          <div class="field"><label for="e-package">Package of interest</label>
            <select id="e-package" name="package">
              <option value="">No preference</option><option value="starter">Starter</option><option value="professional">Professional</option>
              <option value="business">Business</option><option value="maintenance">Monthly maintenance</option>
            </select></div>
          <div class="field full"><label for="e-info">Additional information</label><textarea id="e-info" name="additional_information" maxlength="3000" placeholder="Tell me about the tasks you'd like to automate, the tools you use and any deadlines."></textarea></div>
          <div class="field full"><label class="consent"><input type="checkbox" name="consent" value="yes" required data-msg="Please confirm to continue."> I agree that my details may be used to respond to this enquiry, as described in the privacy notice.</label><p class="err" role="alert"></p></div>
          <div class="full"><button class="btn btn--primary btn--block" type="submit">Send enquiry {ic("arrow")}</button></div>
        </div>
        <div class="form-status" role="status" aria-live="polite"></div>
      </form>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split split--top">
    <div class="reveal">
      <span class="eyebrow">Consultation</span>
      <h2>Request a free consultation</h2>
      <p class="lead">A 30-minute call to understand your business, discuss what can be automated and outline next steps. No obligation.</p>
      <ul class="check-list">
        <li>Review of your current processes and tools</li>
        <li>Recommendations on what to automate first</li>
        <li>An idea of cost and timeline</li>
      </ul>
      <p class="small muted">Times are in East Africa Time (EAT, UTC+3). I'll confirm by email or WhatsApp.</p>
    </div>
    <div class="form-card reveal" id="consultation">
      <h2 style="font-size:1.5rem">Consultation request</h2>
      <form name="consultation" method="POST" action="thank-you.html" data-form data-netlify="true" netlify-honeypot="bot-field" data-success="thank-you.html">
        <input type="hidden" name="form-name" value="consultation">
        <p class="hp" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <div class="form-grid">
          <div class="field"><label for="c-name">Name <span class="req">*</span></label><input id="c-name" name="name" autocomplete="name" required maxlength="100"><p class="err" role="alert"></p></div>
          <div class="field"><label for="c-business">Business name</label><input id="c-business" name="business_name" autocomplete="organization" maxlength="120"></div>
          <div class="field"><label for="c-email">Email address <span class="req">*</span></label><input id="c-email" type="email" name="email" autocomplete="email" required maxlength="160"><p class="err" role="alert"></p></div>
          <div class="field"><label for="c-phone">Phone / WhatsApp</label><input id="c-phone" type="tel" name="phone" autocomplete="tel" maxlength="30" placeholder="+254…"></div>
          <div class="field"><label for="c-date">Preferred date <span class="req">*</span></label><input id="c-date" type="date" name="preferred_date" required><p class="err" role="alert"></p></div>
          <div class="field"><label for="c-time">Preferred time (EAT)</label>
            <select id="c-time" name="preferred_time"><option>Morning (9am – 12pm)</option><option>Afternoon (12pm – 3pm)</option><option>Late afternoon (3pm – 6pm)</option><option>Flexible</option></select></div>
          <div class="field full"><label for="c-method">Meeting type</label>
            <select id="c-method" name="meeting_type"><option>Google Meet</option><option>Zoom</option><option>WhatsApp call</option><option>Phone call</option></select></div>
          <div class="field full"><label for="c-topic">What would you like to discuss? <span class="req">*</span></label><textarea id="c-topic" name="topic" required maxlength="2000" placeholder="E.g. I spend two hours a day on client emails and want to automate enquiry follow-ups."></textarea><p class="err" role="alert"></p></div>
          <div class="field full"><label class="consent"><input type="checkbox" name="consent" value="yes" required data-msg="Please confirm to continue."> I agree that my details may be used to arrange this consultation.</label><p class="err" role="alert"></p></div>
          <div class="full"><button class="btn btn--navy btn--block" type="submit">Request consultation {ic("arrow")}</button></div>
        </div>
        <div class="form-status" role="status" aria-live="polite"></div>
      </form>
    </div>
  </div>
</section>
'''
    page("contact.html",
         f"Contact & Book a Consultation | {BRAND} — AI Automation",
         "Contact Naomi Mwangi about AI automation for your business. Send an enquiry, request a free consultation or message on WhatsApp.",
         body, jsonld={"@context": "https://schema.org", "@type": "ContactPage", "name": "Contact", "url": SITE_URL + "/contact.html"},
         extra_scripts="<script>(function(){var d=document.getElementById('c-date');if(d){var t=new Date();t.setDate(t.getDate()+1);d.min=t.toISOString().slice(0,10);}})();</script>")


def build_demo():
    pipes = [("mail", "Gmail"), ("zap", "Make.com"), ("brain", "AI processing"), ("sheet", "Sheets / Calendar"), ("hand", "Human approval")]
    pipehtml = '<span class="pipe-arrow">→</span>'.join(f'<span class="pipe">{ic(i)}{t}</span>' for i, t in pipes)
    body = f'''
<div class="demo-banner" role="note">{ic("alert")}<span><strong>Interactive demonstration</strong> using sample emails. Runs entirely in your browser — no real email is read or sent.</span></div>
<section class="page-hero" style="padding:3rem 0">
  <div class="container">
    <p class="breadcrumb"><a href="index.html">Home</a> / <a href="ai-executive-assistant.html">AI Assistant</a> / Live demo</p>
    <span class="eyebrow">Live demo</span>
    <h1>AI Executive Assistant — interactive demo</h1>
    <p>Select an email and run the assistant, or process the whole inbox. Watch it summarise, prioritise, extract tasks, draft replies for approval, update the tracker and prepare your daily briefing.</p>
  </div>
</section>
<section class="section section--soft" style="padding-top:2.5rem">
  <div class="container">
    <div class="demo-panel mb-0" style="margin-bottom:1.2rem">
      <div class="demo-panel__body" style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between">
        <div class="pipeline" aria-label="Processing pipeline">{pipehtml}</div>
        <div class="btn-row">
          <button class="btn btn--primary btn--sm" id="btn-run" type="button">Process entire inbox</button>
          <button class="btn btn--navy btn--sm" id="btn-brief" type="button" disabled>Generate daily briefing</button>
          <button class="btn btn--outline btn--sm" id="btn-reset" type="button">Reset</button>
        </div>
      </div>
    </div>
    <div class="grid grid--3" style="margin-bottom:1.2rem">
      <div class="card" style="padding:1.1rem 1.3rem"><p class="small muted mb-0">Processed</p><p class="mb-0" style="font-family:var(--font-head);font-size:1.6rem;color:var(--ink)" id="c-processed">0/6</p></div>
      <div class="card" style="padding:1.1rem 1.3rem"><p class="small muted mb-0">High priority</p><p class="mb-0" style="font-family:var(--font-head);font-size:1.6rem;color:var(--ink)" id="c-high">0</p></div>
      <div class="card" style="padding:1.1rem 1.3rem"><p class="small muted mb-0">Tasks extracted</p><p class="mb-0" style="font-family:var(--font-head);font-size:1.6rem;color:var(--ink)" id="c-tasks">0</p></div>
    </div>
    <div class="demo">
      <div class="demo-panel">
        <div class="demo-panel__head"><h3>{ic("inbox")} Inbox (sample)</h3><span class="tag tag--l">Gmail</span></div>
        <ul class="inbox" id="inbox" aria-label="Sample inbox"></ul>
      </div>
      <div class="demo-panel" id="result-panel">
        <div class="demo-panel__head"><h3>{ic("brain")} Assistant output</h3><span class="tag tag--l">AI</span></div>
        <div class="demo-panel__body"><div class="result-grid" id="result" aria-live="polite">
          <div class="result result--wide empty">{ic("inbox")}<p class="mb-0">Select an email from the inbox to begin, or click <strong>Process entire inbox</strong>.</p></div>
        </div></div>
      </div>
    </div>
    <div class="briefing mt-2" id="briefing" hidden aria-live="polite"></div>
    <div class="demo-panel mt-2">
      <div class="demo-panel__head"><h3>{ic("sheet")} Google Sheets tracker (sample)</h3><span class="tag tag--low-l">Auto-updated</span></div>
      <div style="overflow-x:auto">
        <table class="sheet">
          <thead><tr><th scope="col">Received</th><th scope="col">From</th><th scope="col">Subject</th><th scope="col">Priority</th><th scope="col">Category</th><th scope="col">Tasks</th><th scope="col">Follow-up</th><th scope="col">Status</th></tr></thead>
          <tbody id="sheet-body"><tr id="sheet-empty"><td colspan="8" class="center muted">No rows yet — process an email to log it here.</td></tr></tbody>
        </table>
      </div>
    </div>
  </div>
</section>
{cta_band("Want this running on your real inbox?", "Book a consultation and I'll show you how the assistant would work with your email, tools and processes.")}
<div class="toast" id="toast" role="status" aria-live="polite"></div>
'''
    page("demo.html",
         f"Live Demo — AI Executive Assistant | {BRAND}",
         "Try an interactive demo of the AI Executive Assistant: sample emails summarised, prioritised, turned into tasks and draft replies, logged to a tracker, with a daily briefing.",
         body, extra_scripts='<script src="assets/js/demo.js"></script>')


def build_misc():
    page("thank-you.html", f"Thank You | {BRAND}", "Thank you for your enquiry.", f'''
<section class="page-hero" style="text-align:center">
  <div class="container">
    <div class="icon" style="margin:0 auto 1.2rem;width:64px;height:64px;background:rgba(124,92,255,.18);color:#b9a8ff">{ic("check")}</div>
    <h1 style="margin-inline:auto">Thank you — your message has been received</h1>
    <p style="margin-inline:auto">I'll review your details and reply within one working day. If your request is urgent, message me on WhatsApp.</p>
    <div class="btn-row justify-center mt-2">
      <a class="btn btn--whatsapp" href="contact.html" data-wa>{WA_SVG} WhatsApp</a>
      <a class="btn btn--ghost" href="demo.html" data-demo>{ic("play")} Explore the live demo</a>
      <a class="btn btn--ghost" href="index.html">Back to home</a>
    </div>
  </div>
</section>''', noindex=True)

    page("404.html", f"Page Not Found | {BRAND}", "The page you were looking for could not be found.", f'''
<section class="page-hero" style="text-align:center">
  <div class="container">
    <span class="eyebrow">Error 404</span>
    <h1 style="margin-inline:auto">This page couldn't be found</h1>
    <p style="margin-inline:auto">The link may be outdated. Try one of these instead.</p>
    <div class="btn-row justify-center mt-2">
      <a class="btn btn--primary" href="index.html">Home</a>
      <a class="btn btn--ghost" href="services.html">Services</a>
      <a class="btn btn--ghost" href="contact.html">Contact</a>
    </div>
  </div>
</section>''', noindex=True)

    page("privacy.html", f"Privacy Notice | {BRAND}", "How enquiry and consultation form data is collected and used.", f'''
{page_hero("Privacy Notice", "Privacy", "Privacy notice", "How your information is handled when you contact me through this website.")}
<section class="section">
  <div class="container prose">
    <p class="small muted">Last updated: <span class="placeholder">[date]</span></p>
    <h2>Who I am</h2>
    <p>This website is operated by Naomi Mwangi, AI Automation Services, based in Nairobi, Kenya. Contact: <a href="contact.html" data-email><span data-email-text>see contact page</span></a>.</p>
    <h2>What information is collected</h2>
    <p>When you submit the enquiry or consultation form, the details you provide are collected: name, business name, email address, phone number (optional), business type, automation needs, budget range, preferred meeting details and any additional information you choose to share.</p>
    <h2>How it is used</h2>
    <p>Your information is used only to respond to your enquiry, arrange consultations and prepare proposals. It is not sold or shared for marketing purposes.</p>
    <h2>How it is processed and stored</h2>
    <p>Form submissions are delivered through the website's form service <span class="placeholder">[Netlify Forms / Formspree / FormSubmit — keep the one you use]</span> and by email. Information is kept only as long as needed to respond and for reasonable business records.</p>
    <h2>Your rights</h2>
    <p>In line with the Kenya Data Protection Act, 2019, you may request access to, correction of or deletion of your personal data at any time by contacting me.</p>
    <h2>Client automation projects</h2>
    <p>Automations built for clients run in the client's own accounts. The data processed, access granted and retention are agreed with each client before any work begins.</p>
    <p class="small muted mt-2"><span class="placeholder">This is a general template, not legal advice. Review it to make sure it matches how you actually handle data.</span></p>
  </div>
</section>''')


def build_seo_files():
    pages = [("", "1.0", "weekly"), ("services.html", "0.9", "monthly"), ("ai-executive-assistant.html", "0.9", "monthly"),
             ("demo.html", "0.8", "monthly"), ("how-it-works.html", "0.7", "monthly"), ("pricing.html", "0.9", "monthly"),
             ("about.html", "0.7", "monthly"), ("contact.html", "0.8", "monthly"), ("privacy.html", "0.3", "yearly")]
    today = datetime.date.today().isoformat()
    urls = "".join(f"  <url><loc>{SITE_URL}/{p}</loc><lastmod>{today}</lastmod><changefreq>{c}</changefreq><priority>{pr}</priority></url>\n" for p, pr, c in pages)
    with open(os.path.join(OUT, "sitemap.xml"), "w") as f:
        f.write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
    with open(os.path.join(OUT, "robots.txt"), "w") as f:
        f.write(f"User-agent: *\nAllow: /\nDisallow: /thank-you.html\n\nSitemap: {SITE_URL}/sitemap.xml\n")


if __name__ == "__main__":
    build_home(); build_services(); build_product(); build_process(); build_pricing()
    build_about(); build_contact(); build_demo(); build_misc(); build_seo_files()
    print("Site built in", OUT)
