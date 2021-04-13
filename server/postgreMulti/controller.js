const router = require("express").Router();
const Generator = require("../../dist/index");
const db = require("./database");
const Model = db.models.cat;

const options = {};

router.post("/generateSchema", async function (req, res) {
  const resss = await db.createSchemaOurs(req.body);
  if (resss) {
    res.json({ res: "YEYE" });
  }
});

Generator.controllerGenerator(router, Model, options, true);

module.exports = router;
