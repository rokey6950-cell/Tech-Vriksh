import Image from 'next/image';
import Link from 'next/link';
import { events, speakers, communityJoinUrl, publicStats, statText } from '../data';
import { EventsClient } from './EventsClient';

// Pull out the featured flagship event (Ctrl + Future)
const FEATURED_SLUG = 'ctrl-future';

export default async function EventsPage() {
  const featuredEvent = events.find((e) => e.slug === FEATURED_SLUG);
  const nonFeaturedEvents = events.filter((e) => e.slug !== FEATURED_SLUG);

  // Speakers for the featured event
  const featuredSpeakers = speakers.filter((s) => s.event === 'Ctrl + Future');

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">

      {/* ═══ PAGE HEADER ═══ */}
      <div className="mb-10 space-y-4">
        <div className="tv-mono text-xs uppercase tracking-[0.36em] text-[color:var(--tv-primary)]">
          Tech Vriksh · Events
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="tv-heading text-4xl sm:text-5xl tracking-[-0.05em] max-w-xl">
            Workshops, sessions &amp; offline events
          </h1>
          {upcomingCount > 0 && (
            <div className="flex items-center gap-1.5 tv-mono text-xs text-[color:var(--tv-text-muted)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--tv-primary)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--tv-primary)]" />
              </span>
              <span className="uppercase tracking-[0.2em] text-[color:var(--tv-primary)]">
                {upcomingCount} Upcoming
              </span>
            </div>
          )}
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-[color:var(--tv-text-secondary)]">
          Every event is a chance to learn something real, meet someone who builds, and leave with more than you came with.
        </p>
      </div>

      {/* ═══ FEATURED FLAGSHIP CARD ═══ */}
      {featuredEvent && (
        <section className="mb-12">
          <div className="tv-mono mb-4 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--tv-text-muted)]">
            <div className="h-px w-6 bg-[color:var(--tv-border)]" />
            Flagship Event
          </div>

          <div className="group relative overflow-hidden rounded-[2rem] border border-[color:var(--tv-border)] shadow-[var(--tv-shadow-depth)]">
            {/* Background photo */}
            <div className="relative aspect-[16/7] sm:aspect-[21/8] lg:aspect-[2.8/1]">
              <Image
                src="/sample/CTRL+Future.jpeg"
                alt="CTRL + FUTURE — Tech Vriksh flagship community event at OpsTree Global, Noida"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 90vw"
                className="object-cover object-[center_28%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />

              {/* Layered gradients */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#040907]/90 via-[#040907]/50 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#040907]/95 to-transparent" />

              {/* ── Content over image ── */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12">

                {/* Top badges row */}
                <div className="mb-auto flex flex-wrap items-start gap-2 pt-2">
                  <span className="tv-mono rounded-full border border-[color:var(--tv-primary)]/30 bg-black/70 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-[color:var(--tv-primary)] backdrop-blur-sm font-semibold">
                    Flagship · Session
                  </span>
                  <span className="tv-mono rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-[color:var(--tv-text-secondary)] backdrop-blur-sm">
                    Offline · Noida
                  </span>
                  <span className="tv-mono rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-[color:var(--tv-text-muted)] backdrop-blur-sm">
                    {featuredEvent.dateLabel}
                  </span>
                </div>

                {/* Bottom content */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-3 max-w-2xl">
                    {/* Title */}
                    <h2 className="tv-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.05em] text-white leading-[0.92]">
                      CTRL + FUTURE
                    </h2>
                    <p className="tv-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-[color:var(--tv-primary)] font-medium">
                      AI · COMMUNITY · BUILD
                    </p>
                    <p className="max-w-lg text-sm sm:text-base leading-relaxed text-white/75">
                      {featuredEvent.description}
                    </p>

                    {/* Stats row — the first three are facts about this event and
                        stay exact; the last is a community-wide figure, so it
                        uses the rounded one every other page quotes. */}
                    <div className="flex flex-wrap gap-5 pt-1">
                      {[
                        { value: '80+', label: 'Attendees' },
                        { value: '4', label: 'Sessions' },
                        { value: '3', label: 'Speakers' },
                        { value: statText(publicStats.states), label: 'States' },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="tv-heading text-2xl sm:text-3xl font-bold text-white">
                            {stat.value}
                          </div>
                          <div className="tv-mono text-[0.62rem] uppercase tracking-[0.2em] text-[color:var(--tv-text-muted)] mt-0.5">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right panel — speakers + CTA */}
                  <div className="flex flex-col gap-4 lg:items-end lg:min-w-[260px]">
                    {/* Speakers */}
                    {featuredSpeakers.length > 0 && (
                      <div className="rounded-2xl border border-white/10 bg-black/65 p-4 backdrop-blur-md space-y-3 w-full lg:max-w-[260px]">
                        <div className="tv-mono text-[0.62rem] uppercase tracking-[0.25em] text-[color:var(--tv-text-muted)]">
                          Speakers
                        </div>
                        <div className="space-y-2.5">
                          {featuredSpeakers.map((spk) => (
                            <div key={spk.name} className="flex flex-col gap-0.5">
                              <span className="text-sm font-medium text-white leading-tight">{spk.name}</span>
                              <span className="tv-mono text-[0.65rem] text-[color:var(--tv-text-muted)]">
                                {spk.role}{spk.company ? ` · ${spk.company}` : ''}
                              </span>
                              <span className="text-[0.68rem] text-[color:var(--tv-text-secondary)] italic">"{spk.topic}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA — internal recap route. This pointed at
                        `registrationUrl` in a new tab, which is a lu.ma URL that
                        404s; that is what made "Event Recap" lead nowhere. */}
                    <Link
                      href={`/events/${featuredEvent.slug}`}
                      className="group/cta inline-flex items-center gap-2 tv-mono text-sm uppercase tracking-[0.2em] font-medium text-[color:var(--tv-text-muted)] hover:text-white transition-colors"
                    >
                      <span>Event Recap</span>
                      <span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                    </Link>
n                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ DIVIDER ═══ */}
      <div className="mb-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--tv-border)] to-transparent" />
        <span className="tv-mono text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--tv-text-tertiary)]">
          All Events
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--tv-border)] to-transparent" />
      </div>

      {/* ═══ FILTERABLE EVENTS GRID (client) ═══ */}
      <EventsClient nonFeaturedEvents={nonFeaturedEvents} />

      {/* ═══ FOOTER NUDGE ═══ */}
      <div className="mt-16 rounded-[2rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.5)] to-[rgba(11,23,20,0.7)] p-8 sm:p-12 text-center space-y-5">
        <div className="tv-mono text-xs uppercase tracking-[0.3em] text-[color:var(--tv-text-muted)]">
          What&apos;s next
        </div>
        <h2 className="tv-heading text-2xl sm:text-3xl tracking-[-0.04em]">
          More events are coming.
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[color:var(--tv-text-secondary)]">
          Every few weeks, something new happens inside Tech Vriksh — a workshop, a session, an offline meetup.
          Join the community to be there when it does.
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
            href="/"
            className="tv-button inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-[color:var(--tv-text-primary)] hover:border-[color:var(--tv-primary)]/30 hover:text-[color:var(--tv-primary)]"
          >
            Explore More
          </Link>
        </div>
      </div>
    </main>
  );
}
