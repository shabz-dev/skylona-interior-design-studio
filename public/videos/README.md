# Add Skylona 3D walkthrough videos here

The website is designed to showcase the studio's own 3D walkthroughs. No actual studio video files were included in the uploaded project, so the concept cards currently use the supplied design images instead of pretending they are real videos.

## Enable a video for a concept card
1. Copy an MP4 video into this folder, for example `living-room-walkthrough.mp4`.
2. Open `src/routes/index.tsx` and find the `workItems` array.
3. Add a `video` property to the matching item, e.g. `video: "/videos/living-room-walkthrough.mp4"`.
4. Repeat for other items, then run `npm run dev` to test.

Use compressed H.264 MP4 videos, ideally 1080p and optimized for web. Keep each video as small as practical for mobile visitors. Only use videos the studio has permission to publish.
