import { NextFunction, Request, Response } from "express";
import DocumentManager from "../services/documentManager";
import { Document } from "@prisma/client";
import fs, { createReadStream, createWriteStream } from "node:fs";
import { join } from "node:path";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream";
import { isVideoFile } from "../../common/helper";
import { DocType } from "@prisma/client";
import { promisify } from "node:util";
import { BASE_DIR } from "../helpers/constant";

const pipe = promisify(pipeline);
class FileManagerController {
    
    public static saveDocument = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body) {
                throw new Error("no body received")
            }
            const savedDoc: Document = await DocumentManager.save(req.body);
            if (savedDoc.type === DocType.FOLDER) {
                await fs.mkdir(join(__dirname, BASE_DIR, savedDoc.key), { recursive: true }, async (err) => {
                    if (err) {
                        await DocumentManager.deleteDoc({id: savedDoc.id})
                        throw err;
                    };
                })
            }
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
            const docs: Document[] = await DocumentManager.getAll(req.params.parentId);
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
            const doc: any = req.body;
            let updatedDoc: Document | null = null;

            if (doc.type === DocType.FILE) {
                updatedDoc = await DocumentManager.updateDocument({id: +req.params.id}, doc);
            } else if (doc.type === DocType.FOLDER) {
                updatedDoc = await DocumentManager.updateFolder({id: +req.params.id}, doc);
            }
            res.status(200).json(updatedDoc);
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

    public static downloadDoc = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fileDoc: Document | null = await DocumentManager.findOne({ id: +req.params.id });
            if (!fileDoc || !fileDoc.key) throw new Error("file not found");
            const docPath = join(__dirname, BASE_DIR, fileDoc.key);

            if (fileDoc.type === DocType.FILE) {
                res.download(docPath, `${fileDoc.originalname}`);
            } else {
                const tempPath = join(__dirname, BASE_DIR, "temp", new Date().toLocaleDateString().replace('/', '-'));
                await fs.mkdir(tempPath, { recursive: true }, async (err, path) => {
                    if (err) throw err;
                    const gzFolderPath = `${path}/${fileDoc}.gz`;
                    await pipe(createReadStream(docPath), createGzip(), createWriteStream(gzFolderPath))
                    res.download(gzFolderPath, `${fileDoc}.gz`);
                    next();
                });
            }
        } catch(err) {
            console.log(err)
            res.status(500).send("Error downloading file" + err);
            next(err)
        }
    }
}

export default FileManagerController;