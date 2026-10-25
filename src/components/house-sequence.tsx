import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * Scroll-driven house presentation.
 *
 * Source: public/videos/walkthrough-07.mp4. The MP4 has only 2 keyframes across
 * ~450 frames, so seeking `currentTime` on scroll would force the browser to
 * decode hundreds of frames per seek and stutter. Instead the clip was extracted
 * to a WebP frame sequence and is painted to a <canvas> from scroll progress.
 *
 * The source has a hard cut at 7.53s: an orbit around the corner of the house,
 * then a separate front-on shot. Frames 0-89 are the orbit (0-7.5s at 12fps);
 * frames 90-121 are the front elevation (7.6-11.6s at 8fps, trimmed before the
 * camera drifts off-centre). The two are joined with a short dissolve at CUT.
 * Frames are cropped to the upper 720x900 to drop the reflection/watermark strip.
 *
 * To regenerate (A = frame count of the first command):
 *   ffmpeg -ss 0 -t 7.5 -i walkthrough-07.mp4 -vf "fps=12,crop=720:900:0:0" \
 *     -c:v libwebp -quality 72 -compression_level 6 -start_number 1 public/sequence/house/f-%03d.webp
 *   ffmpeg -ss 7.6 -t 4 -i walkthrough-07.mp4 -vf "fps=8,crop=720:900:0:0" \
 *     -c:v libwebp -quality 72 -compression_level 6 -start_number <A+1> public/sequence/house/f-%03d.webp
 * then update FRAME_COUNT and CUT below.
 */
const FRAME_COUNT = 122;
/** 0-based index of the first frame after the source's hard cut. */
const CUT = 90;
/** Dissolve half-width, in frames, either side of the cut. */
const BLEND = 4;
const FRAME_W = 720;
const FRAME_H = 900;
/** Share of the pinned scroll spent playing frames; the rest holds the last frame. */
const HOLD_AT = 0.92;
/** Frame progress (0-1) at which each chapter begins. */
const CHAPTERS = [
  {
    label: "The Exterior",
    from: 0,
    text: "Start at the corner and see how the volumes, roof lines and lighting sit together.",
  },
  {
    label: "Around the Corner",
    from: 0.38,
    text: "The view keeps turning, bringing the side of the house and its roof lines into view.",
  },
  {
    label: "The Front Elevation",
    from: 0.72,
    text: "Then it faces the front: the balcony, the windows and the timber entrance in warm light.",
  },
] as const;

const frameSrc = (i: number) => `/sequence/house/f-${String(i + 1).padStart(3, "0")}.webp`;
const chapterAt = (fp: number) => (fp >= CHAPTERS[2].from ? 2 : fp >= CHAPTERS[1].from ? 1 : 0);

