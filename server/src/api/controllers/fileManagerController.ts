import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
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
        }
    }
}

export default FileManagerController;