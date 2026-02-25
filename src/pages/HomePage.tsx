import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export function HomePage() {
  const navigate = useNavigate();

  const handleStartTracking = () => {
    navigate('/settings');
  };

  return (
    <section className="landing-page" aria-label="Landing Page">
      <h1 className="landing-page__headline">Stop Missing The Right Jobs.</h1>
      <p className="landing-page__subtext">
        Precision-matched job discovery delivered daily at 9AM.
      </p>
      <button 
        className="landing-page__cta" 
        onClick={handleStartTracking}
        type="button"
      >
        Start Tracking
      </button>
    </section>
  );
}
