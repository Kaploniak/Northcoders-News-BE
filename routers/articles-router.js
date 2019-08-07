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

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleVotesByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .post(addNewComment)
  .get(sendAllCommentsByArticleId);

articlesRouter.route("/").get(sendAllArticles);

module.exports = articlesRouter;
