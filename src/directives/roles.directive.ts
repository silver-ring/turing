import { SchemaDirectiveVisitor } from 'apollo-server';
import { defaultFieldResolver, GraphQLField } from 'graphql';
import { QuestionModel } from '../models/question.model';

export class RolesDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver, extensions } = field;
    const username = extensions.username;
    const password = extensions.password;
    field.resolve = async function (...args) {
      const result = (await resolve.apply(this, args)) as QuestionModel;
      const imageUrl = result.imageUrl;
      imageUrl.username = username;
      imageUrl.password = password;
      result.imageUrl = imageUrl;
      return result;
    };
  }
}
