import { useState, useEffect } from 'react';

type Language = 'sk' | 'cz' | 'en' | 'de';

interface Translations {
  [key: string]: {
    sk: string;
    cz: string;
    en: string;
    de: string;
  };
}

const translations: Translations = {
  // Sidebar
  'sidebar.inbox': { sk: 'Doručené', cz: 'Doručené', en: 'Inbox', de: 'Posteingang' },
  'sidebar.documents': { sk: 'Doklady', cz: 'Doklady', en: 'Documents', de: 'Dokumente' },
  'sidebar.catalog': { sk: 'Katalóg', cz: 'Katalog', en: 'Catalog', de: 'Katalog' },
  'sidebar.customers': { sk: 'Zákazníci', cz: 'Zákazníci', en: 'Customers', de: 'Kunden' },
  'sidebar.complaints': { sk: 'Reklamácie', cz: 'Reklamace', en: 'Complaints', de: 'Reklamationen' },
  'sidebar.dashboard': { sk: 'Prehľady', cz: 'Přehledy', en: 'Dashboard', de: 'Übersicht' },
  'sidebar.settings': { sk: 'Nastavenia', cz: 'Nastavení', en: 'Settings', de: 'Einstellungen' },
  'sidebar.logout': { sk: 'Odhlásiť sa', cz: 'Odhlásit se', en: 'Logout', de: 'Abmelden' },
  'sidebar.darkMode': { sk: 'Tmavý režim', cz: 'Tmavý režim', en: 'Dark mode', de: 'Dunkelmodus' },
  'sidebar.lightMode': { sk: 'Svetlý režim', cz: 'Světlý režim', en: 'Light mode', de: 'Hellmodus' },
  
  // Dashboard
  'dashboard.title': { sk: 'Prehľady', cz: 'Přehledy', en: 'Dashboard', de: 'Übersicht' },
  'dashboard.revenue': { sk: 'Tržby', cz: 'Tržby', en: 'Revenue', de: 'Umsatz' },
  'dashboard.quotes': { sk: 'Ponuky', cz: 'Nabídky', en: 'Quotes', de: 'Angebote' },
  'dashboard.orders': { sk: 'Objednávky', cz: 'Objednávky', en: 'Orders', de: 'Bestellungen' },
  'dashboard.customers': { sk: 'Zákazníci', cz: 'Zákazníci', en: 'Customers', de: 'Kunden' },
  'dashboard.activity': { sk: 'Posledná aktivita', cz: 'Poslední aktivita', en: 'Recent Activity', de: 'Letzte Aktivität' },
  
  // Inbox
  'inbox.title': { sk: 'Doručené správy', cz: 'Doručené zprávy', en: 'Inbox', de: 'Posteingang' },
  'inbox.new': { sk: 'Nový', cz: 'Nový', en: 'New', de: 'Neu' },
  'inbox.processed': { sk: 'Spracovaný', cz: 'Zpracovaný', en: 'Processed', de: 'Verarbeitet' },
  'inbox.archived': { sk: 'Archivovaný', cz: 'Archivovaný', en: 'Archived', de: 'Archiviert' },
  
  // Documents
  'documents.title': { sk: 'Doklady', cz: 'Doklady', en: 'Documents', de: 'Dokumente' },
  'documents.quotes': { sk: 'Cenové ponuky', cz: 'Cenové nabídky', en: 'Quotes', de: 'Angebote' },
  'documents.invoices': { sk: 'Faktúry', cz: 'Faktury', en: 'Invoices', de: 'Rechnungen' },
  'documents.orders': { sk: 'Objednávky', cz: 'Objednávky', en: 'Orders', de: 'Bestellungen' },
  
  // Status
  'status.pending': { sk: 'Čaká', cz: 'Čeká', en: 'Pending', de: 'Ausstehend' },
  'status.sent': { sk: 'Odoslaná', cz: 'Odeslaná', en: 'Sent', de: 'Gesendet' },
  'status.paid': { sk: 'Zaplatená', cz: 'Zaplacená', en: 'Paid', de: 'Bezahlt' },
  'status.overdue': { sk: 'Po splatnosti', cz: 'Po splatnosti', en: 'Overdue', de: 'Überfällig' },
  'status.new': { sk: 'Nová', cz: 'Nová', en: 'New', de: 'Neu' },
  'status.confirmed': { sk: 'Potvrdená', cz: 'Potvrzená', en: 'Confirmed', de: 'Bestätigt' },
  'status.preparing': { sk: 'V príprave', cz: 'V přípravě', en: 'Preparing', de: 'In Vorbereitung' },
  'status.shipped': { sk: 'Expedovaná', cz: 'Expedovaná', en: 'Shipped', de: 'Versandt' },
  'status.delivered': { sk: 'Doručená', cz: 'Doručená', en: 'Delivered', de: 'Geliefert' },
  
  // Buttons
  'button.save': { sk: 'Uložiť', cz: 'Uložit', en: 'Save', de: 'Speichern' },
  'button.cancel': { sk: 'Zrušiť', cz: 'Zrušit', en: 'Cancel', de: 'Abbrechen' },
  'button.create': { sk: 'Vytvoriť', cz: 'Vytvořit', en: 'Create', de: 'Erstellen' },
  'button.edit': { sk: 'Upraviť', cz: 'Upravit', en: 'Edit', de: 'Bearbeiten' },
  'button.delete': { sk: 'Zmazať', cz: 'Smazat', en: 'Delete', de: 'Löschen' },
  'button.export': { sk: 'Exportovať', cz: 'Exportovat', en: 'Export', de: 'Exportieren' },
  'button.search': { sk: 'Hľadať', cz: 'Hledat', en: 'Search', de: 'Suchen' },
  
  // Search
  'search.placeholder': { sk: 'Hľadať zákazníkov, produkty, doklady...', cz: 'Hledat zákazníky, produkty, doklady...', en: 'Search customers, products, documents...', de: 'Kunden, Produkte, Dokumente suchen...' },
  
  // Keyboard shortcuts
  'shortcuts.hint': { sk: '⌨️ Skratky: N=nový, C=CP, F=FA, /=hľadať', cz: '⌨️ Zkratky: N=nový, C=CP, F=FA, /=hledat', en: '⌨️ Shortcuts: N=new, C=quote, F=invoice, /=search', de: '⌨️ Tastenkürzel: N=neu, C=Angebot, F=Rechnung, /=suchen' },
};

let currentLanguage: Language = (localStorage.getItem('language') as Language) || 'sk';

export function getCurrentLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  // Trigger a custom event to notify components about language change
  window.dispatchEvent(new CustomEvent('languagechange'));
}

export function t(key: string, fallback?: string): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Missing translation for key: ${key}`);
    return fallback || key;
  }
  return translation[currentLanguage] || translation.sk || fallback || key;
}

export function useTranslation() {
  // Simple hook that components can use to re-render on language change
  const [, setUpdate] = useState(0);
  
  useEffect(() => {
    const handler = () => setUpdate(prev => prev + 1);
    window.addEventListener('languagechange', handler);
    return () => window.removeEventListener('languagechange', handler);
  }, []);
  
  return { t, currentLanguage: getCurrentLanguage(), setLanguage };
}
