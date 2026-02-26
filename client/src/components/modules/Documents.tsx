import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Settings2, List, Kanban as KanbanIcon, FileText, X } from 'lucide-react';
import { ConfigModal } from '../ConfigModal';

export function Documents() {
  const { token } = useAuth();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [quotesConfigOpen, setQuotesConfigOpen] = useState(false);
  const [invoicesConfigOpen, setInvoicesConfigOpen] = useState(false);
  const [ordersConfigOpen, setOrdersConfigOpen] = useState(false);
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<Set<number>>(new Set());
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [pdfPreview, setPdfPreview] = useState<any>(null);

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
    nova: 'default',
    potvrdena: 'default',
    v_priprave: 'warning',
    expedovana: 'success',
    dorucena: 'success',
  };

  const toggleQuoteSelection = (id: number) => {
    const newSelected = new Set(selectedQuoteIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedQuoteIds(newSelected);
  };

  const toggleInvoiceSelection = (id: number) => {
    const newSelected = new Set(selectedInvoiceIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedInvoiceIds(newSelected);
  };

  const handleBulkQuoteAction = (action: string) => {
    alert(`Akcia pre ${selectedQuoteIds.size} ponúk: ${action}`);
    setSelectedQuoteIds(new Set());
  };

  const handleBulkInvoiceAction = (action: string) => {
    alert(`Akcia pre ${selectedInvoiceIds.size} faktúr: ${action}`);
    setSelectedInvoiceIds(new Set());
  };

  const getDaysSinceQuote = (date: string) => {
    const quoteDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - quoteDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  const renderKanbanView = () => {
    const statuses = ['nova', 'potvrdena', 'v_priprave', 'expedovana', 'dorucena'];
    const statusLabels: Record<string, string> = {
      nova: 'Nová',
      potvrdena: 'Potvrdená',
      v_priprave: 'V príprave',
      expedovana: 'Expedovaná',
      dorucena: 'Doručená',
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statuses.map(status => (
          <div key={status} className="space-y-3">
            <div className="font-semibold text-sm text-muted-foreground">
              {statusLabels[status]}
              <span className="ml-2 text-xs">
                ({orders.filter(o => o.status === status).length})
              </span>
            </div>
            <div className="space-y-2">
              {orders
                .filter(o => o.status === status)
                .map(order => (
                  <Card 
                    key={order.id} 
                    className="cursor-move hover:shadow-md transition-shadow border-l-4"
                    style={{
                      borderLeftColor: 
                        status === 'nova' ? '#3b82f6' :
                        status === 'potvrdena' ? '#8b5cf6' :
                        status === 'v_priprave' ? '#f59e0b' :
                        status === 'expedovana' ? '#10b981' :
                        '#059669'
                    }}
                  >
                    <CardContent className="p-3">
                      <p className="font-medium text-sm">{order.number}</p>
                      <p className="text-xs text-muted-foreground mt-1">{order.customerName}</p>
                      <p className="text-sm font-semibold mt-2">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(order.createdAt)}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPDFPreview = () => {
    if (!pdfPreview) return null;

    const isQuote = pdfPreview.type === 'quote';
    const docType = isQuote ? 'CENOVÁ PONUKA' : 'FAKTÚRA';

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPdfPreview(null)}>
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Náhľad PDF</h2>
              <button onClick={() => setPdfPreview(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* PDF Preview Content */}
            <div className="bg-white text-black p-8 rounded border">
              {/* Header */}
              <div className="flex justify-between mb-8">
                <div>
                  <div className="w-16 h-16 bg-blue-600 rounded mb-2 flex items-center justify-center text-white font-bold">
                    LOGO
                  </div>
                  <h3 className="font-bold">Functu s.r.o.</h3>
                  <p className="text-sm">Bratislava, 81101</p>
                  <p className="text-sm">IČO: 12345678</p>
                  <p className="text-sm">DIČ: 1234567890</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold mb-2">{docType}</h2>
                  <p className="text-sm">Číslo: {pdfPreview.number}</p>
                  <p className="text-sm">Dátum: {formatDate(new Date())}</p>
                  {!isQuote && <p className="text-sm">Splatnosť: {formatDate(pdfPreview.dueDate)}</p>}
                </div>
              </div>

              {/* Customer */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Odberateľ:</h4>
                <p>{pdfPreview.customerName}</p>
                <p className="text-sm">IČO: 87654321</p>
              </div>

              {/* Items */}
              <table className="w-full mb-6 text-sm">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-2">Položka</th>
                    <th className="text-center py-2">Mn.</th>
                    <th className="text-right py-2">Cena</th>
                    <th className="text-right py-2">Spolu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Hydraulický valec HV-200</td>
                    <td className="text-center">5</td>
                    <td className="text-right">890,00 €</td>
                    <td className="text-right">4 450,00 €</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Tesnenie T-45</td>
                    <td className="text-center">20</td>
                    <td className="text-right">12,50 €</td>
                    <td className="text-right">250,00 €</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Montážna sada MS-HV</td>
                    <td className="text-center">5</td>
                    <td className="text-right">45,00 €</td>
                    <td className="text-right">225,00 €</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-6">
                <div className="w-64">
                  <div className="flex justify-between py-1">
                    <span>Medzisúčet:</span>
                    <span>4 925,00 €</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>DPH 20%:</span>
                    <span>985,00 €</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-black font-bold text-lg">
                    <span>CELKOM:</span>
                    <span>{formatCurrency(pdfPreview.total)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">Platobné údaje:</p>
                    <p>IBAN: SK00 0000 0000 0000 0000</p>
                    <p>VS: {pdfPreview.number.replace(/[^0-9]/g, '')}</p>
                  </div>
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs">
                    QR kód
                  </div>
                </div>
                {isQuote && (
                  <p className="mt-4 text-xs text-gray-600">
                    Platnosť ponuky: 30 dní od dátumu vystavenia
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button>Stiahnuť PDF</Button>
              <Button variant="outline">Odoslať emailom</Button>
              <Button variant="outline" onClick={() => setPdfPreview(null)}>Zavrieť</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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

            {selectedQuoteIds.size > 0 && (
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">Vybrané: {selectedQuoteIds.size}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleBulkQuoteAction('export')}>
                      Exportovať
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkQuoteAction('send')}>
                      Odoslať
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {quotes.map((quote) => {
              const daysSince = getDaysSinceQuote(quote.createdAt);
              const needsFollowUp = daysSince > 5 && quote.status === 'odoslana';

              return (
                <Card key={quote.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <input
                        type="checkbox"
                        checked={selectedQuoteIds.has(quote.id)}
                        onChange={() => toggleQuoteSelection(quote.id)}
                        className="w-4 h-4 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
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
                            {needsFollowUp && (
                              <Badge variant="outline" className="mt-2 text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                                ⏰ Bez odpovede {daysSince} dní
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(quote.total)}</p>
                            <Badge variant={statusVariants[quote.status]}>{quote.status}</Badge>
                          </div>
                        </div>
                        {needsFollowUp && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => alert('Agent pripravil follow-up email')}
                          >
                            Agent navrhuje: Odoslať follow-up email
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="mt-2"
                          onClick={() => setPdfPreview({ ...quote, type: 'quote' })}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Náhľad PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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

            {selectedInvoiceIds.size > 0 && (
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">Vybrané: {selectedInvoiceIds.size}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleBulkInvoiceAction('export')}>
                      Exportovať
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkInvoiceAction('reminders')}>
                      Odoslať upomienky
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkInvoiceAction('mark_paid')}>
                      Označiť zaplatené
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={selectedInvoiceIds.has(invoice.id)}
                      onChange={() => toggleInvoiceSelection(invoice.id)}
                      className="w-4 h-4 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
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
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="mt-2"
                        onClick={() => setPdfPreview({ ...invoice, type: 'invoice' })}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Náhľad PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {orders.length} objednávok
              </p>
              <div className="flex gap-2 items-center">
                <div className="flex gap-1 bg-muted rounded p-1">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4 mr-1" />
                    Zoznam
                  </Button>
                  <Button
                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                  >
                    <KanbanIcon className="w-4 h-4 mr-1" />
                    Kanban
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOrdersConfigOpen(true)}
                  className="h-8 w-8 p-0"
                >
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {viewMode === 'list' ? (
              <div className="space-y-2">
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
                          <Badge variant={statusVariants[order.status]}>{order.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              renderKanbanView()
            )}
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

      {renderPDFPreview()}
    </div>
  );
}
