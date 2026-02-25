import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export function NotFoundPage() {
  return (
    <section className="not-found-page" aria-label="Page Not Found">
      <h1 className="not-found-page__title">Page Not Found</h1>
      <p className="not-found-page__subtext">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="not-found-page__link">
        Return to Home
      </Link>
    </section>
  );
}
