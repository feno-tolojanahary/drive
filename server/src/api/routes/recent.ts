import { Router } from "express";
import RecentController from "../controllers/recentController";
import { IRouteContructor, IRoute } from "./interfaces";

const RecentRouter: IRouteContructor = class Recent implements IRoute {
    private router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    public routes() {
        this.router.get('/', RecentController.getRecent);
        this.router.use('/recent', this.router)
    }
}

export default RecentRouter;