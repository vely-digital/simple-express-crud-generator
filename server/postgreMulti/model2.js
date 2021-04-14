const { DataTypes, Op } = require("sequelize");
const Generator = require("../../dist/index");

module.exports = (sequelize, Sequelize) => {
  const Cat2 = sequelize.define("cat2", {
    cat2: DataTypes.TEXT,
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  Generator.generateSqlModel(Cat2, {});

  return Cat2;
};
