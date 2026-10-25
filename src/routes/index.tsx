import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Play, X, Menu, Sofa, KeyRound, CookingPot, Lamp, Hammer, House, Box, MessageCircle, Phone, Check, Sparkles, ScanLine } from "lucide-react";
// Clean studio hero shot. The /projects photos carry a baked-in Instagram
// watermark, which was unreadable blown up to full-bleed hero size.
import heroJpg from "../assets/hero.jpg";
import heroWebp from "../assets/hero.webp";
import { HouseSequence } from "../components/house-sequence";

const OG_TITLE = "Skylona Interior Studio | 3D Home Design & Interiors in Kerala";
const OG_DESC = "Explore thoughtful home design, interior styling and 3D visualization by Skylona Interior Studio. Designing homes across Kerala.";
const PHONE = "+919567747962";
const WA = `https://wa.me/919567747962?text=${encodeURIComponent("Hello Skylona, I'd like to discuss my home design project.")}`;
const IG = "https://www.instagram.com/skylonainteriordesignstudio/";
const EASE = [0.22, 1, 0.36, 1] as const;
const waFor = (svc: string) => `https://wa.me/919567747962?text=${encodeURIComponent(`Hello Skylona, I'd like to ask about ${svc} for my home.`)}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: OG_TITLE },
      { name: "description", content: OG_DESC },
      { property: "og:title", content: OG_TITLE },
      { property: "og:description", content: OG_DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Skylona Interior Studio",
        telephone: PHONE,
        sameAs: [IG],
        areaServed: { "@type": "State", name: "Kerala" },
      }),
    }],
  }),
  component: Index,
});

const services = [
  { icon: Sofa, n: "01", en: "Interior design", ml: "ഇന്റീരിയർ ഡിസൈൻ", d: "Thoughtful spaces shaped around your family, habits and everyday rituals." },
  { icon: KeyRound, n: "02", en: "Turnkey projects", ml: "ടേൺകീ പ്രോജക്ടുകൾ", d: "One considered journey from the first design conversation to handover." },
  { icon: CookingPot, n: "03", en: "Modular kitchens", ml: "മോഡുലാർ കിച്ചൺ", d: "Beautifully organized kitchens where every detail earns its place." },
  { icon: Lamp, n: "04", en: "Furniture & decor", ml: "ഫർണിച്ചർ & ഡെക്കർ", d: "Materials, furniture and finishing touches that make it feel like home." },
  { icon: Hammer, n: "05", en: "Renovation", ml: "നവീകരണം", d: "A fresh perspective for spaces ready for their next chapter." },
  { icon: House, n: "06", en: "Architecture & house design", ml: "വീട് ഡിസൈൻ", d: "Home planning made for your plot, lifestyle and Kerala's climate." },
  { icon: Box, n: "07", en: "3D visualization", ml: "3D വിഷ്വലൈസേഷൻ", d: "Explore the look, feel and flow of your home before work begins." },
];

const process = [
  { n: "01", title: "Listen", d: "Your ideas, lifestyle, plot, priorities and budget." },
  { n: "02", title: "Visualize", d: "Layouts, material direction and 3D views to make it real." },
  { n: "03", title: "Build", d: "Civil and interior work brought together with care." },
  { n: "04", title: "Come home", d: "The final details, ready for your everyday life." },
];

type Work = { title: string; type: string; image: string; webp: string; index: string; video?: string; description: string };
const workItems: Work[] = [
  { title: "A home in the making", type: "HOUSE EXTERIOR · 3D VISUALIZATION", image: "/projects/skylona-project-01.jpg", webp: "/projects/skylona-project-01.jpg", index: "01", description: "A contemporary Kerala home concept with warm timber, layered lighting and tropical landscaping.", video: "/videos/walkthrough-01.mp4" },
  { title: "The front elevation", type: "ARCHITECTURE · 3D CONCEPT", image: "/projects/skylona-project-02.jpg", webp: "/projects/skylona-project-02.jpg", index: "02", description: "Explore the elevation, material palette and approach to the entrance.", video: "/videos/walkthrough-02.mp4" },
  { title: "Details from another angle", type: "HOUSE DESIGN · 3D VISUALIZATION", image: "/projects/skylona-project-03.jpg", webp: "/projects/skylona-project-03.jpg", index: "03", description: "A different perspective on massing, windows, roof lines and outdoor spaces.", video: "/videos/walkthrough-03.mp4" },
  { title: "From plan to place", type: "FLOOR PLAN + EXTERIOR", image: "/projects/skylona-project-04.jpg", webp: "/projects/skylona-project-04.jpg", index: "04", description: "A plan and exterior concept presented together to help you picture the home.", video: "/videos/walkthrough-04.mp4" },
  { title: "A home among the greens", type: "RESIDENTIAL DESIGN · 3D CONCEPT", image: "/projects/skylona-project-05.jpg", webp: "/projects/skylona-project-05.jpg", index: "05", description: "A modern home composition designed to sit comfortably within a tropical landscape.", video: "/videos/walkthrough-05.mp4" }
];

