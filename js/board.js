//this file sets up the game board, we check to see if the namespace already exists already so we don't override another one. If it does not
//then we create a new object and give the module a class that encompasses our board in an IEFF. ALl the contents of our board class are 
//returned to BubbleShoot.Board after it has run and that is our interface to work with the class.
var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Board = (function($){
    var NUM_ROWS = 9;
    var NUM_COLS = 32;
    var Board = function(){
        var that = this;
        var rows = createLayout();
        //check to see our row situation
        this.getRows = function(){ 
            return rows;
        };
        this.isEmpty = function (){
            return this.getBubbles().length === 0;
        };
        //we add bubbles to each row depending on the situation with the current board
        this.addBubble = function(bubble,coords){
            var rowNum = Math.floor(coords.y / BubbleShoot.ui.ROW_HEIGHT);
            var colNum = coords.x / BubbleShoot.ui.BUBBLE_DIMS * 2;
            if(rowNum % 2 === 1){
                colNum -= 1;
            }
            colNum = Math.round(colNum/2) * 2;
            if(rowNum % 2 === 0){
                colNum -= 1;
            }
            if(!rows[rowNum]){
                rows[rowNum] = [];
            }
            rows[rowNum][colNum] = bubble;
            bubble.setRow(rowNum);
            bubble.setCol(colNum);
        };
        //this will return the rowNum and colNum for each bubble
        this.getBubbleAt = function(rowNum,colNum){
            if(!this.getRows()[rowNum])
                return null;
            return this.getRows()[rowNum][colNum];
        };
        //the lets us get the bubbles around the bubble our shot bubble collided with, so that we can remove a group of the same type
        //if there are three or more together. We do this by looking at the row above and below the row we are currently on.
        this.getBubblesAround = function(curRow,curCol){
            var bubbles = [];
            for(var rowNum = curRow - 1;rowNum <= curRow+1; rowNum++){
                for(var colNum = curCol-2; colNum <= curCol+2; colNum++){
                    var bubbleAt = that.getBubbleAt(rowNum,colNum);
                    if(bubbleAt && !(colNum == curCol && rowNum == curRow))
                        bubbles.push(bubbleAt);
                }
            }
            return bubbles;
        };
        //gets our group of bubbles
        this.getGroup = function(bubble,found,differentColor){
            var curRow = bubble.getRow();
            if(!found[curRow])
                found[curRow] = {};
            if(!found.list)
                found.list = [];
            if(found[curRow][bubble.getCol()]){
                return found;
            }
            found[curRow][bubble.getCol()] = bubble;
            found.list.push(bubble);
            var curCol = bubble.getCol();
            var surrounding = that.getBubblesAround(curRow,curCol);
            for(var i=0;i<surrounding.length;i++){
                var bubbleAt = surrounding[i];
                if(bubbleAt.getType() == bubble.getType() || differentColor){
                    found = that.getGroup(bubbleAt,found,differentColor);
                }
            }
            return found;
        };
        //remove a particular bubble
        this.popBubbleAt = function(rowNum,colNum){
            var row = rows[rowNum];
            delete row[colNum];
        };
        //get any orphans on the screen and remove them.
        this.findOrphans = function(){
            var connected = [];
            var groups = [];
            var rows = that.getRows();
            for(var i=0;i<rows.length;i++){
                connected[i] = [];
            }
            for(var i=0;i<rows[0].length;i++){
                var bubble = that.getBubbleAt(0,i);
                if(bubble && !connected[0][i]){
                    var group = that.getGroup(bubble,{},true);
                    $.each(group.list,function(){
                        connected[this.getRow()][this.getCol()] = true;
                    });
                }
            }
            var orphaned = [];
            for(var i=0;i<rows.length;i++){
                for(var j=0;j<rows[i].length;j++){
                    var bubble = that.getBubbleAt(i,j);
                    if(bubble && !connected[i][j]){
                        orphaned.push(bubble);
                    }
                }
            }
            return orphaned;
        };
        //use this to get all the bubbles on the board but going through each row and collumn and then pushing into a bubbles array.
        this.getBubbles = function (){
            var bubbles = [];
            var rows = this.getRows();
            for(var i = 0; i < rows.length; i++){
                var row = rows[i];
                for(var j = 0; j < row.length; j++){
                    var bubble = row[j];
                    if(bubble){
                        bubbles.push(bubble);
                    }
                }
            }
            return bubbles;
        };
        return this;
    };

    //this creates our game layout based on the rows and columns we created with the constants above. 
    var createLayout = function(){
        var rows = [];
        for(var i=0;i<NUM_ROWS;i++){
            var row = [];
            var startCol = i%2 == 0 ? 1 : 0;
            for(var j=startCol;j<NUM_COLS;j+=2){
                var bubble = BubbleShoot.Bubble.create(i,j);
                bubble.setState(BubbleShoot.BubbleState.ON_BOARD);
                if(BubbleShoot.Renderer){
                    var left = j * BubbleShoot.ui.BUBBLE_DIMS/2;
                    var top = i * BubbleShoot.ui.ROW_HEIGHT;
                    bubble.getSprite().setPosition({
                        left : left,
                        top : top
                    });
                }
                row[j] = bubble;
            }
            rows.push(row);
        }
        return rows;
    };
    return Board;
})(jQuery);