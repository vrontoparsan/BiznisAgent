import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Search, 
  Eye, 
  Ban, 
  Trash2,
  Edit,
  DollarSign,
  Mail,
  FileText,
  Database,
  Settings as SettingsIcon,
  Activity,
  UserPlus,
  CreditCard,
  Shield
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface Company {
  id: number;
  name: string;
  ico: string;
  plan: 'Štart' | 'Pro' | 'Enterprise';
  status: 'trial' | 'active' | 'suspended';
  users: number;
  emailsProcessed: number;
  createdAt: string;
  trialDaysRemaining?: number;
  subscriptionStart?: string;
  nextBilling?: string;
  mrr: number;
}

interface CompanyUser {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: 'active' | 'disabled';
}

// Mock data for companies
const generateMockCompanies = (): Company[] => [
  {
    id: 1,
    name: 'TechnoStav s.r.o.',
    ico: '12345678',
    plan: 'Pro',
    status: 'active',
    users: 4,
    emailsProcessed: 450,
    createdAt: '2025-11-15T09:00:00Z',
    subscriptionStart: '2025-11-15T09:00:00Z',
    nextBilling: '2026-03-15T09:00:00Z',
    mrr: 79
  },
  {
    id: 2,
    name: 'ElektroMont s.r.o.',
    ico: '23456789',
    plan: 'Štart',
    status: 'trial',
    users: 1,
    emailsProcessed: 87,
    createdAt: '2026-02-19T10:30:00Z',
    trialDaysRemaining: 7,
    mrr: 0
  },
  {
    id: 3,
    name: 'StavbyPlus a.s.',
    ico: '34567890',
    plan: 'Enterprise',
    status: 'active',
    users: 12,
    emailsProcessed: 2100,
    createdAt: '2025-09-01T08:00:00Z',
    subscriptionStart: '2025-09-01T08:00:00Z',
    nextBilling: '2026-03-01T08:00:00Z',
    mrr: 199
  },
  {
    id: 4,
    name: 'KábelPro s.r.o.',
    ico: '45678901',
    plan: 'Pro',
    status: 'active',
    users: 3,
    emailsProcessed: 280,
    createdAt: '2025-12-10T11:00:00Z',
    subscriptionStart: '2025-12-10T11:00:00Z',
    nextBilling: '2026-03-10T11:00:00Z',
    mrr: 79
  },
  {
    id: 5,
    name: 'MegaBuild s.r.o.',
    ico: '56789012',
    plan: 'Štart',
    status: 'suspended',
    users: 1,
    emailsProcessed: 45,
    createdAt: '2026-01-05T14:00:00Z',
    trialDaysRemaining: -7,
    mrr: 0
  }
];

const mockCompanyUsers: Record<number, CompanyUser[]> = {
  1: [
    { id: 1, name: 'Ján Kováč', email: 'jan.kovac@technostav.sk', role: 'Admin', lastLogin: '2026-02-26T16:30:00Z', status: 'active' },
    { id: 2, name: 'Mária Nová', email: 'maria.nova@technostav.sk', role: 'User', lastLogin: '2026-02-26T14:20:00Z', status: 'active' },
    { id: 3, name: 'Peter Horák', email: 'peter.horak@technostav.sk', role: 'User', lastLogin: '2026-02-25T11:15:00Z', status: 'active' },
    { id: 4, name: 'Eva Malá', email: 'eva.mala@technostav.sk', role: 'User', lastLogin: '2026-02-24T09:00:00Z', status: 'active' }
  ],
  2: [
    { id: 5, name: 'Tomáš Elektrický', email: 'tomas@elektromont.sk', role: 'Admin', lastLogin: '2026-02-26T17:00:00Z', status: 'active' }
  ],
  3: [
    { id: 6, name: 'Martin Staviteľ', email: 'martin@stavbyplus.sk', role: 'Admin', lastLogin: '2026-02-26T15:45:00Z', status: 'active' },
    { id: 7, name: 'Jana Projektová', email: 'jana@stavbyplus.sk', role: 'Manager', lastLogin: '2026-02-26T16:00:00Z', status: 'active' },
  ],
  4: [
    { id: 8, name: 'Karol Káblový', email: 'karol@kabelpro.sk', role: 'Admin', lastLogin: '2026-02-26T13:30:00Z', status: 'active' },
    { id: 9, name: 'Zuzana Technik', email: 'zuzana@kabelpro.sk', role: 'User', lastLogin: '2026-02-25T10:00:00Z', status: 'active' },
    { id: 10, name: 'Michal Obchod', email: 'michal@kabelpro.sk', role: 'User', lastLogin: '2026-02-24T14:30:00Z', status: 'active' }
  ],
  5: [
    { id: 11, name: 'Juraj Mega', email: 'juraj@megabuild.sk', role: 'Admin', lastLogin: '2026-02-12T09:00:00Z', status: 'disabled' }
  ]
};

