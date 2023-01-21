import { NextFunction, Request, Response } from "express";
import DocumentManager from "../managers/documentManager";
import DocHelper from "../helpers/docHelper";
import { Document } from "../../common/interfaces/document";
class FileManagerController {
    
    public static saveUpload = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body) {
                throw new Error("no body received")
            }
            const savedDoc = await DocumentManager.save(req.body);
            res.status(200).json(savedDoc);
        } catch (err) {
            console.log(err)
            res.status(500).send("Error saveUpload: " + err)
        }
    }

    public static getDocuments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const docs: Document[] = await DocumentManager.getAll();
            // const treeDocs = DocHelper.getTreeDocs(docs);
            res.status(200).json(docs);
        } catch(err) {
            console.log(err)
            res.status(500).send("Error getAll: " + err);
        }
    }
}

export default FileManagerController;