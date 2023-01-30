import { Document, DocumentOpt } from "../../server/src/common/interfaces/document";
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

    public static updateDoc(id: number, data: DocumentOpt) {
        return http.put(`/doc/update/${id}`, data);
    }

    public static removeDoc(id: number) {
        return http.put(`/doc/remove/${id}`);
    }

    public static deleteDoc(id: number) {
        return http.put(`/doc/delete/${id}`);
    }

    public static downloadFile(id: number) {
        return http.get(`/doc/download/${id}`);
    }
}

export default FileManager;