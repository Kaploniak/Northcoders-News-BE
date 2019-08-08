const usersRouter = require("express").Router();
const { sendUserByUsername } = require("../controllers/users-controller");
const { methodNotAllowed } = require("../errors");

usersRouter
  .route("/:username")
  .get(sendUserByUsername)
  .all(methodNotAllowed);

module.exports = usersRouter;
