//background canvas vasriables
var background = document.getElementById("background");
var bctx = background.getContext("2d");

// game canvas variables
var game = document.getElementById("game");
var ctx = game.getContext("2d");

//sound effect variables
var hitPins = new Audio("SoundEffects/BowlingPinsFalling.mp3");
var cheer = new Audio("SoundEffects/Cheer.mp3");
var groan = new Audio("SoundEffects/Groan.mp3");

//game variables
var pinCount = 10;
var frameCount = 1;
var throwNum = 1;
var score = 0;
var ballThrown;

//shape size variables
var ballRadius = 35;
var pinRadius = 20;

//keyboard handler variables
var spacePressed = false;
var upPressed = false;
var downPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//movement speed variables
var dx = 10;
var dy = 2;

//shape co-ordinate variables
var ballx = 40;
var bally = 175;


var pinsx = [850, 900, 900, 950, 950, 950, 1000, 1000, 1000, 1000];
var pinsy = [175, 145, 205, 115, 175, 235, 85, 145, 205, 265];

var currentPinLocx = [850, 900, 900, 950, 950, 950, 1000, 1000, 1000, 1000];
var currentPinLocy = [175, 145, 205, 115, 175, 235, 85, 145, 205, 265];

var pinKnockedx = 2000;
var pinKnockedy = 2000;

//key press handlers
function keyDownHandler(key) {
    if (key.keyCode == 32) {
        spacePressed = true;
        ballThrown = true;
    }
    if (key.keyCode == 38) {
        upPressed = true;
    }
    else if (key.keyCode == 40) {
        downPressed = true;
    }
}

function keyUpHandler(key) {
    if (key.keyCode == 38) {
        upPressed = false;
    }
    else if (key.keyCode == 40) {
        downPressed = false;
    }
}

//Draw background (bowling lane)
function drawBackground() {
    //initialise images
    var backgroundImage = new Image();
    backgroundImage.src = "Images/bowlingLane.jpg";

    backgroundImage.onload = function () {
        bctx.drawImage(backgroundImage, 0, 50);
        bctx.fillStyle = "#e6e6ff";
        bctx.rect(0, 0, 1060, 52);
        bctx.rect(0, 300, 1060, 50);
        bctx.fill();
    };
}

//Draw bowling ball
function drawBall() {
    ctx.beginPath();    
    ctx.strokeStyle = "black";
    ctx.fillStyle = "#cc00ff";
    ctx.arc(ballx, bally, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    
    //Gutter balls possible when ball thrown
    if (ballThrown)
    {
        if (upPressed)
        {
            bally -= dy;
        }

        if (downPressed)
        {
            bally += dy;
        }

        if (spacePressed)
        {
            ballx += dx;
        }
    }

    //Gutter balls not possible when thrown
    else
    {
        if (upPressed && bally > 65)
        {
            bally -= dy;
        }

        if (downPressed && bally < 285)
        {
            bally += dy;
        }

        if (spacePressed)
        {
            ballx += dx;
        }
    }
    
}

//Draw pins
function drawPins()
{
    for(var i = 0; i<10; i++)
    {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "#FFFFFF";
        ctx.arc(currentPinLocx[i], currentPinLocy[i], pinRadius, 0, Math.PI * 2);        
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
}

//Draw text
function drawText()
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(" CT404 Project - Niall's Bowling Extravaganza - Niall Martin - 12301341", 300, 20);
    ctx.fillText("Controls: Move Ball Up - Up Arrow Key     Move Ball Down - Down Arrow Key    Throw Ball - Spacebar", 10, 330);
    ctx.fillText("Frame: " + frameCount + "/5", 850, 330);
    ctx.fillText("Score: " + score, 950, 330);
}

//Detect Collisions between ball and pins, between ball and gutter, etc.
function collisions()
{
    var collision = false;
    for (var i = 0; i < 10; i++)
    {
        var distancex = ballx - currentPinLocx[i];
        var distancey = bally - currentPinLocy[i];

        var distance = Math.sqrt(distancex * distancex + distancey * distancey);
        //if ball hits pins
        if(distance < ballRadius + pinRadius)
        {
            collision = true;
            currentPinLocx[i] = pinKnockedx;
            currentPinLocy[i] = pinKnockedy;
            pinCount--;
            score++;
        }
        
        if(collision)
        {
            hitPins.play();
        }
    }

    //if ball goes off the side
    if (spacePressed == true && (bally < 50 || bally > 300))
    {
        groan.play();
        alert("Gutter ball!");
        reset();
    }

    //if ball hits end of lane
    if (ballx > game.width)
    {
        reset();
    }
}

//set ball back to behind fault line, and if needed reset pins
function reset()
{
    //make sure ball doesn't do anything after it is reset.
    spacePressed = false;
    ballThrown = false;
    upPressed = false;
    downPressed = false;

    if (frameCount < 6)
    {
        spacePressed = false;
        ballx = 40;
        bally = 175;
        throwNum++;

        if (pinCount == 0)
        {
            cheer.play();
            alert("Strike! 10 bonus points!")
            score += 10;
        }

        if (pinCount == 0 || throwNum%2 !== 0)
        {
            //reset pin locations
            for (var i = 0; i < 10; i++)
            {
                currentPinLocx[i] = pinsx[i];
                currentPinLocy[i] = pinsy[i];
                pinCount = 10;
            }
            frameCount ++;
        }
        
        drawPins();
    }

    else
    {
        alert("Game Over. You scored " +  score + ".");
        ballx = 40;
        bally = 175;
        document.location.reload();
    }
}

//Main method
function draw() {
    ctx.clearRect(0, 0, game.width, game.height);
    drawBackground();
    drawText();
    drawBall();
    drawPins();
    collisions();
    requestAnimationFrame(draw);
}

draw();