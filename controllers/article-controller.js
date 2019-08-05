const { selectArticleByArticleId } = require("../models/article-model");

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByArticleId(article_id).then(article => {
    res.status(200).send(...article);
  });
};
