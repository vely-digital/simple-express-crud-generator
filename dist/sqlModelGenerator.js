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
const { Op } = require("sequelize");
const generateModel = (schema, { listPopulate, listSelect, getPopulate, getSelect }, { customGet, customList, customCreate, customEdit, customDelete, } = {}) => {
    let joinsLulz = [];
    let createJoins = [];
    schema.associateBelongsTo = (models) => {
        models.map((model) => {
            var _a;
            schema.belongsTo(model.model, model.value);
            joinsLulz.push({
                model: model.model,
                as: ((_a = model === null || model === void 0 ? void 0 : model.value) === null || _a === void 0 ? void 0 : _a.as) ? model.value.as : undefined,
            });
        });
    };
    schema.associateHasMany = (models) => {
        models.map((model) => {
            schema.hasMany(model);
        });
    };
    schema.associateBelongsToMany = (models) => {
        models.map((model) => {
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
    schema.findOneBy = function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = yield this.findOne({
                    where: { id: id },
                    include: joinsLulz,
                });
                return {
                    status: 200,
                    payload,
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    payload: err,
                };
            }
        });
    };
    schema.findBy = function ({ autocomplete, sort, page, limit, when, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let searchFilter = autocomplete
                    ? {
                        [autocomplete.key]: {
                            [Op.like]: "%" + autocomplete.value + "%",
                        },
                    }
                    : {};
                let whenFilter = when ? Object.assign({}, when) : {};
                let customFilter = Object.assign(Object.assign({}, searchFilter), whenFilter);
                const formatSort = [];
                if (sort === null || sort === void 0 ? void 0 : sort.split) {
                    const formatsSplit = sort.split(" ");
                    formatsSplit.map((splitObject) => {
                        const tableName = splitObject.substring(1);
                        if (splitObject.charAt(0) == "+") {
                            formatSort.push([tableName, "ASC"]);
                        }
                        else if (splitObject.charAt(0) == "-") {
                            formatSort.push([tableName, "DESC"]);
                        }
                    });
                }
                if (limit == undefined) {
                    limit = 10;
                }
                else if (!(typeof limit == "number")) {
                    limit = Number(limit);
                }
                if (page == undefined) {
                    page = 1;
                }
                let items = yield this.findAll({
                    limit: limit,
                    offset: (page - 1) * limit,
                    where: Object.assign({}, customFilter),
                    order: formatSort,
                    include: joinsLulz,
                });
                let count = yield this.count({ where: Object.assign({}, customFilter) });
                return {
                    status: 200,
                    payload: {
                        count,
                        page,
                        pageSize: items.length,
                        payload: items,
                    },
                };
            }
            catch (err) {
                console.error(err);
                return {
                    status: 500,
                    payload: err,
                };
            }
        });
    };
    schema.createBy = function (model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let saved = yield this.create(model, { include: createJoins });
                return {
                    status: 200,
                    payload: saved,
                };
            }
            catch (err) {
                console.error(err);
                return { status: 500, payload: err };
            }
        });
    };
    schema.editBy = function (id, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let saved = yield this.findOne({ where: { id: id } });
                if (saved) {
                    yield saved.update(model);
                }
                else {
                    yield this.createBy(model);
                }
                return {
                    status: 200,
                    payload: saved,
                };
            }
            catch (err) {
                console.error(err);
                return { status: 500, payload: err };
            }
        });
    };
    schema.deleteBy = function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deleted = yield this.findOne({ where: { id: id } });
                yield deleted.update({ deleted: true });
                console.log(deleted);
                yield deleted.save();
                return {
                    status: 200,
                    payload: deleted,
                };
            }
            catch (err) {
                return {
                    status: 500,
                    payload: err,
                };
            }
        });
    };
    schema.multipleDeleteBy = function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("multipleDeleteBy", id);
                let deleted = yield this.update({ deleted: true }, { where: { id: id } });
                return {
                    status: 200,
                    payload: deleted,
                };
            }
            catch (err) {
                return {
                    status: 500,
                    payload: err,
                };
            }
        });
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
exports.default = generateModel;
//# sourceMappingURL=sqlModelGenerator.js.map