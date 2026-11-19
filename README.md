# AI Automation Services — Website

A fast, static, mobile-friendly website for Naomi Mwangi's AI Automation Services.
Plain HTML, CSS and JavaScript — no frameworks, no build step, free to host.

## What's included

| Page | File |
|---|---|
| Home | `index.html` |
| Services (6 detailed services) | `services.html` |
| Featured product — AI Executive Assistant | `ai-executive-assistant.html` |
| AI Executive Assistant demo app | `app/` (`demo.html` redirects here) |
| How It Works (7-step process) | `how-it-works.html` |
| Pricing (Starter / Professional / Business + maintenance) | `pricing.html` |
| About | `about.html` |
| Contact (enquiry form + consultation form + WhatsApp) | `contact.html` |
| Thank-you, Privacy notice, 404 | `thank-you.html`, `privacy.html`, `404.html` |

SEO: unique titles and descriptions, canonical URLs, Open Graph/Twitter cards, structured data (JSON-LD), `sitemap.xml`, `robots.txt`.

---

## 1. Before you publish — fill in your details (5 minutes)

### a) Contact details → `assets/js/config.js`
Open it in any text editor and change:

- `whatsappNumber` — your number, digits only, e.g. `"254712345678"`. **Every WhatsApp button uses this.**
- `email` — your professional email address.
- `bookingUrl` *(optional)* — a Calendly / Google Calendar booking link. If empty, "Book a Consultation" goes to the consultation form.
- `formProvider` — how forms are delivered (see section 3).

No rebuild is needed after editing this file.

### b) Your domain → `build.py` (or find-and-replace)
Your pages currently use `https://yomie-commits.github.io/automationservices` in their SEO tags. If you move to Netlify or a custom domain, Once you know your real address, either:

- **Option A:** change `SITE_URL` at the top of `build.py`, then run `python3 build.py`, **or**
- **Option B:** in VS Code use *Edit → Replace in Files* to replace `https://your-site.netlify.app` with your address across all files.

### c) Remaining placeholders
Search the project for `placeholder` — these highlighted spots are for details only you can supply:
- About page: your photo (save as `assets/img/naomi.jpg`, then uncomment the `<img>` line in `about.html`) and any verifiable experience/certifications.
- Pricing page: optional starting monthly maintenance rate.
- Privacy page: "last updated" date and which form service you use.

Remove the yellow placeholder boxes once filled in.

---

## 2. Deploy

### Option A — Netlify (recommended: forms work automatically)
1. Create a free account at <https://app.netlify.com>.
2. Go to **Add new site → Deploy manually** and drag the whole website folder onto the page.
3. Your site is live at `https://something.netlify.app`. Rename it under **Site configuration → Change site name** (e.g. `naomi-automation.netlify.app`).
4. Forms: go to **Forms**, enable form detection if prompted, and re-deploy once. Then under **Forms → Form notifications** add an email notification so each submission is emailed to you.
5. Custom domain (optional): **Domain management → Add a domain**, then follow Netlify's DNS instructions. HTTPS is free and automatic.

*Updating later:* drag the folder in again under **Deploys**, or connect a GitHub repository for automatic deploys.

### Option B — GitHub Pages (free)
1. Create a new public repository, e.g. `ai-automation-site`.
2. Upload all files (keep the folder structure; include `.nojekyll`).
3. **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root → Save.**
4. Your site appears at `https://<your-username>.github.io/ai-automation-site/` within a minute or two.
5. **Forms:** Netlify Forms do not work on GitHub Pages — switch `formProvider` to `"formspree"` or `"formsubmit"` (section 3).

### Option C — InfinityFree / cPanel hosting
Upload all files to `htdocs` (or `public_html`) with the File Manager or FTP. Use `"formspree"` or `"formsubmit"` for forms.

---

## 3. Forms — choose how submissions reach you

Set `formProvider` in `assets/js/config.js`:

| Setting | Works on | Setup |
|---|---|---|
| `"netlify"` (default) | Netlify only | Nothing extra. View submissions in Netlify → Forms; add an email notification. |
| `"formspree"` | Any host | Create a free form at <https://formspree.io>, copy its endpoint (e.g. `https://formspree.io/f/abcdwxyz`) into `formspreeEndpoint`. |
| `"formsubmit"` | Any host | Put your real address in `email`. The first submission triggers an activation email from FormSubmit — click the link once. |

Both forms include validation, a spam honeypot, a consent checkbox and a redirect to the thank-you page. If delivery ever fails, visitors see a message with your WhatsApp and email instead of a silent failure.

**Always send yourself a test enquiry after deploying.**

