var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.ui = (function($){
    var ui = {
        BUBBLE_DIMS: 44,
        ROW_HEIGHT: 40,
        init: function(){
        },
        hideDialog: function(){
            $(".dialog").fadeOut(300);
        },
        //we get the mouse coords and the bubbles coords to use in our calculations
        getMouseCoords: function(event){
            var coords = {x : event.pageX, y : event.pageY};
            return coords;
        },
        getBubbleCoords : function(bubble){
            var bubbleCoords = bubble.position();
            bubbleCoords.left += ui.BUBBLE_DIMS/2;
            bubbleCoords.top += ui.BUBBLE_DIMS/2;
            return bubbleCoords;
        },
        //this gets the angles when the mouse is clicked by the user
        getBubbleAngle: function(bubble,e){
            var mouseCoords = ui.getMouseCoords(e);
            var bubbleCoords = ui.getBubbleCoords(bubble);
            var gameCoords = $("#game").position();
            var boardLeft = 120;
            var angle = Math.atan((mouseCoords.x - bubbleCoords.left - boardLeft) / (bubbleCoords.top + gameCoords.top - mouseCoords.y));
            if(mouseCoords.y > bubbleCoords.top + gameCoords.top){
                angle += Math.PI;
            }
            return angle;
        },
        //this shows the user the message after the game based on the outcome
       endGame : function(hasWon,score){
            $("#game").unbind("click");
            $("#game").unbind("mousemove");
            BubbleShoot.ui.drawBubblesRemaining(0);
            if(hasWon){
                $(".level_complete").show();
                $(".level_failed").hide();
            }else{
                $(".level_complete").hide();
                $(".level_failed").show();
            };
            $("#end_game").fadeIn(500);
            $("#final_score_value").text(score);
        },
        //the next three functions show the score, highscore, and level in the upper bar.
        drawScore: function (score){
            $("#score").text(score);
        },
        drawHighScore: function (highScore){
            $("#high_score").text(highScore);
        },
        drawLevel: function (level){
            $("#level").text(level + 1);
        },
        //this gets the information about the fired buble and also displays it as it is moving
        fireBubble: function(bubble,coords,duration){
            bubble.setState(BubbleShoot.BubbleState.FIRING);
            var complete = function(){
                if(bubble.getRow() !== null){
                    bubble.getSprite().css(Modernizr.prefixed("transition"),"");
                    bubble.getSprite().css({
                        left : bubble.getCoords().left - ui.BUBBLE_DIMS/2,
                        top : bubble.getCoords().top - ui.BUBBLE_DIMS/2
                    });
                    bubble.setState(BubbleShoot.BubbleState.ON_BOARD);
                } else {
                    bubble.setState(BubbleShoot.BubbleState.FIRED);
                }
            };
            if(Modernizr.csstransitions && !BubbleShoot.Renderer){
                bubble.getSprite().css(Modernizr.prefixed("transition"),"all " +
                (duration/1000) + "s linear");
                bubble.getSprite().css({
                    left : coords.x - ui.BUBBLE_DIMS/2,
                    top : coords.y - ui.BUBBLE_DIMS/2
                });
                setTimeout(complete,duration);
            }else{
            bubble.getSprite().animate({
                        left : coords.x - ui.BUBBLE_DIMS/2,
                        top : coords.y - ui.BUBBLE_DIMS/2
                    },
                    {
                        duration : duration,
                        easing : "linear",
                        complete : complete
                    });
            }
        },
        //this draws the board you see on the screen based on the rows and columns specified above as constants
        drawBoard: function(board){
            var rows = board.getRows();
            var gameArea = $("#board");
            for(var i=0;i<rows.length;i++){
                var row = rows[i];
                for(var j=0;j<row.length;j++){
                    var bubble = row[j];
                    if(bubble){
                        var sprite= bubble.getSprite();
                        gameArea.append(sprite);
                        var left = j * ui.BUBBLE_DIMS/2;
                        var top = i * ui.ROW_HEIGHT;
                        sprite.css({
                            left : left,
                            top : top
                        });
                    }
                }
            }
        },
        drawBubblesRemaining: function(numBubbles){
            $("#bubbles_remaining").text(numBubbles);
        }
    };
    return ui;
})(jQuery);







