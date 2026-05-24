import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://webuser:webpass@localhost:5432/webservice';

@Injectable()
export class TrafficService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool({ connectionString: DATABASE_URL });

  async onModuleInit() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS traffic_zones (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        bbox JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS traffic_metrics (
        id SERIAL PRIMARY KEY,
        zone_id INT NOT NULL REFERENCES traffic_zones(id) ON DELETE CASCADE,
        density INT NOT NULL,
        level TEXT NOT NULL,
        calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.pool.query('CREATE INDEX IF NOT EXISTS idx_traffic_metrics_zone_id ON traffic_metrics(zone_id)');
    await this.pool.query('CREATE INDEX IF NOT EXISTS idx_traffic_metrics_calculated_at ON traffic_metrics(calculated_at)');
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  health() {
    return { status: 'ok' };
  }

  private normalizeBbox(bbox: {
    minLat?: number;
    minLng?: number;
    maxLat?: number;
    maxLng?: number;
  }): { minLat: number; minLng: number; maxLat: number; maxLng: number } {
    if (!bbox) {
      throw new BadRequestException('bbox is required');
    }

    const { minLat, minLng, maxLat, maxLng } = bbox;
    const values = [minLat, minLng, maxLat, maxLng];
    if (values.some((v) => typeof v !== 'number' || Number.isNaN(v))) {
      throw new BadRequestException('bbox must contain numeric minLat/minLng/maxLat/maxLng');
    }

    if (minLat! < -90 || minLat! > 90 || maxLat! < -90 || maxLat! > 90) {
      throw new BadRequestException('bbox latitude must be between -90 and 90');
    }
    if (minLng! < -180 || minLng! > 180 || maxLng! < -180 || maxLng! > 180) {
      throw new BadRequestException('bbox longitude must be between -180 and 180');
    }

    const normalized = {
      minLat: Math.min(minLat!, maxLat!),
      maxLat: Math.max(minLat!, maxLat!),
      minLng: Math.min(minLng!, maxLng!),
      maxLng: Math.max(minLng!, maxLng!),
    };

    if (normalized.minLat === normalized.maxLat || normalized.minLng === normalized.maxLng) {
      throw new BadRequestException('bbox must have non-zero area');
    }

    return normalized;
  }

  async createZone(input: {
    name?: string;
    bbox?: { minLat?: number; minLng?: number; maxLat?: number; maxLng?: number };
  }) {
    const name = (input?.name ?? '').trim();
    if (!name) {
      throw new BadRequestException('name is required');
    }

    const bbox = this.normalizeBbox(input?.bbox ?? {});

    const result = await this.pool.query(
      `
      INSERT INTO traffic_zones (name, bbox)
      VALUES ($1, $2)
      RETURNING id, name, bbox, created_at
      `,
      [name, bbox],
    );

    return result.rows[0];
  }

  async listZones() {
    const result = await this.pool.query(
      `
      SELECT id, name, bbox, created_at
      FROM traffic_zones
      ORDER BY created_at DESC
      `,
    );
    return result.rows;
  }

  async getZone(id: string) {
    const zoneId = Number(id);
    if (!Number.isInteger(zoneId) || zoneId <= 0) {
      throw new BadRequestException('id must be a positive integer');
    }

    const result = await this.pool.query(
      `
      SELECT id, name, bbox, created_at
      FROM traffic_zones
      WHERE id = $1
      `,
      [zoneId],
    );
    const zone = result.rows[0];
    if (!zone) {
      throw new NotFoundException('zone not found');
    }
    return zone;
  }

  private classifyDensity(vehicleCount: number) {
    if (vehicleCount <= 10) return 'FAIBLE';
    if (vehicleCount <= 30) return 'MOYEN';
    return 'ELEVE';
  }

  async calculate(zoneIdRaw: string, input: { windowMinutes?: number }) {
    const zone = await this.getZone(zoneIdRaw);

    const windowMinutesRaw = input?.windowMinutes ?? 15;
    if (typeof windowMinutesRaw !== 'number' || Number.isNaN(windowMinutesRaw)) {
      throw new BadRequestException('windowMinutes must be a number');
    }
    const windowMinutes = Math.floor(windowMinutesRaw);
    if (windowMinutes < 1 || windowMinutes > 24 * 60) {
      throw new BadRequestException('windowMinutes must be between 1 and 1440');
    }

    const bbox = zone.bbox as {
      minLat: number;
      minLng: number;
      maxLat: number;
      maxLng: number;
    };

    // NOTE: On lit directement la table gps_positions (créée/consommée par vehicle-service)
    // pour éviter une dépendance HTTP inter-service à ce stade.
    const countResult = await this.pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM gps_positions
      WHERE lat BETWEEN $1 AND $2
        AND lng BETWEEN $3 AND $4
        AND recorded_at >= (NOW() - ($5::int * INTERVAL '1 minute'))
      `,
      [bbox.minLat, bbox.maxLat, bbox.minLng, bbox.maxLng, windowMinutes],
    );

    const vehicleCount = countResult.rows[0]?.count ?? 0;
    const level = this.classifyDensity(vehicleCount);

    const inserted = await this.pool.query(
      `
      INSERT INTO traffic_metrics (zone_id, density, level)
      VALUES ($1, $2, $3)
      RETURNING id, zone_id, density AS "vehicle_count", level, calculated_at AS "created_at"
      `,
      [zone.id, vehicleCount, level],
    );

    return {
      zone,
      windowMinutes,
      metric: inserted.rows[0],
    };
  }
}
