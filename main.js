let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 900;
const GAME_HEIGHT = 900;
const GRID_WIDTH = 100;
const GRID_HEIGHT = 100;

var stoneRowCount = 4;
var stoneColumnCount = 4;
var stoneWidth = 100;
var stoneHeight = 100;
var stonePadding = 100;
var stoneOffsetTop = 100;
var stoneOffsetLeft = 100;

var playerOneXposition;
var playerOneYposition;
var playerOneSpeedX;
var playerOneSpeedY;

var playerTwoXposition;
var playerTwoYposition;
var playerTwoSpeedX;
var playerTwoSpeedY;

var players = [];
var playerOneAlive = 1;
var playerTwoAlive = 1;
var checkOne = 1;
var checkTwo = 1;

var bombPlayerOne = [];
var bombPlayerTwo = [];
var explodingArr =[];

let gameTimer;

var stones = [];
for(var c=0; c<stoneColumnCount; c++) {
    stones[c] = [];
    for(var r=0; r<stoneRowCount; r++) {
        stones[c][r] = { x: 0, y: 0, status: 1};
    }
}

var boardRowCount = 9;
var boardColumnCount = 9;
var boardBlockWidth = 100;
var boardBlockHeight = 100;

var allBlocks = [[5, 5, 0, 0, 0, 0, 0, 0, 0],
                 [5, 1, 0, 1, 0, 1, 0, 1, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 1, 0, 1, 0, 1, 0, 1, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 1, 0, 1, 0, 1, 0, 1, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 1, 0, 1, 0, 1, 0, 1, 5],
                 [0, 0, 0, 0, 0, 0, 0, 5, 5]];
/*
for(var c=0; c<boardColumnCount; c++) {
        for(var r=0; r<boardRowCount; r++) {
            if(stones[c][r].status == 1){
            var stoneX = (c*(stoneWidth+stonePadding))+stoneOffsetLeft;
            var stoneY = (r*(stoneHeight+stonePadding))+stoneOffsetTop;
            stones[c][r].x = stoneX;
            stones[c][r].y = stoneY;
            ctx.beginPath();
            ctx.rect(stoneX, stoneY, stoneWidth, stoneHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
                }
            }
         }
*/
class Game {
    constructor(gameWidth, gameHeight,gridWidth,gridHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
    }

    start() {

        this.board = new Background(this);
        this.stoneBlock = new Blocks(this);
        this.playerOne = new BomberMan(this);
        this.playerTwo = new BomberManTwo(this);
                // for (var i = 0 ; i < 1; i++){
                // players.push(new BombMan());
                // }


        this.gameObjects = [
            this.board, this.stoneBlock, this.playerOne, this.playerTwo
            //
        ];


        new InputHandler(this.playerOne);
        new InputHandlerTwo(this.playerTwo);

    }

    update(deltaTime,ctx) {

        this.playerOne.update(deltaTime);
        this.playerTwo.update(deltaTime);

        if(bombPlayerOne.length>0){
            bombPlayerOne.forEach(object => object.update(deltaTime,ctx));
        }

        if(bombPlayerTwo.length>0){
            bombPlayerTwo.forEach(object => object.update(deltaTime,ctx));
        }

    }

    draw(ctx) {

        this.gameObjects.forEach(object => object.draw(ctx));

        if(bombPlayerOne.length > 0){
            bombPlayerOne.forEach(object => object.draw(ctx));
        }
        if(bombPlayerTwo.length >0){
            bombPlayerTwo.forEach(object => object.draw(ctx));
        }
        // if(explodingArr.length > 0){
        //     explodingArr.forEach(object => object.draw(ctx));
        // }

    }
}

class Background {
    constructor(game){
        this.width = game.gameWidth;
        this.height = game.gameHeight;
    }

    draw(ctx){
        ctx.fillStyle = '#AB8C68';
        ctx.fillRect(0, 0, this.width, this.height);
    } //only background color.
}

class Blocks {
    constructor(game){

        this.width = game.gridWidth; // size of block
        this.height= game.gridHeight;

        this.game = game;

        this.position = { //where to start drawing
            x : game.gameWidth/9,
            y : game.gameHeight/9
        }
    }

