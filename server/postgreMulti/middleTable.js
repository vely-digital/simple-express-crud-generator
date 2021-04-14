const { DataTypes, Op } = require("sequelize");
const Generator = require("../../dist/index");

module.exports = (sequelize, Sequelize) => {
  const Cat1Cat2 = sequelize.define("cat1cat2", {
    set: DataTypes.TEXT,
  });

  Generator.generateSqlModel(Cat1Cat2, {});

  return Cat1Cat2;
};
