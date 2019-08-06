const connection = require("../db/connection");

exports.selectArticleByArticleId = article_id => {
  return connection
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .select("articles.*")
    .groupBy("articles.article_id", "comments.article_id")
    .count("comments.article_id AS comment_count")
    .from("articles")
    .where("articles.article_id", article_id)
    .then(article => {
      if (!article || !article.length) {
        return Promise.reject({ status: 404, message: "Article do not exist" });
      } else {
        return article;
      }
    });
};

exports.updateArticleVotesByArticleId = (article_id, inc_votes) => {
  return connection
    .increment("votes", inc_votes || 0)
    .into("articles")
    .where("article_id", "=", article_id)
    .returning("*")
    .then(article => {
      if (!article || !article.length) {
        return Promise.reject({ status: 404, message: "Article do not exist" });
      } else {
        return article;
      }
    });
};
