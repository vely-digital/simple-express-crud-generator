const Cat1Ref = require("./model.js");
const Cat2Ref = require("./model2");
const Cat1Cat2Ref = require("./middleTable");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("seq_test", "postgres", "1234", {
  host: "127.0.0.1",
  port: "5432",
  dialect: "postgres",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.cat1 = (sequelize, Sequelize);

const Cat1 = Cat1Ref(sequelize, Sequelize, this);
const Cat2 = Cat2Ref(sequelize, Sequelize, this);
const Cat1Cat2 = Cat1Cat2Ref(sequelize, Sequelize, this);

const getScheme = (scheme, model) => {
  if (true) {
    return model.schema(scheme);
  } else {
    return model;
  }
};

const models = {
  cat: (scheme = "public") => {
    return getScheme(scheme, Cat1);
  },
  cat2: (scheme = "public") => {
    return getScheme(scheme, Cat2);
  },
  cat1cat2: (scheme = "public") => {
    return getScheme(scheme, Cat1Cat2);
  },
};

const createSchemaOurs = async (cat) => {
  console.log("cat", cat);
  const schemaName = cat.cat;
  await sequelize.createSchema(schemaName);
  await Object.keys(db.models).forEach(async (currentItem) => {
    models[currentItem](schemaName).sync();
  });

  const loginSchemaCat = await db.models.cat(schemaName).create(cat);
  const loginSchemaPublic = await db.models.cat().create(cat);

  return true;
};

Cat1.associateBelongsToMany([
  {
    model: Cat2,
    value: { as: "cat1s", through: Cat1Cat2 },
  },
]);

Cat2.associateBelongsToMany([
  {
    model: Cat1,
    value: { as: "cat2s", through: Cat1Cat2 },
  },
]);

db.models = models;
db.createSchemaOurs = createSchemaOurs;

module.exports = db;
