const { DataTypes, Op } = require("sequelize");
const Generator = require("../dist/index");
const db = require("./sequalizeDatabase");
const Model = db.tutorials;

module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorial", {
    cat: DataTypes.TEXT,
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  Generator.generateSqlModel(Tutorial, {});

  return Tutorial;
};
