const path = require('path');
const root = require('app-root-path');

// data merged in /backend/src/createTypeormCon.ts
module.exports = [
  {
    name: 'default',
    type: 'sqlite',
    synchronize: true,
    logging: false,
    entities: ['src/entity/**/*{.ts,.js}'],
    migrations: ['src/migration/**/*{.ts,.js}'],
    subscribers: ['src/subscriber/**/*{.ts,.js}'],
    seeds: ['src/seeds/**/*{.ts,.js}'],
    factories: ['src/factories/**/*{.ts,.js}'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    }
  },
  {
    name: 'production',
    type: 'sqlite',
    synchronize: false, // switch this to false once you have the initial tables created and use migrations instead
    logging: false,
    seeds: ['src/seeds/**/*{.ts,.js}'],
    factories: [`${__dirname}/dist/factories/**/*{.ts,.js}`],
    entities: [`${__dirname}/dist/entity/**/*.js`],
    migrations: [path.join(__dirname, 'dist/migration/**/*.js')],
    subscribers: [path.join(__dirname, 'dist/subscriber/**/*.js')]
  }
];
