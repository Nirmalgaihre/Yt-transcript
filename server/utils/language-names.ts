/**
 * Mapping of common ISO 639-1 / BCP 47 language codes to readable names.
 */
const LANGUAGE_MAP: Record<string, string> = {
  en: 'English',
  'a-en': 'English (auto-generated)',
  es: 'Spanish',
  'es-419': 'Spanish (Latin America)',
  'es-ES': 'Spanish (Spain)',
  fr: 'French',
  'fr-FR': 'French (France)',
  de: 'German',
  'de-DE': 'German (Germany)',
  it: 'Italian',
  pt: 'Portuguese',
  'pt-BR': 'Portuguese (Brazil)',
  'pt-PT': 'Portuguese (Portugal)',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  'zh-Hans': 'Chinese (Simplified)',
  'zh-Hant': 'Chinese (Traditional)',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  hi: 'Hindi',
  ar: 'Arabic',
  tr: 'Turkish',
  nl: 'Dutch',
  pl: 'Polish',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
  cs: 'Czech',
  el: 'Greek',
  he: 'Hebrew',
  id: 'Indonesian',
  th: 'Thai',
  vi: 'Vietnamese',
  uk: 'Ukrainian',
  ro: 'Romanian',
  hu: 'Hungarian',
  bn: 'Bengali',
  ur: 'Urdu',
  ta: 'Tamil',
  te: 'Telugu',
  mr: 'Marathi',
  fil: 'Filipino',
  ms: 'Malay',
};

/**
 * Get human-readable language name for a given code.
 */
export function getLanguageName(code: string): string {
  if (!code) return 'Unknown';
  const cleanCode = code.trim();

  if (LANGUAGE_MAP[cleanCode]) {
    return LANGUAGE_MAP[cleanCode];
  }

  // Check base language code if like 'en-US'
  const baseCode = cleanCode.split('-')[0].toLowerCase();
  if (LANGUAGE_MAP[baseCode]) {
    return LANGUAGE_MAP[baseCode];
  }

  try {
    const intlName = new Intl.DisplayNames(['en'], { type: 'language' }).of(baseCode);
    if (intlName) return intlName;
  } catch {
    // ignore
  }

  return cleanCode;
}
