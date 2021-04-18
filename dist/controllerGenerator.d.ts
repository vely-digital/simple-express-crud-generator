import { Router } from "express";
import { IGenerateModelMethods } from "./interfaces/modelGeneratorInterfaces";
declare const generateController: (router: Router, model: any, { customGet, customList, customCreate, customEdit, customDelete, }?: IGenerateModelMethods, multiTenant?: boolean, middlewareArray?: any) => void;
export default generateController;
