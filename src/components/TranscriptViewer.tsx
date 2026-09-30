import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { TranscriptSegment } from '../types/transcript.ts';
import { formatSeconds } from '../utils/timeFormat.ts';

interface TranscriptViewerProps {
  videoId: string;
  segments: TranscriptSegment[];
  showTimestamps: boolean;
  searchQuery: string;
  currentMatchIndex: number;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  videoId,
  segments,
  showTimestamps,
  searchQuery,
  currentMatchIndex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeMatchRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track how far the user has scrolled through the transcript content
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Distance from top of transcript to the current viewport reading line
      const containerHeight = rect.height;
      if (containerHeight <= windowHeight) {
        // Entire transcript fits in viewport
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        setScrollProgress(isVisible ? 100 : 0);
        return;
      }

      // Start counting when the top of the container crosses into viewport (offset for header)
      const scrolled = windowHeight - rect.top - 100;
      const totalScrollableDistance = containerHeight;
      const percentage = Math.min(100, Math.max(0, Math.round((scrolled / totalScrollableDistance) * 100)));
      setScrollProgress(percentage);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [segments]);

  // Scroll active match element into view smoothly
  useEffect(() => {
    if (activeMatchRef.current) {
      activeMatchRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentMatchIndex, searchQuery]);

  let matchCounter = 0;

  /**
   * Helper to render text with highlighted search occurrences
   */
  const renderHighlightedText = (text: string) => {
    if (!searchQuery.trim()) {
      return text;
    }

    // Escape regex special characters
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === searchQuery.toLowerCase()) {
        const isCurrent = matchCounter === currentMatchIndex;
        const currentRef = isCurrent ? activeMatchRef : null;
        matchCounter++;

        return (
          <mark
            key={index}
            ref={currentRef}
            className={`rounded-xs px-0.5 transition-colors ${
              isCurrent
                ? 'bg-amber-400 text-zinc-950 font-semibold ring-2 ring-amber-500'
                : 'bg-amber-200 dark:bg-amber-900/60 text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {part}
          </mark>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getTimestampUrl = (seconds: number) => {
    const s = Math.floor(seconds);
    return `https://www.youtube.com/watch?v=${videoId}&t=${s}s`;
  };

  if (!segments || segments.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-800/50">
        No transcript segments available.
      </div>
    );
  }

  // Reading article layout when timestamps are hidden
  if (!showTimestamps) {
    matchCounter = 0;
    return (
      <div
        ref={containerRef}
        className="relative rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 transition-colors overflow-hidden"
      >
        {/* Subtle horizontal reading progress bar at the very top */}
        <div
          className="sticky top-0 z-20 w-full h-1 sm:h-1.5 bg-zinc-200/80 dark:bg-zinc-700/60 overflow-hidden"
          title={`Reading progress: ${scrollProgress}%`}
        >
          <div
            className="h-full bg-red-600 dark:bg-red-500 transition-[width] duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
            role="progressbar"
            aria-valuenow={scrollProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Transcript reading progress"
          />
        </div>

        <div className="p-6 prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 text-base leading-relaxed space-y-4">
          {segments.map((seg, idx) => (
            <p key={idx} className="leading-relaxed">
              {renderHighlightedText(seg.text)}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // Structured segment view with timestamps
  matchCounter = 0;
  return (
    <div
      ref={containerRef}
      className="relative rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 transition-colors overflow-hidden"
    >
      {/* Subtle horizontal reading progress bar at the very top */}
      <div
        className="sticky top-0 z-20 w-full h-1 sm:h-1.5 bg-zinc-200/80 dark:bg-zinc-700/60 overflow-hidden"
        title={`Reading progress: ${scrollProgress}%`}
      >
        <div
          className="h-full bg-red-600 dark:bg-red-500 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={scrollProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Transcript reading progress"
        />
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {segments.map((seg, idx) => {
          const timeDisplay = formatSeconds(seg.start);
          const timestampUrl = getTimestampUrl(seg.start);

          return (
            <div
              key={idx}
              className="group p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 hover:bg-zinc-50/70 dark:hover:bg-zinc-700/20 transition-colors"
            >
              {/* Timestamp Link */}
              <div className="shrink-0 pt-0.5">
                <a
                  href={timestampUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open at ${timeDisplay} on YouTube`}
                  className="inline-flex items-center gap-1 font-mono text-xs text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 hover:underline transition-colors"
                >
                  <span>{timeDisplay}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </a>
              </div>

              {/* Segment Text */}
              <div className="flex-1 text-sm sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 font-normal">
                {renderHighlightedText(seg.text)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
