import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
var cors = require('cors')

const app = express();
app.use(cors())
app.set("port", process.env.PORT || 8440);

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);
/*, {
  cors: {
    origin: "https://optomancy.com",
    methods: ["GET", "POST"],
    credentials: true
  }
}*/

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/index.html"));
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
  console.log("a user connected");
});

const server = http.listen(8440, function() {
  console.log("listening on *:8440");
});