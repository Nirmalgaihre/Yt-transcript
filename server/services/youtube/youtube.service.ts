import { transcriptCache } from '../../utils/cache.ts';
import { metadataService, type VideoMetadata } from './metadata.service.ts';
import {
  transcriptService,
  type TranscriptResult,
  type TranscriptSegment,
} from './transcript.service.ts';

export interface YouTubeResponseData {
  success: true;
  video: {
    id: string;
    title: string;
    channel: string;
    thumbnail: string;
    duration?: number;
  };
  language: {
    code: string;
    name: string;
  };
  available_languages: Array<{
    code: string;
    name: string;
  }>;
  transcript: TranscriptSegment[];
}

export class YouTubeService {
  /**
   * Fetches video information and transcript, using cache where available.
   */
  async getVideoWithTranscript(
    videoId: string,
    lang?: string
  ): Promise<YouTubeResponseData> {
    const cacheKey = `${videoId}:${lang || 'default'}`;
    const cached = transcriptCache.get(cacheKey) as YouTubeResponseData | undefined;

    if (cached) {
      return cached;
    }

    // Fetch metadata and transcript in parallel
    const [metadataResult, transcriptResult] = await Promise.allSettled([
      metadataService.getVideoMetadata(videoId),
      transcriptService.getTranscript(videoId, lang),
    ]);

    // Handle transcript failure
    if (transcriptResult.status === 'rejected') {
      const err = transcriptResult.reason;
      throw err instanceof Error ? err : new Error('Failed to retrieve transcript');
    }

    const transcriptData: TranscriptResult = transcriptResult.value;

    // Handle metadata
    let metadata: VideoMetadata;
    if (metadataResult.status === 'fulfilled') {
      metadata = metadataResult.value;
    } else {
      metadata = {
        id: videoId,
        title: `YouTube Video (${videoId})`,
        channel: 'YouTube Creator',
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    }

    const duration = transcriptData.duration || metadata.duration;

    const response: YouTubeResponseData = {
      success: true,
      video: {
        id: videoId,
        title: metadata.title,
        channel: metadata.channel,
        thumbnail: metadata.thumbnail,
        duration,
      },
      language: transcriptData.language,
      available_languages: transcriptData.available_languages,
      transcript: transcriptData.transcript,
    };

    // Cache the successful result
    transcriptCache.set(cacheKey, response);

    return response;
  }
}

export const youTubeService = new YouTubeService();
