export interface TranscriptSegment {
  start: number;
  duration: number;
  text: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: number;
}

export interface LanguageOption {
  code: string;
  name: string;
}

export interface TranscriptResponse {
  success: boolean;
  video?: VideoInfo;
  language?: LanguageOption;
  available_languages?: LanguageOption[];
  transcript?: TranscriptSegment[];
  message?: string;
}
