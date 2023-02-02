"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const busboy_1 = __importDefault(require("busboy"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
const node_crypto_1 = require("node:crypto");
const object_sizeof_1 = __importDefault(require("object-sizeof"));
const client_1 = require("@prisma/client");
const BASE_DIR = "../../../../../DATA";
const uploadFile = (req, res, next) => {
    const bb = (0, busboy_1.default)({ headers: req.headers });
    let file;
    const contentSize = (0, object_sizeof_1.default)(req.body);
    bb.on('file', (name, stream, info) => {
        const { filename } = info;
        const generatedName = getGeneratedName(filename);
        const saveTo = node_path_1.default.join(__dirname, BASE_DIR, generatedName);
        req.pipe((0, node_fs_1.createWriteStream)(saveTo));
        file = Object.assign(Object.assign({}, info), { originalname: filename, name: generatedName, size: contentSize, type: client_1.DocType.FILE });
    });
    bb.on('close', () => {
        res.writeHead(200, { 'Connection': 'close' });
        res.end('Done');
        for (const attr in file) {
            req.body[attr] = file;
        }
        next();
    });
    bb.on('field', (name, value, _info) => {
        let nameVal;
        if (name === "parent") {
            nameVal = +value;
        }
        else {
            nameVal = value;
        }
        req.body[name] = nameVal;
    });
    req.pipe(bb);
    next();
    return;
};
const random = (() => {
    const buf = Buffer.alloc(16);
    return () => (0, node_crypto_1.randomFillSync)(buf).toString('hex');
})();
function getGeneratedName(filename) {
    const ext = node_path_1.default.extname(filename);
    return `${random()}.${ext}`;
}
exports.default = uploadFile;
