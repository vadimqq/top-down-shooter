const physic = {
  v: 4, // скорость
  m: 30, // размер
  bullet_v: 25, // скорость
  // bullet_max_distance: 1000,
  maxHP: 100, // здоровье
  baseDamage: 10, // урон
  baseAmmo: 30, // урон
};

const map = {
  size: {
    x: 35 * physic.m,
    y: 25 * physic.m,
  },
};

const levelLocation = {
  walls: [
    [3, 3], [3, 4], [3, 5], [3, 6], [4, 3], [5, 3], [6, 3], [4, 20],
    [5, 20], [12, 12], [13, 12], [13, 17], [15, 16], [14, 17], [15, 18],
    [18, 3], [18, 4], [18, 5], [18, 6], [31, 21], [30, 21], [29, 21], [31, 20],
    [31, 19], [30, 1], [30, 2], [30, 5], [30, 6], [30, 8], [30, 9], [31, 8],
    [31, 9], [20, 17], [20, 16], [20, 18], [21, 17], [19, 17],
  ],
  heals: [
    [33, 12],
    [18, 13],
    [7, 17],
  ],
};

const engineTimeConnect = 1000 / 15;

const mapTypeNeutralObject = {
  HEAL: 'HEAL',
  DAMAGE: 'DAMAGE',
  AMMO: 'AMMO'
}

const effects = {
  damage: [],
  heal: [],
}

// const optimizeWalls = [[], [], [], []];
// levelLocation.walls.forEach((el) => {
//   if (el[0] < 35 / 2) {
//     if ( el[1] < 25 / 2) {
//       optimizeWalls[0].push(el);
//     }
//     else {
//       optimizeWalls[1].push(el);
//     }
//   } else {
//     if ( el[1] < 25 / 2) {
//       optimizeWalls[2].push(el);
//     }
//     else {
//       optimizeWalls[3].push(el);
//     }
//   }
// });
