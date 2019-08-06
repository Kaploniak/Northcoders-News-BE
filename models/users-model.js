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
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
};
