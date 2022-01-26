import chalk from "chalk";
import { io } from "../";
import { printMsg } from "../utils";

function ioConnection(socket) {
  socket.emit("IO_CONNECTED");
  const { id } = socket;
  const idString = `${id} (${socket.handshake.address})`;
  const { room, client } = socket.handshake.query;

  // If client isn't specified, assume it's a headset
  const clientType = client !== "vscode" ? "headset" : "vscode";
  const clientString = chalk.green(clientType.toUpperCase());

  socket.join(room);

  const roomMsg = chalk.grey(
    `New ${clientString} connected to room ${room}: ${idString}`
  );
  printMsg(`${chalk.green.bold("> ")}${roomMsg}`);

  socket.on("disconnect", () => {
    printMsg(
      `${chalk.red.bold("< ")}${chalk.grey(
        "Client disconnected: "
      )}${chalk.grey(idString)}`
    );
  });

  socket.on("hello-room", (arg) => {
    console.log(arg);
    io.to(room).emit("yes-room", "Yes room, I can hear you");
  });
}

export default ioConnection;
