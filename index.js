'use strict';
// Electron dependencies
const { app, BrowserWindow, ipcMain } = require('electron');

// project dependencies
const modules = require('./modules/git');
const api = require('./modules/api');

// global electron window object
let win, authWindow;

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

ipcMain.on('login', async () => {
	console.log('received login, creating window...');
	authWindow = await api.handleGitHub();

	authWindow.webContents.on('will-navigate', (event, url) => {
		console.log('received will-navigate');
		api.handleGitHubCallback(authWindow, url, win);
	});

	authWindow.on('close', () => {
		authWindow = null;
	}, false);
});

ipcMain.on('changeProject', () => {
	repo = undefined;

	let altWin = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: {
			nodeIntegration: true
		}
	});

	// load the index.html file
	altWin.loadFile('src/intro.html');

	if(user.name == undefined || user.email == undefined) {
		win.webContents.on('did-finish-load', function() {
			win.webContents.send('get-user-name', true);
		});
	}

	win.destroy();
	win = altWin;
	altWin = undefined;
});

ipcMain.on('chooseDir', function() {
	// set dir
	dir = modules.chooseDir(win);

	// load main view
	win.loadFile('src/index.html');

	// load the user info
	repo = modules.getRepoInfo(dir);

	// when done loading the window, send the details.
	win.webContents.on('did-finish-load', () => {
		win.webContents.send('send_username', user.name);
		win.webContents.send('send_useremail', user.email);
		try {
			win.webContents.send('send_remote', repo.remote);
			win.webContents.send('send_status', repo.status);
			win.webContents.send('send_log', repo.log);
			win.webContents.send('send_branch', repo.branch);
		} catch(e) {
			console.log('repo send 2.');
		}
	});
});

ipcMain.on('gotoCommit', function() {
	win.loadFile('src/commit.html');
	win.webContents.on('did-finish-load', () => {
		win.webContents.send('send_username', user.name);
		win.webContents.send('send_useremail', user.email);
		try {
			win.webContents.send('send_remote', repo.remote);
			win.webContents.send('send_status', repo.status);
			win.webContents.send('send_log', repo.log);
			win.webContents.send('send_branch', repo.branch);
		} catch(e) {
			console.log('repo send 2.');
		}
	});
});

ipcMain.on('gotoOverview', function() {
	win.loadFile('src/index.html');
});

ipcMain.on('getCollaborators', (event, token) => {
	api.getCollaborators(token, win, repo.remote);
});