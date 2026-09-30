import type { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 40; // 40 requests per minute
const ipStore = new Map<string, RateLimitRecord>();

// Cleanup stale IP records every 5 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipStore.entries()) {
    record.timestamps = record.timestamps.filter((t) => now - t < WINDOW_MS);
    if (record.timestamps.length === 0) {
      ipStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = (
    typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.socket.remoteAddress || '127.0.0.1'
  ).toString();

  const now = Date.now();
  let record = ipStore.get(clientIp);

  if (!record) {
    record = { timestamps: [] };
    ipStore.set(clientIp, record);
  }

  // Keep only timestamps within the current window
  record.timestamps = record.timestamps.filter((t) => now - t < WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS) {
    const oldest = record.timestamps[0];
    const retryAfterSec = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    res.setHeader('Retry-After', retryAfterSec.toString());
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again shortly.',
    });
    return;
  }

  record.timestamps.push(now);
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
  res.setHeader(
    'X-RateLimit-Remaining',
    (MAX_REQUESTS - record.timestamps.length).toString()
  );

  next();
}
