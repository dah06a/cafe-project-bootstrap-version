//Canvas Global Variables
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx;

//Key Pressed Global Variables
let upKey = false;
let doKey = false;
let leKey = false;
let riKey = false;

//Game Global Variables
let gameStarted = false;
let noInput = true;
const w = canvas.width;
const h = canvas.height;

//Main JQuery Function After Document Ready
$(function() {
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        console.log(canvas);
        setInterval("draw()", 2000);
    } else {
        console.log("Error:  Canvas unsupported, cannot get context.")
    }
});

//Snake Constructor Function
function Snake(headX, headY) {
    this.headX = headX;
    this.headY = headY;
    this.bodyX = [];
    this.bodyY = [];
    this.bodyLength = 50;
    this.hasCollided = false;
    this.goingUp = false;
    this.goingDown = false;
    this.goingLeft = false;
    this.goingRight = true;
}

//Snake Display
Snake.prototype.display = function() {
    ctx.fillStyle = "rgb(130, 200, 100)";
    ctx.beginPath();
    ctx.arc(this.headX, this.headY, 5, 0, 2*Math.PI, true);
    ctx.fill();
}

let snake = new Snake(w/2, h/2);

function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
}

function draw() {
    snake.display();
    console.log("Draw Function Working");
}
