const Sequelize = require("sequelize");
const sequelize = new Sequelize("test", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./test.model.js")(sequelize, Sequelize);

module.exports = db;
