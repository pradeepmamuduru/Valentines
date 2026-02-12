const noBtn = document.getElementById("no-btn");
const yesBtn = document.getElementById("yes-btn");
const valentineCard = document.getElementById("valentine-card");
const yayCard = document.getElementById("yay-card");
const backBtn = document.getElementById("back-btn");

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
let animating = false;

// Position No button initially inside card
function initNoButton() {
  const cardRect = valentineCard.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  currentX = cardRect.width/2 + 60;
  currentY = cardRect.height/2 + 40;
  noBtn.style.left = currentX + "px";
  noBtn.style.top = currentY + "px";
}
initNoButton();

// Escape behavior
noBtn.addEventListener("mouseenter", () => {
  const cardRect = valentineCard.getBoundingClientRect();
  const maxX = cardRect.width * 0.85;
  const maxY = cardRect.height * 0.85;
  const minX = cardRect.width * 0.15;
  const minY = cardRect.height * 0.15;

  targetX = Math.random() * (maxX - minX) + minX;
  targetY = Math.random() * (maxY - minY) + minY;

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
  createHeartsBurst();
  setTimeout(() => {
    valentineCard.classList.add("hidden");
    yayCard.classList.remove("hidden");
  }, 1000);
});

function createHeartsBurst() {
  const colors = ["#ff69b4", "#ff1493"];
  for (let i = 0; i < 10; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "💖";
    heart.style.left = (window.innerWidth/2 + (Math.random()*100 - 50)) + "px";
    heart.style.top = (window.innerHeight/2) + "px";
    heart.style.color = colors[Math.floor(Math.random()*colors.length)];
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 2000);
  }
}

// Back button
backBtn.addEventListener("click", () => {
  yayCard.classList.add("hidden");
  valentineCard.classList.remove("hidden");
  initNoButton();
});
