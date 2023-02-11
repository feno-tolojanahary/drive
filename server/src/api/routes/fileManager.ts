import { Router } from "express";
import uploadFile from "../functionnalities/uploadFile";
import FileManagerController from "../controllers/fileManagerController";
import { IRouteContructor, IRoute } from "./interfaces";

const FileManagerRoute: IRouteContructor = class FileManager implements IRoute {
    private router: Router;

    constructor(router: Router) {
        this.router = router;                                                                                                                                              
    }

    public routes() {
        this.router.post('/upload-file', uploadFile, FileManagerController.saveDocument);
        this.router.post('/save-folder', FileManagerController.saveDocument)
        this.router.get('/list/:parentId', FileManagerController.getDocuments);
        this.router.put('/update/:id', FileManagerController.updateDocument);
        this.router.put('/remove/:id', FileManagerController.removeFile);
        this.router.delete('/delete/:id', FileManagerController.deleteDocument);
        this.router.get('/read-video/:id', FileManagerController.readStreamVideo);
        this.router.get('/download/:id', FileManagerController.downloadDoc);
        this.router.use('/doc', this.router);         
    }
}

export default FileManagerRoute;