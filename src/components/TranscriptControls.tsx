import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
  Download,
  Clock,
  Globe,
  FileText,
  FileCode,
} from 'lucide-react';
import type { LanguageOption } from '../types/transcript.ts';

interface TranscriptControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  matchesCount: number;
  currentMatchIndex: number;
  onNextMatch: () => void;
  onPrevMatch: () => void;
  showTimestamps: boolean;
  onToggleTimestamps: () => void;
  selectedLanguage?: LanguageOption;
  availableLanguages: LanguageOption[];
  onSelectLanguage: (langCode: string) => void;
  onCopyTranscript: () => void;
  isCopied: boolean;
  onDownloadTxt: () => void;
  onDownloadSrt: () => void;
  isLoadingLanguage?: boolean;
}

export const TranscriptControls: React.FC<TranscriptControlsProps> = ({
  searchQuery,
  onSearchChange,
  matchesCount,
  currentMatchIndex,
  onNextMatch,
  onPrevMatch,
  showTimestamps,
  onToggleTimestamps,
  selectedLanguage,
  availableLanguages,
  onSelectLanguage,
  onCopyTranscript,
  isCopied,
  onDownloadTxt,
  onDownloadSrt,
  isLoadingLanguage = false,
}) => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  // Close download menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3 mb-4">
      {/* Search Bar with instant matches & navigation */}
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search transcript"
          className="w-full pl-9 pr-28 py-2 text-sm rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-colors"
        />

        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
            {matchesCount > 0 ? (
              <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded font-mono">
                <span>
                  {currentMatchIndex + 1}/{matchesCount}
                </span>
                <div className="flex items-center ml-0.5">
                  <button
                    type="button"
                    onClick={onPrevMatch}
                    title="Previous match"
                    className="p-0.5 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={onNextMatch}
                    title="Next match"
                    className="p-0.5 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-1">
                0 matches
              </span>
            )}

            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left Side: Language & Timestamps */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Language Selector */}
          {availableLanguages && availableLanguages.length > 0 && (
            <div className="relative inline-flex items-center">
              <label htmlFor="language-select" className="sr-only">
                Transcript Language
              </label>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-medium">Language:</span>
                <select
                  id="language-select"
                  value={selectedLanguage?.code || ''}
                  onChange={(e) => onSelectLanguage(e.target.value)}
                  disabled={isLoadingLanguage}
                  className="bg-transparent text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none cursor-pointer pr-1"
                >
                  {availableLanguages.map((lang) => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    >
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Timestamp Toggle */}
          <button
            type="button"
            onClick={onToggleTimestamps}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors cursor-pointer font-medium ${
              showTimestamps
                ? 'border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{showTimestamps ? 'Hide timestamps' : 'Show timestamps'}</span>
          </button>
        </div>

        {/* Right Side: Copy & Download */}
        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            type="button"
            onClick={onCopyTranscript}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 text-zinc-700 dark:text-zinc-200 font-medium transition-colors cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Dropdown */}
          <div className="relative" ref={downloadRef}>
            <button
              type="button"
              onClick={() => setIsDownloadOpen(!isDownloadOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 text-zinc-700 dark:text-zinc-200 font-medium transition-colors cursor-pointer"
              aria-haspopup="true"
              aria-expanded={isDownloadOpen}
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Download</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {isDownloadOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-md py-1 z-20">
                <button
                  type="button"
                  onClick={() => {
                    onDownloadTxt();
                    setIsDownloadOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <div>
                    <span className="font-medium block">Text (.txt)</span>
                    <span className="text-[10px] text-zinc-400">Plain readable text</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDownloadSrt();
                    setIsDownloadOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2 cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                  <div>
                    <span className="font-medium block">Subtitles (.srt)</span>
                    <span className="text-[10px] text-zinc-400">With timestamps</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
