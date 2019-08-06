const {
  postNewCommentByArticleId,
  selectAllCommentsByArticleId
} = require("../models/comments-model");

exports.addNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  postNewCommentByArticleId(article_id, username, body)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(err => next(err));
};

exports.sendAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  selectAllCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};
