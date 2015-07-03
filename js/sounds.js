var BubbleShoot = window.BubbleShoot || {};
//this module specifies the sound to play when each bubble is popped. We store the sound 10 times in an array and then play the 
//sound from the play method in the Sounds object. We first check to see if the browser supports audio by using Modernizr.
BubbleShoot.Sounds = (function (){
    var soundObjects = [];
    for(var i = 0; i < 10; i++){
        soundObjects.push(new Audio());
    }
    var curSoundNum = 0;
    var Sounds = {
        play: function(url, volume){
            if(Modernizr.audio){
                var sound = soundObjects[curSoundNum];
                sound.src = url;
                sound.volue = volume;
                sound.play();
                curSoundNum++;
                if(curSoundNum >= soundObjects.length){
                    curSoundNum = curSoundNum % soundObjects.length;
                }
            }
        }
    };
    return Sounds;
})();