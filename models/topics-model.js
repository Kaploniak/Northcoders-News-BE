const connection = require("../db/connection");

exports.selectTopics = () => {
  return connection.select("slug", "description").from("topics");
};
