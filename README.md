# Biznis Agent

Univerzálna B2B platforma pre automatizáciu obchodných procesov.

## Funkcie

- 📧 **Doručené** - AI analýza prijatých emailov
- 📄 **Doklady** - Cenové ponuky, faktúry, objednávky, dodacie listy
- 📦 **Katalóg** - Správa produktov s AI vyhľadávaním
- 👥 **CRM** - Zákaznícke karty s AI skóre
- 🔴 **Reklamácie** - Sledovanie a riešenie reklamácií
- 📊 **Prehľady** - Dashboard a reporty

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL, Drizzle ORM
- **Deployment**: Railway

## Lokálny vývoj

```bash
# Inštalácia závislostí
npm install

# Vytvorenie .env súboru
cp .env.example .env

# Spustenie databázy (potrebný Docker)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=biznisagent postgres:15

# Nastavenie schémy databázy
npm run db:push

# Naplnenie demo dátami
npm run db:seed

# Spustenie dev servera
npm run dev
```

## Produkčné nasadenie

Aplikácia je pripravená na nasadenie na Railway:

1. Vytvorte PostgreSQL službu
2. Vytvorte Web službu prepojenú s GitHub repozitárom
3. Nastavte ENV premenné
4. Spustite seed script cez Railway CLI

## Demo účty

- **Admin**: admin@biznisagent.sk / password123
- **Obchodník**: jana@biznisagent.sk / password123
- **Účtovník**: eva@biznisagent.sk / password123

## Licencia

Proprietary - Functu s.r.o.
