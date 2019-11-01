const electron = require('electron');
const ipc = electron.ipcRenderer;

ipc.on('send_username', function(event, args) {
    document.getElementById("user_name").innerHTML = args;
    console.log(args);
});
ipc.on('send_useremail', function(event, args) {
    document.getElementById("user_email").innerHTML = args;
    console.log(args);
});
ipc.on('send_remote', function(event, args) {
    document.getElementById("remote").innerHTML = args;
    console.log(args);
});

ipc.on('send_status', function(event, args) {
    document.getElementById("status").innerHTML = args;
    console.log(args);
});

ipc.on('send_log', function(event, args) {
    document.getElementById("log").innerHTML = args;
    console.log(args);
});