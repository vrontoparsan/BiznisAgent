import { db } from './db.js';
import * as schema from './schema.js';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await db.delete(schema.dashboardStats);
  await db.delete(schema.complaints);
  await db.delete(schema.deliveryNotes);
  await db.delete(schema.orders);
  await db.delete(schema.invoices);
  await db.delete(schema.quotes);
  await db.delete(schema.products);
  await db.delete(schema.emails);
  await db.delete(schema.customers);
  await db.delete(schema.companies);
  await db.delete(schema.users);

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const hashedSuperAdminPassword = await bcrypt.hash('superadmin123', 10);
  
  const [superadmin, admin, sales1, sales2, sales3, accountant] = await db.insert(schema.users).values([
    { email: 'superadmin@biznisagent.sk', passwordHash: hashedSuperAdminPassword, name: 'Juraj (Functu)', role: 'superadmin' },
    { email: 'admin@biznisagent.sk', passwordHash: hashedPassword, name: 'Peter Novák', role: 'admin' },
    { email: 'jana@biznisagent.sk', passwordHash: hashedPassword, name: 'Jana Kováčová', role: 'obchodnik' },
    { email: 'martin@biznisagent.sk', passwordHash: hashedPassword, name: 'Martin Horák', role: 'obchodnik' },
    { email: 'lucia@biznisagent.sk', passwordHash: hashedPassword, name: 'Lucia Tóthová', role: 'obchodnik' },
    { email: 'eva@biznisagent.sk', passwordHash: hashedPassword, name: 'Eva Vargová', role: 'uctovnik' },
  ]).returning();

  console.log('✅ Users created');

  // Create company
  await db.insert(schema.companies).values({
    name: 'Demo Firma s.r.o.',
    ico: '12345678',
    dic: '1234567890',
    icDph: 'SK1234567890',
    address: 'Hlavná 123, 811 01 Bratislava',
    iban: 'SK8975000000000012345678',
    settingsJson: {
      emailForwarding: 'demo@biznisagent.sk',
      currency: 'EUR',
      vatRate: 20,
    },
  });

  console.log('✅ Company created');

  // Create customers
  const customerData = [
    { companyName: 'Stavebniny Novák s.r.o.', ico: '11223344', dic: '2233445566', segment: 'vip', aiScore: '92.50', contactName: 'Ján Novák', contactEmail: 'novak@stavebniny.sk', contactPhone: '+421 901 123 456' },
    { companyName: 'Elektro Slovakia a.s.', ico: '22334455', dic: '3344556677', segment: 'vip', aiScore: '88.30', contactName: 'Mária Horváthová', contactEmail: 'horvath@elektro.sk', contactPhone: '+421 902 234 567' },
    { companyName: 'Autodieľa Plus s.r.o.', ico: '33445566', dic: '4455667788', segment: 'standardny', aiScore: '75.20', contactName: 'Peter Kováč', contactEmail: 'kovac@autodiela.sk', contactPhone: '+421 903 345 678' },
    { companyName: 'Nábytok Design s.r.o.', ico: '44556677', dic: '5566778899', segment: 'standardny', aiScore: '71.80', contactName: 'Anna Vargová', contactEmail: 'varga@nabytok.sk', contactPhone: '+421 904 456 789' },
    { companyName: 'Garáže Bratislava s.r.o.', ico: '55667788', dic: '6677889900', segment: 'novy', aiScore: '45.60', contactName: 'Tomáš Lukáč', contactEmail: 'lukac@garaze.sk', contactPhone: '+421 905 567 890' },
    { companyName: 'Záhradkárstvo Zelená s.r.o.', ico: '66778899', dic: '7788990011', segment: 'standardny', aiScore: '68.40', contactName: 'Eva Baláž', contactEmail: 'balaz@zahradka.sk', contactPhone: '+421 906 678 901' },
    { companyName: 'Kovovýroba Steel s.r.o.', ico: '77889900', dic: '8899001122', segment: 'vip', aiScore: '85.90', contactName: 'Ľubomír Molnár', contactEmail: 'molnar@steel.sk', contactPhone: '+421 907 789 012' },
    { companyName: 'IT Systémy Pro s.r.o.', ico: '88990011', dic: '9900112233', segment: 'standardny', aiScore: '73.20', contactName: 'Zuzana Krajčír', contactEmail: 'krajcir@itsystemy.sk', contactPhone: '+421 908 890 123' },
    { companyName: 'Papiernictvo Express s.r.o.', ico: '99001122', dic: '0011223344', segment: 'rizikovy', aiScore: '32.10', contactName: 'Milan Fabian', contactEmail: 'fabian@papier.sk', contactPhone: '+421 909 901 234' },
    { companyName: 'Chemikálie SK a.s.', ico: '10203040', dic: '1122334455', segment: 'standardny', aiScore: '70.50', contactName: 'Katarína Nagy', contactEmail: 'nagy@chemikalie.sk', contactPhone: '+421 910 012 345' },
  ];

  const customers = await db.insert(schema.customers).values(customerData.map((c, i) => ({
    ...c,
    salesRepId: [sales1.id, sales2.id, sales3.id][i % 3],
    tags: i % 3 === 0 ? 'dlhodoby, preferovany' : i % 3 === 1 ? 'novy' : 'standardny',
  }))).returning();

  console.log('✅ Customers created');

  // Create products
  const productData = [
    { code: 'P001', name: 'Oceľový profil L 50x50x5', category: 'Oceľové profily', price: '12.50', unit: 'm', description: 'Oceľový L profil, galvanizovaný' },
    { code: 'P002', name: 'Oceľový profil U 100x50x6', category: 'Oceľové profily', price: '28.90', unit: 'm', description: 'Oceľový U profil pre konštrukcie' },
    { code: 'P003', name: 'Skrutka M8x60 DIN 933', category: 'Spojovací materiál', price: '0.15', unit: 'ks', description: 'Šesťhranná skrutka so závitom' },
    { code: 'P004', name: 'Podložka M8 DIN 125', category: 'Spojovací materiál', price: '0.05', unit: 'ks', description: 'Plochá podložka' },
    { code: 'P005', name: 'Matica M8 DIN 934', category: 'Spojovací materiál', price: '0.08', unit: 'ks', description: 'Šesťhranná matica' },
    { code: 'P006', name: 'Elektromotor 3kW 1500 ot/min', category: 'Elektromotory', price: '285.00', unit: 'ks', description: 'Trojfázový elektromotor' },
    { code: 'P007', name: 'Frekvenčný menič 3kW', category: 'Automatizácia', price: '420.00', unit: 'ks', description: 'Menič otáčok pre elektromotory' },
    { code: 'P008', name: 'Ložisko 6205 2RS', category: 'Ložiská', price: '8.50', unit: 'ks', description: 'Guľkové ložisko s tesnením' },
    { code: 'P009', name: 'Remeň HTD 8M-1200', category: 'Prevodové prvky', price: '22.00', unit: 'ks', description: 'Ozubený remeň HTD' },
    { code: 'P010', name: 'Kladka HTD 8M Z40', category: 'Prevodové prvky', price: '35.00', unit: 'ks', description: 'Ozubená kladka pre remeň HTD' },
    { code: 'P011', name: 'Hydraulický valec 100/50-400', category: 'Hydraulika', price: '380.00', unit: 'ks', description: 'Hydraulický valec dvojčinný' },
    { code: 'P012', name: 'Hydraulické čerpadlo 20L/min', category: 'Hydraulika', price: '520.00', unit: 'ks', description: 'Hydraulické čerpadlo s elektromotorm' },
    { code: 'P013', name: 'Oceľový plech 3mm 1250x2500', category: 'Plechy', price: '145.00', unit: 'ks', description: 'Oceľový plech čierny' },
    { code: 'P014', name: 'Hliníkový profil 40x40', category: 'Hliníkové profily', price: '8.90', unit: 'm', description: 'Hliníkový konštrukčný profil' },
    { code: 'P015', name: 'Polykarbonátová doska 4mm', category: 'Plasty', price: '18.50', unit: 'm²', description: 'Priehľadná polykarbonátová doska' },
    { code: 'P016', name: 'LED páska 12V teplá biela', category: 'LED osvetlenie', price: '12.00', unit: 'm', description: 'LED pásik s 60 LED/m' },
    { code: 'P017', name: 'Napájací zdroj 12V 5A', category: 'Napájacie zdroje', price: '18.50', unit: 'ks', description: 'Spínaný zdroj pre LED' },
    { code: 'P018', name: 'Snímač teploty PT100', category: 'Senzory', price: '32.00', unit: 'ks', description: 'Odporový teplotný senzor' },
    { code: 'P019', name: 'PLC Siemens S7-1200', category: 'Riadiace systémy', price: '450.00', unit: 'ks', description: 'Programovateľný automat' },
    { code: 'P020', name: 'Dotykový panel HMI 7"', category: 'Riadiace systémy', price: '380.00', unit: 'ks', description: 'Farebný dotykový displej' },
    { code: 'P021', name: 'Kábel CYKY-J 3x1.5', category: 'Káble', price: '1.80', unit: 'm', description: 'Silový kábel' },
    { code: 'P022', name: 'Kábel CYKY-J 3x2.5', category: 'Káble', price: '2.60', unit: 'm', description: 'Silový kábel' },
    { code: 'P023', name: 'Poistka 16A C-char', category: 'Istenie', price: '3.20', unit: 'ks', description: 'Modulová poistkaa' },
    { code: 'P024', name: 'Prúdový chránič 40A/30mA', category: 'Istenie', price: '48.00', unit: 'ks', description: 'FI chránič 2-pólový' },
    { code: 'P025', name: 'Rozvádzač oceľový 600x800x250', category: 'Rozvádzače', price: '185.00', unit: 'ks', description: 'Nástenný rozvádzač IP65' },
    { code: 'P026', name: 'Ventilátor axiálny 230V', category: 'Ventilácia', price: '28.00', unit: 'ks', description: 'Axiálny ventilátor fi 150mm' },
    { code: 'P027', name: 'Filter vzduchu G4 592x592', category: 'Filtrácia', price: '12.50', unit: 'ks', description: 'Panelový filter hrubý' },
    { code: 'P028', name: 'Tlakový spínač 1-10 bar', category: 'Tlakové prístroje', price: '45.00', unit: 'ks', description: 'Nastaviteľný tlakový spínač' },
    { code: 'P029', name: 'Manometer 0-16 bar G1/4"', category: 'Tlakové prístroje', price: '8.50', unit: 'ks', description: 'Radiálny manometer' },
    { code: 'P030', name: 'Guľový ventil 1" PN40', category: 'Armatúry', price: '18.00', unit: 'ks', description: 'Guľový uzáver mosadzný' },
  ];

  await db.insert(schema.products).values(productData.map(p => ({
    ...p,
    stock: Math.floor(Math.random() * 500) + 50,
  })));

  console.log('✅ Products created');

  // Create emails
  const emailData = [
    {
      from: 'novak@stavebniny.sk',
      fromCompany: 'Stavebniny Novák s.r.o.',
      subject: 'Dopyt na oceľové profily',
      body: 'Dobrý deň, potrebujeme naceniť 200m oceľového profilu L 50x50x5. Prosím o zaslanie cenovej ponuky. Ďakujem.',
      category: 'dopyt',
      aiConfidence: '95.50',
      customerId: customers[0].id,
      assignedTo: sales1.id,
      status: 'spracovane',
    },
    {
      from: 'horvath@elektro.sk',
      fromCompany: 'Elektro Slovakia a.s.',
      subject: 'Objednávka elektromotor',
      body: 'Dobrý deň, objednávame 3ks elektromotor 3kW podľa CP-2024-002. Prosím o potvrdenie objednávky.',
      category: 'objednavka',
      aiConfidence: '98.20',
      customerId: customers[1].id,
      assignedTo: sales2.id,
      status: 'spracovane',
    },
    {
      from: 'kovac@autodiela.sk',
      fromCompany: 'Autodieľa Plus s.r.o.',
      subject: 'RE: Faktúra FA-2024-015',
      body: 'Dobrý deň, faktúru sme uhradili dňa 15.1.2024. Prikladám potvrdenie o úhrade.',
      category: 'faktura',
      aiConfidence: '92.80',
      customerId: customers[2].id,
      status: 'nove',
    },
    {
      from: 'varga@nabytok.sk',
      fromCompany: 'Nábytok Design s.r.o.',
      subject: 'Reklamácia - chybný produkt',
      body: 'Dobrý deň, pri poslednej dodávke bol vadný elektromotor (poškodený hriadeľ). Prosím o riešenie reklamácie.',
      category: 'reklamacia',
      aiConfidence: '96.50',
      customerId: customers[3].id,
      assignedTo: sales3.id,
      status: 'nove',
    },
    {
      from: 'lukac@garaze.sk',
      fromCompany: 'Garáže Bratislava s.r.o.',
      subject: 'Cenová ponuka na hydrauliku',
      body: 'Dobrý deň, potrebujeme oceňiť hydraulický systém pre zdvíhacie zariadenie. Potrebujeme 2x hydraulický valec 100/50-400 a 1x čerpadlo 20L/min.',
      category: 'dopyt',
      aiConfidence: '94.20',
      customerId: customers[4].id,
      assignedTo: sales1.id,
      status: 'nove',
    },
    {
      from: 'balaz@zahradka.sk',
      fromCompany: 'Záhradkárstvo Zelená s.r.o.',
      subject: 'Dopyt - LED osvetlenie',
      body: 'Potrebujeme nakúpiť LED osvetlenie do skleníkov. Cca 100m LED pásika + napájacie zdroje. Prosím o cenovú ponuku.',
      category: 'dopyt',
      aiConfidence: '93.10',
      customerId: customers[5].id,
      status: 'nove',
    },
    {
      from: 'molnar@steel.sk',
      fromCompany: 'Kovovýroba Steel s.r.o.',
      subject: 'Objednávka - oceľový plech',
      body: 'Objednávame 50ks oceľový plech 3mm 1250x2500. Termín dodania do 7 dní. Ďakujem.',
      category: 'objednavka',
      aiConfidence: '97.80',
      customerId: customers[6].id,
      assignedTo: sales2.id,
      status: 'nove',
    },
    {
      from: 'krajcir@itsystemy.sk',
      fromCompany: 'IT Systémy Pro s.r.o.',
      subject: 'Otázka k produktu PLC',
      body: 'Dobrý deň, máte na sklade PLC Siemens S7-1200? Aká je dodacia lehota?',
      category: 'ine',
      aiConfidence: '88.50',
      customerId: customers[7].id,
      status: 'nove',
    },
    {
      from: 'fabian@papier.sk',
      fromCompany: 'Papiernictvo Express s.r.o.',
      subject: 'Dopyt kábel',
      body: 'Potrebujeme 500m kábla CYKY-J 3x1.5. Prosím cenu a dodaciu lehotu.',
      category: 'dopyt',
      aiConfidence: '91.20',
      customerId: customers[8].id,
      status: 'nove',
    },
    {
      from: 'nagy@chemikalie.sk',
      fromCompany: 'Chemikálie SK a.s.',
      subject: 'Dopyt ventilátory',
      body: 'Dobrý deň, potrebujeme 10ks axiálny ventilátor 230V + filtre G4. Pošlite ponuku.',
      category: 'dopyt',
      aiConfidence: '92.00',
      customerId: customers[9].id,
      status: 'nove',
    },
  ];

  const emails = await db.insert(schema.emails).values(emailData.map(e => ({
    ...e,
    receivedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  }))).returning();

  console.log('✅ Emails created');

  // Create quotes
  const quoteData = [
    {
      number: 'CP-2024-001',
      customerId: customers[0].id,
      itemsJson: [
        { productCode: 'P001', name: 'Oceľový profil L 50x50x5', quantity: 200, unit: 'm', price: 12.50, total: 2500 },
      ],
      total: '2500.00',
      vat: '500.00',
      status: 'schvalena',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: sales1.id,
    },
    {
      number: 'CP-2024-002',
      customerId: customers[1].id,
      itemsJson: [
        { productCode: 'P006', name: 'Elektromotor 3kW 1500 ot/min', quantity: 3, unit: 'ks', price: 285.00, total: 855 },
      ],
      total: '855.00',
      vat: '171.00',
      status: 'schvalena',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: sales2.id,
    },
    {
      number: 'CP-2024-003',
      customerId: customers[4].id,
      itemsJson: [
        { productCode: 'P011', name: 'Hydraulický valec 100/50-400', quantity: 2, unit: 'ks', price: 380.00, total: 760 },
        { productCode: 'P012', name: 'Hydraulické čerpadlo 20L/min', quantity: 1, unit: 'ks', price: 520.00, total: 520 },
      ],
      total: '1280.00',
      vat: '256.00',
      status: 'odoslana',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: sales1.id,
    },
    {
      number: 'CP-2024-004',
      customerId: customers[5].id,
      itemsJson: [
        { productCode: 'P016', name: 'LED páska 12V teplá biela', quantity: 100, unit: 'm', price: 12.00, total: 1200 },
        { productCode: 'P017', name: 'Napájací zdroj 12V 5A', quantity: 5, unit: 'ks', price: 18.50, total: 92.50 },
      ],
      total: '1292.50',
      vat: '258.50',
      status: 'odoslana',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: sales3.id,
    },
    {
      number: 'CP-2024-005',
      customerId: customers[6].id,
      itemsJson: [
        { productCode: 'P013', name: 'Oceľový plech 3mm 1250x2500', quantity: 50, unit: 'ks', price: 145.00, total: 7250 },
      ],
      total: '7250.00',
      vat: '1450.00',
      status: 'schvalena',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: sales2.id,
    },
  ];

  await db.insert(schema.quotes).values(quoteData);

  console.log('✅ Quotes created');

  // Create invoices
  const invoiceData = [
    {
      number: 'FA-2024-001',
      customerId: customers[0].id,
      itemsJson: quoteData[0].itemsJson,
      total: '2500.00',
      vat: '500.00',
      status: 'zaplatena',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      sourceType: 'cp',
      sourceId: 1,
    },
    {
      number: 'FA-2024-002',
      customerId: customers[1].id,
      itemsJson: quoteData[1].itemsJson,
      total: '855.00',
      vat: '171.00',
      status: 'zaplatena',
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      sourceType: 'cp',
      sourceId: 2,
    },
    {
      number: 'FA-2024-003',
      customerId: customers[6].id,
      itemsJson: quoteData[4].itemsJson,
      total: '7250.00',
      vat: '1450.00',
      status: 'odoslana',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      sourceType: 'cp',
      sourceId: 5,
    },
    {
      number: 'FA-2024-004',
      customerId: customers[2].id,
      itemsJson: [
        { productCode: 'P014', name: 'Hliníkový profil 40x40', quantity: 100, unit: 'm', price: 8.90, total: 890 },
      ],
      total: '890.00',
      vat: '178.00',
      status: 'po_splatnosti',
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      sourceType: 'manual',
    },
    {
      number: 'FA-2024-005',
      customerId: customers[3].id,
      itemsJson: [
        { productCode: 'P019', name: 'PLC Siemens S7-1200', quantity: 2, unit: 'ks', price: 450.00, total: 900 },
        { productCode: 'P020', name: 'Dotykový panel HMI 7"', quantity: 1, unit: 'ks', price: 380.00, total: 380 },
      ],
      total: '1280.00',
      vat: '256.00',
      status: 'vystavena',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      sourceType: 'manual',
    },
  ];

  await db.insert(schema.invoices).values(invoiceData);

  console.log('✅ Invoices created');

  // Create orders
  const orderData = [
    {
      number: 'OBJ-2024-001',
      customerId: customers[1].id,
      itemsJson: quoteData[1].itemsJson,
      total: '855.00',
      status: 'expedovana',
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'OBJ-2024-002',
      customerId: customers[6].id,
      itemsJson: quoteData[4].itemsJson,
      total: '7250.00',
      status: 'potvrdena',
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'OBJ-2024-003',
      customerId: customers[0].id,
      itemsJson: quoteData[0].itemsJson,
      total: '2500.00',
      status: 'dorucena',
      deliveryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  await db.insert(schema.orders).values(orderData);

  console.log('✅ Orders created');

  // Create complaints
  const complaintData = [
    {
      customerId: customers[3].id,
      emailId: emails[3].id,
      category: 'vadny_produkt',
      description: 'Elektromotor má poškodený hriadeľ, nefunguje',
      status: 'v_rieseni',
      assignedTo: sales3.id,
      slaDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      customerId: customers[2].id,
      category: 'oneskorena_dodavka',
      description: 'Dodávka mala prísť pred 5 dňami, stále nič',
      status: 'vyriesena',
      assignedTo: sales1.id,
      resolution: 'Dodávka bola expedovaná s oneskorením z dôvodu výpadku dodávateľa. Zákazník dostal 10% zľavu na ďalší nákup.',
      slaDeadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      customerId: customers[8].id,
      category: 'ine',
      description: 'Nesprávne fakturované množstvo - na faktúre je 600m, objednali sme 500m',
      status: 'prijata',
      assignedTo: accountant.id,
      slaDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  ];

  await db.insert(schema.complaints).values(complaintData);

  console.log('✅ Complaints created');

  // Create dashboard stats for last 30 days
  const stats = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    stats.push({
      date,
      inquiries: Math.floor(Math.random() * 10) + 2,
      quotesSent: Math.floor(Math.random() * 5) + 1,
      orders: Math.floor(Math.random() * 3),
      revenue: (Math.random() * 5000 + 1000).toFixed(2),
      newCustomers: Math.random() > 0.7 ? 1 : 0,
    });
  }

  await db.insert(schema.dashboardStats).values(stats);

  console.log('✅ Dashboard stats created');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Test credentials:');
  console.log('   🛡️  Super Admin: superadmin@biznisagent.sk / superadmin123');
  console.log('   Admin: admin@biznisagent.sk / password123');
  console.log('   Sales: jana@biznisagent.sk / password123');
  console.log('   Accountant: eva@biznisagent.sk / password123');
  
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
