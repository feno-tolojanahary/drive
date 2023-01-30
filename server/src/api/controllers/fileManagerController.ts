import { NextFunction, Request, Response } from "express";
import DocumentManager from "../services/documentManager";
import { Document } from "../../common/interfaces/document";
import fs from "node:fs";
import { join } from "node:path";
import { isVideoFile } from "../../common/helper";
 
const BASE_DIR = "../../../../../DATA";
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

    public static readStreamVideo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fileDoc: Document | null = await DocumentManager.findOne({ id: +req.params.id });
            if (!fileDoc || !fileDoc.key) throw new Error("file not found");
            if (!isVideoFile(fileDoc.key)) throw new Error("The file is not a video extension")

            const path = join(__dirname, BASE_DIR, ...fileDoc.key.split("/"));
            const stat = fs.statSync(path);
            const fileSize = stat.size;
            const range = req.headers.range;
            
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize-1;
                const chunksize = (end-start) + 1;
                const file = fs.createReadStream(path, {start, end});
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(200, head);
                fs.createReadStream(path).pipe(res);
            }
        } catch(err) {
            console.log(err)
            res.status(500).send("Reading video stream: " + err);
            next(err)
        }
    }

    // public static async getFileKey (doc: Prisma.DocumentCreateInput): Promise<string> {
    //     const parentKeys: Document[] = [];
    //     let parent = null;
    //     if (!doc.parent) return "";
    //     do {
    //         parent = await DocumentManager.findOne({id: doc.parent});
    //         if (parent) {
    //             parentKeys.push(parent.key);
    //         }
    //     } while(parent !== null);
    // }
}

export default FileManagerController;