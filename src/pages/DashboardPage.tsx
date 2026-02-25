import { useState, useMemo, useCallback } from 'react';
import { jobs, type Job } from '../data/jobs';
import { FilterBar, type FilterState } from '../components/FilterBar';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import { useSavedJobs } from '../hooks/useSavedJobs';
import { usePreferences } from '../hooks/usePreferences';
import { calculateMatchScore } from '../utils/matchScore';
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
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const { isSaved, toggleSave } = useSavedJobs();
  const { preferences, hasPreferences, isLoaded: prefsLoaded } = usePreferences();
  const hasActivePreferences = hasPreferences();

  const jobsWithScores = useMemo(() => {
    return jobs.map((job) => ({
      ...job,
      matchScore: calculateMatchScore(job, preferences),
    }));
  }, [preferences]);

  const filteredJobs = useMemo(() => {
    const salaryValue = (salaryRange: string): number => {
      const values = salaryRange
        .replace(/,/g, '')
        .match(/\d+(?:\.\d+)?/g)
        ?.map(Number);

      if (!values || values.length === 0) {
        return 0;
      }

      return Math.max(...values);
    };

    let result = jobsWithScores.filter((job) => {
      const matchesKeyword =
        !filters.keyword ||
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.keyword.toLowerCase());
      const matchesLocation = !filters.location || job.location === filters.location;
      const matchesMode = !filters.mode || job.mode === filters.mode;
      const matchesExperience = !filters.experience || job.experience === filters.experience;
      const matchesSource = !filters.source || job.source === filters.source;
      const matchesThreshold = !showOnlyMatches || job.matchScore >= preferences.minMatchScore;

      return matchesKeyword && matchesLocation && matchesMode && matchesExperience && matchesSource && matchesThreshold;
    });

    // Sort
    switch (filters.sort) {
      case 'latest':
        result = result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        break;
      case 'matchScore':
        result = result.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'salary':
        result = result.sort((a, b) => salaryValue(b.salaryRange) - salaryValue(a.salaryRange));
        break;
      case 'experience':
        const expOrder = { Fresher: 0, '0-1': 1, '1-3': 2, '3-5': 3 };
        result = result.sort((a, b) => expOrder[a.experience] - expOrder[b.experience]);
        break;
    }

    return result;
  }, [filters, jobsWithScores, showOnlyMatches, preferences.minMatchScore]);

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

  const showPreferencesBanner = prefsLoaded && !hasActivePreferences;

  return (
    <section className="dashboard-page" aria-label="Dashboard">
      <h1 className="dashboard-page__title">Dashboard</h1>

      {showPreferencesBanner && (
        <div className="dashboard-page__banner">
          <p className="dashboard-page__banner-text">
            Set your preferences to activate intelligent matching.
          </p>
        </div>
      )}

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        resultCount={filteredJobs.length}
      />

      <div className="dashboard-page__toggle">
        <label className="dashboard-page__toggle-label">
          <input
            type="checkbox"
            className="dashboard-page__toggle-input"
            checked={showOnlyMatches}
            onChange={(e) => setShowOnlyMatches(e.target.checked)}
          />
          <span>Show only jobs above my threshold ({preferences.minMatchScore}%)</span>
        </label>
      </div>

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
              showMatchScore={hasActivePreferences}
            />
          ))}
        </div>
      ) : (
        <div className="dashboard-page__empty">
          <p className="dashboard-page__empty-text">
            No roles match your criteria. Adjust filters or lower threshold.
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
