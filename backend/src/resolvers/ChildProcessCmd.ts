import { Root, Args, Subscription, Resolver, PubSub, Mutation, Publisher } from 'type-graphql';
import { KernelInput } from '../graphql-input-types/KernelInput';
import { KernelResponse } from '../graphql-response-types/KernelResponse';
import { childProcessCmd } from '../utils/childProcessCmd';

@Resolver()
export class KernelResolver {
  @Mutation(() => KernelResponse)
  async childProcessCmd(@PubSub('KERNEL_MESSAGE') publish: Publisher<any>, @Args() { cmd, shell = true, path }: KernelInput) {
    await publish({ message: 'waiting response from kernel...\n' });
    try {
      const response = await childProcessCmd(cmd, path);
      await publish({ message: response.toString('utf8') });
    } catch (error) {
      await publish({ errors: [{ message: error.toString('utf8'), path: 'kernelMessage' }] });
    }
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
