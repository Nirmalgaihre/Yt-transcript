import type { Request, Response } from 'express';
import { extractYouTubeVideoId } from '../validators/url.validator.ts';
import { youTubeService } from '../services/youtube/youtube.service.ts';

export async function getTranscriptController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const rawUrl = req.method === 'POST' ? req.body?.url : req.query?.url;
    const rawLang = req.method === 'POST' ? req.body?.lang : req.query?.lang;

    if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
      res.status(400).json({
        success: false,
        message: 'Enter a valid YouTube URL.',
      });
      return;
    }

    const lang = typeof rawLang === 'string' && rawLang.trim() ? rawLang.trim() : undefined;

    // Validate URL and extract video ID
    const validation = extractYouTubeVideoId(rawUrl);
    if (!validation.isValid || !validation.videoId) {
      res.status(400).json({
        success: false,
        message: validation.error || 'Enter a valid YouTube URL.',
      });
      return;
    }

    const result = await youTubeService.getVideoWithTranscript(
      validation.videoId,
      lang
    );

    res.status(200).json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Something went wrong while fetching the transcript. Try again.';

    // Map known conditions
    if (message.includes('No transcript is available')) {
      res.status(404).json({
        success: false,
        message: 'No transcript is available for this video.',
      });
      return;
    }

    if (message.includes('unavailable') || message.includes('does not exist')) {
      res.status(404).json({
        success: false,
        message: 'This video is unavailable.',
      });
      return;
    }

    if (message.includes('private') || message.includes('cannot be accessed')) {
      res.status(403).json({
        success: false,
        message: 'This video cannot be accessed.',
      });
      return;
    }

    if (message.includes('Too many requests')) {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again shortly.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching the transcript. Try again.',
    });
  }
}
