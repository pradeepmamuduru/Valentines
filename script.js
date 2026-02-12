// Elements
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const backTo1 = document.getElementById("back-to-1");
const to3 = document.getElementById("to-3");
const backTo2 = document.getElementById("back-to-2");
const screens = {
  1: document.getElementById("screen-1"),
  2: document.getElementById("screen-2"),
  3: document.getElementById("screen-3")
};
const audio = document.getElementById("love-audio");

let currentX = 0, currentY = 0, targetX = 0, targetY = 0, animating = false;
let noMessages = ["No Darling…!", "Not again 😁…!", "It’s not happening Babe😜", ];
let msgIndex = 0;

// Show screen helper
function showScreen(n) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[n].classList.add("active");
}

// Reset No button
function resetNoButton() {
  noBtn.textContent = "No 😡";
  msgIndex = 0;
  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
  currentX = 0; currentY = 0;
}

// Escape logic
function triggerEscape(e) {
  noBtn.textContent = noMessages[msgIndex];
  msgIndex = (msgIndex + 1) % noMessages.length;

  const btnRect = noBtn.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;
  const angle = Math.random() * Math.PI * 2;
  const distance = 120;
  targetX = currentX + Math.cos(angle) * distance;
  targetY = currentY + Math.sin(angle) * distance;

  targetX = Math.max(20, Math.min(vw - btnRect.width - 20, targetX));
  targetY = Math.max(20, Math.min(vh - btnRect.height - 20, targetY));

  noBtn.style.position = "absolute";
  if (!animating) animateNo();
}

function animateNo() {
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
function lerp(a,b,t){ return a+(b-a)*t; }

// Yes button: start music safely
yesBtn.addEventListener("click", () => {
  audio.play().catch(()=>{}); // safe for mobile autoplay
  showScreen(2);
});

// Navigation
backTo1.addEventListener("click", () => { showScreen(1); resetNoButton(); });
to3.addEventListener("click", () => showScreen(3));
backTo2.addEventListener("click", () => showScreen(2));

// No button events
noBtn.addEventListener("mouseenter", triggerEscape);
noBtn.addEventListener("touchstart", triggerEscape);

// Floating hearts
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "💖";
  heart.style.left = Math.random()*window.innerWidth+"px";
  heart.style.top = window.innerHeight+"px";
  heart.style.color = ["#ffb6c1","#ff69b4","#ffc0cb","#ff7f7f"][Math.floor(Math.random()*4)];
  document.body.appendChild(heart);
  const duration = 4000+Math.random()*2000;
  heart.animate([
    {transform:"translateY(0)",opacity:1},
    {transform:"translateY(-200px)",opacity:0}
  ],{duration,easing:"linear"});
  setTimeout(()=>heart.remove(),duration);
}
setInterval(spawnHeart,1200);

// Falling petals
function spawnPetal(){
  const petal=document.createElement("div");
  petal.className="petal";
  petal.textContent="🌹";
  petal.style.left=Math.random()*window.innerWidth+"px";
  petal.style.top="-30px";
  document.body.appendChild(petal);
  const duration=6000+Math.random()*4000;
  petal.animate([
    {transform:"translateY(0)",opacity:1},
    {transform:`translate(${(Math.random()-0.5)*200}px, ${window.innerHeight+60}px)`,opacity:0}
  ],{duration,easing:"linear"});
  setTimeout(()=>petal.remove(),duration);
}
setInterval(spawnPetal,1500);

// Initialize
resetNoButton();
showScreen(1);
