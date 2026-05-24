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
exports.IncidentResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
let Incident = class Incident {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Incident.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Incident.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Incident.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Incident.prototype, "zone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Incident.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Incident.prototype, "severity", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Incident.prototype, "reportedBy", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Incident.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Incident.prototype, "updatedAt", void 0);
Incident = __decorate([
    (0, graphql_1.ObjectType)()
], Incident);
let ReportIncidentInput = class ReportIncidentInput {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ReportIncidentInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReportIncidentInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReportIncidentInput.prototype, "zone", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReportIncidentInput.prototype, "severity", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReportIncidentInput.prototype, "reportedBy", void 0);
ReportIncidentInput = __decorate([
    (0, graphql_1.InputType)()
], ReportIncidentInput);
let IncidentResolver = class IncidentResolver {
    constructor() {
        this.incidentUrl = process.env.INCIDENT_SERVICE_URL || 'http://localhost:4003';
    }
    async incidents(status) {
        const suffix = status ? `?status=${encodeURIComponent(status)}` : '';
        const resp = await fetch(`${this.incidentUrl}/incidents${suffix}`);
        if (!resp.ok)
            throw new Error('Incident list failed');
        return resp.json();
    }
    async incident(id) {
        const resp = await fetch(`${this.incidentUrl}/incidents/${encodeURIComponent(id)}`);
        if (!resp.ok)
            throw new Error('Incident detail failed');
        return resp.json();
    }
    async reportIncident(input) {
        const resp = await fetch(`${this.incidentUrl}/incidents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });
        if (!resp.ok)
            throw new Error('Incident report failed');
        return resp.json();
    }
    async updateIncidentStatus(id, status) {
        const resp = await fetch(`${this.incidentUrl}/incidents/${encodeURIComponent(id)}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!resp.ok)
            throw new Error('Incident status update failed');
        return resp.json();
    }
};
exports.IncidentResolver = IncidentResolver;
__decorate([
    (0, graphql_1.Query)(() => [Incident]),
    __param(0, (0, graphql_1.Args)('status', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentResolver.prototype, "incidents", null);
__decorate([
    (0, graphql_1.Query)(() => Incident),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentResolver.prototype, "incident", null);
__decorate([
    (0, graphql_1.Mutation)(() => Incident),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReportIncidentInput]),
    __metadata("design:returntype", Promise)
], IncidentResolver.prototype, "reportIncident", null);
__decorate([
    (0, graphql_1.Mutation)(() => Incident),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentResolver.prototype, "updateIncidentStatus", null);
exports.IncidentResolver = IncidentResolver = __decorate([
    (0, graphql_1.Resolver)()
], IncidentResolver);
//# sourceMappingURL=incident.resolver.js.map