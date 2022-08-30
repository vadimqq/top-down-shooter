const trooperImageBlue = document.getElementById('js-trooper-img-blue');
const trooperImageGreen = document.getElementById('js-trooper-img-green');
const trooperImageRed = document.getElementById('js-trooper-img-red');
const trooperImagePink = document.getElementById('js-trooper-img-pink');

const skins = [
  trooperImageRed,
  trooperImagePink,
  trooperImageGreen,
  trooperImageBlue,

  trooperImageGreen,
  trooperImageRed,
  trooperImageBlue,
  trooperImagePink,

  trooperImageBlue,
  trooperImageGreen,
  trooperImageRed,
  trooperImagePink,

  trooperImageBlue,
  trooperImageGreen,
  trooperImageRed,
  trooperImagePink,
]

const drawPlayer = (ctx, player, dt) => {
  const x = player.positionX;
  const y = player.positionY;

  const smoothX = lerp(player.prevPositionX, x, dt);
  const smoothY = lerp(player.prevPositionY, y, dt);

  const angle = player.angle;
  const rad = Math.PI / 180;
  const percentHP = player.HP / physic.maxHP;
  const r = player._playerRadius;

  // name
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${player._name}`, smoothX, smoothY - physic.m * 1.2);
  ctx.closePath();

  // healBar
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    smoothX - physic.m * 1,
    smoothY - physic.m * 1,
    physic.m * 2,
    physic.m / 6
  );
  ctx.fillStyle = percentHP > 0.3 ? '#0ed00e' : 'red';
  ctx.fillRect(
    smoothX - physic.m * 1,
    smoothY - physic.m * 1,
    physic.m * 2 * (player.HP / physic.maxHP),
    physic.m / 6
  );

  ctx.save();
  ctx.translate(smoothX, smoothY);
  ctx.rotate((angle + 270) * rad);
  ctx.drawImage(skins[player._index], -(r / 2), -(r / 2), r, r);
  ctx.restore();

  effects.damage.length && effects.damage.forEach((el) => {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${el.damage}`, el.x, el.y);
    el.y -= 0.5;
    ctx.closePath();
  });

  effects.heal.length && effects.heal.forEach((el) => {
    ctx.fillStyle = '#0ed00e';
    ctx.beginPath();
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${el.heal}`, el.x, el.y);
    el.y -= 0.2;
    ctx.closePath();
  });

  // Draw hitbox for test
  // ctx.beginPath();
  // ctx.fillStyle = "red";
  // ctx.arc(x, y, player._playerHitBoxRadius, 0, Math.PI * 2);
  // ctx.fill();
  // ctx.closePath();
};
