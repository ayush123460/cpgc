const { ipcRenderer } = require('electron');

ipcRenderer.on('get-user-name', function(event, data) {
    if(data == true) {
        document.querySelector('.user_info').style.display = "block";
        document.querySelector('#chooseRepo').style.display = "none";
    }
});

function handleClick() {
    ipcRenderer.sendSync('chooseDir');
}

function handleUserChange() {
    event.preventDefault();
    let name = document.getElementById('user.name').value;
    let email = document.getElementById('user.email').value;

    let user = {
        'name': name,
        'email': email
    }

    ipcRenderer.sendSync('changeUser', user);
}