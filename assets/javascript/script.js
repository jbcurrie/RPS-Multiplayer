// Initialize Firebase
  var config = {
    apiKey: "AIzaSyA5F5P0GSsJqFn--1w0Gn53wZYQCwroVcw",
    authDomain: "rockpaperscissors-5e2af.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-5e2af.firebaseio.com",
    projectId: "rockpaperscissors-5e2af",
    storageBucket: "",
    messagingSenderId: "1029150595036"
  };

  firebase.initializeApp(config);

//store firebase under var database 
var database = firebase.database();

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

//compare snapshot against a locally store value to create global conditions 
	//we should be able to use turn for the game

//assign player names to html block
//assign game objects
//set them all to variables
//update firebase with this information (uniquely identified based on html class identifiers)

//if you set an event listener outside of a click function, you can update both pages. 
	//based in a click function, depends on user. 

//variables that need to be updated globally
	//player divs
		//show names on both player pages
		//create a condition to hide content on page based on turn
			//if turn ===1, player 1 objects show
			//if turn ===2
	//conditional actions
var gameObj = {
			playerName:"",
			playerOne:"",
			playerTwo:"",
			plyrOneWins:0,
			plyrOneLosses:0,
			plyrTwoWins:0,
			plyrTwoLosses:0,
			ties:0,
			playerOneImgs:"",
			playerTwoImgs:"",
			playerKeys: [1,2],
			selectPlayers: function () {
				//coders bay view tracker (children snapshot)

				//on click, assign the input either player1 or player2 variable in game
				//if player 1 add their info to the database and update the DOM globally
				//if player 2 add their info to the database and update the DOM globally

				//check to see if they are removed from the game if disconnected
				event.preventDefault();
				// debugger;
				//could also assign player one and two here, and update their values in the database based on JS
				playerName = $("#addPlayer").val().trim();

				console.log(playerName);
				//should this be in a click function? 
				database.ref().once("value", function(snapshot) {
					
					
					if (snapshot.child("players").exists() === false) {
						database.ref("/players/1").set({
							playerName: playerName,
					    	wins:0,
					    	losses:0,
					    	ties:0
						})
					//bad logic. would overwrite whatever's in p2 if p1 disconnects and players exists 
					} else if (snapshot.child("players").exists()) {
						database.ref("/players/2").set({
							playerName: playerName,
					    	wins:0,
					    	losses:0,
					    	ties:0
						})
					}

					// gameObj.displayPlayers();
					gameObj.displayGameMsg();
					//put these in a global event listener; weird to have them in a click function.
				});

			},
			displayPlayers: function () {
				//change to child_added / child_changed (more stable)
				database.ref().on("value", function (snapshot) {
				
					if (snapshot.child("players").child("1").exists()) {
						gameObj.playerOne = snapshot.child("players").child("1").val().playerName;
						$("h3.playerOne").html(gameObj.playerOne);
					}

					if (snapshot.child("players").child("2").exists()) {
						gameObj.playerTwo = snapshot.child("players").child("2").val().playerName
						$("h3.playerTwo").html(gameObj.playerTwo);
					}
				database.ref("/players/1").onDisconnect().remove();
				database.ref("/players/2").onDisconnect().remove();
				});
			},
			displayGameMsg: function () {
				//need this to show text to each respective player
				//child_added doesn't distinguish between 1 and 2 childs
				
				database.ref("players").on("value", function(snapshot) {
					
					if (gameObj.playerOne === playerName) {
						$("#form1").replaceWith("<h3 class='gameMsg text-center'>" + gameObj.playerOne + " , you are player one.")
					}
					if (gameObj.playerTwo === playerName) {
						$("#form1").replaceWith("<h3 class='gameMsg text-center'>" + gameObj.playerTwo + " , you are player two.")
					}
					if (snapshot.child("1").exists() && snapshot.child("2").exists()) {
						gameObj.gameStartLogic();
					}
				});

				
			},
			gameStartLogic: function () {
				database.ref().on("value", function(snapshot) {	
					database.ref().update({
						turn:1
					});

				});
				database.ref("players").orderByKey().once("value", function(snapshot) {
					debugger;
					snapshot.forEach(function(childSnapshot){
						// if the current turn equals player key, display 
						//message, it's your turn
							//display game objects
						console.log(childSnapshot.key);
					});
				});
			}
			//gameLogic function
				//on click function, update your firebase object with the RPS choice
				//update the dom
				//change turn
				//call on turn function
					//display your turn to next player

				//if player 1 and 2 both have keys for RPS, compare and decide who won,tie etc
					//update counters

		}



	//if condition needs to be based off firebase data. you cant do anything without comparing there for multiplayer
	//if player 1 exists, add player 2
		//what can i do safely in a snapshot
			//i can compare data from the game to data in snapshot
			//i can update html with snapshot data
		//what can't i do safely
			//i can't update firebase safely based on snapshot data, because on will read what's there continuously
				//unless i shut it off
		//on snapshot read what's in firebase and update it
			//off snapshot
			//when button clicked, do on/off again
