// === Dynamic DOM & Styles =========================================
// Create a <style> element and add CSS rules as a string (String data type)
const style = document.createElement('style'); // variable holds a DOM element
// back-tick template String
style.textContent = `
  body {
    margin: 0;
    background: #000;
    color: #fff;
    font-family: Arial, sans-serif;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #scoreboard { font-size: 24px; margin: 10px; }
  #cooldowns {
    display: flex; justify-content: space-between;
    width: 400px; margin-bottom: 5px; font-size: 18px;
  }
  canvas {
    background: #111; display: block;
    border: 2px solid #fff; border-radius: 10px;
  }
  button {
    margin: 5px; font-size: 16px; padding: 5px 10px;
  }
  #winner {
    font-size: 28px;
    margin-top: 10px;
    color: #0f0;
  }
`;
document.head.appendChild(style); // DOM method call (function), side-effect operation

// Create and configure DOM elements (Objects in memory)
const scoreboard = document.createElement('div');
scoreboard.id = 'scoreboard';
scoreboard.textContent = '0 : 0'; // String literal

const cooldowns = document.createElement('div');
cooldowns.id = 'cooldowns';
// template String with HTML
cooldowns.innerHTML = `
  <div id="leftCD">Left Gun: Ready</div>
  <div id="rightCD">Right Gun: Ready</div>
`;

const controls = document.createElement('div');
controls.innerHTML = `
  <button id="start">Start</button>
  <button id="pause">Pause</button>
  <button id="reset">Reset</button>
  <button id="mode">Mode: 1v1</button>
`;

const winnerMsg = document.createElement('div');
winnerMsg.id = 'winner';

const canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
canvas.width = 800;   // Number data type
canvas.height = 500;

document.body.append(scoreboard, cooldowns, controls, winnerMsg, canvas); // append multiple nodes

// === Game Variables ================================================
// Variables store numbers, booleans, and references (data types: Number, Boolean)
const ctx = canvas.getContext('2d');

let leftScore = 0, rightScore = 0;  // Numbers
let running = false, modeAI = false; // Booleans

const paddleWidth = 12, paddleHeight = 80; // Numbers
let leftY = canvas.height/2 - paddleHeight/2; // Math expression
let rightY = canvas.height/2 - paddleHeight/2;
let paddleSpeed = 10;

let ballX = canvas.width/2, ballY = canvas.height/2;
let ballSpeedX = 6, ballSpeedY = 6;
const ballRadius = 10;

const bullets = []; // Array to hold bullet objects

const bulletSpeed = 8;
const freezeTime = 5000;
const gunCooldown = 3000;
let leftGunReady = true, rightGunReady = true; // Booleans
let leftFreeze = false, rightFreeze = false;   // Booleans

const keys = {}; // Object used as a map of pressed keys
const winScore = 5;

// === Sounds ========================================================
// Construct Audio objects (built-in class)
const sndPaddle = new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg');
const sndScore  = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
const sndShoot  = new Audio('https://actions.google.com/sounds/v1/cartoon/metallic_twang.ogg');

// === DOM Event Listeners ===========================================
// Arrow functions and event listeners (functions as first-class objects)
document.addEventListener('keydown', e => keys[e.key] = true);   // set Boolean true
document.addEventListener('keyup',   e => keys[e.key] = false);  // set Boolean false

document.getElementById('start').onclick = () => {
  // Conditional: only start if not already running
  if (!running) {                  // Logical NOT operator
    running = true;
    requestAnimationFrame(gameLoop); // Built-in browser iteration via callback
  }
};
document.getElementById('pause').onclick = () => running = false; // assignment operation
document.getElementById('reset').onclick = resetGame;
document.getElementById('mode').onclick = () => {
  modeAI = !modeAI; // Boolean NOT toggles value (logical operator)
  document.getElementById('mode').textContent = `Mode: ${modeAI ? '1vAI' : '1v1'}`; // conditional (ternary)
  resetGame();
};

// === Game Functions ================================================
// Function definitions with side effects and returns where needed

function resetGame(){
  // multiple assignments (operations)
  leftScore = 0; rightScore = 0;
  leftY = canvas.height/2 - paddleHeight/2;
  rightY = canvas.height/2 - paddleHeight/2;
  winnerMsg.textContent = '';
  running = false;
  resetBall(); 
  updateScoreboard();
}

function resetBall(){
  // Random direction using Math.random() and conditional operator
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedX = (Math.random() > 0.5 ? 6 : -6); // ternary conditional
  ballSpeedY = (Math.random() > 0.5 ? 6 : -6);
}

function updateScoreboard(){
  scoreboard.textContent = `${leftScore} : ${rightScore}`; // template String
}

function declareWinner(winner){
  winnerMsg.textContent = `${winner} Wins!`;
  running = false;
}

