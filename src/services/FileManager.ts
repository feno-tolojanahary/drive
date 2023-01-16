import http from "./http";

class FileManager {
    constructor() {}

    getDocumentTree() {
        
    }

    static uploadFile(data: any) {
        return http.post('/upload-file', data);
    }
}

export default FileManager;