import express, { Express } from "express";
import Routes from "./routes";
import CronJob from "./helpers/cronJob";
class Server {
    private app: Express;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        // Initialize routes
        const routes = new Routes(this.app);
        routes.init();
        // start cronjob
        new CronJob();
    }

    getApp() {
        return this.app;
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(` Server listening on ${this.port} `);
        });
    }
}

export default Server;