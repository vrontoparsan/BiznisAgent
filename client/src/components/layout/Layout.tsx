import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Inbox } from '../modules/Inbox';
import { Documents } from '../modules/Documents';
import { Catalog } from '../modules/Catalog';
import { CRM } from '../modules/CRM';
import { Complaints } from '../modules/Complaints';
import { Dashboard } from '../modules/Dashboard';
import { Settings } from '../modules/Settings';

export function Layout() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
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
      <div className="lg:pl-64">
        <main className="p-6 lg:p-8 pt-16 lg:pt-8">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}
