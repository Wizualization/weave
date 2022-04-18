"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
let storedPrimitives = {
    "a07ff089-2ca2-1341-cc58-74509f1d8577": "line",
    "4f871493-ebf4-80b5-fc2b-b387d4e73a0d": "line",
    "1f1459f2-688e-5d2a-2366-5cb00328eb2c": "point",
    "9f7c9acd-c9e0-5051-71d5-889f13f8b145": "point",
    "9458d9af-68e1-e137-d7c8-546055a92cdd": "bar",
    "75e76e72-acb2-350c-3a95-a86ab5255c66": "column",
    "d4fbd561-d1f4-4192-7546-242ffb03dd59": "column"
};
let grimoire = { 'spells': {} };
//do it on a room basis for now
grimoire.rooms = {};
function ioConnection(socket) {
    socket.emit("IO_CONNECTED");
    const { id } = socket;
    const idString = `${id} (${socket.handshake.address})`;
    const { room, client } = socket.handshake.query;
    if (typeof grimoire.rooms[room] == 'undefined') {
        grimoire.rooms[room] = {};
        grimoire.rooms[room].spells = {};
    }
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
        grimoire.rooms[room].spells[guidGenerator()] = (JSON.parse(msg));
        console.log(grimoire);
        socket.to(room).emit("SPELL_UPDATE", JSON.stringify(grimoire.rooms[room]));
    });
    socket.on('spellmatched', (msg) => {
        let matched_spell = JSON.parse(msg);
        console.log('spell identified: ' + chalk.blue(msg));
        socket.to(room).emit("SPELL_MATCHED", { "key": matched_spell, "optoClass": storedPrimitives[matched_spell] });
    });
    socket.on("hello-room", (arg) => {
        console.log(arg);
        socket.to(room).emit("yes-room", "Yes room, I can hear you");
    });
}
exports.default = ioConnection;
