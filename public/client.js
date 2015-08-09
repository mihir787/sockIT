//initiate socket using const io from server
var socket = io();


//gets the HTML element connection-count
var connectionCount = document.getElementById('connection-count');

//sets up listener for the usersConnected emission from server
socket.on('usersConnected', function(count){
  connectionCount.innerText = 'Connected Users: ' + count;
});


//gets the HTML element status-message
var statusMessage = document.getElementById('status-message');

//sets up listener for the statusMessage single socket emission from server
socket.on('statusMessage', function(message){
  statusMessage.innerText = message;
});


//get an array of HTML button elements
var buttons = document.querySelectorAll('#choices button');

//binds event listeners to each of the buttons
for(var i = 0; i < buttons.length; i++){
  buttons[i].addEventListener('click', function(){
    console.log(this.innerText);
    socket.send('voteCast', this.innerText);
  });
};


//gets the HTML element vote-tally
var aVotes = document.getElementById('a-votes');
var bVotes = document.getElementById('b-votes');
var cVotes = document.getElementById('c-votes');
var dVotes = document.getElementById('d-votes');

//sets up listener for the voteTally emission from server
socket.on('voteTally', function(tally){
  aVotes.innerText = "A: "+tally.A;
  bVotes.innerText = "B: "+tally.B;
  cVotes.innerText = "C: "+tally.C;
  dVotes.innerText = "D: "+tally.D;
});


//gets the HTML element last-vote
var lastVote = document.getElementById('last-vote');

//sets up event listener for the lastVote emission from the server
socket.on('lastVote', function(vote){
  lastVote.innerText = "Last vote: "+vote;
});
