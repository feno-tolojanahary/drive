import { AxiosResponse } from "axios";
import http from "./http";

class ArchiveService {
    
    public static archive(id: number): Promise<AxiosResponse<any, any>> {
        return http.put(`/archive/create/${id}`);
    }
}

export default ArchiveService;