var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/assets'));
//Routes
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

//Socket
io.on('connection', function(socket){
  console.log('A user connected');
  socket.on('disconnect', function(){
    console.log('User desconnected');
  });
});

http.listen(3000, function(){
  console.log('Listening on *:3000');
});
