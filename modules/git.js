'use strict';
const { execSync } = require('child_process');
const { dialog } = require('electron');

function getRepoInfo(dir) {
    let remote = execSync("git config remote.origin.url", { cwd: dir }).toString().split('//')[1].split('/')[2];
    
    let status = execSync("git status", { cwd: dir }).toString();

    let log = execSync("git log", { cwd: dir }).toString();

    // get branch, split by nextline, take the first one(assumed to be active), split by space and take the name of the branch
    let branch = execSync("git branch").toString().split("\n")[0].split(' ')[1];

    return {
        'remote': remote,
        'status': status,
        'log': log,
        'branch': branch
    };
}

function getUserInfo() {
    let name, email;

    try {
        email = execSync("git config user.email").toString();
    } catch(e) {
        email = undefined;
    }
    try {
        name = execSync("git config user.name").toString();
    } catch(e) {
        name = undefined;
    }

    return {
        'name': name,
        'email': email
    }
}

function chooseDir(win) {
    let d = dialog.showOpenDialogSync(win, {
        properties: [
            'openDirectory'
        ]
    });
    return d[0];
}

function changeUser(user) {
    try {
        execSync(`git config --global user.name "${user.name}"`);
    } catch(e) {
        console.log(e);
    }

    try {
        execSync(`git config --global user.email "${user.email}"`);
    } catch(e) {
        console.log(e);
    }
}

module.exports = {
    getUserInfo,
    getRepoInfo,
    chooseDir,
    changeUser,
};