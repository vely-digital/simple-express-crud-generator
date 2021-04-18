import { IGenerateModelArgs, IGenerateModelMethods } from "./interfaces/modelGeneratorInterfaces";
declare const generateModel: (schema: any, { listPopulate, listSelect, getPopulate, getSelect }: IGenerateModelArgs, { customGet, customList, customCreate, customEdit, customDelete, }?: IGenerateModelMethods) => void;
export default generateModel;
