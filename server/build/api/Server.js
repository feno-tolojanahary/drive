"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cronJob_1 = __importDefault(require("./helpers/cronJob"));
class Server {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        // Initialize routes
        const routes = new routes_1.default(this.app);
        routes.init();
        // start cronjob
        new cronJob_1.default();
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
exports.default = Server;
