# Nutrition Codes Academy — Changes Log

## Session: 2026-05-27

---

### 1. Bug Fixes & Code Quality

#### Dev Server — Video URL Decoding (CRITICAL FIX)
- **File:** `dev-server.js`
- **Problem:** Videos with spaces in filenames (e.g. `Shivam Sharma.mp4`) were referenced in HTML as URL-encoded paths (`Shivam%20Sharma.mp4`). The server was doing a literal file lookup without decoding the URL, so videos never loaded.
- **Fix:** Added `decodeURIComponent()` around the URL path lookup so the server correctly resolves filenames with spaces.

#### Contact Form — Submissions Were Being Lost (CRITICAL FIX)
- **File:** `contact.html`
- **Problem:** The form had `data-netlify="true"` attributes but no `action` URL. `contact.js` sends to `form.action`, which resolved to the current page — every submission was silently dropped.
- **Fix:** Added `action="https://formsubmit.co/ajax/nutritioncodes0@gmail.com"`, replaced Netlify honeypot with FormSubmit's `_honey` field, added `_subject` and `_template` hidden inputs.
- **Note:** FormSubmit requires a one-time confirmation click from `nutritioncodes0@gmail.com` on first submission.

#### `contact.js` — Missing `defer`
- **File:** `contact.html`
- **Problem:** `contact.js` was the only script without a `defer` attribute, making it render-blocking.
- **Fix:** Added `defer` to the script tag.

---

### 2. Duplicate Files Removed

Every HTML page, PDF, README, sitemap, robots.txt, and .gitignore had an accidental duplicate with ` 2` in the name (e.g. `index 2.html`). These were leftover from an iCloud or copy-paste operation. All removed:

```
404 2.html       about 2.html      blog 2.html
contact 2.html   curriculum 2.html index 2.html
testimonials 2.html  README 2.md   robots 2.txt
sitemap 2.xml    NC Course Guide 2.pdf  .gitignore 2
```

---

### 3. Mentor Grid Layout Fixed

- **File:** `about.html`
- **Problem:** The "Meet Your Mentors" section used `xl:grid-cols-5`, causing 5 cards in one row and the 6th card orphaned on its own row.
- **Fix:** Removed `xl:grid-cols-5` — grid now stays at `lg:grid-cols-3` for a clean 2 rows × 3 columns layout.

---

### 4. Course Guide Modal — Email Flow (index.html + curriculum.html)

**Old behaviour:** User fills the form → FormSubmit notifies admin → browser auto-downloads the PDF.

**New behaviour:** User fills the form → FormSubmit notifies admin → FormSubmit sends a branded email to the user's inbox with:
- NCA overview (what the academy is, 300+ scholars, science-first approach)
- A direct link to download the course guide PDF
- Contact details for follow-up

**Changes made:**
- Updated `_autoresponse` hidden input with full NCA overview text and PDF link
- Removed the browser PDF auto-download JS (`link.click()` code)
- Modal title changed from "Download Course Guide" → "Get the NCA Course Guide"
- Success message changed from "Your PDF is downloading now!" → "Check your inbox!"
- Button icon changed from `download` → `send`

---

### 5. Blog Newsletter — Removed Alert Popup

- **File:** `blog.html`
- **Problem:** The newsletter subscribe button fired a browser `alert()` dialog — jarring and unprofessional.
- **Fix:** Replaced with a styled inline success message (`id="newsletter-success"`) that appears in-place when the form is submitted.

---

### 6. Video Poster URL Encoding

- **File:** `testimonials.html`
- **Problem:** Poster image paths with spaces and special characters (e.g. `Jimmy Khatter 2.jpg`, `Meeth Jarecha (1).jpg`) were not URL-encoded, which could fail in strict server environments.
- **Fix:** URL-encoded all 14 poster paths with spaces.

---

### 7. SEO Fixes

#### Removed Broken OG / Twitter Social Share Images
- **Files:** All 7 pages (`index`, `about`, `curriculum`, `testimonials`, `contact`, `blog`, `404`)
- **Problem:** All pages referenced `og:image` and `twitter:image` tags pointing to non-existent files (e.g. `og-home.jpg`), causing broken previews when sharing links on WhatsApp, LinkedIn, or Twitter.
- **Fix:** Removed all `og:image` and `twitter:image` meta tags. Add them back once proper 1200×630px images are created.

#### 404 Page — Added `noindex`
- **File:** `404.html`
- **Problem:** The 404 error page had no `noindex` directive, meaning search engines could crawl and index it.
- **Fix:** Added `<meta name="robots" content="noindex, nofollow">`.

---

### 8. Project Configuration

#### `package.json` — Added Start Script
```json
"scripts": {
  "start": "node dev-server.js"
}
```
Run the local dev server with `npm start` instead of `node dev-server.js`.

#### `.gitignore` — Added `node_modules`
`node_modules/` and `package-lock.json` added to `.gitignore` so they are never committed.

---

### 9. Known Issues Still Open

| Issue | Notes |
|-------|-------|
| `Dr_Sai.jpg` missing | Add to `assets/images/` — faculty card shows dark blue placeholder |
| `Himanshu.jpg` missing | Same as above |
| OG social share images | Create 1200×630px JPGs for each page and re-add to meta tags |
| Blog article links | All article links are `href="#"` — placeholder content only |
| Tailwind CDN in `<head>` | Render-blocking on every page — consider compiling Tailwind for production |

---

### Files Changed Summary

| File | Changes |
|------|---------|
| `dev-server.js` | URL decode fix for video filenames |
| `package.json` | Added `start` script |
| `.gitignore` | Added `node_modules`, `package-lock.json` |
| `index.html` | Course guide email flow, OG tags removed |
| `about.html` | Mentor grid 2×3 fix, OG tags removed |
| `curriculum.html` | Course guide email flow, OG tags removed |
| `contact.html` | Form action URL, defer on script, OG tags removed |
| `blog.html` | Newsletter alert replaced, OG tags removed |
| `testimonials.html` | Poster URL encoding, OG tags removed |
| `404.html` | noindex added |
| `assets/images/` | Added Amandeep, Ashley, Rishabh, Siddhant, course-cards set |
