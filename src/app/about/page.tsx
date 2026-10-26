'use client';

import { useState, useId, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  teamDepartments,
  speakers,
  publicStats,
  statText,
  communityJoinUrl,
} from '../data';

// ─── Derived data ─────────────────────────────────────────────────────────────
// Flatten all team members and attach their department name — identical to the
// previous static version so every card renders the same way.
const teamMembers = teamDepartments.flatMap((dept) =>
  dept.members.map((member) => ({
    ...member,
    department: dept.department || 'Leadership',
  }))
);

// ─── SVG icons ────────────────────────────────────────────────────────────────
const LinkedInIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M19.54 3H4.46C3.65 3 3 3.62 3 4.39v15.22C3 20.38 3.65 21 4.46 21h15.08c.81 0 1.46-.62 1.46-1.39V4.39C21 3.62 20.35 3 19.54 3ZM8.38 18.06H5.7V9.27h2.68v8.79ZM7.04 8.08a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Zm11.02 9.98h-2.67v-4.27c0-1.02-.02-2.34-1.43-2.34-1.44 0-1.66 1.12-1.66 2.27v4.34h-2.68V9.27h2.57v1.2h.04c.36-.67 1.24-1.38 2.55-1.38 2.73 0 3.23 1.8 3.23 4.14v4.85Z" />
  </svg>
);

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
    <circle cx="11" cy="11" r="7" strokeLinecap="round" />
    <path d="M16.5 16.5L21 21" strokeLinecap="round" />
  </svg>
);

const UsersIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MicIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
    <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
  </svg>
);

