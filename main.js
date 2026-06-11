// // ELEMENTS
// const trexElement = document.querySelector(".charecter");
// const treeElement = document.querySelector(".block");

// //RESTART PAGE ELEMENTS
// let restartPage = document.querySelector(".restart-page");
// let restartButton = document.querySelector(".restart-btn");

// //❗❗ما توی سی  اس اس یک کلاسی دادیم که در اون گفتیم اگر این کلاس را دایناسور ما داشت به اندازهییه مقداری بیاد بالا پس سی اس اس نقش مهمی دارد توجه‼❗❗

// // keydown:
// // وقتی کلید را فشار می‌دهی همون لحظه اجرا می‌شود.
// // keyup:
// // وقتی کلید رارها می کنی اجرا می شود.

// // JUMP T-REX CHARECTER WHEN WE CLICK SPACE BUTTON
// //keyup  ==  یعنی وقتی که دست ما خورد به دکمه و برداشته شد اون موقغ این ایونت اجرا بشه
// document.addEventListener("keyup", (e) => {
//   if (e.key === " ") {
//     trexElement.classList.add("jumpAnimate");
//     setTimeout(() => {
//       trexElement.classList.remove("jumpAnimate");
//     }, 500); //این مقدار ی که در روبرو می بینید باید برابر باشد با مقداری که در سسی اس اس در انیمیشن دادیم
//   }
// });

// // CHECK IF LOSE OR NOT ===  چک می کند که ما باخ یم یا که نه
// let checkCondition = () => {
//   // getComputedStyle() ==  گرفتن یک استیل خاصی از توی سی اس اس
//   //تبدیل رشته به عدد صحیح با پارس اینت
//   /* گرفتن فاصله دایناسور از بالا */
//   const trexTop = parseInt(window.getComputedStyle(trexElement).top);
//   /* گرفتن فاصله درخت از سمت چپ*/
//   const treeLeft = parseInt(window.getComputedStyle(treeElement).left);

//   if (treeLeft < 90 && trexTop <= 230) {
//     trexElement.style.top = `${trexTop}px`; //یعنی وقتی از روی درخته نپریده باشه در همون جایش وایسه وبی حرکت
//     treeElement.style.display = "none"; //و باید اون درخت وقتی باختیم ناپدید بشه
//     restartPage.classList.add("show-restart-page");
//     clearInterval(trexInterval); //ما وقتی دیگه باختیم دیگه نمی خواییم کد ها اجرا بشه چ.ن باعث کندی سایت هم می شود پس بخاطر همین باید کد ها را متفقف کنیم یا همون فانکشن را
//   }
// };
// // CALLS CHECKCONDITION FUNCTION EVERY 10 MS  == میاد اون فانکشن را هر ده می لی ثانیه فراخوانی می کنه
// const trexInterval = setInterval(checkCondition, 10);

// //RESTART WHEN WE CLICK RESTARTBUTTON
// restartButton.addEventListener("click", () => {
//   restartPage.classList.remove("show-restart-page");
//   trexElement.style.top = "";
//   treeElement.style.display = "block";
//   setInterval(checkCondition, 10);
// });

const trexElement = document.querySelector(".charecter");
const treeElement = document.querySelector(".block");
const restartPage = document.querySelector(".restart-page");
const restartButton = document.querySelector(".restart-btn");
const scoreElement = document.getElementById("score");
const finalScoreElement = document.getElementById("finalScore");
const highScoreElement = document.getElementById("highScore");
const bestScoreDisplay = document.getElementById("bestScoreDisplay");
const themeToggle = document.getElementById("themeToggle");
const stopBtn = document.getElementById("stopBtn");
const colorOptions = document.querySelectorAll(".color-option");
const dinoBody = document.querySelector(".dino-body");
const dinoLegs = document.querySelectorAll(".dino-leg");
const dinoArm = document.querySelector(".dino-arm");
const gameBox = document.querySelector(".game-box");

let score = 0;
let gameRunning = true;
let isPaused = false;
let gameLoop = null;
let scoreLoop = null;
let isJumping = false;
let highScore = 0;
let originalLeft = 35;

function loadHighScore() {
  const saved = localStorage.getItem("dinoDashHighScore");
  highScore = saved ? parseInt(saved) : 0;
  highScoreElement.textContent = highScore;
  if (bestScoreDisplay) bestScoreDisplay.textContent = highScore;
}

function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("dinoDashHighScore", highScore);
    highScoreElement.textContent = highScore;
    if (bestScoreDisplay) bestScoreDisplay.textContent = highScore;
  }
}

