// ============================================================================
// CONFIG — the only two values that matter for the lock screen
// ============================================================================
const CORRECT_NAME = 'kusuma';   // compared case-insensitively
const CORRECT_DOB  = '0624';     // MMDD, exact match

// ============================================================================
// LOGIN
// ============================================================================
const loginScreen = document.getElementById('login-screen');
const loginForm   = document.getElementById('login-form');
const nameInput   = document.getElementById('name-input');
const dobInput    = document.getElementById('dob-input');
const loginError  = document.getElementById('login-error');
const surprise    = document.getElementById('surprise');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const enteredName = nameInput.value.trim().toLowerCase();
  const enteredDob   = dobInput.value.trim();

  if (enteredName === CORRECT_NAME && enteredDob === CORRECT_DOB) {
    unlockSurprise();
  } else {
    showLoginError();
  }
});

function showLoginError() {
  loginError.textContent = 'Hmm… this surprise is only for the birthday girl 💙 Try again!';
  loginError.classList.remove('show');
  // restart animation
  void loginError.offsetWidth;
  loginError.classList.add('show');
}

function unlockSurprise() {
  loginScreen.classList.add('is-hidden');
  document.body.style.overflow = '';
  surprise.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    surprise.classList.add('is-visible');
    startFloatingHearts();
    initScrollReveal();
    launchFinaleAnimation();
  }, 250);

  // Remove the login screen from layout after the fade completes
  setTimeout(() => {
    loginScreen.style.display = 'none';
  }, 1200);
}

// ============================================================================
// LOGIN SCREEN AMBIENT PARTICLES
// ============================================================================
function createLoginParticles() {
  const container = document.getElementById('login-particles');
  const count = window.innerWidth < 600 ? 14 : 26;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = 4 + Math.random() * 10;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    p.style.animationDuration = (8 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}
createLoginParticles();

// ============================================================================
// FLOATING HEARTS ACROSS THE SURPRISE EXPERIENCE
// ============================================================================
function startFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const symbols = ['💙', '🤍', '✨'];
  const count = window.innerWidth < 600 ? 10 : 18;

  for (let i = 0; i < count; i++) {
    spawnHeart(container, symbols);
  }

  // keep spawning a gentle trickle
  setInterval(() => spawnHeart(container, symbols), 2200);
}

function spawnHeart(container, symbols) {
  const h = document.createElement('span');
  h.className = 'floating-heart';
  h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  h.style.left = Math.random() * 100 + '%';
  h.style.fontSize = (0.9 + Math.random() * 1.1) + 'rem';
  h.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
  h.style.animationDuration = (10 + Math.random() * 12) + 's';
  container.appendChild(h);
  setTimeout(() => h.remove(), 24000);
}

// ============================================================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================================================
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  items.forEach((item) => observer.observe(item));
}

// ============================================================================
// NAVIGATION — hamburger menu + smooth scroll + active state
// ============================================================================
const navToggle = document.getElementById('nav-toggle');
const navLinks   = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================================
// BACKGROUND MUSIC TOGGLE
// 🔊 Replace audio/birthday-song.mp3 with your own song file.
// ============================================================================
const musicToggle = document.getElementById('music-toggle');
const bgAudio = document.getElementById('bg-audio');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
  if (isPlaying) {
    bgAudio.pause();
    musicToggle.classList.remove('is-playing');
    musicToggle.querySelector('.music-icon').textContent = '🎵';
  } else {
    bgAudio.play().catch(() => {
      // Autoplay-style restrictions or a missing file are safe to ignore here;
      // the button simply won't visually mark itself as playing.
    });
    musicToggle.classList.add('is-playing');
    musicToggle.querySelector('.music-icon').textContent = '🎶';
  }
  isPlaying = !isPlaying;
});

// ============================================================================
// FINALE ANIMATION — hearts, stars, confetti, soft blue particles
// ============================================================================
function launchFinaleAnimation() {
  const canvas = document.getElementById('finale-canvas');
  const symbols = ['💙', '⭐', '🎉', '✨', '🤍'];

  const spawn = () => {
    const el = document.createElement('span');
    el.className = 'finale-particle';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (0.9 + Math.random() * 1.3) + 'rem';
    el.style.setProperty('--drift', (Math.random() * 140 - 70) + 'px');
    el.style.animationDuration = (3.5 + Math.random() * 3) + 's';
    canvas.appendChild(el);
    setTimeout(() => el.remove(), 7000);
  };

  // Trigger the finale burst once it scrolls into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        for (let i = 0; i < 24; i++) {
          setTimeout(spawn, i * 120);
        }
        const interval = setInterval(spawn, 500);
        setTimeout(() => clearInterval(interval), 9000);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(document.querySelector('.finale-section'));
}
