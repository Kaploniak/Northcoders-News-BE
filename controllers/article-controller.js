const {
  selectArticleByArticleId,
  updateArticleVotesByArticleId,
  selectAllArticles
} = require("../models/article-model");
const { checkIfExists } = require("../controllers/utils");

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
  const { sort_by, order, limit, author, topic, p } = req.query;
  const articles = selectAllArticles(sort_by, order, limit, author, topic, p);
  const checkIfAuthorExists = author
    ? checkIfExists(author, "users", "username")
    : null;
  const checkIfTopicExists = topic
    ? checkIfExists(topic, "topics", "slug")
    : null;

  Promise.all([checkIfAuthorExists, checkIfTopicExists, articles])
    .then(([checkIfAuthorExists, checkIfTopicExists, articles]) => {
      if (checkIfAuthorExists === false) {
        return Promise.reject({ status: 404, message: "Author not found" });
      } else if (checkIfTopicExists === false) {
        return Promise.reject({ status: 404, message: "Topic not found" });
      } else {
        res.status(200).send({ articles });
      }
    })
    .catch(err => next(err));
};
