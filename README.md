# AI Automation Services — Website

A fast, static, mobile-friendly website for Naomi Mwangi's AI Automation Services.
Plain HTML, CSS and JavaScript — no frameworks, no build step, free to host.

## What's included

| Page | File |
|---|---|
| Home | `index.html` |
| Services (6 detailed services) | `services.html` |
| Featured product — AI Executive Assistant | `ai-executive-assistant.html` |
| Interactive live demo | `demo.html` |
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
Your pages contain `https://your-site.netlify.app` in their SEO tags. Once you know your real address, either:

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
- [ ] Live demo: "Process entire inbox", approve a draft, "Generate daily briefing"
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
- Demo emails: the `EMAILS` list in `assets/js/demo.js`.
