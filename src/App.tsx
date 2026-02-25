import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopNavigation } from './components/TopNavigation';
import { HomePage } from './pages/HomePage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <TopNavigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
            <Route path="/saved" element={<PlaceholderPage title="Saved" />} />
            <Route path="/digest" element={<PlaceholderPage title="Digest" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            <Route path="/proof" element={<PlaceholderPage title="Proof" />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
