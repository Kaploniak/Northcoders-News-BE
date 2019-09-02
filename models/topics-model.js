const connection = require("../db/connection");
const { checkIfExists } = require("../controllers/utils");

exports.selectTopics = () => {
  return connection.select("slug", "description").from("topics");
};

exports.createdTopic = topic => {
  if (!topic || !topic.slug) {
    return Promise.reject({
      status: 400,
      message: "Bad request, when empty body passed"
    });
  } else {
    return checkIfExists(topic.slug, "topics", "slug")
      .then(response => {
        if (!response) {
          return connection
            .insert(topic)
            .into("topics")
            .returning("*");
        } else {
          return Promise.reject({
            status: 422,
            message: "Topic already exist"
          });
        }
      })
      .then(topic => {
        return topic;
      });
  }
};
