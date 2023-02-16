import cron from "node-cron";
import { BASE_DIR } from "./constant";
import { join } from "path";
import fs from "fs";
import { promisify } from "util";
import ArchiveService from "../services/archiveService";

const _rm = promisify(fs.rm);

class CronJob {

    constructor() {
        // Every day 
        cron.schedule("0 0 * * *", () => {
            this.removeTempFolder();
            ArchiveService.deleteExpiredArchive();
        });
    }

    private async removeTempFolder() {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const tempPathYeasterday = join(__dirname, BASE_DIR, "temp", date.toLocaleDateString().replace('/', '-'));
        await _rm(tempPathYeasterday, { recursive: true, force: true });
    }
}

export default CronJob;