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

exports.selectAllCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  const permittedColunms = [
    "comment_id",
    "author",
    "article_id",
    "votes",
    "created_at",
    "body"
  ];
  const permittedOrder = ["asc", "desc"];

  if (!permittedColunms.includes(sort_by)) {
    sort_by = "created_at";
  }
  if (!permittedOrder.includes(order)) {
    order = "desc";
  }
  return connection
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by, order)
    .then(comments => {
      if (!comments) {
        return Promise.reject({ status: 404, message: "Comments not found" });
      } else {
        return comments;
      }
    });
};
