let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');
var gameStatusOne = document.getElementById("score-text");
var playerOneBombCount = document.getElementById("bombOne-text");
var playerTwoBombCount = document.getElementById("bombTwo-text");
var gameTimerCount = document.getElementById("gameTimer-text");

//////GAME LOGIC STUFF

const GAME_WIDTH = 900; // gameboard parameters
const GAME_HEIGHT = 900;
const GRID_WIDTH = 100;
const GRID_HEIGHT = 100;

var stoneRowCount = 4;  ///parameters for stone obstacles
var stoneColumnCount = 4;
var stoneWidth = 100;
var stoneHeight = 100;
var stonePadding = 100;
var stoneOffsetTop = 100;
var stoneOffsetLeft = 100;

var playerOneXposition; // Player One variables. Updated from created player one class. X-Y position and X-Y 'speed'.
var playerOneYposition;
var playerOneSpeedX;
var playerOneSpeedY;

var playerTwoXposition; // Player Two variables. Updated from created player two class. X-Y position and X-Y 'speed'.
var playerTwoYposition;
var playerTwoSpeedX;
var playerTwoSpeedY;

// var players = [];
var playerOneAlive = 1;
var playerTwoAlive = 1;
// var checkOne = 1;
// var checkTwo = 1;

var bombPlayerOne = []; //Player One's bomb array.
var bombPlayerTwo = []; //Player Two's bomb array.
// var explodingArr =[];

let gameTimer; //game clock. Set to ms in function UpdateGameBoard

////stats checker
var playerOneMoveDist = 0;
var playerTwoMoveDist = 0;
var playerOneBombsUsed = 0;
var playerTwoBombsUsed = 0;

let lastTime = 0;
let frame = 0;
var requestFrame;
//creating stone obstacle Array
var stones = [];
for(var c=0; c<stoneColumnCount; c++) {
    stones[c] = [];
    for(var r=0; r<stoneRowCount; r++) {
        stones[c][r] = { x: 0, y: 0, status: 1};
    }
}
//Game Class creates game settings. From here, it creates other classes listed below. Game Loop. (other classes repeated called upon every 16ms.)
//this creates the animation rendering for all objects in the canvas screen.
class Game {
    //creates game class
    constructor(gameWidth, gameHeight,gridWidth,gridHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
    }
    //creates other game object classes here
    start() {
        this.board = new Background(this);
        this.stoneBlock = new Blocks(this);
        this.playerOne = new BomberMan(this);
        this.playerTwo = new BomberManTwo(this);
    //game object arry
        this.gameObjects = [
            this.board, this.stoneBlock, this.playerOne, this.playerTwo
            //Overlapping code
        ];
        new InputHandler(this.playerOne);
        new InputHandlerTwo(this.playerTwo);
    }
    update(deltaTime,ctx) {
        //renders all created objects with requestanimationframe function
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
        //draws all objects
        this.gameObjects.forEach(object => object.draw(ctx));
        if(bombPlayerOne.length > 0){
            bombPlayerOne.forEach(object => object.draw(ctx));
        }
        if(bombPlayerTwo.length >0){
            bombPlayerTwo.forEach(object => object.draw(ctx));
        }
    }
}
//background board object creator
class Background {
    constructor(game){
        this.width = game.gameWidth;
        this.height = game.gameHeight;
    }
    //draw function for background board, game class draw() calls this (static)
    draw(ctx){

        var imgBackground = new Image();   // Create new img element
        imgBackground.src = 'img/gameboardbackground.jpg';
        ctx.drawImage(imgBackground, 0, 0, this.width, this.height);
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
        //draw function for blocks on gameboard, game class draw() calls this (static)
        var imgStoneBlock = new Image();   // Create new img element
        imgStoneBlock.src = 'img/stoneBlockPattern.jpg';

    for(var c=0; c<stoneColumnCount; c++) {
        for(var r=0; r<stoneRowCount; r++) {
            if(stones[c][r].status == 1){
            var stoneX = (c*(stoneWidth+stonePadding))+stoneOffsetLeft;
            var stoneY = (r*(stoneHeight+stonePadding))+stoneOffsetTop;
            stones[c][r].x = stoneX;
            stones[c][r].y = stoneY;
            ctx.drawImage(imgStoneBlock, stoneX, stoneY, stoneWidth, stoneHeight);
                }
            }
         }
    } //stone blocks so far
}

