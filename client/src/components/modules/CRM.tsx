import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Plus } from 'lucide-react';

export function CRM() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getCustomers(token, search ? { search } : {})
        .then(setCustomers)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token, search]);

  const segmentVariants: Record<string, any> = {
    vip: 'success',
    standardny: 'default',
    novy: 'warning',
    rizikovy: 'error',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Zákazníci (CRM)</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Pridať zákazníka
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Hľadať zákazníkov..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Načítavam...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{customer.companyName}</p>
                      <p className="text-sm text-muted-foreground">IČO: {customer.ico}</p>
                    </div>
                    <Badge variant={segmentVariants[customer.segment || 'standardny']}>
                      {customer.segment}
                    </Badge>
                  </div>
                  {customer.contactName && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Kontakt:</p>
                      <p>{customer.contactName}</p>
                      {customer.contactEmail && <p className="text-xs">{customer.contactEmail}</p>}
                      {customer.contactPhone && <p className="text-xs">{customer.contactPhone}</p>}
                    </div>
                  )}
                  {customer.aiScore && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">AI Skóre:</span>
                      <span className="font-medium">{customer.aiScore}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
