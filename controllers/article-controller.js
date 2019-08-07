const {
  selectArticleByArticleId,
  updateArticleVotesByArticleId,
  selectAllArticles
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
      res.status(200).send({ article: article[0] });
    })
    .catch(err => next(err));
};

exports.sendAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectAllArticles(sort_by, order, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => next(err));
};
