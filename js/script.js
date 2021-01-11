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
let gameOver = false;
let gameSpeed = 1; //How far snake moves each frame
let gameSize = 8; //Determines size of snake and apples on screen
let drawSpeed = 10; //Draw function interval speed - lower number = faster
let apples = [];
const w = canvas.width;
const h = canvas.height;

//HTML Variables
const gameOverTitle = document.getElementById("gameOverTitle");
const gameOverBtn = document.getElementById("gameOverBtn");
gameOverBtn.addEventListener("click", resetGame);
function resetGame() {
    gameOver = false;
    snake.headX = w/2;
    snake.headY = h/2;
    snake.bodX = [];
    snake.bodY = [];
    snake.bodLen = 200;
    snake.goingUp = false;
    snake.goingDown = false;
    snake.goingLeft = false;
    snake.goingRight = true;
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

//Main JQuery Function After Document Ready
$(function() {
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        gameOverTitle.style.display = "none";
        gameOverBtn.style.display = "none";
        setInterval("draw()", drawSpeed);
    } else {
        console.log("Error:  Canvas unsupported, cannot get context.")
    }
});

//Random Canvas Position Helper Functions
function randomX() {
    return Math.floor(Math.random()*(w-10)) + 10;
}
function randomY() {
    return Math.floor(Math.random()*(h-10)) + 10;
}

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
    this.bodLen = 200;
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

    //Check for collisions with snake body
    for (let i = this.bodSize; i < this.bodX.length; i++) {
        if (this.goingUp && this.headX === this.bodX[i] && this.headY-this.bodSize === this.bodY[i]) gameOver = true;
        if (this.goingDown && this.headX === this.bodX[i] && this.headY+this.bodSize === this.bodY[i]) gameOver = true;
        if (this.goingLeft && this.headY === this.bodY[i] && this.headX-this.bodSize === this.bodX[i]) gameOver = true;
        if (this.goingRight && this.headY === this.bodY[i] && this.headX+this.bodSize === this.bodX[i]) gameOver = true;
    }

    //Check for apple collisions
    for (let i = 0; i < apples.length; i++) {
        if (Math.abs(this.headX - apples[i].posX) < this.bodSize && Math.abs(this.headY - apples[i].posY) < this.bodSize) {
            apples[i].posX = randomX();
            apples[i].posY = randomY();
            this.bodLen += 100;
        }
    }
}

let snake = new Snake(w/2, h/2);

function draw() {
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);
        gameOverTitle.style.display = "inline-block";
        gameOverBtn.style.display = "inline-block";
    } else {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < apples.length; i++) apples[i].display();
        snake.display();
        snake.update();
        snake.checkCollisions();
    }
}
