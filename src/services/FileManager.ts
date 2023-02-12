import { Document, DocumentOpt } from "../../server/src/common/interfaces/document";
import http from "./http";
import { AxiosResponse } from "axios";

class FileManager {

    public static getDocuments(parentId: number | null = null): Promise<AxiosResponse<any, any>>  {
        return http.get(`/doc/list/${parentId}`);
    }

    public static uploadFile(data: any): Promise<AxiosResponse<any, any>>  {
        return http.post('/doc/upload-file', data);
    }

    public static saveFolder(data: Document): Promise<AxiosResponse<any, any>>  {
        return http.post('/doc/save-folder', data);
    }

    public static updateDoc(id: number, data: DocumentOpt): Promise<AxiosResponse<any, any>>  {
        return http.put(`/doc/update/${id}`, data);
    }

    public static removeDoc(id: number): Promise<AxiosResponse<any, any>>  {
        return http.put(`/doc/remove/${id}`);
    }

    public static deleteDoc(id: number): Promise<AxiosResponse<any, any>>  {
        return http.put(`/doc/delete/${id}`);
    }

    public static download(id: number): Promise<AxiosResponse<any, any>>  {
        return http.get(`/doc/download/${id}`);
    }
}

export default FileManager;