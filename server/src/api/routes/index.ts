import FileManager from "./fileManager";
import { Express } from "express";

class Routes {
    app: Express

    constructor(app: Express) {
        this.app = app;
    }

    public init() {
        new FileManager(this.app);
    }
}

export default Routes;