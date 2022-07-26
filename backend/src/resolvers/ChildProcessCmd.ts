import { Root, Args, Subscription, Resolver, PubSub, Mutation, Publisher } from 'type-graphql';
import { KernelInput } from '../graphql-input-types/KernelInput';
import { KernelResponse } from '../graphql-response-types/KernelResponse';
import { childProcessCmdCallback } from '../utils/childProcessCmd';

@Resolver()
export class KernelResolver {
  @Mutation(() => KernelResponse)
  async childProcessCmd(@PubSub('KERNEL_MESSAGE') publish: Publisher<any>, @Args() { cmd, path: cwd, sensitiv }: KernelInput) {
    await publish({ message: 'waiting for response...\n' });

    childProcessCmdCallback({ cmd, options: { cwd }, sensitiv }, async ({ error, response, code }) => {
      if (error) {
        return await publish({ errors: [{ message: error.toString('utf8'), path: 'kernelMessage' }] });
      }

      await publish({ message: response.toString('utf8'), data: `Return code ${code}` });
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
