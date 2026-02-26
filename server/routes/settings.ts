import { Router } from 'express';
import { db } from '../db.js';
import { companies, users } from '../schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const router = Router();

// Company settings
router.get('/company', async (req, res) => {
  try {
    const [company] = await db.select().from(companies).limit(1);

    if (!company) {
      return res.status(404).json({ error: 'Firma nenájdená' });
    }

    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Chyba pri načítaní firmy' });
  }
});

router.patch('/company', async (req, res) => {
  try {
    const { name, ico, dic, icDph, address, iban, logoUrl, settingsJson } = req.body;

    const [company] = await db.select().from(companies).limit(1);

    if (!company) {
      // Create new company
      const [newCompany] = await db
        .insert(companies)
        .values({ name, ico, dic, icDph, address, iban, logoUrl, settingsJson })
        .returning();
      return res.json(newCompany);
    }

    const [updated] = await db
      .update(companies)
      .set({ name, ico, dic, icDph, address, iban, logoUrl, settingsJson })
      .where(eq(companies.id, company.id))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Chyba pri aktualizácii firmy' });
  }
});

// Users management
router.get('/users', async (req, res) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users);

    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Chyba pri načítaní používateľov' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({ email, passwordHash: hashedPassword, name, role })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Chyba pri vytváraní používateľa' });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    const { name, role, password } = req.body;

    const updateData: any = { name, role };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(req.params.id)))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    res.json(updated);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Chyba pri aktualizácii používateľa' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await db.delete(users).where(eq(users.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Chyba pri odstraňovaní používateľa' });
  }
});

export default router;
