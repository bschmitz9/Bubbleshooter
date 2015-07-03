var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Renderer = (function($){
    //this class is created when we want to start working with the canvas
    var canvas;
    var context;
    var spriteSheet;
    var BUBBLE_IMAGE_DIM = 50;
    //our renderer object is returned once BubbleShoot.Renderer has ran. We access the object by BubbleShoot.Renderer.
    var Renderer = {
        init : function(callback){
            canvas = document.createElement("canvas");
            $(canvas).addClass("game_canvas");
            $("#game").prepend(canvas);
            $(canvas).attr("width",$(canvas).width());
            $(canvas).attr("height",$(canvas).height());
            context = canvas.getContext("2d");
            spriteSheet = new Image();
            spriteSheet.src = "img/bubble_sprite_sheet.png";
            spriteSheet.onload = function() {
                callback();
            };
        },
        //we go through each item in the bubbles array and check the state of each item and respond according to the different
        //cases
        render : function(bubbles){
            context.clearRect(0,0,canvas.width,canvas.height);
            context.translate(120,0);
            $.each(bubbles,function(){
                var bubble = this;
                var clip = {
                    top : bubble.getType() * BUBBLE_IMAGE_DIM,
                    left : 0
                };
                    switch(bubble.getState()){
                        case BubbleShoot.BubbleState.POPPING:
                            var timeInState = bubble.getTimeInState();
                            if(timeInState < 80){
                                clip.left = BUBBLE_IMAGE_DIM;
                                }else if(timeInState < 140){
                                clip.left = BUBBLE_IMAGE_DIM*2;
                                }else{
                                clip.left = BUBBLE_IMAGE_DIM*3;
                            };
                            break;
                        case BubbleShoot.BubbleState.POPPED:
                            return;
                        case BubbleShoot.BubbleState.FIRED:
                            return;
                        case BubbleShoot.BubbleState.FALLEN:
                            return;
                    }
                Renderer.drawSprite(bubble.getSprite(),clip);
            });
            context.translate(-120,0);
        },
        //this function draws our sprite onto the page as it is moving
        drawSprite : function(sprite,clip){
            context.translate(sprite.position().left + sprite.width()/2,sprite.
                position().top + sprite.height()/2);
            context.drawImage(spriteSheet,clip.left,clip.top,BUBBLE_IMAGE_DIM,
                BUBBLE_IMAGE_DIM,-sprite.width()/2,-sprite.height()/2,BUBBLE_IMAGE_DIM,
                BUBBLE_IMAGE_DIM);
            context.translate(-sprite.position().left - sprite.width()/2,
                -sprite.position().top - sprite.height()/2);
        }
    };
    return Renderer;
})(jQuery);