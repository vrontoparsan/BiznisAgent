import { Router } from 'express';
import { db } from '../db.js';
import { emails, customers } from '../schema.js';
import { eq, desc, and, or, sql } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { filter, assignedTo } = req.query;

    let query = db.select({
      id: emails.id,
      from: emails.from,
      fromCompany: emails.fromCompany,
      subject: emails.subject,
      body: emails.body,
      receivedAt: emails.receivedAt,
      category: emails.category,
      aiConfidence: emails.aiConfidence,
      status: emails.status,
      assignedTo: emails.assignedTo,
      customerId: emails.customerId,
    }).from(emails);

    if (filter === 'nove') {
      query = query.where(eq(emails.status, 'nove'));
    } else if (filter === 'spracovane') {
      query = query.where(eq(emails.status, 'spracovane'));
    } else if (assignedTo) {
      query = query.where(eq(emails.assignedTo, parseInt(assignedTo as string)));
    }

    const result = await query.orderBy(desc(emails.receivedAt));

    res.json(result);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Chyba pri načítaní emailov' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [email] = await db.select().from(emails).where(eq(emails.id, parseInt(req.params.id))).limit(1);

    if (!email) {
      return res.status(404).json({ error: 'Email nenájdený' });
    }

    // Also fetch customer if exists
    let customer = null;
    if (email.customerId) {
      [customer] = await db.select().from(customers).where(eq(customers.id, email.customerId)).limit(1);
    }

    res.json({ ...email, customer });
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: 'Chyba pri načítaní emailu' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { status, assignedTo, customerId } = req.body;

    const [updated] = await db
      .update(emails)
      .set({ status, assignedTo, customerId })
      .where(eq(emails.id, parseInt(req.params.id)))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Chyba pri aktualizácii emailu' });
  }
});

export default router;
