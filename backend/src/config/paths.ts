import root from 'app-root-path';
import path from 'path';

// set dev and prod docker location
export const paths = {
  binFolder: path.join(root.path, '../', '/bin/build/'),
  pythonFolder: path.join(root.path, '../', '/bin/python/'),
  logFolder: path.join(root.path, '../', '/data/log/'),
  dbFolder: path.join(root.path, '../', '/data/sql/'),
  dbFile: path.join(root.path, '../', '/data/sql', 'uavcast.db'),
  supervisorWsAddress: 'ws://127.0.0.1:32500'
};
