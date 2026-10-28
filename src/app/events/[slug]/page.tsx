import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { events, speakers, communityJoinUrl } from '../../data';
import { PosterImage } from '@/components/ui/PosterImage';

const kindLabel: Record<string, string> = {
  session: 'Session',
  workshop: 'Workshop',
  hackathon: 'Hackathon'
};

const kindColor: Record<string, string> = {
  session: 'text-[color:var(--tv-cyan)]',
  workshop: 'text-[color:var(--tv-magenta)]',
  hackathon: 'text-[color:var(--tv-primary)]'
};

function findEvent(slug: string) {
  return events.find((item) => item.slug === slug);
}

/**
 * One gallery frame.
 *
 * The container's ratio is fixed and `PosterImage` contains the photo inside it,
 * so a portrait shot or a 2.2:1 panorama can never stretch the row or get its
 * people cropped off at the edges. What that leaves is letterbox space, and the
 * two overlays are what stop the frame reading as a photo pasted onto the page:
 * a background-coloured vignette pulls the edges down into the border, and a
 * whisper of the brand green rises from the bottom so the frame carries the same
 * colour as the section around it.
 *
 * Both overlays use literal `rgba()` on purpose — a `var()` colour with a
 * Tailwind opacity modifier (`bg-[color:var(--tv-bg-deep)]/40`) compiles to no
 * CSS at all.
 */
