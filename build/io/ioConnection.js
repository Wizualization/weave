"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function ioConnection(socket) {
    socket.emit("IO_CONNECTED");
    const { id } = socket;
    const idString = `${id} (${socket.handshake.address})`;
    const { room, client } = socket.handshake.query;
    // If client isn't specified, assume it's a headset
    const clientType = client !== "vscode" ? "headset" : "vscode";
    const clientString = chalk.green(clientType.toUpperCase());
    socket.join(room);
    const roomMsg = chalk.grey(`New ${clientString} connected to room ${room}: ${idString}`);
    console.log(`${chalk.green.bold("> ")}${roomMsg}`);
    socket.on("disconnect", () => {
        console.log(`${chalk.red.bold("< ")}${chalk.grey("Client disconnected: ")}${chalk.grey(idString)}`);
    });
    socket.on('spellcast', (msg) => {
        console.log('spell: ' + chalk.blue(msg));
        socket.to(room).emit("SPELL_UPDATE", msg);
        //ssocket.io.emit("spell", "alakazam");
    });
    socket.on("hello-room", (arg) => {
        console.log(arg);
        socket.to(room).emit("yes-room", "Yes room, I can hear you");
    });
}
exports.default = ioConnection;
