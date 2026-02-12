/* Cinematic Valentine — Vanilla JS
   - No external libraries
   - Smooth lerp motion for "No" button
   - Global hearts + petals
   - Music triggered by Yes button
   - Three screens with transitions
*/

(function () {
  // Elements
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const firstCard = document.getElementById('first-card');
  const secondCard = document.getElementById('second-card');
  const thirdCard = document.getElementById('third-card');
  const screen1 = document.getElementById('screen-1');
  const screen2 = document.getElementById('screen-2');
  const screen3 = document.getElementById('screen-3');
  const backTo1 = document.getElementById('back-to-1');
  const to3 = document.getElementById('to-3');
  const backTo2 = document.getElementById('back-to-2');
  const audio = document.getElementById('love-audio');
  const globalHearts = document.getElementById('global-hearts');
  const petalsContainer = document.getElementById('petals');

  // No button motion state
  let currentX = 0, currentY = 0;      // current absolute position (px)
  let targetX = 0, targetY = 0;        // target absolute position (px)
  let animating = false;
  let initialPos = null;               // store initial absolute position to reset
  let noMessages = ["No…!", "Not again…!", "It’s not happening 😜"];
  let noMsgIndex = 0;
  let lastEscapeTime = 0;

  // Heart colors
  const heartColors = ['#ffb6c1','#ff69b4','#ffc0cb','#ff7f7f','#ffd1c2'];

  // Utility: clamp
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  // Utility: lerp
  function lerp(a,b,t){ return a + (b - a) * t; }

  // Place No button initially inside the card (center-right)
  function placeNoButtonInitial(){
    const cardRect = firstCard.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // compute absolute coordinates so we can animate relative to viewport
    const left = Math.round(cardRect.left + cardRect.width/2 + 40 - btnRect.width/2);
    const top  = Math.round(cardRect.top + cardRect.height/2 - btnRect.height/2 + 10);

    // set absolute positioning
    noBtn.style.position = 'absolute';
    noBtn.style.left = left + 'px';
    noBtn.style.top = top + 'px';

    currentX = left; currentY = top;
    targetX = left; targetY = top;
    initialPos = { left, top };
  }

  // Reset No button to initial position (used when returning)
  function resetNoButton(){
    if(!initialPos) placeNoButtonInitial();
    currentX = initialPos.left; currentY = initialPos.top;
    targetX = initialPos.left; targetY = initialPos.top;
    noBtn.style.left = currentX + 'px';
    noBtn.style.top = currentY + 'px';
    noBtn.classList.remove('no-bounce');
    noMsgIndex = 0;
    noBtn.textContent = 'No 😜';
  }

  // Compute a playful escape target: random angle + distance, but biased away from pointer
  function computeEscapeTarget(pointerX, pointerY){
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width/2;
    const btnCenterY = btnRect.top + btnRect.height/2;

    // vector from pointer to button center
    let dx = btnCenterX - pointerX;
    let dy = btnCenterY - pointerY;
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;

    // Normalize and add randomness
    dx = dx / dist;
    dy = dy / dist;

    // base distance to move (responsive)
    const base = Math.max(90, Math.min(160, Math.round(Math.min(vw, vh) * 0.12)));

    // random jitter angle
    const jitter = (Math.random() - 0.5) * 0.9; // -0.45..0.45
    const angle = Math.atan2(dy, dx) + jitter;

    const moveX = Math.cos(angle) * base;
    const moveY = Math.sin(angle) * base;

    let newX = currentX + moveX;
    let newY = currentY + moveY;

    // clamp so button stays fully visible
    const margin = 12;
    newX = clamp(newX, margin, vw - btnRect.width - margin);
    newY = clamp(newY, margin, vh - btnRect.height - margin);

    return { x: Math.round(newX), y: Math.round(newY) };
  }

  // Trigger escape: update message, compute target, start animation
  function triggerEscapeEvent(ev){
    // prevent too frequent triggers
    const now = Date.now();
    if(now - lastEscapeTime < 220) return;
    lastEscapeTime = now;

    // update message sequentially
    noBtn.textContent = noMessages[noMsgIndex];
    noMsgIndex = (noMsgIndex + 1) % noMessages.length;

    // pointer coords
    let px = ev.clientX, py = ev.clientY;
    if(ev.touches && ev.touches[0]){ px = ev.touches[0].clientX; py = ev.touches[0].clientY; }

    const t = computeEscapeTarget(px, py);
    targetX = t.x; targetY = t.y;

    // start animation
    if(!animating) animateNo();
  }

  // Animate with requestAnimationFrame using lerp for smooth liquid motion
  function animateNo(){
    animating = true;
    noBtn.classList.remove('no-bounce');

    function step(){
      // ease factor
      currentX = lerp(currentX, targetX, 0.14);
      currentY = lerp(currentY, targetY, 0.14);

      noBtn.style.left = currentX + 'px';
      noBtn.style.top = currentY + 'px';

      // if close enough, finish and add small bounce
      if(Math.abs(currentX - targetX) < 0.6 && Math.abs(currentY - targetY) < 0.6){
        animating = false;
        // tiny landing bounce for personality
        noBtn.classList.add('no-bounce');
        // ensure final snap to target to avoid subpixel drift
        noBtn.style.left = targetX + 'px';
        noBtn.style.top = targetY + 'px';
        currentX = targetX; currentY = targetY;
        return;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Prevent pointer from hovering the button before it moves:
  // If pointer gets within a threshold of the button center, trigger escape.
  function proximityWatcher(e){
    // only on screen1
    if(!screen1.classList.contains('active')) return;
    const px = e.clientX, py = e.clientY;
    const btnRect = noBtn.getBoundingClientRect();
    const cx = btnRect.left + btnRect.width/2;
    const cy = btnRect.top + btnRect.height/2;
    const dx = px - cx, dy = py - cy;
    const d = Math.sqrt(dx*dx + dy*dy);
    const threshold = Math.max(80, Math.min(140, Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.12)));
    if(d < threshold){
      // simulate an event object with clientX/clientY
      triggerEscapeEvent({ clientX: px, clientY: py });
    }
  }

  // --- Global hearts generator (gentle density) ---
  let heartsInterval = null;
  function spawnHeart(x, y, color, size, duration, pop=false){
    const el = document.createElement('div');
    el.className = 'heart';
    el.textContent = '💖';
    el.style.left = (x - (size/2)) + 'px';
    el.style.top = (y - (size/2)) + 'px';
    el.style.fontSize = size + 'px';
    el.style.color = color;
    el.style.opacity = '0.95';
    el.style.transition = `transform ${duration}ms linear, opacity ${duration}ms linear`;
    globalHearts.appendChild(el);

    // animate upward with slight horizontal drift
    const drift = (Math.random() - 0.5) * 80;
    requestAnimationFrame(() => {
      el.style.transform = `translate(${drift}px, -${Math.round(duration * 0.12)}px) scale(${pop ? 1.2 : 1})`;
      el.style.opacity = '0';
    });

    setTimeout(()=> el.remove(), duration + 80);
  }

  function startGlobalHearts(rate = 1200){
    if(heartsInterval) clearInterval(heartsInterval);
    heartsInterval = setInterval(() => {
      // spawn 1-2 hearts at bottom random x
      const count = Math.random() < 0.6 ? 1 : 2;
      for(let i=0;i<count;i++){
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight - 20 - Math.random()*40;
        const color = heartColors[Math.floor(Math.random()*heartColors.length)];
        const size = 12 + Math.random()*18;
        const dur = 3800 + Math.random()*2200;
        const pop = Math.random() < 0.18;
        spawnHeart(x,y,color,size,dur,pop);
      }
    }, rate);
  }

  // Increase heart activity for screen 2
  function setHeartActivity(level){
    if(level === 'calm') startGlobalHearts(1200);
    else if(level === 'active') startGlobalHearts(700);
  }

  // --- Falling petals ---
  let petalsTimer = null;
  function spawnPetal(){
    const el = document.createElement('div');
    el.className = 'petal';
    // random small SVG-ish petal using emoji for simplicity (keeps assets minimal)
    el.innerHTML = '🌹';
    const startX = Math.random() * window.innerWidth;
    const size = 12 + Math.random()*18;
    el.style.left = startX + 'px';
    el.style.top = (-40 - Math.random()*80) + 'px';
    el.style.fontSize = size + 'px';
    el.style.opacity = (0.6 + Math.random()*0.4).toString();
    petalsContainer.appendChild(el);

    const duration = 6000 + Math.random()*7000;
    const drift = (Math.random() - 0.5) * 200;
    el.animate([
      { transform: `translate3d(0,0,0) rotate(${Math.random()*360}deg)`, opacity: el.style.opacity },
      { transform: `translate3d(${drift}px, ${window.innerHeight + 80}px, 0) rotate(${Math.random()*720}deg)`, opacity: 0.1 }
    ], {
      duration: duration,
      easing: 'linear'
    });

    setTimeout(()=> el.remove(), duration + 80);
  }

  function startPetals(){
    if(petalsTimer) clearInterval(petalsTimer);
    petalsTimer = setInterval(() => {
      spawnPetal();
      if(Math.random() < 0.35) spawnPetal();
    }, 900);
  }

  // --- Screen transitions ---
  function showScreen(n){
    // n: 1,2,3
    [screen1, screen2, screen3].forEach((s, idx) => {
      const i = idx + 1;
      if(i === n){
        s.classList.add('active');
        s.setAttribute('aria-hidden','false');
      } else {
        s.classList.remove('active');
        s.setAttribute('aria-hidden','true');
      }
    });

    // adjust heart activity
    if(n === 1) setHeartActivity('calm');
    if(n === 2) setHeartActivity('active');
    if(n === 3) setHeartActivity('calm');
  }

  // --- Yes button behavior ---
  yesBtn.addEventListener('click', (ev) => {
    // start music (user gesture)
    try { audio.currentTime = 0; audio.play().catch(()=>{}); } catch(e){}

    // quick fade/scale transition to screen 2
    firstCard.style.transition = 'opacity .36s ease, transform .36s ease';
    firstCard.style.opacity = '0';
    firstCard.style.transform = 'scale(.96)';
    setTimeout(() => {
      showScreen(2);
      // small entrance animation for second card
      secondCard.style.opacity = '0';
      secondCard.style.transform = 'scale(.96)';
      requestAnimationFrame(()=> {
        secondCard.style.transition = 'opacity .45s ease, transform .45s ease';
        secondCard.style.opacity = '1';
        secondCard.style.transform = 'scale(1)';
      });
    }, 320);
  });

  // Back and navigation
  backTo1.addEventListener('click', () => {
    // stop music? keep playing — user can stop via device. We'll keep playing.
    showScreen(1);
    // reset first card visuals
    firstCard.style.opacity = '1';
    firstCard.style.transform = 'scale(1)';
    // reset No button
    resetNoButton();
  });

  to3.addEventListener('click', () => {
    // transition to screen 3
    secondCard.style.opacity = '0';
    secondCard.style.transform = 'scale(.96)';
    setTimeout(() => {
      showScreen(3);
      thirdCard.style.opacity = '0';
      thirdCard.style.transform = 'scale(.96)';
      requestAnimationFrame(()=> {
        thirdCard.style.transition = 'opacity .45s ease, transform .45s ease';
        thirdCard.style.opacity = '1';
        thirdCard.style.transform = 'scale(1)';
      });
    }, 260);
  });

  backTo2.addEventListener('click', () => {
    showScreen(2);
    // reset third card visuals
    thirdCard.style.opacity = '1';
    thirdCard.style.transform = 'scale(1)';
  });

  // --- Event wiring for No button ---
  // On desktop: mouseenter triggers escape; also proximity watcher prevents hovering
  noBtn.addEventListener('mouseenter', triggerEscapeEvent);
  // On mobile: touchstart triggers escape
  noBtn.addEventListener('touchstart', function(e){ e.preventDefault(); triggerEscapeEvent(e); }, {passive:false});

  // Proximity watcher on pointer move to make it playful (prevents easy hover)
  window.addEventListener('mousemove', proximityWatcher);
  // Also watch touchmove for mobile chasing
  window.addEventListener('touchmove', function(e){
    if(e.touches && e.touches[0]) proximityWatcher(e.touches[0]);
  }, {passive:true});

  // Recompute initial positions on resize
  window.addEventListener('resize', () => {
    // reposition initial pos relative to card
    placeNoButtonInitial();
  });

  // --- Initialize everything ---
  function init(){
    // ensure containers exist
    if(!globalHearts || !petalsContainer) return;

    // place no button
    placeNoButtonInitial();

    // start global hearts and petals
    startGlobalHearts(1200);
    startPetals();

    // spawn a few hearts immediately for cinematic feel
    for(let i=0;i<6;i++){
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight - 20 - Math.random()*60;
      spawnHeart(x,y, heartColors[Math.floor(Math.random()*heartColors.length)], 14 + Math.random()*18, 3600 + Math.random()*2400, Math.random() < 0.2);
    }

    // small entrance for first card
    firstCard.style.opacity = '0';
    firstCard.style.transform = 'scale(.98)';
    requestAnimationFrame(()=> {
      firstCard.style.transition = 'opacity .45s ease, transform .45s ease';
      firstCard.style.opacity = '1';
      firstCard.style.transform = 'scale(1)';
    });

    // ensure screen1 active
    showScreen(1);
  }

  // Wait for DOM paint
  window.addEventListener('load', init);

  // Expose reset for debugging (not necessary)
  window._valentineReset = resetNoButton;

})();
