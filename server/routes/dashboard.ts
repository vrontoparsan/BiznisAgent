import { Router } from 'express';
import { db } from '../db.js';
import { dashboardStats, emails, quotes, invoices, orders } from '../schema.js';
import { eq, gte, and, desc, sql } from 'drizzle-orm';

const router = Router();

router.get('/stats', async (req, res) => {
  try {
    const { from, to } = req.query;

    const fromDate = from ? new Date(from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to as string) : new Date();

    const stats = await db
      .select()
      .from(dashboardStats)
      .where(
        and(
          gte(dashboardStats.date, fromDate),
          sql`${dashboardStats.date} <= ${toDate}`
        )
      )
      .orderBy(dashboardStats.date);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Chyba pri načítaní štatistík' });
  }
});

router.get('/kpi', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Inquiries today
    const [inquiriesToday] = await db
      .select({ count: sql<number>`count(*)` })
      .from(emails)
      .where(and(eq(emails.category, 'dopyt'), gte(emails.receivedAt, today)));

    // Quotes this month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const [quotesThisMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quotes)
      .where(gte(quotes.createdAt, monthStart));

    // Revenue this month
    const [revenueResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${invoices.total} AS DECIMAL)), 0)` })
      .from(invoices)
      .where(and(eq(invoices.status, 'zaplatena'), gte(invoices.createdAt, monthStart)));

    // Overdue invoices
    const [overdueResult] = await db
      .select({ 
        count: sql<number>`count(*)`,
        total: sql<number>`COALESCE(SUM(CAST(${invoices.total} AS DECIMAL)), 0)`
      })
      .from(invoices)
      .where(and(eq(invoices.status, 'po_splatnosti')));

    res.json({
      inquiriesToday: inquiriesToday?.count || 0,
      quotesThisMonth: quotesThisMonth?.count || 0,
      revenueThisMonth: revenueResult?.total || 0,
      overdueInvoices: {
        count: overdueResult?.count || 0,
        total: overdueResult?.total || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching KPI:', error);
    res.status(500).json({ error: 'Chyba pri načítaní KPI' });
  }
});

export default router;
