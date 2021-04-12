const express = require("express");
const mongoose = require("mongoose");
const app = express();
var bodyParser = require("body-parser");

const { MongoMemoryServer } = require("mongodb-memory-server");

const dotenv = require("dotenv");
dotenv.config();

const controller = require("./controller");

const mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;
mongoServer.getUri().then((mongoUri) => {
  const mongooseOpts = {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  };

  mongoose.connect(mongoUri, mongooseOpts);

  mongoose.connection.on("error", (e) => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      mongoose.connect(mongoUri, mongooseOpts);
    }
    console.log(e);
  });

  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/cat", controller);

app.listen(5004);
console.log("App is listening on port " + 5004);

module.exports = app;
