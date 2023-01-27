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
        this.app.post('/doc/upload-file', uploadFile, FileManagerController.saveDocument);
        this.app.post('/doc/save-folder', FileManagerController.saveDocument)
        this.app.get('/doc/list', FileManagerController.getDocuments);
        this.app.put('/doc/update/:id', FileManagerController.updateDocument);
        this.app.put('/doc/remove/:id', FileManagerController.removeFile);
        this.app.delete('/doc/delete/:id', FileManagerController.deleteDocument);
        this.app.get('/doc/read-video/:id', FileManager.readStreamVideo)
    }
}

export default FileManager;