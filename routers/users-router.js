const usersRouter = require("express").Router();
const {
  sendUserByUsername,
  addNewUser
} = require("../controllers/users-controller");
const { methodNotAllowed } = require("../errors");

usersRouter
  .route("/:username")
  .get(sendUserByUsername)
  .all(methodNotAllowed);

usersRouter
  .route("/")
  .post(addNewUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
