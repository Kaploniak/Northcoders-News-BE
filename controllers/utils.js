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

exports.totalCount = (table, author, topic) => {
  return connection
    .select("*")
    .from(table)
    .modify(queryBuilder => {
      if (author) queryBuilder.where("articles.author", author);
      if (topic) queryBuilder.where("articles.topic", topic);
    })
    .then(articles => {
      if (articles.length === 0) return 0;
      else return articles.length;
    });
};
