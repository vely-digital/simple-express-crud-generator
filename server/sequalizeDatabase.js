const Sequelize = require("sequelize");
const sequelize = new Sequelize("seq_test", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./test.model.js")(sequelize, Sequelize);

module.exports = db;