// ─── Tab definitions — only categories with real data ─────────────────────────
const TABS = [
  {
    id: 'team' as const,
    label: 'Team',
    icon: UsersIcon,
    count: teamMembers.length,
  },
  {
    id: 'speakers' as const,
    label: 'Speakers',
    icon: MicIcon,
    count: speakers.length,
  },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ─── Empty state component ────────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-[color:var(--tv-text-muted)] stroke-[1.5]">
          <circle cx="11" cy="11" r="7" strokeLinecap="round" />
          <path d="M16.5 16.5L21 21" strokeLinecap="round" />
        </svg>
      </div>
      <p className="tv-heading text-lg font-semibold text-white">No results found</p>
      <p className="mt-2 text-sm text-[color:var(--tv-text-muted)]">
        No match for{' '}
        <span className="text-[color:var(--tv-primary)]">&ldquo;{query}&rdquo;</span>.
        Try a different name, role, or topic.
      </p>
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────
export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<TabId>('team');
  const [search, setSearch] = useState('');
  const tabListId = useId();
  const contentRef = useRef<HTMLDivElement>(null);

  const q = search.trim().toLowerCase();

  // Filtered data for each tab
  const filteredTeam = q
    ? teamMembers.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q) ||
          m.focus.toLowerCase().includes(q)
      )
    : teamMembers;

  const filteredSpeakers = q
    ? speakers.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.topic.toLowerCase().includes(q) ||
          s.event.toLowerCase().includes(q)
      )
    : speakers;

  function handleTabChange(id: TabId) {
    setActiveTab(id);
    setSearch('');
    // Scroll content area into view smoothly without jumping above the sticky bar
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">

      {/* ═══════════════════════════════════════════
          PAGE HEADER
      ═══════════════════════════════════════════ */}
      <div className="mb-8 space-y-2">
        <div className="tv-mono text-xs uppercase tracking-[0.36em] text-[color:var(--tv-primary)] font-semibold">
          About Us
        </div>
        <h1 className="tv-heading text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-white">
          Tech Vriksh Team Profiles
        </h1>
        <p className="text-sm sm:text-base text-[color:var(--tv-text-muted)] max-w-xl">
          {statText(publicStats.team)} student leaders and builders making events,
          community sessions, and programs happen every week.
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          STICKY TAB BAR
          Sits directly under the navbar (top-[60px]).
          The navbar is sticky top-0 z-50 at ~60px height;
          this bar is z-40 so it layers correctly.
      ═══════════════════════════════════════════ */}
      <div
        className="sticky top-[60px] z-40 -mx-4 mb-8 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,17,15,0.98) 80%, rgba(7,17,15,0) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">

          {/* Tab list */}
          <div
            id={tabListId}
            role="tablist"
            aria-label="About page categories"
            className="flex min-w-0 overflow-x-auto gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-sm scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  onKeyDown={(e) => {
                    // Arrow key navigation between tabs
                    const ids = TABS.map((t) => t.id);
                    const idx = ids.indexOf(tab.id);
                    if (e.key === 'ArrowRight') {
                      handleTabChange(ids[(idx + 1) % ids.length]);
                    } else if (e.key === 'ArrowLeft') {
                      handleTabChange(ids[(idx - 1 + ids.length) % ids.length]);
                    }
                  }}
                  tabIndex={isActive ? 0 : -1}
                  className={[
                    'relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs tv-mono font-semibold uppercase tracking-[0.16em]',
                    'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--tv-primary)] focus-visible:ring-offset-1 focus-visible:ring-offset-[#07110f]',
                    isActive
                      ? 'bg-gradient-to-br from-[rgba(57,217,138,0.18)] to-[rgba(33,108,103,0.22)] text-[color:var(--tv-primary)] border border-[color:var(--tv-primary)]/30 shadow-[0_0_14px_rgba(57,217,138,0.18)]'
                      : 'text-[color:var(--tv-text-muted)] hover:text-white hover:bg-white/[0.05]',
                  ].join(' ')}
                >
                  <Icon />
                  <span>{tab.label}</span>
                  {/* Count badge */}
                  <span
                    className={[
                      'inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[0.62rem] font-bold',
                      isActive
                        ? 'bg-[color:var(--tv-primary)]/20 text-[color:var(--tv-primary)]'
                        : 'bg-white/[0.06] text-[color:var(--tv-text-muted)]',
                    ].join(' ')}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search field */}
          <div className="relative flex-shrink-0 w-full sm:w-64">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[color:var(--tv-text-muted)]">
              <SearchIcon />
            </span>
            <input
              type="search"
              aria-label={`Search ${TABS.find((t) => t.id === activeTab)?.label ?? ''}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab === 'team' ? 'by name, role…' : 'by name, topic…'}`}
              className={[
                'w-full rounded-xl border bg-white/[0.03] py-2.5 pl-9 pr-4',
                'text-xs tv-mono text-[color:var(--tv-text-primary)] placeholder-[color:var(--tv-text-muted)]',
                'border-white/[0.08] transition-all duration-200',
                'focus:outline-none focus:border-[color:var(--tv-primary)]/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(57,217,138,0.12)]',
              ].join(' ')}
            />
            {/* Clear button */}
            {search && (
              <button
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-3 flex items-center text-[color:var(--tv-text-muted)] hover:text-white transition-colors"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Thin accent line beneath the bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-[color:var(--tv-border)] to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════
          TAB PANELS
      ═══════════════════════════════════════════ */}
      <div ref={contentRef}>

        {/* ── TEAM panel ── */}
        <div
          id="panel-team"
          role="tabpanel"
          aria-labelledby="tab-team"
          hidden={activeTab !== 'team'}
        >
          {activeTab === 'team' && (
            <>
              {filteredTeam.length === 0 ? (
                <EmptyState query={search} />
              ) : (
                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTeam.map((member) => (
                    <article
                      key={`${member.name}-${member.department}`}
                      className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.8)] to-[rgba(11,23,20,0.95)] p-5 sm:p-6 shadow-[var(--tv-shadow-md)] transition-all duration-500 hover:border-[color:var(--tv-primary)]/50 hover:shadow-[0_20px_50px_rgba(57,217,138,0.18)] hover:-translate-y-2"
                    >
                      {/* Image & Header Details */}
                      <div className="space-y-4">
                        <div className="relative w-full overflow-hidden rounded-2xl aspect-square border border-white/10 bg-black/40 shadow-inner">
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={600}
                            height={600}
                            className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        {/* Name, Role & Department */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="tv-heading text-xl sm:text-2xl font-bold tracking-[-0.03em] text-white group-hover:text-[color:var(--tv-primary)] transition-colors duration-300">
                              {member.name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-0.5">
                            <p className="tv-mono text-xs uppercase tracking-[0.2em] text-[color:var(--tv-cyan)] font-semibold">
                              {member.role}
                            </p>
                            <span className="tv-mono text-[0.62rem] uppercase tracking-[0.16em] text-[color:var(--tv-text-muted)] border border-white/10 rounded-full px-2.5 py-0.5 bg-white/[0.03]">
                              {member.department}
                            </span>
                          </div>
                        </div>

                        {/* Focus */}
                        <p className="text-xs sm:text-sm leading-relaxed text-[color:var(--tv-text-secondary)] line-clamp-2">
                          {member.focus}
                        </p>
                      </div>

                      {/* LinkedIn Button */}
                      <div className="mt-5 pt-4 border-t border-white/[0.08]">
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group/link inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[color:var(--tv-cyan)]/30 bg-[color:var(--tv-cyan)]/8 py-2.5 text-xs tv-mono font-semibold uppercase tracking-[0.18em] text-[color:var(--tv-cyan)] transition-all duration-300 hover:border-[color:var(--tv-cyan)] hover:bg-[color:var(--tv-cyan)]/20 group-hover:border-[color:var(--tv-primary)]/50 group-hover:text-[color:var(--tv-primary)] shadow-[0_0_12px_rgba(107,239,217,0.1)]"
                        >
                          <LinkedInIcon />
                          <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                            Connect on LinkedIn
                          </span>
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── SPEAKERS panel ── */}
        <div
          id="panel-speakers"
          role="tabpanel"
          aria-labelledby="tab-speakers"
          hidden={activeTab !== 'speakers'}
        >
          {activeTab === 'speakers' && (
            <>
              {filteredSpeakers.length === 0 ? (
                <EmptyState query={search} />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSpeakers.map((speaker) => (
                    <article
                      key={`${speaker.name}-${speaker.event}`}
                      className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.8)] to-[rgba(11,23,20,0.95)] p-5 sm:p-6 shadow-[var(--tv-shadow-md)] transition-all duration-500 hover:border-[color:var(--tv-primary)]/50 hover:shadow-[0_20px_50px_rgba(57,217,138,0.18)] hover:-translate-y-2"
                    >
                      {/* Image or initial avatar */}
                      <div className="space-y-4">
                        <div className="relative w-full overflow-hidden rounded-2xl aspect-square border border-white/10 bg-black/40 shadow-inner">
                          {speaker.image ? (
                            <Image
                              src={speaker.image}
                              alt={speaker.name}
                              width={600}
                              height={600}
                              className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[rgba(57,217,138,0.1)] to-[rgba(33,108,103,0.18)]">
                              <span className="tv-heading text-7xl font-bold text-[color:var(--tv-primary)] opacity-60">
                                {speaker.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        {/* Name, Role & Event badge */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="tv-heading text-xl sm:text-2xl font-bold tracking-[-0.03em] text-white group-hover:text-[color:var(--tv-primary)] transition-colors duration-300">
                              {speaker.name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-0.5">
                            <p className="tv-mono text-xs uppercase tracking-[0.2em] text-[color:var(--tv-cyan)] font-semibold">
                              {speaker.role}
                            </p>
                            {/* Event badge */}
                            <span className="tv-mono text-[0.62rem] uppercase tracking-[0.16em] text-[color:var(--tv-primary)] border border-[color:var(--tv-primary)]/20 rounded-full px-2.5 py-0.5 bg-[color:var(--tv-primary)]/5 shrink-0">
                              {speaker.event}
                            </span>
                          </div>
                        </div>

                        {/* Topic as focus text */}
                        <p className="text-xs sm:text-sm leading-relaxed text-[color:var(--tv-text-secondary)] line-clamp-2">
                          {speaker.topic}
                        </p>
                      </div>

                      {/* LinkedIn button — shown when URL available, greyed-out placeholder otherwise */}
                      <div className="mt-5 pt-4 border-t border-white/[0.08]">
                        {speaker.linkedinUrl ? (
                          <a
                            href={speaker.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group/link inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[color:var(--tv-cyan)]/30 bg-[color:var(--tv-cyan)]/8 py-2.5 text-xs tv-mono font-semibold uppercase tracking-[0.18em] text-[color:var(--tv-cyan)] transition-all duration-300 hover:border-[color:var(--tv-cyan)] hover:bg-[color:var(--tv-cyan)]/20 group-hover:border-[color:var(--tv-primary)]/50 group-hover:text-[color:var(--tv-primary)] shadow-[0_0_12px_rgba(107,239,217,0.1)]"
                          >
                            <LinkedInIcon />
                            <span className="transition-transform duration-300 group-hover/link:translate-x-1">Connect on LinkedIn</span>
                          </a>
                        ) : (
                          <div className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] py-2.5 text-xs tv-mono font-semibold uppercase tracking-[0.18em] text-[color:var(--tv-text-muted)] cursor-default">
                            <LinkedInIcon />
                            <span>LinkedIn coming soon</span>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          BOTTOM CTA
      ═══════════════════════════════════════════ */}
      <section className="mt-20 text-center">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[color:var(--tv-border)] bg-gradient-to-b from-[rgba(16,30,26,0.6)] to-[rgba(11,23,20,0.85)] p-10 sm:p-14 space-y-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(57,217,138,0.1),transparent_70%)]" />

          <div className="relative space-y-4">
            <div className="tv-mono text-xs uppercase tracking-[0.34em] text-[color:var(--tv-primary)] font-semibold">
              Be part of this
            </div>
            <h2 className="tv-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.04em] text-white">
              The next milestone involves you.
            </h2>
            <p className="mx-auto max-w-lg text-sm sm:text-base leading-relaxed text-[color:var(--tv-text-secondary)]">
              If you are a student who wants to build, learn, and connect with people doing the same — this is where you start.
            </p>
            <div className="pt-3">
              <a
                href={communityJoinUrl}
                target="_blank"
                rel="noreferrer"
                className="tv-button tv-button-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-xs sm:text-sm font-semibold tv-mono uppercase tracking-[0.18em] text-[color:var(--tv-text-primary)] transition-transform duration-300 hover:scale-105 shadow-[0_0_24px_rgba(57,217,138,0.35)]"
              >
                <span>Join Tech Vriksh</span>
                <span>↗</span>
              </a>
            </div>

            <p className="pt-2 text-xs text-[color:var(--tv-text-tertiary)]">
              Representing a company or college?{' '}
              <Link href="/partner" className="text-[color:var(--tv-primary)] hover:underline">
                Partner with us
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
