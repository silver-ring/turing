import {
  Args,
  ArgsType,
  createUnionType,
  Directive,
  Extensions,
  Field,
  InputType,
  Mutation,
  Parent,
  PartialType,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { QuestionModel, QuestionStatus } from '../models/question.model';
import { CategoryModel } from '../models/category.model';
import { PubSub } from 'apollo-server-express';
import { SuperModel } from '../models/super.model';
import { AnswerModel } from '../models/answer.model';

@ArgsType()
class FindQuestionArgs {
  @Field()
  id: string;
}

@InputType()
class CreateQuestionInput {
  @Field({ middleware: [] })
  text: string;
  @Field()
  answers: Map<string, string>;
  @Field({ nullable: true })
  imageUrl?: URL;
  @Field()
  categoryId: string;
}

@InputType()
class UpdateQuestionInput extends PartialType(CreateQuestionInput) {}

@Resolver(() => QuestionModel)
export class QuestionResolver {
  questionModels: QuestionModel[] = [
    {
      id: '1',
      imageUrl: new URL('http://www.google.com/1'),
      text: 'test 1',
      categoryId: '1',
      questionStatus: QuestionStatus.Active,
      answers: [
        {
          id: '1',
          isCorrect: true,
          text: 'test 1',
        },
      ],
    },
    {
      id: '2',
      imageUrl: new URL('http://www.google.com/2'),
      text: 'test 2',
      categoryId: '2',
      questionStatus: QuestionStatus.Active,
      answers: [{ id: '2', isCorrect: false, text: 'test 2' }],
    },
  ];

  categoryModels: CategoryModel[] = [
    {
      id: '1',
      name: 'category 1',
    },
    {
      id: '2',
      name: 'category 1',
    },
  ];

  pubSub = new PubSub();

  @Directive('@roles')
  @Extensions({ username: 'username', password: 'password' })
  @Query(() => QuestionModel)
  async findQuestion(
    @Args() findQuestionArgs: FindQuestionArgs,
  ): Promise<QuestionModel> {
    return this.questionModels.find((value) => value.id == findQuestionArgs.id);
  }

  @Mutation(() => QuestionModel)
  async createQuestion(
    @Args('input') createQuestionInput: CreateQuestionInput,
  ) {
    const answers: AnswerModel[] = [];
    for (const [key, value] of createQuestionInput.answers.entries()) {
      const answer = new AnswerModel();
      answer.id = Math.random().toString();
      answer.isCorrect = value == 'true';
      answer.text = key;
      answers.push(answer);
    }
    this.questionModels.push({
      id: (this.questionModels.length + 1).toString(),
      categoryId: createQuestionInput.categoryId,
      text: createQuestionInput.text,
      imageUrl: createQuestionInput.imageUrl,
      answers: [...answers],
      questionStatus: QuestionStatus.Active,
    });
    const newQuestion = this.questionModels[this.questionModels.length - 1];
    this.pubSub.publish('newQuestion', { newQuestion });
    return newQuestion;
  }

  @Mutation(() => QuestionModel)
  async updateQuestion(
    @Args() findQuestionArgs: FindQuestionArgs,
    @Args('input') updateQuestionInput: UpdateQuestionInput,
  ) {
    return;
  }

  @ResolveField('categoryId', () => CategoryModel)
  async findCategory(
    @Parent() question: QuestionModel,
  ): Promise<CategoryModel> {
    return this.categoryModels.find((value) => value.id == question.categoryId);
  }

  @Subscription(() => QuestionModel)
  async newQuestion() {
    return this.pubSub.asyncIterator('newQuestion');
  }

  @Query(() => [FlatResult])
  async searchWithFlatResult(
    @Args() findQuestionArgs: FindQuestionArgs,
  ): Promise<Array<typeof FlatResult>> {
    const question = this.questionModels.find(
      (value) => value.id == findQuestionArgs.id,
    );
    const correctAnswers = question.answers.filter((value) => value.isCorrect);
    return [question, ...correctAnswers];
  }
}

export const FlatResult = createUnionType({
  name: 'FlatResult',
  resolveType: (args) => {
    if (args.categoryId) {
      return QuestionModel;
    }
    if (args.isCorrect) {
      return AnswerModel;
    }
    if (args.id) {
      return SuperModel;
    }
    return null;
  },
  types: () => [QuestionModel, AnswerModel],
});
