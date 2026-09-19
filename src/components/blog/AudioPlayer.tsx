'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioPlayerProps {
  contentSelector?: string;
}

export function AudioPlayer({ contentSelector = '.blog-content' }: AudioPlayerProps) {
  const [isSupported, setIsSupported] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState('Audio player ready');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support and cleanup on unmount
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const synth = window.speechSynthesis;

    return () => {
      synth.cancel();
    };
  }, []);

  const resetState = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
    setStatusMessage('Audio finished');
  }, []);

  const handlePlayPause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    // 1. If currently paused, resume
    if (synth.paused && isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
      setStatusMessage('Resumed audio');
      return;
    }

    // 2. If currently speaking and not paused, pause
    if (synth.speaking && !isPaused) {
      synth.pause();
      setIsPaused(true);
      setIsPlaying(false);
      setStatusMessage('Paused audio');
      return;
    }

    // 3. Start fresh playback
    synth.cancel();

    const targetEl = document.querySelector(contentSelector);
    if (!targetEl) {
      setStatusMessage('No content found to read');
      return;
    }

    // Extract and sanitize text for smooth reading
    const rawText = (targetEl as HTMLElement).innerText || '';
    const cleanText = rawText
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/https?:\/\/\S+/g, 'link') // Replace URLs with word link
      .replace(/[#*_~`>]/g, '') // Remove markdown syntax characters
      .trim();

    if (!cleanText) {
      setStatusMessage('Content is empty');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speed;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = synth.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setStatusMessage('Playing article audio');
    };

    utterance.onend = () => {
      resetState();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        setStatusMessage('Error playing audio');
      }
      resetState();
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    resetState();
    setStatusMessage('Stopped audio');
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.85];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setSpeed(nextSpeed);

    // If already playing, restart with new speed
    if (isPlaying && !isPaused) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        handlePlayPause();
      }, 50);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div
      className="my-6 rounded-2xl border border-[color:var(--tv-border)] bg-[rgba(16,36,32,0.5)] p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/30 shadow-lg"
      role="region"
      aria-label="Blog post audio player"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Play/Pause/Resume & Stop Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePlayPause}
            className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2 active:scale-95 ${
              isPlaying
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(34,197,94,0.25)]'
                : isPaused
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400/60'
            }`}
            aria-pressed={isPlaying}
            aria-label={
              isPlaying
                ? 'Pause audio reading'
                : isPaused
                ? 'Resume audio reading'
                : 'Listen to this article'
            }
          >
            <span className="text-sm" aria-hidden="true">
              {isPlaying ? '⏸' : isPaused ? '▶️' : '🔊'}
            </span>
            <span>{isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Listen'}</span>
          </button>

          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium uppercase tracking-wider text-[color:var(--tv-text-muted)] transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-2 focus-visible:outline-rose-400 active:scale-95"
              aria-label="Stop audio playback"
            >
              <span className="text-xs" aria-hidden="true">⏹</span>
              <span>Stop</span>
            </button>
          )}

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={cycleSpeed}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 tv-mono text-xs text-[color:var(--tv-text-secondary)] transition-all hover:border-emerald-500/30 hover:text-[color:var(--tv-primary)] focus-visible:outline-2 focus-visible:outline-emerald-400"
            aria-label={`Playback speed: ${speed}x. Click to change`}
            title="Adjust reading speed"
          >
            {speed}x
          </button>
        </div>

        {/* Visual Waveform & Accessibility Meta */}
        <div className="flex items-center gap-3">
          {isPlaying && (
            <div className="flex items-center gap-1 h-4" aria-hidden="true">
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-2" />
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-4" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-3" style={{ animationDelay: '300ms' }} />
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-4" style={{ animationDelay: '450ms' }} />
            </div>
          )}

          <span className="tv-mono text-xs text-[color:var(--tv-text-muted)]">
            {isPlaying ? 'Reading article...' : isPaused ? 'Paused' : 'Text-to-Speech'}
          </span>
        </div>
      </div>

      {/* Screen reader live status announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </div>
    </div>
  );
}
