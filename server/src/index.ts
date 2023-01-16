import Server from "./api/Server";

const PORT: number = 7000;

const server = new Server(PORT);
server.start();