    draw(ctx) {


    for(var c=0; c<stoneColumnCount; c++) {
        for(var r=0; r<stoneRowCount; r++) {
            if(stones[c][r].status == 1){
            var stoneX = (c*(stoneWidth+stonePadding))+stoneOffsetLeft;
            var stoneY = (r*(stoneHeight+stonePadding))+stoneOffsetTop;
            stones[c][r].x = stoneX;
            stones[c][r].y = stoneY;
            ctx.beginPath();
            ctx.rect(stoneX, stoneY, stoneWidth, stoneHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
                }
            }
         }
    } //stone blocks so far
}

class BomberMan {
    constructor(game){
        this.gameWidth = GAME_WIDTH;
        this.gameHeight = GAME_HEIGHT;
        this.gridWidth = GRID_WIDTH;
        this.gridHeight = GRID_HEIGHT;
        this.radius = 25;

        this.maxSpeedX = 9;
        this.maxSpeedY = 9;
        this.speedX = 0;
        this.speedY = 0;

        this.game = game;

        this.position = {
            x : this.gridWidth/2,
            y : this.gridHeight/2
        }

        this.positionTwo = {
            x : this.gameWidth - this.gridWidth/2,
            y : this.gameHeight - this.gridHeight/2
        }

        this.statusAlive = true;
    }

    moveLeft(){
        this.speedX = -this.maxSpeedX;
    }

    moveRight(){
        this.speedX = this.maxSpeedX;
    }

    moveUp(){
        this.speedY = -this.maxSpeedY;
    }

    moveDown(){
        this.speedY = this.maxSpeedY;
    }

    stop(){
        this.speedX = 0;
        this.speedY = 0;
    }

    draw(ctx) {
         // && checkOtherPlayerBomb(playerOneXposition,playerOneYposition,bombPlayerTwo,1) > 0
          // && checkOne > 0
        if(playerOneAlive > 0){ //if this statement both true then will show player 1
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            ctx.linewidth = 3;
            ctx.strokeStyle="red";
            ctx.fillStyle = "green";
            ctx.fill();
            ctx.stroke();
        } else {
            console.log("Player One ded");
        }
    }

    update(deltaTime) {

            playerOneXposition = this.game.playerOne.position.x;
            playerOneYposition = this.game.playerOne.position.y;

            // console.log("Player 1, " + "x-coord: " + playerOneXposition +"," +"y-coord: "+ playerOneYposition);

            this.position.x += this.speedX;
            this.position.y += this.speedY;

            playerOneSpeedX = this.speedX;
            playerOneSpeedY = this.speedY;

    //checks if bomberman on left or right wall
        if(this.position.x < this.radius){
            this.position.x =this.radius;
        }

        if(this.gameWidth - this.radius < this.position.x){
            this.position.x = this.gameWidth - this.radius;
        }

    //checks if bomberman on top and bottom wall.
        if(this.position.y < this.radius){
            this.position.y = this.radius;
        }

        if(this.gameHeight - this.radius < this.position.y){
            this.position.y = this.gameHeight - this.radius;
        }

    //checks if bomberman on stone blocks (blocks) //40min on video
        let player_XpositionRight = this.position.x + this.radius;
        let player_XpositionLeft = this.position.x - this.radius;
        let player_YpositionTop = this.position.y - this.radius;
        let player_YpositionBottom = this.position.y + this.radius

        for(var c=0; c<stoneColumnCount; c++) {
            for(var r=0; r<stoneRowCount; r++) {
                var b = stones[c][r];
                if(b.status == 1) {
                    if(player_XpositionRight > b.x
                        && player_XpositionLeft < b.x+stoneWidth
                        && player_YpositionBottom > b.y
                        && player_YpositionTop < b.y+stoneHeight){
                        if(this.speedX > 0){
                            this.position.x = b.x - this.radius;
                        } else if(this.speedX<0){
                            this.position.x = b.x + stoneWidth + this.radius;
                        } else if(this.speedY>0){
                            this.position.y = b.y - this.radius;
                        } else if(this.speedY<0){
                            this.position.y = b.y +stoneHeight + this.radius;
                        }
                    }
                }
            }
        }
    }
}// circle representing bomber-man

class BomberManTwo {
    constructor(game){
        this.gameWidth = GAME_WIDTH;
        this.gameHeight = GAME_HEIGHT;
        this.gridWidth = GRID_WIDTH;
        this.gridHeight = GRID_HEIGHT;
        this.radius = 25;

        this.maxSpeedX = 9;
        this.maxSpeedY = 9;
        this.speedX = 0;
        this.speedY = 0;

        this.game = game;

        this.position = {
            x : this.gameWidth - this.gridWidth/2,
            y : this.gameHeight - this.gridHeight/2
        }
        this.statusAlive = true;
    }

