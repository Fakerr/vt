
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
* Socket base core.
**/

exports.core = function(io, socket, dualRooms){
  var room = {};
  // Logging user connection.
  console.log('User connected');
  socket.on('pseudo', function(pseudo) {
    socket.pseudo = pseudo;
    //Searching available room or creating one if it doesn't exist.
    room = searchForRoom(dualRooms);
    if(room) {
      joinRoom(socket, room);
    }else {
      createRoom(socket, dualRooms, room);
    }
  });
  // Send messages to all room members.
  socket.on('vt', function(msg) {
    socket.to(socket.room.roomName).emit('vt', msg);
  });
  // User disconnection
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
  room.opponent = socket.pseudo;
  socket.join(room.roomName);
  socket.room = room;
}

/**
* Create new room.
*/

function createRoom(socket, dualRooms, room) {
  socket.join(socket.pseudo);
  room = new Room(socket.pseudo, false, 'none');
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
