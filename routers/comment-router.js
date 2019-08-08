const commentRouter = require("express").Router();
const {
  patchCommentVotesByCommentId,
  deleteComment
} = require("../controllers/comments-controller");
const { methodNotAllowed } = require("../errors");

commentRouter
  .route("/:comment_id")
  .patch(patchCommentVotesByCommentId)
  .delete(deleteComment)
  .all(methodNotAllowed);

module.exports = commentRouter;
