/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as chalk from "chalk";
function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

let grimoire:any = {'spells':{}};
grimoire.spells = {};
function ioConnection(socket: any): void {
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
  console.log(`${chalk.green.bold("> ")}${roomMsg}`);

  socket.on("disconnect", () => {
    console.log(
      `${chalk.red.bold("< ")}${chalk.grey(
        "Client disconnected: "
      )}${chalk.grey(idString)}`
    );
  });

  socket.on('spellcast', (msg: any) => {    
      console.log('spell: ' + chalk.blue(msg)); 
      grimoire.spells[guidGenerator()] = (JSON.parse(msg));
      console.log(grimoire)
      socket.to(room).emit("SPELL_UPDATE", JSON.stringify(grimoire));
    
      //ssocket.io.emit("spell", "alakazam");
    });

  socket.on("hello-room", (arg: any) => {
    console.log(arg);
    socket.to(room).emit("yes-room", "Yes room, I can hear you");
  });
}

export default ioConnection;