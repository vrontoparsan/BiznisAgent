import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDateTime } from '@/lib/utils';
import { Settings2 } from 'lucide-react';
import { ConfigModal } from '../ConfigModal';

export function Inbox() {
  const { token } = useAuth();
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [actionOutput, setActionOutput] = useState<string | null>(null);

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

  const configSections = [
    {
      title: 'Typy akcií',
      fields: [
        { id: 'action_vytvorit_cp', label: 'Vytvoriť CP', type: 'checkbox' as const, defaultValue: true },
        { id: 'action_odpovedat', label: 'Odpovedať', type: 'checkbox' as const, defaultValue: true },
        { id: 'action_priradit_oz', label: 'Priradiť OZ', type: 'checkbox' as const, defaultValue: true },
        { id: 'action_reklamacia', label: 'Založiť reklamáciu', type: 'checkbox' as const, defaultValue: true },
        { id: 'action_doplnenie', label: 'Vyžiadať doplnenie', type: 'checkbox' as const, defaultValue: true },
        { id: 'action_eskalovat', label: 'Eskalovať', type: 'checkbox' as const, defaultValue: false },
      ],
    },
    {
      title: 'Automatizácia',
      fields: [
        { id: 'auto_priradit_oz', label: 'Automaticky priradiť OZ', type: 'toggle' as const, defaultValue: false },
        { id: 'auto_kategorizovat', label: 'Automaticky kategorizovať emaily', type: 'toggle' as const, defaultValue: true },
        { id: 'predvoleny_oz', label: 'Predvolený OZ pre nové dopyty', type: 'select' as const, options: ['Žiadny', 'Martin Novák', 'Jana Kováčová', 'Peter Horváth'], defaultValue: 'Žiadny' },
      ],
    },
  ];

  const getAIActions = (email: any) => {
    if (!email) return [];
    
    const category = email.category?.toLowerCase() || '';
    
    if (category === 'dopyt') {
      return [
        { label: 'Vytvoriť cenovú ponuku', prefix: 'Agent navrhuje:', variant: 'default', action: 'create_quote' },
        { label: 'Odpovedať s cenami a dostupnosťou', prefix: 'Agent navrhuje:', variant: 'outline', action: 'reply_availability' },
        { label: 'Vyžiadať doplňujúce informácie', prefix: 'Agent navrhuje:', variant: 'outline', action: 'request_info' },
        { label: 'Priradiť obchodnému zástupcovi', prefix: 'Agent navrhuje:', variant: 'outline', action: 'assign_rep' },
      ];
    } else if (category === 'objednavka') {
      return [
        { label: 'Potvrdenie objednávky', prefix: 'Agent vytvorí:', variant: 'default', action: 'create_confirmation' },
        { label: 'Dodací list', prefix: 'Agent vytvorí:', variant: 'outline', action: 'create_delivery' },
        { label: 'Dostupnosť na sklade', prefix: 'Agent skontroluje:', variant: 'outline', action: 'check_stock' },
      ];
    } else if (category === 'reklamacia') {
      return [
        { label: 'Reklamačný prípad', prefix: 'Agent založí:', variant: 'default', action: 'create_complaint' },
        { label: 'Odpoveď zákazníkovi', prefix: 'Agent navrhuje:', variant: 'outline', action: 'reply_complaint' },
        { label: 'Eskalovať vedeniu', prefix: 'Agent eskaluje:', variant: 'outline', action: 'escalate' },
      ];
    } else if (category === 'faktura') {
      return [
        { label: 'Zhodu s objednávkou', prefix: 'Agent skontroluje:', variant: 'default', action: 'check_invoice' },
        { label: 'Dobropis', prefix: 'Agent vytvorí:', variant: 'outline', action: 'create_credit_note' },
        { label: 'Zaúčtovanie', prefix: 'Agent navrhuje:', variant: 'outline', action: 'propose_booking' },
      ];
    }
    
    return [
      { label: 'Vytvoriť CP', prefix: 'Agent navrhuje:', variant: 'default', action: 'create_quote' },
      { label: 'Priradiť obchodníkovi', prefix: 'Agent navrhuje:', variant: 'outline', action: 'assign_rep' },
    ];
  };

  const handleAction = (action: string) => {
    setActionOutput(null);
    
    setTimeout(() => {
      let output = '';
      
      switch (action) {
        case 'create_quote':
          output = `✅ Agent vytvoril cenovú ponuku CP-2026/0047

Zákazník: TechnoStav s.r.o.
Položky:
  1. Hydraulický valec HV-200 — 5 ks × 890,00 € = 4 450,00 €
  2. Tesnenie T-45 — 20 ks × 12,50 € = 250,00 €
  3. Montážna sada MS-HV — 5 ks × 45,00 € = 225,00 €

Medzisúčet: 4 925,00 €
DPH 20%: 985,00 €
CELKOM: 5 910,00 €

Platnosť: 30 dní
Splatnosť: 14 dní`;
          break;
        
        case 'check_stock':
          output = `✅ Agent skontroloval sklad

Hydraulický valec HV-200: 12 ks skladom ✅ (požadované: 5)
Tesnenie T-45: 45 ks skladom ✅ (požadované: 20)
Montážna sada MS-HV: 3 ks skladom ⚠️ (požadované: 5, chýba 2 ks)

Agent navrhuje: Objednať 2 ks MS-HV od dodávateľa (dodanie: 3-5 dní)`;
          break;
        
        case 'reply_availability':
          output = `✅ Agent pripravil odpoveď

Vážený pán/pani,

ďakujeme za Váš dopyt. Radi Vám potvrdíme dostupnosť požadovaných položek:

• Hydraulický valec HV-200: skladom, dodanie ihneď
• Tesnenie T-45: skladom, dodanie ihneď
• Montážna sada MS-HV: čiastočne skladom, kompletné dodanie do 5 dní

Cenovú ponuku nájdete v prílohe. Platnosť ponuky je 30 dní.

S pozdravom,
Váš obchodný tím`;
          break;
        
        case 'request_info':
          output = `✅ Agent pripravil žiadosť o doplnenie

Vážený pán/pani,

ďakujeme za Váš dopyt. Pre vytvorenie presnej cenovej ponuky potrebujeme doplniť nasledovné informácie:

1. Požadované množstvá jednotlivých položiek
2. Termín dodania
3. Miesto dodania
4. Spôsob dopravy (vlastný odber / dovoz)

Prosím, doplňte tieto informácie a my Vám pripravíme cenovú ponuku do 24 hodín.

S pozdravom,
Váš obchodný tím`;
          break;
        
        case 'assign_rep':
          output = `✅ Agent priradiľ obchodného zástupcu

Dopyt pridelený: Martin Novák
Dôvod: Zákazník TechnoStav s.r.o. je v regióne Bratislava
Priorita: Vysoká (hodnota dopytu: ~5 910 €)

Agent navrhuje: Kontaktovať zákazníka do 4 hodín`;
          break;
        
        case 'create_confirmation':
          output = `✅ Agent vytvoril potvrdenie objednávky OBJ-2026/0156

Zákazník: TechnoStav s.r.o.
Dátum objednávky: ${new Date().toLocaleDateString('sk-SK')}
Číslo objednávky: OBJ-2026/0156

Položky:
  1. Hydraulický valec HV-200 — 5 ks
  2. Tesnenie T-45 — 20 ks
  3. Montážna sada MS-HV — 5 ks

Plánované dodanie: ${new Date(Date.now() + 5 * 86400000).toLocaleDateString('sk-SK')}
Stav: Potvrdené, čaká na expedíciu`;
          break;
        
        case 'create_delivery':
          output = `✅ Agent pripravil dodací list DL-2026/0234

Zákazník: TechnoStav s.r.o.
Číslo objednávky: OBJ-2026/0156
Dátum expedície: ${new Date().toLocaleDateString('sk-SK')}

Položky k expedícii:
  1. Hydraulický valec HV-200 — 5 ks ✅
  2. Tesnenie T-45 — 20 ks ✅
  3. Montážna sada MS-HV — 3 ks ⚠️ (2 ks dodané neskôr)

Agent navrhuje: Expedovať dostupné položky ihneď, zostávajúce 2 ks do 5 dní`;
          break;
        
        case 'create_complaint':
          output = `✅ Agent založil reklamačný prípad REK-2026/0012

Zákazník: TechnoStav s.r.o.
Typ reklamácie: Chybné dodanie
Priorita: Vysoká

Popis problému:
Agent rozpoznal: Dodané nesprávne množstvo položky Tesnenie T-45 (dodané 15 ks, objednané 20 ks)

Navrhované riešenie:
1. Okamžite dodať chýbajúcich 5 ks
2. Poskytnúť 10% zľavu na budúcu objednávku
3. Kontaktovať zákazníka do 2 hodín

Agent priradiľ: Reklamačné oddelenie`;
          break;
        
        case 'reply_complaint':
          output = `✅ Agent pripravil odpoveď na reklamáciu

Vážený pán/pani,

ospravedlňujeme sa za vzniknutú situáciu. Vašu reklamáciu evidujeme pod číslom REK-2026/0012.

Okamžite sme iniciovali nasledovné kroky:
1. Chýbajúcich 5 ks Tesnenie T-45 bude dodané do 24 hodín
2. Ako ospravedlnenie Vám poskytujeme 10% zľavu na budúcu objednávku
3. Náš reklamačný manažér Vás bude kontaktovať do 2 hodín

Ešte raz sa ospravedlňujeme za komplikácie.

S pozdravom,
Reklamačné oddelenie`;
          break;
        
        case 'escalate':
          output = `✅ Agent eskaloval prípad vedeniu

Eskalovaný prípad: REK-2026/0012
Dôvod eskalácie: Opakovaná reklamácia od VIP zákazníka
Eskalované na: Vedúci obchodného oddelenia

Kontext:
- Zákazník: TechnoStav s.r.o. (segment: VIP)
- 3. reklamácia za posledné 2 mesiace
- Celková hodnota objednávok: 45 000 € ročne

Agent navrhuje: Osobné stretnutie s vedením spoločnosti`;
          break;
        
        case 'check_invoice':
          output = `✅ Agent skontroloval faktúru FA-2026/0089

Číslo faktúry: FA-2026/0089
Číslo objednávky: OBJ-2026/0156

Kontrola položiek:
  Hydraulický valec HV-200: 5 ks ✅ (zhoda)
  Tesnenie T-45: 20 ks ✅ (zhoda)
  Montážna sada MS-HV: 5 ks ✅ (zhoda)

Kontrola cien: ✅ Všetky ceny zodpovedajú cenovej ponuke
Kontrola DPH: ✅ Správne vypočítané (20%)
Celková suma: ✅ Zhoda s objednávkou

Agent potvrdil: Faktúra je v poriadku, môže byť zaúčtovaná`;
          break;
        
        case 'create_credit_note':
          output = `✅ Agent vytvoril dobropis DB-2026/0015

K faktúre: FA-2026/0089
Dôvod: Vrátené poškodené položky

Položky dobropisu:
  1. Hydraulický valec HV-200 — 2 ks × 890,00 € = 1 780,00 €

Medzisúčet: 1 780,00 €
DPH 20%: 356,00 €
CELKOM: 2 136,00 €

Agent navrhuje: Vystaviť nový dobropis a zaúčtovať do 3 dní`;
          break;
        
        case 'propose_booking':
          output = `✅ Agent navrhuje zaúčtovanie

Faktúra: FA-2026/0089
Typ: Došlá faktúra
Dodávateľ: TechnoStav s.r.o.

Navrhované zaúčtovanie:
MD 501 - Spotreba materiálu: 4 925,00 €
MD 343 - DPH: 985,00 €
D 321 - Záväzky: 5 910,00 €

Splatnosť: ${new Date(Date.now() + 14 * 86400000).toLocaleDateString('sk-SK')}
Dátum zaúčtovania: ${new Date().toLocaleDateString('sk-SK')}

Agent overil: Dodávateľ je evidovaný v registri, IČO a DIČ je správne`;
          break;
        
        default:
          output = '✅ Agent spracoval akciu';
      }
      
      setActionOutput(output);
    }, 500);
  };

  const aiActions = selectedEmail ? getAIActions(selectedEmail) : [];

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
                onClick={() => {
                  setSelectedEmail(email);
                  setActionOutput(null);
                }}
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
                    {email.aiConfidence && (
                      <span className="text-muted-foreground">
                        Agent kategorizoval: {email.aiConfidence}%
                      </span>
                    )}
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
                  {selectedEmail.category && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="text-primary">Agent kategorizoval email ako:</span> {selectedEmail.category}
                    </p>
                  )}
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm whitespace-pre-wrap">{selectedEmail.body}</p>
                </div>
                
                {selectedEmail.aiExtractedData && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-primary mb-2">Agent rozpoznal:</p>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      {selectedEmail.aiExtractedData.customer && (
                        <p>Zákazník: {selectedEmail.aiExtractedData.customer}</p>
                      )}
                      {selectedEmail.aiExtractedData.items && (
                        <p>Položky: {selectedEmail.aiExtractedData.items}</p>
                      )}
                      {selectedEmail.aiExtractedData.estimatedValue && (
                        <p>Agent odhaduje hodnotu: {selectedEmail.aiExtractedData.estimatedValue}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Navrhované akcie:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfigOpen(true)}
                      className="h-8 w-8 p-0"
                    >
                      <Settings2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                  
                  {aiActions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant={action.variant as any}
                      className="w-full justify-start"
                      onClick={() => handleAction(action.action)}
                    >
                      <span className="text-muted-foreground text-xs mr-2">{action.prefix}</span>
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </div>
                
                {actionOutput && (
                  <div className="pt-4 border-t bg-muted/50 p-4 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap font-mono">{actionOutput}</pre>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">Odoslať zákazníkovi</Button>
                      <Button size="sm" variant="outline">Upraviť</Button>
                      <Button size="sm" variant="outline">Exportovať PDF</Button>
                    </div>
                  </div>
                )}
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

      <ConfigModal
        open={configOpen}
        onOpenChange={setConfigOpen}
        title="Konfigurácia AI akcií"
        sections={configSections}
        storageKey="inbox-config"
      />
    </div>
  );
}
