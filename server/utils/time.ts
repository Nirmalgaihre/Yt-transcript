/**
 * Utility functions for parsing and formatting transcript timestamps.
 */

/**
 * Parses time strings such as "0:15", "01:23", "1:02:15" into seconds.
 */
export function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':').map((p) => parseFloat(p));

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return (minutes || 0) * 60 + (seconds || 0);
  }

  const num = parseFloat(timeStr);
  return isNaN(num) ? 0 : num;
}

/**
 * Formats seconds into "mm:ss" or "hh:mm:ss" for user display.
 */
export function formatSecondsToDisplay(totalSeconds: number): string {
  const rounded = Math.floor(Math.max(0, totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    const hh = hours.toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  return `${mm}:${ss}`;
}

/**
 * Formats seconds into SRT timestamp format: "00:00:00,000"
 */
export function formatSecondsToSrt(totalSeconds: number): string {
  const safeSec = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSec / 3600);
  const minutes = Math.floor((safeSec % 3600) / 60);
  const seconds = Math.floor(safeSec % 60);
  const milliseconds = Math.floor((safeSec % 1) * 1000);

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  const mmm = milliseconds.toString().padStart(3, '0');

  return `${hh}:${mm}:${ss},${mmm}`;
}
