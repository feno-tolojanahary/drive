import { readdir } from "node:fs/promises";
import { mkdir } from "node:fs";
import { promisify } from "node:util";

const BASE_DIR = "../Server";

class DocumentManagment {

    async createFolder(path: string) {
        const pMkdir = promisify(mkdir);
        return await pMkdir(`${BASE_DIR}/${path}`, {recursive: true}); 
    }
    
    async listFolder(path: string) {
        const pReaddir = promisify(readdir);
        return await pReaddir(`${BASE_DIR}/${path}`, { withFileTypes: true });
    }
}

module.exports = DocumentManagment;