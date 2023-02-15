import { NextFunction, Request, Response } from "express";
import ArchiveService from "../services/archiveService";

class ArchiveController {

    public static async getArchives (req: Request, res: Response, next: NextFunction) {
        try {   
            const archives   = await ArchiveService.getArchive();
            res.status(200).json(archives);
        } catch(err) {
            console.log(err)
            res.status(500).send("Error archiving doc: " + err)
            next(err)
        }
    }

    public static async archiveDoc(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id) {
                throw new Error("no param id doc given!");
            }
            const archivedDoc = await ArchiveService.archiveDoc({id: +req.params.id});
            res.status(200).json(archivedDoc);
        } catch(err) {
            console.log(err)
            res.status(500).send("Error archiving doc: " + err)
            next(err)
        }
    }

    public static async restoreDoc(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id) {
                throw new Error("no param id doc given!");
            }
            const restoredDoc = await ArchiveService.restoreDoc({id: +req.params.id});
            res.status(200).json(restoredDoc)
        } catch(err) {
            console.log(err)
            res.status(500).send("Error archiving doc: " + err)
            next(err)
        }
    }

    public static async deleteDoc(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id) {
                throw new Error("no param id doc given!");
            }
            const res = await ArchiveService.deleteDoc({id: +req.params.id});
            res.status(200).json(res)
        } catch(err) {
            console.log(err)
            res.status(500).send("Error deleting doc: " + err)
            next(err)
        }
    }
}

export default ArchiveController;