import { Args, Field, Float, InputType, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';

@ObjectType()
class BoundingBox {
  @Field(() => Float)
  minLat!: number;

  @Field(() => Float)
  minLng!: number;

  @Field(() => Float)
  maxLat!: number;

  @Field(() => Float)
  maxLng!: number;
}

@ObjectType()
class TrafficZone {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field(() => BoundingBox)
  bbox!: BoundingBox;

  @Field()
  createdAt!: string;
}

@ObjectType()
class TrafficMetric {
  @Field()
  id!: string;

  @Field()
  zoneId!: string;

  @Field(() => Int)
  vehicleCount!: number;

  @Field()
  level!: string;

  @Field()
  createdAt!: string;
}

@InputType()
class BoundingBoxInput {
  @Field(() => Float)
  minLat!: number;

  @Field(() => Float)
  minLng!: number;

  @Field(() => Float)
  maxLat!: number;

  @Field(() => Float)
  maxLng!: number;
}

@InputType()
class CreateTrafficZoneInput {
  @Field()
  name!: string;

  @Field(() => BoundingBoxInput)
  bbox!: BoundingBoxInput;
}

@Resolver()
export class TrafficResolver {
  private trafficUrl = process.env.TRAFFIC_SERVICE_URL || 'http://localhost:4005';

  @Query(() => [TrafficZone])
  async trafficZones() {
    const resp = await fetch(`${this.trafficUrl}/traffic/zones`);
    if (!resp.ok) throw new Error(await this.readError(resp, 'Traffic zones list failed'));
    const zones = await resp.json();
    return Array.isArray(zones) ? zones.map((z) => this.mapZone(z)) : [];
  }

  @Query(() => TrafficZone)
  async trafficZone(@Args('id') id: string) {
    const resp = await fetch(`${this.trafficUrl}/traffic/zones/${encodeURIComponent(id)}`);
    if (!resp.ok) throw new Error(await this.readError(resp, 'Traffic zone detail failed'));
    const zone = await resp.json();
    return this.mapZone(zone);
  }

  @Mutation(() => TrafficZone)
  async createTrafficZone(@Args('input') input: CreateTrafficZoneInput) {
    const resp = await fetch(`${this.trafficUrl}/traffic/zones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!resp.ok) throw new Error(await this.readError(resp, 'Traffic zone create failed'));
    const zone = await resp.json();
    return this.mapZone(zone);
  }

  @Mutation(() => TrafficMetric)
  async calculateTraffic(
    @Args('zoneId') zoneId: string,
    @Args('windowMinutes', { nullable: true, type: () => Int }) windowMinutes?: number,
  ) {
    const resp = await fetch(`${this.trafficUrl}/traffic/zones/${encodeURIComponent(zoneId)}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(windowMinutes ? { windowMinutes } : {}),
    });
    if (!resp.ok) throw new Error(await this.readError(resp, 'Traffic calculate failed'));

    const body = await resp.json();
    const metric = body?.metric ?? body;
    return this.mapMetric(metric);
  }

  private mapZone(zone: any): TrafficZone {
    return {
      id: String(zone.id),
      name: zone.name,
      bbox: zone.bbox,
      createdAt: zone.createdAt ?? zone.created_at,
    };
  }

  private mapMetric(metric: any): TrafficMetric {
    return {
      id: String(metric.id),
      zoneId: String(metric.zoneId ?? metric.zone_id),
      vehicleCount: metric.vehicleCount ?? metric.vehicle_count,
      level: metric.level,
      createdAt: metric.createdAt ?? metric.created_at,
    };
  }

  private async readError(resp: Response, fallback: string) {
    try {
      const text = await resp.text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }
}