/** Coarse-to-fine load order so scrubbing works early, then fills in. */
function loadOrder(step: number) {
  const seen = new Set<number>();
  const order: number[] = [];
  const add = (i: number) => {
    if (i < FRAME_COUNT && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  // The dissolve needs both sides of the cut as early as possible.
  add(0);
  add(CUT - 1);
  add(CUT);
  add(FRAME_COUNT - 1);
  for (const stride of [16, 8, 4, 2, 1]) {
    if (stride < step) continue;
    for (let i = 0; i < FRAME_COUNT; i += stride) add(i);
    add(FRAME_COUNT - 1);
  }
  return order;
}

export function HouseSequence({ ctaHref }: { ctaHref: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [chapter, setChapter] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    // Reduced motion: no scrubbing. CSS shows a still frame and the full chapter list.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    let alive = true;
    let raf = 0;
    let target = Math.min(1, Math.max(0, scrollYProgress.get()));
    let current = target; // start where the page already is (e.g. after a reload)
    let drawnKey = "";
    let lastChapter = -1;

    const nearest = (idx: number) => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        const a = idx - d;
        const b = idx + d;
        if (a >= 0 && frames[a]) return a;
        if (b < FRAME_COUNT && frames[b]) return b;
      }
      return -1;
    };

    const paint = () => {
      const fp = Math.min(1, current / HOLD_AT);
      const want = Math.round(fp * (FRAME_COUNT - 1));
      // Around the source's hard cut, dissolve from the last orbit frame to the
      // first front-elevation frame instead of jumping.
      if (want >= CUT - BLEND && want < CUT + BLEND) {
        const before = nearest(CUT - 1);
        const after = nearest(CUT);
        if (before !== -1 && after !== -1) {
          const key = `${before}:${after}:${want}`;
          if (key !== drawnKey) {
            const t = (want - (CUT - BLEND) + 0.5) / (2 * BLEND);
            ctx.globalAlpha = 1;
            ctx.drawImage(frames[before]!, 0, 0, FRAME_W, FRAME_H);
            ctx.globalAlpha = t;
            ctx.drawImage(frames[after]!, 0, 0, FRAME_W, FRAME_H);
            ctx.globalAlpha = 1;
            drawnKey = key;
          }
          return;
        }
      }
      const best = nearest(want);
      if (best !== -1 && String(best) !== drawnKey) {
        ctx.drawImage(frames[best]!, 0, 0, FRAME_W, FRAME_H);
        drawnKey = String(best);
      }
    };

    // Direct DOM updates: no React state per animation frame.
    const updateUi = () => {
      const fp = Math.min(1, current / HOLD_AT);
      if (barRef.current) barRef.current.style.transform = `scaleX(${fp})`;
      hintRef.current?.classList.toggle("is-hidden", current > 0.015);
      ctaRef.current?.classList.toggle("is-on", fp > 0.94);
      const c = chapterAt(fp);
      if (c !== lastChapter) {
        lastChapter = c;
        setChapter(c);
      }
    };

    const tick = () => {
      raf = 0;
      const diff = target - current;
      current = Math.abs(diff) < 0.0004 ? target : current + diff * 0.16;
      paint();
      updateUi();
      if (current !== target) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const unsubscribe = scrollYProgress.on("change", (v) => {
      target = Math.min(1, Math.max(0, v));
      kick();
    });

    // Progressive loading, only once the section is near the viewport.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    const step = window.matchMedia("(max-width: 700px)").matches || saveData ? 2 : 1;
    const order = loadOrder(step);
    let next = 0;
    let started = false;
    const loadOne = () => {
      if (!alive || next >= order.length) return;
      const i = order[next++];
      if (i === undefined) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (!alive) return;
        frames[i] = img;
        paint();
        loadOne();
      };
      img.onerror = () => {
        if (alive) loadOne();
      };
      img.src = frameSrc(i);
    };
    const start = () => {
      if (started) return;
      started = true;
      for (let k = 0; k < 6; k++) loadOne();
    };

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            start();
            observer?.disconnect();
          }
        },
        { rootMargin: "1500px 0px 1500px 0px" },
      );
      observer.observe(section);
    } else {
      start();
    }

    updateUi();
    paint();

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      unsubscribe();
      observer?.disconnect();
      frames.fill(undefined);
    };
  }, [scrollYProgress]);

  const jumpTo = (i: number) => {
    const section = sectionRef.current;
    const chapterDef = CHAPTERS[i];
    if (!section || !chapterDef) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const scrollable = section.offsetHeight - window.innerHeight;
    const fp = Math.min(1, chapterDef.from + 0.02);
    window.scrollTo({ top: top + fp * HOLD_AT * scrollable, behavior: "smooth" });
  };

  const active = CHAPTERS[chapter] ?? CHAPTERS[0];

  return (
    <section
      id="presentation"
      ref={sectionRef}
      className="seq"
      aria-label="A Vision, Built in Every Detail"
    >
      <div className="seq-pin">
        <div className="seq-copy">
          <h2>
            A Vision,
            <br />
            <em>Built in Every Detail.</em>
          </h2>
          <p>Explore the spaces, forms, and finishes that bring each home to life.</p>
          <div ref={hintRef} className="seq-hint" aria-hidden="true">
            <span className="seq-hint-line" />
            Scroll to turn the house
          </div>
        </div>

        <div className="seq-stage-col">
          <div className="seq-stage" style={{ backgroundImage: `url(${frameSrc(0)})` }}>
            <canvas
              ref={canvasRef}
              width={FRAME_W}
              height={FRAME_H}
              role="img"
              aria-label="3D visualization of a two-storey house with a timber entrance, rotating from a corner view to the front elevation as you scroll"
            />
          </div>
          <div className="seq-progress" aria-hidden="true">
            <span ref={barRef} />
          </div>
          <p className="seq-caption">Skylona 3D visualization</p>
        </div>

        <div className="seq-side">
          <ul className="seq-chapters" aria-label="Presentation chapters">
            {CHAPTERS.map((c, i) => (
              <li key={c.label}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={i === chapter ? "true" : undefined}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="seq-chapter-text">
            <AnimatePresence mode="wait">
              <motion.div
                key={chapter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="seq-chapter-label">{active.label}</h3>
                <p>{active.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Shown instead of the animated chapter block when motion is reduced. */}
          <ul className="seq-static-list">
            {CHAPTERS.map((c) => (
              <li key={c.label}>
                <h3>{c.label}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>

          <a
            ref={ctaRef}
            className="button-brass seq-cta"
            href={ctaHref}
            target="_blank"
            rel="noreferrer"
          >
            Book a Consultation <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
