import { Resolver, Mutation, Args, Query, Context, ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class User {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  role: string;
}

@ObjectType()
class AuthPayload {
  @Field()
  token: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class AuthResolver {
  private authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:4001/auth';

  @Query(() => User, { nullable: true })
  async me(@Context() ctx) {
    const req = ctx.req;
    const auth = req.headers.authorization || '';
    if (!auth) return null;
    const resp = await fetch(`${this.authUrl.replace('/auth','')}/verify`, { headers: { Authorization: auth } });
    if (!resp.ok) return null;
    const body = await resp.json();
    return body.user || body;
  }

  @Mutation(() => AuthPayload)
  async register(@Args('name') name: string, @Args('email') email: string, @Args('password') password: string, @Args('role', { nullable: true }) role: string) {
    const resp = await fetch(`${this.authUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!resp.ok) throw new Error('Register failed');
    return resp.json();
  }

  @Mutation(() => AuthPayload)
  async login(@Args('email') email: string, @Args('password') password: string) {
    const resp = await fetch(`${this.authUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) throw new Error('Login failed');
    return resp.json();
  }
}
