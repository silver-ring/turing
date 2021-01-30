import { Plugin } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLServiceContext,
  GraphQLRequestListener,
  GraphQLRequestContextDidEncounterErrors,
} from 'apollo-server-plugin-base';
import * as chalk from 'chalk';

@Plugin()
export class LoggerPlugin implements ApolloServerPlugin {
  serverWillStart(service: GraphQLServiceContext): void {
    service.logger.info(chalk.green('[Appollo] Graphql server started'));
  }

  requestDidStart(
    requestContext: GraphQLRequestContext<BaseContext>,
  ): GraphQLRequestListener {
    return {
      didEncounterErrors(
        requestContext: GraphQLRequestContextDidEncounterErrors<BaseContext>,
      ): void {
        requestContext.errors.forEach((value) => {
          requestContext.logger.error(chalk.red(`[Appollo] ${value.message}`));
        });
      },
    };
  }
}
