exports.handlePSQLErrors = (err, req, res, next) => {
  const errCodes400 = {
    "22P02": "Invalid id",
    "23502": "No data to post!",
    "42703": "Bad request"
  };
  const errCodes404 = {
    "23503": "Page not found"
  };

  if (errCodes400[err.code]) {
    res.status(400).send({ msg: errCodes400[err.code] });
  } else if (errCodes404[err.code]) {
    res.status(404).send({ msg: errCodes404[err.code] });
  }
  next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.message });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};
