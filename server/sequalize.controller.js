const router = require("express").Router();
const Generator = require("../dist/index");
const db = require("./sequalizeDatabase");
const Model = db.tutorials;

const options = {};

Generator.controllerGenerator(router, Model, options, false);

module.exports = router;
