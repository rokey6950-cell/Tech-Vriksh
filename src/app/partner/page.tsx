import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  collaborations,
  communityLinkedInUrl,
  events,
  eventHostVenues,
  founder,
  partnershipEmail,
  partnershipFormUrl,
  publicStats,
  speakers,
  statText
} from '../data';

export const metadata: Metadata = {
  title: 'Partner with Tech Vriksh',
  description:
    'Host a session, send a speaker, or support an event for a student-driven technology community of ' +
    `${statText(publicStats.members)} members across ${statText(publicStats.states)} states in India.`
};

/**
 * What Tech Vriksh is asking for — offers, not history. Nothing here claims a
 * past arrangement; the proof section below does that, and only from records
 * that exist in `data.ts`.
 */
const partnershipTracks = [
  {
    accent: 'primary',
    title: 'Host a session',
    detail:
      'Offer a room in your office for an evening. Tech Vriksh brings the audience, the speakers, the schedule and the volunteers — you provide the space and, if you want it, someone from your team on stage.',
    ask: 'A room for 60–100 people'
  },
  {
    accent: 'cyan',
    title: 'Send a speaker',
    detail:
      'Put an engineer in front of students who actually want the detail. Sessions run practical rather than promotional — the format that has worked is one engineer, one real problem, and time for questions afterwards.',
    ask: '45–60 minutes of one engineer'
  },
  {
    accent: 'magenta',
    title: 'Support an event',
    detail:
      'Every event so far has run unpaid, with no personal income taken from the community. Support covers the things goodwill cannot: venue costs where a host is not available, refreshments, prizes and travel for speakers.',
    ask: 'Per-event, scoped with you'
  },
  {
    accent: 'primary',
    title: 'Collaborate as a college',
    detail:
      'Bring a Tech Vriksh session onto your campus, or point your students at the community for events they can attend for free. Nothing is charged to students or to the institution at any point.',
    ask: 'A hall and an announcement'
  }
] as const;

// Full class strings, never interpolated. Tailwind generates utilities by
// scanning source text, so a composed `group-hover:${accent.text}` would compile
// to nothing — the variant has to appear here literally.
const accentClasses = {
  primary: {
    border: 'border-[rgba(57,217,138,0.25)]',
    bg: 'bg-[rgba(57,217,138,0.1)]',
    text: 'text-[color:var(--tv-primary)]',
    titleHover: 'group-hover:text-[color:var(--tv-primary)]',
    cardHover: 'hover:border-[rgba(57,217,138,0.5)]'
  },
  cyan: {
    border: 'border-[rgba(107,239,215,0.25)]',
    bg: 'bg-[rgba(107,239,215,0.1)]',
    text: 'text-[color:var(--tv-cyan)]',
    titleHover: 'group-hover:text-[color:var(--tv-cyan)]',
    cardHover: 'hover:border-[rgba(107,239,215,0.5)]'
  },
  magenta: {
    border: 'border-[rgba(249,163,200,0.25)]',
    bg: 'bg-[rgba(249,163,200,0.1)]',
    text: 'text-[color:var(--tv-magenta)]',
    titleHover: 'group-hover:text-[color:var(--tv-magenta)]',
    cardHover: 'hover:border-[rgba(249,163,200,0.5)]'
  }
} as const;

