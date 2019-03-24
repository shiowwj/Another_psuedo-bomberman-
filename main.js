// import Game from "/game";

//Wei Jun's version for main js folder
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


var stones = [];
for(var c=0; c<stoneColumnCount; c++) {
    stones[c] = [];
    for(var r=0; r<stoneRowCount; r++) {
        stones[c][r] = { x: 0, y: 0, status: 1};
    }
}

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

    }

    draw(ctx) {

        this.gameObjects.forEach(object => object.draw(ctx));

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

        // this.top =
        // this.right =
        // this.bottom =
        // this.left =
        // let topOfBlock = this.game.stoneBlock.position.y;
        // let rightOfBlock = this.game.stoneBlock.position.x + this.game.stoneBlock.position.gameWidth;
        // let bottomOfBlock = this.game.stoneBlock.position.y + this.game.stoneBlock.position.gameHeight;
        // let leftOfBlock = this.game.stoneBlock.position.x;

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
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.gridWidth = game.gridWidth;
        this.gridHeight = game.gridHeight;
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
            // console.log(this.game.playerOne.position.x);
            this.position.x += this.speedX;
            this.position.y += this.speedY;

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
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.gridWidth = game.gridWidth;
        this.gridHeight = game.gridHeight;
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
            // console.log(this.game.playerOne.position.x);
            this.position.x += this.speedX;
            this.position.y += this.speedY;

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

let game = new Game(GAME_WIDTH,GAME_HEIGHT,GRID_WIDTH,GRID_HEIGHT);
game.start();

let lastTime = 0;
function updateGameBoard(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(updateGameBoard);
}

requestAnimationFrame(updateGameBoard);