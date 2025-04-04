const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: { type: String }
})

const messageModel = mongoose.model("Message", messageSchema)

console.log()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/messages', async function(req, res){
  res.json(await messageModel.find());
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    const message = new messageModel();
    message.content = msg;
    message.save().then(m => {
      io.emit('chat message', msg);
    })
  });
});

server.listen(3000, async function(){
  await mongoose.connect("mongodb+srv://alexazhang:alexa20041010@cluster0.nfjqmuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  console.log('listening on *:3000');
});
