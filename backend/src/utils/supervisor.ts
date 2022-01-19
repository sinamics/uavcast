import { io } from 'socket.io-client';
import pubsub from './pubsub';
import { paths } from '../config/paths';

export const socket = io(paths.supervisorWsAddress);

export const supervisor = async() => {
  socket.on('SUPERVISOR_MESSAGES', async(message: any, errors: any) => {
    if (errors) return await pubsub.publish('U_SUPERVISOR_MESSAGE', { errors });
    await pubsub.publish('U_SUPERVISOR_MESSAGE', { message });
  });
};
