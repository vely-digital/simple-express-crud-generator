import {
  IGenerateModelArgs,
  IGenerateModelMethods,
  IFindBy,
  IBelongsToMany,
} from "./interfaces/modelGeneratorInterfaces";

const { Op } = require("sequelize");

const generateModel = (
  schema: any,
  { listPopulate, listSelect, getPopulate, getSelect }: IGenerateModelArgs,
  {
    customGet,
    customList,
    customCreate,
    customEdit,
    customDelete,
  }: IGenerateModelMethods = {}
) => {
  let joinsLulz: any = [];
  let createJoins: any = [];

  schema.associateBelongsTo = (models: []) => {
    models.map((model: any) => {
      schema.belongsTo(model);
      joinsLulz.push({ model: model });
    });
  };

  schema.associateHasMany = (models: []) => {
    models.map((model: []) => {
      schema.hasMany(model);
    });
  };

  schema.associateBelongsToMany = (models: any) => {
    models.map((model: any) => {
      schema.belongsToMany(model.model, model.value);
      joinsLulz.push({
        model: model.model,
        as: model.value.as ? model.value.as : undefined,
      });
      createJoins.push({
        model: model.model,
        as: model.value.as ? model.value.as : undefined,
      });
    });
  };

  schema.findOneBy = async function (id: string) {
    try {
      let payload = await this.findOne({
        where: { id: id },
        include: joinsLulz,
      });

      return {
        status: 200,
        payload,
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        payload: err,
      };
    }
  };

  schema.findBy = async function ({
    autocomplete,
    sort,
    page,
    limit,
    when,
  }: IFindBy) {
    try {
      let searchFilter = autocomplete
        ? {
            [autocomplete.key]: {
              [Op.like]: autocomplete.value + "%",
            },
          }
        : {};

      let whenFilter = when ? { ...when } : {};
      let customFilter = { ...searchFilter, ...whenFilter };

      const formatSort: any = [];
      if (sort?.split) {
        const formatsSplit = sort.split(" ");

        formatsSplit.map((splitObject: any) => {
          const tableName = splitObject.substring(1);
          if (splitObject.charAt(0) == "+") {
            formatSort.push([tableName, "ASC"]);
          } else if (splitObject.charAt(0) == "-") {
            formatSort.push([tableName, "DESC"]);
          }
        });
      }

      if (limit == undefined) {
        limit = 10;
      } else if (!(typeof limit == "number")) {
        limit = Number(limit);
      }

      if (page == undefined) {
        page = 1;
      }

      let items = await this.findAll({
        limit: limit,
        offset: (page - 1) * limit,
        where: { ...customFilter },
        order: formatSort,
        include: joinsLulz,
      });

      let count = await this.count({ where: { ...customFilter } });

      return {
        status: 200,
        payload: {
          count,
          page,
          pageSize: items.length,
          payload: items,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        payload: err,
      };
    }
  };

  schema.createBy = async function (model: object) {
    try {
      let saved = await this.create(model, { include: createJoins });

      return {
        status: 200,
        payload: saved,
      };
    } catch (err) {
      console.error(err);
      return { status: 500, payload: err };
    }
  };

  schema.editBy = async function (id: any, model: object) {
    try {
      let saved = await this.findOne({ where: { id: id } });
      await saved.update(model);
      console.log(saved);
      await saved.save();

      return {
        status: 200,
        payload: saved,
      };
    } catch (err) {
      console.error(err);
      return { status: 500, payload: err };
    }
  };

  schema.deleteBy = async function (id: any) {
    try {
      let deleted = await this.findOne({ where: { id: id } });
      await deleted.update({ deleted: true });
      console.log(deleted);
      await deleted.save();

      return {
        status: 200,
        payload: deleted,
      };
    } catch (err) {
      return {
        status: 500,
        payload: err,
      };
    }
  };

  schema.multipleDeleteBy = async function (id: any) {
    try {
      console.log("multipleDeleteBy", id);

      let deleted = await this.update({ deleted: true }, { where: { id: id } });
      return {
        status: 200,
        payload: deleted,
      };
    } catch (err) {
      return {
        status: 500,
        payload: err,
      };
    }
  };

  if (customGet != undefined) {
    schema.statics.findOneBy = customGet;
  }
  if (customList != undefined) {
    schema.statics.findBy = customGet;
  }
  if (customCreate != undefined) {
    schema.statics.createBy = customCreate;
  }
  if (customEdit != undefined) {
    schema.statics.editBy = customEdit;
  }
  if (customDelete != undefined) {
    schema.statics.deleteBy = customDelete;
  }
};

export default generateModel;
