"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileManager_1 = __importDefault(require("./fileManager"));
class Routes {
    constructor(app) {
        this.app = app;
    }
    init() {
        new fileManager_1.default(this.app);
    }
}
exports.default = Routes;
