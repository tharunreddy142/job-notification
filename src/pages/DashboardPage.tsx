import { useState, useMemo } from 'react';
import { jobs, type Job } from '../data/jobs';
import { FilterBar, type FilterState } from '../components/FilterBar';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import { useSavedJobs } from '../hooks/useSavedJobs';
import './DashboardPage.css';

const initialFilters: FilterState = {
  keyword: '',
  location: '',
  mode: '',
  experience: '',
  source: '',
  sort: 'latest',
};

export function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isSaved, toggleSave } = useSavedJobs();

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const matchesKeyword =
        !filters.keyword ||
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.keyword.toLowerCase());
      const matchesLocation = !filters.location || job.location === filters.location;
      const matchesMode = !filters.mode || job.mode === filters.mode;
      const matchesExperience = !filters.experience || job.experience === filters.experience;
      const matchesSource = !filters.source || job.source === filters.source;

      return matchesKeyword && matchesLocation && matchesMode && matchesExperience && matchesSource;
    });

    // Sort
    switch (filters.sort) {
      case 'latest':
        result = result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        break;
      case 'salary':
        // Simple sort by extracting first number from salary range
        result = result.sort((a, b) => {
          const getSalaryValue = (s: string) => {
            const match = s.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return getSalaryValue(a.salaryRange) - getSalaryValue(b.salaryRange);
        });
        break;
      case 'experience':
        const expOrder = { Fresher: 0, '0-1': 1, '1-3': 2, '3-5': 3 };
        result = result.sort((a, b) => expOrder[a.experience] - expOrder[b.experience]);
        break;
    }

    return result;
  }, [filters]);

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

  return (
    <section className="dashboard-page" aria-label="Dashboard">
      <h1 className="dashboard-page__title">Dashboard</h1>

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        resultCount={filteredJobs.length}
      />

      {filteredJobs.length > 0 ? (
        <div className="dashboard-page__jobs">
          {filteredJobs.map((job) => (
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
        <div className="dashboard-page__empty">
          <p className="dashboard-page__empty-text">
            No jobs match your search.
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
