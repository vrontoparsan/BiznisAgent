import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { users } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return res.status(401).json({ error: 'Nesprávny email alebo heslo' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Nesprávny email alebo heslo' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Chyba pri prihlasovaní' });
  }
});

// One-time setup: create superadmin if not exists
router.get('/setup-superadmin', async (req, res) => {
  try {
    const [existing] = await db.select().from(users).where(eq(users.email, 'superadmin@biznisagent.sk')).limit(1);
    if (existing) {
      return res.json({ message: 'Superadmin already exists', id: existing.id });
    }
    const hash = await bcrypt.hash('superadmin123', 10);
    const [user] = await db.insert(users).values({
      email: 'superadmin@biznisagent.sk',
      passwordHash: hash,
      name: 'Super Admin',
      role: 'superadmin',
    }).returning();
    res.json({ message: 'Superadmin created', id: user.id });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Setup failed', details: String(error) });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Chýba autorizácia' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (!user) {
      return res.status(401).json({ error: 'Používateľ nenájdený' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(401).json({ error: 'Neplatný token' });
  }
});

export default router;
