import { Schema } from "mongoose";
import {
  IGenerateModelArgs,
  IGenerateModelMethods,
  IFindBy,
} from "./interfaces/modelGeneratorInterfaces";

const generateModel = (
  schema: Schema,
  { listPopulate, listSelect, getPopulate, getSelect }: IGenerateModelArgs,
  {
    customGet,
    customList,
    customCreate,
    customEdit,
    customDelete,
  }: IGenerateModelMethods = {}
) => {
  schema.statics.findOneBy = async function (id: string) {
    try {
      console.log("got in model", id);
      let payload = await this.findOne({ _id: id })
        .populate(getPopulate)
        .select(getSelect);

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

  schema.statics.findBy = async function ({
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
              $regex: autocomplete.value,
              $options: "i",
            },
          }
        : {};

      let whenFilter = when ? { ...when } : {};
      let customFilter = { ...searchFilter, ...whenFilter };

      let items = await this.find(customFilter)
        .populate(listPopulate)
        .select(listSelect)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      let count = await this.countDocuments(customFilter);

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

  schema.statics.createBy = async function (model: object) {
    try {
      let saved = await new this(model).save();

      return {
        status: 200,
        payload: saved,
      };
    } catch (err) {
      console.error(err);
      return { status: 500, payload: err };
    }
  };

  schema.statics.editBy = async function (id: string, model: object) {
    try {
      let saved = await this.findOneAndUpdate(
        { _id: id },
        { $set: model },
        {
          useFindAndModify: false,
          new: true,
        }
      );

      return {
        status: 200,
        payload: saved,
      };
    } catch (err) {
      console.error(err);
      return { status: 500, payload: err };
    }
  };

  schema.statics.deleteBy = async function (id: string) {
    try {
      let deleted = await this.updateOne(
        { _id: id },
        { $set: { deleted: true } }
      );
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

  schema.statics.multipleDeleteBy = async function (query: any) {
    try {
      let deleted = await this.updateMany(
        { _id: { $in: query } },
        { $set: { deleted: true } }
      );
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
