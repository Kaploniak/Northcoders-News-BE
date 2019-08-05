exports.up = function(connection) {
  console.log("creating topics table...");
  return connection.schema.createTable("topics", topicsTable => {
    topicsTable.string("slug").primary();
    topicsTable.string("description");
  });
};

exports.down = function(connection) {
  console.log("removing topics tables...");
  return connection.schema.dropTable("topics");
};
