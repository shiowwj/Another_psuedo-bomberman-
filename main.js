//Wei Jun's version for main js folder
let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 900;
const GAME_HEIGHT = 900;
const GRID_WIDTH = 100;
const GRID_HEIGHT = 100;

var img = document.getElementById('playerOneImg');


class blocks {
    constructor(game_width,game_height){
        this.width =100;
        this.height=100;

        this.position = {
            x : game_width/9,
            y : game_height/9
        }
    }

    draw(ctx){
        ctx.fillStyle ='#7BB6D6';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class bomberMan{
    constructor(game_width,game_height,grid_width,grid_height){
        this.gameWidth = game_width;
        this.gameHeight = game_height;
        this.width = 60;
        this.height = 60;
        this.radius = 30;

        this.maxSpeedX = 9;
        this.maxSpeedY = 9;
        this.speedX = 0;
        this.speedY = 0;

        this.position = {
            x : grid_width/2,
            y : grid_height + grid_height/2
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
        ctx.stroke();
        // ctx.fillStyle = '#CB8CF9;
    }

    update(deltaTime) {
        if(!deltaTime) return;
            this.position.x += this.speedX;
            this.position.y += this.speedY;

        if(this.position.x < this.radius)
            this.position.x =this.radius;

        if(this.gameWidth - this.radius < this.position.x)
            this.position.x = this.gameWidth - this.radius;

        if(this.position.y < this.radius)
            this.position.y = this.radius;

        if(this.gameHeight - this.radius < this.position.y)
            this.position.y = this.gameHeight - this.radius;
    }
}

class inputHandler{
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


let squareBlock = new blocks(GAME_WIDTH,GAME_HEIGHT);
let playerOne = new bomberMan(GAME_WIDTH,GAME_HEIGHT,GRID_WIDTH,GRID_HEIGHT);

new inputHandler(playerOne);

squareBlock.draw(ctx);
playerOne.draw(ctx);
ctx.drawImage(img,0,0,100,100);



let lastTime = 0;

function updateGameBoard(timestamp){
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    playerOne.update(deltaTime);
    playerOne.draw(ctx);
    squareBlock.draw(ctx);
    ctx.drawImage(img,0,0,100,100);

    requestAnimationFrame(updateGameBoard);
}

updateGameBoard();
/*
var players = new Array();

var objects = new Array();

var timer = null;

var game_started = false;

var num_blocks = null;

var num_blocks_left = null;

intro_screen = function() {
    var center;
    center = $('#map').width()/2;
    return $('#map').drawText({
        fillStyle: '#000',
        x: center,
        y: 100,
        text: 'Bomber Man',
        font: '50pt Helvetica, serif'
    }).drawText({
        fillstyle: '#000',
        x: center,
        y: 300,
        text: 'Press XXX to start',
        font: '20pt Helvetica, serif'
    });
};
//use constructor to create canvas blocks  (stone, empty, wood )


// Set 2d array. Predetermined spaces that are empty(start location for player). Set values of array to be stone. Randomize the rest of the array to be either empty spaces or wooden blocks

//using the array with set values eariler, use canvas to generate pixels for the objects.


$(document).ready(function() {
  return intro_screen();
});

*/