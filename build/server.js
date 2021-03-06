#!/usr/bin/env node
"use strict";
var PORT = 8440;
var HOSTNAME = "0.0.0.0";
const fs = require('fs');
const https = require('https');
const websock = require('ws');
const server = new https.createServer({
    cert: fs.readFileSync('C:/Certbot/live/optomancy.com/fullchain.pem'),
    key: fs.readFileSync('C:/Certbot/live/optomancy.com/privkey.pem')
});
const wss = new websock.Server({ server }); // !
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('MSG received: %s', message);
    });
    ws.send('Hi to client');
});
server.listen(PORT, function () {
    console.log((new Date()) + ' Server is listening on port ' + PORT.toString());
});
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
