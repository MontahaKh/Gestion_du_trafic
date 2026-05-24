"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://webuser:webpass@localhost:5432/webservice';
const INCIDENT_STATUSES = ['REPORTED', 'IN_PROGRESS', 'RESOLVED'];
const INCIDENT_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH'];
let IncidentService = class IncidentService {
    constructor() {
        this.pool = new pg_1.Pool({ connectionString: DATABASE_URL });
    }
    async onModuleInit() {
        await this.pool.query(`
      CREATE TABLE IF NOT EXISTS incidents (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        zone TEXT,
        status TEXT NOT NULL DEFAULT 'REPORTED',
        severity TEXT NOT NULL DEFAULT 'MEDIUM',
        reported_by TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    }
    async onModuleDestroy() {
        await this.pool.end();
    }
    async report(input) {
        var _a, _b, _c, _d;
        const title = (_a = input.title) === null || _a === void 0 ? void 0 : _a.trim();
        if (!title)
            throw new common_1.BadRequestException('Title is required');
        const severity = this.resolveSeverity(input.severity);
        const result = await this.pool.query(`
        INSERT INTO incidents (title, description, zone, severity, reported_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [title, ((_b = input.description) === null || _b === void 0 ? void 0 : _b.trim()) || null, ((_c = input.zone) === null || _c === void 0 ? void 0 : _c.trim()) || null, severity, ((_d = input.reportedBy) === null || _d === void 0 ? void 0 : _d.trim()) || null]);
        return this.toIncident(result.rows[0]);
    }
    async list(status) {
        if (!status) {
            const result = await this.pool.query('SELECT * FROM incidents ORDER BY created_at DESC');
            return result.rows.map((incident) => this.toIncident(incident));
        }
        const resolvedStatus = this.resolveStatus(status);
        const result = await this.pool.query('SELECT * FROM incidents WHERE status = $1 ORDER BY created_at DESC', [resolvedStatus]);
        return result.rows.map((incident) => this.toIncident(incident));
    }
    async detail(id) {
        const result = await this.pool.query('SELECT * FROM incidents WHERE id = $1 LIMIT 1', [id]);
        const incident = result.rows[0];
        if (!incident)
            throw new common_1.NotFoundException('Incident not found');
        return this.toIncident(incident);
    }
    async updateStatus(id, status) {
        const resolvedStatus = this.resolveStatus(status);
        const result = await this.pool.query(`
        UPDATE incidents
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [resolvedStatus, id]);
        const incident = result.rows[0];
        if (!incident)
            throw new common_1.NotFoundException('Incident not found');
        return this.toIncident(incident);
    }
    resolveStatus(status) {
        const normalized = status === null || status === void 0 ? void 0 : status.trim().toUpperCase();
        if (!INCIDENT_STATUSES.includes(normalized))
            throw new common_1.BadRequestException('Invalid incident status');
        return normalized;
    }
    resolveSeverity(severity) {
        const normalized = ((severity === null || severity === void 0 ? void 0 : severity.trim().toUpperCase()) || 'MEDIUM');
        if (!INCIDENT_SEVERITIES.includes(normalized))
            throw new common_1.BadRequestException('Invalid incident severity');
        return normalized;
    }
    toIncident(incident) {
        return {
            id: String(incident.id),
            title: incident.title,
            description: incident.description,
            zone: incident.zone,
            status: incident.status,
            severity: incident.severity,
            reportedBy: incident.reported_by,
            createdAt: incident.created_at.toISOString(),
            updatedAt: incident.updated_at.toISOString(),
        };
    }
};
exports.IncidentService = IncidentService;
exports.IncidentService = IncidentService = __decorate([
    (0, common_1.Injectable)()
], IncidentService);
//# sourceMappingURL=incident.service.js.map