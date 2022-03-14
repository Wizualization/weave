"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
//import * as socketio from "socket.io";
const path = require("path");
const ioConnection_1 = require("./io/ioConnection");
var cors = require('cors');
const app = express();
app.use(cors());
app.set("port", process.env.PORT || 8440);
let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require('socket.io')(http, {
    pingTimeout: 60000,
    credentials: true
});
/*, {
  cors: {
    origin: "https://optomancy.com",
    methods: ["GET", "POST"],
    credentials: true
  }
}*/
app.use(express.static('./.well-known')); //Serves resources from public folder
app.use('/.well-known', express.static(__dirname + '/.well-known'));
app.get("/", (req, res) => {
    res.sendFile(path.resolve("./client/index.html"));
});
app.get("/test", (req, res) => {
    res.sendFile("./landing.html", { root: 'src' });
});
// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", ioConnection_1.default);
/*io.on("connection", function(socket: any) {
  console.log("a user connected");
});*/
const server = http.listen(8440, function () {
    console.log("listening on *:8440");
});
