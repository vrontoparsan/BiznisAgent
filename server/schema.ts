import { pgTable, serial, text, timestamp, integer, decimal, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(), // admin, obchodnik, uctovnik, viewer
  createdAt: timestamp('created_at').defaultNow(),
});

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ico: text('ico'),
  dic: text('dic'),
  icDph: text('ic_dph'),
  address: text('address'),
  iban: text('iban'),
  logoUrl: text('logo_url'),
  settingsJson: jsonb('settings_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const emails = pgTable('emails', {
  id: serial('id').primaryKey(),
  from: text('from').notNull(),
  fromCompany: text('from_company'),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  receivedAt: timestamp('received_at').defaultNow(),
  category: text('category'), // dopyt, objednavka, reklamacia, faktura, ine
  aiConfidence: decimal('ai_confidence', { precision: 5, scale: 2 }),
  status: text('status').default('nove'), // nove, spracovane, priradene
  assignedTo: integer('assigned_to').references(() => users.id),
  customerId: integer('customer_id').references(() => customers.id),
});

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  companyName: text('company_name').notNull(),
  ico: text('ico'),
  dic: text('dic'),
  address: text('address'),
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  segment: text('segment').default('standardny'), // vip, standardny, novy, rizikovy
  aiScore: decimal('ai_score', { precision: 5, scale: 2 }),
  salesRepId: integer('sales_rep_id').references(() => users.id),
  tags: text('tags'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  category: text('category'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0),
  unit: text('unit').default('ks'),
  description: text('description'),
  isComposite: boolean('is_composite').default(false),
  componentsJson: jsonb('components_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  number: text('number').notNull().unique(),
  customerId: integer('customer_id').references(() => customers.id),
  itemsJson: jsonb('items_json').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  vat: decimal('vat', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('odoslana'), // odoslana, schvalena, zamietnuta, expirovana
  validUntil: timestamp('valid_until'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  number: text('number').notNull().unique(),
  customerId: integer('customer_id').references(() => customers.id),
  type: text('type').default('vystavena'), // vystavena, odoslana, zaplatena, po_splatnosti
  itemsJson: jsonb('items_json').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  vat: decimal('vat', { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp('due_date'),
  status: text('status').default('vystavena'),
  paymentId: text('payment_id'),
  sourceType: text('source_type'), // cp, delivery_note, email, manual
  sourceId: integer('source_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  number: text('number').notNull().unique(),
  customerId: integer('customer_id').references(() => customers.id),
  itemsJson: jsonb('items_json').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('nova'), // nova, potvrdena, expedovana, dorucena
  deliveryDate: timestamp('delivery_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const deliveryNotes = pgTable('delivery_notes', {
  id: serial('id').primaryKey(),
  number: text('number').notNull().unique(),
  orderId: integer('order_id').references(() => orders.id),
  customerId: integer('customer_id').references(() => customers.id),
  itemsJson: jsonb('items_json').notNull(),
  status: text('status').default('vytvorena'), // vytvorena, expedovana, dorucena
  createdAt: timestamp('created_at').defaultNow(),
});

export const complaints = pgTable('complaints', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  emailId: integer('email_id').references(() => emails.id),
  category: text('category'),
  description: text('description').notNull(),
  status: text('status').default('prijata'), // prijata, v_rieseni, vyriesena
  assignedTo: integer('assigned_to').references(() => users.id),
  resolution: text('resolution'),
  slaDeadline: timestamp('sla_deadline'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const dashboardStats = pgTable('dashboard_stats', {
  id: serial('id').primaryKey(),
  date: timestamp('date').notNull(),
  inquiries: integer('inquiries').default(0),
  quotesSent: integer('quotes_sent').default(0),
  orders: integer('orders').default(0),
  revenue: decimal('revenue', { precision: 12, scale: 2 }).default('0'),
  newCustomers: integer('new_customers').default(0),
});
