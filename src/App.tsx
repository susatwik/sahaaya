import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/Layout';
import { HomeDashboard } from './pages/HomeDashboard';
import { AskProtocol } from './pages/AskProtocol';
import { DailyVisits } from './pages/DailyVisits';
import { HouseholdRegister } from './pages/HouseholdRegister';
import { HouseholdDetails } from './pages/HouseholdDetails';
import { ProtocolLibrary } from './pages/ProtocolLibrary';
import { ProtocolDetail } from './pages/ProtocolDetail';
import { SyncQueuePage } from './pages/SyncQueuePage';
import { SettingsPage } from './pages/SettingsPage';
import { OfflineReadiness } from './pages/OfflineReadiness';
import { initDatabase } from './core/storage/db';

export const App: React.FC = () => {
  useEffect(() => {
    initDatabase().catch((err) => {
      console.error('Failed to initialize local IndexedDB:', err);
    });
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeDashboard />} />
            <Route path="ask" element={<AskProtocol />} />
            <Route path="visits" element={<DailyVisits />} />
            <Route path="households" element={<HouseholdRegister />} />
            <Route path="households/:id" element={<HouseholdDetails />} />
            <Route path="protocols" element={<ProtocolLibrary />} />
            <Route path="protocols/:id" element={<ProtocolDetail />} />
            <Route path="sync" element={<SyncQueuePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="readiness" element={<OfflineReadiness />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
