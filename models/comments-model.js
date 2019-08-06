const connection = require("../db/connection");

exports.postNewCommentByArticleId = (article_id, username, body) => {
  return connection
    .insert({
      body: body,
      article_id: article_id,
      author: username,
      votes: 0
    })
    .into("comments")
    .returning("*")
    .then(comment => {
      if (!comment || !comment.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return comment;
      }
    });
};
