const http = require('http');
const express = require('express');
const pty = require('node-pty');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');
const { Server: SocketServer } = require('socket.io');

const bash = 'C:\\Program Files\\Git\\bin\\bash.exe';

const ptyProcess = pty.spawn(bash, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + "/user",
  env: process.env
});

ptyProcess.onData((data) => {
    io.emit('terminal:data', data);
});

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  
  socket.on('terminal:write', (data) => {
    ptyProcess.write(data);
  })
})


app.get('/files', async (req, res) => {
  const fileTree = await generateFileTree('./user');
  return res.json({ tree : fileTree })
})

server.listen(9000, () => console.log('🐋 Server running of port 9000'))

async function generateFileTree(directory){
  const tree = {};

  async function buildTree(currDir, currTree){
    const files = await fs.readdir(currDir);

    for (const file of files){
      const filePath = path.join(currDir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()){
        currTree[file] = {};
        await buildTree(filePath, currTree[file]);
      } else {
        currTree[file] = null;
      }
    }
  }

  await buildTree(directory, tree);
  return tree;
}