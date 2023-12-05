const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const birdImage = new Image();
birdImage.src = 'PngItem_2298921.png';

const pipeImage = new Image();
pipeImage.src = 'NicePng_pipes-png_388476.png';

const backgroundImage = new Image();
backgroundImage.src = '4094501.jpg';

const bird = {
    x: 100,
    y: canvas.height / 2 - 20,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: 10,
};

const pipes = [];

let isGameOver = false;
let score = 0;

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, 40, 40);
}

function drawPipe(pipe) {
    ctx.save();
    ctx.translate(pipe.x + pipe.width / 2, pipe.height.top);
    ctx.rotate(Math.PI);
    ctx.drawImage(pipeImage, -pipe.width / 2, 0, pipe.width, pipe.height.top);
    ctx.restore();
    ctx.drawImage(pipeImage, pipe.x, pipe.height.bottom + pipe.gap, pipe.width, canvas.height - pipe.height.bottom - pipe.gap);
}

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawScore() {
    // Draw a shadow
    ctx.fillStyle = '#000'; // Black
    ctx.font = '50px Arial';
    ctx.shadowColor = '#888'; // Shadow color
    ctx.shadowBlur = 10; // Shadow blur
    ctx.shadowOffsetX = 5; // Shadow offset X
    ctx.shadowOffsetY = 5; // Shadow offset Y
    ctx.fillText(`Score: ${score}`, canvas.width - 230, 50);

    // Draw the main text in yellow
    ctx.fillStyle = '#FFD700'; // Yellow
    ctx.font = '50px Arial';
    ctx.shadowColor = 'transparent'; // Reset shadow for the main text
    ctx.fillText(`Score: ${score}`, canvas.width - 230, 50);
}



function drawRetryExitButtons() {
    // Draw "Retry" button
    ctx.fillStyle = '#FFD700'; // Yellow
    const retryButtonX = canvas.width / 4 + 20;
    const retryButtonY = canvas.height / 2;
    const retryButtonWidth = canvas.width / 4 - 40;
    const retryButtonHeight = 50;
    ctx.fillRect(retryButtonX, retryButtonY, retryButtonWidth, retryButtonHeight);
    ctx.fillStyle = '#000'; // Black
    ctx.font = '20px Arial';

    // Calculate text position to center it on the button
    const retryTextWidth = ctx.measureText('Retry').width;
    const retryTextX = retryButtonX + (retryButtonWidth - retryTextWidth) / 2;
    const retryTextY = retryButtonY + retryButtonHeight / 2 + 5; // Adjust for vertical centering
    ctx.fillText('Retry', retryTextX, retryTextY);

    // Draw "Exit" button
    ctx.fillStyle = '#FFD700'; // Yellow
    const exitButtonX = canvas.width / 2 + 20;
    const exitButtonY = canvas.height / 2;
    const exitButtonWidth = canvas.width / 4 - 40;
    const exitButtonHeight = 50;
    ctx.fillRect(exitButtonX, exitButtonY, exitButtonWidth, exitButtonHeight);
    ctx.fillStyle = '#000'; // Black
    ctx.font = '20px Arial';

    // Calculate text position to center it on the button
    const exitTextWidth = ctx.measureText('Exit').width;
    const exitTextX = exitButtonX + (exitButtonWidth - exitTextWidth) / 2;
    const exitTextY = exitButtonY + exitButtonHeight / 2 + 5; // Adjust for vertical centering
    ctx.fillText('Exit', exitTextX, exitTextY);
}

function drawGameOver() {
    // Draw modal box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);

    // Draw "Game Over" message
    ctx.fillStyle = 'darkorange'; // Dark Orange color
    ctx.font = '40px Arial bold'; // Larger, bold font
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText(`Total Score: ${score}`, canvas.width / 2 - 80, canvas.height / 2 - 40);

    // Draw Retry and Exit buttons
    drawRetryExitButtons();
}

document.addEventListener('click', function (event) {
    if (isGameOver) {
        const retryButtonArea = {
            x: canvas.width / 4 + 20,
            y: canvas.height / 2,
            width: canvas.width / 4 - 40,
            height: 50,
        };

        const exitButtonArea = {
            x: canvas.width / 2 + 20,
            y: canvas.height / 2,
            width: canvas.width / 4 - 40,
            height: 50,
        };

        if (
            event.clientX >= retryButtonArea.x && event.clientX <= retryButtonArea.x + retryButtonArea.width &&
            event.clientY >= retryButtonArea.y && event.clientY <= retryButtonArea.y + retryButtonArea.height
        ) {
            alert("exit") ;// Use requestAnimationFrame to restart the game loop
        } else if (
            event.clientX >= exitButtonArea.x && event.clientX <= exitButtonArea.x + exitButtonArea.width &&
            event.clientY >= exitButtonArea.y && event.clientY <= exitButtonArea.y + exitButtonArea.height
        ) {
          resetGame();
          isGameOver = false; // Reset the game over state
          drawBackground(); // Redraw the background to remove the modal box
          frameCount = 0;
        }
    }
});

function update() {
    if (isGameOver) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y < 0 || bird.y + 40 > canvas.height) {
        gameOver();
        return;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 5;

        if (
            bird.x < pipes[i].x + pipes[i].width &&
            bird.x + 40 > pipes[i].x &&
            (bird.y < pipes[i].height.top || bird.y + 40 > pipes[i].height.bottom + pipes[i].gap)
        ) {
            gameOver();
            return;
        }

        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
        }

        if (pipes[i].x + pipes[i].width < bird.x && !pipes[i].scored) {
            pipes[i].scored = true;
            score++;
        }
    }

    if (frameCount % 100 === 0) {
        const birdSize = 40;
        const minHeight = 50;
        const maxHeight = canvas.height - minHeight;
        const gapHeight = Math.floor(Math.random() * (maxHeight - minHeight - birdSize * 3) + birdSize * 1.5);

        const pipeHeightTop = gapHeight - birdSize * 1.5;
        const pipeHeightBottom = canvas.height - gapHeight - birdSize * 1.5;

        pipes.push({
            x: canvas.width,
            width: 50,
            height: {
                top: pipeHeightTop,
                bottom: pipeHeightBottom,
            },
            gap: gapHeight,
            scored: false,
        });
    }

    frameCount++;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isGameOver) {
        drawGameOver();
    } else {
        drawBackground();
        update();
        drawBird();
        for (const pipe of pipes) {
            drawPipe(pipe);
        }
        drawScore();
    }

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    score = 0;
    isGameOver = false;
    bird.y = canvas.height / 2 - 20;
    bird.velocity = 0;
    pipes.length = 0;
    frameCount = 0;
}

function gameOver() {
    isGameOver = true;
}


document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !isGameOver) {
        bird.velocity = -bird.jumpStrength;
    } else if (event.code === 'Space' && isGameOver) {
        resetGame();
    }
});

document.addEventListener('click', function (event) {
    if (isGameOver && event.clientX >= canvas.width / 2 - 80 && event.clientX <= canvas.width / 2 + 80 &&
        event.clientY >= canvas.height / 2 + 20 && event.clientY <= canvas.height / 2 + 60) {
        resetGame();
    }
});

let frameCount = 0;
gameLoop();
