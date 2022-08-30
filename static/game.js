const socket = io();
const aidImage = document.getElementById('js-aid-img');
const ammoImage = document.getElementById('js-ammo-img');
const damageImage = document.getElementById('js-damage-img');

const wallImage = document.getElementById('js-wall-img');

const WINDOW_WIDTH = map.size.x;
const WINDOW_HIGHT = map.size.y;

const canvas = document.getElementById('canvas');
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HIGHT;
const context = canvas.getContext('2d');

const canvasBG = document.getElementById('canvas_bg');
canvasBG.width = WINDOW_WIDTH;
canvasBG.height = WINDOW_HIGHT;
const contextBG = canvasBG.getContext('2d');

const canvasNeutralObject = document.getElementById('canvas_neutral-object');
canvasNeutralObject.width = WINDOW_WIDTH;
canvasNeutralObject.height = WINDOW_HIGHT;
const contextNeutralObject = canvasNeutralObject.getContext('2d');

const deadScreenHTML = document.getElementById('dead-screen-js');

let PLAYER = null;
let NEUTRAL_OBJECT = null;
let GAME = null;

function drawBGOnce(level) {
  contextBG.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HIGHT);
  contextBG.fillStyle = '#7c604a';
  level.walls.forEach((el) => {
    contextBG.drawImage(
      wallImage,
      el[0] * physic.m,
      el[1] * physic.m,
      physic.m,
      physic.m
    );
  });
}
setTimeout(() => {
  drawBGOnce(levelLocation);
}, 1000);

const checkNeutralObjectPosition = () => {
  if (NEUTRAL_OBJECT?.length && PLAYER) {
    NEUTRAL_OBJECT.forEach((object) => {
      if (getCollision(PLAYER, object)) {
        socket.emit('getNeutralObject', {
          playerID: PLAYER._id,
          object,
        });
      }
    });
  }
};

let now = 0;
let dt = 0;
let last = 0;

socket.on('state', (game) => {
  GAME = game;
  PLAYER = game.players[socket.id];
  dt = 0;

  checkNeutralObjectPosition(); // TODO: часто вызывается, - проверить
  drawNeutralObject(game.neutralObject); // Зачем так часто? надо на event рисовать
});

const drawLoop = () => {
  if (GAME) {
    now = performance.now();
    dt = dt + (now - last); //сек 0 - 50
    const dtPercent = dt / engineTimeConnect;
    last = now;

    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HIGHT);

    // Рисуем игрока
    for (const id in GAME.players) {
      const player = GAME.players[id];

      if (player.state !== 'DEATH') {
        drawPlayer(context, player, dtPercent);
      }
    }

    // Рисуем патроны
    GAME.projectile.forEach((tile) => {
      drawProjectile(context, tile, dtPercent);
    });
  }

  window.requestAnimationFrame(drawLoop);
};

window.requestAnimationFrame(drawLoop);

socket.on('takeStatistic', (data) => {
  renderStats(data);
});

socket.on('takeMyInfo', (data) => {
  const myID = socket.id;
  renderPlayerInfo(data, myID);
});

socket.on('playerTakeHeal', (heal) => {
  effects.heal.push(heal);
  setTimeout(() => {
    effects.heal.shift();
  }, 1000);
});

socket.on('playerTakeDamage', (damage) => {
  const myID = socket.id;

  effects.damage.push(damage);
  setTimeout(() => {
    effects.damage.shift();
  }, 1000);

  if (damage.from === myID) {
    if (damage.kill) {
      // 'Я убил
      const myAudio = document.getElementById('js-damage');
      myAudio.currentTime = 0;
      myAudio.play();
    } else {
      // 'Я попал
      const myAudio = document.getElementById('js-pop');
      myAudio.currentTime = 0;
      myAudio.play();
    }
  } else if (damage.to === myID) {
    if (damage.kill) {
      // 'я умер
      const myAudio = document.getElementById('js-dead');
      myAudio.currentTime = 0;
      myAudio.play();

      deadScreenHTML.style.display = 'block';
    }
  }
});

socket.on('playerRespawn', () => {
  deadScreenHTML.style.display = 'none';
});

const drawNeutralObject = (data) => {
  NEUTRAL_OBJECT = data;
  contextNeutralObject.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HIGHT);
  data.forEach((el) => {
    const r = el._radius;
    contextNeutralObject.drawImage(
      neutralImageMapper[el._type],
      el.positionX - r,
      el.positionY - r,
      r * 2,
      r * 2
    );
  });
};

neutralImageMapper = {
  [mapTypeNeutralObject.HEAL]: aidImage,
  [mapTypeNeutralObject.DAMAGE]: damageImage,
  [mapTypeNeutralObject.AMMO]: ammoImage,
};
