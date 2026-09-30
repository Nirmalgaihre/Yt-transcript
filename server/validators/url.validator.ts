/**
 * YouTube URL Validator and Video ID Extractor
 */

// YouTube video IDs are strictly 11 characters consisting of base64url characters: [a-zA-Z0-9_-]
const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

const ALLOWED_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be',
]);

export interface VideoIdExtractionResult {
  isValid: boolean;
  videoId?: string;
  error?: string;
}

/**
 * Validates untrusted user input and extracts a YouTube video ID.
 * Protects against SSRF by disallowing external domains.
 */
export function extractYouTubeVideoId(input: string): VideoIdExtractionResult {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      error: 'Please enter a YouTube video URL.',
    };
  }

  const trimmed = input.trim();

  // If the user directly pasted an 11-character video ID
  if (VIDEO_ID_REGEX.test(trimmed)) {
    return {
      isValid: true,
      videoId: trimmed,
    };
  }

  let parsedUrl: URL;
  try {
    // Add protocol if missing
    let urlToParse = trimmed;
    if (!urlToParse.startsWith('http://') && !urlToParse.startsWith('https://')) {
      urlToParse = `https://${urlToParse}`;
    }
    parsedUrl = new URL(urlToParse);
  } catch {
    return {
      isValid: false,
      error: 'Enter a valid YouTube URL.',
    };
  }

  // Reject invalid protocols
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return {
      isValid: false,
      error: 'Enter a valid YouTube URL.',
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.has(hostname)) {
    return {
      isValid: false,
      error: 'Only YouTube URLs (youtube.com, youtu.be) are supported.',
    };
  }

  let videoId: string | null = null;

  if (hostname === 'youtu.be' || hostname === 'www.youtu.be') {
    // Format: https://youtu.be/VIDEO_ID
    const pathname = parsedUrl.pathname.slice(1); // remove leading slash
    const possibleId = pathname.split('/')[0]?.split('?')[0];
    if (possibleId && VIDEO_ID_REGEX.test(possibleId)) {
      videoId = possibleId;
    }
  } else {
    // youtube.com variants
    const pathname = parsedUrl.pathname;

    if (pathname === '/watch') {
      // Format: https://www.youtube.com/watch?v=VIDEO_ID
      const v = parsedUrl.searchParams.get('v');
      if (v && VIDEO_ID_REGEX.test(v)) {
        videoId = v;
      }
    } else if (pathname.startsWith('/shorts/')) {
      // Format: https://www.youtube.com/shorts/VIDEO_ID
      const possibleId = pathname.replace('/shorts/', '').split('/')[0]?.split('?')[0];
      if (possibleId && VIDEO_ID_REGEX.test(possibleId)) {
        videoId = possibleId;
      }
    } else if (pathname.startsWith('/embed/')) {
      // Format: https://www.youtube.com/embed/VIDEO_ID
      const possibleId = pathname.replace('/embed/', '').split('/')[0]?.split('?')[0];
      if (possibleId && VIDEO_ID_REGEX.test(possibleId)) {
        videoId = possibleId;
      }
    } else if (pathname.startsWith('/v/')) {
      // Format: https://www.youtube.com/v/VIDEO_ID
      const possibleId = pathname.replace('/v/', '').split('/')[0]?.split('?')[0];
      if (possibleId && VIDEO_ID_REGEX.test(possibleId)) {
        videoId = possibleId;
      }
    } else if (pathname.startsWith('/live/')) {
      // Format: https://www.youtube.com/live/VIDEO_ID
      const possibleId = pathname.replace('/live/', '').split('/')[0]?.split('?')[0];
      if (possibleId && VIDEO_ID_REGEX.test(possibleId)) {
        videoId = possibleId;
      }
    }
  }

  if (!videoId) {
    return {
      isValid: false,
      error: 'Could not find a valid YouTube video ID in this link.',
    };
  }

  return {
    isValid: true,
    videoId,
  };
}
