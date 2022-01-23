import { Root, Args, Subscription, Resolver, PubSub, Mutation } from 'type-graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { spawn } from 'child_process';
import { KernelInput } from '../graphql-input-types/KernelInput';
import { KernelResponse } from '../graphql-response-types/KernelResponse';
import winston from 'winston';

const ServerLog = winston.loggers.get('server');

@Resolver()
export class KernelResolver {
  @Mutation(() => KernelResponse)
  async kernelMessage(@Args() { cmd, shell = true, path }: KernelInput, @PubSub() pubSub: PubSubEngine) {

    await pubSub.publish('KERNEL_MESSAGE', { message: 'waiting response from kernel...\n' });
    const child = spawn(cmd, { shell, cwd:path  });
    child.stdout.on('data', async (data) => {
      ServerLog.info({ message: data.toString('utf8'), data: cmd, path: __filename });
      await pubSub.publish('KERNEL_MESSAGE', { message: data.toString('utf8') });
    });
    child.stderr.on('data', async (error) => {
      console.log(error.toString('utf8'));
      ServerLog.error({ message: error.toString('utf8'), data: cmd, path: __filename });
      await pubSub.publish('KERNEL_MESSAGE', { errors: [{ message: error.toString('utf8'), path: 'kernelMessage' }] });
    });

    return true;
  }

  @Subscription(() => KernelResponse, {
    topics: 'KERNEL_MESSAGE' // single topic
    // topics: ({ args, payload, context }) => args.topic // or dynamic topic function
    // filter: ():any => {
    //     console.log('object')
    // }
  })
  async stdout(@Root() stdout: any): Promise<any> {
    // console.log('stdout', stdout);
    return { message: stdout.message, errors: stdout.errors };
  }
}
