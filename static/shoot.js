
let shoot = null

const click = (event) => {
  if (event.buttons === 1 && PLAYER && PLAYER.ammo > 0) {
    socket.emit("createProjectileBullet");

    // Test more shoots
    // const i = setInterval(() => {
    //   socket.emit("createProjectileBullet");
    // }, 1000 / 1000);
    // setTimeout(() => {
    //   clearInterval(i)
    // }, 1000);
  }

  // console.log('event', event.clientX / physic.m);
  // console.log('event', event.clientY / physic.m);
}

document.addEventListener("mousedown", click)

document.removeEventListener("mouseup", click);
