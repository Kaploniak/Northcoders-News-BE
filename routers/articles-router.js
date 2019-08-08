const articlesRouter = require("express").Router();
const {
  sendArticleById,
  patchArticleVotesByArticleId,
  sendAllArticles
} = require("../controllers/article-controller");
const {
  addNewComment,
  sendAllCommentsByArticleId
} = require("../controllers/comments-controller");
const { methodNotAllowed } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleVotesByArticleId)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .post(addNewComment)
  .get(sendAllCommentsByArticleId)
  .all(methodNotAllowed);

articlesRouter
  .route("/")
  .get(sendAllArticles)
  .all(methodNotAllowed);

module.exports = articlesRouter;
