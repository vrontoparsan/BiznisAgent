import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDate, formatCurrency } from '@/lib/utils';

export function Documents() {
  const { token } = useAuth();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      api.getQuotes(token).then(setQuotes).catch(console.error);
      api.getInvoices(token).then(setInvoices).catch(console.error);
      api.getOrders(token).then(setOrders).catch(console.error);
    }
  }, [token]);

  const statusVariants: Record<string, any> = {
    odoslana: 'default',
    schvalena: 'success',
    zamietnuta: 'error',
    expirovana: 'warning',
    vystavena: 'default',
    zaplatena: 'success',
    po_splatnosti: 'error',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Doklady</h1>
        <Button>Nový dokument</Button>
      </div>

      <Tabs defaultValue="quotes">
        <TabsList>
          <TabsTrigger value="quotes">Cenové ponuky</TabsTrigger>
          <TabsTrigger value="invoices">Faktúry</TabsTrigger>
          <TabsTrigger value="orders">Objednávky</TabsTrigger>
          <TabsTrigger value="delivery">Dodacie listy</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <div className="space-y-3">
            {quotes.map((quote) => (
              <Card key={quote.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{quote.number}</p>
                      <p className="text-sm text-muted-foreground">{quote.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(quote.total)}</p>
                      <Badge variant={statusVariants[quote.status]}>{quote.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{invoice.number}</p>
                      <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                      <p className="text-xs text-muted-foreground">Splatnosť: {formatDate(invoice.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(invoice.total)}</p>
                      <Badge variant={statusVariants[invoice.status]}>{invoice.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{order.number}</p>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(order.total)}</p>
                      <Badge>{order.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="delivery">
          <p className="text-center py-8 text-muted-foreground">Žiadne dodacie listy</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