function GalleryFrame({
  src,
  alt,
  sizes,
  ratio,
  priority = false,
  className = ''
}: {
  src: string;
  alt: string;
  sizes: string;
  /** Tailwind aspect classes for the box. Kept shorter than the photos are tall. */
  ratio: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-[1.25rem] border border-[color:var(--tv-border)] bg-[rgba(4,10,8,0.6)] shadow-[var(--tv-shadow-md)] transition-colors duration-300 hover:border-[color:var(--tv-border-strong)] ${className}`}
    >
      <div className={`relative w-full ${ratio}`}>
        <PosterImage src={src} alt={alt} sizes={sizes} priority={priority} />

        {/* Vignette. Centre stays transparent so faces keep their contrast. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(4,10,8,0.22)] via-transparent to-[rgba(4,10,8,0.42)] shadow-[inset_0_0_70px_18px_rgba(4,10,8,0.5)]" />

        {/* Brand tint, bottom edge only. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_112%,rgba(57,217,138,0.14),transparent_60%)]" />
      </div>
    </figure>
  );
}

/**
 * Every event in `data.ts` gets a page, so all of them are prerendered at build
 * time. Slugs outside this list still resolve to the route and fall through to
 * `notFound()` below — a real 404, not an empty page.
 */
export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = findEvent(slug);

  if (!event) {
    return { title: 'Event not found — Tech Vriksh' };
  }

  return {
    title: `${event.title} — Tech Vriksh`,
    description: event.description
  };
}

export default async function EventRecapPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = findEvent(slug);

  if (!event) notFound();

  const gallery = event.galleryImages ?? [];
  const [lead, ...rest] = gallery;

  // Screen captures for the online sessions, photographs for the offline ones —
  // see the notes on each `galleryImages` array in `data.ts`.
  const imageNoun = event.format === 'online' ? 'screen capture' : 'photograph';

  // Matched on exact title or title prefix (e.g. 'Techpath 1.O' or 'Tech Baithak')
  const eventSpeakers = speakers.filter(
    (s) =>
      s.event === event.title ||
      event.title.startsWith(s.event) ||
      s.event.toLowerCase().includes(event.title.toLowerCase())
  );

  const isUpcoming = event.status === 'upcoming';

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">

      {/* ═══ BACK LINK ═══ */}
      {/* The site header is `sticky top-0`, so it keeps its place in normal flow
          and never covers what follows — the page needs breathing room under it,
          not an offset the height of the bar. `pt-6` on <main> above is that
          breathing room. */}
      <Link
        href="/events"
        className="group/back tv-mono mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[color:var(--tv-text-muted)] hover:text-[color:var(--tv-primary)] transition-colors"
      >
        <span className="transition-transform duration-300 group-hover/back:-translate-x-1">←</span>
        <span>All Events</span>
      </Link>

      {/* ═══ HEADER ═══ */}
      {/* Typographic rather than a cover image: the poster in `event.image` is
          still served from Drive, and the photographs below are the point of the
          page anyway. */}
      <header className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`tv-mono rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] font-semibold ${kindColor[event.kind]}`}
          >
            {kindLabel[event.kind]}
          </span>
          {event.format && (
            <span className="tv-mono rounded-full border border-[color:var(--tv-border)] bg-white/[0.03] px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-[color:var(--tv-text-muted)]">
              {event.format === 'online' ? 'Online' : 'Offline'}
            </span>
          )}
          <span className="tv-mono rounded-full border border-[color:var(--tv-border)] bg-white/[0.03] px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-[color:var(--tv-text-muted)]">
            {event.dateLabel}
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="tv-heading max-w-3xl text-3xl font-bold leading-[1.05] tracking-[-0.05em] sm:text-5xl">
            {event.title}
          </h1>
          <p className="tv-mono text-xs uppercase tracking-[0.28em] text-[color:var(--tv-primary)] font-medium sm:text-sm">
            {event.subtitle}
          </p>
        </div>

        <p className="max-w-2xl text-base leading-relaxed text-[color:var(--tv-text-secondary)]">
          {event.description}
        </p>

        {event.venue && (
          <div className="flex items-center gap-2 tv-mono text-xs text-[color:var(--tv-text-muted)]">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.venue}</span>
          </div>
        )}
      </header>

      {/* ═══ NOTES + SPEAKERS ═══ */}
      {(event.notes?.length || eventSpeakers.length > 0) && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {event.notes && event.notes.length > 0 && (
            <section className="rounded-2xl border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.72)] to-[rgba(11,23,20,0.88)] p-5 sm:p-6 space-y-4">
              <div className="tv-mono text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--tv-text-muted)]">
                On the day
              </div>
              <div className="space-y-2">
                {event.notes.map((note) => (
                  <div key={note} className="flex items-start gap-2 tv-mono text-xs text-[color:var(--tv-text-secondary)]">
                    <span className="mt-px shrink-0 text-[color:var(--tv-primary)]">·</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {eventSpeakers.length > 0 && (
            <section className="rounded-2xl border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.72)] to-[rgba(11,23,20,0.88)] p-5 sm:p-6 space-y-4">
              <div className="tv-mono text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--tv-text-muted)]">
                Speakers
              </div>
              <div className="space-y-3">
                {eventSpeakers.map((spk) => (
                  <div key={spk.name} className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium leading-tight text-[color:var(--tv-text-primary)]">
                      {spk.name}
                    </span>
                    <span className="tv-mono text-[0.65rem] text-[color:var(--tv-text-muted)]">{spk.role}</span>
                    <span className="text-[0.7rem] italic text-[color:var(--tv-text-secondary)]">
                      &ldquo;{spk.topic}&rdquo;
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ═══ GALLERY ═══ */}
      <section className="mt-10">
        <div className="tv-mono mb-5 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--tv-text-muted)]">
          <div className="h-px w-6 bg-[color:var(--tv-border)]" />
          {event.format === 'online' ? 'From the session' : 'From the event'}
          {gallery.length > 0 && (
            <span className="text-[color:var(--tv-text-tertiary)]">
              {String(gallery.length).padStart(2, '0')}
            </span>
          )}
        </div>

        {gallery.length === 0 ? (
          /* No photographs on record for this event. Says so plainly — the page
             still carries the event's own details above, so it is never blank. */
          <div className="rounded-2xl border border-[color:var(--tv-border)] bg-white/[0.02] p-10 text-center sm:p-14">
            <h2 className="tv-heading text-xl tracking-[-0.03em] text-[color:var(--tv-text-primary)] sm:text-2xl">
              {isUpcoming ? 'Recap coming after the event.' : 'Event recap coming soon.'}
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[color:var(--tv-text-secondary)]">
              Photos from this event will be added soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {/* Lead frame — 3:2 on phones, 2:1 from `sm` up. Shorter than the
                photos themselves, which keeps the gallery from running the whole
                length of the viewport. */}
            <GalleryFrame
              src={lead}
              alt={`${event.title} — ${imageNoun} 1 of ${gallery.length}`}
              sizes="(max-width: 1024px) 100vw, 1152px"
              ratio="aspect-[3/2] sm:aspect-[2/1]"
              priority
              className="rounded-[1.5rem] shadow-[var(--tv-shadow-depth)]"
            />

            {/* The rest, two up. An odd one out spans the row instead of leaving
                a hole beside it. Lazy by default — only the lead is priority. */}
            {rest.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {rest.map((src, i) => {
                  const spans = rest.length % 2 === 1 && i === rest.length - 1;
                  return (
                    <GalleryFrame
                      key={src}
                      src={src}
                      alt={`${event.title} — ${imageNoun} ${i + 2} of ${gallery.length}`}
                      sizes={
                        spans
                          ? '(max-width: 1024px) 100vw, 1152px'
                          : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 566px'
                      }
                      ratio={spans ? 'aspect-[3/2] sm:aspect-[2/1]' : 'aspect-[3/2]'}
                      className={spans ? 'sm:col-span-2' : ''}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══ CLOSING CTA ═══ */}
      <div className="mt-16 rounded-[2rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.5)] to-[rgba(11,23,20,0.7)] p-8 text-center space-y-5 sm:p-12">
        <div className="tv-mono text-xs uppercase tracking-[0.3em] text-[color:var(--tv-text-muted)]">
          Next time
        </div>
        <h2 className="tv-heading text-2xl tracking-[-0.04em] sm:text-3xl">
          Be in the room.
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[color:var(--tv-text-secondary)]">
          Every few weeks Tech Vriksh runs something new — a workshop, a session, an offline meetup.
          Join the community and you will hear about the next one first.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href={communityJoinUrl}
            target="_blank"
            rel="noreferrer"
            className="tv-button tv-button-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-[color:var(--tv-text-primary)]"
          >
            Join Community
          </a>
          <Link
            href="/events"
            className="tv-button inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-[color:var(--tv-text-primary)] hover:border-[color:var(--tv-primary)]/30 hover:text-[color:var(--tv-primary)]"
          >
            All Events
          </Link>
        </div>
      </div>
    </main>
  );
}
