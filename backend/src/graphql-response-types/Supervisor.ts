import { ObjectType, Field } from 'type-graphql';
import { FieldError } from './FieldError';
// get available versions for uavcast
@ObjectType()
export class Results {
  @Field(() => Number)
    id: number;

  @Field(() => String)
    name: string;

  @Field(() => String)
    tag_status: string;

  @Field(() => String)
    last_updated: string;

  @Field(() => String)
    full_size: string;
}

@ObjectType()
export class VerctlRespons {
  @Field(() => Number)
    count: number;

  @Field(() => Results)
    results: [Results];

  @Field(() => String, { nullable: true })
    error: number;
}

// get all versions

@ObjectType()
export class VersionInformation {
  @Field(() => String)
    repo: string;

  @Field(() => Boolean)
    isRunning: boolean;

  @Field(() => String, { nullable: true })
    remoteVersion: string;

  @Field(() => String, { nullable: true })
    localVersion: string;

  @Field(() => Boolean, { nullable: true })
    hasLatest: boolean;

  @Field(() => Boolean, { nullable: true })
    newVersionExsist: boolean;
}
@ObjectType()
export class Versions {
  @Field(() => VersionInformation, { nullable: true })
    supervisor: VersionInformation;

  @Field(() => VersionInformation, { nullable: true })
    uavcast: VersionInformation;
}
@ObjectType()
export class VersionsRespons {
  @Field(() => Versions, { nullable: true })
    message: Versions;

  @Field(() => FieldError, { nullable: true })
    errors: [FieldError];
}

@ObjectType()
export class SupervisorRespons {
  @Field(() => String, { nullable: true })
    message: string;

  @Field(() => FieldError, { nullable: true })
    errors: [FieldError];
}
