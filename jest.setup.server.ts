// jest.setup.ts - Efficient database reset for PostgreSQL with Drizzle ORM
import 'dotenv/config';
import { db, pool } from './server/db';
import { sql } from 'drizzle-orm';

// This function resets the database by truncating all tables
async function resetDatabase() {
  try {
    // Get all non-system tables in the database
    const tablesResult = await db.execute(sql`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    const tableNames = tablesResult.rows.map(row => row.tablename);

    if (tableNames.length === 0) {
      console.warn('WARNING: No tables found in database!');
      return;
    }

    // Use a transaction for the reset
    await db.transaction(async (tx) => {
      // Temporarily disable foreign key constraints
      await tx.execute(sql`SET session_replication_role = 'replica';`);

      // Truncate all tables in one statement
      const truncateStatement = `TRUNCATE TABLE ${tableNames.map(name => `"${name}"`).join(', ')} RESTART IDENTITY CASCADE`;
      await tx.execute(sql.raw(truncateStatement));

      // Re-enable foreign key constraints
      await tx.execute(sql`SET session_replication_role = 'origin';`);
    });
  } catch (error) {
    console.error('Failed to reset database:', error);
    throw error;
  }
}

// For direct calling from individual test files if needed
export { resetDatabase };

// Jest lifecycle hooks
beforeAll(async () => {
  // Safety check to prevent accidentally running in production
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Tests must be run with NODE_ENV=test to prevent data loss');
  }
});

// Reset database after each test
afterEach(async () => {
  await resetDatabase();
});

// Clean up connections after all tests
afterAll(async () => {
  await pool.end();
});