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

var randomColor = function() {
  var colors = [];
  for(var i = 0; i < 3; i++)
    colors.push(Math.floor(Math.random() * 254));
  return colors.join(',');
};

var createUser = function(nick, id){
  return {'id': id, 'nick': nick, 'color': randomColor()};
}

var isExists = function(nick){
  var exists = false;
  for(i in users){
    if(users[i].nick == nick){
      return true;
    }
  }
  return false;
}

//Socket
io.on('connection', function(socket){
  socket.on('signIn', function(data){
    var nick = data.nick;
    var user;
    var exists = true;
    if(!isExists(nick)){
      user = createUser(nick, socket.id);
      users.push(user);
      exists = false;
      socket.broadcast.emit('userConnect', {'users': users});
    }
    socket.emit('signIn', {'error': exists, 'users': users, 'user': user});
  });

  socket.on('disconnect', function(){
    console.log('User desconnected');
    users.forEach(function(el, index, a){
      if(el.id === socket.id)
        users.splice(index, 1);
    });
    socket.broadcast.emit('logOut', {'users': users});
  });
  socket.on('sending', function(data){
    socket.broadcast.emit('sending', data);
  });
});

http.listen(3000, function(){
  console.log('Listening on *:3000');
});
