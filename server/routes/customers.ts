import { Router } from 'express';
import { db } from '../db.js';
import { customers, users } from '../schema.js';
import { eq, like, or, desc } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { search, segment } = req.query;

    let query = db
      .select({
        id: customers.id,
        companyName: customers.companyName,
        ico: customers.ico,
        dic: customers.dic,
        address: customers.address,
        contactName: customers.contactName,
        contactEmail: customers.contactEmail,
        contactPhone: customers.contactPhone,
        segment: customers.segment,
        aiScore: customers.aiScore,
        salesRepId: customers.salesRepId,
        salesRepName: users.name,
        tags: customers.tags,
        notes: customers.notes,
        createdAt: customers.createdAt,
      })
      .from(customers)
      .leftJoin(users, eq(customers.salesRepId, users.id));

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(customers.companyName, searchTerm),
          like(customers.ico, searchTerm),
          like(customers.contactName, searchTerm),
          like(customers.contactEmail, searchTerm)
        )
      );
    }

    if (segment) {
      query = query.where(eq(customers.segment, segment as string));
    }

    const result = await query.orderBy(desc(customers.createdAt));

    res.json(result);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Chyba pri načítaní zákazníkov' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, parseInt(req.params.id)))
      .limit(1);

    if (!customer) {
      return res.status(404).json({ error: 'Zákazník nenájdený' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Chyba pri načítaní zákazníka' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      companyName,
      ico,
      dic,
      address,
      contactName,
      contactEmail,
      contactPhone,
      segment,
      salesRepId,
      tags,
      notes,
    } = req.body;

    const [newCustomer] = await db
      .insert(customers)
      .values({
        companyName,
        ico,
        dic,
        address,
        contactName,
        contactEmail,
        contactPhone,
        segment,
        salesRepId,
        tags,
        notes,
      })
      .returning();

    res.json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Chyba pri vytváraní zákazníka' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const {
      companyName,
      ico,
      dic,
      address,
      contactName,
      contactEmail,
      contactPhone,
      segment,
      salesRepId,
      tags,
      notes,
    } = req.body;

    const [updated] = await db
      .update(customers)
      .set({
        companyName,
        ico,
        dic,
        address,
        contactName,
        contactEmail,
        contactPhone,
        segment,
        salesRepId,
        tags,
        notes,
      })
      .where(eq(customers.id, parseInt(req.params.id)))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Chyba pri aktualizácii zákazníka' });
  }
});

export default router;
