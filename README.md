# Skylona Interior Studio — Website

Static website for **Skylona Interior Studio**, an interior design and civil-work studio serving homeowners across Kerala.

Plain HTML, CSS and JavaScript — no build step, no framework, no backend.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and all text content |
| `styles.css` | Design, colours, fonts and mobile/desktop layouts |
| `script.js` | Mobile menu, scroll effects, photo placeholders, enquiry-to-WhatsApp form, footer year |
| `images/` | Project photos (`project-1.jpg` … `project-6.jpg`) — see `images/README.txt` |

## Contact details used on the site

- WhatsApp / phone: +91 95677 47962
- Instagram: https://www.instagram.com/skylonainteriordesignstudio/

To change the WhatsApp number, update `WHATSAPP_NUMBER` in `script.js` and the `wa.me/` and `tel:` links in `index.html`.

## Enquiry form

The "Quick enquiry" form has **no server**. When a visitor submits it, the site opens WhatsApp with their name, location, service and message pre-filled, addressed to the studio's number. Nothing is stored anywhere. If a proper stored form is needed later, Netlify Forms or a form service can be added.

## Adding real project photos

1. Name the photos `project-1.jpg` to `project-6.jpg` (see `images/README.txt` for which slot is which).
2. Upload them into the `images/` folder in GitHub.
3. Edit the captions in `index.html` (search for `figcaption`) to match the real projects.

Until a photo is uploaded, each slot shows a styled "Project photo coming soon" placeholder — no stock photos are presented as Skylona's work.

## Preview locally

Double-click `index.html` to open it in a browser. Or, from this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy (GitHub + Netlify)

1. Create a repository (e.g. `skylona-interior-studio`, private) at https://github.com/new.
2. Upload the contents of this folder (not a ZIP) to the repository root.
3. In Netlify: **Add new project → Import an existing project → GitHub**, pick the repository.
4. Build settings: **Build command** — leave empty. **Publish directory** — `.` (repository root).
5. Deploy. Every new commit to the main branch redeploys automatically; the URL stays the same.

## Before official launch

- [ ] Replace placeholders with real Skylona project photos
- [ ] Owner reviews all text and service descriptions
- [ ] Test WhatsApp, call and Instagram links on a phone
- [ ] Decide on a custom domain (after approval)
- [ ] Consider Malayalam content
