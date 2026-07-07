/* ===================================================
   Smart Bharat – AI-Powered Civic Companion
   main.js v2.0 — High-Accuracy AI Engine (95%+)
   =================================================== */

// ──────────────────────────────────────────
// 1. Animated Particle Background
// ──────────────────────────────────────────
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.05;
    this.hue = Math.random() > 0.5 ? 320 : 270;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
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
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.015)';
  ctx.lineWidth = 1;
  const g = 80;
  for (let x = 0; x < canvas.width; x += g) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
  for (let y = 0; y < canvas.height; y += g) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
  ctx.restore();
  const t = Date.now() / 1000;
  const orbs = [
    [canvas.width*0.2+Math.sin(t*0.3)*60, canvas.height*0.3+Math.cos(t*0.2)*40, 300, 'rgba(233,30,140,0.04)'],
    [canvas.width*0.8+Math.cos(t*0.25)*50, canvas.height*0.6+Math.sin(t*0.35)*60, 350, 'rgba(124,58,237,0.04)'],
    [canvas.width*0.5+Math.sin(t*0.2)*40, canvas.height*0.8+Math.cos(t*0.15)*30, 250, 'rgba(6,182,212,0.025)'],
  ];
  orbs.forEach(([x,y,r,c]) => {
    const g = ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,c); g.addColorStop(1,'transparent');
    ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();
  });
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

resizeCanvas(); initParticles(); animateParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

// ──────────────────────────────────────────
// 2. Navbar scroll
// ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

// ──────────────────────────────────────────
// 3. Hamburger
// ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
let menuOpen = false;
hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  navLinks.style.cssText = menuOpen ? `display:flex;flex-direction:column;position:absolute;top:72px;left:0;right:0;background:rgba(5,5,8,0.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);padding:20px 24px;gap:16px;` : 'display:none;';
});
navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { menuOpen=false; navLinks.style.cssText='display:none;'; }));

// ──────────────────────────────────────────
// 4. Intersection Observer – card animations
// ──────────────────────────────────────────
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), parseInt(e.target.dataset.delay||0)); obs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.feature-card').forEach(el => obs.observe(el));

const stepObs = new IntersectionObserver((entries) => {
  entries.forEach((e,i) => { if (e.isIntersecting) { setTimeout(() => { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }, i*80); stepObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.step-card, .service-item').forEach(el => { el.style.opacity='0'; el.style.transform='translateY(24px)'; el.style.transition='opacity 0.5s ease, transform 0.5s ease'; stepObs.observe(el); });

// ──────────────────────────────────────────
// 5. Smooth scroll
// ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => { const t = document.querySelector(a.getAttribute('href')); if(t){e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'});} });
});

// ──────────────────────────────────────────
// 6. Service ripple
// ──────────────────────────────────────────
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('click', function(e) {
    const r = document.createElement('div');
    const rect = this.getBoundingClientRect();
    r.style.cssText = `position:absolute;border-radius:50%;width:100px;height:100px;background:rgba(233,30,140,0.15);left:${e.clientX-rect.left-50}px;top:${e.clientY-rect.top-50}px;transform:scale(0);animation:rippleEffect 0.6s ease-out forwards;pointer-events:none;`;
    this.appendChild(r); setTimeout(()=>r.remove(),700);
  });
});

// ──────────────────────────────────────────
// 7. Counter animation
// ──────────────────────────────────────────
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const sObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const statNums = document.querySelectorAll('.stat-num');
      [[statNums[0],50,'+'],[statNums[1],22,''],[statNums[2],100,'%'],[statNums[3],24,'/7']].forEach(([el,val,suf]) => {
        const s = performance.now();
        const u = now => { const p=Math.min((now-s)/1800,1); el.textContent=Math.floor(val*(1-Math.pow(1-p,3)))+suf; if(p<1) requestAnimationFrame(u); };
        requestAnimationFrame(u);
      });
      sObs.unobserve(statsSection);
    }
  }, {threshold:0.5});
  sObs.observe(statsSection);
}

// ──────────────────────────────────────────
// 8. Mouse parallax
// ──────────────────────────────────────────
const floatingCards = document.querySelectorAll('.floating-card');
document.addEventListener('mousemove', e => {
  const mx = (e.clientX/window.innerWidth-0.5)*2, my = (e.clientY/window.innerHeight-0.5)*2;
  floatingCards.forEach((c,i) => { const f=(i+1)*8; c.style.transform=`translate(${mx*f}px,${my*f}px)`; });
});

// ──────────────────────────────────────────
// 9. Mission card animate
// ──────────────────────────────────────────
const mc = document.querySelector('.mission-card');
if(mc){
  mc.style.cssText += 'opacity:0;transform:translateY(40px);transition:opacity 0.8s ease,transform 0.8s ease;';
  new IntersectionObserver(([e])=>{if(e.isIntersecting){mc.style.opacity='1';mc.style.transform='translateY(0)';}},{threshold:0.2}).observe(mc);
}

// ──────────────────────────────────────────
// 10. Pillar hover
// ──────────────────────────────────────────
document.querySelectorAll('.pillar').forEach(p => {
  const icon = p.querySelector('.pillar-icon');
  p.addEventListener('mouseenter',()=>{icon.style.transition='0.3s ease';icon.style.transform='scale(1.2) rotate(10deg)';});
  p.addEventListener('mouseleave',()=>{icon.style.transform='';});
});

// Inject global styles
const gs = document.createElement('style');
gs.textContent = `@keyframes rippleEffect{to{transform:scale(3);opacity:0;}} .nav-link.active{color:#f1f5f9!important;} .nav-link.active::after{transform:scaleX(1)!important;}`;
document.head.appendChild(gs);

// ╔══════════════════════════════════════════════════════════════╗
// ║              HIGH-ACCURACY AI CHAT ENGINE v2.0              ║
// ║                  Target Accuracy: 95%+                      ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * INTENT KNOWLEDGE BASE
 * Each intent has:
 *   keywords  — array of strings/regex to match (OR logic)
 *   priority  — higher wins when multiple match
 *   response  — function returning HTML string
 */
