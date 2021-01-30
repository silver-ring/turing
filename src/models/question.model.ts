import {
  Field,
  FieldMiddleware,
  MiddlewareContext,
  NextFn,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { SuperModel } from './super.model';
import { AnswerModel } from './answer.model';

export enum QuestionStatus {
  Active,
  Inactive,
}

registerEnumType(QuestionStatus, { name: 'QuestionStatus' });

class TwoAnswersRequired extends Error {
  constructor() {
    super('At least we should have two answers');
  }
}

class CorrectAnswerRequired extends Error {
  constructor() {
    super('Correct answer should be exist');
  }
}

const validateAnswers: FieldMiddleware = async (
  context: MiddlewareContext,
  next: NextFn,
) => {
  const answerModels = (await next()) as AnswerModel[];
  if (answerModels.length < 2) {
    throw new TwoAnswersRequired();
  }
  const searchResult = answerModels.find(
    (answerModel) => answerModel.isCorrect,
  );
  if (!searchResult) {
    throw new CorrectAnswerRequired();
  }
  return answerModels;
};

@ObjectType({
  implements: SuperModel,
})
export class QuestionModel implements SuperModel {
  id!: string;
  text: string;
  @Field(() => [AnswerModel], { middleware: [validateAnswers] })
  answers: AnswerModel[];
  imageUrl?: URL;
  categoryId: string;
  @Field(() => QuestionStatus)
  questionStatus: QuestionStatus;
}
