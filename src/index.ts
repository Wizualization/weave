#!/usr/bin/env ts-node-script

import program from "commander";
import http from "http";
import express from "express";
import chalk from "chalk";
import { tedis } from "./tedis";
import { getIP, printMsg } from "./utils";
import { ioConnection } from "./io";
import config from "./config";

const VERSION = "1.0.0";
const DEFAULT_PORT = config?.port | 8443;

// Commander setup
program
  .version(VERSION, "-v, --version", "Output current version number")
  .option("-p, --port <port number>", "Server port", DEFAULT_PORT.toString())
  .option("-d, --dev", "Development mode", false)
  .parse(process.argv);

// Print welcome
const devModeMsg: string = program.dev ? chalk.red("DEVELOPMENT MODE") : "";
const verMsg: string = chalk.grey.bold(VERSION);
printMsg(chalk.blue(`\nStarting KibblXR Server... ${devModeMsg}`));
printMsg(`Version ${verMsg}`);

// Dev/prod mode client location
const CLIENT_PORT = program.dev ? 8443 : program.port;

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
      `http://localhost:${program.dev ? 8443 : DEFAULT_PORT}`,
      `https://localhost:3456`,
      `http://localhost:3455`,
      `https://kibblxr.io`,
      `https://kibblxr.io:8443`,
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
