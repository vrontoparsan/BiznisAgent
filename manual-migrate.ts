import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

async function runMigration() {
  console.log('Starting manual table creation...');
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    console.log('✓ Created users table');

    await sql`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        ico TEXT,
        dic TEXT,
        ic_dph TEXT,
        address TEXT,
        iban TEXT,
        logo_url TEXT,
        settings_json JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    console.log('✓ Created companies table');

    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        company_name TEXT NOT NULL,
        ico TEXT,
        dic TEXT,
        address TEXT,
        contact_name TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        segment TEXT DEFAULT 'standardny',
        ai_score DECIMAL(5, 2),
        sales_rep_id INTEGER REFERENCES users(id),
        tags TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    console.log('✓ Created customers table');

    await sql`
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        "from" TEXT NOT NULL,
        from_company TEXT,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        received_at TIMESTAMP DEFAULT NOW(),
        category TEXT,
        ai_confidence DECIMAL(5, 2),
        status TEXT DEFAULT 'nove',
        assigned_to INTEGER REFERENCES users(id),
        customer_id INTEGER REFERENCES customers(id)
      )`;
    console.log('✓ Created emails table');

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        category TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER DEFAULT 0,
        unit TEXT DEFAULT 'ks',
        description TEXT,
        is_composite BOOLEAN DEFAULT FALSE,
        components_json JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    console.log('✓ Created products table');

    await sql`
      CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        number TEXT NOT NULL UNIQUE,
        customer_id INTEGER REFERENCES customers(id),
        items_json JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        vat DECIMAL(10, 2) NOT NULL,
        status TEXT DEFAULT 'odoslana',
        valid_until TIMESTAMP,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    console.log('✓ Created quotes table');

    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        number TEXT NOT NULL UNIQUE,
        customer_id INTEGER REFERENCES customers(id),
        type TEXT DEFAULT 'vystavena',
        items_json JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        vat DECIMAL(10, 2) NOT NULL,
        due_date TIMESTAMP,
        status TEXT DEFAULT 'vystavena',
        payment_id TEXT,
        source_type TEXT,
        source_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    console.log('✓ Created invoices table');

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        number TEXT NOT NULL UNIQUE,
        customer_id INTEGER REFERENCES customers(id),
        items_json JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status TEXT DEFAULT 'nova',
        delivery_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    console.log('✓ Created orders table');

    await sql`
      CREATE TABLE IF NOT EXISTS delivery_notes (
        id SERIAL PRIMARY KEY,
        number TEXT NOT NULL UNIQUE,
        order_id INTEGER REFERENCES orders(id),
        customer_id INTEGER REFERENCES customers(id),
        items_json JSONB NOT NULL,
        status TEXT DEFAULT 'vytvorena',
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    console.log('✓ Created delivery_notes table');

    await sql`
      CREATE TABLE IF NOT EXISTS complaints (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        email_id INTEGER REFERENCES emails(id),
        category TEXT,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'prijata',
        assigned_to INTEGER REFERENCES users(id),
        resolution TEXT,
        sla_deadline TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    console.log('✓ Created complaints table');

    await sql`
      CREATE TABLE IF NOT EXISTS dashboard_stats (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP NOT NULL,
        inquiries INTEGER DEFAULT 0,
        quotes_sent INTEGER DEFAULT 0,
        orders INTEGER DEFAULT 0,
        revenue DECIMAL(12, 2) DEFAULT 0,
        new_customers INTEGER DEFAULT 0
      )`;
    console.log('✓ Created dashboard_stats table');
    
    console.log('\n✅ All tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

runMigration().catch(console.error);
