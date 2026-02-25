import './EmptyStatePage.css';

export function DashboardPage() {
  return (
    <section className="empty-state-page" aria-label="Dashboard">
      <h1 className="empty-state-page__title">Dashboard</h1>
      <p className="empty-state-page__message">
        No jobs yet. In the next step, you will load a realistic dataset.
      </p>
    </section>
  );
}