function Picture({ webp, image, alt, className = "", eager = false, priority = false }: { webp: string; image: string; alt: string; className?: string; eager?: boolean; priority?: boolean }) {
  return <picture><source srcSet={webp} type="image/webp" /><img src={image} alt={alt} className={className} loading={eager ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" /></picture>;
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={reduce ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.8, ease: EASE, delay }}>{children}</motion.div>;
}

function ProjectCard({ item, onOpen, i }: { item: Work; onOpen: (item: Work) => void; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.button type="button" onClick={() => onOpen(item)} className={`project-card project-card-${i + 1} group text-left`}
      initial={reduce ? false : { opacity: 0, y: 36 }} whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }} transition={{ duration: .8, ease: EASE, delay: i * .1 }}>
      <div className="project-media">
        <Picture webp={item.webp} image={item.image} alt={item.title} className="project-image" />
        <div className="project-image-wash" />
        <span className="project-index">{item.index} / 04</span>
        <span className="project-open"><ArrowUpRight size={19}/></span>
        <span className="project-play"><Play size={15} fill="currentColor"/> EXPLORE CONCEPT</span>
      </div>
      <div className="project-meta"><div><span className="project-type">{item.type}</span><h3>{item.title}</h3></div><ArrowUpRight className="project-meta-arrow" size={20}/></div>
    </motion.button>
  );
}

