import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

export function Settings() {
  const { token, user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

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
      </Tabs>
    </div>
  );
}
