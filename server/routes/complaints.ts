import { Router } from 'express';
import { db } from '../db.js';
import { complaints, customers, users } from '../schema.js';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await db
      .select({
        id: complaints.id,
        customerId: complaints.customerId,
        customerName: customers.companyName,
        emailId: complaints.emailId,
        category: complaints.category,
        description: complaints.description,
        status: complaints.status,
        assignedTo: complaints.assignedTo,
        assignedToName: users.name,
        resolution: complaints.resolution,
        slaDeadline: complaints.slaDeadline,
        createdAt: complaints.createdAt,
      })
      .from(complaints)
      .leftJoin(customers, eq(complaints.customerId, customers.id))
      .leftJoin(users, eq(complaints.assignedTo, users.id))
      .orderBy(desc(complaints.createdAt));

    res.json(result);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Chyba pri načítaní reklamácií' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [complaint] = await db
      .select()
      .from(complaints)
      .where(eq(complaints.id, parseInt(req.params.id)))
      .limit(1);

    if (!complaint) {
      return res.status(404).json({ error: 'Reklamácia nenájdená' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ error: 'Chyba pri načítaní reklamácie' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerId, emailId, category, description, assignedTo } = req.body;

    const slaDeadline = new Date();
    slaDeadline.setDate(slaDeadline.getDate() + 5); // 5 days SLA

    const [newComplaint] = await db
      .insert(complaints)
      .values({
        customerId,
        emailId,
        category,
        description,
        assignedTo,
        slaDeadline,
        status: 'prijata',
      })
      .returning();

    res.json(newComplaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: 'Chyba pri vytváraní reklamácie' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { status, assignedTo, resolution } = req.body;

    const [updated] = await db
      .update(complaints)
      .set({ status, assignedTo, resolution })
      .where(eq(complaints.id, parseInt(req.params.id)))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Chyba pri aktualizácii reklamácie' });
  }
});

export default router;
