import session from 'express-session';
import createMemoryStore from 'memorystore';
import connectPg from 'connect-pg-simple';
import { pool } from '../db';

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export class SessionStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = process.env.NODE_ENV === 'production'
      ? new PostgresSessionStore({ pool, tableName: 'sessions', createTableIfMissing: true })
      : new MemoryStore({ checkPeriod: 86400000 }); // Prune expired entries every 24h
  }
}
