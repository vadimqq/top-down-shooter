

let playersStatistic = [];

module.exports.getStatistic = (socket, players, io) => {
  socket.on("getStatistic", () => {
    playersStatistic = []
    for (const id in players) {
      playersStatistic.push({
        name: players[id]._name,
        kill: players[id].killCounter,
        death: players[id].deathCounter,
        doneDamageCounter: players[id].doneDamageCounter,
        takeDamageCounter: players[id].takeDamageCounter,
      })
    }
    io.sockets.emit("takeStatistic", playersStatistic);
    io.sockets.emit("takeMyInfo", players);
  });
}