    moveLeft(){
        this.speedX = -this.maxSpeedX;
    }

    moveRight(){
        this.speedX = this.maxSpeedX;
    }

    moveUp(){
        this.speedY = -this.maxSpeedY;
    }

    moveDown(){
        this.speedY = this.maxSpeedY;
    }

    stop(){
        this.speedX = 0;
        this.speedY = 0;
    }

    draw(ctx) {

        if(playerTwoAlive > 0){
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.linewidth = 3;
        ctx.strokeStyle="green";
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
    } else{
        console.log("Player Two ded");
    }
    }

    update(deltaTime) {

            playerTwoXposition = this.game.playerTwo.position.x;
            playerTwoYposition = this.game.playerTwo.position.y;
            // console.log("Player 2, " + "x-coord: " + this.game.playerTwo.position.x +"," +"y-coord: "+ this.game.playerTwo.position.y);
            this.position.x += this.speedX;
            this.position.y += this.speedY;

            playerTwoSpeedX = this.speedX;
            playerTwoSpeedY = this.speedY;
    //checks if bomberman on left or right wall
        if(this.position.x < this.radius){
            this.position.x =this.radius;
        }

        if(this.gameWidth - this.radius < this.position.x){
            this.position.x = this.gameWidth - this.radius;
        }

    //checks if bomberman on top and bottom wall.
        if(this.position.y < this.radius){
            this.position.y = this.radius;
        }

        if(this.gameHeight - this.radius < this.position.y){
            this.position.y = this.gameHeight - this.radius;
        }

    //checks if bomberman on stone blocks (blocks) //40min on video
        let player_XpositionRight = this.position.x + this.radius;
        let player_XpositionLeft = this.position.x - this.radius;
        let player_YpositionTop = this.position.y - this.radius;
        let player_YpositionBottom = this.position.y + this.radius

        for(var c=0; c<stoneColumnCount; c++) {
            for(var r=0; r<stoneRowCount; r++) {
                var b = stones[c][r];
                if(b.status == 1) {
                    if(player_XpositionRight > b.x
                        && player_XpositionLeft < b.x+stoneWidth
                        && player_YpositionBottom > b.y
                        && player_YpositionTop < b.y+stoneHeight){
                        if(this.speedX > 0){
                            this.position.x = b.x - this.radius;
                        } else if(this.speedX<0){
                            this.position.x = b.x + stoneWidth + this.radius;
                        } else if(this.speedY>0){
                            this.position.y = b.y - this.radius;
                        } else if(this.speedY<0){
                            this.position.y = b.y +stoneHeight + this.radius;
                        }
                    }
                }
            }
        }
    }
}

class BombOne{
    constructor(game){

        this.gridWidth = GRID_WIDTH;
        this.gridHeight = GRID_HEIGHT;
        this.width = 80;
        this.height = 80;

         this.timeCreated = gameTimer;

        this.instance = 0;

        this.type = "bomb";
        this.owner = 1;
        this.amount = 1;

        this.status = 0;

        this.position = {
            x: playerOneXposition,
            y: playerOneYposition
        };
        //checks where to place bomb, based on player location.
        this.x_cornerCoords = Math.ceil(this.position.x/100)*100;
        this.y_cornerCoords = (Math.ceil(this.position.y/100)*100)-100;
        this.x_bomb = this.x_cornerCoords +10;
        this.y_bomb = this.y_cornerCoords + 10;
    }

