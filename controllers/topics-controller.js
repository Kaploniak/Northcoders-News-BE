const { selectTopics, createdTopic } = require("../models/topics-model");

exports.sendTopics = (req, res, next) => {
  selectTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

exports.addNewTopic = (req, res, next) => {
  const topic = req.body;
  createdTopic(topic)
    .then(topic => {
      res.status(201).send({ topic: topic[0] });
    })
    .catch(err => next(err));
};
