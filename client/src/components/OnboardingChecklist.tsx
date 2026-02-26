import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  description?: string;
}

export function OnboardingChecklist() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('onboarding-dismissed') === 'true';
  });

  // Mock data - in real app, this would come from actual state
  const items: ChecklistItem[] = [
    { id: 'company', label: 'Údaje firmy', completed: true, description: 'Názov, IČO, adresa' },
    { id: 'email', label: 'Email presmerovanie', completed: false, description: 'Nastavte presmerovanie na vasa-firma@biznisagent.sk' },
    { id: 'products', label: 'Pridajte produkty', completed: false, description: 'Minimálne 5 produktov' },
    { id: 'customers', label: 'Pridajte zákazníkov', completed: false, description: 'Minimálne 3 zákazníkov' },
    { id: 'users', label: 'Pozvite kolegov', completed: false, description: 'Aspoň 1 ďalší používateľ' },
  ];

  const completedCount = items.filter(i => i.completed).length;
  const progress = (completedCount / items.length) * 100;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('onboarding-dismissed', 'true');
  };

  if (dismissed) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Dokončite nastavenie vášho Biznis Agenta</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {completedCount}/{items.length} dokončených
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDismiss}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-4">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                item.completed
                  ? 'bg-green-600 text-white'
                  : 'border-2 border-muted-foreground/30'
              }`}
            >
              {item.completed && <Check className="w-3 h-3" />}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                {item.label}
              </div>
              {item.description && !item.completed && (
                <div className="text-sm text-muted-foreground mt-0.5">{item.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
