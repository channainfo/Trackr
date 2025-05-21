// db.test.ts
import { InsertUser, usersTable } from '@shared/schema';
import { db } from '@server/db';

describe('Database Tests', () => {
  const userData = {
    username: 'testuser1',
    email: 'joe@gmail.com',
    password: 'password123',
    isAdmin: false,
    themePreference: 'dark',
  } as InsertUser;

  test('should query users from database', async () => {
    // Insert test data for this specific test
    await db.insert(usersTable).values(userData);

    const result = await db.select().from(usersTable);
    expect(result.length).toBe(1);
    expect(result[0].username).toBe(userData.username);
  });

  test('database should be empty after previous test', async () => {
    // This test proves that the database is reset between tests
    const result = await db.select().from(usersTable);
    expect(result.length).toBe(0); // Should be empty because afterEach hook ran

    // Now we can insert our test data for this test
    await db.insert(usersTable).values(userData);

    const updatedResult = await db.select().from(usersTable);
    expect(updatedResult.length).toBe(1);
  });
});
