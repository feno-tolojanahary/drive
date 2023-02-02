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
const promises_1 = require("node:fs/promises");
const node_fs_1 = require("node:fs");
const node_util_1 = require("node:util");
const BASE_DIR = "../Server";
class DocumentManagment {
    createFolder(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const pMkdir = (0, node_util_1.promisify)(node_fs_1.mkdir);
            return yield pMkdir(`${BASE_DIR}/${path}`, { recursive: true });
        });
    }
    listFolder(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const pReaddir = (0, node_util_1.promisify)(promises_1.readdir);
            return yield pReaddir(`${BASE_DIR}/${path}`, { withFileTypes: true });
        });
    }
}
module.exports = DocumentManagment;