    draw(ctx){
            if(this.status == 0 ){
                ctx.fillStyle = "#262626";
                ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height);
            }else if(this.status == 1){
                if( ((Math.ceil(playerOneXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerOneYposition/100)*100)-100 == this.y_cornerCoords))  // center
                    ||((Math.ceil(playerOneXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerOneYposition/100)*100)-100 == this.y_cornerCoords - 100)) // top
                    ||((Math.ceil(playerOneXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerOneYposition/100)*100)-100 == this.y_cornerCoords + 100)) // bottom
                    ||((Math.ceil(playerOneXposition/100)*100 == this.x_cornerCoords - 100) && ((Math.ceil(playerOneYposition/100)*100)-100 == this.y_cornerCoords)) //left
                    ||((Math.ceil(playerOneXposition/100)*100 == this.x_cornerCoords + 100) && ((Math.ceil(playerOneYposition/100)*100)-100 == this.y_cornerCoords)) //right
                     ) {
                    console.log("In the Blast Range");
                    playerOneAlive = 0;
                }
                ctx.fillStyle = "#CE594B";
                ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height); //yx
                ctx.fillRect(this.x_bomb-100, this.y_bomb+100, this.width, this.height); // y change +
                ctx.fillRect(this.x_bomb-100, this.y_bomb-100, this.width, this.height); // y change -
                ctx.fillRect(this.x_bomb, this.y_bomb, this.width, this.height); // x change +
                ctx.fillRect(this.x_bomb-200, this.y_bomb, this.width, this.height); // x change -
            }else if(this.status == 2){
                bombPlayerOne.shift();
            }

            if(this.status == 0 ){
                ctx.fillStyle = "#262626";
                ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height);
            }else if(this.status == 1){
                if( ((Math.ceil(playerTwoXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerTwoYposition/100)*100)-100 == this.y_cornerCoords))  // center
                    ||((Math.ceil(playerTwoXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerTwoYposition/100)*100)-100 == this.y_cornerCoords - 100)) // top
                    ||((Math.ceil(playerTwoXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerTwoYposition/100)*100)-100 == this.y_cornerCoords + 100)) // bottom
                    ||((Math.ceil(playerTwoXposition/100)*100 == this.x_cornerCoords - 100) && ((Math.ceil(playerTwoYposition/100)*100)-100 == this.y_cornerCoords)) //left
                    ||((Math.ceil(playerTwoXposition/100)*100 == this.x_cornerCoords + 100) && ((Math.ceil(playerTwoYposition/100)*100)-100 == this.y_cornerCoords)) //right
                     ) {
                    console.log("In the Blast Range");
                    playerTwoAlive = 0;
                }
                ctx.fillStyle = "#CE594B";
                ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height); //yx
                ctx.fillRect(this.x_bomb-100, this.y_bomb+100, this.width, this.height); // y change +
                ctx.fillRect(this.x_bomb-100, this.y_bomb-100, this.width, this.height); // y change -
                ctx.fillRect(this.x_bomb, this.y_bomb, this.width, this.height); // x change +
                ctx.fillRect(this.x_bomb-200, this.y_bomb, this.width, this.height); // x change -
            }else if(this.status == 2){
                bombPlayerOne.shift();
            }
    }

    update(deltaTime){
            let detonationTimer = 3; // status 0
            let timeToDet = this.timeCreated + detonationTimer; //status 0
            let timeOfExplode = timeToDet + 1.5; // change to status 1
            let timeToDisappear = timeOfExplode + 2;              // change to status 2

            if(gameTimer > timeToDet && gameTimer < timeOfExplode){
                this.status = 1;
            } else if(gameTimer > timeOfExplode ){
                this.status = 2;
            }
    }
}

class BombTwo{
    constructor(game){

        this.gridWidth = GRID_WIDTH;
        this.gridHeight = GRID_HEIGHT;
        this.width = 80;
        this.height = 80;

        this.timeCreated = gameTimer;

        this.instance = 0;

        this.type = "bomb";
        this.owner = 2;
        this.amount = 1; //work in progress. Need to limit amount of bombs a character can place.

        this.status = 0;

        this.position = {
            x: playerTwoXposition,
            y: playerTwoYposition
        };
        //checks where to place bomb, based on player location.
        this.x_cornerCoords = Math.ceil(this.position.x/100)*100;
        this.y_cornerCoords = (Math.ceil(this.position.y/100)*100)-100;
        this.x_bomb = this.x_cornerCoords +10;
        this.y_bomb = this.y_cornerCoords + 10;
    }

