import './EmptyStatePage.css';

export function DigestPage() {
  return (
    <section className="empty-state-page" aria-label="Daily Digest">
      <h1 className="empty-state-page__title">Digest</h1>
      <p className="empty-state-page__message">
        Your daily 9AM summary of matched opportunities will appear here. Configure your preferences to start receiving personalized digests.
      </p>
    </section>
  );
}
