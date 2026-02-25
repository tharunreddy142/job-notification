import './PlaceholderPage.css';

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="placeholder-page" aria-label={title}>
      <h1 className="placeholder-page__title">{title}</h1>
      <p className="placeholder-page__subtext">
        This section will be built in the next step.
      </p>
    </section>
  );
}