function jump() {
  if (!gameRunning || isPaused || isJumping) return;

  isJumping = true;
  trexElement.classList.add("jumpAnimate");

  const isMobile = window.innerWidth <= 768;
  const jumpForward = isMobile ? 45 : 60;

  trexElement.style.left = originalLeft + jumpForward + "px";

  setTimeout(() => {
    trexElement.classList.remove("jumpAnimate");
    trexElement.style.left = originalLeft + "px";
    setTimeout(() => {
      isJumping = false;
    }, 100);
  }, 500);
}

function startGame() {
  if (gameLoop) clearInterval(gameLoop);
  if (scoreLoop) clearInterval(scoreLoop);

  gameRunning = true;
  isPaused = false;
  isJumping = false;
  score = 0;
  scoreElement.textContent = "0";

  trexElement.classList.remove("jumpAnimate");
  trexElement.style.bottom = "20px";
  trexElement.style.left = originalLeft + "px";

  treeElement.classList.remove("move");
  treeElement.style.left = "100%";

  document.body.classList.remove("paused");
  stopBtn.innerHTML = "⏸️ Stop";
  stopBtn.style.background = "";
  stopBtn.style.color = "";

  setTimeout(() => {
    if (gameRunning && !isPaused) {
      treeElement.classList.add("move");
    }
  }, 100);

  restartPage.classList.remove("show-restart-page");

  gameLoop = setInterval(checkCollision, 16);
  scoreLoop = setInterval(() => {
    if (gameRunning && !isPaused) {
      score++;
      scoreElement.textContent = score;
    }
  }, 100);
}

function pauseGame() {
  if (!gameRunning) return;
  isPaused = true;
  document.body.classList.add("paused");
  treeElement.style.animationPlayState = "paused";
  stopBtn.innerHTML = "▶️ Start";
  stopBtn.style.background = "#4ade80";
  stopBtn.style.color = "#000";
}

function resumeGame() {
  if (!gameRunning) return;
  isPaused = false;
  document.body.classList.remove("paused");
  treeElement.style.animationPlayState = "running";
  stopBtn.innerHTML = "⏸️ Stop";
  stopBtn.style.background = "";
  stopBtn.style.color = "";
}

function togglePause() {
  if (!gameRunning) return;
  isPaused ? resumeGame() : pauseGame();
}

function checkCollision() {
  if (!gameRunning || isPaused || isJumping) return;

  const trexRect = trexElement.getBoundingClientRect();
  const treeRect = treeElement.getBoundingClientRect();
  const gameRect = document.querySelector(".game-box").getBoundingClientRect();

  const trexAdjusted = {
    left: trexRect.left - gameRect.left,
    right: trexRect.right - gameRect.left,
    bottom: trexRect.bottom - gameRect.top,
  };

  const treeAdjusted = {
    left: treeRect.left - gameRect.left,
    right: treeRect.right - gameRect.left,
    bottom: treeRect.bottom - gameRect.top,
  };

  const collisionX =
    trexAdjusted.right > treeAdjusted.left + 5 &&
    trexAdjusted.left + 5 < treeAdjusted.right;
  const collisionY = trexAdjusted.bottom > treeAdjusted.bottom - 25;

  if (collisionX && collisionY) {
    gameOver();
  }
}

function gameOver() {
  if (!gameRunning) return;

  saveHighScore();
  gameRunning = false;
  finalScoreElement.textContent = score;
  if (bestScoreDisplay) bestScoreDisplay.textContent = highScore;
  restartPage.classList.add("show-restart-page");

  if (gameLoop) clearInterval(gameLoop);
  if (scoreLoop) clearInterval(scoreLoop);
}

document.addEventListener("keydown", (e) => {
  if (
    (e.key === " " || e.key === "ArrowUp") &&
    !isPaused &&
    !isJumping &&
    gameRunning
  ) {
    e.preventDefault();
    jump();
  }
});

gameBox.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!isPaused && !isJumping && gameRunning) {
    jump();
  }
});

gameBox.addEventListener("touchstart", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!isPaused && !isJumping && gameRunning) {
    jump();
  }
});

restartButton.addEventListener("click", () => {
  startGame();
});

stopBtn.addEventListener("click", togglePause);

themeToggle.addEventListener("click", () => {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");
  if (currentTheme === "dark") {
    body.setAttribute("data-theme", "light");
    themeToggle.textContent = "☀️";
  } else {
    body.setAttribute("data-theme", "dark");
    themeToggle.textContent = "🌙";
  }
});

colorOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    e.stopPropagation();
    const color = option.getAttribute("data-color");
    dinoBody.style.fill = color;
    dinoLegs.forEach((leg) => (leg.style.fill = color));
    dinoArm.style.fill = color;
  });
});

loadHighScore();
startGame();