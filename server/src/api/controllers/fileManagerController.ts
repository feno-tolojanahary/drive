import { NextFunction, Request, Response } from "express";
import DocumentManager from "../managers/documentManager";

class FileManagerController {
    
    public static saveUpload = (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body) {
                throw new Error("no body received")
            }
            const savedDoc = DocumentManager.save(req.body);
            res.status(200).json(savedDoc);
        } catch (err) {
            console.log(err)
            res.status(500).send("Error saveUpload: " + err)
        }
    }

    public static getAll = (req: Request, res: Response, next: NextFunction) => {
        try {
            const docs = DocumentManager.getAll();
            res.status(200).json(docs);
        } catch(err) {
            console.log(err)
            res.status(500).send("Error getAll: " + err);
        }
    }
}

export default FileManagerController;