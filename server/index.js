const http = require('http');
const express = require('express');
const { Server: SocketServer } = require('socket.io');
var pty = require('node-pty');

const bash = 'C:\\Program Files\\Git\\bin\\bash.exe';

const ptyProcess = pty.spawn(bash, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD,
  env: process.env
});

ptyProcess.onData((data) => {
    io.emit('terminal:data', data);
});
ptyProcess.onExit((exitCode) => {
    console.log(`Terminal exited with code ${exitCode}`);
  });
  
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
      origin: '*'
    }
  });

io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    socket.on('terminal:write', (data) => {
        ptyProcess.write(data);
    })
})

server.listen(9000, () => console.log('🐋 Server running of port 9000'))
