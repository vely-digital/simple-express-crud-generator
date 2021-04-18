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
const generateModel = (schema, { listPopulate, listSelect, getPopulate, getSelect }, { customGet, customList, customCreate, customEdit, customDelete, } = {}) => {
    schema.statics.findOneBy = function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("got in model", id);
                let payload = yield this.findOne({ _id: id })
                    .populate(getPopulate)
                    .select(getSelect);
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
    schema.statics.findBy = function ({ autocomplete, sort, page, limit, when, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let searchFilter = autocomplete
                    ? {
                        [autocomplete.key]: {
                            $regex: autocomplete.value,
                            $options: "i",
                        },
                    }
                    : {};
                let whenFilter = when ? Object.assign({}, when) : {};
                let customFilter = Object.assign(Object.assign({}, searchFilter), whenFilter);
                let items = yield this.find(customFilter)
                    .populate(listPopulate)
                    .select(listSelect)
                    .sort(sort)
                    .skip((page - 1) * limit)
                    .limit(limit);
                let count = yield this.countDocuments(customFilter);
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
    schema.statics.createBy = function (model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let saved = yield new this(model).save();
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
    schema.statics.editBy = function (id, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let saved = yield this.findOneAndUpdate({ _id: id }, { $set: model }, {
                    useFindAndModify: false,
                    new: true,
                });
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
    schema.statics.deleteBy = function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deleted = yield this.updateOne({ _id: id }, { $set: { deleted: true } });
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
    schema.statics.multipleDeleteBy = function (query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deleted = yield this.updateMany({ _id: { $in: query } }, { $set: { deleted: true } });
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
//# sourceMappingURL=modelGenerator.js.map