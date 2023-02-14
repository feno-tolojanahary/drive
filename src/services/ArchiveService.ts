import { AxiosResponse } from "axios";
import http from "./http";

class ArchiveService {
    
    public static archive(id: number): Promise<AxiosResponse<any, any>> {
        return http.put(`/archive/create/${id}`);
    }

    public static getArchives(): Promise<AxiosResponse<any, any>> {
        return http.get('/archive');
    }

    public static restore(id: number): Promise<AxiosResponse<any, any>> {
        return http.put(`/archive/restore/${id}`)
    }
}

export default ArchiveService;