const connection = require("../db/connection");
const { checkIfExists } = require("../controllers/utils");

exports.selectUserByUsername = username => {
  if (/(?!^\d+$)^.+$/gm.test(username)) {
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
  if (!user || !user.username) {
    return Promise.reject({
      status: 400,
      message: "Bad request"
    });
  } else {
    return checkIfExists(user.username, "users", "username")
      .then(response => {
        if (!response) {
          return connection
            .insert(user)
            .into("users")
            .returning("*");
        } else {
          return Promise.reject({
            status: 422,
            message: "User already exist"
          });
        }
      })
      .then(user => {
        return user;
      });
  }
};

exports.selectUsers = () => {
  return connection.select("*").from("users");
};
