import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SuperModel } from './super.model';

@ObjectType({
  implements: SuperModel,
})
export class CategoryModel implements SuperModel {
  id!: string;
  name: string;
}
