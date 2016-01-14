$(document).ready(function() {
  var power = false,
    playerTurn = true,
    strict = false,
    turnCount = 0,
    movesArr = [],
    inputArr = [];

  var simon = {
    animate: {
      div0: function(distance, speed) {
        $("#div-0").animate({
            "left": "-=" + distance + "px",
            "top": "-=" + distance + "px"
          }, speed)
          .animate({
            "left": "+=" + distance + "px",
            "top": "+=" + distance + "px"
          }, speed);
      },
      div1: function(distance, speed) {
        $("#div-1").animate({
            "right": "-=" + distance + "px",
            "top": "-=" + distance + "px"
          }, speed)
          .animate({
            "right": "+=" + distance + "px",
            "top": "+=" + distance + "px"
          }, speed);
      },
      div2: function(distance, speed) {
        $("#div-2").animate({
            "left": "-=" + distance + "px",
            "bottom": "-=" + distance + "px"
          }, speed)
          .animate({
            "left": "+=" + distance + "px",
            "bottom": "+=" + distance + "px"
          }, speed);
      },
      div3: function(distance, speed) {
        $("#div-3").animate({
            "right": "-=" + distance + "px",
            "bottom": "-=" + distance + "px"
          }, speed)
          .animate({
            "right": "+=" + distance + "px",
            "bottom": "+=" + distance + "px"
          }, speed);
      },
      all: function(distance, speed) {
        simon.animate.div0(distance, speed);
        simon.animate.div1(distance, speed);
        simon.animate.div2(distance, speed);
        simon.animate.div3(distance, speed);
      },
      mistake: function(distance, speed) {
        simon.animate.all(10, 80);
        simon.animate.all(6, 80);
        simon.animate.all(10, 80);
      },
      init: function() {
        simon.animate.div0(30, 300);
        setTimeout(function() {
          simon.animate.div1(30, 300);
          setTimeout(function() {
            simon.animate.div3(30, 300);
            setTimeout(function() {
              simon.animate.div2(30, 300);
            }, 250)
          }, 250)
        }, 250)
      },
      init2: function() {
        simon.animate.div0(20, 300);
        simon.animate.div3(20, 300);
        setTimeout(function() {
          simon.animate.div1(20, 300);
          simon.animate.div2(20, 300);
          /*setTimeout(function() {
            simon.animate.all(20, 300);
          }, 650)*/
        }, 650)
      },
      moves: function() {
        playerTurn = false;

        var t = 600;
        if (turnCount >= 5 && turnCount < 9) t = 500;
        else if (turnCount < 13) t = 400;
        else if (turnCount >= 13) t = 300;

        for (var i = 0; i < movesArr.length; i++) {
          simon.animate.movesSoundDelay(i, t);
        }
      },
      movesSoundDelay: function(i, t) {
        setTimeout(function() {
          simon.animate["div" + movesArr[i]](60, t);
          simon.sound["div" + movesArr[i]]();
          if (i == movesArr.length - 1) {
            playerTurn = true;
            inputArr = [];
          }
        }, 2 * t + (2 * t * i))
      }
    },
    sound: {
      div0: function() {
        var audio0 = document.createElement('audio');
        audio0.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
        audio0.play();
      },
      div1: function() {
        var audio1 = document.createElement('audio');
        audio1.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
        audio1.play();
      },
      div2: function() {
        var audio2 = document.createElement('audio');
        audio2.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
        audio2.play();
      },
      div3: function() {
        var audio3 = document.createElement('audio');
        audio3.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
        audio3.play();
      },
      mistake: function() {
        simon.sound.div0();
        simon.sound.div1();
      }
    },
    init: function() {
      $("#center-circle").css("box-shadow", "0 0 120px red");
      $("#turnDisp").css("text-shadow", "0 0 4px red").text("0");
      $("#pOn").css("text-shadow", "0 0 4px red");
      $("#pOff").css("text-shadow", "none");
      simon.animate.init2();
    },
    start: function() {
      turnCount++;
      $("#turnDisp").text(turnCount);
      var ranNum = Math.floor((Math.random() * 4));
      movesArr.push(ranNum);
      simon.animate.moves();
    },
    check: function(div) {
      if (inputArr[inputArr.length - 1] == movesArr[inputArr.length - 1]) {
        simon.animate[div](30, 300)
        simon.sound[div]();
        if (inputArr.length == movesArr.length) {
          
          if (turnCount == 20) {
            //Win animation
            $("#turnDisp").css("font-size", "55px").text("WIN");
            for(var i = 1; i < 15; i++) {
              simon.animate.all(7*i, 200);
            }
            setTimeout(function(){
              simon.reset();
              simon.start();
            }, 4000 )
          } else {
            setTimeout(function() {
              simon.start();
            }, 1300);
          }
  
        }
      } else {
        simon.animate.mistake();
        simon.sound.mistake();
        if(strict) {
          setTimeout(function(){
            simon.reset(); 
            simon.init();
            setTimeout(function(){
              simon.start();  
            }, 1500);
          }, 500);
        } else {
          setTimeout(function(){
            simon.animate.moves();
          }, 500);
        }
      }
    },
    reset: function() {
      $("#center-circle").css("box-shadow", "none");
      $("#turnDisp").text("--").css("text-shadow", "none");
      $("#pOn").css("text-shadow", "none");
      $("#pOff").css("text-shadow", "0 0 4px red");
      $("#strict").css("text-shadow", "none")
      turnCount = 0,
      movesArr = [],
      inputArr = [];
    }
  }

  simon.animate.init();

  $("#power").click(function() {
    if (!power) {
      power = true;
      simon.init();
    } else {
      power = false;
      simon.reset();
    }
  });
  $("#start").click(function() {
    if (power) { 
      if (movesArr.length == 0) simon.start();
    }
  });
  $("#strict").click(function() {
    if (power) {
      if (!strict) {
        strict = true;
        $("#strict").css("text-shadow", "0 0 4px red")
      } else {
        strict = false;
        $("#strict").css("text-shadow", "none")
      }

    }
  });
  $("#div-0").click(function() {
    if (playerTurn) {
      inputArr.push(0);
      simon.check("div0");
    }
  });
  $("#div-1").click(function() {
    if (playerTurn) {
      inputArr.push(1);
      simon.check("div1");
    }
  });
  $("#div-2").click(function() {
    if (playerTurn) {
      inputArr.push(2);
      simon.check("div2");
    }
  });
  $("#div-3").click(function() {
    if (playerTurn) {
      inputArr.push(3);
      simon.check("div3");
    }
  });
});