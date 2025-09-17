let lives = 3;
let timeSurvived = 0;
let crackProgress = 100;
let gameOverFlag = false;
let interval, timer;
let level = 1;
let hackerSpeed = 1000; // ms
let crackRate = 5;      // how fast hackers crack each tick

const input = document.getElementById("password-input");
const strengthText = document.getElementById("strength");
const progress = document.getElementById("progress");
const livesEl = document.getElementById("lives");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");
const restartBtn = document.getElementById("restart-btn");
const lightIndicator = document.getElementById("light-indicator");

function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

function updateStrength() {
  const pwd = input.value;
  const score = getPasswordStrength(pwd);
  let label = "Weak";
  let color = "red";

  if (score === 2) { label = "Medium"; color = "orange"; }
  else if (score === 3) { label = "Strong"; color = "yellow"; }
  else if (score === 4) { label = "Very Strong"; color = "lightgreen"; }

  strengthText.textContent = `Strength: ${label}`;
  strengthText.style.color = color;

  // Strong password blocks hackers instantly
  if (score >= 3) {
    showLight("green");
    nextLevel();
  }
}

function showLight(color) {
  lightIndicator.classList.remove("hidden");
  lightIndicator.style.background = color;
  setTimeout(() => {
    lightIndicator.classList.add("hidden");
  }, 1200);
}

function startGame() {
  interval = setInterval(() => {
    if (gameOverFlag) return;

    crackProgress -= crackRate; 
    progress.style.width = crackProgress + "%";

    if (crackProgress <= 0) {
      lives--;
      livesEl.textContent = lives;
      showLight("red");
      resetRound(false);
      if (lives <= 0) {
        endGame();
      }
    }
  }, hackerSpeed);

  timer = setInterval(() => {
    if (!gameOverFlag) {
      timeSurvived++;
      timeEl.textContent = timeSurvived;
    }
  }, 1000);
}

function nextLevel() {
  resetRound(true);
  level++;
  levelEl.textContent = level;

  // make hackers faster & stronger
  if (hackerSpeed > 400) hackerSpeed -= 100; 
  crackRate += 1; 

  clearInterval(interval);
  startGame();
}

function resetRound(success = false) {
  crackProgress = 100;
  progress.style.width = "100%";
  input.value = "";
  strengthText.textContent = "Strength: -";
}

function endGame() {
  clearInterval(interval);
  clearInterval(timer);
  gameOverFlag = true;
  document.getElementById("instructions").textContent = "💀 Hackers won! Game Over.";
  restartBtn.classList.remove("hidden");
  input.disabled = true;
}

function restartGame() {
  lives = 3;
  timeSurvived = 0;
  crackProgress = 100;
  gameOverFlag = false;
  level = 1;
  hackerSpeed = 1000;
  crackRate = 5;
  input.disabled = false;
  input.value = "";
  progress.style.width = "100%";
  strengthText.textContent = "Strength: -";
  livesEl.textContent = lives;
  timeEl.textContent = timeSurvived;
  levelEl.textContent = level;
  document.getElementById("instructions").textContent = "Type a strong password before hackers crack it!";
  restartBtn.classList.add("hidden");
  clearInterval(interval);
  clearInterval(timer);
  startGame();
}

input.addEventListener("input", updateStrength);

restartGame();
