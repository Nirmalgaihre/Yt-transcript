import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import type { VideoInfo } from '../types/transcript.ts';
import { formatSeconds } from '../utils/timeFormat.ts';

interface VideoCardProps {
  video: VideoInfo;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <div className="mb-6 p-4 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 transition-colors">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Compact Thumbnail */}
        <div className="relative shrink-0 w-full sm:w-36 aspect-video bg-zinc-100 dark:bg-zinc-900 rounded overflow-hidden border border-zinc-200 dark:border-zinc-700/60">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback to standard quality if high quality 404s
              (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
            }}
          />
          {video.duration ? (
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[11px] font-mono px-1.5 py-0.5 rounded">
              {formatSeconds(video.duration)}
            </span>
          ) : null}
        </div>

        {/* Video details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
              {video.title}
            </h2>
          </div>

          <div className="mt-1 flex items-center flex-wrap gap-y-1 gap-x-3 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {video.channel}
            </span>

            {video.duration ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatSeconds(video.duration)}
              </span>
            ) : null}

            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
