import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

type User = { id: number; name: string; email: string; passwordHash: string; role: string };

@Injectable()
export class AuthService {
  private users: User[] = [];
  private nextId = 1;

  async register(name: string, email: string, password: string, role?: string) {
    if (this.users.find(u => u.email === email)) throw new Error('Email already used');
    const hash = await bcrypt.hash(password, 10);
    const user: User = { id: this.nextId++, name, email, passwordHash: hash, role: role || 'OPERATOR' };
    this.users.push(user);
    const token = this.generateToken(user);
    return { token, user: this.safeUser(user) };
  }

  async login(email: string, password: string) {
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
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

  private generateToken(user: User) {
    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  private safeUser(user: User) {
    const { id, name, email, role } = user;
    return { id, name, email, role };
  }
}