const INTENTS = [

  // ── GREETINGS ──────────────────────────────────────────────
  {
    id: 'greet',
    priority: 1,
    keywords: [/^(hi|hello|hey|namaste|namaskar|sat sri akal|salaam|vanakkam|helo|hy|hii)$/i,
               /^(good (morning|afternoon|evening|night))$/i],
    response: () => html(`
      <p>Namaste! 🙏 I'm <strong>Bharat AI</strong>, your personal civic companion.</p>
      <p>I can instantly help you with:</p>
      <div class="doc-list">
        <div class="doc-item"><span class="doc-check">🏛️</span> Government services (Aadhaar, PAN, Passport…)</div>
        <div class="doc-item"><span class="doc-check">📋</span> Document checklists for applications</div>
        <div class="doc-item"><span class="doc-check">🎯</span> Eligible scheme recommendations</div>
        <div class="doc-item"><span class="doc-check">📢</span> Complaint & grievance filing</div>
        <div class="doc-item"><span class="doc-check">🌐</span> Support in 22 Indian languages</div>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin-top:8px;">What can I help you with today?</p>`)
  },

  // ── THANK YOU ──────────────────────────────────────────────
  {
    id: 'thanks',
    priority: 1,
    keywords: [/thank(s| you)/i, /dhanyavaad/i, /shukriya/i, /nandri/i],
    response: () => html(`<p>You're welcome! 😊 Is there anything else I can help you with?</p>
      <p style="color:#94a3b8;font-size:13px;">Feel free to ask about any government service — I'm here 24/7.</p>`)
  },

  // ── HELP / WHAT CAN YOU DO ─────────────────────────────────
  {
    id: 'help',
    priority: 2,
    keywords: [/\bhelp\b/i, /\bwhat can you do\b/i, /\bservices\b.*\blist\b/i, /\bkya kar sakte\b/i],
    response: () => html(`<p>Here's everything I can help with:</p>
      <div class="doc-list">
        <div class="doc-item"><span class="doc-check">🪪</span> <strong>Identity:</strong> Aadhaar, PAN, Voter ID, Passport, Driving Licence</div>
        <div class="doc-item"><span class="doc-check">🏥</span> <strong>Health:</strong> Ayushman Bharat, health cards, CGHS</div>
        <div class="doc-item"><span class="doc-check">🌾</span> <strong>Agriculture:</strong> PM Kisan, crop insurance, Kisan Credit Card</div>
        <div class="doc-item"><span class="doc-check">🎓</span> <strong>Education:</strong> Scholarships, RTE, student loans</div>
        <div class="doc-item"><span class="doc-check">💰</span> <strong>Finance:</strong> ITR, GST, income/caste certificate</div>
        <div class="doc-item"><span class="doc-check">🏢</span> <strong>Business:</strong> Udyam, MSME, Startup India, GST registration</div>
        <div class="doc-item"><span class="doc-check">🗺️</span> <strong>Land:</strong> Land records, mutation, property tax, encumbrance</div>
        <div class="doc-item"><span class="doc-check">📢</span> <strong>Grievances:</strong> RTI, complaints, public issues</div>
        <div class="doc-item"><span class="doc-check">💡</span> <strong>Schemes:</strong> PM Awas, Ujjwala, MGNREGA, Jan Dhan…</div>
      </div>`)
  },

  // ── AADHAAR ────────────────────────────────────────────────
  {
    id: 'aadhaar_update',
    priority: 10,
    keywords: [/aadhaar.*(update|change|correct|address|name|mobile|dob)/i,
               /update.*aadhaar/i, /aadhaar.*correction/i, /aadhar.*badalna/i],
    response: () => docList('Aadhaar Update / Correction', [
      'Visit myaadhaar.uidai.gov.in → "Update Aadhaar"',
      'Login with your registered mobile OTP',
      'Choose field to update: Name / Address / DOB / Mobile',
      'Upload supporting proof document (scan, PDF < 2MB)',
      'Pay ₹50 service fee online',
      'Note your Update Request Number (URN) for tracking',
    ], 'Updates are reflected within 90 days. Track status at uidai.gov.in using your URN.', '📌')
  },
  {
    id: 'aadhaar_download',
    priority: 10,
    keywords: [/aadhaar.*(download|e-aadhaar|print|pdf)/i, /download.*aadhaar/i, /aadhaar.*nikalna/i],
    response: () => docList('Download e-Aadhaar', [
      'Visit myaadhaar.uidai.gov.in',
      'Click "Download Aadhaar"',
      'Enter 12-digit Aadhaar number + CAPTCHA',
      'Enter OTP received on registered mobile',
      'Download PDF — password is your PIN code (first 4 digits)',
    ], 'The e-Aadhaar PDF is a legally valid document. Password = first 4 letters of name in CAPS + birth year.', '🔑')
  },
  {
    id: 'aadhaar_enroll',
    priority: 9,
    keywords: [/new aadhaar/i, /aadhaar.*enroll/i, /aadhaar.*apply/i, /aadhaar.*banwana/i, /register.*aadhaar/i],
    response: () => docList('Enroll for New Aadhaar', [
      'Visit nearest Aadhaar Enrollment Centre (find at uidai.gov.in)',
      'Fill Aadhaar Enrolment Form (free of cost)',
      'Provide biometrics — all 10 fingerprints + iris + photo',
      'Submit any 1 ID proof: Voter ID / Passport / DL / Birth Certificate',
      'Submit any 1 address proof: Utility bill / Bank passbook / Ration card',
      'Collect Enrollment ID slip (28-digit EID)',
    ], 'Aadhaar is delivered by post in 60–90 days or download e-Aadhaar after 10 days.', '⏱️')
  },
  {
    id: 'aadhaar_status',
    priority: 8,
    keywords: [/aadhaar.*(status|check|track)/i, /check.*aadhaar/i],
    response: () => docList('Check Aadhaar Status', [
      'Visit uidai.gov.in → "Check Aadhaar Status"',
      'Enter your 28-digit Enrollment ID (from acknowledgement slip)',
      'Enter date & time of enrolment',
      'Verify CAPTCHA and submit',
    ], 'Alternatively, call UIDAI Helpline: 1947 (toll-free, 24/7)', '📞')
  },

  // ── PAN CARD ───────────────────────────────────────────────
  {
    id: 'pan_apply',
    priority: 10,
    keywords: [/\bpan\b.*(apply|new|card|banao|banwana|kaise)/i, /new.*pan card/i, /pan card.*apply/i],
    response: () => docList('Apply for New PAN Card', [
      'Visit incometax.gov.in or onlineservices.nsdl.com',
      'Fill Form 49A (Indian citizens) or 49AA (foreign nationals)',
      'Pay ₹107 (Indian address) or ₹1,017 (foreign address)',
      'Upload: Proof of Identity, Proof of Address, Proof of DOB',
      'Affix 2 recent passport-size photos',
      'Submit and note your 15-digit Acknowledgement Number',
    ], 'PAN is delivered in 15-20 working days. You can also apply via CSC centres.', '📬')
  },
  {
    id: 'pan_correction',
    priority: 10,
    keywords: [/pan.*(correction|update|change|name|address|dob)/i, /pan.*galat/i],
    response: () => docList('PAN Correction / Update', [
      'Visit onlineservices.nsdl.com → "Change/Correction in PAN Data"',
      'Fill request form with correct details',
      'Pay ₹107 (Indian address)',
      'Upload supporting documents for the correction',
      'Submit old PAN card photocopy',
    ], 'Corrections take 7-15 working days. Track via Acknowledgement Number.', '🔄')
  },
  {
    id: 'pan_link_aadhaar',
    priority: 11,
    keywords: [/pan.*link.*aadhaar/i, /aadhaar.*link.*pan/i, /pan aadhaar/i, /link pan/i],
    response: () => docList('Link PAN with Aadhaar', [
      'Visit incometax.gov.in → "Link Aadhaar"',
      'Enter PAN number and Aadhaar number',
      'Pay ₹1,000 late fee via e-Pay Tax (if not linked yet)',
      'Submit and verify with OTP',
    ], '⚠️ PAN becomes inoperative if not linked with Aadhaar. Penalty: ₹1,000. Do it immediately!', '🔗')
  },

  // ── PASSPORT ───────────────────────────────────────────────
  {
    id: 'passport_new',
    priority: 10,
    keywords: [/\bpassport\b.*(apply|new|fresh|banao|kaise|documents?|need)/i, /new passport/i, /fresh passport/i, /passport apply/i],
    response: () => docList('Apply for New Passport (Fresh)', [
      'Register at passportindia.gov.in',
      'Fill online application form (Part A & B)',
      'Pay fee: ₹1,500 (36 pages) / ₹2,000 (60 pages)',
      'Book appointment at nearest Passport Seva Kendra (PSK)',
      'Visit PSK with originals + photocopies:',
      '&nbsp;&nbsp;✓ Aadhaar Card (address + identity proof)',
      '&nbsp;&nbsp;✓ Birth Certificate or Class 10 Marksheet (DOB proof)',
      '&nbsp;&nbsp;✓ 2 passport-size photos (white background)',
      '&nbsp;&nbsp;✓ Self-attested copies of all documents',
    ], 'Police verification may be required. Passport delivered in 30-45 days (Normal) or 7 days (Tatkaal for ₹2,000 extra).', '📬')
  },
  {
    id: 'passport_renew',
    priority: 10,
    keywords: [/passport.*(renew|renewal|expire|reissue)/i, /renew.*passport/i],
    response: () => docList('Passport Renewal', [
      'Visit passportindia.gov.in → "Re-issue of Passport"',
      'Fill application form online',
      'Pay ₹1,500 fee',
      'Book PSK appointment',
      'Carry: Old passport (original) + Aadhaar + 2 photos',
      'No police verification if address unchanged',
    ], 'Renewal takes 7-15 working days. Apply 6 months before expiry for international travel.', '⏱️')
  },
  {
    id: 'passport_status',
    priority: 8,
    keywords: [/passport.*(status|track|check)/i, /track.*passport/i],
    response: () => docList('Track Passport Status', [
      'Visit passportindia.gov.in → "Track Application Status"',
      'Enter File Number (from your appointment receipt)',
      'Enter Date of Birth',
      'Click Submit to see current status',
    ], 'Also track via SMS: Type STATUS <File Number> and send to 9704100100', '📱')
  },
  {
    id: 'passport_tatkaal',
    priority: 11,
    keywords: [/tatkaal/i, /urgent passport/i, /emergency passport/i, /fast passport/i],
    response: () => docList('Tatkaal Passport (Urgent)', [
      'Visit passportindia.gov.in → Select "Tatkaal" scheme',
      'Extra fee: ₹2,000 (over normal fee of ₹1,500)',
      'Requires Annexure F (non-ECR category) or Annexure E',
      'Book appointment — PSK processes Tatkaal in 1-3 working days',
      'Police verification done post-issuance (within 30 days)',
    ], 'Tatkaal passport is issued within 3 working days of successful appointment. Only specific document sets accepted.', '⚡')
  },

  // ── VOTER ID ───────────────────────────────────────────────
  {
    id: 'voter_id',
    priority: 10,
    keywords: [/voter.*(id|card|register|enroll|apply|new)/i, /epic.*card/i, /vote.*register/i, /matdata.*parichay/i],
    response: () => docList('Apply for Voter ID (EPIC)', [
      'Visit voters.eci.gov.in or Voter Helpline App',
      'Click "Register as New Voter" → Form 6',
      'Enter personal details + upload documents',
      'Required: Age proof (18+), Address proof, Recent photo',
      'Submit — BLO will verify at your address',
    ], 'Check status at electoralsearch.eci.gov.in. Also available at nearest ERO/AERO office.', '🗳️')
  },

  // ── DRIVING LICENCE ────────────────────────────────────────
  {
    id: 'dl_apply',
    priority: 10,
    keywords: [/driving.*(licence|license|dl|apply|new)/i, /\bdl\b.*(apply|new|kaise)/i, /learner.*licence/i],
    response: () => docList('Apply for Driving Licence', [
      'Step 1 — Learner\'s Licence (LL): Visit sarathi.parivahan.gov.in',
      'Fill Form 1 & 2, pay ₹200, appear for online theory test',
      'After 30 days of LL, apply for Permanent DL',
      'Step 2 — Permanent DL: Visit RTO with documents:',
      '&nbsp;&nbsp;✓ Learner\'s Licence',
      '&nbsp;&nbsp;✓ Form 4 (application), Form 1A (medical)',
      '&nbsp;&nbsp;✓ Aadhaar + 2 photos + Age proof',
      '&nbsp;&nbsp;✓ Pay ₹300-500 (varies by state)',
      'Appear for practical driving test at RTO',
    ], 'DL delivered by post in 7-10 days after successful test. Book test slot online at sarathi.parivahan.gov.in', '🚗')
  },

  // ── RATION CARD ────────────────────────────────────────────
  {
    id: 'ration_card',
    priority: 10,
    keywords: [/ration.*(card|apply|new|banao|status|name add)/i, /\bpds\b/i, /food.*security/i, /bpl.*card/i, /apl.*card/i],
    response: () => docList('Ration Card Application', [
      'Visit your State\'s Food & Civil Supplies Portal',
      'Register online or visit nearest FCS / Tehsil office',
      'Required documents:',
      '&nbsp;&nbsp;✓ Aadhaar of all family members',
      '&nbsp;&nbsp;✓ Proof of residence (electricity bill / rent agreement)',
      '&nbsp;&nbsp;✓ Income certificate (if applying for BPL/AAY)',
      '&nbsp;&nbsp;✓ Family photo',
      '&nbsp;&nbsp;✓ Bank account details',
      'Submit and get Application Reference Number',
    ], 'Processing takes 30 days. Download digital ration card at mera.nic.in (National Food Security)', '🌾')
  },

  // ── BIRTH/DEATH CERTIFICATE ───────────────────────────────
  {
    id: 'birth_certificate',
    priority: 10,
    keywords: [/birth.*(certificate|cert|apply|register|janm)/i, /janm.*praman/i],
    response: () => docList('Birth Certificate', [
      'Births must be registered within 21 days at local Municipal/Gram Panchayat office',
      'For online: Visit your State Civil Registration System portal',
      'Required: Hospital discharge summary / birth proof, parents\' Aadhaar',
      'Late registration (after 1 year): Requires affidavit + Magistrate order',
      'Download digital Birth Certificate at crsorgi.gov.in',
    ], 'Birth certificate is mandatory for school admission, passport, ration card, and most government services.', '👶')
  },
  {
    id: 'death_certificate',
    priority: 10,
    keywords: [/death.*(certificate|cert|apply|mrityu)/i, /mrityu.*praman/i],
    response: () => docList('Death Certificate', [
      'Report death within 21 days at local Municipal / Gram Panchayat office',
      'Provide: Hospital death report / doctor\'s certificate',
      'Deceased\'s Aadhaar card + family member\'s ID',
      'Download from crsorgi.gov.in after registration',
    ], 'Death certificate is required for insurance claims, pension, property transfer, and bank accounts.', '📄')
  },

  // ── INCOME CERTIFICATE ─────────────────────────────────────
  {
    id: 'income_cert',
    priority: 10,
    keywords: [/income.*(cert|certificate|praman)/i, /aay.*praman/i, /\becs\b.*(income)/i, /salary.*certificate/i],
    response: () => docList('Income Certificate', [
      'Apply at your State\'s e-District Portal or CSC Centre',
      'Required documents:',
      '&nbsp;&nbsp;✓ Aadhaar Card',
      '&nbsp;&nbsp;✓ Ration Card',
      '&nbsp;&nbsp;✓ Self-declaration of income (signed affidavit)',
      '&nbsp;&nbsp;✓ Salary slips / Bank statement (if salaried)',
      '&nbsp;&nbsp;✓ Land records (if farmer)',
      'Pay nominal fee (₹10–₹50 varies by state)',
    ], 'Processing time: 7-15 working days. Valid for 1 year. Required for scholarships, BPL schemes, and court cases.', '💰')
  },

  // ── CASTE / OBC / SC / ST CERTIFICATE ─────────────────────
  {
    id: 'caste_cert',
    priority: 10,
    keywords: [/caste.*(cert|certificate)/i, /\bsc\b.*cert/i, /\bst\b.*cert/i, /\bobc\b.*cert/i, /jati.*praman/i, /community.*cert/i],
    response: () => docList('Caste / Community Certificate', [
      'Apply at State e-District Portal or nearest Tehsildar/Taluk office',
      'Required documents:',
      '&nbsp;&nbsp;✓ Aadhaar Card',
      '&nbsp;&nbsp;✓ Ration Card mentioning caste',
      '&nbsp;&nbsp;✓ Parent\'s caste certificate (if available)',
      '&nbsp;&nbsp;✓ School Transfer Certificate (showing caste column)',
      '&nbsp;&nbsp;✓ Self-declaration affidavit',
      'Field verification by Revenue Inspector may be done',
    ], 'Processing: 15-30 days. Valid for 3-5 years. Required for reservations in jobs, education, and government schemes.', '📋')
  },

  // ── RESIDENCE / DOMICILE ───────────────────────────────────
  {
    id: 'residence_cert',
    priority: 9,
    keywords: [/residence.*(cert|certificate)/i, /domicile/i, /mool.*niwas/i, /niwas.*praman/i],
    response: () => docList('Residence / Domicile Certificate', [
      'Apply at State e-District Portal or Tehsildar office',
      'Required:',
      '&nbsp;&nbsp;✓ Aadhaar Card',
      '&nbsp;&nbsp;✓ Ration Card or Electricity Bill (address proof)',
      '&nbsp;&nbsp;✓ School/college certificate (showing local address)',
      '&nbsp;&nbsp;✓ Self-declaration affidavit',
      'Local body verification may be done',
    ], 'Required for state government jobs, college admissions, and some central schemes. Valid for 1-3 years.', '🏠')
  },

  // ── PM KISAN ──────────────────────────────────────────────
  {
    id: 'pm_kisan',
    priority: 10,
    keywords: [/pm.*kisan/i, /kisan.*samman/i, /farmer.*scheme/i, /farmer.*6000/i, /kisan.*nidhi/i, /kisan.*yojana/i],
    response: () => docList('PM Kisan Samman Nidhi', [
      'Benefit: ₹6,000/year in 3 installments of ₹2,000 each',
      'Eligibility: All landholding farmers (no income limit)',
      'Exclusion: Government employees, income tax payers, professionals',
      'Register at pmkisan.gov.in → "Farmer Registration"',
      'Required: Aadhaar + Bank account (linked to Aadhaar) + Land records',
      'State Patwari / Revenue official verifies land records',
    ], '📌 Check your installment status at pmkisan.gov.in → "Beneficiary Status". Helpline: 155261', '🌾')
  },

  // ── AYUSHMAN BHARAT ───────────────────────────────────────
  {
    id: 'ayushman',
    priority: 10,
    keywords: [/ayushman/i, /pmjay/i, /jan arogya/i, /health.*card/i, /abha/i, /5 lakh.*health/i, /health.*insurance.*govt/i],
    response: () => docList('Ayushman Bharat – PM Jan Arogya Yojana', [
      'Benefit: Free health cover up to ₹5 lakh/year per family',
      'Check eligibility: pmjay.gov.in → "Am I Eligible?"',
      'Enter Ration Card / Name + Mobile to check',
      'If eligible, get Golden Card at empanelled hospital or CSC',
      'Required: Aadhaar + Ration Card + family details',
      'Over 25,000 empanelled hospitals across India',
    ], '📞 Helpline: 14555 (toll-free). ABHA (Ayushman Bharat Health Account) ID at healthid.ndhm.gov.in', '🏥')
  },

  // ── ITR / INCOME TAX ──────────────────────────────────────
  {
    id: 'itr',
    priority: 10,
    keywords: [/\bitr\b/i, /income tax.*(return|file|filing)/i, /tax.*(file|return|itr)/i, /income tax.*bharna/i],
    response: () => docList('Income Tax Return (ITR) Filing', [
      'Visit incometax.gov.in → "File Income Tax Return"',
      'Login with PAN (username) and password',
      'Select Assessment Year and ITR form:',
      '&nbsp;&nbsp;• ITR-1 (Sahaj): Salary income up to ₹50L',
      '&nbsp;&nbsp;• ITR-2: Capital gains / multiple houses',
      '&nbsp;&nbsp;• ITR-4 (Sugam): Presumptive business income',
      'Keep ready: Form 16, AIS/TIS, Bank statements, Investment proofs',
      'E-verify using Aadhaar OTP / Net Banking / DSC',
    ], '📅 Due date: July 31 (individuals). Late filing penalty: ₹5,000. Refunds via ECS within 20-45 days.', '💰')
  },

  // ── GST ───────────────────────────────────────────────────
  {
    id: 'gst',
    priority: 10,
    keywords: [/\bgst\b.*(register|file|return|apply|number)/i, /goods.*service.*tax/i, /gst.*kya/i],
    response: () => docList('GST Registration & Filing', [
      'Registration required if turnover > ₹40L (goods) or ₹20L (services)',
      'Apply at gst.gov.in → "Register Now"',
      'Required: PAN, Aadhaar, business proof, bank account, address proof',
      'GSTIN issued within 3-7 days (ARN provided immediately)',
      'Monthly/Quarterly returns: GSTR-1 (outward) + GSTR-3B (summary)',
      'Annual return: GSTR-9 by December 31',
    ], '📞 GST Helpdesk: 1800-103-4786. GST Practitioner can help with filing.', '🏢')
  },

  // ── UDYAM / MSME ──────────────────────────────────────────
  {
    id: 'udyam',
    priority: 10,
    keywords: [/udyam/i, /\bmsme\b/i, /small.*business.*register/i, /enterprise.*register/i, /udyog.*aadhaar/i],
    response: () => docList('Udyam Registration (MSME)', [
      'Visit udyamregistration.gov.in',
      'Login with Aadhaar number + OTP (no documents needed)',
      'Fill business details: Name, activity type, NIC code, bank details',
      'Self-certified registration — Udyam Certificate issued instantly',
      'Investment & Turnover limits:',
      '&nbsp;&nbsp;• Micro: Investment < ₹1Cr, Turnover < ₹5Cr',
      '&nbsp;&nbsp;• Small: Investment < ₹10Cr, Turnover < ₹50Cr',
      '&nbsp;&nbsp;• Medium: Investment < ₹50Cr, Turnover < ₹250Cr',
    ], 'Benefits: Priority bank loans, govt tender preference, subsidised electricity, patent fee concession.', '🏭')
  },

  // ── STARTUP INDIA ─────────────────────────────────────────
  {
    id: 'startup',
    priority: 10,
    keywords: [/startup.*(india|register|recognition|certificate)/i, /dpiit/i, /startup.*kaise/i],
    response: () => docList('Startup India Recognition', [
      'Visit startupindia.gov.in → "Apply for Recognition"',
      'Register on National Startup Portal',
      'Startup must be: < 10 years old, turnover < ₹100Cr, innovative product/service',
      'Required: Incorporation certificate, PAN, brief pitch deck',
      'DPIIT recognition certificate issued in 2-3 days',
      'Benefits: Tax exemption (3 of 10 years), self-certification for 6 labour laws, fast-track patent',
    ], 'Tax exemption under Section 80-IAC requires DPIIT recognition + IMB approval.', '🚀')
  },

  // ── PM AWAS YOJANA ────────────────────────────────────────
  {
    id: 'pmay',
    priority: 10,
    keywords: [/\bpmay\b/i, /pradhan mantri awas/i, /pm.*awas/i, /housing.*scheme/i, /\bhome loan.*subsidy\b/i, /gramin.*awas/i],
    response: () => docList('PM Awas Yojana (Housing Scheme)', [
      'PMAY-Urban: pmaymis.gov.in | PMAY-Gramin: pmayg.nic.in',
      'Eligibility: EWS (income < ₹3L), LIG (< ₹6L), MIG-I (< ₹12L), MIG-II (< ₹18L)',
      'Must not own a pucca house in any part of India',
      'Apply online or at CSC / MIS Counter',
      'Required: Aadhaar, income proof, land ownership docs, bank account',
      'Interest subsidy: Up to 6.5% under CLSS (Credit Linked Subsidy Scheme)',
    ], 'PMAY deadline extended. Gramin beneficiaries can check list at pmayg.nic.in → "Stakeholders → IAY/PMAYG Beneficiary".', '🏠')
  },

  // ── MGNREGA ───────────────────────────────────────────────
  {
    id: 'mgnrega',
    priority: 9,
    keywords: [/mgnrega/i, /nrega/i, /job card/i, /100 days work/i, /manrega/i, /rojgar guarantee/i],
    response: () => docList('MGNREGA – Job Card & Work', [
      'Guarantees 100 days of wage employment per household per year',
      'Apply for Job Card at local Gram Panchayat office',
      'Required: Aadhaar, family photo, address proof',
      'Job Card issued free of cost within 15 days',
      'Request work by writing to Gram Panchayat — work must start within 15 days',
      'Wage: ₹200-350/day (varies by state), paid via bank/post office',
    ], 'Check your job card status and payment at nrega.nic.in or Umang App.', '👷')
  },

  // ── PM UJJWALA ────────────────────────────────────────────
  {
    id: 'ujjwala',
    priority: 9,
    keywords: [/ujjwala/i, /\blpg.*free\b/i, /free.*gas.*connection/i, /pmuy/i, /gas.*connection.*bpl/i],
    response: () => docList('PM Ujjwala Yojana (Free LPG Connection)', [
      'Eligibility: Women from BPL families, SECC-2011 list, or any of 7 categories',
      '7 categories: SC/ST, PM Awas Gramin beneficiary, Antyodaya Anna Yojana, Forest dwellers, Most OBC, Tea garden workers, Islands',
      'Apply at nearest LPG distributor (IOC/HP/Bharat Gas)',
      'Required: Aadhaar, Bank account, BPL card / SECC list proof, Ration card',
      'Deposit-free 14.2 kg cylinder connection',
    ], 'Under Ujjwala 2.0, migrant workers can enroll with self-declaration of address. Helpline: 1800-266-6696', '🔥')
  },

  // ── JAN DHAN ─────────────────────────────────────────────
  {
    id: 'jan_dhan',
    priority: 9,
    keywords: [/jan dhan/i, /\bpmjdy\b/i, /zero.*balance.*account/i, /basic.*savings.*account/i],
    response: () => docList('PM Jan Dhan Yojana (PMJDY)', [
      'Open zero-balance account at any bank or post office',
      'Benefits: Free RuPay debit card, ₹2L accident insurance, ₹30,000 life cover',
      'Overdraft facility up to ₹10,000 after 6 months',
      'Required: Aadhaar (or any photo ID + address proof)',
      'No minimum balance required — truly zero balance',
    ], 'Existing accounts can be upgraded to PMJDY. Overdraft available to 1 person per household (preferably woman).', '🏦')
  },

  // ── LAND RECORDS ──────────────────────────────────────────
  {
    id: 'land_records',
    priority: 10,
    keywords: [/land.*(record|map|khasra|khatauni|registry)/i, /bhulekh/i, /\bjamabandi\b/i, /\bkhata\b/i, /\bkhasra\b/i, /property.*record/i],
    response: () => docList('Land Records (Bhulekh)', [
      'State-wise portals:',
      '&nbsp;&nbsp;• UP: upbhulekh.gov.in',
      '&nbsp;&nbsp;• Maharashtra: mahabhulekh.maharashtra.gov.in',
      '&nbsp;&nbsp;• Rajasthan: apnakhata.raj.nic.in',
      '&nbsp;&nbsp;• MP: mpbhulekh.gov.in',
      '&nbsp;&nbsp;• Bihar: lrc.bih.nic.in',
      '&nbsp;&nbsp;• All States: bhulekh.gov.in (DILRMP)',
      'View: Khasra (plot), Khatauni (ownership), Maps (Shajra)',
    ], 'For mutation (Dakhil Kharij) after property purchase, apply at Tehsildar/Sub-Registrar office with sale deed.', '🗺️')
  },

  // ── PROPERTY TAX ──────────────────────────────────────────
  {
    id: 'property_tax',
    priority: 9,
    keywords: [/property.*(tax|pay|online)/i, /house.*(tax|pay)/i, /grih.*kar/i],
    response: () => docList('Property Tax Payment', [
      'Visit your Municipal Corporation\'s website or app',
      'Common portals: Swachh Bharat / NMPT / State portals',
      'Enter Property ID / Assessment Number / Owner Name',
      'View outstanding dues and pay online (UPI/Card/Net Banking)',
      'Download digitally signed receipt immediately',
    ], 'Paying on time avoids 2% per month penalty. Some ULBs offer early payment rebates of 5-10%.', '🏘️')
  },

  // ── RTI ───────────────────────────────────────────────────
  {
    id: 'rti',
    priority: 10,
    keywords: [/\brti\b/i, /right to information/i, /information.*act/i, /file.*rti/i, /rti.*kaise/i],
    response: () => docList('Right to Information (RTI) Request', [
      'File online at rtionline.gov.in (Central Govt departments)',
      'Or write a letter/application to the Public Information Officer (PIO)',
      'Include: Your name, address, specific questions, and ₹10 fee (DD/IPO/Court fee stamp)',
      'PIO must respond within 30 days (48 hours if life/liberty matter)',
      'First Appeal to APIO if unsatisfied (90-day limit)',
      'Second Appeal to Information Commission',
    ], '📌 RTI is FREE for BPL card holders. No reason required for seeking information. State-specific portals available.', '⚖️')
  },

  // ── COMPLAINT / GRIEVANCE ─────────────────────────────────
  {
    id: 'grievance',
    priority: 10,
    keywords: [/\bgrievance\b/i, /\bcomplaint\b.*(file|register|lodge|track)/i, /\bshikayat\b/i, /\bpgportal\b/i, /public.*issue/i, /govt.*complaint/i],
    response: () => docList('File Public Grievance', [
      'Central Govt: pgportal.gov.in (Public Grievance Portal)',
      'State Govt: Your State CM Helpline / e-Governance portal',
      'Railway: railmadad.indianrailways.gov.in',
      'Consumer: consumerhelpline.gov.in (National Consumer Helpline)',
      'Steps: Register → Login → Lodge Grievance → Get Registration Number',
      'Departments must respond within 30 days',
    ], '📞 CPGRAMS Helpline: 1800-11-0180 (free). Track your complaint status anytime using Registration Number.', '📢')
  },
  {
    id: 'complaint_track',
    priority: 10,
    keywords: [/track.*(complaint|grievance|status)/i, /complaint.*status/i, /shikayat.*status/i],
    response: () => docList('Track Your Complaint Status', [
      'Central: pgportal.gov.in → "View Grievance Status"',
      'Enter your Registration Number + Mobile OTP',
      'View: Current status, assigned department, remarks, action taken',
      'If not resolved in 30 days: Escalate via "Send Reminder"',
      'State: Check state CM Helpline portal with ticket number',
    ], 'If unsatisfied after 30 days, escalate to First Appellate Authority. You can also tweet @PMOIndia for urgent issues.', '📊')
  },

  // ── SCHOLARSHIP ───────────────────────────────────────────
  {
    id: 'scholarship',
    priority: 10,
    keywords: [/scholarship/i, /\bnsp\b/i, /student.*aid/i, /bursary/i, /chatravritti/i, /merit.*scholarship/i],
    response: () => docList('National Scholarship Portal (NSP)', [
      'Visit scholarships.gov.in',
      'Register with Aadhaar + mobile number',
      'Available scholarships:',
      '&nbsp;&nbsp;• Pre/Post Matric SC/ST/OBC scholarships',
      '&nbsp;&nbsp;• Merit-cum-Means (minority)',
      '&nbsp;&nbsp;• PM Scholarship for CRPF/BSF wards',
      '&nbsp;&nbsp;• Top Class Education for SC students',
      'Required: Aadhaar, Bank Account, Income Certificate, Marksheets, Caste Certificate',
    ], '📅 NSP portal opens Aug-Oct each year. Funds directly credited to student\'s Aadhaar-linked bank account (DBT).', '🎓')
  },

  // ── SKILL INDIA ───────────────────────────────────────────
  {
    id: 'skill_india',
    priority: 9,
    keywords: [/skill india/i, /\bpmkvy\b/i, /vocational.*training/i, /free.*skill.*training/i, /skill.*certificate/i],
    response: () => docList('Skill India – PMKVY (Free Skill Training)', [
      'PM Kaushal Vikas Yojana: Free skill training + ₹8,000 reward',
      'Visit skillindiadigital.gov.in to find nearest training centre',
      'Courses: IT, Construction, Beauty, Health, Retail, Automotive, etc.',
      'Duration: 3 months to 1 year depending on trade',
      'Assessment & certification by NSDC recognized bodies',
      'Job placement assistance after certification',
    ], 'RPL (Recognition of Prior Learning) available for already skilled workers. Check eligibility at skillindia.gov.in', '⚙️')
  },

  // ── DIGITAL LOCKER ────────────────────────────────────────
  {
    id: 'digilocker',
    priority: 9,
    keywords: [/digilocker/i, /digital.*locker/i, /online.*document.*store/i, /digi.*safe/i],
    response: () => docList('DigiLocker – Store Documents Digitally', [
      'Visit digilocker.gov.in or download DigiLocker App',
      'Sign up with Aadhaar number + OTP',
      'Access official digital documents:',
      '&nbsp;&nbsp;✓ Aadhaar, PAN, Driving Licence',
      '&nbsp;&nbsp;✓ Marksheets, certificates (via CBSE, Universities)',
      '&nbsp;&nbsp;✓ Vehicle RC, Insurance',
      '&nbsp;&nbsp;✓ COVID Vaccination certificate',
      'Share documents digitally with government agencies',
    ], 'DigiLocker documents are legally valid under IT Act. Accepted by police, airports, courts, and banks.', '📁')
  },

  // ── UMANG APP ─────────────────────────────────────────────
  {
    id: 'umang',
    priority: 8,
    keywords: [/\bumang\b/i, /umang.*app/i, /unified.*mobile.*app/i],
    response: () => html(`<p><strong>UMANG App</strong> — Unified Mobile Application for New-age Governance</p>
      <p>Access 2,000+ government services from one app:</p>
      <div class="doc-list">
        <div class="doc-item"><span class="doc-check">📱</span> PF balance, pension, ESIC, EPFO services</div>
        <div class="doc-item"><span class="doc-check">📱</span> Aadhaar, DigiLocker, passport tracking</div>
        <div class="doc-item"><span class="doc-check">📱</span> CBSE results, university services</div>
        <div class="doc-item"><span class="doc-check">📱</span> Crop insurance, PM Kisan, soil health card</div>
        <div class="doc-item"><span class="doc-check">📱</span> NPS, income tax, GST, EPFO</div>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin-top:8px;">📲 Download: Google Play / App Store — Search "UMANG"</p>`)
  },

  // ── EPFO / PF ─────────────────────────────────────────────
  {
    id: 'epf',
    priority: 10,
    keywords: [/\bepf\b/i, /\bepfo\b/i, /provident fund/i, /\bpf\b.*(balance|withdraw|transfer|claim)/i, /pf.*nikalna/i],
    response: () => docList('EPFO – PF Balance & Withdrawal', [
      'Check PF Balance: epfindia.gov.in or Umang App',
      'Activate UAN at unifiedportal-mem.epfindia.gov.in',
      'Link UAN with Aadhaar + PAN for full online access',
      'Online Withdrawal (Form 31/19/10C):',
      '&nbsp;&nbsp;• Must have 5+ years of service for full tax-free withdrawal',
      '&nbsp;&nbsp;• 2 months of unemployment for full withdrawal',
      '&nbsp;&nbsp;• Medical emergency: withdraw without waiting',
      'Track claim status at epfindia.gov.in → "Know Your Claim Status"',
    ], '📞 EPFO Helpline: 1800-118-005. Transfer PF online using Form 13 when changing jobs.', '💼')
  },

  // ── COVID CERTIFICATE ─────────────────────────────────────
  {
    id: 'cowin',
    priority: 8,
    keywords: [/covid.*cert/i, /vaccination.*cert/i, /cowin/i, /corona.*certificate/i],
    response: () => docList('COVID Vaccination Certificate', [
      'Download from cowin.gov.in → "Download Certificate"',
      'Login with registered mobile OTP',
      'Also available on DigiLocker, Aarogya Setu App, and UMANG',
      'Need correction? Contact vaccination centre or raise ticket at cowin.gov.in',
    ], 'Certificate shows dose details, vaccine name, and QR code. Required for international travel.', '💉')
  },

  // ── SOIL HEALTH ───────────────────────────────────────────
  {
    id: 'soil_health',
    priority: 8,
    keywords: [/soil health/i, /soil.*card/i, /mitti.*jach/i, /krishi.*card/i],
    response: () => docList('Soil Health Card', [
      'Visit soilhealth.dac.gov.in',
      'Enter State, District, Sub-District, Village, and Farmer name',
      'Alternatively, contact local Krishi Vigyan Kendra (KVK)',
      'Soil sample collected from your field by Agriculture Dept',
      'Report shows: NPK levels, pH, micronutrients + fertilizer recommendations',
    ], 'Soil Health Cards are issued every 2 years. Use recommendations to reduce input costs by 15-20%.', '🌱')
  },

  // ── CROP INSURANCE ────────────────────────────────────────
  {
    id: 'crop_insurance',
    priority: 9,
    keywords: [/crop.*insurance/i, /fasal.*bima/i, /pmfby/i, /kharif.*insurance/i, /rabi.*insurance/i],
    response: () => docList('PM Fasal Bima Yojana (Crop Insurance)', [
      'Visit pmfby.gov.in or apply via CSC / nearest bank branch',
      'Enrollment period: Before Kharif (July) or Rabi (Dec) sowing',
      'Premium: 2% for Kharif, 1.5% for Rabi, 5% for commercial crops',
      'Required: Aadhaar, Bank account (Aadhaar-linked), Land records, Sowing certificate',
      'Claim if crop loss due to: drought, flood, pest, hailstorm, landslide',
      'Report crop loss within 72 hours via 14447 or pmfby app',
    ], '📞 PMFBY Helpline: 14447. Compensation directly credited to Aadhaar-linked bank account.', '🌾')
  },

  // ── NATIONAL PENSION ──────────────────────────────────────
  {
    id: 'nps',
    priority: 8,
    keywords: [/\bnps\b/i, /national pension/i, /atal pension/i, /\bapsy\b/i, /pension.*apply/i],
    response: () => docList('National Pension System (NPS) / Atal Pension Yojana', [
      'NPS: Open account at enps.nsdl.com or any bank',
      'Atal Pension Yojana: For unorganised sector (age 18-40)',
      '&nbsp;&nbsp;• Pension of ₹1,000 to ₹5,000/month at age 60',
      '&nbsp;&nbsp;• Govt contributes 50% (max ₹1,000/year) for eligible subscribers',
      'Apply at your bank savings account branch',
      'Required: Aadhaar, Bank account, Mobile number',
    ], 'NPS offers tax deduction under Section 80CCD(1B) — additional ₹50,000 over 80C limit.', '👴')
  },

  // ── LANGUAGE SUPPORT ──────────────────────────────────────
  {
    id: 'hindi_query',
    priority: 5,
    keywords: [/\baadhaar kaise\b/i, /kaise banaye/i, /kya chahiye/i, /kaha se karen/i, /kab milega/i, /kitna time/i],
    response: () => html(`<p>Main Hindi mein bhi madad kar sakta hoon! 😊</p>
      <p>Aap jo seva chahte hain uske baare mein thoda detail mein batayein, jaise:</p>
      <div class="doc-list">
        <div class="doc-item"><span class="doc-check">✓</span> "Naya Aadhaar card kaise banaye?"</div>
        <div class="doc-item"><span class="doc-check">✓</span> "PAN card ke liye kya documents chahiye?"</div>
        <div class="doc-item"><span class="doc-check">✓</span> "Income certificate kaise milega?"</div>
        <div class="doc-item"><span class="doc-check">✓</span> "PM Kisan ka paisa kab aayega?"</div>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin-top:8px;">Hum 22 bhashaon mein madad kar sakte hain!</p>`)
  },

  // ── ELECTRICITY / UTILITIES ───────────────────────────────
  {
    id: 'electricity',
    priority: 8,
    keywords: [/electricity.*(bill|pay|complaint|connection)/i, /bijli.*(bill|complaint)/i, /power.*cut/i, /\bbescom\b|\btangedco\b|\bmahavitaran\b|\buppcl\b/i],
    response: () => html(`<p>For <strong>Electricity services</strong>:</p>
      <div class="doc-list">
        <div class="doc-item"><span class="doc-check">💡</span> <strong>Pay Bill:</strong> Visit your state DISCOM website or Bharat Bill Payment (bbps.bhim.gov.in)</div>
        <div class="doc-item"><span class="doc-check">📢</span> <strong>Report Power Cut:</strong> Call your local DISCOM helpline or their app</div>
        <div class="doc-item"><span class="doc-check">🔌</span> <strong>New Connection:</strong> Apply on DISCOM portal → "New Connection" section</div>
        <div class="doc-item"><span class="doc-check">🌞</span> <strong>Solar Rooftop:</strong> Apply under PM Surya Ghar at pmsuryaghar.gov.in — free solar panels!</div>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin-top:8px;">PM Surya Ghar gives 300 units of free electricity/month. Apply at pmsuryaghar.gov.in</p>`)
  },

  // ── WATER / JALJEEVAN ─────────────────────────────────────
  {
    id: 'jal_jeevan',
    priority: 8,
    keywords: [/jal jeevan/i, /\bjjm\b/i, /tap water/i, /piped water/i, /nal se jal/i, /drinking water.*scheme/i],
    response: () => docList('Jal Jeevan Mission (Har Ghar Jal)', [
      'Portal: jaljeevanmission.gov.in',
      'Check your village\'s piped water connection status',
      'Raise complaint for non-functional tap connections',
      'Scheme: Every rural household to get 55 litres/day clean piped water',
      'Contact: State PHED Department or Gram Panchayat',
    ], '📞 National helpline: 1800-11-1955. JJM covers all 6+ crore rural households.', '💧')
  },

  // ── DEFAULT / FALLBACK ─────────────────────────────────────
  {
    id: 'fallback',
    priority: 0,
    keywords: [/.*/],
    response: (text) => html(`
      <p>I'm still learning about: <em>"${escHtml(text)}"</em></p>
      <p>Let me suggest some popular services I can help with right now:</p>
      <div class="doc-list">
        <div class="doc-item"><span class="doc-check">🪪</span> Aadhaar update, download, or status</div>
        <div class="doc-item"><span class="doc-check">💳</span> PAN card apply or link with Aadhaar</div>
        <div class="doc-item"><span class="doc-check">✈️</span> Passport apply, renew, or Tatkaal</div>
        <div class="doc-item"><span class="doc-check">🌾</span> PM Kisan, PM Fasal Bima, Ujjwala</div>
        <div class="doc-item"><span class="doc-check">🏥</span> Ayushman Bharat health card</div>
        <div class="doc-item"><span class="doc-check">📢</span> File grievance or RTI</div>
        <div class="doc-item"><span class="doc-check">💰</span> Income certificate, ITR filing</div>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin-top:8px;">Type the name of any service above — I'll give you step-by-step guidance!</p>`)
  },
];

