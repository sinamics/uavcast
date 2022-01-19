import { InputType, Field } from 'type-graphql';

@InputType()
export class MapInput {
  @Field()
    mavCockpitDisable: boolean;
}
