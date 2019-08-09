const connection = require("../db/connection");

exports.selectTopics = () => {
  return connection.select("slug", "description").from("topics");
};

exports.createdTopic = topic => {
  return connection
    .insert(topic)
    .into("topics")
    .returning("*")
    .then(topic => {
      if (!topic || !topic.length) {
        return Promise.reject({ status: 404, msg: "Topic not found - test" });
      } else {
        return topic;
      }
    });
};
