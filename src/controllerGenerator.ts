import { Router, Request, Response, NextFunction } from "express";
import { IGenerateModelMethods } from "./interfaces/modelGeneratorInterfaces";
import {
  CustomRequest,
  InfoController,
} from "./interfaces/controllerGeneratorInterfaces";

const noMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  next();
};

const generateController = (
  info: InfoController
  // router: Router,
  // model: any,
  // {
  //   customGet,
  //   customList,
  //   customCreate,
  //   customEdit,
  //   customDelete,
  // }: IGenerateModelMethods = {},
  // multiTenant: boolean = false,
  // middlewareArray: any = noMiddleware
) => {
  const router = info.router;
  const model = info.model;
  const customMethods: IGenerateModelMethods = info.customMethods
    ? info.customMethods
    : {};

  const multiTenant = info.multiTenant ? info.multiTenant : false;
  const middlewareArray = info.middlewareArray
    ? info.middlewareArray
    : noMiddleware;

  const historyChange = info.historyChange ? info.historyChange : false;

  if (customMethods.customList == undefined) {
    router.post(
      "/list",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        const database = res.locals.database;

        let saveItem = undefined;
        if (multiTenant && database) {
          saveItem = await database[model].findBy(req.body);
        } else {
          saveItem = await model.findBy(req.body);
        }

        if (saveItem.status === 200) {
          res.json(saveItem.payload);
        } else {
          res.status(500).send(saveItem.err);
        }
      }
    );
  } else {
    router.post(
      "/list",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        customMethods.customList(req, res);
      }
    );
  }

  if (customMethods.customGet == undefined) {
    router.get(
      "/:id",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        let modelGet = undefined;
        const database = res.locals.database;

        if (multiTenant) {
          modelGet = await database[model].findOneBy(req.params.id);
        } else {
          modelGet = await model.findOneBy(req.params.id);
        }

        if (modelGet.status === 200) {
          res.json(modelGet.payload);
        } else {
          res.status(500).send(modelGet.err);
        }
      }
    );
  } else {
    router.get(
      "/:id",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        customMethods.customGet(req, res);
      }
    );
  }

  if (customMethods.customCreate == undefined) {
    router.post(
      "/",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        let items = undefined;
        const database = res.locals.database;

        if (multiTenant) {
          items = await database[model].createBy(req.body);
        } else {
          items = await model.createBy(req.body);
        }

        if (items.status == 200) {
          res.send(items.payload);
        } else {
          res.status(500).send(items.payload);
        }
      }
    );
  } else {
    router.post(
      "/",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        customMethods.customCreate(req, res);
      }
    );
  }

  if (customMethods.customDelete == undefined) {
    router.delete(
      "/:id",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        let items = undefined;
        const database = res.locals.database;

        if (multiTenant) {
          items = await database[model].deleteBy(req.params.id);
        } else {
          items = await model.deleteBy(req.params.id);
        }

        if (historyChange) {
          await database[historyChange.model].create({
            user_id: res.locals.user.id,
            enumConstant: `${historyChange.enumText}_DELETE`,
            changeInfo: JSON.stringify({ id: req.params.id }),
          });
        }

        if (items.status == 200) {
          res.send(items.payload);
        } else {
          res.status(500).send(items.payload);
        }
      }
    );
  } else {
    router.delete(
      "/",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        customMethods.customDelete(req, res);
      }
    );
  }

  router.delete(
    "/",
    middlewareArray,
    async (req: CustomRequest, res: Response) => {
      let items = undefined;
      const database = res.locals.database;

      if (multiTenant) {
        items = await database[model].multipleDeleteBy(req.body);
      } else {
        items = await model.multipleDeleteBy(req.body);
      }

      if (historyChange) {
        await database[historyChange.model].create({
          user_id: res.locals.user.id,
          enumConstant: `${historyChange.enumText}_MULTIPLE_DELETE`,
          changeInfo: JSON.stringify({ ids: req.body }),
        });
      }

      if (items.status == 200) {
        res.send(items.payload);
      } else {
        res.status(500).send(items.payload);
      }
    }
  );

  if (customMethods.customEdit == undefined) {
    router.put(
      "/:id",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        let items = undefined;
        const database = res.locals.database;

        if (multiTenant) {
          items = await database[model].editBy(req.params.id, req.body);
        } else {
          items = await model.editBy(req.params.id, req.body);
        }

        if (historyChange) {
          await database[historyChange.model].create({
            user_id: res.locals.user.id,
            enumConstant: `${historyChange.enumText}_EDIT`,
            changeInfo: JSON.stringify({ id: req.params.id, change: req.body }),
          });
        }

        if (items.status == 200) {
          res.send(items.payload);
        } else {
          res.status(500).send(items.payload);
        }
      }
    );
  } else {
    router.put(
      "/:id",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        customMethods.customEdit(req, res);
      }
    );
  }
};

export default generateController;
