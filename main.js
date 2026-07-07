/* ===================================================
   Smart Bharat – AI-Powered Civic Companion
   main.js — Interactions, Animations, Chat UI
   =================================================== */

// ──────────────────────────────────────────
// 1. Animated Particle Background
// ──────────────────────────────────────────
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.05;
    this.hue = Math.random() > 0.5 ? 320 : 270; // pink or purple
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `hsl(${this.hue}, 80%, 65%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
  particles = Array.from({ length: count }, () => new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Subtle grid lines
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.015)';
  ctx.lineWidth = 1;
  const gridSize = 80;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
  ctx.restore();

  // Gradient orbs
  const drawOrb = (x, y, r, color1, color2) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color1);
    g.addColorStop(1, color2);
    ctx.save();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const t = Date.now() / 1000;
  drawOrb(
    canvas.width * 0.2 + Math.sin(t * 0.3) * 60,
    canvas.height * 0.3 + Math.cos(t * 0.2) * 40,
    300,
    'rgba(233,30,140,0.04)',
    'transparent'
  );
  drawOrb(
    canvas.width * 0.8 + Math.cos(t * 0.25) * 50,
    canvas.height * 0.6 + Math.sin(t * 0.35) * 60,
    350,
    'rgba(124,58,237,0.04)',
    'transparent'
  );
  drawOrb(
    canvas.width * 0.5 + Math.sin(t * 0.2) * 40,
    canvas.height * 0.8 + Math.cos(t * 0.15) * 30,
    250,
    'rgba(6,182,212,0.025)',
    'transparent'
  );

  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });


// ──────────────────────────────────────────
// 2. Navbar scroll effect
// ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
const scrollThreshold = 60;

window.addEventListener('scroll', () => {
  if (window.scrollY > scrollThreshold) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ──────────────────────────────────────────
// 3. Hamburger menu
// ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  navLinks.style.display = menuOpen ? 'flex' : 'none';
  if (menuOpen) {
    navLinks.style.cssText = `
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 72px; left: 0; right: 0;
      background: rgba(5,5,8,0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 20px 24px;
      gap: 16px;
    `;
  } else {
    navLinks.style.cssText = 'display: none;';
  }
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    navLinks.style.cssText = 'display: none;';
  });
});


// ──────────────────────────────────────────
// 4. Intersection Observer – card animations
// ──────────────────────────────────────────
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0');
      setTimeout(() => entry.target.classList.add('visible'), delay);
      cardObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .step-card, .service-item').forEach(el => {
  cardObserver.observe(el);
});

// Step cards and service items need .visible class too
const stepCards = document.querySelectorAll('.step-card, .service-item');
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      stepObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

stepCards.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  stepObserver.observe(el);
});


// ──────────────────────────────────────────
// 5. Smooth active nav link highlight
// ──────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


// ──────────────────────────────────────────
// 6. Chat UI
// ──────────────────────────────────────────
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const typingIndicator = document.getElementById('typingIndicator');

const botResponses = {
  default: [
    "I can help you with that! Could you tell me more about your specific situation so I can provide accurate guidance?",
    "Great question! Let me look up the latest information on that government service for you.",
    "I understand your concern. Here's what you need to know about this civic service...",
  ],
  aadhaar: {
    text: "For <strong>Aadhaar status check</strong>, you can:",
    items: [
      "Visit uidai.gov.in → Check Aadhaar Status",
      "Enter your 28-digit Enrollment ID",
      "Verify with OTP on your registered mobile",
      "Or call UIDAI helpline: 1947"
    ],
    extra: "Would you like me to guide you to the Aadhaar portal directly?"
  },
  kisan: {
    text: "For <strong>PM Kisan Samman Nidhi</strong> eligibility:",
    items: [
      "Must be a land-holding farmer",
      "Family income should not exceed ₹6,00,000/year",
      "Benefit: ₹6,000/year in 3 installments",
      "Register at pmkisan.gov.in"
    ],
    extra: "Shall I check your eligibility based on your state and details?"
  },
  complaint: {
    text: "To <strong>file a public grievance</strong>, here's how:",
    items: [
      "Visit pgportal.gov.in (Central Govt)",
      "Register/Login with your mobile number",
      "Select department and describe your issue",
      "Get a unique grievance number for tracking"
    ],
    extra: "Track your complaint anytime with the grievance registration number."
  },
  income: {
    text: "For an <strong>Income Certificate</strong>, you need:",
    items: [
      "Aadhaar Card (mandatory)",
      "Ration Card or residence proof",
      "Self-declaration of income",
      "Apply at your state's e-district portal"
    ],
    extra: "Processing time is usually 7-15 working days. Need state-specific info?"
  }
};

function createBotMessage(content, isTyped = false) {
  const div = document.createElement('div');
  div.className = 'msg msg--bot';
  div.style.opacity = '0';
  div.style.transform = 'translateY(10px)';
  div.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  div.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble">${content}</div>`;
  return div;
}

function createUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'msg msg--user';
  div.style.opacity = '0';
  div.style.transform = 'translateY(10px)';
  div.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  return div;
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  typingIndicator.classList.add('active');
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.classList.remove('active');
}

