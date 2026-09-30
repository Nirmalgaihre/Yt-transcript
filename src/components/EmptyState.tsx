import React from 'react';
import { Youtube } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="py-16 text-center">
      <div className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center mx-auto mb-3 text-zinc-400 dark:text-zinc-500">
        <Youtube className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Paste a YouTube video URL above to get started.
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-sm mx-auto">
        Supports standard videos, shorts, and timestamp links in multiple languages.
      </p>
    </div>
  );
};
