  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDYhzHzvm2hH-actE7obqJ52MoXjs7Mzlc",
    authDomain: "rps2-f4bcc.firebaseapp.com",
    databaseURL: "https://rps2-f4bcc.firebaseio.com",
    projectId: "rps2-f4bcc",
    storageBucket: "rps2-f4bcc.appspot.com",
    messagingSenderId: "126481600490"
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

database.ref().on("value", function(snapshot) {
  database.ref("players").child("1").onDisconnect().remove();
  database.ref("players").child("2").onDisconnect().remove();
});
database.ref().on("value", function(snapshot) {
  if (snapshot.child("players").exists() === false) { 
    database.ref("turn").onDisconnect().remove();

  }
});

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
        //on click, assign the input either player1 or player2 variable in game
        event.preventDefault();

        playerName = $("#addPlayer").val().trim().toUpperCase();

        console.log(playerName);
    
        database.ref().once("value", function(snapshot) {
          
          if (snapshot.child("/players/1").exists() === false) {
            database.ref("/players/1").set({
              playerName: playerName,
                wins:0,
                losses:0,
                ties:0
            })
            gameObj.plyrTurn = 1
         
          } else if (snapshot.child("/players/2").exists() === false) {
            database.ref("/players/2").set({
              playerName: playerName,
                wins:0,
                losses:0,
                ties:0
            })
            gameObj.plyrTurn = 2
          } else if (snapshot.child("/players/2").exists() && snapshot.child("/players/1").exists()) { 
              return $("#form1").replaceWith("<h3 class='gameMsg text-center'>Game in progress.")
          }

          gameObj.displayGameMsg();
      
        });

      },
      displayPlayers: function () {
        database.ref().on("value", function (snapshot) {
         
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

      gameStartLogic: function () {
      
        //if there are no choices to make
        if (gameObj.gameReady === false) {
          
          database.ref().update({
              turn:gameObj.turn
            })
          gameObj.gameReady = true;
          if (gameObj.turn === gameObj.plyrTurn) { 

            if (gameObj.plyrTurn === 1) {
              if(!$("h3").hasClass("gameMsgOne")) {
                $(".gameMsgOne").empty();
                
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
          } 
        }
        

      },
      rpsClick: function() {
        //on click, log selection to firebase
        $("body").on("click","img",function () {
          event.preventDefault()
          

          if (gameObj.plyrTurn === 1) { 
            
            gameObj.plyrOneChoice = $(this).closest("a").data("rps")
            database.ref("players").child("1").update({
              choice: gameObj.plyrOneChoice 
            })
            
            gameObj.turn = 2
            
            database.ref().update({
              turn:gameObj.turn
            })

            gameObj.plyrOneClone = $(".playerOne").find(".col-lg-4").clone();
            gameObj.plyrOneDtch = $(".playerOne").find(".col-lg-4").detach();
            for (var i in gameObj.rpsObj) {
            
              if (gameObj.plyrOneChoice === i) {
                $("div.playerOne").prepend("<a href='#!'>");
                 $(".playerOne").find("a").append(this).attr("data-rps", gameObj.plyrOneChoice);
              }
            }
            
          } else if (gameObj.plyrTurn === 2) {
            
            gameObj.plyrTwoChoice = $(this).closest("a").data("rps")
            
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
      
              if (gameObj.plyrTwoChoice === i) {
                $("div.playerTwo").prepend("<a href='#!'>");
                $(".playerTwo").find("a").append(this).attr("data-rps", gameObj.plyrTwoChoice);
              }
            }    
          }

          var round = database.ref().on("value", function(snapshot) {

            if (snapshot.child("players").child("1").child("choice").exists() && snapshot.child("players").child("2").child("choice").exists()) {
              
              gameObj.plyrOneChoice = snapshot.child("players").child("1").val().choice;
              gameObj.plyrTwoChoice = snapshot.child("players").child("2").val().choice;
              console.log(snapshot.child("players").child("1").val().choice)
              console.log(snapshot.child("players").child("2").val().choice)
              
              database.ref().off("value", round)

              gameObj.gameRound();

            }
          });
        })
      },

      yourTurn: function () {
        
        database.ref().on("value", function(snapshot) {
          
          //if it's your turn and there are choices to make
          $("div.game").empty();
          $("h2.text-center").remove();
          $(".temp").remove();

          if (snapshot.val().turn === gameObj.plyrTurn) { 
  
              $(".gameMsgOne").empty();

              $("h3.gameMsg").after("<h3 class='gameMsgOne text-center'>" + "It's your turn.")

                if (gameObj.plyrTurn === 1) {
         
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
          } else { 
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

        
        
          if (gameObj.plyrOneChoice !== "" && gameObj.plyrTwoChoice !== "") { 

            //grabs all of second player's icons instead of the one displaying
              var draw = database.ref().on("value", function (snapshot) {
          
              
                $("div.playerOne").find("a").addClass("temp");
                $("div.playerOne").append("<h2 class='text-center'>" + gameObj.plyrOneChoice);
              
                $("div.playerTwo").find("a").addClass("temp");
                $("div.playerTwo").append("<h2 class='text-center'>" + gameObj.plyrTwoChoice);
                
                //for the length of the rpsobj, if the data-rps matches the name of the obj, and there's no a, add an a
              });

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
});


  //chat
    //track comments based on player name 
    //display message if player disconnects
    //display new name of new player
    //add chat functionality
      //based on intropresence exercise 'connectedRef'
