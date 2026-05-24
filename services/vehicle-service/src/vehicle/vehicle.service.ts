import { BadRequestException, ConflictException, Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://webuser:webpass@localhost:5432/webservice';

const VEHICLE_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

type StoredVehicle = {
  id: number;
  plate_number: string;
  model: string | null;
  status: VehicleStatus;
  created_at: Date;
};

type StoredGpsPosition = {
  id: number;
  vehicle_id: number;
  lat: number;
  lng: number;
  speed: number | null;
  recorded_at: Date;
};

@Injectable()
export class VehicleService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool({ connectionString: DATABASE_URL });

  async onModuleInit() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        plate_number TEXT NOT NULL UNIQUE,
        model TEXT,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS gps_positions (
        id SERIAL PRIMARY KEY,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        speed DOUBLE PRECISION,
        recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.pool.query('CREATE INDEX IF NOT EXISTS idx_gps_positions_vehicle_id ON gps_positions(vehicle_id)');
    await this.pool.query('CREATE INDEX IF NOT EXISTS idx_gps_positions_recorded_at ON gps_positions(recorded_at)');
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  health() {
    return { status: 'ok' };
  }

  async createVehicle(input: { plateNumber?: string; model?: string; status?: string }) {
    const plateNumber = input.plateNumber?.trim();
    if (!plateNumber) throw new BadRequestException('plateNumber is required');

    const model = input.model?.trim() || null;
    const status = this.resolveVehicleStatus(input.status);

    try {
      const result = await this.pool.query<StoredVehicle>(
        `
          INSERT INTO vehicles (plate_number, model, status)
          VALUES ($1, $2, $3)
          RETURNING *
        `,
        [plateNumber, model, status],
      );

      return this.toVehicle(result.rows[0]);
    } catch (err: any) {
      // Postgres unique violation
      if (err?.code === '23505') throw new ConflictException('plateNumber already exists');
      throw err;
    }
  }

  async listVehicles() {
    const result = await this.pool.query<StoredVehicle>('SELECT * FROM vehicles ORDER BY created_at DESC');
    return result.rows.map((v: StoredVehicle) => this.toVehicle(v));
  }

  async getVehicle(id: string) {
    const vehicleId = this.parseId(id, 'vehicle id');
    const result = await this.pool.query<StoredVehicle>('SELECT * FROM vehicles WHERE id = $1 LIMIT 1', [vehicleId]);
    const vehicle = result.rows[0];
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return this.toVehicle(vehicle);
  }

  async recordPosition(vehicleId: string, input: { lat?: number; lng?: number; speed?: number; recordedAt?: string }) {
    const id = this.parseId(vehicleId, 'vehicle id');
    await this.assertVehicleExists(id);

    const lat = this.parseNumber(input.lat, 'lat');
    const lng = this.parseNumber(input.lng, 'lng');
    if (lat < -90 || lat > 90) throw new BadRequestException('lat must be between -90 and 90');
    if (lng < -180 || lng > 180) throw new BadRequestException('lng must be between -180 and 180');

    const speed = input.speed === undefined || input.speed === null ? null : this.parseNumber(input.speed, 'speed');
    if (speed !== null && speed < 0) throw new BadRequestException('speed must be >= 0');

    const recordedAt = this.resolveRecordedAt(input.recordedAt);

    const result = await this.pool.query<StoredGpsPosition>(
      `
        INSERT INTO gps_positions (vehicle_id, lat, lng, speed, recorded_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [id, lat, lng, speed, recordedAt],
    );

    return this.toPosition(result.rows[0]);
  }

  async listPositions(vehicleId: string, limit?: string) {
    const id = this.parseId(vehicleId, 'vehicle id');
    await this.assertVehicleExists(id);

    const resolvedLimit = this.resolveLimit(limit);
    const result = await this.pool.query<StoredGpsPosition>(
      'SELECT * FROM gps_positions WHERE vehicle_id = $1 ORDER BY recorded_at DESC LIMIT $2',
      [id, resolvedLimit],
    );
    return result.rows.map((p: StoredGpsPosition) => this.toPosition(p));
  }

  private async assertVehicleExists(id: number) {
    const result = await this.pool.query<{ id: number }>('SELECT id FROM vehicles WHERE id = $1 LIMIT 1', [id]);
    if (!result.rowCount) throw new NotFoundException('Vehicle not found');
  }

  private parseId(value: string, fieldName: string) {
    const id = Number.parseInt(String(value), 10);
    if (!Number.isFinite(id) || id <= 0) throw new BadRequestException(`${fieldName} must be a positive integer`);
    return id;
  }

  private parseNumber(value: unknown, fieldName: string) {
    if (typeof value !== 'number') throw new BadRequestException(`${fieldName} must be a number`);
    if (!Number.isFinite(value)) throw new BadRequestException(`${fieldName} must be a finite number`);
    return value;
  }

  private resolveRecordedAt(recordedAt?: string) {
    if (!recordedAt) return new Date();
    const date = new Date(recordedAt);
    if (Number.isNaN(date.getTime())) throw new BadRequestException('recordedAt must be a valid date string');
    return date;
  }

  private resolveVehicleStatus(status?: string): VehicleStatus {
    if (!status) return 'ACTIVE';
    const normalized = status.trim().toUpperCase() as VehicleStatus;
    if (!VEHICLE_STATUSES.includes(normalized)) {
      throw new BadRequestException(`status must be one of: ${VEHICLE_STATUSES.join(', ')}`);
    }
    return normalized;
  }

  private resolveLimit(limit?: string) {
    if (limit === undefined || limit === null || limit === '') return 100;
    const value = Number.parseInt(limit, 10);
    if (!Number.isFinite(value) || value <= 0) throw new BadRequestException('limit must be a positive integer');
    return Math.min(value, 500);
  }

  private toVehicle(vehicle: StoredVehicle) {
    return {
      id: String(vehicle.id),
      plateNumber: vehicle.plate_number,
      model: vehicle.model,
      status: vehicle.status,
      createdAt: vehicle.created_at.toISOString(),
    };
  }

  private toPosition(pos: StoredGpsPosition) {
    return {
      id: String(pos.id),
      vehicleId: String(pos.vehicle_id),
      lat: pos.lat,
      lng: pos.lng,
      speed: pos.speed,
      recordedAt: pos.recorded_at.toISOString(),
    };
  }
}
