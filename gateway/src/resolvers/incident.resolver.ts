import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';

@ObjectType()
class Incident {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  zone?: string;

  @Field()
  status!: string;

  @Field()
  severity!: string;

  @Field({ nullable: true })
  reportedBy?: string;

  @Field()
  createdAt!: string;

  @Field()
  updatedAt!: string;
}

@InputType()
class ReportIncidentInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  zone?: string;

  @Field({ nullable: true })
  severity?: string;

  @Field({ nullable: true })
  reportedBy?: string;
}

@Resolver()
export class IncidentResolver {
  private incidentUrl = process.env.INCIDENT_SERVICE_URL || 'http://localhost:4003';

  @Query(() => [Incident])
  async incidents(@Args('status', { nullable: true }) status?: string) {
    const suffix = status ? `?status=${encodeURIComponent(status)}` : '';
    const resp = await fetch(`${this.incidentUrl}/incidents${suffix}`);
    if (!resp.ok) throw new Error('Incident list failed');
    return resp.json();
  }

  @Query(() => Incident)
  async incident(@Args('id') id: string) {
    const resp = await fetch(`${this.incidentUrl}/incidents/${encodeURIComponent(id)}`);
    if (!resp.ok) throw new Error('Incident detail failed');
    return resp.json();
  }

  @Mutation(() => Incident)
  async reportIncident(@Args('input') input: ReportIncidentInput) {
    const resp = await fetch(`${this.incidentUrl}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!resp.ok) throw new Error('Incident report failed');
    return resp.json();
  }

  @Mutation(() => Incident)
  async updateIncidentStatus(@Args('id') id: string, @Args('status') status: string) {
    const resp = await fetch(`${this.incidentUrl}/incidents/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!resp.ok) throw new Error('Incident status update failed');
    return resp.json();
  }
}
