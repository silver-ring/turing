import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { QuestionModule } from './question/question.module';
import { ScalarsModule } from './scalars/scalars.module';
import { RolesDirective } from './directives/roles.directive';
import { PluginsModule } from './plugins/plugins.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      schemaDirectives: {
        roles: RolesDirective,
      },
    }),
    QuestionModule,
    ScalarsModule,
    PluginsModule,
  ],
})
export class AppModule {}
