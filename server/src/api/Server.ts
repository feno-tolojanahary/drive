import express, { Express } from "express";

class Server {
    private app: Express;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
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