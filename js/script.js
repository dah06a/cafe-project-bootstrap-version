//Canvas Global Variables
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx;

//Key Pressed Global Variables
let upKey = false;
let downKey = false;
let leftKey = false;
let rightKey = false;

//Game Global Variables
let gameOver = true;
let gameSpeed = 3; //How far snake moves each frame - To change, be sure to match with resetGame()
let gameSize = 10; //Determines size of snake and apples on screen
let drawSpeed = 30; //Draw function interval speed - lower number = faster
let score = 0;
let apples = [];
const w = canvas.width;
const h = canvas.height;

//HTML Variables
const gameOverBtn = document.getElementById("gameOverBtn");
gameOverBtn.addEventListener("click", resetGame);
const scoreTitle = document.getElementById("scoreTitle");
scoreTitle.style.display = "none";
function resetGame() {
    gameOver = false;
    gameSpeed = 3;
    score = 0;
    snake.headX = w/2;
    snake.headY = h/2;
    snake.bodX = [];
    snake.bodY = [];
    snake.bodLen = gameSize*10;
    snake.goingUp = false;
    snake.goingDown = false;
    snake.goingLeft = false;
    snake.goingRight = true;
    gameOverBtn.style.display = "none";
}

//Document Event Functions Listening For Key Press
function onKeyDown(e) {
    if (e.keyCode == 39) rightKey = true;
    else if (e.keyCode == 37) leftKey = true;
    if (e.keyCode == 38) upKey = true;
    else if (e.keyCode == 40) downKey = true;
    //Prevent arrow keys from scrolling the page
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault();
}
function onKeyUp(e) {
    if (e.keyCode == 39) rightKey = false;
    else if (e.keyCode == 37) leftKey = false;
    if (e.keyCode == 38) upKey = false;
    else if (e.keyCode == 40) downKey = false;
}
$(document).on("keydown", onKeyDown);
$(document).on("keyup", onKeyUp);

//Main Document Ready JQuery Function - Accesses Draw Function With Interval To Animate
$(function() {
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        ctx.textAlign = "center";
        setInterval("draw()", drawSpeed);
    } else {
        console.log("Error:  Canvas unsupported, cannot get context.")
    }
});

//Helper Functions For Random Canvas Position
const randomX = () => Math.floor(Math.random()*(w-10)) + 10;
const randomY = () => Math.floor(Math.random()*(h-10)) + 10;

//Apple Constructor Function
function Apple(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.size = gameSize-2;
    this.color = "rgb(200, 25, 25)";
}

//Apple Display Function
Apple.prototype.display = function() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.size, 0, 2*Math.PI);
    ctx.fill();
}

//Create Multiple Apples
for (let i = 0; i < 5; i++) {
    apples.push(new Apple( randomX(), randomY() ) );
}

//Snake Constructor Function
function Snake(headX, headY) {
    this.headX = headX;
    this.headY = headY;
    this.bodX = [];
    this.bodY = [];
    this.bodLen = gameSize*10;
    this.bodSize = gameSize;
    this.color = "rgb(25, 100, 25)";
    this.goingUp = false;
    this.goingDown = false;
    this.goingLeft = false;
    this.goingRight = true;
}

//Snake Display Function
Snake.prototype.display = function() {
    ctx.fillStyle = this.color;
    for (let i = 0; i < this.bodX.length; i++) {
        ctx.beginPath();
        ctx.arc(this.bodX[i], this.bodY[i], this.bodSize, 0, 2*Math.PI);
        ctx.fill();
    }
}

//Snake Movement Update Function
Snake.prototype.update = function() {
    //Move snake in the direction it is already going
    if (this.goingUp) this.headY -= gameSpeed;
    if (this.goingDown) this.headY += gameSpeed;
    if (this.goingLeft) this.headX -= gameSpeed;
    if (this.goingRight) this.headX += gameSpeed;

    //Add the new coordinates to the snake body
    this.bodX.push(this.headX);
    this.bodY.push(this.headY);

    //Remove body coordinates to keep snake the right length;
    if (this.bodX.length > this.bodLen) {
        this.bodX.shift();
        this.bodY.shift();
    }

    //Player controls
    if (upKey && !this.goingDown) {
        this.goingUp = true;
        this.goingLeft = false;
        this.goingRight = false;
    }
    if (downKey && !this.goingUp) {
        this.goingDown = true;
        this.goingLeft = false;
        this.goingRight = false;
    }
    if (leftKey && !this.goingRight) {
        this.goingLeft = true;
        this.goingUp = false;
        this.goingDown = false;
    }
    if (rightKey && !this.goingLeft) {
        this.goingRight = true;
        this.goingUp = false;
        this.goingDown = false;
    }
}

//Snake Collision Checking
Snake.prototype.checkCollisions = function() {

    //Check for walls/border of canvas
    if (this.headY <= this.bodSize || this.headY >= h-this.bodSize || this.headX <= this.bodSize || this.headX >= w-this.bodSize) gameOver = true;

    //Check for collisions with snake body starting from "neck" all the way until end of tail
    for (let i = this.bodX.length-(this.bodSize*2); i > 0; i--) {
        if (Math.abs(this.headX - this.bodX[i]) < this.bodSize && Math.abs(this.headY - this.bodY[i]) < this.bodSize) gameOver = true;
    }

    //Check for apple collisions - increase snake length and game speed
    for (let i = 0; i < apples.length; i++) {
        if (Math.abs(this.headX - apples[i].posX) < this.bodSize && Math.abs(this.headY - apples[i].posY) < this.bodSize) {
            apples[i].posX = randomX();
            apples[i].posY = randomY();
            this.bodLen += gameSize*2;
            gameSpeed += (gameSpeed/30);
            score += 1000;
        }
    }
}

//Create Instance Of Snake
let snake = new Snake(w/2, h/2);

//Game Over Function
function showGameOver() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "white";
    ctx.font = "48px sans-serif";
    ctx.fillText("Game Over", w/2, h/2);
    ctx.font = "30px serif";
    ctx.fillText("Score: " + score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), w/2, h/1.5);
    scoreTitle.style.display = "none";
    gameOverBtn.style.display = "inline-block";
    console.log("Game Stopped");
}

//Play Game Function
function playGame() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < apples.length; i++) apples[i].display();
    snake.display();
    snake.update();
    snake.checkCollisions();
    score++;
    scoreTitle.style.display = "inline-block";
    scoreTitle.textContent = "Score: " + score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log("Game Running");
}

//Draw Function For Animating Game
function draw() {
    if (gameOver) showGameOver();
    else playGame();
}
