"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSqlModel = exports.controllerGenerator = exports.generateModel = void 0;
const modelGenerator_1 = __importDefault(require("./modelGenerator"));
exports.generateModel = modelGenerator_1.default;
const controllerGenerator_1 = __importDefault(require("./controllerGenerator"));
exports.controllerGenerator = controllerGenerator_1.default;
const sqlModelGenerator_1 = __importDefault(require("./sqlModelGenerator"));
exports.generateSqlModel = sqlModelGenerator_1.default;
//# sourceMappingURL=index.js.map