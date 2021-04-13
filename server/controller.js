const router = require("express").Router();
const Model = require("./model");
const Generator = require("../dist/index");

const options = {};

Generator.controllerGenerator(router, Model, options, false);

module.exports = router;
