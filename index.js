const { platform, EOL } = require('os');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;

const list_dir = () => {
	if(platform == 'linux') {
	return execSync("ls -lA | awk '{print $9}'")
		.toString()
		.split(EOL);
	}

}

var origin;

let user = execSync("git config --list").toString().split(EOL);
//console.log(user);

const m = list_dir().forEach((l) => {
	if(l == '.git') {
		origin = fs.open(path.join(__dirname, '.git/config'), 'r', function(err, file) {
			if(err)
				console.log(err + '1');
			fs.readFile(file, function(err, data) {
				if(err)
					console.log(err);
				let i = data.toString().indexOf('url') + 6;
				let c = data.toString()[i];
				origin = c;
				while(c != '\n') {
					i++;
					c = data.toString()[i];
					origin += c;
				}

				return origin;
			});
		}); 
	}
});

console.log(user[0]);

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.loadFile('html/index.html');
	win.webContents.send('send_username', user[0]);
	win.webContents.openDevTools()
}

app.on('ready', createWindow);

