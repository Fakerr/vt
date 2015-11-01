
var _ = require('underscore');


/**
 * Room constructor.
 */

function Room(roomName, full, opponent) {
  this.roomName = roomName;
  this.full = full;
  this.opponent = opponent;
}

/**
 * Player constructor.
 */

function Player(name, number, nbRegister) {
  this.name = name || '';
  this.number = number || null;
}

/**
 * Socket base core.
 */

exports.core = function(io, socket, dualRooms){
  var room = {};
  // Logging user connection.
  console.log('User connected');
  // Handling user name.
  socket.on('pseudo', function(pseudo) {
    //Instanciate new player and add it to socket object.
    socket.player = new Player(pseudo);
    console.log(socket.player.name);
    //Searching available room or creating one if it doesn't exist.
    room = searchForRoom(dualRooms);
    if(room) {
      joinRoom(socket, room);
    }else {
      createRoom(socket, dualRooms, room);
    }
  });
  //Handling user number.*
  socket.on('number', function(number) {
    socket.player.number = number;
  });
  // Handle number message.
  socket.on('vt', function(msg) {
    //Check for msg(number) validity.
    var val = numberValidity(msg);
    if(val){
      // Treat number.
      treatNumber(msg, io, socket, function(data){
        io.to(socket.room.roomName).emit('vt',[msg, data, socket.player.name]);
      });
    }
    else {
      io.sockets.connected[socket.id]
      .emit('wn', 'Please enter a valid number.');
    }
  });
  // User disconnection.
  socket.on('disconnect', function(){
    if(socket.room.full === true) {
      updateRoomMembers(socket, dualRooms, io);
    }else {
      deleteRoom(dualRooms, socket.room);
    }
    console.log('User disconnected');
  });
};

/**
 * Join room.
 */

function joinRoom(socket, room) {
  room.full = true;
  room.opponent = socket.player.name;
  socket.join(room.roomName);
  socket.room = room;
}

/**
 * Create new room.
 */

function createRoom(socket, dualRooms, room) {
  socket.join(socket.player.name);
  room = new Room(socket.player.name, false, 'none');
  socket.room = room;
  dualRooms.push(room);
}

/**
 * Delete room.
 */

function deleteRoom(rooms, room) {
    var index = rooms.indexOf(room);
    if(index > -1)
      rooms.splice(index,1);
}

/**
 * Search for free room.
 */

function searchForRoom(rooms) {
  for(var i=0; i < rooms.length; i++){
    if(rooms[i].full === false)
      return rooms[i];
   }
 }

 /**
 * Update room members after someone leaving.
 * Here, we try to update other opponent status.In this case,
 * we try to found another waiting player in different room.
 * If not, we stay in the same room.
 */

function updateRoomMembers(socket, dualRooms, io) {
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
     oppSocket.room.full = false;
     oppSocket.room.opponent = 'none';
   }
 }

/**
 * Return false if number is not valid.
 */

function numberValidity(number) {
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
}

/**
 * Treat number correspondance.
 */

function  treatNumber(number, io, socket, callback) {
  var socketIds = Object.keys(io.nsps['/'].adapter.rooms[socket.room.roomName]);
  var socketId = _.find(socketIds, function(val){
    return val !== socket.id;
  });
  var oppSocket = io.sockets.connected[socketId];
  var result = vt(number, oppSocket.player.number);
  callback(result);
}

/**
 * Render vt.
 */

 function vt(number, numberToFound) {
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
 }
