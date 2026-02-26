import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Mail, FileText, DollarSign, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const { token } = useAuth();
  const [kpi, setKpi] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getKPI(token)
        .then(setKpi)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return <div className="text-center py-12">Načítavam...</div>;
  }

  const kpiCards = [
    {
      title: 'Dopyty dnes',
      value: kpi?.inquiriesToday || 0,
      icon: Mail,
      color: 'text-blue-600',
    },
    {
      title: 'CP tento mesiac',
      value: kpi?.quotesThisMonth || 0,
      icon: FileText,
      color: 'text-green-600',
    },
    {
      title: 'Obrat tento mesiac',
      value: formatCurrency(kpi?.revenueThisMonth || 0),
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Neuhradené faktúry',
      value: `${kpi?.overdueInvoices?.count || 0} (${formatCurrency(kpi?.overdueInvoices?.total || 0)})`,
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Prehľad</h1>
        <p className="text-muted-foreground mt-1">Prehľad vašich obchodných aktivít</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Posledné aktivity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Žiadne nové aktivity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rýchle akcie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent text-sm">
                Nová cenová ponuka
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent text-sm">
                Pridať produkt
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent text-sm">
                Pridať zákazníka
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
