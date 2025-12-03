export const ID_PRFX = 'ID--'; // prefix for ID

export class ClientsBook {
  #clients = [];

  sendMessageToAllClients(message) {
    this.#clients.forEach((cl) => {
      cl.socket.write(message);
    });
  }

  addClient(socket) {
    const clientID = this.#generateClientID();
    socket.write(`${ID_PRFX}${clientID}`);

    this.sendMessageToAllClients(
      `Client: ${clientID} connected to the server!`
    );

    this.#clients.push({ id: clientID, socket });
  }

  removeClient(socket) {
    const i = this.#clients.findIndex((cl) => cl.socket === socket);
    if (i !== -1) {
      const closedClientID = this.#clients[i].id;

      this.#clients.splice(i, 1);

      this.sendMessageToAllClients(
        `Client: ${closedClientID} disconnected from the server!`
      );
    }
  }

  #generateClientID() {
    return Math.floor(Math.random() * 90000000 + 10000000).toString();
  }
}