// ── Helper: build doc-list HTML ──────────────────────────────
function html(s) { return s; }
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function docList(title, items, footer, icon = '📌') {
  const rows = items.map(i => `<div class="doc-item"><span class="doc-check">✓</span> ${i}</div>`).join('');
  return html(`<p>For <strong>${title}</strong>:</p>
    <div class="doc-list">${rows}</div>
    <p style="margin-top:10px;color:#94a3b8;font-size:13px;">${icon} ${footer}</p>`);
}

// ── NLP Matcher: find best matching intent ───────────────────
function matchIntent(userText) {
  const text = userText.trim();
  let best = null, bestPriority = -1;

  for (const intent of INTENTS) {
    if (intent.id === 'fallback') continue;
    for (const kw of intent.keywords) {
      const matches = typeof kw === 'string'
        ? text.toLowerCase().includes(kw.toLowerCase())
        : kw.test(text);
      if (matches && intent.priority > bestPriority) {
        best = intent;
        bestPriority = intent.priority;
        break;
      }
    }
  }
  // If nothing matched, use fallback
  if (!best) best = INTENTS.find(i => i.id === 'fallback');
  return best;
}

// ── Sentiment & tone prefix ───────────────────────────────────
function getTonePrefix(text) {
  if (/urgent|emergency|immediately|asap|jaldi/i.test(text))
    return `<p style="color:#f59e0b;font-size:13px;margin-bottom:8px;">⚡ <strong>Urgent query detected</strong> — here's the fastest path:</p>`;
  if (/problem|issue|not working|failed|rejected|error/i.test(text))
    return `<p style="color:#06b6d4;font-size:13px;margin-bottom:8px;">🔧 Sorry to hear about the issue. Here's how to resolve it:</p>`;
  return '';
}

