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
  order = "desc",
  limit = 10,
  p = 1
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
    .limit(limit)
    .offset(limit * (p - 1))
    .orderBy(sort_by, order)
    .then(comments => {
      if (!comments) {
        return Promise.reject({ status: 404, message: "Comments not found" });
      } else {
        return comments;
      }
    });
};

exports.updateCommentByCommentId = (comment_id, inc_votes) => {
  return connection
    .increment("votes", inc_votes || 0)
    .into("comments")
    .where("comment_id", "=", comment_id)
    .returning("*")
    .then(comment => {
      if (!comment || !comment.length) {
        return Promise.reject({ status: 404, message: "Comment do not exist" });
      } else {
        return comment;
      }
    });
};

exports.removedComment = comment_id => {
  return connection
    .select("*")
    .from("comments")
    .where("comments.comment_id", "=", comment_id)
    .returning("*")
    .del()
    .then(deleted => {
      if (deleted.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Comment with Id ${comment_id} not found`
        });
      } else {
        return deleted;
      }
    });
};
