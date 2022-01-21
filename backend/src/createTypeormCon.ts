import { createConnection, getConnectionOptions } from 'typeorm';
import { paths } from './config/paths';

export const createTypeormConn = async () => {
  let retries = 5;
  while (retries) {
    try {
      const options = await getConnectionOptions(process.env.NODE_ENV !== 'production' ? 'default' : 'production');
      const conn = createConnection({ ...options, database: paths.dbFile || '', type: 'sqlite' });
      return (await conn).synchronize();
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
      retries -= 1;
      console.log(`retries left: ${retries}`); // eslint-disable-line no-console
      // wait 5 seconds
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  return null;
};
