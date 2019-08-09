const { selectUserByUsername, createdUser } = require("../models/users-model");

exports.sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then(user => {
      res.status(200).send({ user: user[0] });
    })
    .catch(err => next(err));
};

exports.addNewUser = (req, res, next) => {
  const user = req.body;
  createdUser(user)
    .then(user => {
      res.status(201).send({ user: user[0] });
    })
    .catch(err => next(err));
};
