# Skylona Interior Studio — Cinematic Website

A responsive React + TypeScript website for Skylona Interior Studio, built with TanStack Start, Vite, Tailwind CSS, and Framer Motion.

## What changed in this redesign

- Cinematic, animated hero with scroll-linked image movement and staggered text reveals
- Premium neutral / brass visual direction
- Animated service ticker
- Editorial project gallery with image reveal, parallax motion, hover states, and interactive project detail modals
- Dedicated 3D walkthrough storytelling section
- Responsive layouts and mobile navigation
- Motion respects the visitor's reduced-motion accessibility preference
- Local Skylona house mark asset and wordmark, rather than a remote design-editor logo URL
- WhatsApp, phone and Instagram contact actions
- SEO title, description and LocalBusiness metadata
- Video-ready project modal: when a real MP4 is supplied and configured, it plays in the modal

## Run locally

Requires Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Open the localhost URL printed in the terminal.

To test a production build:

```bash
npm run build
npm run preview
```

## Add the studio's 3D walkthrough videos

The uploaded source did not contain actual studio walkthrough video files. The current gallery uses the existing design images, and the site does not pretend these images are videos.

1. Put an optimized MP4 in `public/videos/`, for example `living-room-walkthrough.mp4`.
2. Open `src/routes/index.tsx`.
3. Find the `workItems` array near the top.
4. Add a `video` field to the relevant item, for example:

```ts
{
  title: "Living room walkthrough",
  type: "LIVING · 3D WALKTHROUGH",
  image: hero,
  webp: heroWebp,
  index: "01",
  video: "/videos/living-room-walkthrough.mp4",
  description: "A walkthrough of the living room concept."
}
```

5. Save and run the site. Selecting that card opens the video with browser playback controls.

Use videos the studio has permission to publish. Prefer web-optimized H.264 MP4, 1080p or smaller as appropriate, and compress large files so mobile users can load them comfortably.

## Important before public launch

- Replace the design-concept photos with the studio's real approved project renders and videos.
- Confirm all service descriptions and business details with Skylona.
- Check the phone, WhatsApp and Instagram links.
- Test the deployed build on desktop and mobile.
- No fake reviews, project credentials or customer testimonials are included.
- There is no backend enquiry form; leads currently go to WhatsApp.

## Hosting

This is a Vite/TanStack Start application, not a plain static HTML folder. Use a host that supports the build output for this framework (for example, Netlify or Vercel with the appropriate framework/build settings). Connect the GitHub repository for automatic deploys on new commits.


## Supplied Skylona project media integrated

- Added five supplied house-render images to `public/projects/`.
- Added all supplied MP4 walkthrough videos to `public/videos/`.
- First-pass cleaned images are used for the image gallery and hero.
- Gallery cards open a detail modal; where a video is associated with a card, the MP4 is playable in the modal.
- Image cleanup is approximate reconstruction and may leave artifacts. Review every cleaned image before public launch.
- Videos were processed with FFmpeg's delogo filter over recurring overlay zones. Review carefully: interpolation may leave smudges or artifacts, and some watermark traces may remain.