//if you set turn:1 in the game obj, the value of turn will always remain 1
			//updating turn within a function (for instance setting the value to whatevers in firebase)
				//should allow you to change turn depending on what you need to do

			//on submit of player name
				//log the value of the name to firebase as a player
					//print the name and game information to the dom with the RPS icons
				//increment the turn
				//on the next click, log the second player as player two with game information
				//on the next click don't allow the function to run
// 	turn: null
// }

// firebase.database.enableLogging(function(message) {
//   console.log("[FIREBASE]", message);
// });
  //variables needed
  //player 1 and 2
  //wins losses ties
  //turn
  //chat

//what does firebase need to do
	//game
		//log player names, associate them with a turn (turn1 or turn2)
			//when name in input and start button clicked
				//firebase creates node called players
					//'1' is a child node of the first player, with losses, name and wins as key value pairs
					//'2' is the second player with the same data
				//firebase creates a node called turn in the same dataref

$(document).ready(function() {
	//always listening, and nothing to tell it work based on the results of a click functio
	$("#add-Player").on("click", gameObj.selectPlayers);
	gameObj.displayPlayers();

});


		//instead of creating conditions on how to assign firebase data, have the event in JS determine what will be updated in firebase
		//for example, on button click, assign name to the first id div without any elements
		//take the value of the name and assign it to the first key in firebase

	  	// })

	// }

		//keep track of turns (based on icon clicks)
			//on icon click, player turn changes from 1 to 2
		//choices key value pair appears on each turn, indicating which icon was selected 

		//firebase increments the correct player win/losses following the second icon click.
		//decide who wins based on game logic - update that player counter (based on turn)
		//decides who loses based on game logic  - update that player counter (based on turn)
		//decides who ties based on game logic  - update both player counters

		//settimeout feature displays the round result ("you win/you lose" for a set amount of time). then next round automatically begins
	//chat
		//track comments based on player name 
		//display message if player disconnects
		//display new name of new player


  //game logic
  	//build RPS  game logic. player 2 replaces PC randomization
  	//players click on icons, which hold data values equal to the object below, which then updates firebase with the player choice (logged as a string)
  		// var rps = {
  		// 	rock: "r",
  		// 	paper: "p",
  		// 	scissor: "s"
  		// }

  		//animation icons transition onto screen (pop)
  		//if win, highlight box of winner, do animation
  		//

  	//add multiplayer functionality

  	//add chat functionality
  		//intropresence exercise 'connectedRef'


//html
	//divs that don't change/show on start
		//header
		//game player div
		//form input div get name and start
		//middle div for result
		//chat window
	//firebase functions needed
		//database ref 
			//update game info
		//connected ref
			//assuming used for chat
		//push()
		//exists()
