const express = require("express");
const mongoose = require("mongoose");
const app = express();
var bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const controller = require("./controller");

const { MONGO_IP, MONGO_PORT, MONGO_DATABASE_NAME, NODE_ENV, NODE_PORT } = process.env;

const mongoUrl = `mongodb://${MONGO_IP}:${MONGO_PORT}/${MONGO_DATABASE_NAME}`,
    port = NODE_ENV == "production" ? NODE_PORT : 5000;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected…"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/code", controller);

app.listen(port);
console.log("App is listening on port " + port);

module.exports = app; 
