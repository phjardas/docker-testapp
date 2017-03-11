const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const pkgVersion = require('./package').version;

const startedAt = Date.now();

function loadVersion() {
	return new Promise((resolve, reject) => {
		fs.readFile(path.resolve(__dirname, 'version.txt'), 'utf8', (err, content) => {
			if (err) {
				if (err.code === 'ENOENT') {
					resolve(`${pkgVersion}.dev`);
				} else {
					reject(err);
				}
			}
			resolve(content.trim());
		});
	});
}

function createServerData() {
	return loadVersion()
	.then(version => {
		console.log('Application version: %s', version);

		let data = '';
		data += `Hostname: ${os.hostname()}\n`;
		data += `OS type: ${os.type()}\n`;
		data += `OS platform: ${os.platform()}\n`;
		data += `Application version: ${version}\n`;
		return data;
	});
}

function createApp(serverData) {
	const app = express();

	app.get('/*', (req, res) => {
		let body = '';
		body += `Timestamp: ${new Date().toISOString()}\n`;

		body += '\n=== Request ===\n';
		body += `Path: ${req.path}\n`;
		body += `Query: ${JSON.stringify(req.query)}\n`;

		body += '\n=== Request Headers ===\n';
		Object.keys(req.headers).sort().forEach(h => body += `${h}: ${req.headers[h]}\n`);

		body += '\n=== Server ===\n';
		body += serverData;
		body += `Application uptime: ${(Date.now() - startedAt) / 1000} seconds\n`;

		body += '\n=== Network Interfaces ===\n';
		const interfaces = os.networkInterfaces();
		Object.keys(interfaces).sort().forEach(ifName => {
			interfaces[ifName].filter(i => !i.internal).forEach(i => {
				body += `${ifName} ${i.family} address: ${i.address}\n`;
			});
		});

		res.set('Content-Type', 'text/plain').send(body);
	});

	return app;
}

function startServer(app) {
	const port = process.env.PORT || 3000;
	app.listen(port, () => console.log('Server running on port %d', port));
}

createServerData()
.then(createApp)
.then(startServer)
.catch(err => {
	console.error(err);
	process.exit(1);
});
