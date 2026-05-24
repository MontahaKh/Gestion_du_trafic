import { Args, Field, Float, InputType, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';

@ObjectType()
class Vehicle {
  @Field()
  id!: string;

  @Field()
  plateNumber!: string;

  @Field({ nullable: true })
  model?: string;

  @Field()
  status!: string;

  @Field()
  createdAt!: string;
}

@ObjectType()
class GpsPosition {
  @Field()
  id!: string;

  @Field()
  vehicleId!: string;

  @Field(() => Float)
  lat!: number;

  @Field(() => Float)
  lng!: number;

  @Field(() => Float, { nullable: true })
  speed?: number;

  @Field()
  recordedAt!: string;
}

@InputType()
class CreateVehicleInput {
  @Field()
  plateNumber!: string;

  @Field({ nullable: true })
  model?: string;

  @Field({ nullable: true })
  status?: string;
}

@InputType()
class RecordPositionInput {
  @Field(() => Float)
  lat!: number;

  @Field(() => Float)
  lng!: number;

  @Field(() => Float, { nullable: true })
  speed?: number;

  @Field({ nullable: true })
  recordedAt?: string;
}

@Resolver()
export class VehicleResolver {
  private vehicleUrl = process.env.VEHICLE_SERVICE_URL || 'http://localhost:4002';

  @Query(() => [Vehicle])
  async vehicles() {
    const resp = await fetch(`${this.vehicleUrl}/vehicles`);
    if (!resp.ok) throw new Error(await this.readError(resp, 'Vehicle list failed'));
    return resp.json();
  }

  @Query(() => Vehicle)
  async vehicle(@Args('id') id: string) {
    const resp = await fetch(`${this.vehicleUrl}/vehicles/${encodeURIComponent(id)}`);
    if (!resp.ok) throw new Error(await this.readError(resp, 'Vehicle detail failed'));
    return resp.json();
  }

  @Query(() => [GpsPosition])
  async vehiclePositions(
    @Args('vehicleId') vehicleId: string,
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
  ) {
    const suffix = limit ? `?limit=${encodeURIComponent(String(limit))}` : '';
    const resp = await fetch(`${this.vehicleUrl}/vehicles/${encodeURIComponent(vehicleId)}/positions${suffix}`);
    if (!resp.ok) throw new Error(await this.readError(resp, 'Vehicle positions failed'));
    return resp.json();
  }

  @Mutation(() => Vehicle)
  async createVehicle(@Args('input') input: CreateVehicleInput) {
    const resp = await fetch(`${this.vehicleUrl}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!resp.ok) throw new Error(await this.readError(resp, 'Vehicle create failed'));
    return resp.json();
  }

  @Mutation(() => GpsPosition)
  async recordVehiclePosition(@Args('vehicleId') vehicleId: string, @Args('input') input: RecordPositionInput) {
    const resp = await fetch(`${this.vehicleUrl}/vehicles/${encodeURIComponent(vehicleId)}/positions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!resp.ok) throw new Error(await this.readError(resp, 'Vehicle position record failed'));
    return resp.json();
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
