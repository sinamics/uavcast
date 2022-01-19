const { MigrationInterface, QueryRunner, QueryBuilder, Table } = require('typeorm');

class PostRefactoring1613820162728 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'map',
        columns: [
          {
            name: 'mavCockpitDisable',
            type: 'Boolean',
            default: 0,
            nullable: false
          }
        ]
      })
    );

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('map')
      .values([{ mavCockpitDisable: 0 }])
      .execute();
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "maps"`);
  }
}
module.exports = PostRefactoring1613820162728;
// Run migration
// typeorm migration:run -c sqlite

// Revert migration
// typeorm migration:revert -c sqlite

// Generate Migration file
// typeorm migration:generate -n PostRefactoring

// npx ts-node node_modules/..../typeorm !!!!
