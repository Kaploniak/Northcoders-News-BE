const articlesRouter = require("express").Router();
const { sendArticleById } = require("../controllers/article-controller");

articlesRouter.route("/:article_id").get(sendArticleById);

module.exports = articlesRouter;
