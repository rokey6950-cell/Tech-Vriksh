'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { communityJoinUrl, techVrikshLogoUrl } from '@/app/data';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/blog', label: 'Blog' },
  // Hackathons is off the nav until the page is rebuilt with fuller content and
  // real images. The route, data and components all remain — uncomment to
  // restore. Its events still appear on /events, filtered by "Hackathons".
  // { href: '/hackathons', label: 'Hackathons' },
  { href: '/about', label: 'About' },
  { href: '/join', label: 'Join' },
  { href: '/partner', label: 'Partner' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07110f]/90 backdrop-blur-2xl transition-all duration-300">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* ── LOGO & BRAND ── */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--tv-primary)]/35 bg-white/5 shadow-[0_0_16px_rgba(57,217,138,0.2)] transition-transform duration-300 group-hover:scale-105">
            <Image
              src={techVrikshLogoUrl}
              alt="Tech Vriksh logo"
              width={72}
              height={72}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="tv-heading text-lg font-bold leading-none tracking-[0.2em] text-[color:var(--tv-text-primary)] group-hover:text-[color:var(--tv-primary)] transition-colors">
                TECH VRIKSH
              </span>
            </div>
            <span className="tv-mono mt-1 text-[0.62rem] uppercase tracking-[0.28em] text-[color:var(--tv-text-muted)] hidden sm:inline-block">
              Real. Relevant. Rooted.
            </span>
          </div>
        </Link>

        {/* ── DESKTOP NAV & CTA ── */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 text-xs tv-mono font-medium tracking-[0.14em] uppercase transition-all duration-200 ${
                    isActive
                      ? 'text-[color:var(--tv-primary)] bg-[color:var(--tv-primary)]/10 border border-[color:var(--tv-primary)]/25 shadow-[0_0_12px_rgba(57,217,138,0.18)]'
                      : 'text-[color:var(--tv-text-secondary)] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <a
            href={communityJoinUrl}
            target="_blank"
            rel="noreferrer"
            className="tv-button tv-button-primary inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold tv-mono uppercase tracking-[0.14em] text-[color:var(--tv-text-primary)] transition-transform duration-200 hover:scale-105 shadow-[0_0_15px_rgba(57,217,138,0.25)]"
          >
            <span>Join Now</span>
            <span>↗</span>
          </a>
        </div>

        {/* ── MOBILE MENU TOGGLE ── */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={communityJoinUrl}
            target="_blank"
            rel="noreferrer"
            className="tv-button tv-button-primary inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold tv-mono uppercase tracking-[0.12em] text-[color:var(--tv-text-primary)]"
          >
            <span>Join</span>
            <span>↗</span>
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#07110f]/95 px-4 py-3 backdrop-blur-2xl md:hidden space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-xl px-4 py-2.5 text-xs tv-mono font-medium tracking-[0.14em] uppercase transition-colors ${
                  isActive
                    ? 'bg-[color:var(--tv-primary)]/15 text-[color:var(--tv-primary)] border border-[color:var(--tv-primary)]/30 font-semibold'
                    : 'text-[color:var(--tv-text-secondary)] hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}