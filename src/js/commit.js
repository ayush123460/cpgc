const electron = require('electron');
const ipc = electron.ipcRenderer;

if(localStorage.getItem('token') != null) {
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.logged_in').style.display = 'block';

    ipc.send('getCollaborators', localStorage.getItem('token'));
}

ipc.on('send_username', function(event, args) {
    document.getElementById("user_name").innerHTML = args;
});

ipc.on('send_useremail', function(event, args) {
    document.getElementById("user_email").innerHTML = args;
});

ipc.on('send_remote', function(event, args) {
    document.querySelector(".remote").innerHTML = args;
});

ipc.on('send_branch', function(event, args) {
    document.querySelector("#branch").innerHTML = args;
});

ipc.once('send_status', function(event, args) {
    let res = args.split('\n');
    
    for(let i = 0; i < res.length; i++) {
        document.querySelector(".status").innerHTML += res[i] + '<br>';
    }
});

ipc.once('send_log', function(event, args) {
    for(let i = 0; i < args.length; i++) {
        let w = document.querySelector('.window');
        w.innerHTML += 
        `<div class="log">
        <div class="log--message">${args[i][4]}</div>
        <div class="log--email">${args[i][1]}</div><div class="log--time">${args[i][2]}</div>
        <span class="log--number">${args[i][0]}</span>
        </div><br>`;
    }
});

ipc.on('token', function(event, data) {
    localStorage.setItem('token', data);
});

ipc.once('gh_user', (event, data) => {
    document.querySelector('.logged_in').innerHTML += data;
});

ipc.once('desc', (event, data) => {
    document.querySelector('#desc').innerHTML += data;
});

function login() {
    event.preventDefault();
    ipc.send('login');
}

function handleChangeProject() {
    event.preventDefault();
    ipc.send('changeProject');
}

function gotoOverview() {
    event.preventDefault();
    ipc.send('gotoOverview');
}