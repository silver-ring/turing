import { Module } from '@nestjs/common';
import { QuestionResolver } from './question.resolver';

@Module({
  imports: [],
  exports: [],
  providers: [QuestionResolver],
})
export class QuestionModule {}
