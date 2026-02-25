import { Link } from 'react-router-dom';
import { TEST_CHECKLIST_ITEMS, useTestChecklist } from '../hooks/useTestChecklist';
import './TestChecklistPage.css';

export function TestChecklistPage() {
  const {
    checklistState,
    isLoaded,
    toggleItem,
    reset,
    passedCount,
    totalCount,
    allPassed,
  } = useTestChecklist();

  if (!isLoaded) {
    return (
      <section className="test-checklist-page" aria-label="Test Checklist">
        <h1 className="test-checklist-page__title">Built-In Test Checklist</h1>
        <p className="test-checklist-page__message">Loading...</p>
      </section>
    );
  }

  return (
    <section className="test-checklist-page" aria-label="Test Checklist">
      <header className="test-checklist-page__header">
        <h1 className="test-checklist-page__title">Built-In Test Checklist</h1>
        <p className="test-checklist-page__summary">Tests Passed: {passedCount} / {totalCount}</p>
        {!allPassed && (
          <p className="test-checklist-page__warning">Resolve all issues before shipping.</p>
        )}
      </header>

      <div className="test-checklist-page__actions">
        <button type="button" className="test-checklist-page__reset-btn" onClick={reset}>
          Reset Test Status
        </button>
        <Link
          to={allPassed ? '/jt/08-ship' : '/jt/07-test'}
          className={`test-checklist-page__ship-link ${!allPassed ? 'test-checklist-page__ship-link--disabled' : ''}`}
          aria-disabled={!allPassed}
        >
          Go to Ship Gate
        </Link>
      </div>

      <div className="test-checklist-page__list">
        {TEST_CHECKLIST_ITEMS.map((item) => (
          <label key={item.id} className="test-checklist-page__item">
            <input
              type="checkbox"
              className="test-checklist-page__checkbox"
              checked={Boolean(checklistState[item.id])}
              onChange={() => toggleItem(item.id)}
            />
            <span className="test-checklist-page__label">{item.label}</span>
            <span className="test-checklist-page__tooltip" title={`How to test: ${item.howToTest}`}>
              How to test
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
