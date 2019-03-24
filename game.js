import Background from "/main";
import Blocks from "/main";
import BomberMan from "/main";

class Game {

    constructor(gameWidth, gameHeight,gridWidth,gridHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gridWidth = gameWidth;
        this.gridHeight = gameHeight;
    }

    start() {
        let board = new Background(this);
        let stoneBlock = new Blocks(this);
        let playerOne = new BomberMan(this);

        new InputHandler(playerOne);
    }
}