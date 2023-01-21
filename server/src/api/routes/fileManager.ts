import { Express } from "express";
import uploadFile from "../functionnalities/uploadFile";
import FileManagerController from "../controllers/fileManagerController";

class FileManager {
    app: Express;

    constructor(app: Express) {
        this.app = app;
        this.routes();
    }

    routes() {
        this.app.post('/doc/upload-file', uploadFile, FileManagerController.saveUpload);
        this.app.get('/doc/list', FileManagerController.getDocuments)
    }
}

export default FileManager;