class BomberMan {
    constructor(game,x,y){
        //bomberman class creator function. Called by game start function to create object
        this.gameWidth = GAME_WIDTH;
        this.gameHeight = GAME_HEIGHT;
        this.gridWidth = GRID_WIDTH;
        this.gridHeight = GRID_HEIGHT;
        this.radius = 25;
        //maxSpeed allows velocity of the object on canvas
        //Moves 9pixel (in any direction/frame refresh)
        this.maxSpeedX = 20;
        this.maxSpeedY = 20;
        this.speedX = 0;
        this.speedY = 0;

        this.distanceMoved = 0;

        this.game = game;

        this.position = {
            x : this.gridWidth/2 ,
            y : this.gridHeight/2
        }
        this.statusAlive = true;
    }
    //movement functions, Called by inputhandler function
    //players move on the canvas based on increment or decrement values of x-y coordinates on the canvas
    //moving left = negative x value on canvas ; moving right = positive x value on canvas; moving up = negative y value on canvas ; moving down = positive y value on canvas
    //
    moveLeft(){
        this.speedX = -this.maxSpeedX;
        // this.speedX = this.maxSpeedX*x;
        // this.speedY = this.maxSpeedY*y;
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

        var imgPlayerOne = new Image();   // Create new img element
        imgPlayerOne.src = 'img/playerOne.jpg';
        if(playerOneAlive > 0){ //if this statement both true then will show player 1
            ctx.drawImage(imgPlayerOne, this.position.x-25, this.position.y-25, 2*this.radius, 2*this.radius); // width & height both at 50 pixels
        } else {
            console.log("Player One ded");
        }
    }

