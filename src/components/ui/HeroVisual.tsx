'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { events, publicStats, statText } from '@/app/data';

/** How long each photograph stays on screen. */
const ROTATION_MS = 5000;

interface HeroEventPhoto {
  id: string;
  src: string;
  alt: string;
  eventTitle: string;
  eventCategory: string;
  eventTheme: string;
  date: string;
  location: string;
  /** Only present where `data.ts` records a real headcount for that event. */
  attendees?: string;
}

/**
 * Attendance is shown only where the event record actually states it — today
 * that is Ctrl + Future, whose notes read "~80–90 attendees". Every other event
 * in `data.ts` has no headcount, so its tile falls back to the community-wide
 * member total rather than inventing a number for that specific room.
 */
const RECORDED_ATTENDEES: Record<string, string> = {
  'ctrl-future': '80+'
};

/**
 * The rotation source of truth: each frame names a real event and one real
 * image belonging to *that event*, so a caption can never drift away from the
 * picture it sits on — title, date and venue are read back off the event record
 * instead of being retyped here.
 *
 * Consecutive frames deliberately come from different events, and the entries
 * skip the gallery slots that are screenshots (PNG), portrait, or multi-megapixel
 * panoramas rather than usable landscape photographs.
 *
 * Frame 0 is the local JPEG so the largest above-the-fold paint is served from
 * /public instead of Drive.
 */
const PHOTO_SOURCES: { slug: string; galleryIndex?: number; localSrc?: string }[] = [
  { slug: 'ctrl-future', localSrc: '/sample/CTRL+Future.jpeg' },
  { slug: 'techpath-1o-discover-decide-dominate', galleryIndex: 1 },
  { slug: 'compilex-where-ideas-evolve-into-impact', galleryIndex: 0 },
  { slug: 'tech-baithak', galleryIndex: 0 },
  { slug: 'ctrl-future', galleryIndex: 1 },
  { slug: 'techpath-1o-discover-decide-dominate', galleryIndex: 3 },
  { slug: 'compilex-where-ideas-evolve-into-impact', galleryIndex: 1 }
];

function buildHeroPhoto(source: (typeof PHOTO_SOURCES)[number]): HeroEventPhoto | null {
  const event = events.find((entry) => entry.slug === source.slug);
  if (!event) return null;

  const src =
    source.localSrc ??
    (source.galleryIndex === undefined ? undefined : event.galleryImages?.[source.galleryIndex]);
  if (!src) return null;

  // Titles in `data.ts` are "Name — Tagline"; the hero shows the name large and
  // the tagline as the strap line beneath it. No tagline → fall back to the
  // event's real subtitle.
  const [name, tagline] = event.title.split('—').map((part) => part.trim());

  return {
    id: `${event.slug}-${source.galleryIndex ?? 'cover'}`,
    alt: event.venue
      ? `Photograph from the Tech Vriksh ${event.title} event at ${event.venue}`
      : `Photograph from the Tech Vriksh ${event.title} event`,
    src,
    eventTitle: name.toUpperCase(),
    // `format` is optional on EventItem, so the separator is only added when
    // there is actually a format to put in front of it.
    eventCategory: [event.format, event.kind].filter(Boolean).join(' · ').toUpperCase(),
    eventTheme: (tagline ?? event.subtitle).toUpperCase(),
    date: event.dateLabel,
    location: event.venue ?? '',
    attendees: RECORDED_ATTENDEES[event.slug]
  };
}

const eventPhotos: HeroEventPhoto[] = PHOTO_SOURCES.map(buildHeroPhoto).filter(
  (photo): photo is HeroEventPhoto => photo !== null
);

