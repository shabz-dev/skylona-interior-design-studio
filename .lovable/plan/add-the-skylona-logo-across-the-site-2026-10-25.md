# Add the Skylona logo across the site

## Problems with the logo file (please read first)
1. **The background isn't actually see-through.** The grey-and-white checkerboard is part of the picture. Placed on the site as it is, the checkerboard would show behind the logo.
   - **What I'll do:** remove only the checkerboard pixels so the background becomes truly see-through. The house, letters, colours and tagline stay exactly as they are. I'll show you the result before using it anywhere. If you have the original transparent PNG or SVG, send it instead and I'll skip this step.
2. **You sent only one version.** The tagline "Bring Your Dream Space to Reality" is white, so it only shows up on dark backgrounds.
   - Over the hero photo: I'll use the logo as it is, with no filter, because its colours already show up well on the dark photo.
   - After scrolling, on a light navbar: the white tagline would disappear. I'll add a slight darkening filter (brightness) to that state only and tell you once it's done. A dark-text version of the logo from your designer would be cleaner.
3. **There's no hero video on the site yet.** The hero is still a still photo. The navbar change will work with the photo now and will keep working when the video is added.

## 1. Navbar
- Logo at the left: 40px tall on desktop, 32px on mobile, width set automatically so it never stretches or gets cropped.
- Over the hero: transparent navbar with the logo as it is.
- After you scroll past the hero: a light cream navbar with the filtered logo and dark links. The change takes about 0.3 seconds.
- The "Skylona." text in the navbar is replaced by the logo.
- At least half the logo's height of clear space around it.

## 2. Footer
- Dark espresso footer so the white tagline shows up clearly.
- Logo 60px tall, with the WhatsApp, phone and Instagram links and the copyright line beside it. Same clear space rule.

## 3. Favicon and home-screen icon
- The house symbol alone, cut from the logo without redrawing it, centred on a square with padding. At 16-32px the full wordmark would be too small to read.
- Files: a 32px favicon and a 180px apple-touch-icon. The old Lovable icon is removed.

## 4. Social preview
- A 1200x630 image with the unchanged logo centred on a plain dark warm-neutral background, so the white tagline shows up.
- Adds og:image, twitter:image, og:title and og:description, written only from your existing studio text.
- Note: link previews need a full web address, so they'll only work once the site is published.

## 5. Colours: advice only, nothing changed yet
The logo is **bright sky blue, lime green and sunny yellow**. The site is **espresso brown, cream and brass**. These do clash: the logo's bright, cheerful colours sit uneasily against the quiet, earthy luxury look.

Option A: keep the luxury look, add muted logo tones
- Background: warm off-white (#F7F5F0)
- Text and dark sections: deep charcoal-teal (#1E2A2E)
- Main accent: muted sky blue (#2E8FB0)
- Second accent: soft leaf green (#7BAE4A) in small touches
- Brass becomes a soft sand (#D9C9A3) for thin lines

Option B: lean into the logo
- Background: white (#FFFFFF)
- Text: near-black navy (#14202B)
- Accents: sky blue (#12B5E5) and lime green (#7ED03A) used fully

I'd suggest Option A. I'll only change colours once you approve one.

## 6. Accessibility
- Every logo image gets the alt text "Skylona Interior Studio logo".
- No shadows, outlines or effects on the logo, apart from the brightness filter above, which is only there because there's one version.

## Technical details
- Cleanup: Python/PIL keys out the two checkerboard greys (~#C1C1C0 and white) only where they connect to the outer edge, so the white tagline inside the logo is kept. The result is trimmed to its content and stored as a lovable-assets pointer.
- Navbar: an IntersectionObserver on the hero toggles a `scrolled` state, with a `transition-[background,filter] duration-300` swap. The light state uses `filter: brightness(0.55)`.
- Favicon: `public/favicon.png` (32) and `public/apple-touch-icon.png` (180), linked in `__root.tsx`. `favicon.ico` is deleted.
- OG image: `public/og-image.jpg` made with PIL. Meta tags go in the index route head() and use an absolute URL once the project has a domain.
