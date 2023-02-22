import http from "./http";
import { AxiosResponse } from "axios";

class RecentService {

    public static getRecent(): Promise<AxiosResponse<any, any>> {
        return http.get('/recent');
    }
}

export default RecentService;