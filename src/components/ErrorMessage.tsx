import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="mb-6 p-4 rounded border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/20 text-red-800 dark:text-red-300 text-sm flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
        <div>
          <p className="font-medium">{message}</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
            {message.includes('No transcript')
              ? 'This video may not have closed captions or subtitles enabled by the creator.'
              : message.includes('unavailable')
              ? 'Please verify that the video is public and that the URL is correct.'
              : 'Please check the URL or try again in a moment.'}
          </p>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-red-300 dark:border-red-800 bg-white dark:bg-zinc-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
