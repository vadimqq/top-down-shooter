var uuid = require('uuid');
const physic = require('./constants').physic;
const listOfSpawnPoint = require('./constants').levelLocation.spawnPoints;
const mapTypeNeutralObject = require('./constants').mapTypeNeutralObject;
const arrTypeNeutralObject = require('./constants').arrTypeNeutralObject;
const spawnTimeObjects = require('./constants').spawnTimeObjects;

const randomNum = require('./utils').randomNum;

let timer = 0;

const listOfObject = [];

let server = null;
class NeutralObject {
  constructor(props) {
    this._id = props.id;
    this._radius = physic.m / 2;
    this._hitBoxRadius = (physic.m / 2) * 0.9;
    this._type = props.type;

    this.positionX = props.x * physic.m;
    this.positionY = props.y * physic.m;
  }

  delete(index) {
    listOfObject.splice(index, 1);
  }
}

setInterval(() => {
  if (
    timer + 1000 >= spawnTimeObjects &&
    listOfObject.length < listOfSpawnPoint.length
  ) {
    objectGenerator();
    timer = 0;
  } else {
    timer += 1000;
  }
}, 1000);

const objectGenerator = () => {
  const randomSpawnPoint = randomNum(listOfSpawnPoint.length);
  const randomTypeObject = randomNum(arrTypeNeutralObject.length);

  const positionX = listOfSpawnPoint[randomSpawnPoint][0];
  const positionY = listOfSpawnPoint[randomSpawnPoint][1];
  const id = uuid.v4();
  if (checklockedSpawnPostion(positionX, positionY)) {
    return objectGenerator();
  }
  listOfObject.push(
    new NeutralObject({
      id,
      x: positionX,
      y: positionY,
      type: arrTypeNeutralObject[randomTypeObject],
    })
  );
};

const checklockedSpawnPostion = (x, y) =>
  !!listOfObject.find(
    (object) =>
      object.positionX === x * physic.m && object.positionY === y * physic.m
  );

module.exports.getNeutralObject = (socket, players, io) => {
  server = io;
  socket.on('getNeutralObject', ({ object, playerID }) => {
    switch (object._type) {
      case mapTypeNeutralObject.HEAL:
        players[playerID].takeHeal();
        break;
      case mapTypeNeutralObject.AMMO:
        players[playerID].takeAmmo();
        break;
      case mapTypeNeutralObject.DAMAGE:
        players[playerID].takeUpDamage();
        break;
      default:
        break;
    }
    listOfObject.forEach((item, index) => {
      if (item._id === object._id) {
        item.delete(index);
      }
    });
  });
  return listOfObject;
};
