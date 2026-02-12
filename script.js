const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

function escapeButton() {
  const x = Math.random() * (window.innerWidth - 120);
  const y = Math.random() * (window.innerHeight - 60);

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

noBtn.addEventListener("mouseenter", escapeButton);
noBtn.addEventListener("touchstart", escapeButton);

yesBtn.addEventListener("click", () => {
  document.getElementById("page1").classList.add("hidden");
  document.getElementById("page2").classList.remove("hidden");
  startConfetti();
  startHearts();
});

function goBack() {
  document.getElementById("page2").classList.add("hidden");
  document.getElementById("page1").classList.remove("hidden");
}

function startConfetti() {
  for (let i = 0; i < 120; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random()*100 + "vw";
    c.style.background = `hsl(${Math.random()*360},100%,60%)`;
    c.style.animationDuration = Math.random()*3+2+"s";
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),5000);
  }
}

function startHearts() {
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random()*100+"vw";
    document.body.appendChild(heart);
    setTimeout(()=>heart.remove(),6000);
  }, 400);
}
