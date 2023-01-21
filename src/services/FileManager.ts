import { Document } from "../../server/src/common/interfaces/document";
import http from "./http";

class FileManager {
    constructor() {}

    public static getDocuments() {
        return http.get('/doc/list');
    }

    public static uploadFile(data: any) {
        return http.post('/doc/upload-file', data);
    }

    public static saveFolder(data: Document) {
        return http.post('/doc/save-folder', data);
    }
}

export default FileManager;