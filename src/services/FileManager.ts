import http from "./http";

class FileManager {
    constructor() {}

    public static getDocuments() {
        return http.get('/doc/list');
    }

    public static uploadFile(data: any) {
        return http.post('/doc/upload-file', data);
    }
}

export default FileManager;