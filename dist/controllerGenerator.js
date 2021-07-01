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
const generateController = (router, model, { customGet, customList, customCreate, customEdit, customDelete, } = {}, multiTenant = false, middlewareArray = noMiddleware) => {
    if (customList == undefined) {
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
            customList(req, res);
        }));
    }
    if (customGet == undefined) {
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
            customGet(req, res);
        }));
    }
    if (customCreate == undefined) {
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
        console.log("customCreate", customCreate);
        router.post("/", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            customCreate(req, res);
        }));
    }
    if (customDelete == undefined) {
        router.delete("/:id", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            let items = undefined;
            const database = res.locals.database;
            if (multiTenant) {
                items = yield database[model].deleteBy(req.params.id);
            }
            else {
                items = yield model.deleteBy(req.params.id);
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
            customDelete(req, res);
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
        if (items.status == 200) {
            res.send(items.payload);
        }
        else {
            res.status(500).send(items.payload);
        }
    }));
    if (customEdit == undefined) {
        router.put("/:id", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            let items = undefined;
            const database = res.locals.database;
            if (multiTenant) {
                items = yield database[model].editBy(req.params.id, req.body);
            }
            else {
                items = yield model.editBy(req.params.id, req.body);
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
        router.put(":id", middlewareArray, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            customEdit(req, res);
        }));
    }
};
exports.default = generateController;
//# sourceMappingURL=controllerGenerator.js.map