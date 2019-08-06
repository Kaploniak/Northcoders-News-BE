const { postNewCommentByArticleId } = require("../models/comments-model");

exports.addNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  postNewCommentByArticleId(article_id, username, body)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(err => next(err));
};
