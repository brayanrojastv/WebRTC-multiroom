const HTTPS_PORT = 8443;

const fs = require('fs');
const uuid = require('uuid');
const cors = require('cors');
const uniqId = require('uniqid');
const path = require('path');
const https = require('https');
const express = require('express');
const app = express();
const serverConfig = {
	key: fs.readFileSync(path.join(__dirname, 'key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

app.use(cors());

const httpsServer = https.createServer(serverConfig, app);
httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
	console.log(`Server running: https://localhost:${HTTPS_PORT}`);
});

const io = require('socket.io')(httpsServer);
const rooms = {};
const users = {};

const createRoom = socket => {
	const userId = uniqId();
	const roomId = uuid();
	users[roomId] = [userId];
	rooms[roomId] = [
		{
			userId,
			socket
		}
	];
	return {
		roomId,
		userId
	};
};

const joinRoom = (roomId, socket) => {
	const userId = uniqId();
	users[roomId].push(userId);
	rooms[roomId].push({
		userId,
		socket
	});
	rooms[roomId].forEach(user => {
		user.socket.emit('peer.connected', {
			userId
		})
	});

	return userId;
};

const onMessage = (data) => {
	const type = data.sdp ? 'sdp' : 'ice';
	console.log('message', data.type.toUpperCase(), data.emitTo, ' <=== ', data.emitedFrom);
	console.log(data.ice);
	try {
		const room = rooms[data.roomId];
		const client = room.find(client => client.userId === data.emitTo);
		
		client.socket.emit(data.type, data);
	} catch (e) {
		console.log(e);
	}
}

io.on('connection', function(socket) {
	console.log('connected')
	let currentRoom;
	let userId;

	socket.on('room', (roomId, cb) => {
		if (roomId) {
			userId = joinRoom(roomId, socket);
		} else {
			const roomData = createRoom(socket);
			currentRoom = roomId = roomData.roomId;
			userId = roomData.userId;
		}

		cb({ roomId, userId });
	});

	socket.on('ice', onMessage);
	socket.on('offer', onMessage);
	socket.on('answer', onMessage);

	socket.on('error', console.log);

	socket.on('disconnect', () => {
		console.log('disconnected');
	});
});
