const physic = {
  v: 4, // скорость
  m: 30, // размер
  bullet_v: 25, // скорость
  // bullet_max_distance: 1000,
  maxHP: 100, // здоровье
  baseDamage: 10, // урон
  baseAmmo: 30, // кол-во
};

const bufTiming = {
  upDamage: 5000,
};

const map = {
  size: {
    x: 35 * physic.m,
    y: 25 * physic.m,
  },

  respawnPoint: [
    [2 * physic.m, 2 * physic.m],
    [2 * physic.m, 23 * physic.m],
    [33 * physic.m, 2 * physic.m],
    [33 * physic.m, 23 * physic.m],
  ],
};

const levelLocation = {
  walls: [
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 3],
    [5, 3],
    [6, 3],
    [4, 20],
    [5, 20],
    [12, 12],
    [13, 12],
    [13, 17],
    [15, 16],
    [14, 17],
    [15, 18],
    [18, 3],
    [18, 4],
    [18, 5],
    [18, 6],
    [31, 21],
    [30, 21],
    [29, 21],
    [31, 20],
    [31, 19],
    [30, 1],
    [30, 2],
    [30, 5],
    [30, 6],
    [30, 8],
    [30, 9],
    [31, 8],
    [31, 9],
    [20, 17],
    [20, 16],
    [20, 18],
    [21, 17],
    [19, 17],
  ],
  spawnPoints: [
    [33, 12],
    [18, 13],
    [7, 17],
    [22, 7],
    [19, 23],
  ],
};

const spawnTimeObjects = 5000;

const colors = [
  'hsl(0deg 100% 60%)',
  'hsl(320deg 100% 60%)',
  'hsl(120deg 100% 60%)',
  'hsl(208deg 100% 60%)',
  'hsl(240deg 100% 60%)',
  'hsl(300deg 100% 60%)',
  'hsl(360deg 100% 60%)',

  'hsl(0deg 100% 60%)',
  'hsl(60deg 100% 60%)',
  'hsl(120deg 100% 60%)',
  'hsl(180deg 100% 60%)',
  'hsl(240deg 100% 60%)',
  'hsl(300deg 100% 60%)',
  'hsl(360deg 100% 60%)',

  'hsl(0deg 100% 60%)',
  'hsl(60deg 100% 60%)',
  'hsl(120deg 100% 60%)',
  'hsl(180deg 100% 60%)',
  'hsl(240deg 100% 60%)',
  'hsl(300deg 100% 60%)',
  'hsl(360deg 100% 60%)',
];

const playerState = {
  IDLE: 'IDLE',
  MOVE: 'MOVE',
  DEATH: 'DEATH',
};

const mapTypeNeutralObject = {
  HEAL: 'HEAL',
  DAMAGE: 'DAMAGE',
  AMMO: 'AMMO',
};

const arrTypeNeutralObject = [
  mapTypeNeutralObject.HEAL,
  mapTypeNeutralObject.DAMAGE,
  mapTypeNeutralObject.AMMO,
];

const engineTimeConnect = 1000 / 15;

module.exports = {
  physic,
  map,
  levelLocation,
  colors,
  playerState,
  mapTypeNeutralObject,
  arrTypeNeutralObject,
  bufTiming,
  spawnTimeObjects,
  engineTimeConnect,
};
