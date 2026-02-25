import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopNavigation } from './components/TopNavigation';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { SavedPage } from './pages/SavedPage';
import { DigestPage } from './pages/DigestPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProofPage } from './pages/ProofPage';
import { TestChecklistPage } from './pages/TestChecklistPage';
import { ShipGatePage } from './pages/ShipGatePage';
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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/digest" element={<DigestPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/proof" element={<ProofPage />} />
            <Route path="/jt/07-test" element={<TestChecklistPage />} />
            <Route path="/jt/08-ship" element={<ShipGatePage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
