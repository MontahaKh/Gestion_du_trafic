import { Resolver, Mutation, Args, Query, Context, ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
class User {
  @Field()
  id!: string;
  @Field()
  name!: string;
  @Field()
  email!: string;
  @Field()
  role!: string;
}

@ObjectType()
class AuthPayload {
  @Field()
  token!: string;
  @Field(() => User)
  user!: User;
}

@InputType()
class RegisterInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  role?: string;
}

@InputType()
class LoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@Resolver()
export class AuthResolver {
  private authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';

  @Query(() => User, { nullable: true })
  async me(@Context() ctx: { req: { headers: Record<string, string | string[] | undefined> } }) {
    const req = ctx.req;
    const auth = typeof req.headers.authorization === 'string' ? req.headers.authorization : req.headers.authorization?.[0] || '';
    if (!auth) return null;
    const resp = await fetch(`${this.authUrl}/auth/verify`, { headers: { Authorization: auth } });
    if (!resp.ok) return null;
    const body = await resp.json();
    return body.user || body;
  }

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput) {
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
    if (!resp.ok) throw new Error('Register failed');
    return resp.json();
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    const resp = await fetch(`${this.authUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: input.email, password: input.password }),
    });
    if (!resp.ok) throw new Error('Login failed');
    return resp.json();
  }
}
