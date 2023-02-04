import express, { Express, Router } from "express";
import uploadFile from "../functionnalities/uploadFile";
import FileManagerController from "../controllers/fileManagerController";

class FileManager {
    private app: Express;
    private router: Router;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.routes();
        this.app.use('/doc', this.router);
    }

    private routes() {
        this.router.post('/upload-file', uploadFile, FileManagerController.saveDocument);
        this.router.post('/save-folder', FileManagerController.saveDocument)
        this.router.get('/list', FileManagerController.getDocuments);
        this.router.put('/update/:id', FileManagerController.updateDocument);
        this.router.put('/remove/:id', FileManagerController.removeFile);
        this.router.delete('/delete/:id', FileManagerController.deleteDocument);
        this.router.get('/read-video/:id', FileManagerController.readStreamVideo);
        this.router.get('/download/:id', FileManagerController.downloadDoc);
    }
}

export default FileManager;