import { Router, Request, Response, NextFunction } from "express";
import { IGenerateModelMethods } from "./interfaces/modelGeneratorInterfaces";
import { CustomRequest } from "./interfaces/controllerGeneratorInterfaces";

const noMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  next();
};

const generateController = (
  router: Router,
  model: any,
  {
    customGet,
    customList,
    customCreate,
    customEdit,
    customDelete,
  }: IGenerateModelMethods = {},
  middlewareArray: any = noMiddleware
) => {
  if (customList == undefined) {
    router.post(
      "/list",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        const saveItem = await model.findBy(req.body);
        if (saveItem.status === 200) {
          res.json(saveItem.payload);
        } else {
          res.status(500).send(saveItem.err);
        }
      }
    );
  } else {
    router.post("/list", middlewareArray, customList);
  }

  if (customGet == undefined) {
    router.get(
      "/:id",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        let modelGet = await model.findOneBy(req.params.id);

        if (modelGet.status === 200) {
          res.json(modelGet.payload);
        } else {
          res.status(500).send(modelGet.err);
        }
      }
    );
  } else {
    router.get("/:id", middlewareArray, customGet);
  }

  if (customCreate == undefined) {
    router.post(
      "/",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        const items = await model.createBy(req.body);

        if (items.status == 200) {
          res.send(items.payload);
        } else {
          res.status(500).send(items.payload);
        }
      }
    );
  } else {
    router.post("/", middlewareArray, customCreate);
  }

  if (customDelete == undefined) {
    router.delete(
      "/:id",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        const items = await model.deleteBy(req.params.id);

        if (items.status == 200) {
          res.send(items.payload);
        } else {
          res.status(500).send(items.payload);
        }
      }
    );
  } else {
    router.delete("/", middlewareArray, customDelete);
  }

  router.delete(
    "/",
    middlewareArray,
    async (req: CustomRequest, res: Response) => {
      const items = await model.multipleDeleteBy(req.body);

      if (items.status == 200) {
        res.send(items.payload);
      } else {
        res.status(500).send(items.payload);
      }
    }
  );

  if (customEdit == undefined) {
    router.put(
      "/:id",
      middlewareArray,
      async (req: CustomRequest, res: Response) => {
        const item = await model.editBy(req.params.id, req.body);

        if (item.status == 200) {
          res.send(item.payload);
        } else {
          res.status(500).send(item.payload);
        }
      }
    );
  } else {
    router.put(":id", middlewareArray, customEdit);
  }
};

export default generateController;
