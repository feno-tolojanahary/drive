import { NextFunction, Request, Response } from "express";
import DocumentManager from "../services/documentManager";
import { Document } from "../../common/interfaces/document";
class FileManagerController {
    
    public static saveDocument = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body) {
                throw new Error("no body received")
            }
            const savedDoc = await DocumentManager.save(req.body);
            res.status(200).json(savedDoc);
            next()
        } catch (err) {
            console.log(err)
            res.status(500).send("Error saveUpload: " + err)
            next(err)
        }
    }

    public static getDocuments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const docs: Document[] = await DocumentManager.getAll();
            res.status(200).json(docs);
            next()
        } catch(err) {
            console.log(err)
            res.status(500).send("Error getAll: " + err);
            next(err)
        }
    }

    public static updateDocument = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.params.id || !req.body) {
                throw new Error("no param id or body given")
            }
            const doc: Document = await DocumentManager.updateDocument({id: +req.params.id}, req.body);
            res.status(200).json(doc);
            next()
        } catch(err) {
            console.log(err)
            res.status(500).send("Error getAll: " + err);
            next(err)
        }
    }

    public static removeFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.params.id) {
                throw new Error("no param id given")
            }
            const removedFile: Document = await DocumentManager.removeFile({id: +req.params.id});
            res.status(200).json(removedFile);
            next()
        } catch(err) {
            console.log(err)
            res.status(500).send("Error getAll: " + err);
            next(err)
        }
    }

    public static deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.params.id) {
                throw new Error("no param id given")
            }
            const removedFile: Document = await DocumentManager.deleteDoc({id: +req.params.id});
            res.status(200).json(removedFile);
            next()
        } catch(err) {
            console.log(err)
            res.status(500).send("Error getAll: " + err);
            next(err)
        }
    }
}

export default FileManagerController;