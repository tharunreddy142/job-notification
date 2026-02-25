import { Link } from 'react-router-dom';
import { useTestChecklist } from '../hooks/useTestChecklist';
import './ShipGatePage.css';

export function ShipGatePage() {
  const { allPassed, passedCount, totalCount, isLoaded } = useTestChecklist();

  if (!isLoaded) {
    return (
      <section className="ship-gate-page" aria-label="Ship Gate">
        <h1 className="ship-gate-page__title">Ship Gate</h1>
        <p className="ship-gate-page__message">Loading...</p>
      </section>
    );
  }

  return (
    <section className="ship-gate-page" aria-label="Ship Gate">
      <h1 className="ship-gate-page__title">Ship Gate</h1>

      {!allPassed ? (
        <div className="ship-gate-page__locked">
          <p className="ship-gate-page__message">Complete all tests before shipping.</p>
          <p className="ship-gate-page__subtext">Tests Passed: {passedCount} / {totalCount}</p>
          <Link className="ship-gate-page__link" to="/jt/07-test">
            Open Test Checklist
          </Link>
        </div>
      ) : (
        <div className="ship-gate-page__unlocked">
          <p className="ship-gate-page__message">All tests passed. Ship gate unlocked.</p>
          <p className="ship-gate-page__subtext">Tests Passed: {passedCount} / {totalCount}</p>
        </div>
      )}
    </section>
  );
}
