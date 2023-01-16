import busboy from "busboy";
import internal from "node:stream";
import path from "node:path";
import { createWriteStream } from "node:fs";
import { randomFillSync } from "node:crypto";
import { NextFunction, Request, Response } from "express";

const BASE_DIR = "../../../../../DATA";

interface CustomFileInfo extends busboy.FileInfo {
    originalname: string,
    name: string,
    type?: string
}

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    const bb = busboy({ headers: req.headers });
    let file: CustomFileInfo;
    bb.on('file', (name: string, stream: internal.Readable, info: busboy.FileInfo) => {
        const { filename } = info;
        const generatedName = getGeneratedName(filename);
        const saveTo = path.join(__dirname, BASE_DIR, generatedName);
        req.pipe(createWriteStream(saveTo));
        file = {
            ...info,
            originalname: filename,
            name: generatedName
        };
    })
    bb.on('close', () => {
        res.writeHead(200, { 'Connection': 'close' });
        res.end('Done');
        for (const attr in file) {
            req.body[attr] = file;
        }
        next();
    })
    bb.on('field', (name, value, _info) => {
        req.body[name] = value;
    })
    req.pipe(bb);
    next();
    return;
}

const random = (() => {
    const buf = Buffer.alloc(16);
    return () => randomFillSync(buf).toString('hex');
})();

function getGeneratedName (filename: string) {
    const ext = path.extname(filename);
    return `${random()}.${ext}`;
}

export default uploadFile;