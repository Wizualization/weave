"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const __1 = require("../");
const utils_1 = require("../utils");
function ioConnection(socket) {
    socket.emit("IO_CONNECTED");
    const { id } = socket;
    const idString = `${id} (${socket.handshake.address})`;
    const { room, client } = socket.handshake.query;
    // If client isn't specified, assume it's a headset
    const clientType = client !== "vscode" ? "headset" : "vscode";
    const clientString = chalk_1.default.green(clientType.toUpperCase());
    socket.join(room);
    const roomMsg = chalk_1.default.grey(`New ${clientString} connected to room ${room}: ${idString}`);
    utils_1.printMsg(`${chalk_1.default.green.bold("> ")}${roomMsg}`);
    socket.on("disconnect", () => {
        utils_1.printMsg(`${chalk_1.default.red.bold("< ")}${chalk_1.default.grey("Client disconnected: ")}${chalk_1.default.grey(idString)}`);
    });
    socket.on("hello-room", (arg) => {
        console.log(arg);
        __1.io.to(room).emit("yes-room", "Yes room, I can hear you");
    });
}
exports.default = ioConnection;
