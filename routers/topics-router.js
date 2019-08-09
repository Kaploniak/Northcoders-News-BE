const topicsRouter = require("express").Router();
const { sendTopics, addNewTopic } = require("../controllers/topics-controller");
const { methodNotAllowed } = require("../errors");

topicsRouter
  .route("/")
  .get(sendTopics)
  .post(addNewTopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;
