
exports.up = function(knex) {
  return knex.schema.createTable('user', tbl => {
    tbl.increments()
    tbl.text('username', 20).notNullable().unique()
    tbl.varchar('password').notNullable()
    tbl.text('department').notNullable()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user')
};
