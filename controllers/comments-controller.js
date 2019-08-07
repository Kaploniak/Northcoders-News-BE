const {
  postNewCommentByArticleId,
  selectAllCommentsByArticleId,
  updateCommentByCommentId,
  removedComment
} = require("../models/comments-model");
const { selectArticleByArticleId } = require("../models/article-model");

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

  if (!/\d+/gm.test(article_id)) {
    return next({
      status: 400,
      message: "Bad request: Given article_id is not an integer."
    });
  }

  const article = selectArticleByArticleId(article_id);
  const comments = selectAllCommentsByArticleId(article_id, sort_by, order);

  Promise.all([article, comments])
    .then(([article, comments]) => {
      if (article[0].comment_count === "0") {
        res.status(200).send({ comments: [] });
      } else {
        res.status(200).send({ comments });
      }
      return comments;
    })
    .catch(err => next(err));
};

exports.patchCommentVotesByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentByCommentId(comment_id, inc_votes)
    .then(comment => {
      res.status(200).send({ comment: comment[0] });
    })
    .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removedComment(comment_id)
    .then(comment => {
      res.status(204).send({ msg: "Comment removed" });
    })
    .catch(err => next(err));
};
