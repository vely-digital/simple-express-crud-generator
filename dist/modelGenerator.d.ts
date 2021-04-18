import { Schema } from "mongoose";
import { IGenerateModelArgs, IGenerateModelMethods } from "./interfaces/modelGeneratorInterfaces";
declare const generateModel: (schema: Schema, { listPopulate, listSelect, getPopulate, getSelect }: IGenerateModelArgs, { customGet, customList, customCreate, customEdit, customDelete, }?: IGenerateModelMethods) => void;
export default generateModel;