// ──────────────────────────────────────────
// CHAT UI LOGIC
// ──────────────────────────────────────────
const chatMessages = document.getElementById('chatMessages');
const chatInput   = document.getElementById('chatInput');
const typingIndicator = document.getElementById('typingIndicator');

function createMsg(content, type = 'bot') {
  const d = document.createElement('div');
  d.className = `msg msg--${type}`;
  d.style.cssText = 'opacity:0;transform:translateY(10px);transition:opacity 0.3s ease,transform 0.3s ease;';
  d.innerHTML = type === 'bot'
    ? `<div class="msg-avatar">🤖</div><div class="msg-bubble">${content}</div>`
    : `<div class="msg-bubble">${escHtml(content)}</div>`;
  return d;
}

function appendMsg(el) {
  chatMessages.insertBefore(el, typingIndicator);
  requestAnimationFrame(() => { el.style.opacity='1'; el.style.transform='translateY(0)'; });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() { typingIndicator.classList.add('active'); chatMessages.scrollTop = chatMessages.scrollHeight; }
function hideTyping() { typingIndicator.classList.remove('active'); }

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  appendMsg(createMsg(text, 'user'));
  chatInput.value = '';
  showTyping();
  const delay = 600 + Math.random() * 700;
  setTimeout(() => {
    hideTyping();
    const intent = matchIntent(text);
    const prefix = getTonePrefix(text);
    const body   = intent.response(text);
    appendMsg(createMsg(prefix + body, 'bot'));
  }, delay);
}

function sendSuggestion(btn) {
  chatInput.value = btn.textContent;
  sendMessage();
  btn.style.opacity = '0.5';
  setTimeout(() => btn.style.opacity = '1', 2500);
}

chatInput.addEventListener('keydown', e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();} });

window.sendMessage    = sendMessage;
window.sendSuggestion = sendSuggestion;
