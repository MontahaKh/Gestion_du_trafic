import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthResolver } from './resolvers/auth.resolver';
import { IncidentResolver } from './resolvers/incident.resolver';
import { NotificationResolver } from './resolvers/notification.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      context: ({ req }: any) => ({ req }),
      // no plugins
    }),
  ],
  providers: [AuthResolver, IncidentResolver, NotificationResolver],
})
export class AppModule {}
