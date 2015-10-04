#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('vt:server');
var http = require('http');
var socket = require('socket.io');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
* Create instance of socket.io by passing server.
*/

var io = socket(server);

// Array of rooms.
var rooms = [];
// Room object.
var room = {};

io.on('connection', function(socket){
  // Logging user connection.
  console.log('User connected');

  socket.on('pseudo', function(pseudo) {
    socket.pseudo = pseudo;
    room = searchForRoom();
    if(room) {
      socket.join(room.roomName);
      socket.room = room;
    }else {
      socket.join(pseudo);
      room = {
        roomName: pseudo,
        full: false
      };
      socket.room = room;
      rooms.push(room);
    }
  });
  socket.on('vt', function(msg) {
    socket.to(socket.room.roomName).emit('vt', msg);
  });
  // Logging user disconnection
  socket.on('disconnect', function(){
    if(socket.room.full === true)
      socket.room.full = false;
    console.log('User disconnected');
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function() {
  console.log('Express server listening on port ' +  port );
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Search for free room.
 */
 function searchForRoom() {
   for(var i=0; i < rooms.length; i++){
     if(rooms[i].full === false){
       rooms[i].full = true;
       return rooms[i];
     }
   }
 }

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
