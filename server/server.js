const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const getPlayers = require('./player').getPlayers;
const getProjectiles = require('./projectile').getProjectiles;
const getStatistic = require('./gameStatistics').getStatistic;
const getNeutralObject = require('./neutralObject').getNeutralObject;
const engineTimeConnect = require('./constants').engineTimeConnect;

const port = process.env.PORT || 8080;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('port', port);
app.use('/static', express.static(path.dirname(__dirname) + '/static'));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log(`http://${add}:${port}/`);
  });
});

const game = {
  location: null,
  players: null,
  projectile: null,
  neutralObject: null,
};

io.on('connection', (socket) => {
  game.players = getPlayers(socket, io);
  game.projectile = getProjectiles(socket, game.players);
  game.neutralObject = getNeutralObject(socket, game.players, io);
  getStatistic(socket, game.players, io);
});

const gameLoop = (game, io) => {
  io.sockets.emit('state', game);
};

setInterval(() => {
  if (game.players && io) {
    gameLoop(game, io);

    Object.values(game.players).forEach((el) => {
      el.updatedWithClient();
    });

    Object.values(game.projectile).forEach((el) => {
      el.updatedWithClient();
    });
  }
}, engineTimeConnect);
