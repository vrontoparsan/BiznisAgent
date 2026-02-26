import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface KeyboardShortcutsProps {
  onNavigate?: (module: string) => void;
}

export function KeyboardShortcuts({ onNavigate }: KeyboardShortcutsProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key) {
        case '?':
          e.preventDefault();
          setShowModal(true);
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          onNavigate?.('inbox');
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          // Navigate to new quote
          onNavigate?.('documents');
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          // Navigate to new invoice
          onNavigate?.('documents');
          break;
        case 'Escape':
          setShowModal(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  const shortcuts = [
    { key: '?', description: 'Zobraziť túto pomoc' },
    { key: 'N', description: 'Nový email / Doručené' },
    { key: 'C', description: 'Nová cenová ponuka' },
    { key: 'F', description: 'Nová faktúra' },
    { key: '/', description: 'Vyhľadávanie' },
    { key: 'Esc', description: 'Zavrieť modálne okno' },
  ];

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <Card className="w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Klávesové skratky</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                  <kbd className="px-3 py-1 bg-muted rounded text-sm font-mono font-semibold">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button onClick={() => setShowModal(false)} variant="outline">
                Zavrieť
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
