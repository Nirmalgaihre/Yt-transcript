/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { UrlForm } from './components/UrlForm.tsx';
import { VideoCard } from './components/VideoCard.tsx';
import { TranscriptControls } from './components/TranscriptControls.tsx';
import { TranscriptViewer } from './components/TranscriptViewer.tsx';
import { ErrorMessage } from './components/ErrorMessage.tsx';
import { EmptyState } from './components/EmptyState.tsx';
import { LegalModal, type LegalTab } from './components/LegalModal.tsx';
import { useTheme } from './hooks/useTheme.ts';
import { useTranscript } from './hooks/useTranscript.ts';
import { Sun, Moon } from 'lucide-react';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('terms');

  const handleOpenLegal = (tab: LegalTab) => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };
  const {
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
  } = useTranscript();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-zinc-200 dark:selection:bg-zinc-700">
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenLegal={handleOpenLegal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* URL Input Form */}
        <UrlForm onSubmit={fetchTranscript} isLoading={isLoading} />

        {/* Error Display */}
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {/* Video Card and Transcript Viewer */}
        {video && transcript && transcript.length > 0 ? (
          <section aria-label="Transcript content">
            {/* Video Info Header */}
            <VideoCard video={video} />

            {/* Controls Bar */}
            <TranscriptControls
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              matchesCount={matchesCount}
              currentMatchIndex={currentMatchIndex}
              onNextMatch={handleNextMatch}
              onPrevMatch={handlePrevMatch}
              showTimestamps={showTimestamps}
              onToggleTimestamps={handleToggleTimestamps}
              selectedLanguage={language ?? undefined}
              availableLanguages={availableLanguages}
              onSelectLanguage={handleSelectLanguage}
              onCopyTranscript={handleCopyTranscript}
              isCopied={isCopied}
              onDownloadTxt={handleDownloadTxt}
              onDownloadSrt={handleDownloadSrt}
              isLoadingLanguage={isLoadingLanguage}
            />

            {/* Transcript Text Segments */}
            <TranscriptViewer
              videoId={video.id}
              segments={transcript}
              showTimestamps={showTimestamps}
              searchQuery={searchQuery}
              currentMatchIndex={currentMatchIndex}
            />
          </section>
        ) : !error && !isLoading ? (
          <EmptyState />
        ) : null}
      </main>

      {/* Footer with Legal & Hosting Links */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 py-8 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              YouTube Transcript
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
            <span>Independent utility tool for accessible reading &amp; export.</span>
          </div>

          {/* Theme Quick Toggle in Footer */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3 h-3 text-zinc-400" />
                <span>Mode: Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Mode: Light</span>
              </>
            )}
          </button>
        </div>

        {/* Legal Links Bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-2 text-[11px]">
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
            <button
              type="button"
              onClick={() => handleOpenLegal('terms')}
              className="hover:text-zinc-900 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => handleOpenLegal('privacy')}
              className="hover:text-zinc-900 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => handleOpenLegal('disclaimer')}
              className="hover:text-zinc-900 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Disclaimer &amp; Fair Use
            </button>
          </div>

          <span className="text-zinc-400 dark:text-zinc-500">
            Not affiliated with YouTube or Google LLC.
          </span>
        </div>
      </footer>

      {/* Legal & Policy Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        activeTab={legalTab}
        onClose={() => setIsLegalOpen(false)}
        onSelectTab={(tab) => setLegalTab(tab)}
      />
    </div>
  );
}
