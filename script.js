const noBtn = document.getElementById("no-btn");
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
function triggerEscape(e) {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const btnRect = noBtn.getBoundingClientRect();

  // Cursor/touch position
  let pointerX = e.clientX || (e.touches && e.touches[0].clientX);
  let pointerY = e.clientY || (e.touches && e.touches[0].clientY);

  // Decide direction away from pointer
  let offsetX = (btnRect.left + btnRect.width/2 < pointerX) ? -100 : 100;
  let offsetY = (btnRect.top + btnRect.height/2 < pointerY) ? -60 : 60;

  targetX = btnRect.left + offsetX;
  targetY = btnRect.top + offsetY;

  // Clamp inside screen
  targetX = Math.max(20, Math.min(screenW - btnRect.width - 20, targetX));
  targetY = Math.max(20, Math.min(screenH - btnRect.height - 20, targetY));

  noBtn.style.position = "absolute";

  if (!animating) animateNoBtn();
}

noBtn.addEventListener("mouseenter", triggerEscape);
noBtn.addEventListener("touchstart", triggerEscape);

function animateNoBtn() {
  animating = true;
  function step() {
    currentX = lerp(currentX, targetX, 0.12);
    currentY = lerp(currentY, targetY, 0.12);
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
