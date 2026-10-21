import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area - Offset by fixed sidebar width (250px) on desktop */}
      <div className="flex-1 flex flex-col min-w-0 sm:pl-[250px] pb-24 sm:pb-6 transition-all">
        <Header />

        <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 transition-all">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};
