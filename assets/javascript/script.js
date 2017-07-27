// Initialize Firebase
//remove turn on disconnect (both players)
//get the opponent icon to display in the gameround/RPS click function
//add new logic
	//connection drops, if 
	//with 2 players how to adjust code to recognize players up
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
			turn:1,
			plyrTurn:1,
			plyrOneChoice:"",
			plyrTwoChoice:"",
			playerKeys: [1,2],
			plyrOneDtch:"",
			plyrOneClone:"",
			plyrTwoDtch:"",
			plyrTwoClone:"",
			gameReady: false,
			resultsRnd: {},
			round: "",
			nextRound: "",
			rpsObj: {
				paper:[$("<img>").attr("src",'assets/images/paper.png'),$("<img>").attr("src",'assets/images/paper_2.png')],
				rock:[$("<img>").attr("src",'assets/images/rock.png'),$("<img>").attr("src",'assets/images/rock_2.png')],
				scissors:[$("<img>").attr("src",'assets/images/scissors.png'),$("<img>").attr("src",'assets/images/scissors_2.png')],
			},
			selectPlayers: function () {
				//coders bay view tracker (children snapshot)

				//on click, assign the input either player1 or player2 variable in game
				//if player 1 add their info to the database and update the DOM globally
				//if player 2 add their info to the database and update the DOM globally

				//check to see if they are removed from the game if disconnected
				event.preventDefault();
				
				//could also assign player one and two here, and update their values in the database based on JS
				playerName = $("#addPlayer").val().trim().toUpperCase();

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
						gameObj.plyrTurn = 1
					//bad logic. would overwrite whatever's in p2 if p1 disconnects and players exists 
					} else if (snapshot.child("players").exists()) {
						database.ref("/players/2").set({
							playerName: playerName,
					    	wins:0,
					    	losses:0,
					    	ties:0
						})
						gameObj.plyrTurn = 2
					}

					// gameObj.displayPlayers();
					gameObj.displayGameMsg();
					//put these in a global event listener; weird to have them in a click function.
				});

			},
			displayPlayers: function () {
				//change to child_added / child_changed (more stable)
				database.ref().on("value", function (snapshot) {
				// 
					if (snapshot.child("players").child("1").exists()) {	
						gameObj.playerOne = snapshot.child("players").child("1").val().playerName;
						$("h3.playerOne").html(gameObj.playerOne);
						if ($("div.playerOne").find("div.results").text() === "") {
							$("div.playerOne").find("div.results").append("<p class='wins'>Wins: " + gameObj.plyrOneWins)
							$("div.playerOne").find("div.results").append("<p class='losses'>Losses: " + gameObj.plyrOneLosses)
							$("div.playerOne").find("div.results").append("<p class='ties'>Ties: " + gameObj.ties)
						}
					}

					if (snapshot.child("players").child("2").exists()) {
						gameObj.playerTwo = snapshot.child("players").child("2").val().playerName;
						$("h3.playerTwo").html(gameObj.playerTwo)
						if ($("div.playerTwo").find("div.results").text() === "") {
							$("div.playerTwo").find("div.results").append("<p class='wins'>Wins: " + gameObj.plyrTwoWins)
							$("div.playerTwo").find("div.results").append("<p class='losses'>Losses: " + gameObj.plyrTwoLosses)
							$("div.playerTwo").find("div.results").append("<p class='ties'>Ties: " + gameObj.ties)
						}
					}
					
				});

				// if one player leaves, they both disconnect
				database.ref("players").child("1").onDisconnect().remove();
				database.ref("players").child("2").onDisconnect().remove();
				database.ref("players").on("value", function(snapshot) {
					// debugger;
				if (!snapshot.child("1").exists() && !snapshot.child("2").exists()) { 
					database.ref("turn").onDisconnect().remove();
				}
				});
				
			},
			displayGameMsg: function () {
				//need this to show text to each respective player
				//child_added doesn't distinguish between 1 and 2 child
				if (gameObj.playerOne === playerName) {
					if(!$("h3").hasClass("gameMsg")){
						$("#form1").replaceWith("<h3 class='gameMsg text-center'>" + gameObj.playerOne + " , you are player one.")
					}
				}
				if (gameObj.playerTwo === playerName) {
					if(!$("h3").hasClass("gameMsg")){
						$("#form1").replaceWith("<h3 class='gameMsg text-center'>" + gameObj.playerTwo + " , you are player two.")
					}
				}
				database.ref("players").on("value", function(snapshot) {
					if (snapshot.child("1").exists() && snapshot.child("2").exists() && !snapshot.child("choices").exists()) {
					
						gameObj.gameStartLogic();
					}
				});

				
			},
			//should retool so it happens on each click?
			//or create game object variables equal to this information
			gameStartLogic: function () {
			
				//if there are no choices to make
				if (gameObj.gameReady === false) {

					if (gameObj.turn === gameObj.plyrTurn) { 

		

						if (gameObj.plyrTurn === 1) {
							if(!$("h3").hasClass("gameMsgOne")) {
								$(".gameMsgOne").empty();
								// debugger;
								$("h3.gameMsg").after("<h3 class='gameMsgOne text-center'>" + "It's your turn.")
							}

							if (gameObj.plyrOneClone !== "") { 
								$("div.playerOne").prepend(gameObj.plyrOneClone)

							} else { 

								$("div.playerOne").prepend("<a href='#!'>");
								$("div.panel-body").find("a").eq(0).addClass("rock").attr("data-rps","rock").append(gameObj.rpsObj.rock[0])
								$("div.playerOne").prepend("<a href='#!'>");
								$("div.panel-body").find("a").eq(0).addClass("paper").attr("data-rps","paper").append(gameObj.rpsObj.paper[0])
								$("div.playerOne").prepend("<a href='#!'>");
								$("div.playerOne").find("a").eq(0).addClass("scissors").attr("data-rps","scissors").append(gameObj.rpsObj.scissors[0]);
								


								$("div.panel-body").find("img").addClass("img-responsive center-block");
								$("div.panel-body").find("a").addClass("float").wrap("<div class='col-lg-4 col-md-4 col-sm-6 col-xs-6'>")
								$("a.rock").parent().addClass("col-lg-offset-2 col-md-offset-2 col-sm-offset-3 col-xs-offset-3");

							}
							
						
						} else if (gameObj.plyrTurn === 2) {

							if(!$("h3").hasClass("gameMsgOne")) {
								$("h3.gameMsg").after("<h3 class='gameMsgOne text-center'>" + "It's your turn.")
							}

							if (gameObj.plyrTwoClone !== "") { 
								$("div.playerOne").prepend(gameObj.plyrTwoClone)

							} else {

							$("div.playerTwo").prepend("<a href='#!'>");
							$("div.panel-body").find("a").eq(0).addClass("rock").attr("data-rps","rock").append(gameObj.rpsObj.rock[1])
							$("div.playerTwo").prepend("<a href='#!'>");
							$("div.panel-body").find("a").eq(0).addClass("paper").attr("data-rps","paper").append(gameObj.rpsObj.paper[1])
							$("div.playerTwo").aprepend("<a href='#!'>");
							$("div.playerTwo").find("a").eq(0).addClass("scissors").attr("data-rps","scissors").append(gameObj.rpsObj.scissors[1]);
							

							
							$("div.panel-body").find("img").addClass("img-responsive center-block");
							$("div.panel-body").find("a").addClass("float").wrap("<div class='col-lg-4 col-md-4 col-sm-6 col-xs-6'>")
							$("a.rock").parent().addClass("col-lg-offset-2 col-md-offset-2 col-sm-offset-3 col-xs-offset-3");			
							}
						} 
					gameObj.gameReady = true;

					//display game objects
					//else it's the other player's turn
					} 
					// else { 
					// 		$(".gameMsgOne").empty();
						
					// 		$("h3.gameMsg").after("<h3 class='gameMsgOne text-center'>" + "Waiting for your opponent.")
					// 	gameObj.gameReady = true;
					// 	}
				 // // else {

					// // if(!$("h3").hasClass("gameMsgTwo")){
					// // 	$("h3.gameMsg").after("<h3 class='gameMsgTwo text-center'>" + "Waiting for your opponent.")
					// // }

				}
				

			},
			rpsClick: function() {
				//on click, log selection to firebase
				$("body").on("click","img",function () {
					event.preventDefault()
					// debugger;

					if (gameObj.plyrTurn === 1) { 
						
						gameObj.plyrOneChoice = $(this).closest("a").data("rps")
						database.ref("players").child("1").update({
							choice: gameObj.plyrOneChoice 
						})
						
						gameObj.turn = 2
						
						database.ref().update({
							turn:gameObj.turn
						})

						// $(".playerOne").fin
						gameObj.plyrOneClone = $(".playerOne").find(".col-lg-4").clone();
						gameObj.plyrOneDtch = $(".playerOne").find(".col-lg-4").detach();
						for (var i in gameObj.rpsObj) {
							// temp = Object.keys(gameObj.rpsObj)
							if (gameObj.plyrOneChoice === i) {
								$("div.playerOne").prepend("<a href='#!'>");
								 $(".playerOne").find("a").append(this).attr("data-rps", gameObj.plyrOneChoice);
							}
						}
						
						//attach the picture matching the data attr for the current pick
							//for the length of the rps object keys, if key matches data ref object of the player  pick, DOM print the pic
						
						
					} else if (gameObj.plyrTurn === 2) {
						// 
						gameObj.plyrTwoChoice = $(this).closest("a").data("rps")
						// debugger;
						database.ref("players").child("2").update({
							choice: gameObj.plyrTwoChoice 
						})
						gameObj.turn = 1
			
						database.ref().update({
							turn:gameObj.turn
						})
						gameObj.plyrTwoClone = $(".playerTwo").find(".col-lg-4").clone();
						gameObj.plyrTwoDtch = $(".playerTwo").find(".col-lg-4").detach();
						for (var i in gameObj.rpsObj) {
							// temp = Object.keys(gameObj.rpsObj)
							if (gameObj.plyrTwoChoice === i) {
								$("div.playerTwo").prepend("<a href='#!'>");
								$(".playerTwo").find("a").append(this).attr("data-rps", gameObj.plyrTwoChoice);
							}
						}
						
						
					}
					//on click, log the rps data
					//set choice to a local variable
					//if the player is one, send to the 1 node

					//else send to 2 node

					//html the a tag with the matching data attribute

					// debugger;
					var round = database.ref().on("value", function(snapshot) {
						// debugger;

						if (snapshot.child("players").child("1").child("choice").exists() && snapshot.child("players").child("2").child("choice").exists()) {
							// debugger;
							gameObj.plyrOneChoice = snapshot.child("players").child("1").val().choice;
							gameObj.plyrTwoChoice = snapshot.child("players").child("2").val().choice;
							console.log(snapshot.child("players").child("1").val().choice)
							console.log(snapshot.child("players").child("2").val().choice)
							// debugger;
							database.ref().off("value", round)

							gameObj.gameRound();

						
						}
					});
				})
				//display a game message
			},

			yourTurn: function () {
				//needs to run once per turn (after each button click)
				//and doesn't need to be triggered until AFTER choices have bee made on the first round

				//gamelogic updates the player divs at the start of the game(or when new player comes online). need to update both players after a game begins
				
				database.ref().on("value", function(snapshot) {
					// debugger;
					//if it's your turn and there are choices to make
					$("div.game").empty();
					$("h2.text-center").remove();
					$(".temp").remove();

					if (snapshot.val().turn === gameObj.plyrTurn) { 
	
							$(".gameMsgOne").empty();

							
							$("h3.gameMsg").after("<h3 class='gameMsgOne text-center'>" + "It's your turn.")
							
							//needs to link back to the rps click function 

								if (gameObj.plyrTurn === 1) {
									// $(".playerOne").find("a").remove();

									$("div.playerOne").prepend("<a href='#!'>");
									$("div.panel-body").find("a").eq(0).addClass("rock").attr("data-rps","rock").append(gameObj.rpsObj.rock[0])
									$("div.playerOne").prepend("<a href='#!'>");
									$("div.panel-body").find("a").eq(0).addClass("paper").attr("data-rps","paper").append(gameObj.rpsObj.paper[0])
									$("div.playerOne").prepend("<a href='#!'>");
									$("div.playerOne").find("a").eq(0).addClass("scissors").attr("data-rps","scissors").append(gameObj.rpsObj.scissors[0]);
									


									$("div.panel-body").find("img").addClass("img-responsive center-block");
									$("div.panel-body").find("a").addClass("float").wrap("<div class='col-lg-4 col-md-4 col-sm-6 col-xs-6'>")
									$("a.rock").parent().addClass("col-lg-offset-2 col-md-offset-2 col-sm-offset-3 col-xs-offset-3");
									return
									
								} else if (gameObj.plyrTurn === 2) { 
									// 
									// $(".playerOne").find("a").remove();

									$("div.playerTwo").prepend("<a href='#!'>");
									$("div.panel-body").find("a").eq(0).addClass("rock").attr("data-rps","rock").append(gameObj.rpsObj.rock[1])
									$("div.playerTwo").prepend("<a href='#!'>");
									$("div.panel-body").find("a").eq(0).addClass("paper").attr("data-rps","paper").append(gameObj.rpsObj.paper[1])
									$("div.playerTwo").prepend("<a href='#!'>");
									$("div.playerTwo").find("a").eq(0).addClass("scissors").attr("data-rps","scissors").append(gameObj.rpsObj.scissors[1]);
									

									
									$("div.panel-body").find("img").addClass("img-responsive center-block");
									$("div.panel-body").find("a").addClass("float").wrap("<div class='col-lg-4 col-md-4 col-sm-6 col-xs-6'>")
									$("a.rock").parent().addClass("col-sm-offset-3 col-xs-offset-3");
									return
												
								} 
							//focus on re-using code  
						
				
					}	else { 
						$(".gameMsgOne").empty();
						
						$("h3.gameMsg").after("<h3 class='gameMsgOne text-center'>" + "Waiting for your opponent.")
					}

				});
					
				//event listener, if it's your turn, once per turn value change, run the gameStartLogic function

				//on child changed match turn to dataref and player key when updating data
				//then change turn again and trigger the next round function 
			},
			gameRound: function () {

				gameObj.resultsRnd = {
						tie: $("<h2 class='resultsRnd text-center'> TIE </h2>"), 
						playerOne: $("<h2 class='resultsRnd text-center'>" + gameObj.playerOne + " WINS</h2>"),
						playerTwo: $("<h2 class='resultsRnd text-center'>" + gameObj.playerTwo + " WINS</h2>")
						};

				
				// debugger;
					if (gameObj.plyrOneChoice !== "" && gameObj.plyrTwoChoice !== "") { 

						//grabs all of second player's icons instead of the one displaying
							var draw = database.ref().on("value", function (snapshot) {
								debugger;
								// var tempOne = $("div.playerOne").find("a").detach();
								$("div.playerOne").find("a").addClass("temp");
								$("div.playerOne").find("a").after("<h2 class='text-center'>" + gameObj.plyrOneChoice);
							
								// var tempTwo = $("div.playerTwo").find("a").detach();
								$("div.playerTwo").find("a").addClass("temp");
								$("div.playerTwo").find("a").after("<h2 class='text-center'>" + gameObj.plyrTwoChoice);
								
								// database.ref().off("value", draw)
							});

						//at each key in the object, display image 0 if it matches the current val

						// tempTwo = $(".playerTwo").find("a").detach();

						// $(".playerOne").prepend(tempOne);
						// $(".playerTwo").prepend(tempTwo);

					
						//
						if (gameObj.plyrOneChoice === gameObj.plyrTwoChoice) {
							
							gameObj.ties++
							var updateTie = database.ref().on("value", function (snapshot) {
								$("div.game").append(gameObj.resultsRnd.tie)
								database.ref().off("value", updateTie)
							});
							database.ref("players").child("1").update({
								ties:gameObj.ties
							})

							database.ref("players").child("2").update({
								ties:gameObj.ties
							})
							
				
						} else if ( gameObj.plyrOneChoice === "rock" && gameObj.plyrTwoChoice ==="scissors" 
									||
									gameObj.plyrOneChoice === "paper" && gameObj.plyrTwoChoice ==="rock"
									||
									gameObj.plyrOneChoice === "scissors" && gameObj.plyrTwoChoice ==="paper" ) {
								
								gameObj.plyrOneWins++;
								gameObj.plyrTwoLosses++;

							var updateWin = database.ref().on("value", function (snapshot) {
								$("div.game").append(gameObj.resultsRnd.playerOne)
								database.ref().off("value", updateWin)
							});

								database.ref("players").child("1").update({
									wins:gameObj.plyrOneWins
								})

								database.ref("players").child("2").update({
									losses:gameObj.plyrTwoLosses
								})

						} else if ( gameObj.plyrTwoChoice === "rock" && gameObj.plyrOneChoice ==="scissors" 
									||
									gameObj.plyrTwoChoice === "paper" && gameObj.plyrOneChoice ==="rock"
									||
									gameObj.plyrTwoChoice === "scissors" && gameObj.plyrOneChoice ==="paper" ) {
								
								gameObj.plyrTwoWins++;
								gameObj.plyrOneLosses++;

								updateWin = database.ref().on("value", function (snapshot) {
									$("div.game").append(gameObj.resultsRnd.playerTwo)
									database.ref().off("value", updateWin)
								});

								database.ref("players").child("1").update({
									ties:gameObj.plyrTwoWins
								})

								database.ref("players").child("2").update({
									ties:gameObj.plyrOneLosses
								})
						}
						//do for all
							database.ref("players").child("1").child("choice").remove()
							database.ref("players").child("2").child("choice").remove()

						var updateOne = $("div.playerOne").find("div.results")
							updateOne.find("p.wins").text("Wins: " + gameObj.plyrOneWins)
							updateOne.find("p.losses").text("Losses: " + gameObj.plyrOneLosses)
							updateOne.find("p.ties").text("Ties: " + gameObj.ties)

						var updateTwo = $("div.playerTwo").find("div.results")
							updateTwo.find("p.wins").text("Wins: " + gameObj.plyrTwoWins)
							updateTwo.find("p.losses").text("Losses: " + gameObj.plyrTwoLosses)
							updateTwo.find("p.ties").text("Ties: " + gameObj.ties)
						


					};

					//set timeout 5 seconds, then run the yourTurn function to re-populate the game. 
					gameObj.nextRound = setTimeout(gameObj.yourTurn, 1000 * 5);

			}


		}

$(document).ready(function() {
	
	$("#add-Player").one("click", gameObj.selectPlayers);
	gameObj.displayPlayers();
	gameObj.rpsClick();
	gameObj.yourTurn();
	// gameObj.gameRound();
});

//game functions
	//html do something function
	//firebase update function
	//html do something function
		//etc 


//player data logged to firebase
	//detach game objects, stored to local variable
	//reattach them when it's their turn again. 


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

  		//animation icons transition onto screen (pop)
  		//if win, highlight box of winner, do animation
  		//

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
