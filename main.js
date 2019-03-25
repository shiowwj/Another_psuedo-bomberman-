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

// var players=[];

var playerOneXposition;
var playerOneYposition;
var playerOneSpeedX;
var playerOneSpeedY; //-9 , 0 , 9

var playerTwoXposition;
var playerTwoYposition;
var playerTwoSpeedX;
var playerTwoSpeedY;

var playerTwoX;
var playerTwoY;

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

addEventListener("click", function(){

        explodingArr.push(new explode());

        console.log("CLICK");
});

// var explosionLogic = function(){ //bombArr1, bombArr2

//     var x0= 400;
//     var y0 = 400;
//     var x_1 = x0 + GRID_WIDTH;
//     var x1_ = x0 - GRID_WIDTH;
//     var y_1 = y0 + GRID_HEIGHT;
//     var y1_ = y0 - GRID_HEIGHT;

//         ctx.fillRect(x0, y0, GRID_WIDTH, GRID_HEIGHT); // same yx
//         ctx.fillRect(x_1, y0, GRID_WIDTH, GRID_HEIGHT); // same y
//         ctx.fillRect(x1_, y0, GRID_WIDTH, GRID_HEIGHT); // same y
//         ctx.fillRect(x0, y_1, GRID_WIDTH, GRID_HEIGHT); // same x
//         ctx.fillRect(x0, y1_, GRID_WIDTH, GRID_HEIGHT); // same x

//         console.log("CLICK")

// }

// class explode {
//     constructor(game){

//     }
//     draw(ctx){
//         var x0= this.;
//         var y0 = 400;
//         var x_1 = x0 + GRID_WIDTH;
//         var x1_ = x0 - GRID_WIDTH;
//         var y_1 = y0 + GRID_HEIGHT;
//         var y1_ = y0 - GRID_HEIGHT;

//         ctx.fillRect(x0, y0, GRID_WIDTH, GRID_HEIGHT); // same yx
//         ctx.fillRect(x_1, y0, GRID_WIDTH, GRID_HEIGHT); // same y
//         ctx.fillRect(x1_, y0, GRID_WIDTH, GRID_HEIGHT); // same y
//         ctx.fillRect(x0, y_1, GRID_WIDTH, GRID_HEIGHT); // same x
//         ctx.fillRect(x0, y1_, GRID_WIDTH, GRID_HEIGHT); // same x
//     }
// }

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

        this.gameObjects = [
            this.board, this.stoneBlock, this.playerOne, this.playerTwo
        ];

        new InputHandler(this.playerOne);
        new InputHandlerTwo(this.playerTwo);

    }

    update(deltaTime) {

        this.playerOne.update(deltaTime);
        this.playerTwo.update(deltaTime);

        if(bombPlayerTwo.length>0){
            bombPlayerTwo.forEach(object => object.update(deltaTime));
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

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.linewidth = 3;
        ctx.strokeStyle="red";
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.stroke();
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

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.linewidth = 3;
        ctx.strokeStyle="green";
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
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

        // this.speedOfPlayer ={
        //     xSpeed:
        // };

        this.instance = 0;

        this.type = "bomb";

        this.position = {
            x: playerOneXposition,
            y: playerOneYposition
        };

        this.x_cornerCoords = Math.ceil(this.position.x/100)*100;
        this.y_cornerCoords = (Math.ceil(this.position.y/100)*100)-100;
        this.x_bomb = this.x_cornerCoords +10;
        this.y_bomb = this.y_cornerCoords + 10;
    }

    // drop(ctx,xposition,yposition){
    //     return draw(ctx,xposition,yposition)
    // }

    draw(ctx){

        // if(this.position.x < this.gridWidth){
                ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height);
            // } else {
                // ctx.fillRect(this.x_bomb, this.y_bomb, this.width, this.height);
            // }
    }

    update(deltaTime){

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

        this.position = {
            x: playerTwoXposition,
            y: playerTwoYposition
        };

        this.x_cornerCoords = Math.ceil(this.position.x/100)*100;
        this.y_cornerCoords = (Math.ceil(this.position.y/100)*100)-100;
        this.x_bomb = this.x_cornerCoords +10;
        this.y_bomb = this.y_cornerCoords + 10;
    }

    // drop(ctx,xposition,yposition){
    //     return draw(ctx,xposition,yposition)
    // }

    draw(ctx){

            // if(this.position.x < this.gridWidth){
                ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height);
                // console.log(this.timeCreated);
            // } else {
                // ctx.fillRect(this.x_bomb, this.y_bomb, this.width, this.height);
            // }

    }

    update(deltaTime){
        console.log("planted");
        let detonationTimer = 3;
        let timeToStuff = this.timeCreated + detonationTimer;
        console.log(timeToStuff);
        console.log(gameTimer);
        if(timeToStuff === gameTimer){
            alert("HELLO");
        }
        // if(timeCreated + )



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

    //                 addEventListener('click',function(){
    // bombPlayerOne.push(new Bomb());
    // bomb = new Bomb();
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
let i = 0;
function updateGameBoard(timestamp) {
    let deltaTime = timestamp - lastTime;
    // gameTimer = timestamp;
    // console.log(deltaTime);

    // console.log(timestamp);

    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);
    i++;
    counter = i/60;
    gameTimer = counter;


    requestAnimationFrame(updateGameBoard);
}

requestAnimationFrame(updateGameBoard);