const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const channels = {};
const bodyparser = require('body-parser');

app.use(bodyparser.json())

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/example.html');
});

app.post('/api/gitlab', (req, res) => {
  console.log(req.body);
  io.emit('gitlab_event', req.body);
  res.status(200).send();
});

io.on('connection', (socket) => {
  console.log('new connection: ' + socket.id);
  socket.on('chat_message', data => {
    console.log(data);
    const channel = channels[socket.id];
    console.log(channel);
    console.log('new msg', data.message);
    console.log('USER : ', data.user);
    socket.to(channel).emit('new_message',data.message);
  });

  socket.on('join_channel', (channel) => {
    channels[socket.id] = channel;
    console.log('channels',channels);
    console.log('join channel', channel);
    socket.join(channel);
  });

});
//https://socket.io/get-started/chat#getting-this-example

server.listen(3000, () => {
  console.log('listening on *:3000');
});
