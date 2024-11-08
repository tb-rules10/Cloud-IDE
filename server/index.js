const http = require('http');
const express = require('express');
const pty = require('node-pty');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');
const chokidar = require('chokidar');

const { Server: SocketServer } = require('socket.io');

// Node-PTY
const bash = 'C:\\Program Files\\Git\\bin\\bash.exe';
const ptyProcess = pty.spawn(bash , [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + "/user",
  env: process.env
});

ptyProcess.onData((data) => {
    io.emit('terminal:data', data);
});

// Chokidar
chokidar.watch('./user').on('all', (event, path) => {
  io.emit('file-refresh');
});

// Server
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('-->> Socket connected:', socket.id);

  socket.on("code-update", async (content, filePath) => {
    try {
      const file = await fs.writeFile(path.join("./user", filePath), content);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  })
  
  socket.on('terminal:write', (data) => {
    ptyProcess.write(data);
  })
  
  // socket.on('disconnect', (data) => console.log('-->> Disconnected:', socket.id));
})

server.listen(5000, () => console.log('🐋 Server running of port 5000'))

// Routes
app.get('/', (req, res) => {
  return res.json(
    {
      msg: "Hi from TB!"
    });
})

app.get('/files', async (req, res) => {
  const fileTree = await generateFileTree('./user');
  return res.json({ tree : fileTree })
})

app.get('/files/content', async (req, res) => {
  const filePath = req.query.path;
  const content = await fs.readFile(`./user${filePath}`, 'utf-8');
  return  res.json({ content });
})

async function generateFileTree(directory) {
  const tree = {};

  async function buildTree(currDir, currTree) {
    const files = await fs.readdir(currDir);

    for (const file of files) {
      const filePath = path.join(currDir, file);

      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        // Add node_modules as a single entry without expanding
        if (file === 'node_modules') {
          currTree[file] = null; // Mark as a folder without expanding
        } else {
          currTree[file] = {};
          await buildTree(filePath, currTree[file]);
        }
      } else {
        currTree[file] = null;
      }
    }
  }

  await buildTree(directory, tree);
  return tree;
}
