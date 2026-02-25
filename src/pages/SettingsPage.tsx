import type { ChangeEvent } from 'react';
import { usePreferences } from '../hooks/usePreferences';
import { locations, experiences } from '../data/jobs';
import './SettingsPage.css';

const modes = ['Remote', 'Hybrid', 'Onsite'] as const;

export function SettingsPage() {
  const { preferences, updatePreference, isLoaded } = usePreferences();

  const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const updatedLocations = Array.from(event.target.selectedOptions, (option) => option.value);
    updatePreference('preferredLocations', updatedLocations);
  };

  const handleModeToggle = (mode: string) => {
    const current = preferences.preferredMode;
    const updated = current.includes(mode)
      ? current.filter(m => m !== mode)
      : [...current, mode];
    updatePreference('preferredMode', updated);
  };

  if (!isLoaded) {
    return (
      <section className="settings-page" aria-label="Settings">
        <h1 className="settings-page__title">Settings</h1>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="settings-page" aria-label="Settings">
      <h1 className="settings-page__title">Settings</h1>
      
      <form className="settings-page__form" onSubmit={(e) => e.preventDefault()}>
        <div className="settings-page__field">
          <label htmlFor="role-keywords" className="settings-page__label">
            Role keywords
          </label>
          <input
            id="role-keywords"
            type="text"
            className="settings-page__input"
            placeholder="e.g., SDE, Frontend, Backend, Data Analyst"
            value={preferences.roleKeywords}
            onChange={(e) => updatePreference('roleKeywords', e.target.value)}
          />
          <p className="settings-page__hint">
            Comma-separated keywords to match against job titles and descriptions
          </p>
        </div>

        <div className="settings-page__field">
          <label htmlFor="preferred-locations" className="settings-page__label">
            Preferred locations
          </label>
          <select
            id="preferred-locations"
            className="settings-page__select settings-page__select--multi"
            multiple
            value={preferences.preferredLocations}
            onChange={handleLocationChange}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <p className="settings-page__hint">
            Multi-select cities you are open to
          </p>
        </div>

        <div className="settings-page__field">
          <label className="settings-page__label">
            Preferred mode
          </label>
          <div className="settings-page__checkbox-group">
            {modes.map((mode) => (
              <label key={mode} className="settings-page__checkbox-label">
                <input
                  type="checkbox"
                  className="settings-page__checkbox"
                  checked={preferences.preferredMode.includes(mode)}
                  onChange={() => handleModeToggle(mode)}
                />
                <span>{mode}</span>
              </label>
            ))}
          </div>
          <p className="settings-page__hint">
            Select your preferred work arrangements
          </p>
        </div>

        <div className="settings-page__field">
          <label htmlFor="experience-level" className="settings-page__label">
            Experience level
          </label>
          <select 
            id="experience-level" 
            className="settings-page__select"
            value={preferences.experienceLevel}
            onChange={(e) => updatePreference('experienceLevel', e.target.value)}
          >
            <option value="">Any experience level</option>
            {experiences.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
          <p className="settings-page__hint">
            Target roles matching your career stage
          </p>
        </div>

        <div className="settings-page__field">
          <label htmlFor="skills" className="settings-page__label">
            Skills
          </label>
          <input
            id="skills"
            type="text"
            className="settings-page__input"
            placeholder="e.g., React, Python, SQL, AWS"
            value={preferences.skills}
            onChange={(e) => updatePreference('skills', e.target.value)}
          />
          <p className="settings-page__hint">
            Comma-separated skills to match against job requirements
          </p>
        </div>

        <div className="settings-page__field">
          <label htmlFor="min-match-score" className="settings-page__label">
            Minimum match score: {preferences.minMatchScore}%
          </label>
          <input
            id="min-match-score"
            type="range"
            className="settings-page__slider"
            min="0"
            max="100"
            value={preferences.minMatchScore}
            onChange={(e) => updatePreference('minMatchScore', parseInt(e.target.value, 10))}
          />
          <p className="settings-page__hint">
            Only show jobs with match score above this threshold
          </p>
        </div>
      </form>
    </section>
  );
}