export default function PartnerPage() {
  // The flagship event carries the only headcount any record states, so it is
  // the one event quoted by name below.
  const flagship = events.find((event) => event.slug === 'ctrl-future');
  const flagshipSpeakers = speakers.filter((speaker) => speaker.event === 'Ctrl + Future');

  // Contact tiles are built as a list so an unfilled constant drops out entirely
  // rather than rendering an empty or invented destination.
  const contactRoutes = [
    partnershipEmail && {
      key: 'email',
      label: 'Email',
      value: partnershipEmail,
      // Gmail web compose with the recipient pre-filled — deliberately NOT a
      // `mailto:`, so the click lands in Gmail in the browser rather than
      // whatever desktop mail client happens to be registered. `?view=cm&fs=1`
      // is Gmail's "compose, full-screen" mode; `to=` is the recipient. The
      // yahoo.com recipient is just an address — the sender still composes in
      // Gmail, so this never routes to Yahoo Mail.
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(partnershipEmail)}`,
      // Opens in a new tab (like the LinkedIn cards) so the partner page stays
      // put. `external` is left false only so the card keeps its `→` indicator
      // unchanged; `newTab` drives the target without touching that styling.
      external: false,
      newTab: true
    },
    partnershipFormUrl && {
      key: 'form',
      label: 'Partnership form',
      value: 'Send details in a short form',
      href: partnershipFormUrl,
      external: true
    },
    founder && {
      key: 'founder',
      label: `${founder.name} · Founder`,
      value: 'Message directly on LinkedIn',
      href: founder.linkedinUrl,
      external: true
    },
    {
      key: 'company',
      label: 'Tech Vriksh on LinkedIn',
      value: 'Company page',
      href: communityLinkedInUrl,
      external: true
    }
  ].filter(Boolean) as {
    key: string;
    label: string;
    value: string;
    href: string;
    external: boolean;
    /** Force a new tab without switching the card's `→` indicator to `↗`. */
    newTab?: boolean;
  }[];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">

      {/* ═══════════════════════════════════════════
          SECTION 1: HERO & REACH GRID
      ═══════════════════════════════════════════ */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">

        {/* Left: The pitch */}
        <div className="group relative overflow-hidden rounded-[2.2rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.85)] to-[rgba(11,23,20,0.95)] p-8 sm:p-10 shadow-[var(--tv-shadow-depth)] transition-all duration-500 hover:border-[rgba(57,217,138,0.4)] hover:shadow-[0_16px_48px_rgba(57,217,138,0.12)]">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[rgba(57,217,138,0.1)] blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative">
            <div className="tv-mono text-xs uppercase tracking-[0.34em] text-[color:var(--tv-primary)] font-semibold">
              For Companies &amp; Colleges
            </div>

            <h1 className="tv-heading mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] text-white leading-[1.08]">
              Reach students <span className="text-[color:var(--tv-primary)] tv-glow">who show up.</span>
            </h1>

            <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-[color:var(--tv-text-secondary)]">
              <p>
                Tech Vriksh is a student-driven technology community running practical workshops,
                offline sessions and hackathons across India. Every event is free to attend, the team is
                unpaid, and the founder takes no personal income from it.
              </p>
              <p>
                That means a partnership here is not an advertising buy. It is a room, a speaker, or the
                cost of running one event — and in return your engineers spend an evening with students
                who chose to be there on a weekday night.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 pt-5 border-t border-white/[0.08]">
              <a
                href="#contact"
                className="tv-button tv-button-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold tv-mono uppercase tracking-[0.16em] text-[color:var(--tv-text-primary)] transition-transform duration-300 hover:scale-105 shadow-[0_0_16px_rgba(57,217,138,0.3)]"
              >
                <span>Start a Conversation</span>
                <span>↓</span>
              </a>
              <Link
                href="/events"
                className="tv-button inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs font-semibold tv-mono uppercase tracking-[0.16em] text-[color:var(--tv-text-primary)] transition-all duration-300 hover:border-[rgba(57,217,138,0.4)] hover:text-[color:var(--tv-primary)] hover:bg-white/[0.08]"
              >
                <span>See Past Events</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Reach — every figure counted from data.ts, none typed by hand */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.75)] to-[rgba(11,23,20,0.9)] p-8 sm:p-10 shadow-[var(--tv-shadow-md)]">
          <div>
            <div className="tv-mono text-xs uppercase tracking-[0.34em] text-[color:var(--tv-cyan)] font-semibold">
              The Reach
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[rgba(57,217,138,0.2)] bg-white/[0.03] p-5">
                <div className="tv-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {statText(publicStats.members)}
                </div>
                <div className="tv-mono mt-1 text-[0.66rem] uppercase tracking-[0.18em] text-[color:var(--tv-text-muted)]">
                  Members
                </div>
              </div>
              <div className="rounded-2xl border border-[rgba(107,239,215,0.2)] bg-white/[0.03] p-5">
                <div className="tv-heading text-3xl sm:text-4xl font-bold text-[color:var(--tv-cyan)] tracking-tight">
                  {statText(publicStats.states)}
                </div>
                <div className="tv-mono mt-1 text-[0.66rem] uppercase tracking-[0.18em] text-[color:var(--tv-text-muted)]">
                  States
                </div>
              </div>
              <div className="rounded-2xl border border-[rgba(249,163,200,0.2)] bg-white/[0.03] p-5">
                <div className="tv-heading text-3xl sm:text-4xl font-bold text-[color:var(--tv-magenta)] tracking-tight">
                  {statText(publicStats.events)}
                </div>
                <div className="tv-mono mt-1 text-[0.66rem] uppercase tracking-[0.18em] text-[color:var(--tv-text-muted)]">
                  Events Run
                </div>
              </div>
              <div className="rounded-2xl border border-[rgba(57,217,138,0.2)] bg-white/[0.03] p-5">
                <div className="tv-heading text-3xl sm:text-4xl font-bold text-[color:var(--tv-primary-light)] tracking-tight">
                  Free
                </div>
                <div className="tv-mono mt-1 text-[0.66rem] uppercase tracking-[0.18em] text-[color:var(--tv-text-muted)]">
                  Always, To Attend
                </div>
              </div>
            </div>
          </div>

          {eventHostVenues.length > 0 && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 px-5 py-4">
              <div className="tv-mono text-[0.62rem] uppercase tracking-[0.22em] text-[color:var(--tv-text-muted)]">
                Previously hosted at
              </div>
              <p className="tv-mono mt-2 text-sm text-white/90">
                {eventHostVenues.join(' · ')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2: WAYS TO PARTNER
      ═══════════════════════════════════════════ */}
      <section className="mt-20">
        <div className="mb-10 space-y-2">
          <div className="tv-mono text-xs uppercase tracking-[0.36em] text-[color:var(--tv-primary)] font-semibold">
            Ways In
          </div>
          <h2 className="tv-heading text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-white">
            Four ways to work together.
          </h2>
          <p className="text-sm sm:text-base text-[color:var(--tv-text-muted)] max-w-xl">
            Pick whichever costs you least. Any one of these is worth more to the community than nothing at all.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {partnershipTracks.map((track) => {
            const accent = accentClasses[track.accent];

            return (
              <article
                key={track.title}
                className={`group flex flex-col justify-between rounded-[2rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.8)] to-[rgba(11,23,20,0.95)] p-6 sm:p-7 shadow-[var(--tv-shadow-md)] transition-all duration-500 ${accent.cardHover} hover:shadow-[0_16px_40px_rgba(57,217,138,0.12)] hover:-translate-y-1.5`}
              >
                <div className="space-y-3">
                  <h3 className={`tv-heading text-2xl font-bold tracking-[-0.03em] text-white transition-colors duration-300 ${accent.titleHover}`}>
                    {track.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[color:var(--tv-text-secondary)]">
                    {track.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08]">
                  <span
                    className={`tv-mono inline-flex rounded-full border px-4 py-1.5 text-[0.66rem] uppercase tracking-[0.18em] font-semibold ${accent.border} ${accent.bg} ${accent.text}`}
                  >
                    {track.ask}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: PROOF — what has actually happened
      ═══════════════════════════════════════════ */}
      <section className="mt-20">
        <div className="mb-10 space-y-2">
          <div className="tv-mono text-xs uppercase tracking-[0.36em] text-[color:var(--tv-cyan)] font-semibold">
            Track Record
          </div>
          <h2 className="tv-heading text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-white">
            What this looks like in practice.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">

          {/* The flagship, quoted from its own event record */}
          {flagship && (
            <div className="group relative overflow-hidden rounded-[2.2rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.85)] to-[rgba(11,23,20,0.95)] shadow-[var(--tv-shadow-depth)]">
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <Image
                  src="/sample/CTRL+Future.jpeg"
                  alt={`Attendees at the Tech Vriksh ${flagship.title} event`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover object-[center_28%] transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040907] via-[#040907]/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2">
                  <span className="tv-mono rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                    {flagship.dateLabel}
                  </span>
                  {flagship.venue && (
                    <span className="tv-mono rounded-full border border-[rgba(57,217,138,0.3)] bg-black/70 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-[color:var(--tv-primary)] backdrop-blur-sm">
                      {flagship.venue}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-7 sm:p-8">
                <h3 className="tv-heading text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
                  {flagship.title}
                </h3>
                {/* '~80–90 attendees' and 'Four sessions' are the notes recorded on
                    this event in data.ts — the only headcount any record states. */}
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[color:var(--tv-text-secondary)]">
                  80–90 attendees across four sessions, hosted in an industry office rather than a
                  campus hall. {flagshipSpeakers.length} external speakers took part.
                </p>

                {flagshipSpeakers.length > 0 && (
                  <ul className="mt-6 space-y-2.5 border-t border-white/[0.08] pt-5">
                    {flagshipSpeakers.map((speaker) => (
                      <li key={speaker.name} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                        <span className="text-sm font-medium text-white/90">{speaker.name}</span>
                        <span className="tv-mono text-[0.66rem] uppercase tracking-[0.16em] text-[color:var(--tv-cyan)]">
                          {speaker.role}{speaker.company ? ` · ${speaker.company}` : ''}
                        </span>
                        <span className="text-xs text-[color:var(--tv-text-muted)]">— {speaker.topic}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Collaborations already recorded on the site */}
          <div className="rounded-[2.2rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.75)] to-[rgba(11,23,20,0.9)] p-7 sm:p-8 shadow-[var(--tv-shadow-md)]">
            <div className="tv-mono text-xs uppercase tracking-[0.28em] text-[color:var(--tv-magenta)] font-semibold">
              Worked With
            </div>

            <div className="mt-6 space-y-4">
              {collaborations.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
                >
                  <div className="tv-mono text-[0.6rem] uppercase tracking-[0.2em] text-[color:var(--tv-text-muted)]">
                    {item.label}
                  </div>
                  <h4 className="tv-heading mt-1.5 text-base font-semibold text-white">{item.title}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--tv-text-secondary)]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: CONTACT
      ═══════════════════════════════════════════ */}
      <section id="contact" className="mt-20 scroll-mt-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.6)] to-[rgba(11,23,20,0.85)] p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(57,217,138,0.1),transparent_70%)]" />

          <div className="relative">
            <div className="text-center space-y-4">
              <div className="tv-mono text-xs uppercase tracking-[0.34em] text-[color:var(--tv-primary)] font-semibold">
                Get In Touch
              </div>
              <h2 className="tv-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.04em] text-white">
                Tell us what you have in mind.
              </h2>
              <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-[color:var(--tv-text-secondary)]">
                A room, a speaker, a campus date, or something not listed here — a short message with
                what you can offer is enough to start.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {contactRoutes.map((route) => (
                <a
                  key={route.key}
                  href={route.href}
                  {...(route.external || route.newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 transition-all duration-300 hover:border-[rgba(57,217,138,0.45)] hover:bg-white/[0.07]"
                >
                  <span className="min-w-0">
                    <span className="tv-mono block text-[0.62rem] uppercase tracking-[0.2em] text-[color:var(--tv-text-muted)]">
                      {route.label}
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-white/90 group-hover:text-[color:var(--tv-primary)] transition-colors">
                      {route.value}
                    </span>
                  </span>
                  <span className="tv-mono shrink-0 text-[color:var(--tv-primary)] transition-transform duration-300 group-hover:translate-x-1">
                    {route.external ? '↗' : '→'}
                  </span>
                </a>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-[color:var(--tv-text-tertiary)]">
              Students looking to join the community should use the{' '}
              <Link href="/join" className="text-[color:var(--tv-primary)] hover:underline">
                Join page
              </Link>{' '}
              instead — this page is for organisations.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
