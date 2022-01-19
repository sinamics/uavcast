import { ArgsType, InputType, Field } from 'type-graphql';

@InputType()
export class CameraProperties {
  @Field({ nullable: true })
    controller: string;

  @Field({ nullable: true })
    protocol: string;

  @Field({ nullable: true })
    cameraType: string;

  @Field({ nullable: true })
    resolution: string;

  @Field({ nullable: true })
    enableCamera: boolean;

  @Field({ nullable: true })
    customPipeline: string;

  @Field({ nullable: true })
    framesPrSecond: number;

  @Field({ nullable: true })
    bitratePrSecond: number;

  @Field({ nullable: true })
    contrast: number;

  @Field({ nullable: true })
    rotation: number;

  @Field({ nullable: true })
    brightness: number;

  @Field({ nullable: true })
    whiteBalance: string;

  @Field({ nullable: true })
    flipCamera: string;

  @Field({ nullable: true })
    format: string;
}

@ArgsType()
@InputType()
export class CameraInput {
  @Field({ nullable: true })
    properties: CameraProperties;
}
