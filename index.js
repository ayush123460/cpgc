const { platform, EOL } = require('os');
const { execSync } = require('child_process');

const list_dir = () => {
	if(platform == 'linux') {
	return execSync("ls -lA | awk '{print $9}'")
		.toString()
		.split(EOL);
	}

}

const m = list_dir().forEach((l) => {
	if(l == '.git')
		console.log(true);
});
