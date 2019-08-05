exports.up = function(connection) {
  console.log("creating users table...");
  return connection.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .primary()
      .notNullable();
    usersTable.string("avatar_url");
    usersTable.string("name").notNullable();
  });
};

exports.down = function(connection) {
  console.log("removing users tables...");
  return connection.schema.dropTable("users");
};
