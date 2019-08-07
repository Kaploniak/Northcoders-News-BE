const connection = require("../db/connection");
exports.checkIfExists = (query, table, column) => {
  return connection
    .select("*")
    .from(table)
    .where(column, query)
    .then(result => {
      if (result.length === 0) return false;
      else return true;
    });
};
