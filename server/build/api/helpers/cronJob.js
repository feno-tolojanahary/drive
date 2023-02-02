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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const constant_1 = require("./constant");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const _rm = (0, util_1.promisify)(fs_1.default.rm);
class CronJob {
    constructor() {
        // Every day 
        node_cron_1.default.schedule("0 0 * * *", () => {
            this.removeTempFolder();
        });
    }
    removeTempFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const tempPathYeasterday = (0, path_1.join)(__dirname, constant_1.BASE_DIR, "temp", date.toLocaleDateString().replace('/', '-'));
            yield _rm(tempPathYeasterday, { recursive: true, force: true });
        });
    }
}
exports.default = CronJob;
