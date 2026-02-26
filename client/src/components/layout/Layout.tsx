import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Inbox } from '../modules/Inbox';
import { Documents } from '../modules/Documents';
import { Catalog } from '../modules/Catalog';
import { CRM } from '../modules/CRM';
import { Complaints } from '../modules/Complaints';
import { Dashboard } from '../modules/Dashboard';
import { Settings } from '../modules/Settings';
import { SuperAdmin } from '../modules/SuperAdmin';
import { NotificationBell } from './NotificationBell';
import { GlobalSearch } from './GlobalSearch';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { useAuth } from '@/contexts/AuthContext';

export function Layout() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState(user?.role === 'superadmin' ? 'superadmin' : 'dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'superadmin':
        return <SuperAdmin />;
      case 'inbox':
        return <Inbox />;
      case 'documents':
        return <Documents />;
      case 'catalog':
        return <Catalog />;
      case 'crm':
        return <CRM />;
      case 'complaints':
        return <Complaints />;
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      {/* Top header bar with search and notifications */}
      <div className="lg:pl-64 fixed top-0 right-0 left-0 lg:left-64 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <GlobalSearch />
          <NotificationBell />
        </div>
      </div>

      <div className="lg:pl-64 pt-[73px]">
        <main className="p-6 lg:p-8">
          {renderModule()}
        </main>
      </div>

      <KeyboardShortcuts onNavigate={setActiveModule} />
    </div>
  );
}