    draw(ctx){
        if(this.amount !== 0){
            if(this.status == 0 ){
                ctx.fillStyle = "#262626";
                ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height);
            }else if(this.status == 1){
                    if( ((Math.ceil(playerOneXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerOneYposition/100)*100)-100 == this.y_cornerCoords))  // center
                    ||((Math.ceil(playerOneXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerOneYposition/100)*100)-100 == this.y_cornerCoords - 100)) // top
                    ||((Math.ceil(playerOneXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerOneYposition/100)*100)-100 == this.y_cornerCoords + 100)) // bottom
                    ||((Math.ceil(playerOneXposition/100)*100 == this.x_cornerCoords - 100) && ((Math.ceil(playerOneYposition/100)*100)-100 == this.y_cornerCoords)) //left
                    ||((Math.ceil(playerOneXposition/100)*100 == this.x_cornerCoords + 100) && ((Math.ceil(playerOneYposition/100)*100)-100 == this.y_cornerCoords)) //right
                     ){ // checks if player is inside range of it's own bomb range
                    console.log("In the Blast Range");

                    playerOneAlive = 0;
                }
                ctx.fillStyle = "#CE594B";
                ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height); //yx
                ctx.fillRect(this.x_bomb-100, this.y_bomb+100, this.width, this.height); // y change +
                ctx.fillRect(this.x_bomb-100, this.y_bomb-100, this.width, this.height); // y change -
                ctx.fillRect(this.x_bomb, this.y_bomb, this.width, this.height); // x change +
                ctx.fillRect(this.x_bomb-200, this.y_bomb, this.width, this.height); // x change -
            }else if(this.status == 2){
                bombPlayerTwo.shift();
            }
        }

        if(this.amount !== 0){
            if(this.status == 0 ){
                ctx.fillStyle = "#262626";
                ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height);
            }else if(this.status == 1){
                    if( ((Math.ceil(playerTwoXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerTwoYposition/100)*100)-100 == this.y_cornerCoords))  // center
                    ||((Math.ceil(playerTwoXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerTwoYposition/100)*100)-100 == this.y_cornerCoords - 100)) // top
                    ||((Math.ceil(playerTwoXposition/100)*100 == this.x_cornerCoords) && ((Math.ceil(playerTwoYposition/100)*100)-100 == this.y_cornerCoords + 100)) // bottom
                    ||((Math.ceil(playerTwoXposition/100)*100 == this.x_cornerCoords - 100) && ((Math.ceil(playerTwoYposition/100)*100)-100 == this.y_cornerCoords)) //left
                    ||((Math.ceil(playerTwoXposition/100)*100 == this.x_cornerCoords + 100) && ((Math.ceil(playerTwoYposition/100)*100)-100 == this.y_cornerCoords)) //right
                     ){ // checks if player is inside range of it's own bomb range
                    console.log("In the Blast Range");

                    playerTwoAlive = 0;
                }
                ctx.fillStyle = "#CE594B";
                ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height); //yx
                ctx.fillRect(this.x_bomb-100, this.y_bomb+100, this.width, this.height); // y change +
                ctx.fillRect(this.x_bomb-100, this.y_bomb-100, this.width, this.height); // y change -
                ctx.fillRect(this.x_bomb, this.y_bomb, this.width, this.height); // x change +
                ctx.fillRect(this.x_bomb-200, this.y_bomb, this.width, this.height); // x change -
            }else if(this.status == 2){
                bombPlayerTwo.shift();
            }
        }
    }

    update(deltaTime){
         // checks gametimer with detonation time to do something
            let detonationTimer = 3; // status 0 (base 3s)
            let timeToDet = this.timeCreated + detonationTimer; //status 0
            let timeOfExplode = timeToDet + 1.5; // change to status 1 (base , 1.5s)
            let timeToDisappear = timeOfExplode + 2;              // change to status 2  .... this line.. really has no use....
            if(this.amount !== 0){
                // console.log(this.amount);
            if(gameTimer > timeToDet && gameTimer < timeOfExplode){
                    this.status = 1;
                }else if(gameTimer > timeOfExplode ){
                     this.status = 2;
                }
            }
    }
}

