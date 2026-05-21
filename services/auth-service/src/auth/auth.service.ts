import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://webuser:webpass@localhost:5432/webservice';

type StoredUser = { id: number; name: string; email: string; password_hash: string; role: string };
type SafeUser = { id: string; name: string; email: string; role: string };

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool({ connectionString: DATABASE_URL });

  async onModuleInit() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'OPERATOR',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async register(name: string, email: string, password: string, role?: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const resolvedName = name?.trim() || normalizedEmail.split('@')[0] || normalizedEmail;
    const existing = await this.pool.query<StoredUser>('SELECT id FROM users WHERE email = $1 LIMIT 1', [normalizedEmail]);
    if (existing.rowCount) throw new Error('Email already used');

    const hash = await bcrypt.hash(password, 10);
    const inserted = await this.pool.query<StoredUser>(
      `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, password_hash, role
      `,
      [resolvedName, normalizedEmail, hash, role || 'OPERATOR'],
    );

    const user = inserted.rows[0];
    const token = this.generateToken(user);
    return { token, user: this.safeUser(user) };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await this.pool.query<StoredUser>(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1 LIMIT 1',
      [normalizedEmail],
    );
    const user = result.rows[0];
    if (!user) throw new Error('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new Error('Invalid credentials');
    const token = this.generateToken(user);
    return { token, user: this.safeUser(user) };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  private generateToken(user: StoredUser) {
    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  private safeUser(user: StoredUser): SafeUser {
    const { id, name, email, role } = user;
    return { id: String(id), name, email, role };
  }
}
