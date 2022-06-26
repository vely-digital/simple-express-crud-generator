import { Request, Router } from "express";

export interface CustomRequest extends Request {
  body?: object;
}

export interface IHistoryChange {
  model: any;
  enumText: string;
}

export interface InfoController {
  router: Router;
  model: any;
  customMethods: any;
  multiTenant: boolean;
  middlewareArray: any;
  historyChange: IHistoryChange;
}
