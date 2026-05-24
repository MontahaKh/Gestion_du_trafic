import { BadRequestException, Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://webuser:webpass@localhost:5432/webservice';
const INCIDENT_STATUSES = ['REPORTED', 'IN_PROGRESS', 'RESOLVED'] as const;
const INCIDENT_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;

type IncidentStatus = (typeof INCIDENT_STATUSES)[number];
type IncidentSeverity = (typeof INCIDENT_SEVERITIES)[number];
type StoredIncident = {
  id: number;
  title: string;
  description: string | null;
  zone: string | null;
  status: IncidentStatus;
  severity: IncidentSeverity;
  reported_by: string | null;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class IncidentService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool({ connectionString: DATABASE_URL });

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

  async report(input: { title: string; description?: string; zone?: string; severity?: string; reportedBy?: string }) {
    const title = input.title?.trim();
    if (!title) throw new BadRequestException('Title is required');

    const severity = this.resolveSeverity(input.severity);
    const result = await this.pool.query<StoredIncident>(
      `
        INSERT INTO incidents (title, description, zone, severity, reported_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [title, input.description?.trim() || null, input.zone?.trim() || null, severity, input.reportedBy?.trim() || null],
    );

    return this.toIncident(result.rows[0]);
  }

  async list(status?: string) {
    if (!status) {
      const result = await this.pool.query<StoredIncident>('SELECT * FROM incidents ORDER BY created_at DESC');
      return result.rows.map((incident) => this.toIncident(incident));
    }

    const resolvedStatus = this.resolveStatus(status);
    const result = await this.pool.query<StoredIncident>(
      'SELECT * FROM incidents WHERE status = $1 ORDER BY created_at DESC',
      [resolvedStatus],
    );
    return result.rows.map((incident) => this.toIncident(incident));
  }

  async detail(id: string) {
    const result = await this.pool.query<StoredIncident>('SELECT * FROM incidents WHERE id = $1 LIMIT 1', [id]);
    const incident = result.rows[0];
    if (!incident) throw new NotFoundException('Incident not found');
    return this.toIncident(incident);
  }

  async updateStatus(id: string, status: string) {
    const resolvedStatus = this.resolveStatus(status);
    const result = await this.pool.query<StoredIncident>(
      `
        UPDATE incidents
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `,
      [resolvedStatus, id],
    );

    const incident = result.rows[0];
    if (!incident) throw new NotFoundException('Incident not found');
    return this.toIncident(incident);
  }

  private resolveStatus(status: string): IncidentStatus {
    const normalized = status?.trim().toUpperCase() as IncidentStatus;
    if (!INCIDENT_STATUSES.includes(normalized)) throw new BadRequestException('Invalid incident status');
    return normalized;
  }

  private resolveSeverity(severity?: string): IncidentSeverity {
    const normalized = (severity?.trim().toUpperCase() || 'MEDIUM') as IncidentSeverity;
    if (!INCIDENT_SEVERITIES.includes(normalized)) throw new BadRequestException('Invalid incident severity');
    return normalized;
  }

  private toIncident(incident: StoredIncident) {
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
}
