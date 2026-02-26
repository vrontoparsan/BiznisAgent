import { useState, useEffect, useRef } from 'react';
import { Search, Users, Package, FileText, Mail } from 'lucide-react';
import { Input } from '../ui/input';
import { Card } from '../ui/card';

interface SearchResult {
  id: number;
  type: 'customer' | 'product' | 'document' | 'email';
  title: string;
  subtitle?: string;
}

const mockData = {
  customers: [
    { id: 1, title: 'TechnoStav s.r.o.', subtitle: 'IČO: 12345678' },
    { id: 2, title: 'ElektroMont a.s.', subtitle: 'IČO: 87654321' },
    { id: 3, title: 'BuildCorp Slovakia', subtitle: 'IČO: 11223344' },
  ],
  products: [
    { id: 1, title: 'Kábel XY-100', subtitle: '€ 12.50 / ks' },
    { id: 2, title: 'Spínač ABC-200', subtitle: '€ 8.90 / ks' },
    { id: 3, title: 'Svorka DEF-300', subtitle: '€ 0.50 / ks' },
  ],
  documents: [
    { id: 1, title: 'CP-2026/0047', subtitle: 'TechnoStav s.r.o. - € 4,580' },
    { id: 2, title: 'FA-2026/0023', subtitle: 'ElektroMont a.s. - € 8,920' },
    { id: 3, title: 'OBJ-2026/0012', subtitle: 'BuildCorp Slovakia - € 12,450' },
  ],
  emails: [
    { id: 1, title: 'Dopyt na káble', subtitle: 'TechnoStav s.r.o. - 2h ago' },
    { id: 2, title: 'Objednávka spínačov', subtitle: 'ElektroMont a.s. - 5h ago' },
  ],
};

interface GlobalSearchProps {
  onFocus?: () => void;
}

export function GlobalSearch({ onFocus }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
        if (onFocus) onFocus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFocus]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const q = query.toLowerCase();
    const filtered: SearchResult[] = [];

    mockData.customers
      .filter(c => c.title.toLowerCase().includes(q) || c.subtitle?.toLowerCase().includes(q))
      .forEach(c => filtered.push({ ...c, type: 'customer' }));

    mockData.products
      .filter(p => p.title.toLowerCase().includes(q))
      .forEach(p => filtered.push({ ...p, type: 'product' }));

    mockData.documents
      .filter(d => d.title.toLowerCase().includes(q) || d.subtitle?.toLowerCase().includes(q))
      .forEach(d => filtered.push({ ...d, type: 'document' }));

    mockData.emails
      .filter(e => e.title.toLowerCase().includes(q) || e.subtitle?.toLowerCase().includes(q))
      .forEach(e => filtered.push({ ...e, type: 'email' }));

    setResults(filtered);
    setOpen(filtered.length > 0);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'customer': return <Users className="w-4 h-4" />;
      case 'product': return <Package className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'customer': return 'Zákazník';
      case 'product': return 'Produkt';
      case 'document': return 'Doklad';
      case 'email': return 'Email';
      default: return type;
    }
  };

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Hľadať zákazníkov, produkty, doklady..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          className="pl-10"
        />
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <Card className="absolute left-0 right-0 top-12 z-50 p-2 shadow-xl max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Žiadne výsledky
              </div>
            ) : (
              <div className="space-y-1">
                {['customer', 'product', 'document', 'email'].map(type => {
                  const typeResults = results.filter(r => r.type === type);
                  if (typeResults.length === 0) return null;

                  return (
                    <div key={type}>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                        {getIcon(type)} {getTypeLabel(type)}
                      </div>
                      {typeResults.map(result => (
                        <button
                          key={`${result.type}-${result.id}`}
                          className="w-full text-left px-3 py-2 rounded hover:bg-accent transition-colors"
                          onClick={() => {
                            setOpen(false);
                            setQuery('');
                            // Handle navigation here
                          }}
                        >
                          <div className="font-medium text-sm">{result.title}</div>
                          {result.subtitle && (
                            <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
