const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

function moveNoButton() {
  const x = Math.random() * 300 - 150;
  const y = Math.random() * 150 - 75;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton);

yesBtn.addEventListener("click", () => {
  document.getElementById("page1").classList.add("hidden");
  document.getElementById("page2").classList.remove("hidden");
  startConfetti();
});

function goBack() {
  document.getElementById("page2").classList.add("hidden");
  document.getElementById("page1").classList.remove("hidden");
}

function startConfetti() {
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
    confetti.style.background = `hsl(${Math.random()*360},100%,50%)`;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 5000);
  }
}
