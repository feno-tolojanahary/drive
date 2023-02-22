import express, { Express, Router } from "express";
import FileManagerRouter from "./fileManager";
import ArchiveRouter from "./archive";
import RecentRouter from "./recent";
class Routes {
    private app: Express;
    private router: Router;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
    }

    public init() {
        new FileManagerRouter(this.router).routes();
        new ArchiveRouter(this.router).routes();
        new RecentRouter(this.router).routes();
        this.app.use(this.router);  
    }
}

export default Routes;