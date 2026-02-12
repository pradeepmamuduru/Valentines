const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

// keep inside 90% of screen
function moveNoBtn() {
  const maxX = window.innerWidth * 0.9 - noBtn.offsetWidth;
  const maxY = window.innerHeight * 0.9 - noBtn.offsetHeight;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

noBtn.addEventListener("mouseenter", moveNoBtn);
noBtn.addEventListener("touchstart", moveNoBtn);

yesBtn.addEventListener("click", () => {
  page1.classList.add("hidden");
  page2.classList.remove("hidden");
  startSparkles();
});

function goBack() {
  page2.classList.add("hidden");
  page1.classList.remove("hidden");

  // reset No button to center area
  noBtn.style.left = "55%";
  noBtn.style.top = "55%";
}

// sparkle stars
function startSparkles() {
  for(let i=0;i<80;i++){
    const star = document.createElement("div");
    star.className="star";
    star.innerHTML="✨";
    star.style.left=Math.random()*100+"vw";
    star.style.animationDuration=Math.random()*3+2+"s";
    document.body.appendChild(star);

    setTimeout(()=>star.remove(),5000);
  }
}
