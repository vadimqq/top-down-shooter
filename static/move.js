
const movement = {
  up: false,
  down: false,
  left: false,
  right: false,
}

document.addEventListener("keydown", (event) => {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      socket.emit("movement", movement);
      break;
    case 87: // W
      movement.up = true;
      socket.emit("movement", movement);
      break;
    case 68: // D
      movement.right = true;
      socket.emit("movement", movement);
      break;
    case 83: // S
      movement.down = true;
      socket.emit("movement", movement);
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      socket.emit("movement", movement);
      break;
    case 87: // W
      movement.up = false;
      socket.emit("movement", movement);
      break;
    case 68: // D
      movement.right = false;
      socket.emit("movement", movement);
      break;
    case 83: // S
      movement.down = false;
      socket.emit("movement", movement);
      break;
  }
});
