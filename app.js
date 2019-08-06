const express = require("express");
const apiRouter = require("./routers/api-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  // console.log(err, "<----- inside app");
  if (err.code === "22P02" || err.status === 400) {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.status) {
    res.status(err.status).send({ msg: err.message });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Page not found" });
});

module.exports = app;
