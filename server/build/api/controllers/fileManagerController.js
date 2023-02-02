"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const documentManager_1 = __importDefault(require("../services/documentManager"));
const node_fs_1 = __importStar(require("node:fs"));
const node_path_1 = require("node:path");
const node_zlib_1 = require("node:zlib");
const node_stream_1 = require("node:stream");
const helper_1 = require("../../common/helper");
const client_1 = require("@prisma/client");
const node_util_1 = require("node:util");
const constant_1 = require("../helpers/constant");
const pipe = (0, node_util_1.promisify)(node_stream_1.pipeline);
class FileManagerController {
}
_a = FileManagerController;
FileManagerController.saveDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new Error("no body received");
        }
        const savedDoc = yield documentManager_1.default.save(req.body);
        res.status(200).json(savedDoc);
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error saveUpload: " + err);
        next(err);
    }
});
FileManagerController.getDocuments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docs = yield documentManager_1.default.getAll();
        res.status(200).json(docs);
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error getAll: " + err);
        next(err);
    }
});
FileManagerController.updateDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id || !req.body) {
            throw new Error("no param id or body given");
        }
        const doc = req.body;
        let updatedDoc = null;
        if (doc.type === client_1.DocType.FILE) {
            updatedDoc = yield documentManager_1.default.updateDocument({ id: +req.params.id }, doc);
        }
        else if (doc.type === client_1.DocType.FOLDER) {
            updatedDoc = yield documentManager_1.default.updateFolder({ id: +req.params.id }, doc);
        }
        res.status(200).json(updatedDoc);
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error getAll: " + err);
        next(err);
    }
});
FileManagerController.removeFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id) {
            throw new Error("no param id given");
        }
        const removedFile = yield documentManager_1.default.removeFile({ id: +req.params.id });
        res.status(200).json(removedFile);
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error getAll: " + err);
        next(err);
    }
});
FileManagerController.deleteDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id) {
            throw new Error("no param id given");
        }
        const removedFile = yield documentManager_1.default.deleteDoc({ id: +req.params.id });
        res.status(200).json(removedFile);
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error getAll: " + err);
        next(err);
    }
});
FileManagerController.readStreamVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileDoc = yield documentManager_1.default.findOne({ id: +req.params.id });
        if (!fileDoc || !fileDoc.key)
            throw new Error("file not found");
        if (!(0, helper_1.isVideoFile)(fileDoc.key))
            throw new Error("The file is not a video extension");
        const path = (0, node_path_1.join)(__dirname, constant_1.BASE_DIR, ...fileDoc.key.split("/"));
        const stat = node_fs_1.default.statSync(path);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = node_fs_1.default.createReadStream(path, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        }
        else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            node_fs_1.default.createReadStream(path).pipe(res);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Reading video stream: " + err);
        next(err);
    }
});
FileManagerController.downloadDoc = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileDoc = yield documentManager_1.default.findOne({ id: +req.params.id });
        if (!fileDoc || !fileDoc.key)
            throw new Error("file not found");
        const docPath = (0, node_path_1.join)(__dirname, constant_1.BASE_DIR, fileDoc.key);
        if (fileDoc.type === client_1.DocType.FILE) {
            res.download(docPath, `${fileDoc.originalname}`);
        }
        else {
            const tempPath = (0, node_path_1.join)(__dirname, constant_1.BASE_DIR, "temp", new Date().toLocaleDateString().replace('/', '-'));
            yield node_fs_1.default.mkdir(tempPath, { recursive: true }, (err, path) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    throw err;
                const gzFolderPath = `${path}/${fileDoc}.gz`;
                yield pipe((0, node_fs_1.createReadStream)(docPath), (0, node_zlib_1.createGzip)(), (0, node_fs_1.createWriteStream)(gzFolderPath));
                res.download(gzFolderPath, `${fileDoc}.gz`);
                next();
            }));
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error downloading file" + err);
        next(err);
    }
});
exports.default = FileManagerController;