const planPricing = {
  'Štart': 0,
  'Pro': 79,
  'Enterprise': 199
};

export function SuperAdmin() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [companyNotes, setCompanyNotes] = useState<Record<number, string>>({});

  useEffect(() => {
    setCompanies(generateMockCompanies());
    const savedNotes = localStorage.getItem('superadmin-company-notes');
    if (savedNotes) {
      try {
        setCompanyNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to load notes:', e);
      }
    }
  }, []);

  const saveNotes = (companyId: number, notes: string) => {
    const updated = { ...companyNotes, [companyId]: notes };
    setCompanyNotes(updated);
    localStorage.setItem('superadmin-company-notes', JSON.stringify(updated));
  };

  const totalUsers = companies.reduce((sum, c) => sum + c.users, 0);
  const totalMRR = companies.reduce((sum, c) => sum + c.mrr, 0);
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const trialCompanies = companies.filter(c => c.status === 'trial').length;
  const totalEmailsProcessed = companies.reduce((sum, c) => sum + c.emailsProcessed, 0);

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ico.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Aktívne</Badge>;
      case 'trial':
        return <Badge variant="default" className="bg-blue-500">Skúšobné</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Pozastavené</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      'Štart': 'bg-gray-500',
      'Pro': 'bg-blue-600',
      'Enterprise': 'bg-purple-600'
    };
    return <Badge className={colors[plan as keyof typeof colors]}>{plan}</Badge>;
  };

  const handleImpersonate = (company: Company) => {
    if (confirm(`Prihlásenie ako admin spoločnosti ${company.name}?\n\nBudete presmerovaný do ich prostredia.`)) {
      alert(`Impersonácia: ${company.name}\n\nV produkcii by ste boli presmerovaný do prostredia tejto firmy s admin právami.`);
    }
  };

  const handleSuspend = (company: Company) => {
    if (confirm(`Pozastaviť prístup pre ${company.name}?`)) {
      const updated = companies.map(c =>
        c.id === company.id ? { ...c, status: 'suspended' as const } : c
      );
      setCompanies(updated);
      alert(`Spoločnosť ${company.name} bola pozastavená.`);
    }
  };

  const handleDelete = (company: Company) => {
    if (confirm(`VAROVANIE: Natrvalo vymazať ${company.name} a všetky ich dáta?\n\nTáto akcia sa nedá vrátiť späť!`)) {
      const password = prompt('Zadajte heslo pre potvrdenie:');
      if (password === 'DELETE') {
        setCompanies(companies.filter(c => c.id !== company.id));
        setSelectedCompany(null);
        alert(`Spoločnosť ${company.name} bola vymazaná.`);
      } else {
        alert('Nesprávne heslo. Zadajte "DELETE" pre potvrdenie.');
      }
    }
  };

  const handleChangePlan = (company: Company) => {
    const newPlan = prompt(`Zmeniť plán pre ${company.name}\n\nAktuálny: ${company.plan}\n\nZadajte nový plán (Štart/Pro/Enterprise):`);
    if (newPlan && ['Štart', 'Pro', 'Enterprise'].includes(newPlan)) {
      const updated = companies.map(c =>
        c.id === company.id ? { 
          ...c, 
          plan: newPlan as any,
          mrr: planPricing[newPlan as keyof typeof planPricing],
          status: newPlan === 'Štart' && c.status === 'trial' ? c.status : 'active' as const
        } : c
      );
      setCompanies(updated);
      alert(`Plán zmenený na ${newPlan}`);
    }
  };

  const allUsers = Object.entries(mockCompanyUsers).flatMap(([companyId, users]) => 
    users.map(u => ({ 
      ...u, 
      company: companies.find(c => c.id === parseInt(companyId))?.name || 'Unknown'
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            Super Admin
          </h1>
          <p className="text-muted-foreground mt-1">Správa SaaS platformy Biznis Agent</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="overview">Dashboard</TabsTrigger>
          <TabsTrigger value="companies">Firmy</TabsTrigger>
          <TabsTrigger value="users">Používatelia</TabsTrigger>
          <TabsTrigger value="billing">Platby</TabsTrigger>
          <TabsTrigger value="system">Systém</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Celkový počet firiem
                </CardTitle>
                <Building2 className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companies.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeCompanies} aktívnych, {trialCompanies} trial
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Celkový počet užívateľov
                </CardTitle>
                <Users className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cez všetky firmy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  MRR (Mesačný príjem)
                </CardTitle>
                <DollarSign className="w-5 h-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalMRR)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +15% vs minulý mesiac
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Emailov spracovaných
                </CardTitle>
                <Mail className="w-5 h-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEmailsProcessed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tento mesiac
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nedávne registrácie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companies
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map(company => (
                    <div key={company.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(company.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPlanBadge(company.plan)}
                        {getStatusBadge(company.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rozloženie podľa plánu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Štart (Trial)</span>
                  <span className="font-bold">{companies.filter(c => c.plan === 'Štart').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pro</span>
                  <span className="font-bold">{companies.filter(c => c.plan === 'Pro').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Enterprise</span>
                  <span className="font-bold">{companies.filter(c => c.plan === 'Enterprise').length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Systémové zdravie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>API server</span>
                  <Badge variant="default" className="bg-green-500">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database</span>
                  <Badge variant="default" className="bg-green-500">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email processor</span>
                  <Badge variant="default" className="bg-green-500">Running</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>AI service</span>
                  <Badge variant="default" className="bg-green-500">Operational</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6 mt-6">
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Hľadať firmu (názov, IČO)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => alert('Manuálne pridanie firmy - implementácia formulára')}>
              <Building2 className="w-4 h-4 mr-2" />
              Pridať firmu
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {filteredCompanies.map(company => (
                <Card
                  key={company.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCompany?.id === company.id ? 'ring-2 ring-primary' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedCompany(company)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{company.name}</p>
                        <p className="text-sm text-muted-foreground">IČO: {company.ico}</p>
                      </div>
                      <div className="flex gap-2">
                        {getPlanBadge(company.plan)}
                        {getStatusBadge(company.status)}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-3">
                      <span>{company.users} užívateľov</span>
                      <span>{company.emailsProcessed} emailov</span>
                      <span>MRR: {formatCurrency(company.mrr)}</span>
                    </div>
                    {company.status === 'trial' && company.trialDaysRemaining !== undefined && (
                      <p className="text-xs text-orange-600 mt-2">
                        Trial: {company.trialDaysRemaining > 0 
                          ? `${company.trialDaysRemaining} dní zostáva` 
                          : 'Vypršalo'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedCompany ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedCompany.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Základné informácie</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IČO:</span>
                          <span>{selectedCompany.ico}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Plán:</span>
                          {getPlanBadge(selectedCompany.plan)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          {getStatusBadge(selectedCompany.status)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Registrácia:</span>
                          <span>{formatDateTime(selectedCompany.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Používatelia</h4>
                      <div className="space-y-2">
                        {mockCompanyUsers[selectedCompany.id]?.map(user => (
                          <div key={user.id} className="flex justify-between items-center text-sm border-b pb-2">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                            <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                              {user.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Využitie</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Emailov spracovaných:</span>
                          <span className="font-medium">{selectedCompany.emailsProcessed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dokladov vytvorených:</span>
                          <span className="font-medium">{Math.floor(selectedCompany.emailsProcessed * 0.3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Úložisko:</span>
                          <span className="font-medium">{(selectedCompany.emailsProcessed * 2.5).toFixed(1)} MB</span>
                        </div>
                      </div>
                    </div>

                    {selectedCompany.status === 'active' && (
                      <div>
                        <h4 className="font-semibold mb-3">Predplatné</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Začiatok:</span>
                            <span>{selectedCompany.subscriptionStart && formatDateTime(selectedCompany.subscriptionStart)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ďalšie účtovanie:</span>
                            <span>{selectedCompany.nextBilling && formatDateTime(selectedCompany.nextBilling)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">MRR:</span>
                            <span className="font-medium">{formatCurrency(selectedCompany.mrr)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Revolut Payment:</span>
                            <Badge variant="default" className="bg-green-500">OK</Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="notes">Poznámky</Label>
                      <textarea
                        id="notes"
                        className="w-full mt-2 p-2 border rounded-md min-h-[100px] bg-background"
                        placeholder="Interné poznámky o firme..."
                        value={companyNotes[selectedCompany.id] || ''}
                        onChange={(e) => saveNotes(selectedCompany.id, e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <h4 className="font-semibold mb-3">Akcie</h4>
                      <Button
                        className="w-full"
                        variant="default"
                        onClick={() => handleImpersonate(selectedCompany)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Prihlásenie ako admin
                      </Button>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleChangePlan(selectedCompany)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Zmeniť plán
                      </Button>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleSuspend(selectedCompany)}
                        disabled={selectedCompany.status === 'suspended'}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Pozastaviť prístup
                      </Button>
                      <Button
                        className="w-full"
                        variant="destructive"
                        onClick={() => handleDelete(selectedCompany)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Vymazať firmu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center text-muted-foreground">
                    Vyberte firmu pre zobrazenie detailov
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Všetci používatelia ({allUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allUsers.map(user => (
                  <div key={`${user.company}-${user.id}`} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">{user.company}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">Posledné prihlásenie:</p>
                        <p>{formatDateTime(user.lastLogin)}</p>
                      </div>
                      <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                        {user.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Upraviť
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">MRR celkom</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(totalMRR)}</div>
                <p className="text-xs text-green-600 mt-1">+15% vs minulý mesiac</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">ARR (Ročný príjem)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(totalMRR * 12)}</div>
                <p className="text-xs text-muted-foreground mt-1">Projekcia na rok</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Aktívne predplatné</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeCompanies}</div>
                <p className="text-xs text-muted-foreground mt-1">Platiacich zákazníkov</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cenové plány</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Štart</h4>
                    <span className="text-2xl font-bold">{formatCurrency(0)}/mesiac</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ 14-dňový trial</li>
                    <li>✓ 1 používateľ</li>
                    <li>✓ 100 emailov/mesiac</li>
                    <li>✓ Základné funkcie</li>
                  </ul>
                  <p className="text-sm mt-2">
                    Aktivovaných: {companies.filter(c => c.plan === 'Štart').length}
                  </p>
                </div>

                <div className="border rounded-lg p-4 border-blue-500">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Pro</h4>
                    <span className="text-2xl font-bold">{formatCurrency(79)}/mesiac</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ 5 používateľov</li>
                    <li>✓ 1000 emailov/mesiac</li>
                    <li>✓ Pokročilé funkcie AI</li>
                    <li>✓ Prispôsobené šablóny</li>
                    <li>✓ API prístup</li>
                  </ul>
                  <p className="text-sm mt-2">
                    Aktivovaných: {companies.filter(c => c.plan === 'Pro').length} | 
                    MRR: {formatCurrency(companies.filter(c => c.plan === 'Pro').length * 79)}
                  </p>
                </div>

                <div className="border rounded-lg p-4 border-purple-500">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Enterprise</h4>
                    <span className="text-2xl font-bold">{formatCurrency(199)}/mesiac</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Neobmedzený počet používateľov</li>
                    <li>✓ Neobmedzené emaily</li>
                    <li>✓ Vlastný AI model</li>
                    <li>✓ Dedikovaná podpora</li>
                    <li>✓ SLA 99.9%</li>
                    <li>✓ Whitelabel možnosti</li>
                  </ul>
                  <p className="text-sm mt-2">
                    Aktivovaných: {companies.filter(c => c.plan === 'Enterprise').length} | 
                    MRR: {formatCurrency(companies.filter(c => c.plan === 'Enterprise').length * 199)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prehľad príjmov podľa mesiaca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Január 2026</span>
                  <span className="font-semibold">{formatCurrency(totalMRR * 0.7)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Február 2026</span>
                  <span className="font-semibold">{formatCurrency(totalMRR * 0.85)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b bg-primary/10">
                  <span>Marec 2026 (Aktuálny)</span>
                  <span className="font-semibold">{formatCurrency(totalMRR)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Systémové nastavenia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="email-domain">Predvolená emailová doména</Label>
                <Input
                  id="email-domain"
                  defaultValue="@biznisagent.sk"
                  className="mt-2"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Doména pre používateľské emaily
                </p>
              </div>

              <div>
                <Label>SMTP konfigurácia</Label>
                <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    SMTP server: smtp.biznisagent.sk:587<br />
                    Status: <Badge variant="default" className="bg-green-500">Pripojené</Badge>
                  </p>
                  <Button size="sm" variant="outline" className="mt-3">
                    Upraviť nastavenia
                  </Button>
                </div>
              </div>

              <div>
                <Label>API Keys</Label>
                <div className="mt-2 space-y-2">
                  <div className="p-3 bg-muted/50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">OpenAI API Key</p>
                      <p className="text-xs text-muted-foreground font-mono">sk-proj-••••••••••••••••</p>
                    </div>
                    <Badge variant="default" className="bg-green-500">Aktívny</Badge>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Revolut Business API</p>
                      <p className="text-xs text-muted-foreground font-mono">prod_••••••••••••••••</p>
                    </div>
                    <Badge variant="default" className="bg-green-500">Aktívny</Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label>Systémové zdravie</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">API Server</span>
                    <Badge variant="default" className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">PostgreSQL Database</span>
                    <Badge variant="default" className="bg-green-500">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Email Processor (Queue)</span>
                    <Badge variant="default" className="bg-green-500">Running</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">AI Service (OpenAI)</span>
                    <Badge variant="default" className="bg-green-500">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Railway Deployment</span>
                    <Badge variant="default" className="bg-green-500">Deployed</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="border-b pb-2">
                  <p className="font-medium">Pridaná nová firma: MegaBuild s.r.o.</p>
                  <p className="text-xs text-muted-foreground">2026-01-05 14:00 | superadmin@biznisagent.sk</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Zmenený plán: KábelPro s.r.o. (Štart → Pro)</p>
                  <p className="text-xs text-muted-foreground">2025-12-10 11:30 | superadmin@biznisagent.sk</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Pozastavená firma: TestFirma s.r.o.</p>
                  <p className="text-xs text-muted-foreground">2025-11-20 09:15 | superadmin@biznisagent.sk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
