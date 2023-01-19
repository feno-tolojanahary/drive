import { Express } from "express";
import uploadFile from "../functionnalities/uploadFile";
import FileManagerController from "../controllers/fileManagerController";

class FileManager {
    app: Express;

    constructor(app: Express) {
        this.app = app;
    }

    routes() {
        this.app.post('/upload-file', uploadFile, FileManagerController.saveUpload);
        this.app.post('/findAll', FileManagerController.getAll)
    }
}

export default FileManager;