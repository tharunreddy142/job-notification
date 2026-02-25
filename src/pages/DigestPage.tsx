import { useCallback, useEffect, useMemo, useState } from 'react';
import { jobs, type Job } from '../data/jobs';
import { useJobStatus } from '../hooks/useJobStatus';
import { usePreferences } from '../hooks/usePreferences';
import { calculateMatchScore } from '../utils/matchScore';
import './DigestPage.css';

interface DigestJob extends Job {
  matchScore: number;
}

interface DailyDigest {
  date: string;
  jobs: DigestJob[];
}

const DIGEST_LIMIT = 10;

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDigestStorageKey(dateKey: string): string {
  return `jobTrackerDigest_${dateKey}`;
}

export function DigestPage() {
  const { preferences, hasPreferences, isLoaded } = usePreferences();
  const { statusUpdates, isLoaded: statusLoaded } = useJobStatus();
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const todayKey = useMemo(() => getTodayKey(), []);
  const hasActivePreferences = hasPreferences();

  const formattedDate = useMemo(() => {
    const [year, month, day] = todayKey.split('-').map(Number);
    const displayDate = new Date(year, month - 1, day);
    return displayDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [todayKey]);

  useEffect(() => {
    try {
      const storedDigest = localStorage.getItem(getDigestStorageKey(todayKey));
      if (!storedDigest) {
        return;
      }

      const parsed = JSON.parse(storedDigest) as DailyDigest;
      if (parsed && parsed.date === todayKey && Array.isArray(parsed.jobs)) {
        setDigest(parsed);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [todayKey]);

  const generateDigestText = useCallback((currentDigest: DailyDigest) => {
    const header = `Top 10 Jobs For You - 9AM Digest (${currentDigest.date})`;
    const jobsText = currentDigest.jobs
      .map((job, index) =>
        `${index + 1}. ${job.title} at ${job.company} | ${job.location} | ${job.experience} | Match: ${job.matchScore}% | Apply: ${job.applyUrl}`
      )
      .join('\n');
    const footer = 'This digest was generated based on your preferences.';
    return `${header}\n\n${jobsText}\n\n${footer}`;
  }, []);

  const buildTodayDigest = useCallback(() => {
    const scoredJobs = jobs.map((job) => ({
      ...job,
      matchScore: calculateMatchScore(job, preferences),
    }));

    const matchingJobs = scoredJobs
      .filter((job) => job.matchScore >= preferences.minMatchScore)
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return a.postedDaysAgo - b.postedDaysAgo;
      })
      .slice(0, DIGEST_LIMIT);

    return {
      date: todayKey,
      jobs: matchingJobs,
    } as DailyDigest;
  }, [preferences, todayKey]);

  const handleGenerateDigest = useCallback(() => {
    if (!hasActivePreferences) {
      return;
    }

    try {
      const storageKey = getDigestStorageKey(todayKey);
      const existingDigest = localStorage.getItem(storageKey);

      if (existingDigest) {
        const parsed = JSON.parse(existingDigest) as DailyDigest;
        if (parsed && parsed.date === todayKey && Array.isArray(parsed.jobs)) {
          setDigest(parsed);
          setStatusMessage("Loaded today's existing digest.");
          return;
        }
      }

      const nextDigest = buildTodayDigest();
      localStorage.setItem(storageKey, JSON.stringify(nextDigest));
      setDigest(nextDigest);
      setStatusMessage("Today's digest generated.");
    } catch {
      setStatusMessage('Unable to generate digest right now.');
    }
  }, [buildTodayDigest, hasActivePreferences, todayKey]);

  const handleCopyDigest = useCallback(async () => {
    if (!digest) {
      return;
    }

    const digestText = generateDigestText(digest);
    try {
      await navigator.clipboard.writeText(digestText);
      setStatusMessage('Digest copied to clipboard.');
    } catch {
      setStatusMessage('Clipboard copy failed.');
    }
  }, [digest, generateDigestText]);

  const handleCreateEmailDraft = useCallback(() => {
    if (!digest) {
      return;
    }

    const subject = encodeURIComponent('My 9AM Job Digest');
    const body = encodeURIComponent(generateDigestText(digest));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [digest, generateDigestText]);

  const showBlockingState = isLoaded && !hasActivePreferences;
  const showNoMatchesState = digest && digest.jobs.length === 0;
  const recentStatusUpdates = statusUpdates.slice(0, 8);

  const formatStatusDate = (value: string) => {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section className="digest-page" aria-label="Daily Digest">
      <div className="digest-page__shell">
        <header className="digest-page__header">
          <h1 className="digest-page__title">Digest</h1>
          <p className="digest-page__demo-note">
            Demo Mode: Daily 9AM trigger simulated manually.
          </p>
        </header>

        <div className="digest-page__actions">
          <button
            type="button"
            className="digest-page__btn digest-page__btn--primary"
            onClick={handleGenerateDigest}
            disabled={showBlockingState}
          >
            Generate Today&apos;s 9AM Digest (Simulated)
          </button>
          <button
            type="button"
            className="digest-page__btn digest-page__btn--secondary"
            onClick={handleCopyDigest}
            disabled={!digest}
          >
            Copy Digest to Clipboard
          </button>
          <button
            type="button"
            className="digest-page__btn digest-page__btn--secondary"
            onClick={handleCreateEmailDraft}
            disabled={!digest}
          >
            Create Email Draft
          </button>
        </div>

        {statusMessage && <p className="digest-page__status">{statusMessage}</p>}

        {showBlockingState && (
          <div className="digest-page__state">
            <p>Set preferences to generate a personalized digest.</p>
          </div>
        )}

        {!showBlockingState && showNoMatchesState && (
          <div className="digest-page__state">
            <p>No matching roles today. Check again tomorrow.</p>
          </div>
        )}

        {!showBlockingState && digest && digest.jobs.length > 0 && (
          <article className="digest-page__card">
            <header className="digest-page__card-header">
              <h2 className="digest-page__card-title">Top 10 Jobs For You — 9AM Digest</h2>
              <p className="digest-page__card-date">{formattedDate}</p>
            </header>

            <div className="digest-page__list">
              {digest.jobs.map((job) => (
                <div key={job.id} className="digest-page__item">
                  <div className="digest-page__item-main">
                    <h3 className="digest-page__item-title">{job.title}</h3>
                    <p className="digest-page__item-meta">
                      {job.company} · {job.location} · {job.experience}
                    </p>
                    <p className="digest-page__item-score">Match Score: {job.matchScore}%</p>
                  </div>
                  <button
                    type="button"
                    className="digest-page__apply-btn"
                    onClick={() => window.open(job.applyUrl, '_blank', 'noopener,noreferrer')}
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>

            <footer className="digest-page__card-footer">
              This digest was generated based on your preferences.
            </footer>
          </article>
        )}

        {statusLoaded && (
          <section className="digest-page__updates" aria-label="Recent Status Updates">
            <h2 className="digest-page__updates-title">Recent Status Updates</h2>
            {recentStatusUpdates.length > 0 ? (
              <div className="digest-page__updates-list">
                {recentStatusUpdates.map((update, index) => (
                  <div key={`${update.jobId}-${update.changedAt}-${index}`} className="digest-page__updates-item">
                    <p className="digest-page__updates-job">
                      {update.title} · {update.company}
                    </p>
                    <p className="digest-page__updates-meta">
                      {update.status} · {formatStatusDate(update.changedAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="digest-page__updates-empty">No recent status updates.</p>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
