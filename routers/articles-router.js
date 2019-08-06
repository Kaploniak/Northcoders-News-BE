const articlesRouter = require("express").Router();
const {
  sendArticleById,
  patchArticleVotesByArticleId
} = require("../controllers/article-controller");
const { addNewComment } = require("../controllers/comments-controller");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleVotesByArticleId);

articlesRouter.route("/:article_id/comments").post(addNewComment);

module.exports = articlesRouter;
