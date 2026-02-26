import { Clock, FileText, Mail, User, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';

interface Activity {
  id: number;
  message: string;
  icon: 'document' | 'email' | 'user' | 'check';
  time: string;
  user?: string;
}

const mockActivities: Activity[] = [
  { id: 1, message: 'Agent vytvoril CP-2026/0047 pre TechnoStav s.r.o.', icon: 'document', time: '5 min', user: 'Agent' },
  { id: 2, message: 'Ján priradil dopyt #12 sebe', icon: 'user', time: '12 min', user: 'Ján Novák' },
  { id: 3, message: 'Agent odoslal upomienku FA-2026/0023', icon: 'email', time: '1h', user: 'Agent' },
  { id: 4, message: 'Nová objednávka OBJ-2026/0018 od ElektroMont a.s.', icon: 'document', time: '2h', user: 'Agent' },
  { id: 5, message: 'Admin zmenil cenu produktu Kábel XY-100', icon: 'user', time: '3h', user: 'Admin' },
  { id: 6, message: 'Agent spracoval 5 nových emailov', icon: 'check', time: '4h', user: 'Agent' },
  { id: 7, message: 'Faktúra FA-2026/0024 bola zaplatená', icon: 'check', time: '5h', user: 'Systém' },
  { id: 8, message: 'Nový zákazník: BuildCorp Slovakia', icon: 'user', time: '6h', user: 'Agent' },
  { id: 9, message: 'Agent vytvoril DL pre objednávku #15', icon: 'document', time: '7h', user: 'Agent' },
  { id: 10, message: 'Upozornenie: 3 faktúry sa blížia k splatnosti', icon: 'email', time: '8h', user: 'Systém' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'document': return <FileText className="w-4 h-4" />;
    case 'email': return <Mail className="w-4 h-4" />;
    case 'user': return <User className="w-4 h-4" />;
    case 'check': return <CheckCircle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

interface ActivityFeedProps {
  limit?: number;
  customerId?: number;
}

export function ActivityFeed({ limit = 10, customerId }: ActivityFeedProps) {
  // If customerId is provided, filter activities for that customer
  // For now, just use mock data
  const activities = mockActivities.slice(0, limit);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Posledná aktivita</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-3 relative">
            {/* Timeline line */}
            {index < activities.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
            )}
            
            {/* Icon */}
            <div className="relative z-10 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
              {getIcon(activity.icon)}
            </div>
            
            {/* Content */}
            <div className="flex-1 pt-0.5">
              <p className="text-sm text-foreground">{activity.message}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {activity.user && <span>{activity.user}</span>}
                <span>•</span>
                <span>{activity.time} ago</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
