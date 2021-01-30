import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextDidResolveOperation,
} from 'apollo-server-plugin-base';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';
import { GraphQLError } from 'graphql';
import * as chalk from 'chalk';
import { Plugin } from '@nestjs/graphql';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  requestDidStart(requestContext: GraphQLRequestContext<BaseContext>) {
    const schema = requestContext.schema;

    return {
      didResolveOperation({
        request,
        document,
        logger,
      }: GraphQLRequestContextDidResolveOperation<BaseContext>) {
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });
        const maxComplexity = 20;
        if (complexity >= maxComplexity) {
          throw new GraphQLError(
            `Query is to complex: ${complexity}. Maximum allowed complexity: ${maxComplexity}`,
          );
        }
        logger.info(chalk.blueBright(`[Appollo] Query Complexity:${complexity}`));
      },
    };
  }
}
