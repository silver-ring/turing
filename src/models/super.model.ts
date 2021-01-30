import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class SuperModel {
  @Field(() => ID)
  id!: string;
}
