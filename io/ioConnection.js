/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

function ioConnection(socket) {
  socket.emit("IO_CONNECTED");
  const { id } = socket;
  const idString = `${id} (${socket.handshake.address})`;
  const { room, client } = socket.handshake.query;

  // If client isn't specified, assume it's a headset
  const clientType = client !== "vscode" ? "headset" : "vscode";
  const clientString = chalk.green(clientType.toUpperCase());

  socket.join(room);

  const roomMsg =  `New ${clientString} connected to room ${room}: ${idString}`

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + idString)
  });

  socket.on("hello-room", (arg) => {
    console.log(arg);
    io.to(room).emit("yes-room", "Yes room, I can hear you");
  });
}

