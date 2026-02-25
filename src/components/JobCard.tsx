import { memo } from 'react';
import type { Job } from '../data/jobs';
import { getMatchScoreBadgeClass } from '../utils/matchScore';
import './JobCard.css';

interface JobCardProps {
  job: Job & { matchScore?: number };
  isSaved: boolean;
  onView: (job: Job) => void;
  onSave: (jobId: string) => void;
  onApply: (url: string) => void;
  showMatchScore?: boolean;
}

export const JobCard = memo(function JobCard({
  job,
  isSaved,
  onView,
  onSave,
  onApply,
  showMatchScore = false,
}: JobCardProps) {
  const getSourceBadgeClass = (source: string) => {
    switch (source) {
      case 'LinkedIn':
        return 'job-card__badge--source-linkedin';
      case 'Naukri':
        return 'job-card__badge--source-naukri';
      case 'Indeed':
        return 'job-card__badge--source-indeed';
      default:
        return '';
    }
  };

  const formatPostedTime = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <article className="job-card">
      <div className="job-card__header">
        <h3 className="job-card__title">{job.title}</h3>
        <p className="job-card__company">{job.company}</p>
      </div>

      <div className="job-card__meta">
        <span className="job-card__meta-item">
          {job.location} · {job.mode}
        </span>
      </div>

      <div className="job-card__badges">
        <span className={`job-card__badge ${getSourceBadgeClass(job.source)}`}>
          {job.source}
        </span>
        <span className="job-card__badge job-card__badge--experience">
          {job.experience}
        </span>
        <span className="job-card__badge job-card__badge--salary">
          {job.salaryRange}
        </span>
        {showMatchScore && job.matchScore !== undefined && (
          <span className={`job-card__badge job-card__match-score ${getMatchScoreBadgeClass(job.matchScore)}`}>
            {job.matchScore}% match
          </span>
        )}
      </div>

      <p className="job-card__posted">Posted {formatPostedTime(job.postedDaysAgo)}</p>

      <div className="job-card__actions">
        <button
          className="job-card__btn job-card__btn--secondary"
          onClick={() => onView(job)}
          type="button"
        >
          View
        </button>
        <button
          className={`job-card__btn ${isSaved ? 'job-card__btn--saved' : 'job-card__btn--secondary'}`}
          onClick={() => onSave(job.id)}
          type="button"
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button
          className="job-card__btn job-card__btn--primary"
          onClick={() => onApply(job.applyUrl)}
          type="button"
        >
          Apply
        </button>
      </div>
    </article>
  );
});
