import { useState, useMemo } from 'react';
import { jobs, type Job } from '../data/jobs';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import { useSavedJobs } from '../hooks/useSavedJobs';
import './SavedPage.css';

export function SavedPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { savedJobIds, isSaved, toggleSave, isLoaded } = useSavedJobs();

  const savedJobs = useMemo(() => {
    return jobs.filter((job) => savedJobIds.includes(job.id));
  }, [savedJobIds]);

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleApply = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Show loading state until localStorage is loaded
  if (!isLoaded) {
    return (
      <section className="saved-page" aria-label="Saved Jobs">
        <h1 className="saved-page__title">Saved</h1>
        <div className="saved-page__empty">
          <p className="saved-page__empty-text">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="saved-page" aria-label="Saved Jobs">
      <h1 className="saved-page__title">Saved</h1>

      {savedJobs.length > 0 ? (
        <div className="saved-page__jobs">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={isSaved(job.id)}
              onView={handleViewJob}
              onSave={toggleSave}
              onApply={handleApply}
            />
          ))}
        </div>
      ) : (
        <div className="saved-page__empty">
          <h2 className="saved-page__empty-title">No saved jobs yet</h2>
          <p className="saved-page__empty-text">
            Jobs you save will appear here for quick access. Start tracking to discover opportunities worth saving.
          </p>
        </div>
      )}

      <JobModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApply={handleApply}
      />
    </section>
  );
}
