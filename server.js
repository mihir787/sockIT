//require the libraries
const http     = require('http');
const express  = require('express');
const socketIo = require('socket.io');

//instantiate the app as an instance of express
const app      = express();

//allows express app to serve the public directory
app.use(express.static('public'));

//ROUTES

//set the root view as the index.html
app.get('/', function (request, response){
  response.sendFile(_dirname + '/public/index.html');
});

//SERVER

//set the port if not evironmental port exists
var port = process.env.PORT || 3000;

//initialize the server - pass the express app to the http module and have it listen to the port
var server = http.createServer(app)
                 .listen(port, function(){
                    console.log('Listening on port '+ port +'.');
                  });

//initiate socket io using the server instance
const io       = socketIo(server);

//emits a message to all sockets with number of connected clients
function usersConnected(){
  io.sockets.emit('usersConnected', io.engine.clientsCount);
};

function usersVoteTally(voteCount){
  io.sockets.emit('voteTally', voteCount);
};

//vote counter function
function countVotes(votes) {
  var voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  for (vote in votes) {
    voteCount[votes[vote]]++
  }
  usersVoteTally(voteCount);
  return voteCount;
}

//setup a vote counter variable hash
var votes = {};

//setup event listener for connections to the server
io.on('connection', function(socket){
  //logs to the server when a user has connected and the total count of all users
  console.log('A user has connected.', io.engine.clientsCount);

  //emits a message to all sockets when a new client connects
  usersConnected();

  //sends message to specific socket when they connect
  socket.emit('statusMessage', 'You have connected.');

  //sends a message to the socket with the initial vote tally
  socket.emit('voteTally', countVotes(votes));

  //setup event listener for voteCast from the client
  socket.on('message', function(channel, message){
    if(channel === 'voteCast'){
      //adds a vote to the hash with socket id
      votes[socket.id] = message;
      console.log(countVotes(votes));
      socket.emit('lastVote', message);
    }
    //console.log(channel, message);  
  });

  //setup event listener for disconnections to the server
  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    //deletes a sockets vote on disconnect
    delete votes[socket.id];
    console.log(countVotes(votes));
    //emits a message to all sockets when a client disconnects
    usersConnected();
  });

});

//export the server so we can use it later
module.exports = server;