    update(deltaTime) {
        //based on keyboard event listener to manipulate x-y values (+/-). Update function is called by game loop (refreshed on the browser every 16ms) to reposition based on previous x-y coordinates. This allows objects to 'move'.
            playerOneXposition = this.game.playerOne.position.x ;
            playerOneYposition = this.game.playerOne.position.y ;

            this.distanceMoved = Math.sqrt((playerOneXposition*playerOneXposition) + (playerOneYposition*playerOneYposition));

            playerOneMoveDist = this.distanceMoved;

            this.position.x += this.speedX;
            this.position.y += this.speedY;

            playerOneSpeedX = this.speedX;
            playerOneSpeedY = this.speedY;
    //Collision Detection Mechanics
    //checks if bomberman hits on left or right wall
        if(this.position.x < this.radius){
            this.position.x =  this.radius;
        }

        if(this.gameWidth - this.radius < this.position.x){
            this.position.x = this.gameWidth - this.radius;
        }

    //checks if bomberman hits on top and bottom wall.
        if(this.position.y < this.radius){
            this.position.y = this.radius;
        }

        if(this.gameHeight - this.radius < this.position.y){
            this.position.y = this.gameHeight - this.radius;
        }

    //checks if bomberman hits on stone blocks (blocks) //
        let player_XpositionRight = this.position.x + this.radius;
        let player_XpositionLeft = this.position.x - this.radius;
        let player_YpositionTop = this.position.y - this.radius;
        let player_YpositionBottom = this.position.y + this.radius;

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
//Mostly repeated parameters from BomberManOne Class (yet to re-factor code....)
class BomberManTwo {
    constructor(game){
        //bombermanTwo class creator function. Called by game start function to create object
        this.gameWidth = GAME_WIDTH;
        this.gameHeight = GAME_HEIGHT;
        this.gridWidth = GRID_WIDTH;
        this.gridHeight = GRID_HEIGHT;
        this.radius = 25;

        this.maxSpeedX = 20;
        this.maxSpeedY = 20;
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
        var imgPlayerTwo = new Image();   // Create new img element
        imgPlayerTwo.src = 'img/playerTwo.jpg';
        if(playerTwoAlive > 0){
            ctx.drawImage(imgPlayerTwo, this.position.x-25, this.position.y-25, 2*this.radius, 2*this.radius);
    } else{
        console.log("Player Two ded");
    }
    }

    update(deltaTime) {

            playerTwoXposition = this.game.playerTwo.position.x;
            playerTwoYposition = this.game.playerTwo.position.y;

            this.position.x += this.speedX;
            this.position.y += this.speedY;

            playerTwoSpeedX = this.speedX;
            playerTwoSpeedY = this.speedY;
    //checks if bomberman hits on left or right wall
        if(this.position.x < this.radius){
            this.position.x =this.radius;
        }

        if(this.gameWidth - this.radius < this.position.x){
            this.position.x = this.gameWidth - this.radius;
        }

    //checks if bomberman hits on top and bottom wall.
        if(this.position.y < this.radius){
            this.position.y = this.radius;
        }

        if(this.gameHeight - this.radius < this.position.y){
            this.position.y = this.gameHeight - this.radius;
        }
    //Collision Detection Mechanics
    //checks if bomberman hits on stone blocks (blocks) //
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
        //bomb class parameters
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
        //explosion mechanics
        // var imgBombOne = new Image();
        var imgBombExplodeOne = new Image();   // Create new img element
        // imgBombOne.src = 'img/bombPattern2.png';
        imgBombExplodeOne.src = 'img/explosionPattern.jpg';
         var imgBombTwo = new Image();
        // var imgBombExplodeTwo = new Image();   // Create new img element
        imgBombTwo.src = 'img/bombPattern5.png';
        // imgBombExplodeTwo.src = 'img/explosionPattern2.png';
        //logic here works with bomb class update function to determine state of bomb
        //place 1. place bomb  // 2. fuse time for bomb   //3. Explosion for bomb //4. Removal of bomb from canvas
            if(this.status == 0 ){
                ctx.drawImage(imgBombTwo, this.x_bomb-100, this.y_bomb, this.width, this.height);
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
                ctx.drawImage(imgBombExplodeOne, this.x_bomb-100, this.y_bomb, this.width, this.height);
                ctx.drawImage(imgBombExplodeOne, this.x_bomb-100, this.y_bomb+100, this.width, this.height);
                ctx.drawImage(imgBombExplodeOne, this.x_bomb-100, this.y_bomb-100, this.width, this.height);
                ctx.drawImage(imgBombExplodeOne, this.x_bomb, this.y_bomb, this.width, this.height);
                ctx.drawImage(imgBombExplodeOne, this.x_bomb-200, this.y_bomb, this.width, this.height);
            }else if(this.status == 2){
                bombPlayerOne.shift();
            }

            if(this.status == 0 ){
                ctx.drawImage(imgBombTwo, this.x_bomb-100, this.y_bomb, this.width, this.height);
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
                ctx.drawImage(imgBombExplodeOne, this.x_bomb-100, this.y_bomb, this.width, this.height);
                ctx.drawImage(imgBombExplodeOne, this.x_bomb-100, this.y_bomb+100, this.width, this.height);
                ctx.drawImage(imgBombExplodeOne, this.x_bomb-100, this.y_bomb-100, this.width, this.height);
                ctx.drawImage(imgBombExplodeOne, this.x_bomb, this.y_bomb, this.width, this.height);
                ctx.drawImage(imgBombExplodeOne, this.x_bomb-200, this.y_bomb, this.width, this.height);
            }else if(this.status == 2){
                bombPlayerOne.shift();
            }
    }

    update(deltaTime){
        //checks with game time to sequentially do bomb processing checks
            let detonationTimer = 2; // status 0
            let timeToDet = this.timeCreated + detonationTimer; //status 0
            let timeOfExplode = timeToDet + 1.5; // change to status 1
            let timeToDisappear = timeOfExplode + 2;              // change to status 2
        //place 1. place bomb  // 2. fuse time for bomb   //3. Explosion for bomb //4. Removal of bomb from canvas
            if(gameTimer > timeToDet && gameTimer < timeOfExplode){ //therefore, if conditional time is met
                this.status = 1; //bomb status changes
            } else if(gameTimer > timeOfExplode ){
                this.status = 2; //bomb status changes
            }
    }
}

class BombTwo{ //Basically similar format with BombOne
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

        var imgBombTwo = new Image();
        var imgBombExplodeTwo = new Image();   // Create new img element
        imgBombTwo.src = 'img/bombPattern5.png';
        imgBombExplodeTwo.src = 'img/explosionPattern2.png';

        if(this.amount !== 0){
            if(this.status == 0 ){
                // ctx.fillStyle = "#262626";
                ctx.drawImage(imgBombTwo, this.x_bomb-100, this.y_bomb, this.width, this.height);
                // ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height);
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
                ctx.drawImage(imgBombExplodeTwo, this.x_bomb-100, this.y_bomb, this.width, this.height);
                ctx.drawImage(imgBombExplodeTwo, this.x_bomb-100, this.y_bomb+100, this.width, this.height);
                ctx.drawImage(imgBombExplodeTwo, this.x_bomb-100, this.y_bomb-100, this.width, this.height);
                ctx.drawImage(imgBombExplodeTwo, this.x_bomb, this.y_bomb, this.width, this.height);
                ctx.drawImage(imgBombExplodeTwo, this.x_bomb-200, this.y_bomb, this.width, this.height);
                // ctx.fillStyle = "#CE594B";
                // ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height); //yx
                // ctx.fillRect(this.x_bomb-100, this.y_bomb+100, this.width, this.height); // y change +
                // ctx.fillRect(this.x_bomb-100, this.y_bomb-100, this.width, this.height); // y change -
                // ctx.fillRect(this.x_bomb, this.y_bomb, this.width, this.height); // x change +
                // ctx.fillRect(this.x_bomb-200, this.y_bomb, this.width, this.height); // x change -
            }else if(this.status == 2){
                bombPlayerTwo.shift();
            }
        }

        if(this.amount !== 0){
            if(this.status == 0 ){
                // ctx.fillStyle = "#262626";
                // ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height);
                ctx.drawImage(imgBombTwo, this.x_bomb-100, this.y_bomb, this.width, this.height);
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
                // ctx.fillStyle = "#CE594B";
                ctx.drawImage(imgBombExplodeTwo, this.x_bomb-100, this.y_bomb, this.width, this.height);
                ctx.drawImage(imgBombExplodeTwo, this.x_bomb-100, this.y_bomb+100, this.width, this.height);
                ctx.drawImage(imgBombExplodeTwo, this.x_bomb-100, this.y_bomb-100, this.width, this.height);
                ctx.drawImage(imgBombExplodeTwo, this.x_bomb, this.y_bomb, this.width, this.height);
                ctx.drawImage(imgBombExplodeTwo, this.x_bomb-200, this.y_bomb, this.width, this.height);
                // ctx.fillRect(this.x_bomb-100, this.y_bomb, this.width, this.height); //yx
                // ctx.fillRect(this.x_bomb-100, this.y_bomb+100, this.width, this.height); // y change +
                // ctx.fillRect(this.x_bomb-100, this.y_bomb-100, this.width, this.height); // y change -
                // ctx.fillRect(this.x_bomb, this.y_bomb, this.width, this.height); // x change +
                // ctx.fillRect(this.x_bomb-200, this.y_bomb, this.width, this.height); // x change -
            }else if(this.status == 2){
                bombPlayerTwo.shift();
            }
        }
    }

    update(deltaTime){
         // checks gametimer with detonation time to do something
            let detonationTimer = 2; // status 0 (base 3s)
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
//keyboard event handler. Calls functions from class objects(playerone, playertwo, bombOne & bombTwo) to move around the canvas and place bombs
class InputHandler {
    constructor(playerOne) {
        document.addEventListener('keydown',event => {
            switch(event.keyCode) {
                case 65:
                    playerOne.moveLeft()
                    playerOneMoveDist++;
                    break;

                case 68:
                    playerOne.moveRight()
                    playerOneMoveDist++;;
                    break;

                case 87:
                    playerOne.moveUp()
                    playerOneMoveDist++;;
                    break;

                case 83:
                    playerOne.moveDown()
                    playerOneMoveDist++;;
                    break;

                case 67:
                    bombPlayerOne.push(new BombOne());
                    playerOneBombsUsed++;
                    // gameStatus.innerText = "Player One placed Bomb."
                    playerOneBombCount.innerText = "Player One\ Bomb Count: " + playerOneBombsUsed;
                    break;
            }
        }); //key down stops object from 'moving'
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
                case 74:
                    playerTwo.moveLeft();
                    break;

                case 76:
                    playerTwo.moveRight();
                    break;

                case 73:
                    playerTwo.moveUp();
                    break;

                case 75:
                    playerTwo.moveDown();
                    break;

                case 220:
                    bombPlayerTwo.push(new BombTwo());
                    playerTwoBombsUsed++;
                    // gameStatus.innerText = "Player Two placed Bomb."
                    playerTwoBombCount.innerText = "Player Two\ Bomb Count: " + playerTwoBombsUsed;
                    break;
            }
        });
        document.addEventListener('keyup',event => {
            switch(event.keyCode) {
                case 74:
                    if(playerTwo.speedX < 0 )
                    playerTwo.stop();
                    break;

                case 76:
                    if(playerTwo.speedX >0)
                    playerTwo.stop();
                    break;

                case 73:
                    if(playerTwo.speedY < 0)
                    playerTwo.stop();
                    break;

                case 75:
                    if(playerTwo.speedY > 0)
                    playerTwo.stop();
                    break;
            }
        });
    }
}

