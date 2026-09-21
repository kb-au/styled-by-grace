# Styled by Grace – Home Styling & Room Makeovers

A fully static website: plain HTML, CSS and JavaScript. **No server, no database, no build step, no paid services.**
Open **`index.html`** in any browser to view it (fonts load from free Google Fonts when online).

**Business name:** Styled by Grace – Home Styling & Room Makeovers  (brand: *Styled by Grace*)
**Phone:** 0468 359 978  (`tel:+61468359978`)  ·  Sydney & Surrounds

```
index.html      All page content + SEO metadata  (edit text here)
styles.css      Design system + layout           (brand colours are variables at the top)
script.js       Menu, gallery, slider, FAQ, and the text-message enquiry form
assets/
  img/          Logo (extracted from the flyer, transparent), favicon, and the two photos cropped from the flyer
  gallery/      Placeholder interior photos (royalty-free, Unsplash licence)
.gitignore      Keeps the two reference images out of the published site (see below)
1.jpeg 2.jpeg   Your original design-reference images (untouched; not needed to run the site)
```

## How the enquiry form works (no backend)

A static website can't send messages by itself, and you don't want to pay for a form service — so the form uses the visitor's **own phone**:

1. The visitor fills in the form. Name, email and project type are required; phone and message are optional.
2. On **Text My Enquiry**, the form is validated and a clear message is built:
   ```
   Hi Styled by Grace, I'd like to make an enquiry.

   Name: …
   Project type: …
   Phone: …            (only if given)
   Email: …
   Message: …          (only if given)
   ```
3. **On a phone or tablet** the messaging app opens straight away, addressed to **+61468359978**, with that text pre-filled.
   **The visitor must still press Send.** The site never says "sent" — it says *"Your message is ready. Please press Send in your messaging app…"*.
4. **If the messaging app doesn't open** (e.g. on a computer), the panel shows the message in a box with a **Copy message** button, an **Open my messaging app** button, and a **Call 0468 359 978** button. Nothing they typed is lost, and **Edit my enquiry** returns to the form with everything still filled in.
5. **With JavaScript off**, the form is hidden and replaced by a "call or text 0468 359 978" message.

The number is set in one place in `script.js` (`CONFIG.PHONE_TEL` / `CONFIG.PHONE_DISPLAY`) and in the `tel:`/`sms:` links in `index.html`. There is no email address on the site, because no business email has been confirmed.

## Things to replace

| What | Where |
|---|---|
| **Portfolio photos** | Overwrite the files in `assets/gallery/` (keep the filenames) or change the `src` + `alt` on each `<figure class="tile">` in `index.html`. Categories use `data-cat="living bedrooms styling stay decor ba"`. |
| **Before & After** | The slider in the gallery (`class="ba"`) uses two *sample* images — replace `before-sample.jpg` / `after-sample.jpg` with one real project. |
| **Testimonials** | Section "Kind words" — replace each quote/name/suburb and delete the `quote__tag` line ("Example testimonial…"). |
| **Social links** | Footer — replace each `href="#"` (Instagram / Facebook / Pinterest). |
| **Share image (`og:image`)** | In `<head>`, once the site is live, change it to the full URL, e.g. `https://YOUR-NAME.github.io/styled-by-grace/assets/img/living-room.jpg`. |

## Deploy for free (GitHub Pages)

**What to publish:** the contents of this folder (`D:\Vinay\Design`) — `index.html`, `styles.css`, `script.js`, and the `assets` folder (plus `README.md` if you like).
`1.jpeg` and `2.jpeg` are only design references; you don't need to publish them (`.gitignore` already leaves them out if you use git).
**Build step:** none. All file paths are relative, so it works at the site root or under a sub-folder like `/styled-by-grace/`.

**Option A — in the browser, no software needed**
1. Create a free account at <https://github.com>.
2. Click **New repository** → name it e.g. `styled-by-grace` → set it to **Public** → **Create repository**.
3. On the empty repository page choose **uploading an existing file**, then drag in `index.html`, `styles.css`, `script.js` and the whole `assets` folder (not `1.jpeg`/`2.jpeg`) → **Commit changes**.
4. Go to **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)** → **Save**.
5. Wait 1–2 minutes and refresh that page. It will show your live address.

**Option B — with git** (from `D:\Vinay\Design`)
```
git init
git add .
git commit -m "Styled by Grace website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/styled-by-grace.git
git push -u origin main
```
then do step 4 above.

**Your free address:** `https://YOUR-USERNAME.github.io/styled-by-grace/`
(If you name the repository exactly `YOUR-USERNAME.github.io`, the address is simply `https://YOUR-USERNAME.github.io/`.)

**Cost:** GitHub Pages is free for **public** repositories on a free GitHub account (private repositories need a paid plan). HTTPS is included free. Hosting a **custom domain** on GitHub Pages is also free, but *buying* a domain name (e.g. a `.com.au`) is a separate yearly fee paid to a domain registrar — it is optional, and nothing here purchases one.
**Other free hosts** that also work with this folder unchanged: Cloudflare Pages (direct upload) and Netlify (drag-and-drop the folder).

## Brand colours

Change once in `:root` at the top of `styles.css` — `--rose-ink`, `--blush`, `--honey`, `--gold`, `--charcoal`, etc. Text colours were chosen to meet WCAG AA contrast, so re-check contrast if you change them.

## Image credits

`assets/img/logo.png` is the Styled by Grace logo lifted directly from the supplied flyer (`1.jpeg`) onto a transparent background — the full lockup, unaltered. It sits on a white plate in the header and footer because its navy lettering was designed for a light background. `favicon.png` / `apple-touch-icon.png` use the house + sprig from the same logo.
`assets/img/living-room.jpg` and `bedroom.jpg` are cropped from the flyer with its overlay text removed.
`assets/gallery/*` are placeholder photographs from Unsplash (free to use under the Unsplash licence). Replace with your own project photography when available.
