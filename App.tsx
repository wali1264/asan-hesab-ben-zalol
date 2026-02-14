
import React, { useState, useEffect } from 'react';
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import Dashboard from './dashboard/Dashboard';
import ModuleView from './pages/ModuleView';
import ReportsView from './pages/ReportsView';
import Login from './pages/Login';
import { ModuleType } from './types';
import { NAVIGATION_ITEMS } from './constants';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authVersion, setAuthVersion] = useState(0);

  useEffect(() => {
    setAuthVersion(v => v + 1);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setAuthVersion(v => v + 1)} />;
  }

  const activeLabel = NAVIGATION_ITEMS.find(i => i.id === activeModule)?.label || 'نمای کلی';

  return (
    <div key={authVersion} className="flex h-screen overflow-hidden bg-[#fbfcfd] text-slate-900 font-sans selection:bg-blue-100" dir="rtl">
      <Sidebar 
        activeModule={activeModule} 
        onSelectModule={setActiveModule} 
        isCollapsed={sidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          activeLabel={activeLabel} 
          onNavigate={setActiveModule}
          onLogout={logout}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-10 relative scroll-smooth scrollbar-hide">
          <div className="max-w-[1500px] mx-auto pb-24">
            {activeModule === ModuleType.DASHBOARD ? (
              <Dashboard />
            ) : activeModule === ModuleType.REPORTS ? (
              <ReportsView />
            ) : (
              <ModuleView module={activeModule} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