//game init variables
let game = new Game(GAME_WIDTH,GAME_HEIGHT,GRID_WIDTH,GRID_HEIGHT);

//Creates all objects indicated at game start function
game.start();

//animation engine function
function updateGameBoard(timestamp) {

    if(playerOneAlive == 1 && playerTwoAlive ==1){
    requestAnimationFrame(updateGameBoard);
    }
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;



    game.update(deltaTime);
    game.draw(ctx);
    frame++;
    counter = frame/60;
    gameTimer = counter;

    // gameTimerCount.innerText = Math.floor(gameTimer) + " seconds of your _____  wasted."
    if(playerOneAlive == 0 && playerTwoAlive == 0){
        gameStatusOne.innerText = "Both Players are Dead."
        console.log("Both Players are Dead.");
    } else if(playerOneAlive == 0){
        gameStatusOne.innerText = "Player One is Dead."
        console.log("Player One is Dead.");
    } else if(playerTwoAlive == 0){
        gameStatusOne.innerText = "Player Two is Dead."
        console.log("Player Two is Dead.");
    }
}
requestAnimationFrame(updateGameBoard);

////////DOM STUFF
//restart game button // resets parameters for game to restart //broken... why are you broken....
function restartGame(){
    playerOneAlive = 1;
    playerTwoAlive = 1;
    playerOneBombsUsed = 0;
    playerTwoBombsUsed = 0;
    game.start();
    requestAnimationFrame(updateGameBoard);
}
    //Use of this key.word in all class creators. this enables any class to excess the Class Game method for any parameter.
    //choppy performance. Suspect it might be breaking my code periodically....
    //Note: Not too efficient. Slows my browser speed. Especially when all called functions are being invoked every 16ms.