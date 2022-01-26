"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tedis_1 = require("tedis");
const config_1 = __importDefault(require("../config"));
const tedis = new tedis_1.Tedis({
    port: (config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.tedis.port) || 6379,
    host: (config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.tedis.host) || "127.0.0.1",
    password: (config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.tedis.password) || "kib20blxr21",
});
exports.default = tedis;