function appendMessage(el) {
  chatMessages.insertBefore(el, typingIndicator);
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
  scrollToBottom();
}

function buildDocResponse(data) {
  const items = data.items.map(i => `<div class="doc-item"><span class="doc-check">✓</span> ${i}</div>`).join('');
  return `<p>${data.text}</p><div class="doc-list">${items}</div><p style="margin-top:10px;color:#94a3b8;font-size:13px;">📌 ${data.extra}</p>`;
}

function getResponse(text) {
  const lower = text.toLowerCase();
  if (lower.includes('aadhaar') || lower.includes('aadhar') || lower.includes('uid')) {
    return buildDocResponse(botResponses.aadhaar);
  }
  if (lower.includes('kisan') || lower.includes('pm kisan') || lower.includes('farmer') || lower.includes('agriculture')) {
    return buildDocResponse(botResponses.kisan);
  }
  if (lower.includes('complaint') || lower.includes('grievance') || lower.includes('report') || lower.includes('issue')) {
    return buildDocResponse(botResponses.complaint);
  }
  if (lower.includes('income') || lower.includes('certificate')) {
    return buildDocResponse(botResponses.income);
  }
  // Default
  const rndIdx = Math.floor(Math.random() * botResponses.default.length);
  return `<p>${botResponses.default[rndIdx]}</p><p style="color:#94a3b8;font-size:13px;margin-top:8px;">Try asking about: Aadhaar, Passport, PM Kisan, Income Certificate, or Complaints.</p>`;
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  const userMsg = createUserMessage(text);
  appendMessage(userMsg);
  chatInput.value = '';

  showTyping();

  const delay = 800 + Math.random() * 800;
  setTimeout(() => {
    hideTyping();
    const responseHtml = getResponse(text);
    const botMsg = createBotMessage(responseHtml);
    appendMessage(botMsg);
  }, delay);
}

function sendSuggestion(btn) {
  chatInput.value = btn.textContent;
  sendMessage();
  btn.style.opacity = '0.5';
  setTimeout(() => btn.style.opacity = '1', 2000);
}

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Make functions global
window.sendMessage = sendMessage;
window.sendSuggestion = sendSuggestion;


// ──────────────────────────────────────────
// 7. Counter animation for stats
// ──────────────────────────────────────────
function animateCounter(el, start, end, duration, suffix = '') {
  const startTime = performance.now();
  const update = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(start + (end - start) * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const statNums = document.querySelectorAll('.stat-num');
      const targets = [
        { el: statNums[0], val: 50, suffix: '+' },
        { el: statNums[1], val: 22, suffix: '' },
        { el: statNums[2], val: 100, suffix: '%' },
        { el: statNums[3], val: 24, suffix: '/7' },
      ];
      targets.forEach(({ el, val, suffix }) => {
        animateCounter(el, 0, val, 1800, suffix);
      });
      statsObserver.unobserve(statsSection);
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}


// ──────────────────────────────────────────
// 8. Mouse parallax for floating cards
// ──────────────────────────────────────────
const floatingCards = document.querySelectorAll('.floating-card');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

  floatingCards.forEach((card, i) => {
    const factor = (i + 1) * 8;
    card.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
  });
});


// ──────────────────────────────────────────
// 9. Smooth scroll for nav links
// ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ──────────────────────────────────────────
// 10. Service item click ripple
// ──────────────────────────────────────────
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('click', function (e) {
    const ripple = document.createElement('div');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      width: 100px; height: 100px;
      background: rgba(233,30,140,0.15);
      left: ${e.clientX - rect.left - 50}px;
      top: ${e.clientY - rect.top - 50}px;
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out forwards;
      pointer-events: none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleEffect {
    to { transform: scale(3); opacity: 0; }
  }
  .nav-link.active { color: #f1f5f9 !important; }
  .nav-link.active::after { transform: scaleX(1) !important; }
`;
document.head.appendChild(rippleStyle);


// ──────────────────────────────────────────
// 11. Mission section animate on scroll
// ──────────────────────────────────────────
const missionCard = document.querySelector('.mission-card');
if (missionCard) {
  missionCard.style.opacity = '0';
  missionCard.style.transform = 'translateY(40px)';
  missionCard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

  const missionObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      missionCard.style.opacity = '1';
      missionCard.style.transform = 'translateY(0)';
      missionObserver.unobserve(missionCard);
    }
  }, { threshold: 0.2 });
  missionObserver.observe(missionCard);
}

// ──────────────────────────────────────────
// 12. Pillar hover highlight
// ──────────────────────────────────────────
document.querySelectorAll('.pillar').forEach(pillar => {
  pillar.addEventListener('mouseenter', function() {
    this.querySelector('.pillar-icon').style.transform = 'scale(1.2) rotate(10deg)';
    this.querySelector('.pillar-icon').style.transition = '0.3s ease';
  });
  pillar.addEventListener('mouseleave', function() {
    this.querySelector('.pillar-icon').style.transform = '';
  });
});
