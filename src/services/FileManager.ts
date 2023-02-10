import { Document, DocumentOpt } from "../../server/src/common/interfaces/document";
import http from "./http";

class FileManager {
    constructor() {}

    public static getDocuments(parentId: number | null = null) {
        return http.get(`/doc/list/${parentId}`);
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

    public static download(id: number) {
        return http.get(`/doc/download/${id}`);
    }
}

export default FileManager;