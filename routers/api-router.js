const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const commentRouter = require("./comment-router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
