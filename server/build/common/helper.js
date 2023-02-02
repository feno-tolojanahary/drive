"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertKeyForSystem = exports.isVideoFile = exports.bytesToSize = void 0;
const constant_1 = require("./constant");
const node_path_1 = require("node:path");
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0)
        return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
    if (i === 0)
        return `${bytes} ${sizes[i]})`;
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
}
exports.bytesToSize = bytesToSize;
function isVideoFile(key) {
    const ext = key.split('.').pop() || "";
    return constant_1.VIDEOS_EXTENSIONS.includes(ext);
}
exports.isVideoFile = isVideoFile;
function convertKeyForSystem(key) {
    const arrPaths = key.split('/');
    return (0, node_path_1.join)(...arrPaths);
}
exports.convertKeyForSystem = convertKeyForSystem;
