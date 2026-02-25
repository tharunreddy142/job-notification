import './SettingsPage.css';

export function SettingsPage() {
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
            placeholder="e.g., Senior Product Manager, Engineering Lead"
          />
          <p className="settings-page__hint">
            Comma-separated keywords to match against job titles
          </p>
        </div>

        <div className="settings-page__field">
          <label htmlFor="locations" className="settings-page__label">
            Preferred locations
          </label>
          <input
            id="locations"
            type="text"
            className="settings-page__input"
            placeholder="e.g., San Francisco, New York, Remote"
          />
          <p className="settings-page__hint">
            Cities, states, or regions you are open to
          </p>
        </div>

        <div className="settings-page__field">
          <label htmlFor="work-mode" className="settings-page__label">
            Mode
          </label>
          <select id="work-mode" className="settings-page__select">
            <option value="">Select work mode</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
          <p className="settings-page__hint">
            Your preferred work arrangement
          </p>
        </div>

        <div className="settings-page__field">
          <label htmlFor="experience" className="settings-page__label">
            Experience level
          </label>
          <select id="experience" className="settings-page__select">
            <option value="">Select experience level</option>
            <option value="entry">Entry Level (0-2 years)</option>
            <option value="mid">Mid Level (3-5 years)</option>
            <option value="senior">Senior Level (6+ years)</option>
            <option value="lead">Lead / Staff</option>
          </select>
          <p className="settings-page__hint">
            Target roles matching your career stage
          </p>
        </div>
      </form>
    </section>
  );
}
