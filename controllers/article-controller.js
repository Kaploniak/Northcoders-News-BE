const {
  selectArticleByArticleId,
  updateArticleVotesByArticleId
} = require("../models/article-model");

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByArticleId(article_id)
    .then(article => {
      res.status(200).send({ article: article[0] });
    })
    .catch(err => next(err));
};

exports.patchArticleVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotesByArticleId(article_id, inc_votes)
    .then(article => {
      res.status(201).send({ article: article[0] });
    })
    .catch(err => next(err));
};
