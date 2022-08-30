const getCollision = (player, object) => {
  const r = player._playerHitBoxRadius + object._hitBoxRadius
  const dX = player.positionX - object.positionX
  const dY = player.positionY - object.positionY
  const x2 = dX * dX
  const y2 = dY * dY
  const d2 = x2 + y2
  const d = Math.sqrt(d2)

  return r > d;
};


 // линейная интерполяция, piece = 0.0 -> 1.0
 const lerp = (start, finish, piece) => {
  return start + (finish - start) * piece;
};