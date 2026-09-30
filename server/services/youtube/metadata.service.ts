export interface VideoMetadata {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  authorUrl?: string;
  duration?: number;
}

export class MetadataService {
  /**
   * Fetches video information using the reliable YouTube oEmbed API.
   */
  async getVideoMetadata(videoId: string): Promise<VideoMetadata> {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    try {
      const response = await fetch(oembedUrl, {
        signal: AbortSignal.timeout(6000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });

      if (response.status === 404) {
        throw new Error('This video is unavailable or does not exist.');
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error('This video cannot be accessed or is private.');
      }

      if (!response.ok) {
        // Try fallback to standard metadata
        return this.getDefaultMetadata(videoId);
      }

      const data = await response.json();

      return {
        id: videoId,
        title: data.title || `Video ${videoId}`,
        channel: data.author_name || 'YouTube Creator',
        thumbnail:
          data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        authorUrl: data.author_url,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (
        message.includes('unavailable') ||
        message.includes('private') ||
        message.includes('cannot be accessed')
      ) {
        throw err;
      }

      // Return default metadata so transcript retrieval can still proceed
      return this.getDefaultMetadata(videoId);
    }
  }

  private getDefaultMetadata(videoId: string): VideoMetadata {
    return {
      id: videoId,
      title: `YouTube Video (${videoId})`,
      channel: 'YouTube Creator',
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    };
  }
}

export const metadataService = new MetadataService();
