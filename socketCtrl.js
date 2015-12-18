var _ = require('underscore');

module.exports = {

  /**
   * Socket base core.
   */
  core : function(io, socket, dualRooms){

    // Logging user connection.
    console.log('User connected');
    // Handling user name.
    socket.on('pseudo', function(pseudo) {
      this.initPlayer(pseudo, socket, dualRooms);
    });
    //Handling user number.
    socket.on('number', function(number) {
      socket.player.number = number;
    });
    // Handle message.
    socket.on('vt', function(msg) {
      this.vtCore(socket, msg, io);
    });
    // User disconnection.
    socket.on('disconnect', function(){
      this.disconnection(socket, io, dualRooms);
    });
  },

  /**
   * Room constructor.
   */
  Room :  function(roomName, full, opponent) {
    this.roomName = roomName;
    this.full = full;
    this.opponent = opponent;
  },

  /**
   * Player constructor.
   */
  Player : function(name, number, turn) {
    this.name = name || 'Default';
    this.number = number || null;
    this.turn = turn || false;
  },

  /**
   * Disconnect.
   */
   disconnection : function(socket, io, dualRooms) {
     if(socket.room.full === true) {
       updateRoomMembers(socket, dualRooms, io);
     }else {
       deleteRoom(dualRooms, socket.room);
     }
     console.log('User disconnected');
  },

  /**
   * Vt core.
   */
   vtCore : function vtCore(socket, msg, io){
      // Check for turn.
      if(socket.player.turn){
        //Check for msg(number) validity.
        var val = numberValidity(msg);
        if(val){
          // Treat number.
          treatNumber(msg, io, socket, function(data){
            // Pass turn to opponent.
            passTurn(io, socket); // Opponent must exist!!
            io.to(socket.room.roomName).emit('vt',[msg, data, socket.player.name]);
          });
        }
        else {
          io.sockets.connected[socket.id]
          .emit('wn', 'Please enter a valid number.');
        }
      }else{
        io.sockets.connected[socket.id]
        .emit('wn', 'Please, wait your turn.');
      }
  },

  /**
   * Init player.
   */
   initPlayer : function initPlayer(pseudo, socket, dualRooms){
     //Instanciate new player and add it to socket object.
     socket.player = new Player(pseudo);
     //Searching available room or creating one if it doesn't exist.
     var room = searchForRoom(dualRooms);
     if(room) {
       joinRoom(socket, room);
     }else {
       createRoom(socket, dualRooms, room);
     }
  },

  /**
   * Join room.
   */
   joinRoom : function(socket, room) {
     // Player who join the room is first player to play.
     socket.player.turn = true;
     room.full = true;
     room.opponent = socket.player.name;
     socket.join(room.roomName);
     socket.room = room;
  },

  /**
   * Create new room.
   */
   createRoom : function(socket, dualRooms, room) {
     // join/create a room with the same name as the player.
     socket.join(socket.player.name);
     room = new Room(socket.player.name, false, 'none');
     socket.room = room;
     dualRooms.push(room);
  },

  /**
   * Delete room.
   */
   deleteRoom : function(rooms, room) {
       var index = rooms.indexOf(room);
       if(index > -1)
         rooms.splice(index,1);
  },

  /**
   * Search for free room.
   */
   searchForRoom : function(rooms) {
     for(var i=0; i < rooms.length; i++){
       if(rooms[i].full === false)
         return rooms[i];
      }
  },

  /**
  * Update room members after someone leaving.
  * Here, we try to update other opponent status.In this case,
  * we try to found another waiting player in different room.
  * If not, we stay in the same room.
  */
  updateRoomMembers : function(socket, dualRooms, io) {
     var newRoom = {};
     // Getting id of room player.
     var socketId = Object.keys(io.nsps['/'].adapter.rooms[socket.room.roomName])[0];
     // Get socket from id.
     var oppSocket = io.sockets.connected[socketId];
     //Searching for available room.
     newRoom = searchForRoom(dualRooms);
     if(newRoom) {
       oppSocket.leave(oppSocket.room.roomName);
       //Update dualRooms (deleting current one).
       deleteRoom(dualRooms, oppSocket.room);
       // Join the new room.
       joinRoom(oppSocket, newRoom);
     }else {
       //Update room status.
       oppSocket.player.turn = false;
       oppSocket.room.full = false;
       oppSocket.room.opponent = 'none';
     }
  },

  /**
   * Return false if number is not valid.
   */
   numberValidity : function(number) {
     if (typeof number !== "string") {
       return false;
     }
     if (number.length != 4) {
       return false;
     }
     for(var i=0; i<4; i++) {
       var j = 0;
       while(j < 4) {
         if (i != j && number[i] != number[j]){
           j++;
         }else if (i != j) {
           return false;
         }else {
           j++;
         }
       }
     }
     return true;
  },

  /**
   * Treat number correspondance.
   */
   treatNumber : function(number, io, socket, callback) {
     var socketIds = Object.keys(io.nsps['/'].adapter.rooms[socket.room.roomName]);
     var socketId = _.find(socketIds, function(val){
       return val !== socket.id;
     });
     var oppSocket = io.sockets.connected[socketId];
     var result = vt(number, oppSocket.player.number);
     callback(result);
  },

  /**
   * Render vt.
   */
   vt : function(number, numberToFound) {
     var result = {
       T: 0,
       V: 0
     };
     for(var i=0; i < number.length; i++) {
       var j = 0;
       while(j < numberToFound.length) {
         if(number[i] === numberToFound[j] && i == j){
           result.T += 1;
           break;
         }else if(number[i] === numberToFound[j]){
           result.V += 1;
           break;
         }else{
           j++;
         }
       }
     }
     return result;
  },

  /**
   * Pass turn to opponent.
   */
   passTurn : function(io, socket){
     socket.player.turn = false;
     var socketIds = Object.keys(io.nsps['/'].adapter.rooms[socket.room.roomName]);
     var socketId = _.find(socketIds, function(val){
       return val !== socket.id;
     });
     io.sockets.connected[socketId].player.turn = true;
  }

};
