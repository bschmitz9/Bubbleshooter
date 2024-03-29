var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Sprite = (function($){
    //this sprite object is used to work with the canvas and allows us to do some things
    // with the sprite, or fall back on the setTimeout Function of jQuery if the canvas isn't supported.
    var Sprite = function(){
        var that = this;
        var left;
        var top;
        this.position = function(){
            return {
                left : left,
                top : top
            };
        };
        this.setPosition = function(args){
            if(arguments.length > 1){
                return;
            }
            if(args.left !== null)
                left = args.left;
            if(args.top !== null)
                top = args.top;
        };
        this.css = this.setPosition;
        this.animate = function(destination,config){
            var duration = config.duration;
            var animationStart = Date.now();
            var startPosition = that.position();
            that.updateFrame = function(){
                var elapsed = Date.now() - animationStart;
                var proportion = elapsed/duration;
                if(proportion > 1)
                    proportion = 1;
                var posLeft = startPosition.left + (destination.left - startPosition.
                        left) * proportion;
                var posTop = startPosition.top + (destination.top - startPosition.top)
                    * proportion;
                that.css({
                    left : posLeft,
                    top : posTop
                });
            };
            setTimeout(function(){
                that.updateFrame = null;
                if(config.complete)
                    config.complete();
            },duration);
        };
        return this;
    };
    Sprite.prototype.width = function(){
        return BubbleShoot.ui.BUBBLE_DIMS;
    };
    Sprite.prototype.height = function(){
        return BubbleShoot.ui.BUBBLE_DIMS;
    };
    Sprite.prototype.removeClass = function(){};
    Sprite.prototype.addClass = function(){};
    Sprite.prototype.remove = function(){};
    Sprite.prototype.kaboom = function(){
        jQuery.fn.kaboom.apply(this);
    };
    return Sprite;
})(jQuery);