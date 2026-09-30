import type { TranscriptSegment, VideoInfo } from '../types/transcript.ts';
import { formatSeconds, formatToSrtTime } from './timeFormat.ts';

/**
 * Sanitize a video title for safe usage in file downloads.
 */
export function sanitizeFilename(title: string, defaultName = 'youtube-transcript'): string {
  if (!title) return defaultName;
  const clean = title
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-|-$/g, '')
    .toLowerCase();

  return clean ? `${clean}-transcript` : defaultName;
}

/**
 * Generate plain text transcript content.
 */
export function generateTxt(
  segments: TranscriptSegment[],
  video?: VideoInfo,
  includeTimestamps = false
): string {
  const lines: string[] = [];

  if (video?.title) {
    lines.push(`Title: ${video.title}`);
  }
  if (video?.channel) {
    lines.push(`Channel: ${video.channel}`);
  }
  if (video?.id) {
    lines.push(`URL: https://www.youtube.com/watch?v=${video.id}`);
  }

  if (lines.length > 0) {
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  if (includeTimestamps) {
    for (const segment of segments) {
      const time = formatSeconds(segment.start);
      lines.push(`[${time}] ${segment.text}`);
    }
  } else {
    // Normal readable article text
    for (const segment of segments) {
      lines.push(segment.text);
    }
  }

  return lines.join('\n\n');
}

/**
 * Generate SRT subtitle format.
 */
export function generateSrt(segments: TranscriptSegment[]): string {
  const blocks: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const index = i + 1;
    const startTime = formatToSrtTime(seg.start);
    const endTime = formatToSrtTime(seg.start + Math.max(1, seg.duration));

    blocks.push(`${index}\n${startTime} --> ${endTime}\n${seg.text}\n`);
  }

  return blocks.join('\n');
}

/**
 * Trigger file download in browser.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
