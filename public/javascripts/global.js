$(document).ready(() => {
    var socket = io();

    socket.on('newConnect', (data) => {
        document.getElementById("userCount").innerHTML = data.count + " user(s) online!";
    });

    socket.on('newDisconnect', (data) => {
        document.getElementById("userCount").innerHTML = data.count + " user(s) online!";
    });
});