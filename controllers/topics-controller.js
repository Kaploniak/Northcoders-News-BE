const { selectTopics } = require("../models/topics-model");

exports.sendTopics = (req, res, send) => {
  selectTopics().then(topics => {
    res.status(200).send({ topics });
  });
};
