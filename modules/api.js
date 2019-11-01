'use strict';
const { BrowserWindow, ipcRenderer } = require('electron');

const axios = require('axios');

let options = {
    client_id: '552f169c185b172eda15',
    client_secret: 'e4e065e669f64a60a979990000ea2b321303e1d0',
    scopes: ["repo", "user:email"]
};

function handleGitHub() {
    let authWindow = new BrowserWindow({
        width: 600,
        height: 800,
        show: false,
        'node-integration': true
    });

    let url = `https://github.com/login/oauth/authorize?client_id=${options.client_id}&scope=${options.scopes}`
    authWindow.loadURL(url);
    authWindow.show();

    return authWindow;
}

function handleGitHubCallback(authWindow, url, mainWin) {
    console.log('handleGitHubCallback hit');
    let raw_code = /code=([^&]*)/.exec(url) || null;
    let code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    let error = /\?error=(.+)$/.exec(url);

    if(code || error) {
        authWindow.destroy();

        if(code) {
            requestGitHubToken(code, mainWin);
        } else {
            console.log('Error in handleGitHubCallback');
        }
    }
}

function requestGitHubToken(code, mainWin) {
    axios.post('https://github.com/login/oauth/access_token', {
        client_id: options.client_id,
        client_secret: options.client_secret,
        code: code
    })
    .then((response) => {
        let token = response.data.split('&')[0].split('=')[1];
        mainWin.webContents.send("token", token);
    });
}

module.exports = {
    handleGitHub,
    handleGitHubCallback
};