const { platform, EOL } = require('os');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;

function createWindow() {
	let win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});

	//win.loadFile('html/index.html');
	// win.webContents.openDevTools()
	win.webContents.on('did-finish-load', () => {
		win.webContents.send('send_username', name);
		win.webContents.send('send_useremail', email);
		win.webContents.send('send_remote', remote);
		win.webContents.send('send_status', status);
		win.webContents.send('send_log', log);
		win.webContents.send('send_branch', branch);
	});
}

//app.on('ready', createWindow);

// let user = execSync("git config --list").toString().split(EOL);
let email = execSync("git config user.email").toString();
let name = execSync("git config user.name").toString();
let remote = execSync("git config remote.origin.url").toString();

let status = execSync("git status").toString();
let log = execSync("git log").toString();
let branch = execSync("git branch").toString().split("\n");
console.log(branch[0].split(' ')[1]);
