

const drawProjectile = (ctx, bullet, dt) => {
  const x = bullet.positionX;
  const y = bullet.positionY;

  const smoothX = lerp(bullet.prevPositionX, x, dt);
  const smoothY = lerp(bullet.prevPositionY, y, dt);

  ctx.fillStyle = bullet.color;
  ctx.beginPath();
  ctx.arc(smoothX, smoothY, bullet._BulletRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}
