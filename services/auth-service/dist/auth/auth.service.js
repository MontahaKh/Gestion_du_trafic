"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pg_1 = require("pg");
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://webuser:webpass@localhost:5432/webservice';
let AuthService = class AuthService {
    constructor() {
        this.pool = new pg_1.Pool({ connectionString: DATABASE_URL });
    }
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
    async register(name, email, password, role) {
        const normalizedEmail = email.trim().toLowerCase();
        const resolvedName = (name === null || name === void 0 ? void 0 : name.trim()) || normalizedEmail.split('@')[0] || normalizedEmail;
        const existing = await this.pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [normalizedEmail]);
        if (existing.rowCount)
            throw new Error('Email already used');
        const hash = await bcrypt.hash(password, 10);
        const inserted = await this.pool.query(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, password_hash, role
      `, [resolvedName, normalizedEmail, hash, role || 'OPERATOR']);
        const user = inserted.rows[0];
        const token = this.generateToken(user);
        return { token, user: this.safeUser(user) };
    }
    async login(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const result = await this.pool.query('SELECT id, name, email, password_hash, role FROM users WHERE email = $1 LIMIT 1', [normalizedEmail]);
        const user = result.rows[0];
        if (!user)
            throw new Error('Invalid credentials');
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok)
            throw new Error('Invalid credentials');
        const token = this.generateToken(user);
        return { token, user: this.safeUser(user) };
    }
    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        }
        catch (err) {
            throw new Error('Invalid token');
        }
    }
    generateToken(user) {
        const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    }
    safeUser(user) {
        const { id, name, email, role } = user;
        return { id: String(id), name, email, role };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map