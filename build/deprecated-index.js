#!/usr/bin/env ts-node-script
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const commander_1 = __importDefault(require("commander"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("./utils");
const io_1 = require("./io");
const config_1 = __importDefault(require("./config"));
const VERSION = "1.0.0";
const DEFAULT_PORT = (config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.port) | 8440;
// Commander setup
commander_1.default
    .version(VERSION, "-v, --version", "Output current version number")
    .option("-p, --port <port number>", "Server port", DEFAULT_PORT.toString())
    .option("-d, --dev", "Development mode", false)
    .parse(process.argv);
// Print welcome
const devModeMsg = commander_1.default.dev ? chalk_1.default.red("DEVELOPMENT MODE") : "";
const verMsg = chalk_1.default.grey.bold(VERSION);
utils_1.printMsg(chalk_1.default.blue(`\nStarting KibblXR Server... ${devModeMsg}`));
utils_1.printMsg(`Version ${verMsg}`);
// Dev/prod mode client location
const CLIENT_PORT = commander_1.default.dev ? 8440 : commander_1.default.port;
// Express setup
const app = express_1.default();
const server = http_1.default.createServer(app);
// Socket.io setup
// require() is necessary in socketio 3.x... :(
// Exported to be reused easily in other modules
// eslint-disable-next-line @typescript-eslint/no-var-requires
exports.io = require("socket.io")(server, {
    // Fixes "WebSocket is already in CLOSING or CLOSED state" issue in Chrome
    // https://github.com/socketio/socket.io/issues/3259
    pingTimeout: 60000,
    // CORS is disabled by default in socket.io 3.x... :(
    // TODO: Work out what logic to put here for dev/prod
    cors: {
        origin: [
            `http://localhost:${commander_1.default.dev ? 8440 : DEFAULT_PORT}`,
            `https://localhost:3456`,
            `http://localhost:3455`,
            `http://localhost:3001`,
            `https://kibblxr.io`,
            `https://kibblxr.io:8440`,
            /\.simbroadcasts\.tv$/,
        ],
    },
    transports: ["websocket"],
});
// New client connection - Socket IO communications to clients
exports.io.on("connection", io_1.ioConnection);
// Server listen
server.listen(commander_1.default.port);
// Welcome logging
utils_1.printMsg(`\n${chalk_1.default.green("- ")}${chalk_1.default.grey("KibblXR Server Running: ")}${chalk_1.default.white(`http://${utils_1.getIP()}:`)}${chalk_1.default.white(CLIENT_PORT)}\n\n${chalk_1.default.grey("Press CTRL+C to exit")}\n`);
