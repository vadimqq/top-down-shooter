const physic = require('./constants').physic;
const map = require('./constants').map;
const colors = require('./constants').colors;
const levelLocation = require('./constants').levelLocation;
const playerState = require('./constants').playerState;
const bufTiming = require('./constants').bufTiming;

const players = {};

let server = null;

function getCollisionWall(point) {
  for (const iterator of levelLocation.walls) {
    if (iterator[0] === point[0] && iterator[1] === point[1]) {
      return false;
    }
  }
  return true;
}

class Player {
  constructor(props) {
    // inits
    this._name = props.name;
    this._id = props.id;
    this._playerRadius = physic.m * 2; //70 - картинка
    this._playerHitBoxRadius = physic.m / 2; // 35 - хитбокс
    this._color = colors[props.index];
    this._index = props.index;

    // temp
    this.TempX = 300;
    this.TempY = 300;

    // game play
    this.positionX = 300;
    this.positionY = 300;
    this.prevPositionX = 300;
    this.prevPositionY = 300;
    this.HP = physic.maxHP;
    this.angle = 0;
    this.state = playerState.IDLE;
    this.killCounter = 0;
    this.deathCounter = 0;
    this.doneDamageCounter = 0; // Нанесенный
    this.takeDamageCounter = 0; // Полученный
    this.damage = physic.baseDamage;
    this.ammo = physic.baseAmmo;
  }

  takeDamage(fromId, dmg) {
    this.HP -= dmg;
    this.takeDamageCounter += dmg;
    players[fromId].giveDamageCounter(dmg);

    server.sockets.emit('playerTakeDamage', {
      from: fromId,
      to: this._id,
      kill: this.HP <= 0,
      damage: dmg,
      x: this.positionX,
      y: this.positionY,
    });

    if (this.HP <= 0) {
      this.death();
      this.giveKill(fromId);
    }
  }

  addKillCounter() {
    this.killCounter += 1;
  }
  giveKill(id) {
    players[id].addKillCounter();
  }

  giveDamageCounter(dmg) {
    this.doneDamageCounter += dmg;
  }
  giveDamage(id, dmg) {
    players[id].giveDamageCounter(dmg);
  }

  takeHeal() {
    const heal = physic.maxHP - this.HP;
    this.HP = physic.maxHP;

    server.sockets.emit('playerTakeHeal', {
      to: this._id,
      heal: heal,
      x: this.positionX,
      y: this.positionY,
    });
  }

  takeUpDamage() {
    this.damage *= 1.1;
  }

  takeAmmo() {
    this.ammo += physic.baseAmmo;
  }
  spendAmmo() {
    this.ammo -= 1;
  }

  death() {
    this.deathCounter += 1;
    this.state = playerState.DEATH;

    this.positionX = -100;
    this.positionY = -100;

    setTimeout(() => {
      this.respawn();
    }, 5 * 1000);
  }

  respawn() {
    const randomNum = Math.floor(Math.random() * 4);
    this.state = playerState.IDLE;
    this.prevPositionX = map.respawnPoint[randomNum][0];
    this.prevPositionY = map.respawnPoint[randomNum][1];
    this.positionX = map.respawnPoint[randomNum][0];
    this.positionY = map.respawnPoint[randomNum][1];
    this.TempX = map.respawnPoint[randomNum][0];
    this.TempY = map.respawnPoint[randomNum][1];

    this.HP = physic.maxHP;
    this.damage = physic.baseDamage;
    this.ammo = physic.baseAmmo;

    server.sockets.emit('playerRespawn');
  }

  moveTo(direction) {
    if (this.state === playerState.DEATH) return null;

    switch (direction) {
      case 'left':
        this.state = playerState.MOVE;
        this.TempX = this.positionX - physic.v;
        break;
      case 'up':
        this.state = playerState.MOVE;
        this.TempY = this.positionY - physic.v;
        break;
      case 'right':
        this.state = playerState.MOVE;
        this.TempX = this.positionX + physic.v;
        break;
      case 'down':
        this.state = playerState.MOVE;
        this.TempY = this.positionY + physic.v;
        break;

      default:
        this.state = playerState.IDLE;
        break;
    }

    const _x = Math.floor(this.TempX / physic.m);
    const _y = Math.floor(this.TempY / physic.m);

    if (getCollisionWall([_x, _y])) {
      this.positionX = this.TempX;
      this.positionY = this.TempY;
    } else {
      this.TempX = this.positionX;
      this.TempY = this.positionY;
    }
  }

  updatedWithClient() {
    this.prevPositionX = this.positionX;
    this.prevPositionY = this.positionY;
  }
}

module.exports.getPlayers = (socket, io) => {
  server = io;
  socket.on('new player', (name) => {
    players[socket.id] = new Player({
      id: socket.id,
      name: name,
      index: Object.keys(players).length,
    });
  });

  const movement = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  socket.on('movement', (move) => {
    movement.up = move.up;
    movement.down = move.down;
    movement.left = move.left;
    movement.right = move.right;
  });

  setInterval(() => {
    if (movement.down || movement.left || movement.right || movement.up) {
      const player = players[socket.id] || {};
      if (movement.left && player.positionX > 0) {
        player.moveTo('left');
      }
      if (movement.up && player.positionY > 0) {
        player.moveTo('up');
      }
      if (movement.right && player.positionX < map.size.x) {
        player.moveTo('right');
      }
      if (movement.down && player.positionY < map.size.y) {
        player.moveTo('down');
      }
    } else {
      const player = players[socket.id] || {};
      player.moveTo && player.moveTo('stop');
    }
  }, 1000 / 60);

  socket.on('mouseMove', (mousePosition) => {
    const player = players[socket.id] || {};
    player.angle = Math.round(
      Math.atan2(
        player.positionY - mousePosition.y,
        player.positionX - mousePosition.x
      ) *
      (180 / Math.PI)
    );
    // player.angle = Math.acos( getAngle(player.positionX, player.positionY, mousePosition.x, mousePosition.y).cos );
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
  });

  // socket.on("changeName", (name) => {
  //   players[socket.id]._name = name;
  // })

  return players;
};
