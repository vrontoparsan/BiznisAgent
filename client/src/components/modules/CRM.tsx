import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Plus, Settings2 } from 'lucide-react';
import { ConfigModal } from '../ConfigModal';

export function CRM() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (token) {
      api.getCustomers(token, search ? { search } : {})
        .then(setCustomers)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token, search]);

  useEffect(() => {
    const saved = localStorage.getItem('crm-config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    } else {
      setConfig({
        col_ico: true,
        col_nazov: true,
        col_kontakt: true,
        col_email: true,
        col_telefon: true,
        col_segment: true,
        col_ai_score: true,
        col_adresa: false,
      });
    }
  }, []);

  const segmentVariants: Record<string, any> = {
    vip: 'success',
    standardny: 'default',
    novy: 'warning',
    rizikovy: 'error',
  };

  const configSections = [
    {
      title: 'Zobrazované stĺpce',
      fields: [
        { id: 'col_ico', label: 'IČO', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_nazov', label: 'Názov spoločnosti', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_kontakt', label: 'Kontaktná osoba', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_email', label: 'Email', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_telefon', label: 'Telefón', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_segment', label: 'Segment', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_ai_score', label: 'AI Skóre', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_adresa', label: 'Adresa', type: 'checkbox' as const, defaultValue: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Zákazníci (CRM)</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfigOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Settings2 className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
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
                      {config.col_ico && (
                        <p className="text-sm text-muted-foreground">IČO: {customer.ico}</p>
                      )}
                    </div>
                    {config.col_segment && (
                      <Badge variant={segmentVariants[customer.segment || 'standardny']}>
                        {customer.segment}
                      </Badge>
                    )}
                  </div>
                  {config.col_kontakt && customer.contactName && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Kontakt:</p>
                      <p>{customer.contactName}</p>
                      {config.col_email && customer.contactEmail && (
                        <p className="text-xs">{customer.contactEmail}</p>
                      )}
                      {config.col_telefon && customer.contactPhone && (
                        <p className="text-xs">{customer.contactPhone}</p>
                      )}
                    </div>
                  )}
                  {config.col_adresa && customer.address && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Adresa:</p>
                      <p className="text-xs">{customer.address}</p>
                    </div>
                  )}
                  {config.col_ai_score && customer.aiScore && (
                    <div className="flex justify-between items-center text-xs pt-2 border-t">
                      <span className="text-muted-foreground">
                        <span className="text-primary">Agent odhaduje:</span> Potenciál spolupráce
                      </span>
                      <span className="font-medium">{customer.aiScore}%</span>
                    </div>
                  )}
                  
                  {/* Smart Insights */}
                  {customer.id % 3 === 0 && (
                    <div className="pt-2 border-t">
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 mb-2">
                        📉 Agent si všimol: objednávky klesli o 35% oproti minulému kvartálu
                      </Badge>
                    </div>
                  )}
                  {customer.id % 3 === 1 && (
                    <div className="pt-2 border-t">
                      <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 mb-2">
                        ⚠️ Posledná objednávka pred 45 dňami — navrhuje kontaktovať
                      </Badge>
                    </div>
                  )}
                  {customer.id % 3 === 2 && customer.segment === 'vip' && (
                    <div className="pt-2 border-t">
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 mb-2">
                        ⭐ VIP zákazník — 23 objednávok za posledný rok
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfigModal
        open={configOpen}
        onOpenChange={setConfigOpen}
        title="Konfigurácia zobrazenia zákazníkov"
        sections={configSections}
        storageKey="crm-config"
        onSave={setConfig}
      />
    </div>
  );
}
