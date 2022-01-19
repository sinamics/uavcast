import { Camera } from '../entity/Camera';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Caps {
  @Field(() => String)
    value: string;

  @Field(() => String)
    text: string;

  @Field(() => Number)
    height: number;

  @Field(() => Number)
    width: number;

  @Field(() => String)
    format: string;
}

@ObjectType()
export class AvailableCams {
  @Field(() => String)
    device: string;

  @Field(() => String)
    value: string;

  @Field(() => String)
    text: string;

  @Field(() => Caps, { nullable: true })
    caps?: Caps[];
}

@ObjectType()
export class CameraResponse {
  @Field(() => Camera, { nullable: true })
    database?: Camera;

  @Field(() => AvailableCams, { nullable: true })
    availableCams?: AvailableCams[];
}

// const test = [
//   {
//     device: 'rpicam',
//     value: 'rpicam',
//     label: 'Raspberry Pi Camera (V2)',
//     caps: [
//       { value: '1920x1080', label: '1920x1080', height: 1080, width: 1920, format: 'video/x-h264' },
//       { value: '1640x922', label: '1640x922', height: 922, width: 1640, format: 'video/x-h264' },
//       { value: '1280x720', label: '1280x720', height: 720, width: 1280, format: 'video/x-h264' },
//       { value: '640x480', label: '640x480', height: 480, width: 640, format: 'video/x-h264' },
//     ],
//   },
// ];
