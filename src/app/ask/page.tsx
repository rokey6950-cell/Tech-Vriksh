'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Citation {
  url?: string;
  title?: string;
  startIndex?: number;
  endIndex?: number;
}

interface SearchResult {
  id: number;
  title: string;
  url: string;
  snippet?: string;
  date?: string;
}

const suggestedQueries = [
  'Upcoming hackathons & tech summits in India',
  'What is Tech Vriksh and its key initiatives?',
  'Latest breakthroughs in AI Agents & LLMs',
  'How to build open-source projects for tech communities',
];

export default function AskPage() {
  const [query, setQuery] = useState('');
  const [effort, setEffort] = useState<'fast' | 'low' | 'medium'>('low');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [model, setModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(promptToSubmit?: string) {
    const q = promptToSubmit || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    setCitations([]);
    setSearchResults([]);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          effort,
          instructions:
            'You are the Tech Vriksh AI Assistant. Provide helpful, accurate, and up-to-date answers grounded in real-time web search. Always cite your sources.',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      setAnswer(data.answer);
      setCitations(data.citations || []);
      setSearchResults(data.searchResults || []);
      setModel(data.model || null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to query the AI agent.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ── HEADER ── */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tv-mono uppercase tracking-[0.16em] text-emerald-400 mb-4 shadow-[0_0_15px_rgba(57,217,138,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Perplexity Agent API Grounded Search
        </div>
        <h1 className="tv-heading text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
          Ask <span className="text-[color:var(--tv-primary)]">Tech Vriksh AI</span>
        </h1>
        <p className="mt-4 text-base text-[color:var(--tv-text-secondary)] sm:text-lg">
          Live web-grounded answers powered by Perplexity AI. Real-time research, verified citations, and community knowledge in one place.
        </p>
      </div>

      {/* ── SEARCH CARD ── */}
      <div className="rounded-3xl border border-white/10 bg-[#07110f]/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about tech, hackathons, AI, or Tech Vriksh..."
              className="w-full rounded-2xl border border-white/15 bg-black/50 px-5 py-4 text-sm sm:text-base text-white placeholder-gray-500 shadow-inner focus:border-[color:var(--tv-primary)] focus:outline-none focus:ring-1 focus:ring-[color:var(--tv-primary)] transition-all pr-28"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2.5 rounded-xl bg-[color:var(--tv-primary)] px-5 py-2.5 text-xs sm:text-sm font-semibold tv-mono uppercase tracking-[0.12em] text-[#07110f] transition-all hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(57,217,138,0.3)]"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#07110f] border-t-transparent" />
                  Searching...
                </span>
              ) : (
                'Search ↗'
              )}
            </button>
          </div>

          {/* Controls: Effort level & suggestions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="tv-mono text-[color:var(--tv-text-muted)] uppercase tracking-wider">Depth:</span>
              {(['fast', 'low', 'medium'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEffort(lvl)}
                  className={`rounded-full px-3 py-1 tv-mono font-medium capitalize transition-all ${
                    effort === lvl
                      ? 'border border-[color:var(--tv-primary)] bg-[color:var(--tv-primary)]/15 text-[color:var(--tv-primary)]'
                      : 'border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {lvl === 'fast' ? '⚡ Fast' : lvl === 'low' ? '⚖️ Balanced' : '🔍 Deep'}
                </button>
              ))}
            </div>

            <div className="tv-mono text-[color:var(--tv-text-muted)] text-[0.7rem]">
              Web Search Grounding: <span className="text-emerald-400 font-semibold">Enabled</span>
            </div>
          </div>
        </form>

        {/* Suggested Prompts */}
        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <span className="tv-mono text-[0.68rem] uppercase tracking-wider text-[color:var(--tv-text-muted)] block mb-2.5">
            Suggested topics:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((suggested, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(suggested);
                  handleSubmit(suggested);
                }}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-gray-300 transition-colors hover:border-[color:var(--tv-primary)]/40 hover:text-white"
              >
                {suggested}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── ERROR STATE ── */}
      {error && (
        <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/30 p-5 text-sm text-red-200 backdrop-blur-xl">
          <div className="font-semibold text-red-400 mb-1">Notice:</div>
          <p>{error}</p>
          {error.includes('PERPLEXITY_API_KEY') && (
            <div className="mt-3 text-xs text-gray-400 bg-black/40 p-3 rounded-lg border border-white/5">
              💡 <strong>How to configure:</strong> Add <code className="text-emerald-300">PERPLEXITY_API_KEY</code> to your Vercel Project Settings → Environment Variables, or in your local <code className="text-emerald-300">.env.local</code> file.
            </div>
          )}
        </div>
      )}

      {/* ── ANSWER RESULTS ── */}
      {answer && (
        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#07110f]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="tv-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold">
                  Synthesized Answer
                </span>
                {model && (
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[0.68rem] tv-mono text-gray-400 border border-white/10">
                    {model}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs tv-mono text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            {/* Answer Content */}
            <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
              {answer}
            </div>

            {/* Citations */}
            {citations.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="tv-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-3">
                  Verified Citations ({citations.length})
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {citations.map((c, i) => (
                    <a
                      key={i}
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-emerald-500/40 hover:bg-white/[0.05]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-[0.65rem] font-bold text-emerald-400">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-gray-200 group-hover:text-emerald-400">
                          {c.title || c.url}
                        </div>
                        <div className="truncate text-[0.68rem] text-gray-500 mt-0.5">
                          {c.url}
                        </div>
                      </div>
                      <span className="text-gray-500 group-hover:text-emerald-400 text-xs">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Source Results */}
            {searchResults.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="tv-mono text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                  Sources Discovered ({searchResults.length})
                </h4>
                <div className="space-y-2">
                  {searchResults.slice(0, 5).map((sr) => (
                    <a
                      key={sr.id}
                      href={sr.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-white/5 bg-black/30 p-3 hover:border-white/15 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-200">
                        <span className="truncate">{sr.title}</span>
                        <span className="text-[0.65rem] text-gray-500 ml-2 shrink-0">{sr.date || 'Web'}</span>
                      </div>
                      {sr.snippet && (
                        <p className="mt-1 text-[0.72rem] text-gray-400 line-clamp-2 leading-relaxed">
                          {sr.snippet}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FOOTER CALLOUT ── */}
      <div className="mt-12 text-center text-xs text-gray-500">
        <p>
          Need to join the Tech Vriksh community?{' '}
          <Link href="/join" className="text-emerald-400 hover:underline">
            Join here ↗
          </Link>
        </p>
      </div>
    </main>
  );
}