function ProjectModal({ item, onClose }: { item: Work | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [item, onClose]);
  return (
    <AnimatePresence>
      {item && <motion.div className="project-modal-backdrop" role="dialog" aria-modal="true" aria-label={`${item.title} project`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="project-modal" initial={{ y: 28, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: .98 }} transition={{ duration: .35, ease: EASE }} onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close project"><X size={20}/></button>
          <div className="modal-image-wrap">{item.video ? <video className="modal-video" src={item.video} poster={item.image} controls playsInline autoPlay /> : <><Picture webp={item.webp} image={item.image} alt={item.title} className="modal-image" /><div className="modal-image-shade"/><div className="modal-image-label"><span>SKYLONA / DESIGN STUDY</span><span>{item.index} — 04</span></div></>}</div>
          <div className="modal-copy"><span className="project-type">{item.type}</span><h3>{item.title}</h3><p>{item.description}</p><p className="modal-note">Have a 3D walkthrough or a floor plan in mind? Talk to the studio about creating a visualization for your own home.</p><a className="button-brass" href={waFor("3D walkthrough and home visualization")} target="_blank" rel="noreferrer">Discuss a similar project <ArrowUpRight size={17}/></a></div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  );
}

function Index() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeProject, setActiveProject] = useState<Work | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, .35], [1, 1.08]);
  const heroTextY = useTransform(scrollYProgress, [0, .25], [0, 80]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [["Studio", "#studio"], ["3D concepts", "#work"], ["Services", "#services"], ["Process", "#process"]];
  return (
    <div className="skylona-site">
      <div className="topline"><span>SKYLONA INTERIOR STUDIO</span><span>INTERIORS · ARCHITECTURE · 3D VISUALIZATION</span><span>KERALA, INDIA</span></div>
      <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}>
        <a href="#top" className="site-logo" aria-label="Skylona Interior Studio home"><img src="/skylona-mark.png" alt="" /><span>SKYLONA<small>INTERIOR STUDIO</small></span></a>
        <nav className="desktop-nav">{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
        <a className="nav-contact" href={WA} target="_blank" rel="noreferrer">Let's talk <ArrowUpRight size={15}/></a>
        <button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
        <AnimatePresence>{open && <motion.nav className="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{[...nav, ["Contact", "#contact"]].map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={15}/></a>)}</motion.nav>}</AnimatePresence>
      </header>

      <main id="top">
        <section ref={heroRef} className="cinematic-hero">
          <motion.div className="hero-photo" style={reduce ? {} : { scale: heroScale }}>
            <Picture webp={heroWebp} image={heroJpg} alt="Warm contemporary living room interior designed by Skylona Interior Studio" className="hero-bg" eager priority />
          </motion.div>
          <div className="hero-gradient"/>
          <div className="hero-grain"/>
          <div className="hero-side-label">SPACES THAT FEEL LIKE YOU <span>↘</span></div>
          <motion.div className="hero-content" style={reduce ? {} : { y: heroTextY }}>
            <motion.p className="eyebrow hero-eyebrow" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .7 }}>A HOME, IMAGINED IN DETAIL</motion.p>
            <motion.h1 initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, duration: 1, ease: EASE }}>See your home<br/><em>before it exists.</em></motion.h1>
            <motion.p className="hero-description" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65, duration: .8 }}>From first sketch to immersive 3D visualization, we help you imagine the feeling of home — then bring it to life.</motion.p>
            <motion.div className="hero-actions" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .85, duration: .7 }}>
              <a href="#work" className="button-brass">Explore 3D concepts <ArrowDownRight size={17}/></a>
              <a href={WA} target="_blank" rel="noreferrer" className="hero-secondary">Start a project <ArrowUpRight size={16}/></a>
            </motion.div>
          </motion.div>
          <div className="hero-bottom"><span><span className="live-dot"/> DESIGNING ACROSS KERALA</span><span>SCROLL TO EXPLORE <span className="scroll-line"/></span><span>10° N · HOME, REIMAGINED</span></div>
          <div className="hero-stamp"><span>THE ART OF</span><strong>FEELING<br/>AT HOME</strong><span>SKYLONA · EST. IN YOUR STORY</span></div>
        </section>

        <div className="ticker" aria-label="Skylona services"><div className="ticker-track">{Array.from({ length: 2 }).map((_, i) => <div className="ticker-set" key={i}><span>INTERIOR DESIGN</span><i>✳</i><span>3D VISUALIZATION</span><i>✳</i><span>ARCHITECTURE</span><i>✳</i><span>CIVIL WORK</span><i>✳</i><span>MADE FOR LIVING</span><i>✳</i></div>)}</div></div>

        <HouseSequence ctaHref={waFor("booking a consultation")} />

        <section id="studio" className="studio-intro section-wrap">
          <Reveal><p className="eyebrow dark-eyebrow"><span className="eyebrow-rule"/> THE STUDIO / 01</p></Reveal>
          <div className="intro-grid">
            <Reveal className="intro-head"><h2>Not just a room.<br/>A <em>feeling.</em></h2><span className="intro-orbit"><Sparkles size={20}/></span></Reveal>
            <Reveal delay={.15} className="intro-body"><p className="intro-lede">A home is one of the biggest things you’ll ever imagine. We make that vision easier to see.</p><p>Skylona brings interior design, house planning and civil work into one thoughtful journey — with visual detail that helps you feel confident before the first step on site.</p><p className="malayalam">നിങ്ങളുടെ സ്വപ്നവീട്, ഓരോ വിശദാംശത്തിലും വ്യക്തതയോടെ.</p><a href="#process" className="under-link">A little about our process <ArrowRight size={16}/></a></Reveal>
          </div>
          <div className="intro-foot"><span>01 — CONSIDERED DESIGN</span><span>02 — REAL-LIFE FUNCTION</span><span>03 — VISUALIZE WITH CONFIDENCE</span></div>
        </section>

        <section id="work" className="work-section">
          <div className="section-wrap work-inner">
            <Reveal className="section-head"><div><p className="eyebrow dark-eyebrow"><span className="eyebrow-rule"/> THE VISUAL JOURNAL / 02</p><h2>Walk through<br/><em>what could be.</em></h2></div><p className="section-side-copy">A selection of residential visualizations supplied for the Skylona portfolio. Tap a concept to explore the design story, then bring your own plans to life with a tailored 3D walkthrough.</p></Reveal>
            <div className="project-grid">{workItems.map((item, i) => <ProjectCard key={item.index} item={item} onOpen={setActiveProject} i={i}/>)}</div>
            <div className="work-bottom"><span><ScanLine size={16}/> SKYLONA PROJECT VISUALS · 3D WALKTHROUGHS</span><a href={IG} target="_blank" rel="noreferrer">See the studio on Instagram <ArrowUpRight size={16}/></a></div>
          </div>
        </section>

        <section className="film-section">
          <div className="film-image">
            <img src="/projects/skylona-project-05.jpg" alt="Skylona house exterior visualization" className="film-photo" loading="lazy"/>
            <div className="film-overlay"/>
            <motion.div className="film-orbit film-orbit-one" animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }}><span/></motion.div>
            <motion.div className="film-orbit film-orbit-two" animate={reduce ? {} : { rotate: -360 }} transition={{ duration: 44, repeat: Infinity, ease: "linear" }}><span/></motion.div>
            <a href={waFor("a 3D walkthrough for my home")} target="_blank" rel="noreferrer" className="film-center" aria-label="Ask Skylona about a 3D walkthrough"><span className="film-play"><Play fill="currentColor" size={18}/></span><span>YOUR VISION, IN MOTION</span></a>
            <span className="film-corner film-corner-tl">SKYLONA / 3D STUDIO</span><span className="film-corner film-corner-br">IMAGINE · REFINE · REALIZE</span>
          </div>
          <div className="film-copy"><p className="eyebrow"><span className="eyebrow-rule"/> MORE THAN A STILL IMAGE / 03</p><h2>Feel the space<br/>before you <em>step in.</em></h2><p>3D walkthroughs help you explore the flow of a room, understand materials and picture the light moving through your future home — before construction begins.</p><div className="film-points"><div><span>01</span><p><strong>See the flow</strong><small>Move from room to room in your mind’s eye.</small></p></div><div><span>02</span><p><strong>Feel the finishes</strong><small>Explore tones, textures and lighting together.</small></p></div><div><span>03</span><p><strong>Decide with clarity</strong><small>Make confident choices before work begins.</small></p></div></div><a href={waFor("a 3D walkthrough for my home")} target="_blank" rel="noreferrer" className="button-dark">Create my 3D walkthrough <ArrowUpRight size={17}/></a></div>
        </section>

        <section id="services" className="services-section section-wrap">
          <Reveal className="section-head"><div><p className="eyebrow dark-eyebrow"><span className="eyebrow-rule"/> WHAT WE DO / 04</p><h2>One vision.<br/><em>Every detail.</em></h2></div><p className="section-side-copy">From the outside of the house to the smallest corner inside, the right details make a home feel complete.</p></Reveal>
          <div className="services-grid">{services.map((s, i) => <Reveal key={s.n} delay={(i % 3) * .06} className="service-card"><div className="service-top"><span>{s.n}</span><s.icon size={21} strokeWidth={1.3}/></div><h3>{s.en}</h3><p className="service-ml">{s.ml}</p><p className="service-description">{s.d}</p><a href={waFor(s.en)} target="_blank" rel="noreferrer" aria-label={`Ask Skylona about ${s.en}`} className="service-link">ASK ABOUT THIS <ArrowUpRight size={15}/></a></Reveal>)}</div>
        </section>

        <section id="process" className="process-section">
          <div className="process-bg-mark">S.</div>
          <div className="section-wrap process-inner"><Reveal><p className="eyebrow"><span className="eyebrow-rule"/> THE JOURNEY / 05</p><h2>From first thought<br/>to <em>front door.</em></h2><p className="process-lede">A good home comes together one clear decision at a time.</p></Reveal>
            <div className="process-grid">{process.map((p, i) => <Reveal key={p.n} delay={i * .08} className="process-step"><span className="process-number">{p.n}</span><div className="process-step-line"/><h3>{p.title}</h3><p>{p.d}</p></Reveal>)}</div>
            <div className="process-bottom"><span>YOUR IDEAS ARE THE STARTING POINT.</span><a href={WA} target="_blank" rel="noreferrer">Let’s talk about your project <ArrowUpRight size={16}/></a></div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-glow"/>
          <div className="section-wrap contact-inner"><Reveal><p className="eyebrow"><span className="eyebrow-rule"/> YOUR HOME STARTS HERE / 06</p><h2>Let’s make room<br/>for <em>your story.</em></h2><p className="contact-lede">Have a floor plan, a new plot or a saved folder full of inspiration? Start with a conversation. We’ll take it from there.</p><a className="button-brass" href={WA} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Start a conversation <ArrowUpRight size={16}/></a></Reveal>
            <div className="contact-details"><a href={`tel:${PHONE}`}><span><Phone size={17}/></span><div><small>CALL THE STUDIO</small><strong>+91 95677 47962</strong></div><ArrowUpRight size={16}/></a><a href={IG} target="_blank" rel="noreferrer"><span>◎</span><div><small>FOLLOW THE JOURNEY</small><strong>@skylonainteriordesignstudio</strong></div><ArrowUpRight size={16}/></a><div className="contact-service"><span><Check size={17}/></span><div><small>SERVICE AREA</small><strong>Across Kerala, India</strong></div></div></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-top"><a href="#top" className="footer-logo"><img src="/skylona-mark.png" alt="" /><span>SKYLONA<small>INTERIOR STUDIO</small></span></a><p>Homes imagined with care.<br/><em>Made to feel like yours.</em></p><a href="#top" className="back-top">BACK TO TOP <ArrowUpRight size={14}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SKYLONA INTERIOR STUDIO</span><span>INTERIORS · ARCHITECTURE · 3D VISUALIZATION</span><span>KERALA, INDIA</span></div></footer>
      <a href={WA} target="_blank" rel="noreferrer" className="floating-whatsapp" aria-label="Chat with Skylona on WhatsApp"><MessageCircle size={22}/><span>LET'S TALK</span></a>
      <ProjectModal item={activeProject} onClose={() => setActiveProject(null)}/>
    </div>
  );
}

