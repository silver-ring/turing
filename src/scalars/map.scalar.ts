import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Map', () => Map)
export class MapScalar
  implements CustomScalar<string[][], Map<string, string>> {
  description = 'Map scalar type';

  parseValue(value: string[][]): Map<string, string> {
    const result = new Map<string, string>();
    console.log('parse???????');
    console.log(value);
    console.log('parse???????');
    for (const item of value) {
      result.set(item[0], item[1]);
    }
    return result;
  }

  serialize(value: Map<string, string>): string[][] {
    const result = [];
    value.forEach((value1, key) => {
      const item = [];
      item[0] = key;
      item[1] = value1;
      result.push(item);
    });
    return result;
  }

  parseLiteral(valueNode: ValueNode): Map<string, string> {
    if (valueNode.kind == Kind.LIST) {
      return this.getValue(valueNode.values);
    }
    return null;
  }

  private getValue(valueNodes: ReadonlyArray<ValueNode>): Map<string, string> {
    const result = new Map<string, string>();
    for (const item of valueNodes) {
      if (item.kind == Kind.LIST) {
        const values = item.values;
        const keyNode = values[0];
        const valueNode = values[1];
        if (keyNode.kind == Kind.STRING && valueNode.kind == Kind.STRING) {
          result.set(keyNode.value, valueNode.value);
        }
      }
    }
    return result;
  }
}
