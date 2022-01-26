#!/usr/bin/env node
var PORT = 8443;
var HOSTNAME = "0.0.0.0";

import program from "commander";
import http from "http";
import express from "express";
import chalk from "chalk";
import { getIP, printMsg } from "./utils";
import { ioConnection } from "./io";
import config from "./config";

const VERSION = "1.0.0";
const DEFAULT_PORT = config?.port | 8080;

// Commander setup
program
  .version(VERSION, "-v, --version", "Output current version number")
  .option("-p, --port <port number>", "Server port", DEFAULT_PORT.toString())
  .option("-d, --dev", "Development mode", false)
  .parse(process.argv);

// Print welcome
const devModeMsg = program.dev ? chalk.red("DEVELOPMENT MODE") : "";
const verMsg = chalk.grey.bold(VERSION);
printMsg(chalk.blue(`\nStarting KibblXR Server... ${devModeMsg}`));
printMsg(`Version ${verMsg}`);

// Dev/prod mode client location
const CLIENT_PORT = program.dev ? 8080 : program.port;

// Express setup
const app = express();
const server = http.createServer(app);

// Socket.io setup
// require() is necessary in socketio 3.x... :(
// Exported to be reused easily in other modules
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const io = require("socket.io")(server, {
  // Fixes "WebSocket is already in CLOSING or CLOSED state" issue in Chrome
  // https://github.com/socketio/socket.io/issues/3259
  pingTimeout: 60000,
  // CORS is disabled by default in socket.io 3.x... :(
  // TODO: Work out what logic to put here for dev/prod
  cors: {
    origin: [
      `http://localhost:${program.dev ? 8080 : DEFAULT_PORT}`,
      `https://localhost:3001`,
      `http://localhost:3001`,
      `https://kibblxr.io`,
      /\.simbroadcasts\.tv$/,
    ],
  },
});

// New client connection - Socket IO communications to clients
io.on("connection", ioConnection);

// Server listen
server.listen(program.port);

// Welcome logging
printMsg(
  `\n${chalk.green("- ")}${chalk.grey("KibblXR Server Running: ")}${chalk.white(
    `http://${getIP()}:`
  )}${chalk.white(CLIENT_PORT)}\n\n${chalk.grey("Press CTRL+C to exit")}\n`
);

/*
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {   
  // options
});

io.on("connection", (socket) => {
  console.log("A client connected")
});

httpServer.listen(PORT, () => {
  console.log('listening on port '+PORT.toString());
});
*/

/*
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const server = new https.createServer({
  cert: fs.readFileSync('sslcert/cert.pem'),   
  key: fs.readFileSync('sslcert/key.pem')
});

const wss = new WebSocket.Server({ server });  // !

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('MSG received: %s', message);
  });

  ws.send('Hi to client');
});


server.listen(PORT);
*/

/*
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(PORT, function() {
    console.log((new Date()) + ' Server is listening on port ' + PORT.toString());
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: true
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
*/