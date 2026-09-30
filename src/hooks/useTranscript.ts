import { useState, useMemo, useCallback } from 'react';
import type {
  TranscriptResponse,
  TranscriptSegment,
  VideoInfo,
  LanguageOption,
} from '../types/transcript.ts';
import {
  generateTxt,
  generateSrt,
  downloadFile,
  sanitizeFilename,
} from '../utils/exportFormats.ts';

export function useTranscript() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
  const [language, setLanguage] = useState<LanguageOption | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<LanguageOption[]>([]);

  const [showTimestamps, setShowTimestamps] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Fetch transcript from backend API
   */
  const fetchTranscript = useCallback(
    async (url: string, targetLang?: string) => {
      if (targetLang) {
        setIsLoadingLanguage(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      try {
        const response = await fetch('/api/transcript', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            lang: targetLang,
          }),
        });

        const data: TranscriptResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch transcript.');
        }

        if (data.video) {
          setVideo(data.video);
        }
        if (data.language) {
          setLanguage(data.language);
        }
        if (data.available_languages) {
          setAvailableLanguages(data.available_languages);
        }
        if (data.transcript) {
          setTranscript(data.transcript);
        }

        setCurrentUrl(url);
        setError(null);
        setSearchQuery('');
        setCurrentMatchIndex(0);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Something went wrong while fetching the transcript. Try again.';
        setError(msg);
      } finally {
        setIsLoading(false);
        setIsLoadingLanguage(false);
      }
    },
    []
  );

  /**
   * Handle changing language
   */
  const handleSelectLanguage = useCallback(
    (langCode: string) => {
      if (!currentUrl || langCode === language?.code) return;
      fetchTranscript(currentUrl, langCode);
    },
    [currentUrl, language, fetchTranscript]
  );

  /**
   * Compute total search matches
   */
  const matchesCount = useMemo(() => {
    if (!searchQuery.trim() || !transcript) return 0;
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'gi');

    let count = 0;
    for (const segment of transcript) {
      const matches = segment.text.match(regex);
      if (matches) {
        count += matches.length;
      }
    }
    return count;
  }, [searchQuery, transcript]);

  // Adjust currentMatchIndex when search matches change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentMatchIndex(0);
  }, []);

  const handleNextMatch = useCallback(() => {
    if (matchesCount === 0) return;
    setCurrentMatchIndex((prev) => (prev + 1) % matchesCount);
  }, [matchesCount]);

  const handlePrevMatch = useCallback(() => {
    if (matchesCount === 0) return;
    setCurrentMatchIndex((prev) => (prev - 1 + matchesCount) % matchesCount);
  }, [matchesCount]);

  /**
   * Copy transcript to clipboard
   */
  const handleCopyTranscript = useCallback(async () => {
    if (!transcript) return;
    const text = generateTxt(transcript, video ?? undefined, showTimestamps);

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback using textarea
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [transcript, video, showTimestamps]);

  /**
   * Download TXT format
   */
  const handleDownloadTxt = useCallback(() => {
    if (!transcript) return;
    const text = generateTxt(transcript, video ?? undefined, showTimestamps);
    const filename = `${sanitizeFilename(video?.title || 'youtube')}.txt`;
    downloadFile(text, filename, 'text/plain');
  }, [transcript, video, showTimestamps]);

  /**
   * Download SRT format
   */
  const handleDownloadSrt = useCallback(() => {
    if (!transcript) return;
    const srt = generateSrt(transcript);
    const filename = `${sanitizeFilename(video?.title || 'youtube')}.srt`;
    downloadFile(srt, filename, 'text/plain');
  }, [transcript, video]);

  const handleToggleTimestamps = useCallback(() => {
    setShowTimestamps((prev) => !prev);
  }, []);

  const handleRetry = useCallback(() => {
    if (currentUrl) {
      fetchTranscript(currentUrl);
    }
  }, [currentUrl, fetchTranscript]);

  return {
    currentUrl,
    isLoading,
    isLoadingLanguage,
    error,
    video,
    transcript,
    language,
    availableLanguages,
    showTimestamps,
    searchQuery,
    matchesCount,
    currentMatchIndex,
    isCopied,
    fetchTranscript,
    handleSelectLanguage,
    handleSearchChange,
    handleNextMatch,
    handlePrevMatch,
    handleToggleTimestamps,
    handleCopyTranscript,
    handleDownloadTxt,
    handleDownloadSrt,
    handleRetry,
  };
}
