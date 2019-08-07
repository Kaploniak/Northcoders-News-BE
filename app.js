const express = require("express");
const apiRouter = require("./routers/api-router");
const { handlePSQLErrors, handleCustomErrors, handle500 } = require("./errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Page not found" });
});

module.exports = app;
