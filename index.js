'use strict';
// project dependencies
const fs = require('fs');
const path = require('path');

// Electron dependencies
const { app, BrowserWindow, ipcMain } = require('electron');

const modules = require('./modules/index');

// global electron window object
let win;

// global var for dir
let dir;

// global vars for user and repo info.
let user, repo;

async function createWindow() {
	user = modules.getUserInfo();

	win = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: {
			nodeIntegration: true
		}
	});

	// load the index.html file
	win.loadFile('src/intro.html');

	if(user.name == undefined || user.email == undefined) {
		win.webContents.on('did-finish-load', function() {
			win.webContents.send('get-user-name', true);
		});
	}
}

// when done init, create the window.
app.on('ready', createWindow);

ipcMain.on('changeUser', function(evet, data) {
	modules.changeUser(data);

	win.loadFile('src/intro.html');

	win.webContents.on('did-finish-load', function() {
		win.webContents.send('get-user-name', false);
	});
}); 

ipcMain.on('chooseDir', async function(event, data) {
	// set dir
	dir = modules.chooseDir(win);

	// load main view
	win.loadFile('src/index.html');

	// load the user info
	repo = await modules.getRepoInfo(dir);

	// when done loading the window, send the details.
	win.webContents.on('did-finish-load', () => {
		win.webContents.send('send_username', user.name);
		win.webContents.send('send_useremail', user.email);
		win.webContents.send('send_remote', repo.remote);
		win.webContents.send('send_status', repo.status);
		win.webContents.send('send_log', repo.log);
		win.webContents.send('send_branch', repo.branch);
	});
});