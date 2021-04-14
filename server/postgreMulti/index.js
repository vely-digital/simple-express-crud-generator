const express = require("express");
const app = express();
var bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const controller = require("./controller");
const controller2 = require("./controller2");

const db = require("./database");
db.sequelize.sync();

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/cat", controller);
app.use("/cat2", controller2);

app.listen(5005);
console.log("App is listening on port " + 5005);

module.exports = app;
