exports.formatDates = list => {
  return list.map(item => {
    const newObj = { ...item };
    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
};

exports.makeRefObj = list => {
  return list.reduce((refObj, item) => {
    refObj[item.title] = item.article_id;
    return refObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const formatedComment = { ...comment };
    const author = formatedComment.created_by;
    formatedComment.created_at = new Date(formatedComment.created_at);
    const { belongs_to, created_by, ...restOfComments } = formatedComment;
    const article_id = articleRef[belongs_to];
    return { article_id, author, ...restOfComments };
  });
};
