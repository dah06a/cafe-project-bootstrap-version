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
let gameStarted = true;
const w = canvas.width;
const h = canvas.height;

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
        console.log(canvas);
        setInterval("draw()", 10);
    } else {
        console.log("Error:  Canvas unsupported, cannot get context.")
    }
});

//Snake Constructor Function
function Snake(headX, headY) {
    this.headX = headX;
    this.headY = headY;
    this.bodX = [];
    this.bodY = [];
    this.bodLen = 50;
    this.hasCollided = false;
    this.goingUp = false;
    this.goingDown = false;
    this.goingLeft = false;
    this.goingRight = true;
}

//Snake Display Function
Snake.prototype.display = function() {
    ctx.fillStyle = "rgb(25, 100, 25)";
    for (let i = 0; i < this.bodX.length; i++) {
        ctx.beginPath();
        ctx.arc(this.bodX[i], this.bodY[i], 5, 0, 2*Math.PI, true);
        ctx.fill();
    }
}

//Snake Movement Update Function
Snake.prototype.update = function() {
    //Move snake in the direction it is already going
    if (this.goingUp) this.headY -= 1;
    if (this.goingDown) this.headY += 1;
    if (this.goingLeft) this.headX -= 1;
    if (this.goingRight) this.headX += 1;

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

let snake = new Snake(w/2, h/2);

function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
}

function draw() {
    clearCanvas();
    snake.display();
    snake.update();
    console.log(upKey, downKey, leftKey, rightKey);
}
