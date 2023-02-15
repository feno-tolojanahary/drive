import { Router } from "express";
import ArchiveController from "../controllers/archiveController";
import { IRouteContructor, IRoute } from "./interfaces";

const ArchiveRoute: IRouteContructor = class Archive implements IRoute {
    private router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    public routes() {
        this.router.get('/', ArchiveController.getArchives);
        this.router.put('/create/:id', ArchiveController.archiveDoc);
        this.router.put('/restore/:id', ArchiveController.restoreDoc);
        this.router.delete('/delete/:id', ArchiveController.deleteDoc);
        this.router.use('/archive', this.router);
    }
}

export default ArchiveRoute;