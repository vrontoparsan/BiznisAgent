import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Select } from '../ui/select';
import { getCurrentLanguage, setLanguage } from '@/lib/i18n';

const mockAuditLog = [
  { id: 1, date: '26.2.2026 09:15', user: 'Admin', action: 'Prihlásenie', detail: 'IP: 192.168.1.1' },
  { id: 2, date: '26.2.2026 09:20', user: 'Ján Novák', action: 'Vytvoril CP', detail: 'CP-2026/0047 pre TechnoStav' },
  { id: 3, date: '26.2.2026 09:25', user: 'Agent', action: 'Spracoval email', detail: 'Dopyt od ElektroMont s.r.o.' },
  { id: 4, date: '26.2.2026 09:30', user: 'Admin', action: 'Upravil produkt', detail: 'Kábel XY-100 - zmenená cena' },
  { id: 5, date: '26.2.2026 10:00', user: 'Agent', action: 'Vytvoril FA', detail: 'FA-2026/0024 pre BuildCorp' },
  { id: 6, date: '26.2.2026 10:15', user: 'Ján Novák', action: 'Schválil CP', detail: 'CP-2026/0046' },
  { id: 7, date: '26.2.2026 10:30', user: 'Agent', action: 'Odoslal upomienku', detail: 'FA-2026/0023 - 1. upomienka' },
  { id: 8, date: '26.2.2026 11:00', user: 'Admin', action: 'Pridaný používateľ', detail: 'Peter Horváth' },
  { id: 9, date: '26.2.2026 11:30', user: 'Agent', action: 'Rozpoznal zákazníka', detail: 'ElektroMont a.s. z emailu' },
  { id: 10, date: '26.2.2026 12:00', user: 'Ján Novák', action: 'Export dokladov', detail: 'CSV - 50 záznamov' },
  { id: 11, date: '26.2.2026 12:30', user: 'Agent', action: 'Skontroloval sklad', detail: 'Produkt HV-200 - nízky stav' },
  { id: 12, date: '26.2.2026 13:00', user: 'Admin', action: 'Zmena nastavení', detail: 'Aktualizovaná šablóna CP' },
  { id: 13, date: '26.2.2026 13:30', user: 'Agent', action: 'Vytvoril objednávku', detail: 'OBJ-2026/0018' },
  { id: 14, date: '26.2.2026 14:00', user: 'Ján Novák', action: 'Odhlásenie', detail: 'IP: 192.168.1.1' },
  { id: 15, date: '26.2.2026 14:15', user: 'Agent', action: 'Eskaloval reklamáciu', detail: 'REK-2026/0012 - VIP zákazník' },
];

export function Settings() {
  const { token, user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [auditFilter, setAuditFilter] = useState('all');
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  useEffect(() => {
    if (token) {
      api.getCompany(token).then(setCompany).catch(console.error);
      api.getUsers(token).then(setUsers).catch(console.error);
    }
  }, [token]);

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Nastavenia</h1>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Firma</TabsTrigger>
          <TabsTrigger value="users">Používatelia</TabsTrigger>
          <TabsTrigger value="integrations">Integrácie</TabsTrigger>
          <TabsTrigger value="templates">Šablóny</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Údaje firmy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Názov firmy</Label>
                  <Input defaultValue={company?.name} />
                </div>
                <div>
                  <Label>IČO</Label>
                  <Input defaultValue={company?.ico} />
                </div>
                <div>
                  <Label>DIČ</Label>
                  <Input defaultValue={company?.dic} />
                </div>
                <div>
                  <Label>IČ DPH</Label>
                  <Input defaultValue={company?.icDph} />
                </div>
                <div className="col-span-2">
                  <Label>Adresa</Label>
                  <Input defaultValue={company?.address} />
                </div>
                <div className="col-span-2">
                  <Label>IBAN</Label>
                  <Input defaultValue={company?.iban} />
                </div>
                <div>
                  <Label>Jazyk</Label>
                  <Select
                    value={currentLang}
                    onChange={(e) => {
                      setLanguage(e.target.value as any);
                      setCurrentLang(e.target.value as any);
                    }}
                  >
                    <option value="sk">🇸🇰 Slovenčina</option>
                    <option value="cz">🇨🇿 Čeština</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="de">🇩🇪 Deutsch</option>
                  </Select>
                </div>
              </div>
              <Button>Uložiť zmeny</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Používatelia</CardTitle>
                <Button size="sm">Pridať používateľa</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="flex justify-between items-center p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrácie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email forwarding adresa</Label>
                <Input defaultValue={company?.settingsJson?.emailForwarding || ''} disabled />
                <p className="text-xs text-muted-foreground mt-1">
                  Presmerujte emaily na túto adresu pre automatické spracovanie
                </p>
              </div>
              <div>
                <Label>Revolut Business API kľúč</Label>
                <Input type="password" placeholder="Zadajte API kľúč" />
                <p className="text-xs text-muted-foreground mt-1">
                  Prepojte Revolut Business účet pre automatickú identifikáciu platieb
                </p>
              </div>
              <Button>Uložiť</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Šablóny dokumentov</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Funkcia šablón bude dostupná v budúcej verzii
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Audit log</CardTitle>
                <div className="flex gap-2">
                  <Select 
                    value={auditFilter} 
                    onChange={(e) => setAuditFilter(e.target.value)}
                    className="w-40"
                  >
                    <option value="all">Všetky akcie</option>
                    <option value="admin">Len Admin</option>
                    <option value="agent">Len Agent</option>
                    <option value="users">Len používatelia</option>
                  </Select>
                  <Button variant="outline" size="sm">Exportovať CSV</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Dátum</th>
                      <th className="text-left py-3 px-4">Používateľ</th>
                      <th className="text-left py-3 px-4">Akcia</th>
                      <th className="text-left py-3 px-4">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAuditLog
                      .filter(log => {
                        if (auditFilter === 'all') return true;
                        if (auditFilter === 'admin') return log.user === 'Admin';
                        if (auditFilter === 'agent') return log.user === 'Agent';
                        if (auditFilter === 'users') return log.user !== 'Admin' && log.user !== 'Agent';
                        return true;
                      })
                      .map(log => (
                        <tr key={log.id} className="border-b hover:bg-accent/50 transition-colors">
                          <td className="py-3 px-4 text-muted-foreground">{log.date}</td>
                          <td className="py-3 px-4">
                            <Badge variant={log.user === 'Agent' ? 'default' : 'outline'}>
                              {log.user}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-medium">{log.action}</td>
                          <td className="py-3 px-4 text-muted-foreground">{log.detail}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
