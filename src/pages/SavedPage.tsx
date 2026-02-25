import './EmptyStatePage.css';

export function SavedPage() {
  return (
    <section className="empty-state-page" aria-label="Saved Jobs">
      <h1 className="empty-state-page__title">Saved</h1>
      <p className="empty-state-page__message">
        Jobs you save will appear here for quick access. Start tracking to discover opportunities worth saving.
      </p>
    </section>
  );
}
