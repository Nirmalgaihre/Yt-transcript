import React from 'react';
import { Sun, Moon, Github, Shield } from 'lucide-react';
import { Logo } from './Logo.tsx';
import type { Theme } from '../hooks/useTheme.ts';
import type { LegalTab } from './LegalModal.tsx';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenLegal: (tab: LegalTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onOpenLegal }) => {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onOpenLegal('terms')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
            title="Terms & Privacy"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Terms &amp; Privacy</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
            title="GitHub"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
