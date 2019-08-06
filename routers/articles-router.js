const articlesRouter = require("express").Router();
const {
  sendArticleById,
  patchArticleVotesByArticleId
} = require("../controllers/article-controller");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleVotesByArticleId);

module.exports = articlesRouter;
