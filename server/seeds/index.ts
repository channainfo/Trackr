import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

import { usersTable } from '@shared/schema';


const db = drizzle(process.env.DATABASE_URL!);


async function main() {
  const user: any = {
    username: 'John',
    password: 'password123',
    confirmPassword: 'password123',
    isAdmin: false,
    themePreference: 'dark',
    createdAt: new Date(),
    email: 'channa.info@gmail.com',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!');

  const records = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', records);

  await db
    .update(usersTable)
    .set({
      isAdmin: true,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!');

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!');
}

main();
