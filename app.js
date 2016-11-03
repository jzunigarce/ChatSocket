var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

app.use(express.static(__dirname + '/assets'));
//Routes
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

var createUser = function(userName, socketId){
  var colors = [];
  for(var i = 0; i < 3; i++)
    colors.push(Math.floor(Math.random() * 254));
  return {'id': socketId, 'name': userName, 'color': colors.join(',')};
}

var isExists = function(userName){
  var exists = false;
  for(i in users){
    if(users[i].name == userName){
      return true;
    }
  }
  return false;
}

//Socket
io.on('connection', function(socket){
  socket.on('signIn', function(userName){
    var data;
    var exists = true;
    if(!isExists(userName)){
      data = createUser(userName, socket.id);
      users.push(data);
      exists = false;
      socket.broadcast.emit('userConnect', {'users': users});
    }
    socket.emit('signIn', {'exists': exists, 'users': users, 'user': data});
  });

  socket.on('disconnect', function(){
    console.log('User desconnected');
    users.forEach(function(el, index, a){
      console.log(users[index]);
      if(el.id === socket.id)
        users.splice(index, 1);
    });
    socket.broadcast.emit('logOut', {'users': users});
  });
  socket.on('sending', function(msg){
    socket.broadcast.emit('sending', msg);
  });
});

http.listen(3000, function(){
  console.log('Listening on *:3000');
});
