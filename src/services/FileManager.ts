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

    public static updateDoc(data: Document) {
        return http.put(`/doc/update/${data.id}`, data);
    }

    public static removeDoc(id: number) {
        return http.put(`/doc/remove/${id}`);
    }

    public static deleteDoc(id: number) {
        return http.put(`/doc/delete/${id}`);
    }
}

export default FileManager;