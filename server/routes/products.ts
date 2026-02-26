import { Router } from 'express';
import { db } from '../db.js';
import { products } from '../schema.js';
import { eq, like, or, desc } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = db.select().from(products);

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(products.name, searchTerm),
          like(products.code, searchTerm),
          like(products.description, searchTerm)
        )
      );
    }

    if (category) {
      query = query.where(eq(products.category, category as string));
    }

    const result = await query.orderBy(products.code);

    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Chyba pri načítaní produktov' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const result = await db
      .selectDistinct({ category: products.category })
      .from(products)
      .where(eq(products.category, products.category));

    const categories = result.map(r => r.category).filter(Boolean);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Chyba pri načítaní kategórií' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { code, name, category, price, stock, unit, description, isComposite, componentsJson } = req.body;

    const [newProduct] = await db
      .insert(products)
      .values({ code, name, category, price, stock, unit, description, isComposite, componentsJson })
      .returning();

    res.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Chyba pri vytváraní produktu' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { name, category, price, stock, unit, description } = req.body;

    const [updated] = await db
      .update(products)
      .set({ name, category, price, stock, unit, description })
      .where(eq(products.id, parseInt(req.params.id)))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Chyba pri aktualizácii produktu' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.delete(products).where(eq(products.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Chyba pri odstraňovaní produktu' });
  }
});

export default router;