---

## 4. Test checklist after going live
- [ ] Every page opens from the menu (desktop and phone)
- [ ] WhatsApp buttons open a chat with *your* number
- [ ] Email links show your address
- [ ] Enquiry form → thank-you page → submission received
- [ ] Consultation form → thank-you page → submission received
- [ ] Demo app: open an email, approve a draft, analyse an example email, accept a calendar suggestion, open the daily briefing
- [ ] Share the home page link on WhatsApp/LinkedIn and check the preview image

## 5. SEO after launch
1. Add the site to **Google Search Console** and submit `https://YOUR-DOMAIN/sitemap.xml`.
2. Create/update your **Google Business Profile** with the website link.
3. Add the website to your LinkedIn profile.

## 6. Editing content
- Text that appears on one page: edit that page's `.html` file directly.
- Header, footer, page titles/descriptions or structured data across all pages: edit `build.py` and run `python3 build.py`.
  *(Running `build.py` regenerates the HTML files, so if you use it, make your text edits in `build.py` rather than the HTML files.)*
- Colours and fonts: the variables at the top of `assets/css/styles.css`.
- Demo data (emails, events, follow-ups, examples): `app/data.js`.

## 7. The AI Executive Assistant demo app (`app/`)

A standalone, SaaS-style demo you can share with clients: `https://YOUR-SITE/app/`

| Section | What visitors can do |
|---|---|
| Overview | KPIs (emails processed, important emails, pending tasks, deadlines, follow-ups, tasks completed), what needs attention, recent activity, category and priority charts, today's schedule |
| Smart Inbox | Filters (All, Urgent, Important, Requires response, Meetings, General information), search, per-email summary and recommended action |
| Email analysis | Summary, intent + confidence, priority with reasons (and manual override), extracted people/organisations/amounts/references/dates/locations, deadlines, recommended action, tasks, calendar suggestion with clash detection, suggested reply in three tones — approve & send (simulated) |
| Analyse an email | Write or paste a fictional email (or pick an example), watch the pipeline run, view the structured JSON output, add it to the inbox |
| Tasks, Follow-ups, Calendar, Daily briefing, Settings | Complete/add/delete tasks, draft and send follow-ups, accept/dismiss meeting suggestions, add events, copy the briefing, set VIP senders, urgent keywords and default tone |

Files: `app/index.html`, `app/app.css`, `app/app.js` (interface), `app/engine.js` (analysis), `app/data.js` (fictional data), `app/config.js` (settings).

**Demonstration engine.** By default analysis is done by a transparent, rule-based engine in the visitor's browser and the interface labels it clearly — no AI service is called and nothing leaves the page. Each visitor's changes are saved in their own browser; *Settings → Reset demo data* restores the original.

**Interactive extras.** A guided tour starts on a visitor's first visit (replay it from the **?** button or the sidebar). Live mode delivers a new sample email every 40–75 seconds, and the bell collects notifications. You can edit the summary, extracted details and deadlines, and switch tasks between list and board views. Board cards and calendar events can be dragged. On touch screens, use the status menu or click an event to edit it. Draft replies "type" themselves when you change tone or regenerate.

**Live AI (Make.com).** The *Analyse an email* page has a **Live AI / Demo engine** switch. Live AI sends the email (form-encoded, no API keys involved) to the Make webhook set in `app/config.js` → `aiEndpoint`. That runs the Make scenario **"EA - Website demo: live AI email analysis"** (Custom webhook → Make AI "Ask" → Webhook response). The scenario returns JSON, and the app validates every field before showing it. Each visitor gets `aiDailyLimit` (default 8) live analyses per day. The sample inbox never calls the AI, so browsing the demo costs nothing. If the scenario is off or slow (`aiTimeoutSeconds`), the app shows the demonstration engine and says so.

- The scenario must be **active** in Make to answer. Each live analysis uses a few Make operations plus AI credits from Make's AI provider.
- The webhook only sends its response to `https://yomie-commits.github.io`. If you move the site to another domain, update the `Access-Control-Allow-Origin` header in the scenario's Webhook response module.
- Set `aiEndpoint: ""` to switch live AI off entirely.

Expected JSON (all fields optional — missing ones fall back to the demo engine): `category`, `intent`, `confidence`, `priority` (Urgent/Important/Normal/Low), `reasons`, `requiresResponse`, `sentiment`, `summary`, `shortSummary`, `entities`, `deadlines`, `tasks`, `event`, `followup`, `action`, `actionType`, `responseTime`, `drafts` ({Formal, Friendly, Concise}). **Never put an AI API key in the website files** — they are public.
