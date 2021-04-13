const TutorialsRef = require("./model.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("seq_test", "postgres", "1234", {
  host: "127.0.0.1",
  port: "5432",
  dialect: "postgres",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = (sequelize, Sequelize);

const Tutorials = TutorialsRef(sequelize, Sequelize, this);

const getScheme = (scheme, model) => {
  if (true) {
    return model.schema(scheme);
  } else {
    return model;
  }
};

const models = {
  cat: (scheme = "public") => {
    return getScheme(scheme, Tutorials);
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

db.models = models;
db.createSchemaOurs = createSchemaOurs;

module.exports = db;
