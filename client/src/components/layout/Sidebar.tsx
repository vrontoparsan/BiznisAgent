import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Mail, FileText, Package, Users, AlertCircle, BarChart3, Settings, LogOut, Moon, Sun, Menu, X, Shield } from 'lucide-react';
import { Button } from '../ui/button';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const modules = [
  { id: 'inbox', label: 'Doručené', icon: Mail },
  { id: 'documents', label: 'Doklady', icon: FileText },
  { id: 'catalog', label: 'Katalóg', icon: Package },
  { id: 'crm', label: 'Zákazníci', icon: Users },
  { id: 'complaints', label: 'Reklamácie', icon: AlertCircle },
  { id: 'dashboard', label: 'Prehľady', icon: BarChart3 },
];

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Biznis Agent</h1>
        <p className="text-sm text-muted-foreground mt-1">{user?.name}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {user?.role === 'superadmin' && (
          <button
            onClick={() => {
              setActiveModule('superadmin');
              setMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeModule === 'superadmin'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Shield className="w-5 h-5" />
            Super Admin
          </button>
        )}
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => {
                setActiveModule(module.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeModule === module.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              {module.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            setActiveModule('settings');
            setMobileOpen(false);
          }}
        >
          <Settings className="w-5 h-5 mr-3" />
          Nastavenia
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
          {theme === 'light' ? 'Tmavý režim' : 'Svetlý režim'}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Odhlásiť sa
        </Button>
        <div className="pt-2 text-center text-xs text-muted-foreground">
          ⌨️ Skratky: N=nový, C=CP, F=FA, /=hľadať
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex-col">
        {sidebarContent}
      </div>
    </>
  );
}
