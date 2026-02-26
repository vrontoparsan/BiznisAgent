import { Router } from 'express';
import { db } from '../db.js';
import { quotes, invoices, orders, deliveryNotes, customers } from '../schema.js';
import { eq, desc, sql } from 'drizzle-orm';

const router = Router();

// Quotes
router.get('/quotes', async (req, res) => {
  try {
    const result = await db
      .select({
        id: quotes.id,
        number: quotes.number,
        customerId: quotes.customerId,
        customerName: customers.companyName,
        itemsJson: quotes.itemsJson,
        total: quotes.total,
        vat: quotes.vat,
        status: quotes.status,
        validUntil: quotes.validUntil,
        createdBy: quotes.createdBy,
        createdAt: quotes.createdAt,
      })
      .from(quotes)
      .leftJoin(customers, eq(quotes.customerId, customers.id))
      .orderBy(desc(quotes.createdAt));

    res.json(result);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Chyba pri načítaní cenových ponúk' });
  }
});

router.post('/quotes', async (req, res) => {
  try {
    const { customerId, itemsJson, total, vat, validUntil, createdBy } = req.body;

    // Generate quote number
    const [lastQuote] = await db.select().from(quotes).orderBy(desc(quotes.id)).limit(1);
    const lastNumber = lastQuote ? parseInt(lastQuote.number.split('-')[2]) : 0;
    const number = `CP-2024-${String(lastNumber + 1).padStart(3, '0')}`;

    const [newQuote] = await db
      .insert(quotes)
      .values({ number, customerId, itemsJson, total, vat, validUntil, createdBy })
      .returning();

    res.json(newQuote);
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ error: 'Chyba pri vytváraní cenovej ponuky' });
  }
});

// Invoices
router.get('/invoices', async (req, res) => {
  try {
    const result = await db
      .select({
        id: invoices.id,
        number: invoices.number,
        customerId: invoices.customerId,
        customerName: customers.companyName,
        type: invoices.type,
        itemsJson: invoices.itemsJson,
        total: invoices.total,
        vat: invoices.vat,
        dueDate: invoices.dueDate,
        status: invoices.status,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .orderBy(desc(invoices.createdAt));

    res.json(result);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Chyba pri načítaní faktúr' });
  }
});

router.post('/invoices', async (req, res) => {
  try {
    const { customerId, itemsJson, total, vat, dueDate, sourceType, sourceId } = req.body;

    // Generate invoice number
    const [lastInvoice] = await db.select().from(invoices).orderBy(desc(invoices.id)).limit(1);
    const lastNumber = lastInvoice ? parseInt(lastInvoice.number.split('-')[2]) : 0;
    const number = `FA-2024-${String(lastNumber + 1).padStart(3, '0')}`;

    const [newInvoice] = await db
      .insert(invoices)
      .values({ number, customerId, itemsJson, total, vat, dueDate, sourceType, sourceId })
      .returning();

    res.json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Chyba pri vytváraní faktúry' });
  }
});

// Orders
router.get('/orders', async (req, res) => {
  try {
    const result = await db
      .select({
        id: orders.id,
        number: orders.number,
        customerId: orders.customerId,
        customerName: customers.companyName,
        itemsJson: orders.itemsJson,
        total: orders.total,
        status: orders.status,
        deliveryDate: orders.deliveryDate,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .orderBy(desc(orders.createdAt));

    res.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Chyba pri načítaní objednávok' });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const { customerId, itemsJson, total, deliveryDate } = req.body;

    // Generate order number
    const [lastOrder] = await db.select().from(orders).orderBy(desc(orders.id)).limit(1);
    const lastNumber = lastOrder ? parseInt(lastOrder.number.split('-')[2]) : 0;
    const number = `OBJ-2024-${String(lastNumber + 1).padStart(3, '0')}`;

    const [newOrder] = await db
      .insert(orders)
      .values({ number, customerId, itemsJson, total, deliveryDate })
      .returning();

    res.json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Chyba pri vytváraní objednávky' });
  }
});

// Delivery Notes
router.get('/delivery-notes', async (req, res) => {
  try {
    const result = await db
      .select({
        id: deliveryNotes.id,
        number: deliveryNotes.number,
        orderId: deliveryNotes.orderId,
        customerId: deliveryNotes.customerId,
        customerName: customers.companyName,
        itemsJson: deliveryNotes.itemsJson,
        status: deliveryNotes.status,
        createdAt: deliveryNotes.createdAt,
      })
      .from(deliveryNotes)
      .leftJoin(customers, eq(deliveryNotes.customerId, customers.id))
      .orderBy(desc(deliveryNotes.createdAt));

    res.json(result);
  } catch (error) {
    console.error('Error fetching delivery notes:', error);
    res.status(500).json({ error: 'Chyba pri načítaní dodacích listov' });
  }
});

export default router;
