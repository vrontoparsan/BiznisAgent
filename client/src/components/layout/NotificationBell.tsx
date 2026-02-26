import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface Notification {
  id: number;
  message: string;
  type: 'warning' | 'error' | 'success' | 'info';
  read: boolean;
  time: string;
}

const mockNotifications: Notification[] = [
  { id: 1, message: '⚠️ 3 nové dopyty čakajú na spracovanie', type: 'warning', read: false, time: '5 min' },
  { id: 2, message: '🔴 2 faktúry po splatnosti', type: 'error', read: false, time: '15 min' },
  { id: 3, message: '✅ Agent spracoval objednávku #45', type: 'success', read: false, time: '1h' },
  { id: 4, message: '📧 Nový email od TechnoStav s.r.o.', type: 'info', read: true, time: '2h' },
  { id: 5, message: '✅ Cenová ponuka CP-2026/0047 bola odoslaná', type: 'success', read: true, time: '3h' },
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <Card className="absolute right-0 top-12 w-80 md:w-96 z-50 p-4 shadow-xl max-h-[500px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Notifikácie</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <Check className="w-4 h-4 mr-1" />
                  Označiť všetky
                </Button>
              )}
            </div>

            <div className="space-y-2 overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Žiadne notifikácie</p>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notification.read
                        ? 'bg-muted/50 text-muted-foreground'
                        : 'bg-accent hover:bg-accent/80'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm flex-1">{notification.message}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
