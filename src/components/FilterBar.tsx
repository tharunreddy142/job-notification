import { locations, modes, experiences, sources } from '../data/jobs';
import './FilterBar.css';

export interface FilterState {
  keyword: string;
  location: string;
  mode: string;
  experience: string;
  source: string;
  sort: 'latest' | 'salary' | 'experience' | 'matchScore';
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
}

export function FilterBar({ filters, onFilterChange, resultCount }: FilterBarProps) {
  const handleChange = (field: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__row">
        <div className="filter-bar__field">
          <label htmlFor="filter-keyword" className="filter-bar__label">
            Search
          </label>
          <input
            id="filter-keyword"
            type="text"
            className="filter-bar__input"
            placeholder="Job title or company"
            value={filters.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
          />
        </div>

        <div className="filter-bar__field">
          <label htmlFor="filter-location" className="filter-bar__label">
            Location
          </label>
          <select
            id="filter-location"
            className="filter-bar__select"
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-bar__field">
          <label htmlFor="filter-mode" className="filter-bar__label">
            Mode
          </label>
          <select
            id="filter-mode"
            className="filter-bar__select"
            value={filters.mode}
            onChange={(e) => handleChange('mode', e.target.value)}
          >
            <option value="">All modes</option>
            {modes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-bar__field">
          <label htmlFor="filter-experience" className="filter-bar__label">
            Experience
          </label>
          <select
            id="filter-experience"
            className="filter-bar__select"
            value={filters.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
          >
            <option value="">All levels</option>
            {experiences.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-bar__field">
          <label htmlFor="filter-source" className="filter-bar__label">
            Source
          </label>
          <select
            id="filter-source"
            className="filter-bar__select"
            value={filters.source}
            onChange={(e) => handleChange('source', e.target.value)}
          >
            <option value="">All sources</option>
            {sources.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-bar__field">
          <label htmlFor="filter-sort" className="filter-bar__label">
            Sort by
          </label>
          <select
            id="filter-sort"
            className="filter-bar__select"
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value as FilterState['sort'])}
          >
            <option value="latest">Latest</option>
            <option value="matchScore">Match Score</option>
            <option value="salary">Salary</option>
            <option value="experience">Experience</option>
          </select>
        </div>
      </div>

      <p className="filter-bar__results">
        {resultCount} job{resultCount !== 1 ? 's' : ''} found
      </p>
    </div>
  );
}
