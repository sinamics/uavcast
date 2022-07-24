import { Entity, Check, PrimaryColumn, Column, getRepository } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
@Entity()
@Check(`ensure = 1`)
export class Camera {
  @PrimaryColumn({ type: 'int', default: () => `1`, nullable: false })
  public ensure: 1;

  @Field(() => ID)
  @Column({ type: Number, default: 1 })
  id: number;

  @Field()
  @Column({ type: Boolean, default: false, nullable: false })
  enableCamera: boolean;

  @Field()
  @Column({ type: String, default: 'custom', nullable: false })
  name: string;

  @Field()
  @Column({ type: String, default: '/dev/video0', nullable: false })
  path: string;

  @Field()
  @Column({ type: String, default: 'udp', nullable: false })
  protocol: string;

  @Field()
  @Column({ type: String, default: '1920x1080', nullable: false })
  resolution: string;

  @Field()
  @Column({
    type: String,
    default:
      'videotestsrc ! x264enc ! video/x-h264, stream-format=byte-stream ! rtph264pay ! udpsink host=192.168.1.100 port=5600', // eslint-disable-line max-len
    nullable: false
  })
  customPipeline: string;

  @Field()
  @Column({ type: Number, default: 20, nullable: false })
  framesPrSecond: number;

  @Field()
  @Column({ type: Number, default: 10000000, nullable: false })
  bitratePrSecond: number;

  @Field()
  @Column({ type: Number, default: 1, nullable: false })
  contrast: number;

  @Field()
  @Column({ type: Number, default: 0, nullable: false })
  rotation: number;

  @Field()
  @Column({ type: Number, default: 0, nullable: false })
  brightness: number;

  @Field()
  @Column({ type: String, default: 'auto', nullable: false })
  whiteBalance: string;

  @Field()
  @Column({ type: String, default: 'none', nullable: false })
  flipCamera: string;

  @Field()
  @Column({ type: String, default: 'video/x-raw', nullable: false })
  format: string;
}

export const getCameraRepository = () => {
  return getRepository<Camera>(Camera);
};
