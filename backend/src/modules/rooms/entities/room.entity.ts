import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Room {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  id: number;
}
