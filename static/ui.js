// const socket = io();
const statNode = document.getElementById('js-ui');
const listNode = document.getElementById('js-ui-li');
const leftUiNode = document.getElementById('left-ui-js');

const gamerName = {
    name: '',
};

let form = document.getElementById('js-change-name-form');
form.onsubmit = (event) => {
    event.preventDefault();
    socket.emit('new player', event.target[0].value);
};

const renderStats = (data) => {
    listNode.innerHTML = '';
    data.forEach((el) => {
        const child = document.createElement('tr');
        child.innerHTML = `
            <td>${el.name}</td>
            <td>${el.kill} / ${el.death}</td>
            <td> ${el.doneDamageCounter} </td>
            <td> ${el.takeDamageCounter} </td>
        `;
        listNode.appendChild(child);
    });
};

const renderPlayerInfo = (data, myId) => {
    const myInfo = data[myId];

    leftUiNode.innerHTML = `
        Патронов - ${myInfo.ammo} <br />
        Мой урон - ${Math.floor(myInfo.damage)}
    `;
};

setInterval(() => {
    socket.emit('getStatistic');
}, 1000);
