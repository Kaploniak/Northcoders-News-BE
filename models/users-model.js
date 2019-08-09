const connection = require("../db/connection");

exports.selectUserByUsername = username => {
  if (/^[a-z_-]+$/i.test(username)) {
    return connection
      .select("*")
      .from("users")
      .where("username", "=", username)
      .then(user => {
        if (!user || !user.length) {
          return Promise.reject({ status: 404, message: "User not found" });
        } else {
          return user;
        }
      });
  } else {
    return Promise.reject({ status: 400, message: "Bad request" });
  }
};

exports.createdUser = user => {
  return connection
    .insert(user)
    .into("users")
    .returning("*")
    .then(user => {
      if (!user || !user.length) {
        return Promise.reject({ status: 404, msg: "User not found - test" });
      } else {
        return user;
      }
    });
};
