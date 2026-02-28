import { useState, useEffect } from 'react';
import { Mail, Bot, Zap, Inbox, FileText, Package, Users, BarChart3, Check, Menu, X, ArrowRight, Shield, Clock, Globe, Sparkles, TrendingUp, ChevronRight, Play, Star } from 'lucide-react';
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
  const [scrollY, setScrollY] = useState(0);
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveMetric(m => (m + 1) % 4), 3000);
    return () => clearInterval(interval);
  }, []);

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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const metrics = [
    { value: '73%', label: 'menej manuálnej práce', color: 'from-blue-500 to-cyan-500' },
    { value: '2.4×', label: 'rýchlejšie odpovede', color: 'from-violet-500 to-purple-500' },
    { value: '0', label: 'zmeškaných dopytov', color: 'from-emerald-500 to-green-500' },
    { value: '24/7', label: 'Agent pracuje non-stop', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-[#0a0e1a]/90 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0e1a] animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Biznis Agent</span>
              <span className="text-[10px] text-blue-400 block -mt-1 tracking-widest uppercase">AI pre firmy</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Funkcie', 'Ako to funguje', 'Cenník', 'Kontakt'].map((item, i) => (
              <button key={i} onClick={() => scrollToSection(['features', 'how', 'pricing', 'contact'][i])} className="text-sm text-slate-400 hover:text-white transition-all duration-300 relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <Button onClick={() => setShowLoginModal(true)} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white backdrop-blur-sm" size="sm">
              Prihlásiť sa
            </Button>
          </nav>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0e1a]/95 backdrop-blur-xl border-t border-white/5 p-6 space-y-4">
            {['Funkcie', 'Ako to funguje', 'Cenník', 'Kontakt'].map((item, i) => (
              <button key={i} onClick={() => scrollToSection(['features', 'how', 'pricing', 'contact'][i])} className="block w-full text-left text-slate-300 hover:text-white py-2">{item}</button>
            ))}
            <Button onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="w-full bg-blue-600 hover:bg-blue-700">Prihlásiť sa</Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">Nová generácia B2B automatizácie</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
              <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">Váš AI agent</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">pre celú firmu</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Jeden email príde — Agent ho prečíta, pochopí, pripraví cenovú ponuku, faktúru alebo odpoveď. 
              <span className="text-white font-medium"> Vy len schválite.</span>
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button onClick={() => setShowLoginModal(true)} size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-xl shadow-blue-600/20 px-8 h-14 text-base group">
                Vyskúšať zadarmo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={() => scrollToSection('how')} size="lg" variant="ghost" className="text-slate-400 hover:text-white h-14 text-base group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Ako to funguje
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-6 pt-8 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <span>Používajú firmy po celom Slovensku</span>
            </div>
          </div>

          {/* Animated metrics bar */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((m, i) => (
                <div key={i} className={`relative group cursor-pointer rounded-2xl border p-6 text-center transition-all duration-500 ${
                  activeMetric === i 
                    ? 'bg-white/[0.08] border-white/20 scale-105' 
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                }`} onClick={() => setActiveMetric(i)}>
                  <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>
                    {m.value}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{m.label}</div>
                  {activeMetric === i && (
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r ${m.color} rounded-full`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-1 shadow-2xl shadow-blue-500/5">
              <div className="rounded-xl bg-[#0f1423] overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white/5 rounded-lg px-4 py-1 text-xs text-slate-500 flex items-center gap-2">
                      <Shield className="w-3 h-3 text-green-400" />
                      biznisagent.sk/dashboard
                    </div>
                  </div>
                </div>
                {/* Mock dashboard content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg" />
                      <div>
                        <div className="h-4 w-32 bg-white/10 rounded" />
                        <div className="h-3 w-20 bg-white/5 rounded mt-1" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-20 bg-blue-500/20 rounded-lg border border-blue-500/30" />
                      <div className="h-8 w-8 bg-white/5 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {['Dopyty dnes', 'CP tento mesiac', 'Obrat', 'Neuhradené FA'].map((label, i) => (
                      <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                        <div className="text-xs text-slate-500 mb-2">{label}</div>
                        <div className="text-xl font-bold text-white">{['12', '47', '€28,450', '3'][i]}</div>
                        <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />{['+23%', '+12%', '+18%', '-40%'][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 bg-white/[0.03] rounded-xl p-4 border border-white/5 space-y-3">
                      {['Kovovýroba Steel — objednávka oceľový plech', 'Nábytok Design — reklamácia chybný produkt', 'Elektro Slovakia — objednávka elektromotor'].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${['bg-blue-400', 'bg-red-400', 'bg-blue-400'][i]}`} />
                            <span className="text-sm text-slate-300">{item}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${['bg-blue-500/20 text-blue-300', 'bg-red-500/20 text-red-300', 'bg-blue-500/20 text-blue-300'][i]}`}>
                            {['objednávka', 'reklamácia', 'objednávka'][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                      <div className="text-xs text-slate-500 mb-3">Agent navrhuje</div>
                      <div className="space-y-2">
                        <div className="h-8 bg-blue-500/20 rounded-lg border border-blue-500/20 flex items-center justify-center text-xs text-blue-300">Vytvoriť CP</div>
                        <div className="h-8 bg-white/5 rounded-lg flex items-center justify-center text-xs text-slate-400">Dodací list</div>
                        <div className="h-8 bg-white/5 rounded-lg flex items-center justify-center text-xs text-slate-400">Kontrola skladu</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-500/20 via-transparent to-transparent opacity-50 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm text-blue-400 font-medium tracking-widest uppercase">Proces</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">Ako to funguje</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Tri kroky ku kompletne automatizovanému B2B procesu</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-blue-500/50 via-violet-500/50 to-emerald-500/50" />
              
              {[
                { icon: Mail, color: 'blue', step: '01', title: 'Prepošlite email', desc: 'Nastavíte presmerovanie na vasa-firma@biznisagent.sk. Agent dostane každý email automaticky.' },
                { icon: Bot, color: 'violet', step: '02', title: 'Agent analyzuje', desc: 'AI rozpozná zákazníka, extrahuje položky, skontroluje sklad a pripraví dokumenty.' },
                { icon: Zap, color: 'emerald', step: '03', title: 'Vy rozhodnete', desc: 'Jedným klikom schválite CP, faktúru alebo odpoveď. Agent odošle za vás.' },
              ].map((item, i) => (
                <div key={i} className="relative text-center group">
                  <div className={`relative w-32 h-32 mx-auto mb-6 rounded-3xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
                    style={{ background: `radial-gradient(circle at 50% 50%, ${['rgba(59,130,246,0.15)', 'rgba(139,92,246,0.15)', 'rgba(16,185,129,0.15)'][i]}, transparent)`, borderColor: `${['rgba(59,130,246,0.2)', 'rgba(139,92,246,0.2)', 'rgba(16,185,129,0.2)'][i]}` }}>
                    <item.icon className="w-12 h-12" style={{ color: ['#60a5fa', '#a78bfa', '#34d399'][i] }} />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-[#0a0e1a] border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm text-cyan-400 font-medium tracking-widest uppercase">Moduly</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">Všetko čo potrebujete</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Každý modul je poháňaný AI agentom, ktorý sa učí z vášho biznisu</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Inbox, title: 'Inteligentná schránka', desc: 'Agent triedi, kategorizuje a analyzuje každý email. Rozpozná dopyt od reklamácie.', gradient: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/10', iconColor: 'text-blue-400' },
              { icon: FileText, title: 'Automatické doklady', desc: 'CP, FA, OBJ, DL — Agent vytvorí jedným klikom s vašimi šablónami a cenníkom.', gradient: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-500/10', iconColor: 'text-violet-400' },
              { icon: Package, title: 'Katalóg produktov', desc: 'Agent pozná celý katalóg, rozumie zloženým produktom a kontroluje sklad.', gradient: 'from-emerald-500/10 to-green-500/10', border: 'border-emerald-500/10', iconColor: 'text-emerald-400' },
              { icon: Users, title: 'CRM so zľavami', desc: 'Zákaznícke karty, individuálny cenník, AI scoring a história objednávok.', gradient: 'from-orange-500/10 to-amber-500/10', border: 'border-orange-500/10', iconColor: 'text-orange-400' },
              { icon: Shield, title: 'Reklamácie & SLA', desc: 'Agent sleduje termíny, navrhuje riešenia a automaticky eskaluje.', gradient: 'from-red-500/10 to-pink-500/10', border: 'border-red-500/10', iconColor: 'text-red-400' },
              { icon: BarChart3, title: 'Živé prehľady', desc: 'KPI v reálnom čase, Agent predikuje trendy a navrhuje akcie.', gradient: 'from-cyan-500/10 to-teal-500/10', border: 'border-cyan-500/10', iconColor: 'text-cyan-400' },
            ].map((f, i) => (
              <div key={i} className={`group relative rounded-2xl bg-gradient-to-br ${f.gradient} border ${f.border} p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer`}>
                <f.icon className={`w-10 h-10 ${f.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                <ArrowRight className="w-5 h-5 text-slate-600 absolute bottom-6 right-6 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm text-emerald-400 font-medium tracking-widest uppercase">Výhody</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">Prečo práve Biznis Agent</h2>
              <p className="text-slate-400 mt-4 leading-relaxed">Nie sme ďalší CRM alebo ERP. Sme AI agent, ktorý pracuje s vami — rozumie emailom, produktom, zákazníkom aj cenám.</p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Clock, text: 'Mesačný paušál — žiadny CAPEX, žiadne prekvapenia' },
                { icon: Globe, text: 'Slovenský jazyk — Agent rozumie slovenským firmám' },
                { icon: Sparkles, text: 'Konfigurovateľný — prispôsobte si každý modul perom ✏️' },
                { icon: Shield, text: 'GDPR a bezpečnosť — dáta na EU serveroch' },
                { icon: Zap, text: 'Integrácie — Revolut, MK Soft, EDI, vlastné API' },
                { icon: Globe, text: 'Multi-jazyk ready — SK, CZ, EN, DE' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm text-amber-400 font-medium tracking-widest uppercase">Cenník</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">Jednoduchý a férový</h2>
            <p className="text-slate-400 mt-4">Žiadne skryté poplatky. Zrušte kedykoľvek.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Štart', price: '0 €', period: '/mes', desc: 'Pre malé firmy a freelancerov', features: ['1 používateľ', '100 emailov/mes', 'Základné AI funkcie', 'Email podpora'], highlighted: false },
              { name: 'Pro', price: '49 €', period: '/mes', desc: 'Pre rastúce B2B firmy', features: ['5 používateľov', 'Neobmedzené emaily', 'Všetky AI funkcie', 'Individuálny cenník', 'Revolut integrácia', 'Prioritná podpora'], highlighted: true },
              { name: 'Enterprise', price: 'Na mieru', period: '', desc: 'Pre veľké firmy a korporácie', features: ['Neobmedzení používatelia', 'API prístup', 'Vlastný onboarding', 'SLA garantované', 'Dedikovaný account manager', 'On-premise možnosť'], highlighted: false },
            ].map((tier, i) => (
              <div key={i} className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                tier.highlighted 
                  ? 'bg-gradient-to-b from-blue-500/20 to-violet-500/10 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/10' 
                  : 'bg-white/[0.02] border border-white/5'
              }`}>
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/20">
                      Najpopulárnejší
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{tier.desc}</p>
                <div className="mt-6 mb-8">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-slate-400">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => setShowLoginModal(true)} className={`w-full h-12 ${
                  tier.highlighted 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-600/20' 
                    : 'bg-white/10 hover:bg-white/20 border border-white/10'
                }`}>
                  {i === 2 ? 'Kontaktujte nás' : 'Začať zadarmo'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-cyan-600/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-12 md:p-16 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Pripravení automatizovať váš biznis?
              </h2>
              <p className="text-slate-400 mt-4 text-lg">Začnite zadarmo. Žiadna kreditka. Nastavenie za 5 minút.</p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button onClick={() => setShowLoginModal(true)} size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-xl shadow-blue-600/20 px-8 h-14 text-base">
                  Vyskúšať zadarmo <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/5 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Biznis Agent</span>
              </div>
              <p className="text-slate-400 text-sm max-w-sm">AI asistent pre moderné B2B firmy. Automatizujte dopyty, objednávky, faktúry a CRM jedným nástrojom.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Kontakt</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p>info@biznisagent.sk</p>
                <p>Functu s.r.o.</p>
                <p>Slovenská republika</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Odkazy</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Podmienky služby</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Ochrana súkromia</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Podpora</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2026 Biznis Agent | Functu s.r.o.</p>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              Vyrobené s ❤️ na Slovensku 🇸🇰
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowLoginModal(false)}>
          <div className="w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
            <Card className="relative w-full p-8 bg-[#0f1423] border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Prihlásenie</h2>
                <button onClick={() => setShowLoginModal(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@biznisagent.sk" required className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Heslo</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50" />
                </div>
                {error && (
                  <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</div>
                )}
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-600/20" disabled={loading}>
                  {loading ? 'Prihlasovanie...' : 'Prihlásiť sa'}
                </Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Zabudnuté heslo?</a>
                </div>
                <div className="text-sm text-center text-slate-500 pt-2 border-t border-white/5">
                  Demo: admin@biznisagent.sk / password123
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
