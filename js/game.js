var BubbleShoot = window.BubbleShoot || {};
    //this function creates an IIEF and runs everything inside of its code block when called. It is created, ran, and then destroyed, but will
    //return the Game objects results before doing so. We can access the game class as BubbleShoot.Game. BubblesShoot.Game creates our module
    //and is the interface for how we interact Game class inside the module. 
BubbleShoot.Game = (function($){
    //we create a class called Game inside of our module. We can access this module from the outside through BubbleShoot.Game. This
    //namespace avoids any naming conflicts with outside libraries or other classes that we create.
    var Game = function(){
        var curBubble;
        var board;
        var numBubbles;
        var bubbles = [];
        var MAX_BUBBLES = 70;
        var requestAnimationID;
        var POINTS_PER_BUBBLE = 50;
        var MAX_ROWS = 11;
        var level = 0;
        var score = 0;
        var highScore = 0;
        //when the page has loaded we create a new BubbleShoot.Game and we call this public init function, which displays our play game button
        //we use local storage to keep track of the high score accross multiple browser sessions
        this.init = function(){
            if(BubbleShoot.Renderer){
                BubbleShoot.Renderer.init(function(){
                    $(".but_start_game").click("click",startGame);
                });
            }else{
                $(".but_start_game").click("click",startGame);
            }
            if(window.localStorage && localStorage.getItem("high_score")){
                highScore = parseInt(localStorage.getItem("high_score"));
            }
            BubbleShoot.ui.drawHighScore(highScore);
        };
        //when they click start game, we bind this function to the click and run this code, this is a private variable. This funciton
        //is a closure and can be called even after the IIEF has been returned. 
        var startGame = function(){
            $(".but_start_game").unbind("click");
            numBubbles = MAX_BUBBLES - level * 5;
            BubbleShoot.ui.hideDialog();
            board = new BubbleShoot.Board();
            bubbles = board.getBubbles();
            curBubble = getNextBubble();
            // $("#instructions").html("Please fire.");
            if(BubbleShoot.Renderer)
            {
                if(!requestAnimationID)
                    //this is removed from the code below once we set up the polyfill and start using AnimationFrame 
                    //setTimeout(renderFrame,40);
                    requestAnimationID = requestAnimationFrame(renderFrame);
            }else{
                BubbleShoot.ui.drawBoard(board);
            }
            $("#game").bind("click",clickGameScreen);
            BubbleShoot.ui.drawScore(score);
            BubbleShoot.ui.drawLevel(level);
        };
        //this private method gives us our next bubble after one has been created
        var getNextBubble = function(){
            var bubble = BubbleShoot.Bubble.create();
            bubbles.push(bubble);
            bubble.setState(BubbleShoot.BubbleState.CURRENT);
            bubble.getSprite().addClass("cur_bubble");
            var top = 470;
            var left = ($("#board").width() - BubbleShoot.ui.BUBBLE_DIMS)/2;
            bubble.getSprite().css({
                top : top,
                left : left
            });
            $("#board").append(bubble.getSprite());
            BubbleShoot.ui.drawBubblesRemaining(numBubbles);
            numBubbles--;
            return bubble;
        };
        //this is where all thea activity with the game happends, we track the click event passed into the function,
        //and use the collision detection logic to check for a hit, whether we should pop a group of three or more bubbles,
        //and wheather we should pop the last 5 remaining bubbles to complete the level, we also drop any orphan bubbles
        //if they are not attached to another bubble.
        var clickGameScreen = function(e){
            var angle = BubbleShoot.ui.getBubbleAngle(curBubble.getSprite(),e);
            var duration = 750;
            var distance = 1000;
            var collision = BubbleShoot.CollisionDetector.findIntersection(curBubble,
                board,angle);
            if(collision){
                var coords = collision.coords;
                duration = Math.round(duration * collision.distToCollision / distance);
                board.addBubble(curBubble,coords);
                var group = board.getGroup(curBubble,{});
                if(group.list.length >= 3){
                    $("#feedback").html("<h3>Nice Shot!</h3>").fadeIn(600).fadeOut(600);
                    popBubbles(group.list, duration);
                    var topRow = board.getRows()[0];
                    var topRowBubbles = [];
                    for(var i=0;i<topRow.length;i++){
                        if(topRow[i])
                            topRowBubbles.push(topRow[i]);
                    }
                    if(topRowBubbles.length <= 5){
                        popBubbles(topRowBubbles,duration);
                        group.list.concat(topRowBubbles);
                    }
                    var orphans = board.findOrphans();
                    var delay = duration + 200 + 30 * group.list.length;
                    dropBubbles(orphans,delay);
                    var popped = [].concat(group.list, orphans);
                    var points = popped.length * POINTS_PER_BUBBLE;
                    score += points;
                    setTimeout(function (){
                        BubbleShoot.ui.drawScore(score);
                    }, delay);
                }
            }else{
                var distX = Math.sin(angle) * distance;
                var distY = Math.cos(angle) * distance;
                var bubbleCoords = BubbleShoot.ui.getBubbleCoords(curBubble.getSprite());
                var coords = {
                    x : bubbleCoords.left + distX,
                    y : bubbleCoords.top - distY
                };
            }
            BubbleShoot.ui.fireBubble(curBubble,coords,duration);
            if(board.getRows().length > MAX_ROWS){
                endGame(false);
            } else if(numBubbles === 0){
                endGame(false);
            } else if(board.isEmpty()){
                endGame(true);
            } else {
                curBubble = getNextBubble(board);
            }
        };
        //we pop bubles here, using jQuery's $.each method to run through the array of bubbles and changing the state of each
        //to affect the sprite we see on the screen. The mp3 file plays the popping sound on the screen
        var popBubbles = function(bubbles,delay){
            $.each(bubbles,function(){
                var bubble = this;
                setTimeout(function(){
                    bubble.setState(BubbleShoot.BubbleState.POPPING);
                    bubble.animatePop();
                    setTimeout(function(){
                        bubble.setState(BubbleShoot.BubbleState.POPPED);
                    },200);
                    BubbleShoot.Sounds.play("mp3/pop.mp3", Math.random() * .5 + .5);
                },delay);
                board.popBubbleAt(this.getRow(),this.getCol());
                setTimeout(function(){
                    bubble.getSprite().remove();
                },delay + 200);
                delay += 60;
            });
        };
        //this drops bubbles once they have been orphaned
        var dropBubbles = function(bubbles,delay){
            $.each(bubbles,function(){
                var bubble = this;
                board.popBubbleAt(bubble.getRow(),bubble.getCol());
                setTimeout(function(){
                    bubble.setState(BubbleShoot.BubbleState.FALLING);
                    bubble.getSprite().kaboom({
                        callback : function(){
                            bubble.getSprite().remove();
                            bubble.setState(BubbleShoot.BubbleState.FALLEN);
                        }
                    });
                },delay);
            });
        };
        //this shows each frame by working with the sprite
        var renderFrame = function(){
            $.each(bubbles,function(){
                if(this.getSprite().updateFrame)
                    this.getSprite().updateFrame();
            });
            BubbleShoot.Renderer.render(bubbles);
            //code changed from below once started using AnimationFrame - setTimeout(renderFrame,40);
            requestAnimationID = requestAnimationFrame(renderFrame);
        };
        //this determines the actions to take if the player winning the level is true or false, and if a new high score has been
        //achieved. We use local storage so the high score persists across browser sessions
        var endGame = function (hasWon){
            if(score > highScore){
                highScore = score;
                $("#new_high_score").show();
                BubbleShoot.ui.drawHighScore(highScore);
                if(window.localStorage){
                    localStorage.setItem("high_score", highScore);
                }
            } else {
                $("#new_high_score").hide();
            }
            if(hasWon){
                level++;
            } else {
                // score = 0;
                level = 0;
            }
            $(".but_start_game").click("click", startGame);
            $("#board .bubble").remove();
            BubbleShoot.ui.endGame(hasWon, score);
        };
    };
    //render frame can give us a smoother, more cross browser visual appeal, here we check to see if the browser supports it. If not
    //then we use the setTimeout Function 
    window.requestAnimationFrame = Modernizr.prefixed("requestAnimationFrame",
        window) || function(callback){
        window.setTimeout(function(){
            callback();
        }, 40);
    };
    return Game;
})(jQuery);