function shootBullet(isLeft){
  // Nested conditionals check side and cooldown
  if(isLeft && leftGunReady){ // Boolean AND
    bullets.push({x: 20 + paddleWidth, y: leftY + paddleHeight/2, vx: bulletSpeed, from:'left'}); // push into Array
    leftGunReady = false;
    document.getElementById('leftCD').textContent = 'Left Gun: Cooldown';
    sndShoot.play();
    // setTimeout demonstrates asynchronous callback
    setTimeout(()=>{ 
      leftGunReady = true;
      document.getElementById('leftCD').textContent = 'Left Gun: Ready';
    }, gunCooldown);
  }
  if(!isLeft && rightGunReady){
    bullets.push({x: canvas.width - 20 - paddleWidth, y: rightY + paddleHeight/2, vx: -bulletSpeed, from:'right'});
    rightGunReady = false;
    document.getElementById('rightCD').textContent = 'Right Gun: Cooldown';
    sndShoot.play();
    setTimeout(()=>{ 
      rightGunReady = true;
      document.getElementById('rightCD').textContent = 'Right Gun: Ready';
    }, gunCooldown);
  }
}

function handleInput(){
  // Control flow with conditionals
  if(keys['w'] && leftY > 0 && !leftFreeze) leftY -= paddleSpeed;  // math operation
  if(keys['s'] && leftY < canvas.height - paddleHeight && !leftFreeze) leftY += paddleSpeed;

  if(modeAI){
    // Simple AI: uses math and random error
    if(!rightFreeze){
      const center = rightY + paddleHeight/2;
      const error = (Math.random() - 0.5) * 20;
      if(center < ballY - 10 + error) rightY += paddleSpeed * 0.9;
      else if(center > ballY + 10 + error) rightY -= paddleSpeed * 0.9;
    }
  } else {
    if(keys['ArrowUp']   && rightY > 0 && !rightFreeze) rightY -= paddleSpeed;
    if(keys['ArrowDown'] && rightY < canvas.height - paddleHeight && !rightFreeze) rightY += paddleSpeed;
  }

  // Shooting checks
  if(keys['d'])        { shootBullet(true);  keys['d'] = false; }
  if(keys['ArrowLeft']){ shootBullet(false); keys['ArrowLeft'] = false; }
}

function update(){
  // Ball movement math expressions
  ballX += ballSpeedX; 
  ballY += ballSpeedY;
  if(ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) ballSpeedY *= -1; // logical OR

  // Paddle collisions
  if(ballX - ballRadius < 20 + paddleWidth && ballY > leftY && ballY < leftY + paddleHeight){
    ballSpeedX *= -1; ballX = 20 + paddleWidth + ballRadius;
    sndPaddle.play();
  }
  if(ballX + ballRadius > canvas.width - 20 - paddleWidth && ballY > rightY && ballY < rightY + paddleHeight){
    ballSpeedX *= -1; ballX = canvas.width - 20 - paddleWidth - ballRadius;
    sndPaddle.play();
  }

  // Scoring conditionals
  if(ballX < 0){
    rightScore++; updateScoreboard(); sndScore.play();
    if(rightScore >= winScore) declareWinner('Right Player'); // nested condition
    else resetBall();
  }
  if(ballX > canvas.width){
    leftScore++; updateScoreboard(); sndScore.play();
    if(leftScore >= winScore) declareWinner('Left Player');
    else resetBall();
  }

  // Iterate backwards through bullets Array (iteration)
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx;

    // Collision detection with conditionals
    if(b.from==='left'  && b.x + 5 >= canvas.width - 20 - paddleWidth && b.y > rightY && b.y < rightY + paddleHeight){
      rightFreeze = true; setTimeout(()=>{rightFreeze=false;}, freezeTime); bullets.splice(i,1);
    }
    else if(b.from==='right' && b.x - 5 <= 20 + paddleWidth && b.y > leftY  && b.y < leftY  + paddleHeight){
      leftFreeze = true;  setTimeout(()=>{leftFreeze=false;},  freezeTime); bullets.splice(i,1);
    }
    else if(b.x < 0 || b.x > canvas.width) bullets.splice(i,1);
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw center line with canvas API
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Ball
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
  ctx.fill();

  // Paddles
  ctx.fillStyle = '#0f0';
  ctx.fillRect(20, leftY, paddleWidth, paddleHeight);
  ctx.fillStyle = '#f00';
  ctx.fillRect(canvas.width - 20 - paddleWidth, rightY, paddleHeight, paddleHeight);

  // Bullets
  ctx.fillStyle = '#ff0';
  bullets.forEach(b => ctx.fillRect(b.x - 4, b.y - 4, 8, 8)); // forEach = iteration
}

function gameLoop(){
  if (!running) return; // Conditional early exit
  handleInput();
  update();
  draw();
  requestAnimationFrame(gameLoop); // recursion-like continuous iteration
}
// End of code
