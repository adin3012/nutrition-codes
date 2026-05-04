# Nutrition Codes — Project Notes for Claude

## What This Project Is
A static HTML/CSS/JS website for **Nutrition Codes** — an elite health coach certification program. 5 pages: `index.html`, `about.html`, `testimonials.html`, `blog.html`, `contact.html`. Uses GSAP + ScrollTrigger for animations, Lenis for smooth scroll, SplitType for text reveals.

## How to Run Locally
```bash
cd /Users/apple/Desktop/Projects/nutrition-codes
python3 -m http.server 8080
# Visit http://localhost:8080
```

## Project Structure
```
nutrition-codes/
├── index.html / about.html / testimonials.html / blog.html / contact.html
├── css/
│   ├── style.css        ← global vars, reset, navbar, footer, glassmorphism
│   ├── home.css         ← hero, stats, modules, testimonials snippet, faculty, CTA
│   ├── about.css        ← bio rows, values grid
│   ├── testimonials.css ← video grid, written reviews grid
│   ├── blog.css         ← blog layout (1fr 400px), post grid, sidebar
│   └── contact.css      ← contact layout, form styles
├── js/
│   ├── main.js          ← GSAP animations, Lenis scroll, nav toggle, counters
│   └── contact.js       ← Netlify form async submit handler
├── assets/
│   ├── images/
│   │   ├── Amandeep.png / Ashley.png / Rishabh.png / Siddhant.png  ← faculty photos
│   │   └── testimonials/  ← 13 reviewer avatar images (all real photos now)
│   ├── logos/             ← SVG + PNG logos
│   ├── fonts/             ← Manrope + Sora variable fonts
│   └── videos/            ← testimonial MP4s
├── PHOTOS & MEDIA/        ← source assets (not served)
└── Testimonial images/    ← source folder for testimonial avatars
```

## Key Architecture Decisions
- **Nav overlay**: `main.js` unconditionally moves `.nav-links` to `document.body` on every page. The nav is a fullscreen overlay (hamburger on all screen sizes by design). This is intentional.
- **GSAP animations**: All elements start at `opacity:0` via GSAP `from()`. They animate in on scroll via ScrollTrigger. Do NOT add `opacity:0` in CSS — let GSAP handle it.
- **Netlify forms**: Contact form uses `data-netlify="true"`. The JS in `contact.js` intercepts submit and posts via fetch. `#form-status` div shows success/error.
- **CSS variables**: All defined in `style.css :root`. Includes `--bg-surface`, `--bg-surface-alt`, `--shadow-sm`, `--shadow-md` (added in session).

## Changes Made in Session (May 2026)

### Images Fixed
- Amandeep's photo was missing → copied from `PHOTOS & MEDIA/Amandeep_image.png` to `assets/images/Amandeep.png`
- Siddhant's photo was landscape (595×491) → center-cropped to portrait (368×491)
- 13 testimonial avatars were missing → copied from `Testimonial images/` folder, renamed to match HTML references

### HTML Fixes (all 5 pages)
- Added `<meta name="description">` to all pages (SEO)
- Added `Blog` link to top navigation on: index, about, contact, testimonials
- Added `Blog` link to footer navigation on: index, about, contact, testimonials

### contact.html Fixes
- Added `id="contact-form"` to the form (contact.js uses `getElementById`)
- Added `<div id="form-status">` after submit button (JS writes success/error here)
- Linked `contact.js` via `<script src="js/contact.js"></script>`

### CSS Fixes
**style.css**
- Added missing CSS variables: `--bg-surface`, `--bg-surface-alt`, `--shadow-sm`, `--shadow-md`
- Added `overflow-x: hidden; max-width: 100%` to `html` element (fixes mobile horizontal overflow caused by mesh-bg scale animation)

**home.css**
- Reduced section padding: 160px → 100px (modules, testimonials, faculty); 200px → 140px (CTA)
- Added CSS to center the lone 5th module card: `.modules-grid .module-card:last-child:nth-child(4n+1)`
- Reduced hero title font on mobile: `clamp(2.8rem, 8vw, 4rem)` → `clamp(2.2rem, 9vw, 3.2rem)`
- Made hero buttons stack vertically on mobile with `flex-direction: column`
- Added `padding: 32px 24px` for module cards on mobile

**about.css**
- Fixed bio photo height inconsistency: changed from `height: 100%; min-height: 400px` to fixed `height: 460px; width: 350px` so all 4 coach bios have the same photo height

**contact.css**
- Added `#form-status` success/error styles
- Added `flex-direction: column` on `.form-row` for mobile
- Fixed contact layout width on mobile with `max-width: 100%`

**blog.css**
- Updated `.blog-layout` grid: `1fr 350px` → `1fr 400px` (matches actual sidebar width)
- Added proper mobile stacking at 768px: single column post grid, stacked sidebar
- Added `width: 100%; max-width: 100%` to sidebar at mobile breakpoints

**blog.html**
- Removed inline `style` from `.blog-layout` div (was hardcoded `grid-template-columns: 1fr 400px; gap: 64px` overriding CSS)
- Removed inline `style` from `.post-grid` div (was hardcoded `grid-template-columns: repeat(2, 1fr); gap: 40px` overriding CSS)

## Still Pending (Needs Client Input)
- **Favicon**: `assets/icons/` folder is empty — no favicon file provided
- **Phone number**: Contact page shows `+91 98765 43210` — placeholder, needs real number
- **YouTube & LinkedIn URLs**: All social icon links are `href="#"` — need real profile URLs
- **Blog article pages**: All article links are `href="#"` — not real pages yet
- **Footer program links**: Nutrition Science / Exercise Mechanics / Business Mentorship links are `href="#"`

## CSS Variable Reference
```css
--accent:        #40F39A   /* brand green */
--text-main:     #0B1310
--text-muted:    #4A5A55
--bg-main:       #FAFCFB
--bg-surface:    rgba(255,255,255,0.7)
--glass-bg:      rgba(255,255,255,0.6)
--radius-lg:     32px
--max-width:     1400px
```
