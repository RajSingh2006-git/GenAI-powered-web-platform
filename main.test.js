/**
 * @jest-environment jsdom
 */
document.body.innerHTML = `
  <canvas id="bgCanvas"></canvas>
  <div id="navbar"></div>
  <ul id="navLinks"></ul>
  <button id="hamburger"></button>
  <div id="chatMessages"></div>
  <input id="chatInput" />
  <div class="hero-stats"></div>
`;

window.HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  createRadialGradient: () => ({ addColorStop: jest.fn() }),
});

window.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

const { matchIntent, INTENTS } = require('./main.js');

describe('Smart Bharat AI Engine Tests', () => {
  test('Greeting intent matches correctly', () => {
    const result = matchIntent('namaste');
    const htmlOutput = result.response();
    expect(htmlOutput).toContain('Namaste!');
    expect(htmlOutput).toContain('Bharat AI');
  });

  test('Aadhaar download intent matches correctly', () => {
    const result = matchIntent('how to download aadhaar card');
    const htmlOutput = result.response();
    expect(htmlOutput).toContain('Download e-Aadhaar');
    expect(htmlOutput).toContain('myaadhaar.uidai.gov.in');
  });

  test('Fallback intent works', () => {
    const text = 'xyz unknown query abc';
    const result = matchIntent(text);
    const htmlOutput = result.response(text);
    expect(htmlOutput).toContain("I'm still learning about: ");
  });
});
