"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
let User = class User {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
User = __decorate([
    (0, graphql_1.ObjectType)()
], User);
let AuthPayload = class AuthPayload {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthPayload.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => User),
    __metadata("design:type", User)
], AuthPayload.prototype, "user", void 0);
AuthPayload = __decorate([
    (0, graphql_1.ObjectType)()
], AuthPayload);
let RegisterInput = class RegisterInput {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RegisterInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RegisterInput.prototype, "role", void 0);
RegisterInput = __decorate([
    (0, graphql_1.InputType)()
], RegisterInput);
let LoginInput = class LoginInput {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    (0, graphql_1.InputType)()
], LoginInput);
let AuthResolver = class AuthResolver {
    constructor() {
        this.authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
    }
    async me(ctx) {
        var _a;
        const req = ctx.req;
        const auth = typeof req.headers.authorization === 'string' ? req.headers.authorization : ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a[0]) || '';
        if (!auth)
            return null;
        const resp = await fetch(`${this.authUrl}/auth/verify`, { headers: { Authorization: auth } });
        if (!resp.ok)
            return null;
        const body = await resp.json();
        return body.user || body;
    }
    async register(input) {
        const resp = await fetch(`${this.authUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: input.name,
                email: input.email,
                password: input.password,
                role: input.role,
            }),
        });
        if (!resp.ok)
            throw new Error('Register failed');
        return resp.json();
    }
    async login(input) {
        const resp = await fetch(`${this.authUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: input.email, password: input.password }),
        });
        if (!resp.ok)
            throw new Error('Login failed');
        return resp.json();
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Query)(() => User, { nullable: true }),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "me", null);
__decorate([
    (0, graphql_1.Mutation)(() => AuthPayload),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "register", null);
__decorate([
    (0, graphql_1.Mutation)(() => AuthPayload),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)()
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map