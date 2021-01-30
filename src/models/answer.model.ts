import { Field, ObjectType } from '@nestjs/graphql';
import { SuperModel } from './super.model';

@ObjectType({
  implements: SuperModel,
})
export class AnswerModel implements SuperModel {
  id!: string;
  text: string;
  isCorrect: boolean;
}
