var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Bubble = (function($){
    //we create an object that stores all of the different states a bubble can be in on the board
    BubbleShoot.BubbleState = {
        CURRENT: 1,
        ON_BOARD: 2,
        FIRING: 3,
        POPPING: 4,
        FALLING: 5,
        POPPED: 6,
        FIRED: 7,
        FALLED: 8
    };
    //we create a bubble class that will allow us to get information about the bubble and what to do with it.
    var Bubble = function(row,col,type,sprite){
        var that = this;
        var state;
        var stateStart = Date.now();
        this.getState = function (){
            return state;
        };
        this.setState = function (stateIn){
            state = stateIn;
            stateStart = Date.now();
        };
        this.getTimeInState = function(){
            return Date.now() - stateStart;
        };
        this.getType = function(){
            return type;
        };
        this.getSprite = function(){
            return sprite;
        };
        this.getCol = function(){
            return col;
        };
        this.setCol = function(colIn){
            col = colIn;
        };
        this.getRow = function(){
            return row;
        };
        this.setRow = function(rowIn){
            row = rowIn;
        };
        //this gets the coordinates of each bubble on the screen
        this.getCoords = function(){
            var coords = {
                left : that.getCol() * BubbleShoot.ui.BUBBLE_DIMS/2 +
                BubbleShoot.ui.BUBBLE_DIMS/2,
                top : that.getRow() * BubbleShoot.ui.ROW_HEIGHT + BubbleShoot.
                    ui.BUBBLE_DIMS/2
            };
            return coords;
        };

        //this gives us our animation of the bubble popping by switching background positions at different tiemout intervals
        this.animatePop = function(){
            var top = type * that.getSprite().height();
            this.getSprite().css(Modernizr.prefixed("transform"),"rotate(" + (Math.
                random() * 360) + "deg)");
            setTimeout(function(){
                that.getSprite().css("background-position","-50px -" + top + "px");
            },125);
            setTimeout(function(){
                that.getSprite().css("background-position","-100px -" + top + "px");
            },150);
            setTimeout(function(){
                that.getSprite().css("background-position","-150px -" + top + "px");
            },175);
            setTimeout(function(){
                that.getSprite().remove();
            },200);
        };
    };
    //we create a bubble here, if the type is undefined (not specified) then we randomly get one from the sprite
      Bubble.create = function(rowNum,colNum,type){
        if(type === undefined){
            type = Math.floor(Math.random() * 4);
        }
        if(!BubbleShoot.Renderer){
            var sprite = $(document.createElement("div"));
            sprite.addClass("bubble");
            sprite.addClass("bubble_" + type);
        }else{
            var sprite = new BubbleShoot.Sprite();
        }
        sprite.addClass("bubble");
        sprite.addClass("bubble_" + type);
        var bubble = new Bubble(rowNum,colNum,type,sprite);
        return bubble;
    };
    return Bubble;
})(jQuery);