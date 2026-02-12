const noBtn = document.getElementById("no-btn");
const yesBtn = document.getElementById("yes-btn");
const firstCard = document.getElementById("first-card");
const secondCard = document.getElementById("second-card");
const backBtn = document.getElementById("back-btn");

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
let animating = false;

// Initialize No button position
function initNoButton() {
  const cardRect = firstCard.getBoundingClientRect();
  currentX = cardRect.width/2 + 60;
  currentY = cardRect.height/2 + 40;
  noBtn.style.left = currentX + "px";
  noBtn.style.top = currentY + "px";
}
initNoButton();

// Escape behavior
noBtn.addEventListener("mouseenter", () => {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const btnRect = noBtn.getBoundingClientRect();
  const margin = 50;

  targetX = Math.random() * (screenW - btnRect.width - margin);
  targetY = Math.random() * (screenH - btnRect.height - margin);

  if (!animating) animateNoBtn();
});

function animateNoBtn() {
  animating = true;
  function step() {
    currentX = lerp(currentX, targetX, 0.1);
    currentY = lerp(currentY, targetY, 0.1);
    noBtn.style.left = currentX + "px";
    noBtn.style.top = currentY + "px";

    if (Math.abs(currentX - targetX) > 0.5 || Math.abs(currentY - targetY) > 0.5) {
      requestAnimationFrame(step);
    } else {
      animating = false;
    }
  }
  requestAnimationFrame(step);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Yes button behavior
yesBtn.addEventListener("click", () => {
  firstCard.style.opacity = "0";
  firstCard.style.transform = "scale(0.9)";
  setTimeout(() => {
    firstCard.classList.add("hidden");
    secondCard.classList.remove("hidden");
    secondCard.style.opacity = "1";
    secondCard.style.transform = "scale(1)";
    createHeartsBurst();
  }, 500);
});

// Hearts burst
function createHeartsBurst() {
  const colors = ["#ffb6c1", "#ff69b4", "#ffc0cb", "#ff7f7f"];
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "💖";
    heart.style.left = (window.innerWidth/2 + (Math.random()*200 - 100)) + "px";
    heart.style.top = (window.innerHeight/2) + "px";
    heart.style.color = colors[Math.floor(Math.random()*colors.length)];
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 4000);
  }
}

// Back button
backBtn.addEventListener("click", () => {
  secondCard.classList.add("hidden");
  firstCard.classList.remove("hidden");
  firstCard.style.opacity = "1";
  firstCard.style.transform = "scale(1)";
  initNoButton();
});
