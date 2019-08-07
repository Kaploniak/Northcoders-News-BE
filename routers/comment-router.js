const commentRouter = require("express").Router();
const {
  patchCommentVotesByCommentId
} = require("../controllers/comments-controller");

commentRouter.route("/:comment_id").patch(patchCommentVotesByCommentId);

module.exports = commentRouter;
