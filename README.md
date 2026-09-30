# YouTube Transcript

A lightweight, high-performance web application to extract, read, search, and export video transcripts and closed captions from YouTube. Built with React, TypeScript, Tailwind CSS, and Express.

---

## Features

- **Instant Transcript Retrieval**: Fetches official and automatically generated captions from public YouTube videos, shorts, and timestamp links.
- **Clickable Monospace Timestamps**: Every segment features a direct timestamp link (`&t=Xs`) that opens the video at the exact moment on YouTube.
- **Reading Progress Bar**: A subtle horizontal progress bar at the very top of the transcript viewer indicates how far the user has scrolled through the content.
- **Real-Time In-Transcript Search**: Instant query filtering with highlighted matches, match count (`X/Y`), and previous/next smooth scroll navigation.
- **Article Mode Toggle**: Read transcripts either segmented with timestamps or as continuous clean paragraphs.
- **TXT & SRT Export**: One-click download of plain text transcript files or industry-standard SubRip Subtitle (`.srt`) files.
- **Multi-Language Support**: Automatic detection and dropdown selector for all available transcript languages (including auto-translated and multi-track captions).
- **Default Dark Theme & Light Mode Toggle**: Dark mode by default with seamless switching to light mode and persistent `localStorage` preference.
- **Privacy & Legal Compliance**: Built-in Terms of Service, Privacy Policy, Fair Use Notice, zero tracking cookies, and ephemeral rate limiting.
- **SEO & Social Share Ready**: Complete OpenGraph cards, Twitter cards, canonical tags, theme-color metadata, and Schema.org `WebApplication` structured data.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, Vite middleware in development
- **Extraction**: Multi-instance fallback caption engine + oEmbed metadata
- **Caching**: In-memory LRU / TTL transcript cache

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/youtube-transcript.git
cd youtube-transcript

# Install dependencies
npm install
```

### Development

To start the full-stack dev server (Express + Vite on port 3000):

```bash
npm run dev
```

### Production Build & Run

```bash
# 1. Build optimized client bundle
npm run build

# 2. Start full-stack production server
NODE_ENV=production npm start
```

---

## API Endpoints

### `POST /api/transcript`

Fetch video metadata and transcript segments for a given YouTube URL.

**Request Body:**

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "lang": "en" // (Optional) Target language code
}
```

**Response (`200 OK`):**

```json
{
  "success": true,
  "video": {
    "id": "jNQXAC9IVRw",
    "title": "Me at the zoo",
    "channel": "jawed",
    "thumbnail": "https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg",
    "duration": 19
  },
  "language": {
    "code": "en",
    "name": "English"
  },
  "available_languages": [
    { "code": "en", "name": "English" }
  ],
  "transcript": [
    {
      "start": 1,
      "duration": 5,
      "text": "All right, so here we are, in front of the elephants..."
    }
  ]
}
```

---

## Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Direct 11-character video ID

---

## Legal & Compliance

- **Fair Use Notice**: This tool is intended for study, accessibility, criticism, and research purposes in accordance with Section 107 of the US Copyright Act.
- **Non-Affiliation**: YouTube is a registered trademark of Google LLC. This project is an independent open utility and is not affiliated with or endorsed by YouTube or Google LLC.
- **Privacy**: No user accounts or personal profiles are stored. Submitted URLs are processed in memory and never logged to a user database.

---

## License

Apache-2.0
