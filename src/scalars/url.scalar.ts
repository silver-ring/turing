import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('URL', () => URL)
export class UrlScalar implements CustomScalar<string, URL> {
  description = 'Url scalar type';

  parseValue(value: string): URL {
    return new URL(value);
  }

  serialize(value: URL): string {
    return value.toString();
  }

  parseLiteral(valueNode: ValueNode): URL {
    if (valueNode.kind == Kind.STRING) {
      return new URL(valueNode.value);
    }
    return null;
  }
}
