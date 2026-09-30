const canvasIds = ['ecg', 'ppg', 'heroEcg', 'heroPpg'];

const state = {
  hr: 76,
  pulse: 75,
  quality: 94,
  stable: true,
  stream: null,
};

const hrEl = document.getElementById('hr');
const pulseEl = document.getElementById('pulse');
const qualityEl = document.getElementById('quality');
const cameraEl = document.getElementById('camera');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');

async function fetchDashboardMetrics() {
  try {
    const response = await fetch('/api/dashboard');
    if (!response.ok) throw new Error('API error');

    const data = await response.json();
    const { metrics } = data;

    state.hr = metrics.ecgHeartRate;
    state.pulse = metrics.ppgPulseRate;
    state.quality = metrics.ppgQuality;
    state.stable = metrics.trend === 'Stable';
    updateMetrics();
  } catch (error) {
    console.warn('Using fallback demo metrics.', error);
    randomizeMetrics();
  }
}

function setupCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const ctx = canvas.getContext('2d');
  const w = canvas.clientWidth || 300;
  const h = canvas.clientHeight || 140;

  canvas.width = w * ratio;
  canvas.height = h * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, w, h };
}

function drawSignalWave(canvas, color, offset = 0, amplitude = 20, speed = 0.06) {
  const { ctx, w, h } = setupCanvas(canvas);
  const centerY = h / 2 + offset;

  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  for (let x = 0; x <= w; x += 2) {
    const y = centerY + Math.sin((x * speed) + offset) * amplitude + Math.sin((x * 0.03) + offset * 2) * (amplitude * 0.3);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}

function animateWavePanels() {
  canvasIds.forEach((id) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const hue = id.includes('Ecg') || id === 'ecg' ? '#8cf1ff' : '#ffd36f';
    const offset = id.includes('hero') ? (id.includes('Ppg') || id === 'ppg' ? 12 : -12) : 0;
    const amplitude = id.includes('hero') ? 18 : 14;
    const multiplier = id.includes('hero') ? 0.08 : 0.06;

    drawSignalWave(canvas, hue, offset, amplitude, multiplier + (Math.random() * 0.04));
  });

  requestAnimationFrame(animateWavePanels);
}

function updateMetrics() {
  hrEl.textContent = state.hr;
  pulseEl.textContent = state.pulse;
  qualityEl.textContent = state.quality;
}

function randomizeMetrics() {
  state.hr = Math.max(68, Math.min(90, state.hr + (Math.random() > 0.5 ? 1 : -1)));
  state.pulse = Math.max(66, Math.min(88, state.pulse + (Math.random() > 0.5 ? 1 : -1)));
  state.quality = Math.max(90, Math.min(99, state.quality + (Math.random() > 0.5 ? 1 : -1)));
  updateMetrics();
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    cameraEl.src = '';
    cameraEl.poster = '';
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });

    state.stream = stream;
    cameraEl.srcObject = stream;
    cameraEl.play();
  } catch (error) {
    console.warn('Camera permission denied or unavailable:', error);
  }
}

function stopCamera() {
  if (state.stream) {
    state.stream.getTracks().forEach((track) => track.stop());
    state.stream = null;
  }

  if (cameraEl) {
    cameraEl.srcObject = null;
  }
}

startBtn?.addEventListener('click', startCamera);
stopBtn?.addEventListener('click', stopCamera);

window.addEventListener('resize', () => {
  canvasIds.forEach((id) => {
    const canvas = document.getElementById(id);
    if (canvas) {
      setupCanvas(canvas);
    }
  });
});

updateMetrics();
animateWavePanels();
fetchDashboardMetrics();
setInterval(fetchDashboardMetrics, 2500);
