const express = require("express");
const mongoose = require("mongoose");
const app = express();
var bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const controller = require("./controller");

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected…"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/test", controller);

const port = process.env.PORT || 5000;
app.listen(port);
console.log("App is listening on port " + port);
