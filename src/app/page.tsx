import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { Counter } from '@/components/counter';
import { DriveVideoEmbed } from '@/components/drive-video-embed';
import { IndiaMapLoader } from '@/components/india-map-loader';
import { PremiumCard, CardImage, CardBadge } from '@/components/ui/PremiumCard';
import { HeroVisual } from '@/components/ui/HeroVisual';
import { ValueProposition, CommunityStories, ProjectShowcase } from '@/components/sections';
import { communityGalleryPhotos, events, stateMembers, communityJoinUrl, publicStats, statText } from './data';

export default function HomePage() {
  // Featured events
  const featuredEventSlugs = ['ctrl-future', 'compilex-where-ideas-evolve-into-impact', 'techpath-1o-discover-decide-dominate'];
  const featuredEvents = featuredEventSlugs
    .map((slug) => events.find((event) => event.slug === slug))
    .filter((event): event is NonNullable<typeof event> => Boolean(event));
  // Derived, not hardcoded, so the recap can't drift from the events list.
  const sessions2025 = events.filter((event) => event.dateLabel.endsWith('2025')).length;

  return (
    <main className="relative">
      {/* ═══════════════════════════════════════════
          01 — HERO
      ═══════════════════════════════════════════ */}
      <section data-station="hero" className="mx-auto min-h-[calc(100svh-4.5rem)] flex items-center w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="tv-hero-in space-y-8">
            <div className="space-y-4">
              <div className="tv-mono text-xs uppercase tracking-[0.36em] text-[color:var(--tv-primary)]">
                Tech Vriksh
              </div>
              <h1 className="tv-heading text-[3.5rem] leading-[0.88] tracking-[-0.06em] text-[color:var(--tv-text-primary)] sm:text-[5rem] lg:text-[6rem]">
                BUILD.<br />
                LEARN.<br />
                <span className="tv-glow">GROW.</span>
              </h1>
            </div>

            <p className="max-w-lg text-lg leading-relaxed text-[color:var(--tv-text-secondary)]">
              A student-driven technology community connecting people, ideas and opportunities.
            </p>
            
            <p className="max-w-lg text-base leading-relaxed text-[color:var(--tv-text-muted)]">
              For students who don't want to just watch from the sidelines.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={communityJoinUrl}
                target="_blank"
                rel="noreferrer"
                className="tv-button tv-button-primary rounded-full px-7 py-4 text-sm font-medium text-[color:var(--tv-text-primary)]"
                data-cursor-hover
              >
                Join Community
              </a>
              <Link
                href="/events"
                className="tv-button rounded-full border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-medium text-[color:var(--tv-text-primary)] hover:border-[color:var(--tv-primary)]/30 hover:text-[color:var(--tv-primary)]"
                data-cursor-hover
              >
                Explore Events
              </Link>
            </div>
          </div>

          {/* Hero real event visual */}
          <div className="relative block w-full">
            <div className="w-full">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════
          02 — VALUE PROPOSITION
      ═══════════════════════════════════════════ */}
      <ValueProposition />

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════
          03 — RECENT HIGHLIGHTS
      ═══════════════════════════════════════════ */}
      <section data-station="highlights" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <Reveal>
          {/* Heading and gallery share one backdrop. They used to be two separate
              blocks, which paid the card's 3rem padding twice and spent another
              32px on the gap between them. Putting the strap line beside the
              heading rather than under it saves a further two lines. */}
          <div className="section-backdrop">
            <div className="grid gap-3 lg:grid-cols-2 lg:items-end lg:gap-10">
              <h2 className="tv-heading text-3xl tracking-[-0.05em] sm:text-4xl">
                What our sessions<br />actually look like
              </h2>
              <p className="text-sm leading-6 text-[color:var(--tv-text-secondary)] sm:text-base sm:leading-7">
                Real photos from live workshops and meetups — the people, the rooms, the work in progress.
              </p>
            </div>

            {/* The frames used to be sized by aspect ratio, so their height grew
                with the viewport: two stacked `4/3` half-width cells came to
                ~916px on a 1280px screen and the section filled a laptop display
                on its own. The row height is fixed now and the photographs crop
                into it, so the gallery reads as a band rather than a page. Same
                three photographs — one wide, two beside it — and on mobile the
                small pair sits side by side instead of stacking into a third
                screenful. */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:h-[300px] md:grid-cols-3 md:grid-rows-2 lg:h-[340px] xl:h-[380px]">
              {/* Large featured image */}
              {communityGalleryPhotos[0] && (
                <Reveal className="col-span-2 md:row-span-2">
                  <div className="group relative aspect-[16/9] h-full overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-white/[0.02] md:aspect-auto">
                    <Image
                      src={communityGalleryPhotos[0]}
                      alt="Tech Vriksh community session"
                      fill
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </Reveal>
              )}

              {/* Two smaller images */}
              {communityGalleryPhotos.slice(1, 3).map((src, index) => (
                <Reveal key={src} delay={index * 100}>
                  <div className="group relative aspect-[4/3] h-full overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-white/[0.02] md:aspect-auto">
                    <Image
                      src={src}
                      alt="Tech Vriksh community session"
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════
          04 — FEATURED EVENTS
      ═══════════════════════════════════════════ */}
      <section data-station="events" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <Reveal>
          <div className="section-backdrop">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="tv-section-label"></div>
                <h2 className="tv-heading mt-4 text-4xl tracking-[-0.05em] sm:text-5xl">
                  What's happening
                </h2>
              </div>
              <Link
                href="/events"
                className="tv-mono text-xs uppercase tracking-[0.24em] text-[color:var(--tv-primary)] hover:opacity-80"
                data-cursor-hover
              >
                View all events →
              </Link>
            </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event, index) => (
              <Reveal key={event.slug} delay={index * 100}>
                <PremiumCard>
                  {/* Event covers are portrait posters (0.62–1.00), so the box is
                      portrait too and the artwork is contained, not cropped. A
                      4/3 crop was discarding 25–47% of every one of them. */}
                  <CardImage
                    src={event.image}
                    alt={`${event.title} event poster`}
                    aspect="4/5"
                    fit="poster"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
                    badges={
                      <>
                        <CardBadge accent="primary">{event.subtitle}</CardBadge>
                        <CardBadge>{event.dateLabel}</CardBadge>
                      </>
                    }
                  />
                  <div className="flex flex-col gap-4 p-6">
                    <div>
                      <h3 className="tv-heading text-2xl tracking-[-0.03em] text-[color:var(--tv-text-primary)]">
                        {event.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[color:var(--tv-text-secondary)]">
                        {event.description}
                      </p>
                    </div>
                    {event.venue && (
                      <div className="tv-mono text-xs uppercase tracking-[0.24em] text-[color:var(--tv-text-muted)]">
                        {event.venue}
                      </div>
                    )}
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-[color:var(--tv-primary)] transition-all hover:gap-3"
                      data-cursor-hover
                    >
                      View event <span className="transition-transform">→</span>
                    </a>
                  </div>
                </PremiumCard>
              </Reveal>
            ))}
          </div>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════
          05 — PROJECT SHOWCASE
      ═══════════════════════════════════════════ */}
      <ProjectShowcase />

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════
          06 — COMMUNITY STORIES
      ═══════════════════════════════════════════ */}
      <CommunityStories />

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════
          07 — 2025 RECAP
      ═══════════════════════════════════════════ */}
      <section data-station="recap" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <Reveal>
          <div className="section-backdrop">
            {/* The embed is a 16:9 box that fills whatever width it is given, so
                stacking it under a full-width header made this the tallest block
                on the page: 612px of video before the heading and padding were
                counted. Beside the copy instead, the video sets the section's
                height rather than adding to it. */}
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-10 lg:gap-14">
              <div>
                <div className="tv-section-label">Recap</div>
                <h2 className="tv-heading mt-3 text-3xl leading-[1.05] tracking-[-0.05em] sm:text-4xl lg:text-[2.75rem]">
                  2025 RECAP
                </h2>
                <p className="mt-4 max-w-sm text-base leading-7 text-[color:var(--tv-text-secondary)]">
                  A year of Tech Vriksh, in one video.
                </p>
                <div className="tv-mono mt-5 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.24em] text-[color:var(--tv-text-muted)] lg:mt-6">
                  <span className="h-px w-8 bg-[color:var(--tv-border-strong)]" />
                  {sessions2025} sessions
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[1.9rem] border border-white/[0.08] bg-gradient-to-br from-[color:var(--tv-primary)]/[0.04] to-transparent p-2 shadow-[0_24px_64px_rgba(0,0,0,0.4)] transition-shadow duration-500 hover:shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                <DriveVideoEmbed
                  url="https://drive.google.com/file/d/1JWtB2j04oCn8ErjhcTMcHRrq2mwOA6-A/view?usp=drive_link"
                  title="Tech Vriksh 2025 year-in-review video"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════
          08 — TECH VRIKSH BRAND
      ═══════════════════════════════════════════ */}
      {/* The journey timeline used to occupy a 60% column beside this copy. It
          now lives on /about, which renders all seven `journeyMilestones` from
          data.ts rather than the condensed five hardcoded inside
          CommunityJourney.tsx — so the site no longer carries two versions of
          the same story. What remains is the brand context, reflowed into the
          heading-left / copy-right grid the Community and Recap sections
          already use, and given the same `section-backdrop` panel as the
          sections either side of it. */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <Reveal>
          <div className="section-backdrop">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
              <div>
                <div className="tv-section-label">TECH VRIKSH</div>
                <h2 className="tv-heading mt-3 text-3xl tracking-[-0.04em] leading-tight sm:text-4xl lg:text-[2.6rem]">
                  A growing student-driven technology community.
                </h2>
              </div>

              <div className="space-y-4">
                {/* Two credits, one sentence. "Founded by" and "run with" are
                    parallel participles hanging off Tech Vriksh, so the founder
                    and the team read as equal parts of the same clause rather
                    than a name followed by an afterthought — both carry the
                    brighter primary-text weight for the same reason. */}
                <p className="text-base leading-relaxed text-[color:var(--tv-text-secondary)]">
                  Founded by{' '}
                  <span className="text-[color:var(--tv-text-primary)] font-medium">Krishna Agarwal</span>{' '}
                  and run with the constant support of{' '}
                  <span className="text-[color:var(--tv-text-primary)] font-medium">the team</span>,
                  Tech Vriksh connects students and builders through practical workshops,
                  hackathons, collaborative learning, and hands-on projects.
                </p>
                <p className="text-sm leading-relaxed text-[color:var(--tv-text-muted)]">
                  Bridging the gap between classroom theory and real-world tech through honest community-driven exposure.
                </p>
                {/* Without this the homepage drops the journey with no route to
                    it. The label matches the /about heading so the destination
                    is predictable. */}
                <Link
                  href="/about"
                  className="tv-mono inline-flex items-center gap-2 pt-1 text-xs uppercase tracking-[0.24em] text-[color:var(--tv-primary)] transition-all hover:gap-3"
                  data-cursor-hover
                >
                  How it grew, in order <span className="transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════
          09 — COMMUNITY ACROSS INDIA
          The figures used to have a section of their own directly under the
          hero, which repeated the hero card's own stat row and spent a full
          section of height to say three numbers. They run down the right of the
          map now, beside the geography they actually describe.

          Three columns from `lg` up, so the heading sits *beside* the map rather
          than stacked above it and costs no vertical height at all on a laptop —
          it was previously ~210px of the section's total on its own.
      ═══════════════════════════════════════════ */}
      <section data-station="india" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <Reveal>
          <div className="section-backdrop">
            <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_190px] lg:items-stretch lg:gap-7">
              <div className="lg:flex lg:flex-col lg:justify-center">
                <div className="tv-section-label">Community</div>
                {/* Steps back down at `lg`, where the column is only 220px wide —
                    36px would set "Our community" wider than the column. */}
                <h2 className="tv-heading mt-3 text-3xl tracking-[-0.05em] sm:text-4xl lg:text-[1.75rem] xl:text-[2rem]">
                  Our community<br />across India
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--tv-text-secondary)]">
                  People, ideas and opportunities across {statText(publicStats.states)} states and
                  counting — hover a marker to see a state.
                </p>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute -inset-6 rounded-[2.4rem] bg-[radial-gradient(circle_at_50%_50%,rgba(57,217,138,0.08),transparent_60%)] blur-2xl" />
                <IndiaMapLoader data={stateMembers} />
              </div>

              {/* Two shapes, one list. Below `lg` each figure is a compact row —
                  number on the left, label on the right — which fits four of them
                  into ~208px instead of the ~400px four stacked blocks needed. At
                  `lg` they return to centred stacks that flex to the map's height,
                  so both columns bottom out together. `divide-y` is safe here: a
                  single-column flex list, never a grid. */}
              <div className="tv-card flex flex-col divide-y divide-[color:var(--tv-border)]">
                {[publicStats.members, publicStats.states, publicStats.events, publicStats.team].map(
                  (stat) => (
                    <div
                      key={stat.label}
                      className="group flex flex-1 items-baseline justify-between gap-3 px-5 py-3 lg:flex-col lg:items-start lg:justify-center lg:gap-0 lg:py-4"
                    >
                      <div className="tv-heading text-[1.75rem] leading-none tracking-[-0.06em] text-[color:var(--tv-text-primary)] transition-all duration-500 group-hover:[text-shadow:0_0_18px_rgba(57,217,138,0.32)] sm:text-[2rem]">
                        <Counter target={stat.count} suffix={stat.suffix} />
                      </div>
                      <div className="text-right lg:mt-2 lg:text-left">
                        <div className="tv-mono text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--tv-text-secondary)]">
                          {stat.label}
                        </div>
                        {stat.note && (
                          <div className="tv-mono mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-[color:var(--tv-text-tertiary)]">
                            {stat.note}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════
          10 — FINAL CTA
      ═══════════════════════════════════════════ */}
      <section data-station="cta" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-[color:var(--tv-primary)]/[0.06] to-transparent p-12 text-center sm:p-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(57,217,138,0.12),transparent_70%)]" />
            
            <div className="relative">
              <div className="tv-section-label"></div>
              <h2 className="tv-heading mt-6 text-4xl tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                YOUR TURN.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--tv-text-secondary)]">
                Don't just consume technology. Build with people.
              </p>
              
              <div className="mt-10">
                <a
                  href={communityJoinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="tv-button tv-button-primary inline-flex rounded-full px-8 py-5 text-base font-medium text-[color:var(--tv-text-primary)]"
                  data-cursor-hover
                >
                  Join Tech Vriksh
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
