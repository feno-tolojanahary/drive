import { NextFunction, Request, Response } from "express";
import RecentService from "../services/recentService";

class RecentController {

    public static async getRecent(req: Request, res: Response, next: NextFunction) {
        try {   
            const recents   = await RecentService.getRecent();
            res.status(200).json(recents);
        } catch(err) {
            console.log(err)
            res.status(500).send("Error get recent doc: " + err)
            next(err)
        }
    }
}

export default RecentController;