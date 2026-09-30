import React, { useEffect } from 'react';
import { X, Shield, FileText, AlertTriangle } from 'lucide-react';

export type LegalTab = 'terms' | 'privacy' | 'disclaimer';

interface LegalModalProps {
  isOpen: boolean;
  activeTab: LegalTab;
  onClose: () => void;
  onSelectTab: (tab: LegalTab) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  activeTab,
  onClose,
  onSelectTab,
}) => {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl flex flex-col overflow-hidden text-zinc-800 dark:text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <h2 id="legal-modal-title" className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
              Legal & Policy Information
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => onSelectTab('terms')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'terms'
                ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('privacy')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'privacy'
                ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('disclaimer')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'disclaimer'
                ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Disclaimer & Fair Use</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm leading-relaxed space-y-4">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Terms of Service
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Last updated: September 2026
                </p>
              </div>

              <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    1. Acceptance of Terms
                  </h4>
                  <p>
                    By accessing and using this web application (&ldquo;YouTube Transcript&rdquo; or the &ldquo;Service&rdquo;),
                    you agree to be bound by these Terms of Service. If you do not agree with any part of these terms,
                    you must discontinue use of the service immediately.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    2. Service Description
                  </h4>
                  <p>
                    This application provides a utility interface allowing users to access publicly available captions
                    and transcripts associated with public YouTube videos for personal study, research, accessibility,
                    and reference purposes.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    3. Intellectual Property & Fair Use
                  </h4>
                  <p>
                    All video titles, audio, video recordings, channels, and transcripts are the intellectual property of
                    their respective copyright holders and content creators. This service does not claim any ownership,
                    copyright, or license over any third-party content. You are solely responsible for ensuring that your
                    use of extracted transcript text complies with applicable copyright laws, the doctrine of Fair Use
                    (17 U.S.C. § 107), and YouTube&apos;s Terms of Service.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    4. Prohibited Uses
                  </h4>
                  <p>
                    You agree not to:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Use the service for bulk unauthorized harvesting or automated denial-of-service attempts.</li>
                    <li>Attempt to circumvent rate limits, video privacy restrictions, or security mechanisms.</li>
                    <li>Use retrieved transcripts in any manner that infringes third-party intellectual property rights.</li>
                    <li>Resell or re-package this service as a commercial paid API without authorization.</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    5. Disclaimer of Warranties & Limitation of Liability
                  </h4>
                  <p>
                    The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express
                    or implied. We make no guarantees regarding transcript availability, accuracy, or uninterrupted service.
                    In no event shall the website operators be liable for any indirect, incidental, or consequential damages.
                  </p>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Privacy Policy
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Last updated: September 2026
                </p>
              </div>

              <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    1. No User Accounts or Personal Data Collected
                  </h4>
                  <p>
                    We believe in minimal data footprint. We do not require account creation, registration, passwords,
                    email addresses, phone numbers, or payment details. You can freely use this tool anonymously.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    2. Processing of Video URLs
                  </h4>
                  <p>
                    When you submit a YouTube URL, our backend temporarily processes the video identifier to fetch
                    the video metadata and public transcript. We do not maintain a persistent database of individual user
                    viewing history or associate submitted URLs with personal identities.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    3. Browser LocalStorage & Cookies
                  </h4>
                  <p>
                    We do not use advertising cookies, tracking pixels, or cross-site tracking scripts. We only use browser
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono mx-1">localStorage</code>
                    to remember your preference between light and dark themes.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    4. Ephemeral Server Logs & Rate Limiting
                  </h4>
                  <p>
                    To protect our servers from abuse, automated spam, and DDoS attacks, our server maintains a temporary
                    in-memory rate limiter that records request timestamps per IP address. These records are held solely in memory
                    and automatically discarded after a short window (1 to 5 minutes).
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    5. Third-Party Services
                  </h4>
                  <p>
                    When fetching video thumbnails or opening timestamps, your browser connects directly to YouTube/Google servers.
                    Those interactions are subject to Google&apos;s Privacy Policy at{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-zinc-900 dark:text-zinc-100"
                    >
                      policies.google.com/privacy
                    </a>.
                  </p>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Disclaimer & Trademark Notice
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Important notice regarding third-party platforms and copyright
                </p>
              </div>

              <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
                <div className="p-3 rounded border border-amber-300 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200">
                  <strong>Notice of Non-Affiliation:</strong> YouTube is a registered trademark of Google LLC. This web
                  application is an independent developer utility and is not affiliated, associated, authorized, endorsed by,
                  or in any way officially connected with YouTube, Google LLC, or any of their subsidiaries or affiliates.
                </div>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Fair Use Notice
                  </h4>
                  <p>
                    This application operates strictly under the principles of fair use, research, criticism, educational study,
                    and assistive accessibility for hearing-impaired users. The transcripts displayed are generated either by
                    the original video uploader or by automated speech-to-text systems.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Accuracy of Transcripts
                  </h4>
                  <p>
                    Automated subtitles and speech-to-text engines may contain errors, homophone misunderstandings, or phonetic
                    inaccuracies. The operator of this website does not guarantee the typographical or semantic accuracy of any
                    transcript segment.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Content Removal & Takedowns
                  </h4>
                  <p>
                    Because this service retrieves only public caption tracks on demand and does not host or store proprietary
                    media, disabling closed captions on a video or setting it to private on YouTube immediately renders it
                    inaccessible through this utility.
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            YouTube Transcript utility
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
