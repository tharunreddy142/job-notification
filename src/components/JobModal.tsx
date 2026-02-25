import type { Job } from '../data/jobs';
import './JobModal.css';

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (url: string) => void;
}

export function JobModal({ job, isOpen, onClose, onApply }: JobModalProps) {
  if (!isOpen || !job) return null;

  const formatPostedTime = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className="job-modal__overlay" onClick={onClose}>
      <div className="job-modal" onClick={(e) => e.stopPropagation()}>
        <header className="job-modal__header">
          <h2 className="job-modal__title">{job.title}</h2>
          <p className="job-modal__company">{job.company}</p>
        </header>

        <div className="job-modal__content">
          <div className="job-modal__meta">
            <div className="job-modal__meta-item">
              <span className="job-modal__meta-label">Location</span>
              <span className="job-modal__meta-value">{job.location}</span>
            </div>
            <div className="job-modal__meta-item">
              <span className="job-modal__meta-label">Mode</span>
              <span className="job-modal__meta-value">{job.mode}</span>
            </div>
            <div className="job-modal__meta-item">
              <span className="job-modal__meta-label">Experience</span>
              <span className="job-modal__meta-value">{job.experience}</span>
            </div>
            <div className="job-modal__meta-item">
              <span className="job-modal__meta-label">Salary</span>
              <span className="job-modal__meta-value">{job.salaryRange}</span>
            </div>
            <div className="job-modal__meta-item">
              <span className="job-modal__meta-label">Source</span>
              <span className="job-modal__meta-value">{job.source}</span>
            </div>
            <div className="job-modal__meta-item">
              <span className="job-modal__meta-label">Posted</span>
              <span className="job-modal__meta-value">{formatPostedTime(job.postedDaysAgo)}</span>
            </div>
          </div>

          <div className="job-modal__section">
            <h3 className="job-modal__section-title">Description</h3>
            <p className="job-modal__text">{job.description}</p>
          </div>

          <div className="job-modal__section">
            <h3 className="job-modal__section-title">Required Skills</h3>
            <ul className="job-modal__skills">
              {job.skills.map((skill) => (
                <li key={skill} className="job-modal__skill">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="job-modal__footer">
          <button
            className="job-modal__btn job-modal__btn--secondary"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <button
            className="job-modal__btn job-modal__btn--primary"
            onClick={() => onApply(job.applyUrl)}
            type="button"
          >
            Apply Now
          </button>
        </footer>
      </div>
    </div>
  );
}
