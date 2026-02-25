import { useState, useMemo, useCallback, useEffect } from 'react';
import { jobs, type Job } from '../data/jobs';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import { StatusToast } from '../components/StatusToast';
import { type JobStatus, useJobStatus } from '../hooks/useJobStatus';
import { useSavedJobs } from '../hooks/useSavedJobs';
import './SavedPage.css';

export function SavedPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { getStatus, setJobStatus, isLoaded: statusLoaded } = useJobStatus();
  const { savedJobIds, isSaved, toggleSave, isLoaded } = useSavedJobs();

  const savedJobs = useMemo(() => {
    return jobs.filter((job) => savedJobIds.includes(job.id));
  }, [savedJobIds]);

  const handleViewJob = useCallback((job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedJob(null);
  }, []);

  const handleApply = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage('');
    }, 2400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastMessage]);

  const handleStatusChange = useCallback((job: Job, status: JobStatus) => {
    setJobStatus({
      jobId: job.id,
      title: job.title,
      company: job.company,
      status,
    });

    if (status !== 'Not Applied') {
      setToastMessage(`Status updated: ${status}`);
    }
  }, [setJobStatus]);

  // Show loading state until localStorage is loaded
  if (!isLoaded || !statusLoaded) {
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
              status={getStatus(job.id)}
              onStatusChange={handleStatusChange}
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
      <StatusToast visible={!!toastMessage} message={toastMessage} />
    </section>
  );
}
