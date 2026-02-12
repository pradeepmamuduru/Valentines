const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

function getBounds() {
  const rect = page1.getBoundingClientRect();
  const overflowX = rect.width * 0.15;
  const overflowY = rect.height * 0.15;

  return {
    minX: rect.left - overflowX,
    maxX: rect.right - noBtn.offsetWidth + overflowX,
    minY: rect.top - overflowY,
    maxY: rect.bottom - noBtn.offsetHeight + overflowY
  };
}

function moveTarget() {
  const b = getBounds();
  targetX = Math.random() * (b.maxX - b.minX) + b.minX;
  targetY = Math.random() * (b.maxY - b.minY) + b.minY;
}

function animate() {
  currentX += (targetX - currentX) * 0.12;
  currentY += (targetY - currentY) * 0.12;

  noBtn.style.left = currentX + "px";
  noBtn.style.top = currentY + "px";

  requestAnimationFrame(animate);
}

animate();

noBtn.addEventListener("mouseenter", moveTarget);
noBtn.addEventListener("touchstart", moveTarget);

yesBtn.addEventListener("click", () => {
  createHearts();

  setTimeout(() => {
    page1.classList.add("hidden");
    page2.classList.remove("hidden");
  }, 600);
});

function goBack() {
  page2.classList.add("hidden");
  page1.classList.remove("hidden");
  moveTarget();
}

function createHearts() {
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("div");
    heart.className = "celebrate-heart";
    heart.innerHTML = "❤";
    heart.style.left = (window.innerWidth / 2 + (Math.random() * 200 - 100)) + "px";
    heart.style.top = (window.innerHeight / 2 + (Math.random() * 100 - 50)) + "px";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 3000);
  }
}
