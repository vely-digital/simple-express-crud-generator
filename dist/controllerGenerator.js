"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const noMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    next();
});
const generateController = (info
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
    const customMethods = info.customMethods
        ? info.customMethods
        : {};
    const multiTenant = info.multiTenant ? info.multiTenant : false;
    const middlewareArray = info.middlewareArray
        ? info.middlewareArray
        : noMiddleware;
    const historyChange = info.historyChange ? info.historyChange : false;
    if (customMethods.customList == undefined) {
        router.post("/list", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const database = res.locals.database;
            let saveItem = undefined;
            if (multiTenant && database) {
                saveItem = yield database[model].findBy(req.body);
            }
            else {
                saveItem = yield model.findBy(req.body);
            }
            if (saveItem.status === 200) {
                res.json(saveItem.payload);
            }
            else {
                res.status(500).send(saveItem.err);
            }
        }));
    }
    else {
        router.post("/list", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            customMethods.customList(req, res);
        }));
    }
    if (customMethods.customGet == undefined) {
        router.get("/:id", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            let modelGet = undefined;
            const database = res.locals.database;
            if (multiTenant) {
                modelGet = yield database[model].findOneBy(req.params.id);
            }
            else {
                modelGet = yield model.findOneBy(req.params.id);
            }
            if (modelGet.status === 200) {
                res.json(modelGet.payload);
            }
            else {
                res.status(500).send(modelGet.err);
            }
        }));
    }
    else {
        router.get("/:id", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            customMethods.customGet(req, res);
        }));
    }
    if (customMethods.customCreate == undefined) {
        router.post("/", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            let items = undefined;
            const database = res.locals.database;
            if (multiTenant) {
                items = yield database[model].createBy(req.body);
            }
            else {
                items = yield model.createBy(req.body);
            }
            if (items.status == 200) {
                res.send(items.payload);
            }
            else {
                res.status(500).send(items.payload);
            }
        }));
    }
    else {
        router.post("/", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            customMethods.customCreate(req, res);
        }));
    }
    if (customMethods.customDelete == undefined) {
        router.delete("/:id", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            let items = undefined;
            const database = res.locals.database;
            if (multiTenant) {
                items = yield database[model].deleteBy(req.params.id);
            }
            else {
                items = yield model.deleteBy(req.params.id);
            }
            if (historyChange) {
                yield database[historyChange.model].create({
                    user_id: res.locals.user.id,
                    enumConstant: `${historyChange.enumText}_DELETE`,
                    changeInfo: JSON.stringify({ id: req.params.id }),
                });
            }
            if (items.status == 200) {
                res.send(items.payload);
            }
            else {
                res.status(500).send(items.payload);
            }
        }));
    }
    else {
        router.delete("/", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            customMethods.customDelete(req, res);
        }));
    }
    router.delete("/", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let items = undefined;
        const database = res.locals.database;
        if (multiTenant) {
            items = yield database[model].multipleDeleteBy(req.body);
        }
        else {
            items = yield model.multipleDeleteBy(req.body);
        }
        if (historyChange) {
            yield database[historyChange.model].create({
                user_id: res.locals.user.id,
                enumConstant: `${historyChange.enumText}_MULTIPLE_DELETE`,
                changeInfo: JSON.stringify({ ids: req.body }),
            });
        }
        if (items.status == 200) {
            res.send(items.payload);
        }
        else {
            res.status(500).send(items.payload);
        }
    }));
    if (customMethods.customEdit == undefined) {
        router.put("/:id", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            let items = undefined;
            const database = res.locals.database;
            if (multiTenant) {
                items = yield database[model].editBy(req.params.id, req.body);
            }
            else {
                items = yield model.editBy(req.params.id, req.body);
            }
            if (historyChange) {
                yield database[historyChange.model].create({
                    user_id: res.locals.user.id,
                    enumConstant: `${historyChange.enumText}_EDIT`,
                    changeInfo: JSON.stringify({ id: req.params.id, change: req.body }),
                });
            }
            if (items.status == 200) {
                res.send(items.payload);
            }
            else {
                res.status(500).send(items.payload);
            }
        }));
    }
    else {
        router.put("/:id", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            customMethods.customEdit(req, res);
        }));
    }
};
exports.default = generateController;
//# sourceMappingURL=controllerGenerator.js.map