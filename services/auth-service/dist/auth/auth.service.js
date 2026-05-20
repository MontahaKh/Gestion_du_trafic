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
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';
let AuthService = class AuthService {
    constructor() {
        this.users = [];
        this.nextId = 1;
    }
    async register(name, email, password, role) {
        const resolvedName = (name === null || name === void 0 ? void 0 : name.trim()) || email.split('@')[0] || email;
        if (this.users.find(u => u.email === email))
            throw new Error('Email already used');
        const hash = await bcrypt.hash(password, 10);
        const user = { id: this.nextId++, name: resolvedName, email, passwordHash: hash, role: role || 'OPERATOR' };
        this.users.push(user);
        const token = this.generateToken(user);
        return { token, user: this.safeUser(user) };
    }
    async login(email, password) {
        const user = this.users.find(u => u.email === email);
        if (!user)
            throw new Error('Invalid credentials');
        const ok = await bcrypt.compare(password, user.passwordHash);
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
        return { id, name, email, role };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map