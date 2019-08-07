const commentRouter = require("express").Router();
const {
  patchCommentVotesByCommentId,
  deleteComment
} = require("../controllers/comments-controller");

commentRouter
  .route("/:comment_id")
  .patch(patchCommentVotesByCommentId)
  .delete(deleteComment);

module.exports = commentRouter;
