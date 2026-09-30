import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const UrlForm: React.FC<UrlFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateInput = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationError('Please enter a YouTube video URL.');
      return false;
    }

    // Check basic domain pattern
    const isYouTube =
      trimmed.includes('youtube.com') ||
      trimmed.includes('youtu.be') ||
      /^[a-zA-Z0-9_-]{11}$/.test(trimmed);

    if (!isYouTube) {
      setValidationError('Enter a valid YouTube URL (e.g. youtube.com/watch?v=...).');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (validateInput(url)) {
      onSubmit(url.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  };

  return (
    <section className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          YouTube Transcript
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          Paste a YouTube video link to view and download its transcript.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <label htmlFor="youtube-url-input" className="sr-only">
              YouTube Video URL
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="youtube-url-input"
              type="text"
              value={url}
              onChange={handleInputChange}
              placeholder="Paste a YouTube video URL"
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent ${
                validationError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 dark:border-zinc-700'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Fetching transcript…</span>
              </>
            ) : (
              <span>Get Transcript</span>
            )}
          </button>
        </div>

        {/* Validation message */}
        {validationError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400 text-left">
            {validationError}
          </p>
        )}
      </form>
    </section>
  );
};
