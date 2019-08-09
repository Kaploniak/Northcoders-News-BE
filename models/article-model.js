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
      if (!article.length) {
        return Promise.reject({ status: 404, message: "Article do not exist" });
      } else {
        return article;
      }
    });
};

exports.selectAllArticles = (
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  author,
  topic,
  p = 1
) => {
  const permittedOrder = ["asc", "desc"];
  const permittedColunms = [
    "article_id",
    "title",
    "votes",
    "author",
    "topic",
    "created_at",
    "comment_count"
  ];
  if (!permittedColunms.includes(sort_by)) sort_by = "created_at";
  if (!permittedOrder.includes(order)) order = "desc";

  return connection
    .select(
      "articles.article_id",
      "articles.title",
      "articles.votes",
      "articles.author",
      "articles.topic",
      "articles.created_at"
    )
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id", "comments.article_id")
    .count("comments.article_id AS comment_count")
    .orderBy(sort_by, order)
    .limit(limit)
    .offset(limit * (p - 1))
    .modify(queryBuilder => {
      if (author) queryBuilder.where("articles.author", author);
      if (topic) queryBuilder.where("articles.topic", topic);
    })
    .then(articles => {
      if (!articles) {
        return Promise.reject({
          status: 404,
          message: "Articles not found"
        });
      } else {
        return articles;
      }
    });
};

exports.createdArticle = article => {
  return connection
    .insert(article)
    .into("articles")
    .returning("*")
    .then(article => {
      if (!article || !article.length) {
        return Promise.reject({ status: 404, msg: "Article not found - test" });
      } else {
        return article;
      }
    });
};

exports.removedArticle = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .del()
    .then(deleted => {
      if (!deleted) {
        return Promise.reject({
          status: 404,
          message: `Article with Id ${article_id} not found`
        });
      } else {
        return "Deleted";
      }
    });
};
