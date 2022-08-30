// const takeDamage = require('./player').takeDamage
const physic = require('./constants').physic;
const map = require('./constants').map;
const colors = require('./constants').colors;
const levelLocation = require('./constants').levelLocation;

const listOfProjectile = [];

const _rad = Math.PI / 180;

function getNotCollisionWall(point) {
  for (const iterator of levelLocation.walls) {
    if (iterator[0] === point[0] && iterator[1] === point[1]) {
      return false;
    }
  }
  return true;
}

// const getCollision = (player, object) => {
//   const r = player._playerHitBoxRadius + object._hitBoxRadius
//   const dX = player.positionX - object.positionX
//   const dY = player.positionY - object.positionY
//   const x2 = dX * dX
//   const y2 = dY * dY
//   const d2 = x2 + y2
//   const d = Math.sqrt(d2)
//   return r > d
// }

// 1 - player / 2 - object
const getCollision = ({ r1, x1, y1 }, { r2, x2, y2 }) => {
  const r = r1 + r2;
  const dX = x1 - x2;
  const dY = y1 - y2;
  const xSq = dX * dX;
  const ySq = dY * dY;
  const dSq = xSq + ySq;
  const d = Math.sqrt(dSq);

  return r > d;
};

class Projectile {
  constructor(props) {
    this._id = props.id;
    this._BulletRadius = physic.m / 5;
    this._v = physic.bullet_v;
    this.color = props._color;
    this._initDamage = props.damage;

    // gamaplay
    this.prevPositionX = props.x;
    this.prevPositionY = props.y;

    this.positionX = props.x;
    this.positionY = props.y;
    this.angle = props.angle + 180;
    this.traveled = 0;
    this.players = props.players;
    this.damage = props.damage;
  }

  move() {
    this.TempX = this.positionX + this._v * Math.cos(this.angle * _rad);
    this.TempY = this.positionY + this._v * Math.sin(this.angle * _rad);
    this.traveled += this._v;
    this.damage = Math.floor(
      this._initDamage +
      (this.traveled / map.size.x) * 4 * this._initDamage
    );

    if (
      this.TempX < 0 ||
      this.TempY < 0 ||
      this.TempX > map.size.x ||
      this.TempY > map.size.y
    ) {
      this.remove();
    } else {
      const _x = Math.floor(this.TempX / physic.m);
      const _y = Math.floor(this.TempY / physic.m);

      if (getNotCollisionWall([_x, _y])) {
        this.positionX = this.TempX;
        this.positionY = this.TempY;
      } else {
        this.remove();
      }
    }
  }

  remove(index) {
    listOfProjectile.splice(index, 1);
  }

  updatedWithClient() {
    this.prevPositionX = this.positionX;
    this.prevPositionY = this.positionY;
  }
}

module.exports.getProjectiles = (socket, players) => {
  socket.on('createProjectileBullet', () => {
    const myPlayer = players[socket.id];
    myPlayer?.spendAmmo();
    if (myPlayer?.state !== 'DEATH') {
      // todo - import const
      listOfProjectile.push(
        new Projectile({
          id: socket.id,
          x: myPlayer?.positionX,
          y: myPlayer?.positionY,
          _color: myPlayer?._color,
          angle: myPlayer?.angle,
          damage: myPlayer?.damage,
          players: players,
        })
      );
    }
  });

  return listOfProjectile;
};

setInterval(() => {
  if (listOfProjectile.length) {
    listOfProjectile.forEach((projectile, index) => {
      // if (projectile.traveled > physic.bullet_max_distance) {
      //   projectile.remove(index);
      // }

      //check collision
      for (const id in projectile.players) {
        const isCollision = getCollision(
          {
            r1: projectile.players[id]._playerHitBoxRadius,
            x1: projectile.players[id].positionX,
            y1: projectile.players[id].positionY,
          },
          {
            r2: projectile._BulletRadius,
            x2: projectile.positionX,
            y2: projectile.positionY,
          }
        );

        if (isCollision) {
          const isEnemy = projectile._id !== projectile.players[id]._id;

          if (isEnemy) {
            projectile.players[id].takeDamage(
              projectile._id,
              projectile.damage
            );
            projectile.remove(index);
          }
        }
      }

      projectile.move();
    });
  }
}, 1000 / 60);
