import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { formatCurrency } from '@/lib/utils';
import { Search, Plus } from 'lucide-react';

export function Catalog() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getProducts(token, search ? { search } : {})
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token, search]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Katalóg produktov</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.code}</p>
                    </div>
                    <p className="font-semibold text-primary ml-2 shrink-0">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{product.category}</span>
                    <span>Sklad: {product.stock} {product.unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
