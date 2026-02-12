const noBtn = document.getElementById("no-btn");
const yesBtn = document.getElementById("yes-btn");
const firstCard = document.getElementById("first-card");
const secondCard = document.getElementById("second-card");
const backBtn = document.getElementById("back-btn");

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
let animating = false;

// Reset No button inside card
function resetNoButton() {
  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
  currentX = 0;
  currentY = 0;
}
resetNoButton();

// Escape behavior
function triggerEscape() {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const btnRect = noBtn.getBoundingClientRect();
  const margin = 50;

  targetX = Math.random() * (screenW - btnRect.width - margin);
  targetY = Math.random() * (screenH - btnRect.height - margin);

  noBtn.style.position = "absolute";

  if (!animating) animateNoBtn();
}

noBtn.addEventListener("mouseenter", triggerEscape);
noBtn.addEventListener("touchstart", triggerEscape);

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
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "💖";
    heart.style.left = (Math.random() * window.innerWidth) + "px";
    heart.style.top = (window.innerHeight - 50) + "px";
    heart.style.color = colors[Math.floor(Math.random()*colors.length)];
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 5000);
  }
}

// Back button
backBtn.addEventListener("click", () => {
  secondCard.classList.add("hidden");
  firstCard.classList.remove("hidden");
  firstCard.style.opacity = "1";
  firstCard.style.transform = "scale(1)";
  resetNoButton();
});
