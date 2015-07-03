function getInstructions (){
    $("#instructions").html("<p id='notice'>Use your mouse to direct and shoot a bubble. Connect three or more bubbles of the same color to pop that group. Pop all the bubbles and move onto the next level!</p>");
}

var instructions = document.getElementById("start");
instructions.addEventListener('click', getInstructions, false);