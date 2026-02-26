import { useState } from 'react';
import { Mail, Bot, MousePointer, Inbox, FileText, Package, Users, AlertCircle, BarChart3, Check, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { useAuth } from '@/contexts/AuthContext';

export function Landing() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Prihlásenie zlyhalo');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Biznis Agent</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('features')} className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Funkcie</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cenník</button>
            <button onClick={() => scrollToSection('contact')} className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kontakt</button>
            <Button onClick={() => setShowLoginModal(true)} variant="outline" size="sm">Prihlásiť sa</Button>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">Funkcie</button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">Cenník</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">Kontakt</button>
            <Button onClick={() => setShowLoginModal(true)} variant="outline" size="sm" className="w-full">Prihlásiť sa</Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Váš AI asistent pre biznis
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
              Automatizujte dopyty, faktúry, objednávky a CRM. Jeden email — Agent sa postará o zvyšok.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setShowLoginModal(true)} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Vyskúšať zadarmo
              </Button>
              <Button onClick={() => setShowLoginModal(true)} size="lg" variant="outline">
                Prihlásiť sa
              </Button>
            </div>
            <p className="text-sm text-slate-500">Demo: admin@biznisagent.sk / password123</p>
          </div>

          {/* Dashboard mockup */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-3">
                <div className="h-8 bg-blue-100 dark:bg-blue-900/30 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded"></div>
                  <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-32 bg-slate-100 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white dark:bg-slate-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">Ako to funguje</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Prepošlite email</h3>
              <p className="text-slate-600 dark:text-slate-400">Nastavíte presmerovanie na vasa-firma@biznisagent.sk</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Bot className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Agent spracuje</h3>
              <p className="text-slate-600 dark:text-slate-400">AI rozpozná zákazníka, extrahuje položky, kategorizuje</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                <MousePointer className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Vy rozhodnete</h3>
              <p className="text-slate-600 dark:text-slate-400">Jedným klikom: CP, faktúra, odpoveď, reklamácia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">Funkcie</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Inbox, title: 'Inteligentná schránka', desc: 'AI triedi a analyzuje emaily' },
              { icon: FileText, title: 'Automatické doklady', desc: 'CP, FA, OBJ, DL jedným klikom' },
              { icon: Package, title: 'Katalóg produktov', desc: 'Sklad, zložené položky, vyhľadávanie' },
              { icon: Users, title: 'CRM', desc: 'Zákaznícke karty, AI scoring, história' },
              { icon: AlertCircle, title: 'Reklamácie', desc: 'Pipeline, SLA, automatické odpovede' },
              { icon: BarChart3, title: 'Prehľady', desc: 'KPI, grafy, export do CSV/XLSX' },
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Biznis Agent */}
      <section className="bg-white dark:bg-slate-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">Prečo Biznis Agent</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              'Žiadny CAPEX — mesačný paušál',
              'AI na mieru — nie generický formulár',
              'Slovenský jazyk — rozumie slovenským firmám',
              'Konfigurovateľný — prispôsobte si každý modul',
              'Mobilná verzia — pracujte odkiaľkoľvek',
              'Multi-jazyk ready — SK, CZ, EN, DE',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">Cenník</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Štart',
                price: '0 €',
                period: '/mes',
                features: ['1 používateľ', '100 emailov/mes', 'Základné funkcie'],
              },
              {
                name: 'Pro',
                price: '49 €',
                period: '/mes',
                features: ['5 používateľov', 'Neobmedzené emaily', 'Všetky funkcie', 'Revolut integrácia'],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Na mieru',
                period: '',
                features: ['Neobmedzení používatelia', 'API prístup', 'Vlastný onboarding', 'SLA'],
              },
            ].map((tier, i) => (
              <Card key={i} className={`p-8 ${tier.highlighted ? 'border-2 border-blue-600 dark:border-blue-400 shadow-xl' : ''}`}>
                {tier.highlighted && (
                  <div className="text-center mb-4">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Najpopulárnejší</span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">{tier.price}</span>
                  <span className="text-slate-600 dark:text-slate-400">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => setShowLoginModal(true)} 
                  className={`w-full ${tier.highlighted ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={tier.highlighted ? 'default' : 'outline'}
                >
                  {i === 2 ? 'Kontaktujte nás' : 'Začať'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Biznis Agent</span>
              </div>
              <p className="text-slate-400">AI asistent pre moderné firmy</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <div className="space-y-2 text-slate-400">
                <p>info@biznisagent.sk</p>
                <p>+421 XXX XXX XXX</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Odkazy</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Podmienky</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Ochrana súkromia</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Kontakt</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">© 2026 Biznis Agent | Functu s.r.o.</p>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              Vyrobené na Slovensku 🇸🇰
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowLoginModal(false)}>
          <Card className="w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Prihlásenie</h2>
              <button onClick={() => setShowLoginModal(false)}>
                <X className="w-6 h-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@biznisagent.sk"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Heslo</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Prihlasovanie...' : 'Prihlásiť sa'}
              </Button>

              <div className="text-center">
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Zabudnuté heslo?
                </a>
              </div>

              <div className="text-sm text-center text-slate-500">
                Demo prístup: admin@biznisagent.sk / password123
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
