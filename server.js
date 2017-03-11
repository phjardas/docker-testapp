const express = require('express');
const os = require('os');

const startedAt = Date.now();

function createServerData() {
	let data = '';
	data += `Hostname: ${os.hostname()}\n`;
	data += `OS type: ${os.type()}\n`;
	data += `OS platform: ${os.platform()}\n`;
	return data;
}

const serverData = createServerData();

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
	body += `HTTP server uptime: ${(Date.now() - startedAt) / 1000} seconds\n`;

	body += '\n=== Network Interfaces ===\n';
	const interfaces = os.networkInterfaces();
	Object.keys(interfaces).sort().forEach(ifName => {
		interfaces[ifName].filter(i => !i.internal).forEach(i => {
			body += `${ifName} ${i.family} address: ${i.address}\n`;
		});
	});

	res.set('Content-Type', 'text/plain').send(body);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on port %d', port));