class InputHandler {
    constructor(playerOne) {
        document.addEventListener('keydown',event => {
            switch(event.keyCode) {
                case 65:
                    playerOne.moveLeft();
                    break;

                case 68:
                    playerOne.moveRight();
                    break;

                case 87:
                    playerOne.moveUp();
                    break;

                case 83:
                    playerOne.moveDown();
                    break;

                case 32:
                    bombPlayerOne.push(new BombOne());
                    break;
            }
        });
        document.addEventListener('keyup',event => {
            switch(event.keyCode) {
                case 65:
                    if(playerOne.speedX < 0 )
                    playerOne.stop();
                    break;

                case 68:
                    if(playerOne.speedX >0)
                    playerOne.stop();
                    break;

                case 87:
                    if(playerOne.speedY < 0)
                    playerOne.stop();
                    break;

                case 83:
                    if(playerOne.speedY > 0)
                    playerOne.stop();
                    break;
            }
        });
    }
}

class InputHandlerTwo {
    constructor(playerTwo) {
        document.addEventListener('keydown',event => {
            switch(event.keyCode) {
                case 76:
                    playerTwo.moveLeft();
                    break;

                case 222:
                    playerTwo.moveRight();
                    break;

                case 80:
                    playerTwo.moveUp();
                    break;

                case 186:
                    playerTwo.moveDown();
                    break;

                case 77:
                    bombPlayerTwo.push(new BombTwo());
                    break;

            }
        });
        document.addEventListener('keyup',event => {
            switch(event.keyCode) {
                case 76:
                    if(playerTwo.speedX < 0 )
                    playerTwo.stop();
                    break;

                case 222:
                    if(playerTwo.speedX >0)
                    playerTwo.stop();
                    break;

                case 80:
                    if(playerTwo.speedY < 0)
                    playerTwo.stop();
                    break;

                case 186:
                    if(playerTwo.speedY > 0)
                    playerTwo.stop();
                    break;
            }
        });
    }
}

let game = new Game(GAME_WIDTH,GAME_HEIGHT,GRID_WIDTH,GRID_HEIGHT,playerOneXposition,playerOneYposition);
game.start();

let lastTime = 0;
let frame = 0;
function updateGameBoard(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);
    frame++;
    counter = frame/60;
    gameTimer = counter;

    requestAnimationFrame(updateGameBoard);
}

requestAnimationFrame(updateGameBoard);


/*
    //problem: when the other play(2) adds the bomb. player(1) is removed from game board.

    // checkOtherPlayerBomb(playerOneXposition,playerOneYposition,bombPlayerTwo)
    // var checkOtherPlayerBomb = function(playerXpos,playerYpos,bombArr,playerID) { //i need this to run with requestframe.....
    //     var currentXBombCoords;
    //     var currentYBombCoords;
    //     var player =[];
    //     var check;

    //     if(playerID == 1){
    //         check = checkOne;
    //     } else if(playerID ==2){
    //         check = checkTwo;
    //     }

    //     if(bombArr.length == 0){
    //     // from this i can know what is the bomb coords the player is on. I can set if affected or not. (i still don't know in game time.... if I am stepping OVER IT.)
    //         console.log("NO bombs LAID")
    //         console.log(check);
    //         return check;
    //     } else if( bombArr.length > 0){
    //              for(var i = 0; i < bombArr.length; i ++){
    //                 currentXBombCoords = bombArr[i].x_cornerCoords;
    //                 currentYBombCoords = bombArr[i].y_cornerCoords;
    //                     if((Math.ceil(playerXpos/100)*100 == currentXBombCoords) // checks if player is on ANY of the BOMB position
    //                     && ((Math.ceil(playerYpos/100)*100)-100 == currentYBombCoords) ){
    //                         // if()
    //                             console.log("This bomb is the " + i + "item on the bomb arr."); // this tell me which bomb is on the player . Able to retrieve coordinates
    //                             console.log("X coord of BOMB that hits: " + bombArr[i].x_cornerCoords);
    //                             console.log("Y coord of BOMB that hits: " + bombArr[i].y_cornerCoords);
    //                             console.log("OTHER PLAYER HIT YOU")
    //                             check = 0;
    //                             if(playerID == 1){
    //                                 checkOne = check;
    //                             } else if(playerID ==2){
    //                                 checkTwo = check;
    //                             }
    //                         return check;
    //                     }else {
    //                             console.log("No")
    //                             console.log("No affected by these...: " + i);
    //                             console.log(check);
    //                         return check;
    //                     }
    //                 }
    //             }
    // }

    // var checkXcoord = function(playerXpos,playerYpos,bombArr){
    //     var Xcoord;

    // }
*/