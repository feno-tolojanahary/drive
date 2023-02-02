"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uploadFile_1 = __importDefault(require("../functionnalities/uploadFile"));
const fileManagerController_1 = __importDefault(require("../controllers/fileManagerController"));
class FileManager {
    constructor(app) {
        this.app = app;
        this.routes();
    }
    routes() {
        this.app.post('/doc/upload-file', uploadFile_1.default, fileManagerController_1.default.saveDocument);
        this.app.post('/doc/save-folder', fileManagerController_1.default.saveDocument);
        this.app.get('/doc/list', fileManagerController_1.default.getDocuments);
        this.app.put('/doc/update/:id', fileManagerController_1.default.updateDocument);
        this.app.put('/doc/remove/:id', fileManagerController_1.default.removeFile);
        this.app.delete('/doc/delete/:id', fileManagerController_1.default.deleteDocument);
        this.app.get('/doc/read-video/:id', fileManagerController_1.default.readStreamVideo);
        this.app.get('/doc/download/:id', fileManagerController_1.default.downloadDoc);
    }
}
exports.default = FileManager;
