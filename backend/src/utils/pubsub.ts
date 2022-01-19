import { PubSub } from 'apollo-server-express';

const pubsub = new PubSub();
export default pubsub;

let isConnected = false;
export const setConStaus = (sta: boolean) => {
  isConnected = sta;
};
export const getConStaus = () => {
  return isConnected;
};
