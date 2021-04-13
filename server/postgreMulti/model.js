const { DataTypes, Op } = require("sequelize");
const Generator = require("../../dist/index");

module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorial", {
    cat: DataTypes.TEXT,
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  Generator.generateSqlModel(Tutorial, {});

  return Tutorial;
};