export function HeroVisual() {
  // Deterministic first frame — never randomised, so SSR and hydration agree and
  // the same photo is always the one that paints above the fold.
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  // Only frames that have been reached (plus the next one) are mounted, so the
  // initial load fetches one photograph rather than all seven. Once mounted a
  // frame stays mounted, so looping never re-downloads anything.
  const [mountedIndices, setMountedIndices] = useState<number[]>([0]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  // Bumped on a manual thumbnail pick so the 5s clock restarts from that photo
  // instead of advancing a moment later.
  const [restartToken, setRestartToken] = useState(0);

  const photoCount = eventPhotos.length;
  const activePhoto = eventPhotos[activePhotoIndex];

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);

    const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Page Visibility: a background tab should not burn timers or quietly advance
  // the photo, so the interval is torn down while hidden and rebuilt on return.
  useEffect(() => {
    const sync = () => setIsTabHidden(document.visibilityState === 'hidden');
    sync();

    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isTabHidden || photoCount < 2) return;

    const interval = setInterval(() => {
      setActivePhotoIndex((current) => (current + 1) % photoCount);
    }, ROTATION_MS);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isTabHidden, photoCount, restartToken]);

  // Mount the following frame as soon as the current one is showing, so it is
  // decoded and ready well before its turn — the cross-fade never waits on a
  // network round trip. The active frame is included defensively: with reduced
  // motion the timer never runs, so a manual jump can land on a frame the
  // rotation would not have reached yet.
  useEffect(() => {
    if (photoCount < 1) return;
    const nextIndex = (activePhotoIndex + 1) % photoCount;

    setMountedIndices((current) => {
      const missing = [activePhotoIndex, nextIndex].filter((index) => !current.includes(index));
      return missing.length > 0 ? [...current, ...missing] : current;
    });
  }, [activePhotoIndex, photoCount]);

  const selectPhoto = (index: number) => {
    setActivePhotoIndex(index);
    setRestartToken((token) => token + 1);
  };

  if (!activePhoto) return null;

  return (
    <div className="group relative flex flex-col justify-between w-full min-h-[500px] sm:min-h-[540px] lg:h-full overflow-hidden rounded-[2rem] border border-[color:var(--tv-border)] bg-[color:var(--tv-surface)] shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
      {/* ── Background Photograph ── */}
      {/* Every frame shares this one fixed box and is absolutely positioned, so
          swapping frames cannot reflow anything: the card keeps its size and no
          text moves. Cross-fade is opacity only — no zoom, slide or bounce. */}
      <div className="absolute inset-0">
        {eventPhotos.map((photo, index) =>
          mountedIndices.includes(index) ? (
            <Image
              key={photo.id}
              src={photo.src}
              alt={photo.alt}
              fill
              priority={index === 0}
              aria-hidden={index !== activePhotoIndex}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
              className={[
                // Every frame is a wide event photograph, so they all share one
                // framing: faces sit a little above centre.
                'object-cover object-[center_28%] duration-700 ease-out group-hover:scale-[1.02]',
                prefersReducedMotion ? 'transition-transform' : 'transition-[opacity,transform]',
                index === activePhotoIndex ? 'opacity-100' : 'opacity-0'
              ].join(' ')}
            />
          ) : null
        )}

        {/* Subtle top vignette for upper card contrast */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 via-black/30 to-transparent" />

        {/* Bottom gradient overlay tailored for text & stats legibility without hiding faces */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#040907] via-[#07110e]/80 to-transparent" />

        {/* Subtle border glow ring */}
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10 group-hover:ring-[color:var(--tv-primary)]/30 transition-all duration-500" />
      </div>

      {/* ── Top Header / Floating Information Card ── */}
      <div className="relative z-10 flex items-start justify-end p-4 sm:p-6">
        {/* Editorial event card (top right) */}
        <div className="rounded-2xl border border-white/15 bg-black/70 p-3.5 sm:p-4 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.6)] max-w-[220px]">
          <div className="flex items-center justify-between gap-2">
            <span className="tv-mono text-[0.62rem] uppercase tracking-[0.2em] text-[color:var(--tv-primary)] font-semibold">
              {activePhoto.eventTitle}
            </span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--tv-primary)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--tv-primary)]" />
            </span>
          </div>

          <div className="tv-mono mt-1 text-[0.68rem] tracking-wider text-[color:var(--tv-text-secondary)] font-medium">
            {activePhoto.eventCategory}
          </div>

          <div className="mt-2.5 flex flex-col gap-0.5 border-t border-white/10 pt-2 text-[0.72rem] text-[color:var(--tv-text-muted)]">
            <div className="flex items-center gap-1.5 font-medium text-white/90">
              <svg className="h-3 w-3 text-[color:var(--tv-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{activePhoto.date}</span>
            </div>
            {activePhoto.location && (
              <div className="flex items-center gap-1.5 pl-4 text-white/70">
                <span>{activePhoto.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Content Overlay: Event Title, Thumbnails & CTA ── */}
      <div className="relative z-10 p-5 sm:p-7 space-y-4">
        {/* Event Title & Subtitle */}
        <div>
          <h2 className="tv-heading text-2xl sm:text-3xl lg:text-[2.2rem] font-bold text-white tracking-[-0.03em] leading-tight">
            {activePhoto.eventTitle}
          </h2>
          <p className="tv-mono text-xs uppercase tracking-[0.22em] text-[color:var(--tv-primary)] mt-1.5 font-medium">
            {activePhoto.eventTheme}
          </p>
        </div>

        {/* Bottom bar: Optional Photo Switchers + Explore Events link */}
        <div className="flex items-center justify-between pt-1 gap-2">
          {/* Real Photo Thumbnails */}
          {photoCount > 1 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 p-1.5 backdrop-blur-sm sm:gap-1 sm:p-1 xl:gap-1.5">
              {eventPhotos.map((photo, index) => {
                const isActive = activePhotoIndex === index;

                return (
                  /* One control, three sizes. Seven 32px thumbnails plus the CTA
                     do not fit inside a 343px-wide card, so below `sm` each
                     button renders as a dot instead — same buttons, same
                     behaviour, no wrapping and no extra card height. The
                     two-column band at 1024–1280px is the narrowest place the
                     photo strip has to live (≈400px of inner width), so it uses
                     28px and a tighter gap there and returns to the original
                     32px from `xl`. */
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => selectPhoto(index)}
                    aria-label={`View photo ${index + 1} of ${photoCount}: ${photo.eventTitle}`}
                    aria-current={isActive}
                    className={[
                      'relative overflow-hidden transition-all',
                      'h-1.5 rounded-full sm:h-7 sm:w-7 sm:rounded-md sm:border sm:bg-transparent xl:h-8 xl:w-8',
                      isActive
                        ? 'w-4 bg-[color:var(--tv-primary)] sm:scale-105 sm:border-[color:var(--tv-primary)] sm:opacity-100 sm:ring-2 sm:ring-[color:var(--tv-primary)]/50'
                        : 'w-1.5 bg-white/35 hover:bg-white/60 sm:border-white/20 sm:opacity-50 sm:hover:opacity-90'
                    ].join(' ')}
                  >
                    {/* Decorative: the button's aria-label already names the event. */}
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes="32px"
                      className="hidden object-cover sm:block"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Explore Events CTA */}
          <Link
            href="/events"
            className="group/link inline-flex items-center gap-1.5 tv-mono text-xs uppercase tracking-[0.2em] text-[color:var(--tv-primary)] hover:text-white transition-colors ml-auto"
            data-cursor-hover
          >
            <span>Explore Events</span>
            <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
