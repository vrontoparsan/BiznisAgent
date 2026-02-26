import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { formatCurrency } from '@/lib/utils';
import { Search, Plus, Settings2, ArrowUpDown } from 'lucide-react';
import { ConfigModal } from '../ConfigModal';

export function Catalog() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState<any>({});
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (token) {
      api.getProducts(token, search ? { search } : {})
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token, search]);

  useEffect(() => {
    const saved = localStorage.getItem('catalog-config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    } else {
      setConfig({
        col_kod: true,
        col_nazov: true,
        col_kategoria: true,
        col_cena: true,
        col_skladom: true,
        col_jednotka: false,
        col_popis: false,
        col_zlozeny: false,
      });
    }
  }, []);

  const configSections = [
    {
      title: 'Zobrazované stĺpce',
      fields: [
        { id: 'col_kod', label: 'Kód', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_nazov', label: 'Názov', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_kategoria', label: 'Kategória', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_cena', label: 'Cena', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_skladom', label: 'Skladom', type: 'checkbox' as const, defaultValue: true },
        { id: 'col_jednotka', label: 'Jednotka', type: 'checkbox' as const, defaultValue: false },
        { id: 'col_popis', label: 'Popis', type: 'checkbox' as const, defaultValue: false },
        { id: 'col_zlozeny', label: 'Zložený produkt', type: 'checkbox' as const, defaultValue: false },
      ],
    },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;
    return aVal > bVal ? direction : -direction;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Katalóg produktov</h1>
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
          Pridať produkt
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Hľadať produkty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Načítavam...</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    {config.col_kod && (
                      <th className="text-left p-4 font-medium text-sm">
                        <button
                          onClick={() => handleSort('code')}
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          Kód
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                    )}
                    {config.col_nazov && (
                      <th className="text-left p-4 font-medium text-sm">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          Názov
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                    )}
                    {config.col_kategoria && (
                      <th className="text-left p-4 font-medium text-sm">
                        <button
                          onClick={() => handleSort('category')}
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          Kategória
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                    )}
                    {config.col_cena && (
                      <th className="text-right p-4 font-medium text-sm">
                        <button
                          onClick={() => handleSort('price')}
                          className="flex items-center gap-1 hover:text-primary ml-auto"
                        >
                          Cena
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                    )}
                    {config.col_skladom && (
                      <th className="text-right p-4 font-medium text-sm">
                        <button
                          onClick={() => handleSort('stock')}
                          className="flex items-center gap-1 hover:text-primary ml-auto"
                        >
                          Skladom
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                    )}
                    {config.col_jednotka && (
                      <th className="text-left p-4 font-medium text-sm">Jednotka</th>
                    )}
                    {config.col_popis && (
                      <th className="text-left p-4 font-medium text-sm">Popis</th>
                    )}
                    {config.col_zlozeny && (
                      <th className="text-left p-4 font-medium text-sm">Zložený</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      {config.col_kod && (
                        <td className="p-4 text-sm text-muted-foreground">{product.code}</td>
                      )}
                      {config.col_nazov && (
                        <td className="p-4 text-sm font-medium">{product.name}</td>
                      )}
                      {config.col_kategoria && (
                        <td className="p-4 text-sm text-muted-foreground">{product.category}</td>
                      )}
                      {config.col_cena && (
                        <td className="p-4 text-sm text-right font-semibold text-primary">
                          {formatCurrency(product.price)}
                        </td>
                      )}
                      {config.col_skladom && (
                        <td className="p-4 text-sm text-right">
                          <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                            {product.stock} {product.unit}
                          </span>
                        </td>
                      )}
                      {config.col_jednotka && (
                        <td className="p-4 text-sm text-muted-foreground">{product.unit}</td>
                      )}
                      {config.col_popis && (
                        <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                          {product.description}
                        </td>
                      )}
                      {config.col_zlozeny && (
                        <td className="p-4 text-sm">
                          {product.isComposite ? '✓' : ''}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <ConfigModal
        open={configOpen}
        onOpenChange={setConfigOpen}
        title="Konfigurácia zobrazenia katalógu"
        sections={configSections}
        storageKey="catalog-config"
        onSave={setConfig}
      />
    </div>
  );
}
