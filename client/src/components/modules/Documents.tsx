import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Settings2 } from 'lucide-react';
import { ConfigModal } from '../ConfigModal';

export function Documents() {
  const { token } = useAuth();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [quotesConfigOpen, setQuotesConfigOpen] = useState(false);
  const [invoicesConfigOpen, setInvoicesConfigOpen] = useState(false);
  const [ordersConfigOpen, setOrdersConfigOpen] = useState(false);

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

  const quotesConfigSections = [
    {
      title: 'Rozpoznávané polia',
      fields: [
        { id: 'field_zakaznik', label: 'Zákazník', type: 'checkbox' as const, required: true, defaultValue: true },
        { id: 'field_polozky', label: 'Položky a množstvá', type: 'checkbox' as const, required: true, defaultValue: true },
        { id: 'field_termin', label: 'Požadovaný termín dodania', type: 'checkbox' as const, defaultValue: true },
        { id: 'field_doprava', label: 'Spôsob dopravy', type: 'checkbox' as const, defaultValue: false },
        { id: 'field_platba', label: 'Platobné podmienky', type: 'checkbox' as const, defaultValue: true },
        { id: 'field_zlava', label: 'Zľava', type: 'checkbox' as const, defaultValue: false },
      ],
    },
    {
      title: 'Šablóna CP',
      fields: [
        { id: 'template_hlavicka', label: 'Hlavička firmy', type: 'checkbox' as const, defaultValue: true },
        { id: 'template_qr', label: 'QR kód na platbu', type: 'checkbox' as const, defaultValue: true },
        { id: 'template_podmienky', label: 'Podmienky dodania', type: 'checkbox' as const, defaultValue: true },
        { id: 'template_platnost', label: 'Platnosť ponuky (dni)', type: 'number' as const, defaultValue: 30 },
      ],
    },
  ];

  const invoicesConfigSections = [
    {
      title: 'Povinné polia',
      fields: [
        { id: 'field_cislo', label: 'Číslo FA', type: 'checkbox' as const, required: true, defaultValue: true },
        { id: 'field_zakaznik', label: 'Zákazník', type: 'checkbox' as const, required: true, defaultValue: true },
        { id: 'field_polozky', label: 'Položky', type: 'checkbox' as const, required: true, defaultValue: true },
        { id: 'field_dph', label: 'DPH', type: 'checkbox' as const, required: true, defaultValue: true },
        { id: 'field_splatnost', label: 'Splatnosť', type: 'checkbox' as const, required: true, defaultValue: true },
      ],
    },
    {
      title: 'Automatické upomienky',
      fields: [
        { id: 'reminder_enabled', label: 'Povoliť automatické upomienky', type: 'toggle' as const, defaultValue: true },
        { id: 'reminder_day1', label: '1. upomienka (deň po splatnosti)', type: 'number' as const, defaultValue: 1 },
        { id: 'reminder_day7', label: '2. upomienka (deň po splatnosti)', type: 'number' as const, defaultValue: 7 },
        { id: 'reminder_day14', label: '3. upomienka (deň po splatnosti)', type: 'number' as const, defaultValue: 14 },
      ],
    },
    {
      title: 'Číslovanie',
      fields: [
        { id: 'numbering_prefix', label: 'Prefix', type: 'input' as const, defaultValue: 'FA-2026/' },
        { id: 'numbering_auto', label: 'Auto-increment', type: 'toggle' as const, defaultValue: true },
      ],
    },
    {
      title: 'Predvolená splatnosť',
      fields: [
        { id: 'default_due', label: 'Splatnosť (dní)', type: 'select' as const, options: ['14', '30', '60'], defaultValue: '14' },
      ],
    },
  ];

  const ordersConfigSections = [
    {
      title: 'Zobrazované stĺpce',
      fields: [
        { id: 'col_cislo', label: 'Číslo objednávky', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_zakaznik', label: 'Zákazník', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_datum', label: 'Dátum', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_hodnota', label: 'Hodnota', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_stav', label: 'Stav', type: 'checkbox' as const, defaultValue: true },
      ],
    },
  ];

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
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {quotes.length} cenových ponúk
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuotesConfigOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Settings2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
            
            {quotes.map((quote) => (
              <Card key={quote.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{quote.number}</p>
                      <p className="text-sm text-muted-foreground">
                        {quote.customerName}
                      </p>
                      {quote.aiGenerated && (
                        <p className="text-xs text-primary mt-1">
                          Agent vytvoril cenovú ponuku
                        </p>
                      )}
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
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {invoices.length} faktúr
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInvoicesConfigOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Settings2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
            
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{invoice.number}</p>
                      <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        Splatnosť: {formatDate(invoice.dueDate)}
                      </p>
                      {invoice.aiVerified && (
                        <p className="text-xs text-primary mt-1">
                          Agent skontroloval faktúru ✓
                        </p>
                      )}
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
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {orders.length} objednávok
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOrdersConfigOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Settings2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
            
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{order.number}</p>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      {order.aiProcessed && (
                        <p className="text-xs text-primary mt-1">
                          Agent spracoval objednávku
                        </p>
                      )}
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

      <ConfigModal
        open={quotesConfigOpen}
        onOpenChange={setQuotesConfigOpen}
        title="Konfigurácia cenových ponúk"
        sections={quotesConfigSections}
        storageKey="quotes-config"
      />

      <ConfigModal
        open={invoicesConfigOpen}
        onOpenChange={setInvoicesConfigOpen}
        title="Konfigurácia faktúr"
        sections={invoicesConfigSections}
        storageKey="invoices-config"
      />

      <ConfigModal
        open={ordersConfigOpen}
        onOpenChange={setOrdersConfigOpen}
        title="Konfigurácia objednávok"
        sections={ordersConfigSections}
        storageKey="orders-config"
      />
    </div>
  );
}
