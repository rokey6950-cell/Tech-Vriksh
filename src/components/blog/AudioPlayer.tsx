'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioPlayerProps {
  contentSelector?: string;
}

/**
 * Splits long text into natural sentence/clause chunks (< 160 characters)
 * to bypass Chromium's 15-second speech buffer timeout on long articles.
 */
function splitIntoChunks(text: string, maxChunkLength = 160): string[] {
  const rawSentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text];
  const chunks: string[] = [];

  for (const sentence of rawSentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if (trimmed.length <= maxChunkLength) {
      chunks.push(trimmed);
    } else {
      // Split on clauses (commas, colons, semicolons) if sentence is very long
      const subParts = trimmed.match(/[^,;:]+[,;:]*|.+/g) || [trimmed];
      let currentSub = '';
      for (const part of subParts) {
        if ((currentSub + ' ' + part).trim().length <= maxChunkLength) {
          currentSub = (currentSub + ' ' + part).trim();
        } else {
          if (currentSub) chunks.push(currentSub);
          currentSub = part.trim();
        }
      }
      if (currentSub) chunks.push(currentSub);
    }
  }

  return chunks.length > 0 ? chunks : [text];
}

export function AudioPlayer({ contentSelector = '.blog-content' }: AudioPlayerProps) {
  const [isSupported, setIsSupported] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState('Audio player ready');

  // References for robust playback queue
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const speedRef = useRef<number>(1);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Sync state with refs
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Check browser support and cleanup on unmount
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const synth = window.speechSynthesis;

    return () => {
      isPlayingRef.current = false;
      isPausedRef.current = false;
      synth.cancel();
    };
  }, []);

  const resetState = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    isPlayingRef.current = false;
    isPausedRef.current = false;
    chunkIndexRef.current = 0;
    chunksRef.current = [];
    currentUtteranceRef.current = null;
    setStatusMessage('Audio finished');
  }, []);

  /**
   * Speaks the chunk at the given index, recursively continuing through all chunks.
   */
  const speakChunk = useCallback((index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    if (!isPlayingRef.current || isPausedRef.current) return;

    if (index >= chunksRef.current.length) {
      resetState();
      return;
    }

    chunkIndexRef.current = index;
    const chunkText = chunksRef.current[index];

    // Calculate percentage progress
    if (chunksRef.current.length > 0) {
      const pct = Math.round(((index + 1) / chunksRef.current.length) * 100);
      setProgress(pct);
    }

    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.rate = speedRef.current;
    utterance.pitch = 1.0;

    // Pick natural English voice if available
    const voices = synth.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      if (isPlayingRef.current && !isPausedRef.current) {
        speakChunk(index + 1);
      }
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      // If minor chunk error, try proceeding to next chunk rather than dropping whole article
      if (isPlayingRef.current && !isPausedRef.current && index + 1 < chunksRef.current.length) {
        speakChunk(index + 1);
      } else {
        resetState();
      }
    };

    currentUtteranceRef.current = utterance;
    synth.speak(utterance);
  }, [resetState]);

  const handlePlayPause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    // 1. Resume from paused state
    if (isPaused) {
      isPausedRef.current = false;
      isPlayingRef.current = true;
      setIsPaused(false);
      setIsPlaying(true);
      setStatusMessage('Resumed audio');

      // Clear any stuck synthesis state and resume at the current chunk
      synth.cancel();
      speakChunk(chunkIndexRef.current);
      return;
    }

    // 2. Pause while playing
    if (isPlaying) {
      isPausedRef.current = true;
      isPlayingRef.current = false;
      setIsPaused(true);
      setIsPlaying(false);
      setStatusMessage('Paused audio');
      synth.cancel(); // Cleans up current chunk without losing chunkIndexRef
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
      .replace(/https?:\/\/\S+/g, 'link') // Replace URLs with word 'link'
      .replace(/[#*_~`>]/g, '') // Strip markdown markers
      .trim();

    if (!cleanText) {
      setStatusMessage('Content is empty');
      return;
    }

    const chunks = splitIntoChunks(cleanText);
    chunksRef.current = chunks;
    chunkIndexRef.current = 0;
    isPlayingRef.current = true;
    isPausedRef.current = false;

    setIsPlaying(true);
    setIsPaused(false);
    setProgress(1);
    setStatusMessage(`Playing article audio (${chunks.length} segments)`);

    speakChunk(0);
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
    speedRef.current = nextSpeed;

    // If already playing, restart current chunk with new speed seamlessly
    if (isPlayingRef.current && !isPausedRef.current) {
      window.speechSynthesis.cancel();
      speakChunk(chunkIndexRef.current);
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
        {/* Controls: Play/Pause/Resume, Stop & Speed */}
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

        {/* Status, Progress & Waveform */}
        <div className="flex items-center gap-3">
          {isPlaying && (
            <div className="flex items-center gap-1 h-4" aria-hidden="true">
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-2" />
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-4" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-3" style={{ animationDelay: '300ms' }} />
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-4" style={{ animationDelay: '450ms' }} />
            </div>
          )}

          {(isPlaying || isPaused) && progress > 0 && (
            <span className="tv-mono text-xs text-emerald-400/90 font-medium">
              {progress}%
            </span>
          )}

          <span className="tv-mono text-xs text-[color:var(--tv-text-muted)]">
            {isPlaying ? 'Reading...' : isPaused ? 'Paused' : 'Text-to-Speech'}
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
