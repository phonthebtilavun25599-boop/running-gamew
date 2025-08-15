const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let player = {
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 30,
    dy: 0,
    gravity: 0.5,
    lift: -10,
    onScreen: true,
    color: '#00ffff' 
};

let obstacles = [];
let stars = [];
let obstacleTimer = 0;
let speed = 5;
let level = 1;
let score = 0;

for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.2
    });
}
function createObstacle() {
    let size = Math.random() * 30 + 20 + level * 5;
    obstacles.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - size),
        width: size,
        height: size,
        color: '#ff4500'
    });
}
function drawStars() {
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}
function updateStars() {
    stars.forEach(star => {
        star.x -= star.speed;
        if (star.x < 0) star.x = canvas.width;
    });
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStars();

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Level: ' + level, 10, 60);
}
function update() {
    updateStars();
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
    } 
    if (player.y < 0) {
        player.y = 0;
        player.dy = 0;
    }
    obstacles.forEach(obs => obs.x -= speed);

    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

    obstacleTimer++;
    if (obstacleTimer > 90) {
        createObstacle();
        obstacleTimer = 0;
    }
    obstacles.forEach(obs => {
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            alert('Game Over! Score: ' + score);
            document.location.reload();
        }
    });
    score++;
    if (score % 200 === 0) {
        level++;
        speed += 0.5;
    }
}
document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        player.dy = player.lift;
    }
});
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

function createObstacle() {
    let size = Math.random() * 30 + 20 + level * 5;
    let yPos = Math.random() * (canvas.height - size); 
    obstacles.push({
        x: canvas.width,
        y: yPos,
        width: size,
        height: size,
        color: '#ff4500',
        dy: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1) 
    });
}
obstacles.forEach(obs => {
    obs.x -= speed;
    obs.y += obs.dy;

    
    if (obs.y < 0 || obs.y + obs.height > canvas.height) {
        obs.dy *= -1;
    }
});

