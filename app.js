const express = require("express");
const apiRouter = require("./routers/api-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log(err, "<----- from app");

  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
