import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Mail, FileText, DollarSign, AlertCircle, Settings2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ConfigModal } from '../ConfigModal';

export function Dashboard() {
  const { token } = useAuth();
  const [kpi, setKpi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (token) {
      api.getKPI(token)
        .then(setKpi)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  useEffect(() => {
    const saved = localStorage.getItem('dashboard-config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    } else {
      setConfig({
        kpi_dopyty: true,
        kpi_cp: true,
        kpi_obrat: true,
        kpi_faktury: true,
        chart_aktivita: true,
        chart_akcie: true,
      });
    }
  }, []);

  const configSections = [
    {
      title: 'KPI karty',
      fields: [
        { id: 'kpi_dopyty', label: 'Dopyty dnes', type: 'checkbox' as const, defaultValue: true },
        { id: 'kpi_cp', label: 'CP tento mesiac', type: 'checkbox' as const, defaultValue: true },
        { id: 'kpi_obrat', label: 'Obrat tento mesiac', type: 'checkbox' as const, defaultValue: true },
        { id: 'kpi_faktury', label: 'Neuhradené faktúry', type: 'checkbox' as const, defaultValue: true },
      ],
    },
    {
      title: 'Grafy a prehľady',
      fields: [
        { id: 'chart_aktivita', label: 'Posledné aktivity', type: 'checkbox' as const, defaultValue: true },
        { id: 'chart_akcie', label: 'Rýchle akcie', type: 'checkbox' as const, defaultValue: true },
      ],
    },
  ];

  if (loading) {
    return <div className="text-center py-12">Načítavam...</div>;
  }

  const kpiCards = [
    {
      id: 'kpi_dopyty',
      title: 'Dopyty dnes',
      value: kpi?.inquiriesToday || 0,
      icon: Mail,
      color: 'text-blue-600',
      agentNote: 'Agent rozpoznal kategóriu',
    },
    {
      id: 'kpi_cp',
      title: 'CP tento mesiac',
      value: kpi?.quotesThisMonth || 0,
      icon: FileText,
      color: 'text-green-600',
      agentNote: 'Agent vytvoril',
    },
    {
      id: 'kpi_obrat',
      title: 'Obrat tento mesiac',
      value: formatCurrency(kpi?.revenueThisMonth || 0),
      icon: TrendingUp,
      color: 'text-purple-600',
      agentNote: 'Agent predikuje trend',
      prediction: '+12% vs predch. mesiac',
    },
    {
      id: 'kpi_faktury',
      title: 'Neuhradené faktúry',
      value: `${kpi?.overdueInvoices?.count || 0} (${formatCurrency(kpi?.overdueInvoices?.total || 0)})`,
      icon: AlertCircle,
      color: 'text-red-600',
      agentNote: 'Agent navrhuje upomienky',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Prehľad</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfigOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Settings2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-1">Prehľad vašich obchodných aktivít</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.filter(card => config[card.id]).map((card) => (
          <Card key={card.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.agentNote && (
                <p className="text-xs text-primary mt-2">{card.agentNote}</p>
              )}
              {card.prediction && (
                <p className="text-xs text-muted-foreground mt-1">{card.prediction}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {config.chart_aktivita && (
          <Card>
            <CardHeader>
              <CardTitle>Posledné aktivity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div className="flex-1">
                    <p className="font-medium">
                      <span className="text-primary">Agent vytvoril</span> cenovú ponuku CP-2026/0047
                    </p>
                    <p className="text-xs text-muted-foreground">Pre TechnoStav s.r.o. • pred 15 min</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                  <div className="flex-1">
                    <p className="font-medium">
                      <span className="text-primary">Agent rozpoznal</span> nový dopyt
                    </p>
                    <p className="text-xs text-muted-foreground">Od BuildCom s.r.o. • pred 1 hod</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5" />
                  <div className="flex-1">
                    <p className="font-medium">
                      <span className="text-primary">Agent priradiľ</span> obchodnému zástupcovi
                    </p>
                    <p className="text-xs text-muted-foreground">Martin Novák • pred 2 hod</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5" />
                  <div className="flex-1">
                    <p className="font-medium">
                      <span className="text-primary">Agent skontroloval</span> faktúru FA-2026/0088
                    </p>
                    <p className="text-xs text-muted-foreground">Všetko v poriadku ✓ • pred 3 hod</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {config.chart_akcie && (
          <Card>
            <CardHeader>
              <CardTitle>Rýchle akcie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent text-sm transition-colors flex items-center justify-between group">
                  <span>Nová cenová ponuka</span>
                  <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Agent pomôže →
                  </span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent text-sm transition-colors flex items-center justify-between group">
                  <span>Pridať produkt</span>
                  <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Agent extrahuje údaje →
                  </span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent text-sm transition-colors flex items-center justify-between group">
                  <span>Pridať zákazníka</span>
                  <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Agent overí IČO →
                  </span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent text-sm transition-colors flex items-center justify-between group">
                  <span>Spracovať dopyty</span>
                  <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Agent kategorizuje →
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ConfigModal
        open={configOpen}
        onOpenChange={setConfigOpen}
        title="Konfigurácia prehľadu"
        sections={configSections}
        storageKey="dashboard-config"
        onSave={setConfig}
      />
    </div>
  );
}
