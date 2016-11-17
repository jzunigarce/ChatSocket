(function(){
  var socket = null;

  var formatTime = function(i) {
    return i < 10 ? ("0" + i) : i;
  }

  var startTime = function() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    m = formatTime(m);
    s = formatTime(s);
    return h + ":" + m + ":" + s;
  }

  vm = new Vue({
    "el": "#chatApp",
    data: {
      'showLogin': true,
      'nick': '',
      'error': '',
      'errorAlert': false,
      'msg': '',
      'msgs': [],
      'users': [],
      'user': null
    },
    "methods":{
      "showError": function(msj){
        this.error = msj;
        this.errorAlert = true;
        var self = this;
        setTimeout(function(){
          self.errorAlert = false;
        }, 3000);
      },
      "signUp": function(){
        if(this.nick.trim().length === 0)
          this.showError('Debe de ingresar un nombre de usuario');
        else{
          if(socket == null){
            socket = io();
            var self = this;
            socket.on('signIn', function(data){
              if(data.error){
                self.showError('Nombre de usuario no disponible');
              }else{
                self.users = data.users;
                self.user = data.user;
                self.showLogin = false;
                socket.on('logOut', function(data){
                  self.users = data.users;
                });
                socket.on('userConnect', function(data){
                  self.users = data.users;
                });
                socket.on('sending', function(data){
                  self.pushMsg(data);
                });
              }
            });
          }
          socket.emit('signIn', {'nick': this.nick});
        }
      },
      "sendMsg": function(){
        var message =  {'sender': this.user.nick, 'msg': this.msg, 'color': this.user.color, 'date': startTime()}
        this.pushMsg(message);
        socket.emit('sending',  message);
        this.msg = '';
      },
      "pushMsg": function(message){
        this.msgs.push(message);
      },
    }
  });
})();
