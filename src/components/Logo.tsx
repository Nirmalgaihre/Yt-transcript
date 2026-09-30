import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const iconDimensions = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textClasses = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom YouTube Transcript Brand Icon */}
      <div className={`relative ${iconDimensions} rounded-lg bg-red-600 dark:bg-red-600 flex items-center justify-center shadow-xs overflow-hidden shrink-0`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          {/* Subtle play triangle on the left */}
          <path
            d="M7 10L14 15L7 20V10Z"
            fill="currentColor"
          />
          {/* Transcript text lines on the right */}
          <path
            d="M17 11H25"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M17 16H25"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M17 21H22"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Name */}
      <div className="flex items-center tracking-tight leading-none">
        <span className={`font-bold text-zinc-900 dark:text-zinc-100 ${textClasses}`}>
          YouTube
        </span>
        <span className={`font-medium text-red-600 dark:text-red-500 ml-1.5 ${textClasses}`}>
          Transcript
        </span>
      </div>
    </div>
  );
};
