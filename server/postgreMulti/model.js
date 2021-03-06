const { DataTypes, Op } = require("sequelize");
const Generator = require("../../dist/index");

module.exports = (sequelize, Sequelize) => {
  const Cat1 = sequelize.define("cat1", {
    cat: DataTypes.TEXT,
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  Generator.generateSqlModel(Cat1, {});

  return Cat1;
};
