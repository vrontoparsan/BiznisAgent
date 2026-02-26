import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDateTime } from '@/lib/utils';

export function Inbox() {
  const { token } = useAuth();
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const params = filter !== 'all' ? { filter } : {};
      api.getEmails(token, params)
        .then(setEmails)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token, filter]);

  const categoryColors: Record<string, any> = {
    dopyt: 'default',
    objednavka: 'success',
    reklamacia: 'error',
    faktura: 'warning',
    ine: 'default',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Doručené</h1>
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
            Všetky
          </Button>
          <Button variant={filter === 'nove' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('nove')}>
            Nové
          </Button>
          <Button variant={filter === 'spracovane' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('spracovane')}>
            Spracované
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Načítavam...</p>
          ) : emails.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Žiadne emaily</p>
          ) : (
            emails.map((email) => (
              <Card
                key={email.id}
                className={`cursor-pointer transition-colors ${
                  selectedEmail?.id === email.id ? 'ring-2 ring-primary' : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedEmail(email)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{email.fromCompany || email.from}</p>
                      <p className="text-sm text-muted-foreground truncate">{email.subject}</p>
                    </div>
                    {email.category && (
                      <Badge variant={categoryColors[email.category] || 'default'} className="ml-2 shrink-0">
                        {email.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{formatDateTime(email.receivedAt)}</span>
                    {email.aiConfidence && <span>AI: {email.aiConfidence}%</span>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div>
          {selectedEmail ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedEmail.subject}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Od: {selectedEmail.fromCompany || selectedEmail.from}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(selectedEmail.receivedAt)}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm whitespace-pre-wrap">{selectedEmail.body}</p>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <Button className="w-full">Vytvoriť CP</Button>
                  <Button variant="outline" className="w-full">Priradiť obchodníkovi</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                Vyberte email pre zobrazenie detailov
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
